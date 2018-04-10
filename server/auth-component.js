serverComponent = require('./server-component');

var crypto = require('crypto');
var account = require('./../models/account');

var errors = require('./../error-enum');

function authComponent() {
	this.users = [];
	this.initialize();
};

authComponent.prototype.initialize = function() {
	this.bindEvents();
};

authComponent.prototype.bindEvents = function() {
	$io.on('connection', function(socket){
		this.connected(socket);
		socket.on('disconnect', function(data) { this.disconnected(socket, data); }.bind(this));
		socket.on('auth-login-request', function(data) { this.loginRequest(socket, data); }.bind(this));
		socket.on('auth-register-request', function(data) { this.registerRequest(socket, data); }.bind(this));
		socket.on('auth-is-authenticated-request', function(data) { socket.emit('auth-is-authenticated-response', this.isAuthenticated(socket)) }.bind(this));
	}.bind(this));
};

authComponent.prototype.connected = function(socket) {
	console.log('>> Client connected (' + socket.id + ')');
};

authComponent.prototype.disconnected = function(socket, data) {
	var user = this.users.find(u => u.socketId === socket.id);
	if (user){
		account.findOneAndUpdate({ _id: user.userId }, { socketId: null }, function(errors, account) {
			// TODO error removing session id fcrom database
		});
		//socket.request.session = { };
		$chat.broadcast(user.username + ' logged out');
		this.users = this.users.filter(u => u.socketId !== socket.id);
	}
};

authComponent.prototype.loginRequest = function(socket, data) {
	account.findByName(data.username, function(error, acc) {
		if (error)
			return socket.emit('auth-login-response', { error: error.msg });
		if (!acc)
			return socket.emit('auth-login-response', { error: errors['INVALID_USERNAME']});
		crypto.pbkdf2(data.password, acc.salt, 25000, 512, 'SHA256', function(error, hashRaw) {
				if (error) 
					console.log(error);
				var hpass = new Buffer(hashRaw, 'binary').toString('hex');

				if (acc.hash == hpass) {
					// TODO do I need this?
					//this.socket.request.session.user = acc;
					if (acc.socketId != socket.id) {
						if ($io.sockets.connected[acc.socketId]) {
							console.log('>>> DUPLICATE LOGIN : Killing old socket');
							$io.sockets.connected[acc.socketId].emit('mmo_error', errors['DUPLICATE_LOGIN']);
							$io.sockets.connected[acc.socketId].disconnect(errors['DUPLICATE_LOGIN'].msg);
						}
						account.findOneAndUpdate({ _id: acc._id }, { socketId: socket.id }, function(error, acc) {
							// TODO error changing to new socked it in database
						});
					}
					this.users.push({ userId: acc._id, username: acc.username, socketId: socket.id });
					$chat.broadcast(acc.username + ' logged in');
					// TODO game-component to send down required game data packet (map/position/etc)
					return socket.emit('auth-login-response', { message: data.username });
				}
				return socket.emit('auth-login-response', { error: errors['INVALID_PASSWORD'] });
			}.bind(this));
	}.bind(this));
};

authComponent.prototype.registerRequest = function(data) {
	// body...
};

authComponent.prototype.isAuthenticated = function(socket) {
	user = this.users.find(u => u.socketId === socket.id);
	if (user){
		return user.username;
	}
	else{
		return false;
	}
};

authComponent.prototype.__proto__ = serverComponent.prototype;

//var io = require('socket.io');
module.exports = new authComponent();