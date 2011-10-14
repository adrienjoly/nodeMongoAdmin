var fs = require("fs");

var config = fs.readFileSync("/home/dotcloud/environment.json");

console.log(config);


require('http').createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  output = "Hello World!\n";
  for (k in request.headers) {
    output += k + '=' + request.headers[k] + '\n';
  }
  output += config;
  response.end(output);
}).listen(8080);