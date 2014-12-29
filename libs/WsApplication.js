/**
* Imports.
*/
var fs      = require('fs');
var path    = require('path');
var IO      = require('socket.io')
var _       = require('lodash');
var utils   = require('./utils');

/**
 * WsApplication class.
 */
function WsApplication (options) {
	options || (options = {});
	if(!options.server){ throw new Error('WsApplication require constructor with http server object'); }
	this.server = options.server;
	this.io = IO(this.server);
	this._boot();
	this.initialize.apply(this, arguments);
}

_.extend(WsApplication.prototype, {

	appRoot: null,
	hubsRoot: ['/hubs/'],

	initialize: function () {},

	_loadHubs: function (folderpath) {
		var self = this;
		var files = [];
		try{
			var files = fs.readdirSync(folderpath);
		}catch(e){
			return;
		}
		files.forEach(function (file) {
			if (path.extname(file) === '.js') {
				var HubClass = require(folderpath + file);
				self.io.of(HubClass.prototype.namespace).on('connection', function (socket) {
					self.onConnection(HubClass.prototype.namespace);
					var instance = new HubClass({io: self.io, socket: socket});
					socket.on('disconnect', self.onDisconnect.bind(self, HubClass.prototype.namespace));
				});
			}
		});
	},

	// boot hubs
	_boot: function () {
		for (var i = 0; i < this.hubsRoot.length; i++) {
			var hubPath = path.join(this.appRoot, this.hubsRoot[i]);
			this._loadHubs(hubPath);
		};
	},

    onConnection: function (namespace) {
        console.log('user connected to namespace : ' + namespace);
    },

    onDisconnect: function (namespace) {
        console.log('user disconnected from namespace : ' + namespace);
    },
});

WsApplication.extend = utils.extend;

module.exports = WsApplication;