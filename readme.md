microscope-ws
=============

microscope websocket WsApplication class and Hubs

WsApplication
-------------

#### Sample (Application.js):

Define basic WsApplication class.

``` js

// Imports
var WsApplication = require('../libs/WsApplication');

// WsApplication class
var Application = WsApplication.extend({
	appRoot: __dirname,
	initialize: function () {}
});

module.exports = Application;

```

#### Sample (./bin/www):

Run basic http server and instantiate WsApplication with server in constructor param

``` js

// Imports
var fs          = require('fs');
var path        = require('path');
var http        = require('http');
var Application = require('../Application');

// create simple http server and serve html file.
var server = http.createServer(function (request, response) {
	var filePath = path.join(__dirname + '/../index.html');
	fs.readFile(filePath, function (err, html) {
		if (err) { throw err; }
		response.writeHeader(200, {"Content-Type": "text/html"});  
		response.write(html);  
		response.end();  
	});
});

// create microscope WsApplication attach to server
var application = new Application({ server: server });

//run server
server.listen(3000);

```