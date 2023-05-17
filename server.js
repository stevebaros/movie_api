const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer((request, response) => {
  let addr = 'http://localhost:8080/documentation';
  let q = url.parse(addr, true);
  filePath = '';


  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write(data);
    response.end('Hello Node!');
  });

}).listen(8080);

console.log('My first Node test server is running on Port 8080.');
