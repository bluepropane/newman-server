const http = require('http');
const newman = require('newman');

function extractData(req) {
  return new Promise((res) => {
    const data = [];
    req.on('data', (chunk) => {
      data.push(chunk);
    });
    req.on('end', () => {
      res(JSON.parse(data));
    });
  });
}

function runCollection(collection) {
  return newman.run(
    {
      collection,
      reporters: 'cli',
    },
    function (err) {
      if (err) {
        throw err;
      }
      console.log(arguments);
      console.log('collection run complete!');
    }
  );
}

http
  .createServer(async function (req, res) {
    const collection = await extractData(req);
    await runCollection(collection);
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080
