const http = require('http'),
    url = require('url'),
    fs = require('fs');

http.createServer((request, response) => {
  var addr = request.url,
    q = url.parse(addr, true),
    filePath = '';
  // parse url
  if (q.pathname.includes('documentation')){
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }

  // Add log of each request to the server
  fs.appendFile('./log.txt', 'URL = ' + addr + '\nts = ' +
  new Date() + '\n\n', function(err){
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  })

  // read and return page
  console.log(filePath);
  fs.readFile(filePath, function(err, data) {
    if (err) {
      throw err;
    }

    // send response to the request
    response.writeHead(200, {'content-type': 'plain-text'});
    response.write(data);
    response.end();
  })

}).listen(8080);

console.log('Node server is running on Port 8080');
