var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var http = require('http');

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var config = require('./config');
var errorCodes = require('./error-enum');

var account = require('./models/account');
var app = express();

var sessionMiddleware = session( {
	name: 'MMOSID',
	secret: config.secret,
	store: new MongoStore ( {
		mongooseConnection: mongoose.connection
	} ),
	resave: true,
	saveUninitialized: true
} );

app.set('views', path.join(__dirname, 'client/views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// MOVED
app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, 'client')));

app.use(logger('dev'));

passport.use(new LocalStrategy(account.authenticate()));

passport.serializeUser(account.serializeUser());
passport.deserializeUser(account.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://' + config.host + '/' + config.dbName, function (error) {
	if (error) {
		console.log('Could not connect to ' + config.host + '/' + config.dbName);
	}
} );

//app.use(sessionMiddleware);

app.use('/', require('./models/routes'));

app.use(function (req, res, next) {
	var error = new Error('Not Found');
	error.status = 404;
	next(error);
});

app.use(function (error, req, res, next) {
	res.status(error.status || 500);
	res.render('error', { message: error.message, error: error });
});

app.server = http.createServer(app).listen(config.port);

var GameServer = require('./game-server')(app, sessionMiddleware);

module.exports = app;