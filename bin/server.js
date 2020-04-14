const http = require('http');
const newman = require('newman');

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
    // console.log(err, result);
    const success = !err && summary.error && result.run.failures.length === 0;

    if (success) {
      res.end(); //end the response
    } else {
      res.writeHead(400).end();
    }
  })
  .listen(8080); //the server object listens on port 8080
