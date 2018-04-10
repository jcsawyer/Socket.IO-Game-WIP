serverComponenet = require('./server-component');

function chatComponent() {
	this.initialize();
}

chatComponent.prototype.initialize = function() {
	this.bindEvents();
};

chatComponent.prototype.bindEvents = function() {
	$io.on('connection', function(socket) {
		socket.on('chat-say', function(data) { this.onSay(socket, data) }.bind(this));
	}.bind(this));
};

chatComponent.prototype.broadcast = function(msg) {
	//var str = '[B]: ' + msg;
	console.log('>> ' + msg)
	$io.sockets.emit('chat-broadcast', { msg: msg, color: '#266ae0' });
};

chatComponent.prototype.say = function(msg, username) {
	var str = '[S] ' + username + ': ' + msg;
	console.log('>> ' + str);
	$io.sockets.emit('chat-say', { msg: str, color: '#efefef' });
};

chatComponent.prototype.onSay = function(socket, data) {
	//console.log($auth.socket.request.session);
	// TODO Get username from somewhere else? 
	// An array of connected sockets and their connected user perhaps?
	var username = $auth.isAuthenticated(socket); 
	if (username) {
		this.say(data.msg, username);
	}
};

chatComponent.prototype.__proto__ = serverComponent.prototype;
module.exports = new chatComponent();