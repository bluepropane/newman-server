const http = require('http');
const newman = require('newman');

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

http
  .createServer(async function (req, res) {
    const collection = await extractData(req);
    const [err, summary] = await runCollection(collection);
    const success = !err && summary.error && result.run.failures.length === 0;

    if (success) {
      res.end();
    } else {
      res.writeHead(400).end();
    }
  })
  .listen(port);

console.log(`[newman-server] Listening on port ${port}`);
