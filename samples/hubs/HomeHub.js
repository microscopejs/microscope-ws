var Hub = require('../../libs/Hub');

var HomeHub = Hub.extend({

	namespace: '/home',
	routes:{
		'send': 'handleMessage'
	},

	handleMessage: function (model) {
		this.broadcast('sended', model);
	}
});

module.exports = HomeHub;