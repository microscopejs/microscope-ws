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
	this.server = options.server;
	this.io = IO(this.server);
	this._boot();
	this.initialize.apply(this, arguments);
}

_.extend(WsApplication.prototype, {

	appRoot: null,
	hubsRoot: ['/hubs/'],

	initialize: function () {},

	_loadModulesFromFolder: function (folderpath, options) {
		var files = [];
		try{
			var files = fs.readdirSync(folderpath);
		}catch(e){
			return;
		}
		files.forEach(function (file) {
			if (path.extname(file) === '.js') {
				var Module = require(folderpath + file);
				var m = new Module(options);
			}
		});
	},

	// boot controller & api
	_boot: function () {
		for (var i = 0; i < this.hubsRoot.length; i++) {
			var ctrlPath = path.join(this.appRoot, this.hubsRoot[i]);
			this._loadModulesFromFolder(ctrlPath, {io: this.io});
		};
	}
});

WsApplication.extend = utils.extend;

module.exports = WsApplication;