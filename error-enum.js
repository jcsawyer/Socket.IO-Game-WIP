module.exports = {
	// BASIC 100~
	VERSION_MISMATCH: { code: 106, msg: 'Invalid game version' },

	// Authentication 600~
	HANDSHAKE_INVALID: { code: 600, msg: 'Invalid handshake result'},
	HANDSHAKE_NOT_IN_SESSION: { code: 601, msg: 'Session is not handshaked'},
	INVALID_USERNAME: { code: 602, msg: 'Invalid username' },
	INVALID_PASSWORD: { code: 603, msg: 'Invalid email' },
	DUPLICATE_LOGIN: { code: 604, msg: 'Logged in from more than one place' },
	NOT_LOGGED_IN: { code: 605, msg: 'You must be logged' },
	INVALID_ACTIVATION_CODE: { code: 606, msg: 'Invalid activation code' },
	USER_ALREADY_EXISTS: { code: 607, msg: 'User already exdists' },
	ACCOUNT_NOT_ACTIVATED: { code: 608, msg: 'Account not activated' },
	INVALID_USERNAME: { code: 608, msg: 'Invalid Username' },
	INVALID_PASSWORD: { code: 609, msg: 'Invalid Password' }
};