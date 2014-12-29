// Imports
var _     = require('lodash');
var utils = require('./utils');

// WebSocket Hub Class
function Hub (options) {
    options || (options = {});
    if(options.io) this.io = options.io;
    if(options.socket) this.socket = options.socket;
    if(options.namespace) this.namespace = options.namespace;
    if(!this.io){ throw new Error('Hub class require constructor with io object'); }
    if(!this.socket){ throw new Error('Hub class require constructor with socket object'); }
    this._parseRoutes();
    this.initialize.apply(this, arguments);
}

_.extend(Hub.prototype, {

    namespace: '/',
    
    initialize: function(){},

    _parseRoutes: function () {
        if(!this.routes) return;
        this.routes = _.result(this, 'routes');

        for (var key in this.routes) {
            this._parseRoute(key);
        }
    },

    _parseRoute: function (key) {
        if(!_.isFunction(this[this.routes[key]])) return;
        this.socket.on(key, this[this.routes[key]].bind(this));
    },

    emit: function (key, obj) {
        this.socket.emit(key, obj);
    },

    emitToRoom: function (room, key, obj) {
        this.socket.to(room).emit(key, obj);
    },

    broadcast: function (key, obj) {
        this.io.of(this.namespace).emit(key, obj);
    },

    broadcastToAll: function (key, obj) {
        this.io.sockets.emit(key, obj);  
    }
});

Hub.extend = utils.extend;

module.exports = Hub;