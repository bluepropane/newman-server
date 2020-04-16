const http = require('http');
const newman = require('newman');
const util = require('util');

const listeners = {};

function interceptStdout() {
  process.stdout.write = (function (write) {
    return (...args) => {
      write.apply(process.stdout, args);
      Object.values(listeners).forEach((l) => l(...args));
    };
  })(process.stdout.write);
}

const port = process.env.NEWMAN_PORT || 8080;

function extractData(req) {
  return new Promise((res) => {
    const data = [];
    req.on('data', (chunk) => {
      data.push(chunk);
    });
    req.on('end', () => {
      res(JSON.parse(data.join('')));
    });
  });
}

function runCollection(collection) {
  return new Promise((res) => {
    newman.run(
      {
        collection,
        reporters: 'cli',
      },
      (err, summary) => res([err, summary])
    );
  });
}

interceptStdout();
http
  .createServer(async function (req, res) {
    const listenerId = Date.now();
    const resultArr = [];
    listeners[listenerId] = (string) => {
      resultArr.push(string);
    };
    const collection = await extractData(req);
    const [err, summary] = await runCollection(collection);
    const success = !err && summary.error && result.run.failures.length === 0;
    delete listeners[listenerId];
    const result = util.format('\n' + resultArr.join('') + '\n');

    if (success) {
      res.end(result);
    } else {
      res.writeHead(400).end(result);
    }
  })
  .listen(port);
