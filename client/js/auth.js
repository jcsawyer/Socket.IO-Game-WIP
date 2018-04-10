var auth = function() {
	this.isOpen = false;
	this.errors = [];
	//this.initialize();
};

auth.prototype.initialize = function() {
	this.isAuthenticated(function(data) {
		if (!data)
			this.open();
	}.bind(this));
};

auth.prototype.bindEvents = function() {
	$('.login-input').keypress(function(e) {
		if (e.which === 13)
			this._login();
	}.bind(this));
	$('#btnLogin').click(function() { 
		this._login(); 
	}.bind(this));
};

auth.prototype.isAuthenticated = function(cb) {
	$game.network.on('auth-is-authenticated-response', function(data) {
		$game.network.off('auth-is-authenticated');
		cb(data);
	});
	$game.network.emit('auth-is-authenticated-request', { });
	//return false;
};

auth.prototype._login = function(first_argument) {
	$('#btnLogin').prop('disabled', true);
	var username = $('#loginUsername').val();
	var password = $('#loginPassword').val();
	if (username.length == 0)
		this.errors.push({ msg: 'Must enter a username' });
	if (password.length == 0)
		this.errors.push({ msg: 'Must enter a password' });

	if (this.errors.length > 0) {
		this._error();
	} else {
		shapwd = CryptoJS.SHA1(password + 'iu8udy76Shjey6DSjh37rfjh').toString(CryptoJS.enc.Hex);
		// TODO Show connecting
		$game.network.on('auth-login-response', function(data) {
			if (data.error) {
				this.errors.push(data.error);
				this._error();
			}
			if (data.message && data.message == username) {
				this.username = data.message;

				// TODO
				// Move this up in game somewhere higher up
				$game.chat.open();

				return this.close();
			}
			$game.network.off('auth-login-response');
		}.bind(this));
		$game.network.emit('auth-login-request', { username: username, password: shapwd }); 
	}
};

auth.prototype._error = function() {
	$('.login-mask').css('display', 'block');
		$('.login-error-list').html('');
		$('#loginError').css('visibility', 'visible');
		$('#loginError').css('opacity', '1');
		for (var i = 0; i < this.errors.length; i++) {
			$('.login-error-list').append(this.errors[i].msg + '<br />');
		}
		$('#btnCloseErrors').css('display', 'inherit');
		$('#btnCloseErrors').click(function() {
			$('#btnLogin').prop('disabled', false);
			$('#btnCloseErrors').css('display', 'none');
			$('#loginError').css('visibility', 'hidden');
			$('#loginError').css('opacity', '0');
			$('.login-mask').css('display', 'none'); 
		});
		this.errors = [];	
};

auth.prototype.open = function() {
	if (!this.isOpen) {
		this.isOpen = true;
		var html = '<div id="loginForm" class="panel panel-primary panel-login"><div class="login-mask"></div><h2>Login</h2><div id="loginError"><h2>Error</h2><br /><div class="login-error-list"></div><div class="btn-wrap"><button id="btnCloseErrors" class="btn btn-sml">Close</button></div></div><div class="input-group"><span class="input-group-addon" id="username-addon"><i class="fa fa-user"></i></span><input type="text" class="form-control login-input" placeholder="Username" id="loginUsername" aria-describedby="username-addon"></div><div class="input-group"><span class"input-group-addon" id="password-addon"><i class="fa fa-lock"></i></span><input type="password" class="form-control login-input" placeholder="Password" id="loginPassword" aria-describedby="password-addon"></div><button id="btnLogin" class="btn btn-primary">Login</button></div>';
		if (document && document.body) {
			$(document.body).append(html);
			this.bindEvents();
		}
	}
};

auth.prototype.close = function() {
	if (this.isOpen) {
		this.isOpen = false;
		$('#loginForm').remove();
	}
};