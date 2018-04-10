var $network;
// TODO Fetch from configuration file
var version = '1.0.1a';
var handshakePublicSeed = '65a8e27d8879283831b664bd8b7f0ad4';

(function() {
	var server_ip = 'localhost';
	var server_port = '3000';

	var network = function (ip, port) {
		this._ip = ip;
		this._port = port;
		this.initialize();
	}

	network.prototype.initialize = function() {
		if (!this._ip && !this._port)
			this.socket = io();
		else {
			this.socket = io('http://' + this._ip + (this._port ? ':' + this._port : ''));
		}
		this.bindBaseEvents();
	}

	network.prototype.bindBaseEvents = function() {
		var that = this;
		this.socket.on('connect', function() {
			console.log('Connected!');
		});
		this.socket.on('disconnect', function () {
			// TODO Game needs to return to login
			console.log('Disconnected');
		});
		this.socket.on('handshake', function(data) {
			console.log('Handshake requested : ' + data.hash);
			var result = CryptoJS.SHA1(version + data.hash + handshakePublicSeed).toString(CryptoJS.enc.Hex);
			that.socket.emit('handshake-result', { hash: result, version: version });
		});
		this.socket.on('mmo_error', function(data) {
			console.error(data.code, data.msg);
			that.socket.close();
		});
		this.socket.on('isHandshaked', function() {
			console.log('Handshaked');
		});
	};

	network.prototype.on = function(type, callback) {
		return this.socket.on(type, callback);
	};

	network.prototype.emit = function(type, data) {
		return this.socket.emit(type, data);
	};

	$network = new network(server_ip, server_port);
})();