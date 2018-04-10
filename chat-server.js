var chatServer = function(io) {
	this.socket = io;
	this.messages = [];

	this.initialize();
}

chatServer.prototype.initialize = function() {
	this.bindEvents();
}

chatServer.prototype.bindEvents = function() {
	this.socket.on('chat-yell', function(data) { this.chatYell(data) }.bind(this));
}

chatServer.prototype.chatYell = function(data) {
	console.log('[Y] ' + this.socket.request.session.user.username + ': ' + data.message);
}

module.exports = function(io) { return new chatServer(io); }