var http = require('http');

var count = 0;
var handleRequest = function(request, response) {
  response.writeHead(200);
  response.end(count.toFixed(0));
  count++;
};
var helloServer = http.createServer(handleRequest);
helloServer.listen(8080);