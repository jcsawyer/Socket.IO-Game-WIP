var network = function () {
	this._ip = 'localhost';
	this._port = '3000';
	this._socket = null;
	this.initialize();
}

network.prototype.initialize = function() {
	this._socket = io('http://' + this._ip + (this._port ? ':' + this._port : ''));
	this.bindEvents();
};

network.prototype.bindEvents = function() {
	this._socket.on('connect', function() {
		// TODO ?
	});
	this._socket.on('disconnect', function() {
		// TODO ?
		// Boot back to login with error popup
		if ($game.chat.isOpen)
			$game.chat.close();
		$game.auth.errors.push({ msg: 'Disconnected' });
		$game.auth.open();
		$game.auth._error();
	});
	this._socket.on('handshake', function(data) {
		console.log('Handshake requested : ' + data.hash);
		var result = CryptoJS.SHA1(version + data.hash + handshakePublicSeed).toString(CryptoJS.enc.Hex);
		this._socket.emit('handshake-result', { hash: result, version: version });
	});
	this._socket.on('mmo_error', function(data) {
		console.error(data.code, data.msg);
		this._socket.close();
	});
};

network.prototype.on = function(type, callback) {
	return this._socket.on(type, callback);
};

network.prototype.emit = function(type, data) {
	return this._socket.emit(type, data);
};

network.prototype.off = function(type) {
	return this._socket.off(type);
};