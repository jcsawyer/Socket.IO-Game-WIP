var crypto = require('crypto');
var account = require('./models/account');

var handshakePrivateSeed = '9387cc80e4c616a19967fce746c77c5d';
var handshakePublicSeed = '65a8e27d8879283831b664bd8b7f0ad4';

var clientVersion = '1.0.1a';

var io = null;

var config = require('./config');
var errors = require('./error-enum');

function isHandshakedSession(socket, noError, noClose) {
	if (!socket.request.session.isHandshaked) {
		if (!noError) 
			socket.emit('mmo_error', errors['HANDSHAKE_NOT_IN_SESSION']);
		if (!noClose)
			socket.disconnect(errors['HANDSHAKE_NOT_IN_SESSION'].msg);
		return false;
	}
	return true;
}

function handshakeEvents(socket) {
	socket.on('handshake-result', function (data) {
		if (data.version !== clientVersion) {
			socket.emit('mmo_error', errors['VERSION_MISMATCH']);
		}
		if (crypto.createHash('sha1').update(clientVersion + socket.request.session.handshakeHash + handshakePublicSeed).digest('hex') == data.hash) {
			// Gameclient is verified
			socket.request.session.isHandshaked = true;
			socket.emit('isHandshaked', { });
		} else {
			socket.emit('mmo_error', errors['HANDSHAKE_INVALID']);
		}
	});

	if (!socket.request.session.handshakeHash) {
		socket.request.session.handshakeHash = crypto.createHash('sha1').update(handshakePrivateSeed + 'iu8udy76Shjey6DSjh37rfjh').digest('hex');
		socket.emit('handshake', { hash: socket.request.session.handshakeHash });
	}
}

module.exports = function (app, sessionMiddleware) {
	$io = require('socket.io')(app.server);

	$io.use(function (socket, next) {
		socket.request.originalUrl = socket.request.url;
		sessionMiddleware(socket.request, socket.request.res, next);
	});

	$auth = require('./server/auth-component');
	$chat = require('./server/chat-component');

	console.log('>> Application listening on ' + config.host + ':' + config.port);
}