var http = require('http');
var fs = require('fs');

var devMode = false;

for(var i in process.argv) {
	console.log("command line parameter #" + i + " : " + process.argv[i]);
	if (process.argv[i] == "--dev")
		devMode = true;
}

try {
	var dotCloudConfigFile = "/home/dotcloud/environment.json";
	var config = JSON.parse(fs.readFileSync(dotCloudConfigFile));
	console.log("Parsing "+dotCloudConfigFile+"...");
	for (var i in config) {
		console.log("Setting env " + i + " = " + config[i]);
		process.env[i] = config[i];
	}
}
catch (e) {}

http.IncomingMessage.prototype.logToConsole = function(suffix, params) {
	suffix = suffix ? "(" + suffix + ")" : "";
	console.log("===\n",
		(new Date()).toUTCString(),
		this.connection.remoteAddress + ": " + this.method + " " + this.url.split("?")[0],
		suffix, params || '');
}

var dbName = "whyd_freebase";

//init db first
require('./app/models/mongodb').init(dbName, function(){
	console.log("Starting web server...");
	var Application = require('my/http').Application;
	new Application(__dirname, devMode).start();
});
