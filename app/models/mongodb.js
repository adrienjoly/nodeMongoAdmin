/**
 * mongodb model
 * wraps a accessor to collections of a mongodb database
 * @author adrienjoly
 **/

GLOBAL.DEBUG = true;

var util = require('util');
var driver = require('node-mongodb-native/lib/mongodb');
//var BSON = driver.BSONPure; //driver.BSONNative;

var host = process.env['DOTCLOUD_DB_MONGODB_HOST'] || process.env['MONGO_NODE_DRIVER_HOST'] || 'localhost';
var port = process.env['DOTCLOUD_DB_MONGODB_PORT'] || process.env['MONGO_NODE_DRIVER_PORT'] || driver.Connection.DEFAULT_PORT;
var user = process.env['DOTCLOUD_DB_MONGODB_LOGIN'];
var pass = process.env['DOTCLOUD_DB_MONGODB_PASSWORD'];

util.log('MongoDB client module is starting...');

exports.collections = {};

var callbacks = [];
var ready = false;

exports.onReady = function (callback) {
	if (ready)
		callback();
	else
		callbacks.push(callback);
};

exports.init = function (dbname, readyCallback) {
	util.log("Connecting to MongoDB/" + dbname + " @ " + host + ":" + port + "...");

	var server = new driver.Server(host, port, {auto_reconnect:true});
	var db = new driver.Db(dbname, server, {native_parser:false /*, strict:true*/});

	db.addListener('error', function(e){
		util.log("MongoDB error: " + e);
	});

	exports.ObjectID = db.bson_serializer.ObjectID;
	exports.ObjectId = exports.ObjectID.createFromHexString;

	// http://www.mongodb.org/display/DOCS/Object+IDs#ObjectIDs-DocumentTimestamps
	exports.dateToHexObjectId = function (t) {
		var t = Math.round(t.getTime() / 1000); // turn into seconds
		t = t.toString(16); // translate into hexadecimal representation
		t = t + "0000000000000000"; // add null values for 8 other bytes
		while (t.length < 2 * 12) // pad with leading zeroes, to reach 12 bytes
			t = '0' + t;
		return t;
	};
	
	db.open(function(err, db) {
		if (err) throw err;
		util.log("Connected to MongoDB, authenticating...");

		db.authenticate(user, pass, function(){
			util.log("Successfully connected to MongoDB/" + dbname + " @ " + host + ":" + port);
			
			var finishInit = function() {
				util.log("MongoDB model is now ready for queries!");
				if (readyCallback)
					readyCallback(exports.collections);
				for (var i in callbacks)
					callbacks[i]();
				ready = true;
			};

			// diagnostics and collection caching
			db.collections(function(err, collections) {
				if (err) util.log("MongoDB Error : " + err);
				else {
					var remaining = collections.length;
					util.log("found " + remaining + " collections in db");
					if (remaining == 0)
						finishInit();
					else
						for (var i in collections) {
							var queryHandler = function () {
								var table = collections[i].collectionName;
								return function(err, result) {
									util.log(" - " + table + " : " + result + " rows");
									db.collection(table, function(err, col) {
										exports.collections[table] = col;
										if (0 == --remaining) finishInit();
									});
								};
							}();
							collections[i].count(queryHandler);
						}
				}
			});
		});
	});
}
