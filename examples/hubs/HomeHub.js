var Hub = require('../../libs/Hub');

var HomeHub = Hub.extend({

	namespace: '/home',
	routes:{
		'chat message': 'handleMessage'
	},

	handleMessage: function (model) {
		console.log('message: ' + model);
	}
});

module.exports = HomeHub;