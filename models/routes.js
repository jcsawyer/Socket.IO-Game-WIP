var crypto = require('crypto');
var express = require('express');
var passport = require('passport');
var account = require('./account');
var router = express.Router();

var errors = require('./../error-enum');

//router.use(express.static('./../client'));
/*router.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});*/

router.get('/', function (req, res) {
	res.render('index', { user : req.user });
});

router.get('/register', function (req, res) {
	res.render('register', { });
});

router.post('/register', function (req, res) {
	account.findByName(req.body.username, function (error, acc) {
		if (error) {
			return res.render('register', { data: { error: error.message } });
		}
		if (acc) {
			return res.render('register', { data: {error: errors['USER_ALREADY_EXISTS'].msg } });
		}

		var shasum = crypto.createHash('sha1');
		shasum.update(req.body.username + req.body.email);
		actCode = shasum.digest('hex');

		var shapwd = crypto.createHash('sha1').update(req.body.password + 'iu8udy76Shjey6DSjh37rfjh').digest('hex');
		account.register(new account({ 
			username: req.body.username,
			email: req.body.email,
			activated: false,
			actCode: actCode,
			role: 0,
			socketId: null
		}), shapwd, function(error, account) {
			if (error) {
				return res.render('register', { data: { error: error.message } });
			}

			// TODO ADD SEND EMAIL WITH ACTIVATION CODE
			console.log(actCode);
			return res.render('register', { data: { message: 'Actiavtion link has been sent to your email address '} });
			//res.redirect('/');
		});
	});

});

router.get('/login', function (req, res) {
	res.render('login', { user : req.user });
});;

router.post('/login', function (req, res, next) {
	var req2 = req;
	req2.body.password = crypto.createHash('sha1').update(req.body.password + 'iu8udy76Shjey6DSjh37rfjh').digest('hex');
	passport.authenticate('local', function (error, user, info) {
		if (error) {
			return next(error);
		}
		if (!user) {
			return res.render('login', { data: { error: info.message }});
		}
		if (!user.activated) {
			return res.render('login', { data: { error: errors['ACCOUNT_NOT_ACTIVATED'].msg }});
		}
		req.logIn(user, function (error) {
			if (error) {
				return next(error);
			}
			req.user = user;
			return res.redirect('/');
		});
	})(req2, res, next);
});

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

router.get('/activate/:actCode', function (req, res) {
	var actCode = req.params.actCode;

	account.activate(actCode, function(error, account) {
		if (error)
			return res.render('activation', { pageData: { error: error.message } });
		if (!account) {
			return res.render('activation', { pageData: { error: errors['INVALID_ACTIVATION_CODE'].msg } });
		}
		return res.render('activation');
	});
});

router.get('/game', isLoggedIn, function (req, res) {
	res.render('game', { user: req.user });
});

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated())
		return next();
	// Need res.render to pass data?
	res.redirect('/', { pageData: { error: errors['NOT_LOGGED_IN'].msg } });
}

module.exports = router;