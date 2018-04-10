var $auth;

(function() {
	var auth = function() {
		this.errors = [];
		this.username = '';
		if (!this.isAuthenticated())
			this.render();
	};

	auth.prototype.isAuthenticated = function() {
		$network.on('auth-check-response', function(data) {
			if (data)
				return data.isAuthenticated;
			return false;
		});
		$network.emit('auth-check', { });
		return false;
	};

	auth.prototype.render = function() {
		var html = '<div id="loginForm" class="panel panel-primary panel-login"><div class="login-mask"></div><h2>Login</h2><div id="loginError"><h2>Error</h2><br /><div class="login-error-list"></div><div class="btn-wrap"><button id="btnCloseErrors" class="btn btn-sml">Close</button></div></div><div class="input-group"><span class="input-group-addon" id="username-addon"><i class="fa fa-user"></i></span><input type="text" class="form-control login-input" placeholder="Username" id="loginUsername" aria-describedby="username-addon"></div><div class="input-group"><span class"input-group-addon" id="password-addon"><i class="fa fa-lock"></i></span><input type="password" class="form-control login-input" placeholder="Password" id="loginPassword" aria-describedby="password-addon"></div><button id="btnConnect" class="btn btn-primary">Login</button></div>';
		if (document && document.body) {
			$(document.body).append(html);
			this.bindEvents();
		}
	};

	auth.prototype.bindEvents = function() {
		var that = this;
		$('login-input').keypress(function(e) {
			if (e.which == 13) {
				that._attemptLogin();
			}
		})
		$('#btnConnect').click(function() { that._attemptLogin(); });
	};

	auth.prototype._attemptLogin = function() {
		var username = $('#loginUsername').val();
		var password = $('#loginPassword').val();
		if (username.length == 0)
			this.errors.push({ msg: 'Must enter a username' });
		if (password.length == 0)
			this.errors.push({ msg: 'Must enter a password' });

		if (this.errors.length > 0) {
			this._loginErrors();
		} else {
			shapwd = CryptoJS.SHA1(password + 'iu8udy76Shjey6DSjh37rfjh').toString(CryptoJS.enc.Hex);
			// TODO Show connecting
			$network.on('auth-login-response', function(data) {
				if (data.error) {
					this.errors.push(data.error);
					this._loginErrors();
				}
				if (data.message && data.message == username) {
					this.username = data.message;
					return this._kill();
				}
				$network.socket.off('auth-login-response');
			}.bind(this));
			$network.emit('auth-login-request', { username: username, password: shapwd }); 
		}
	};

	auth.prototype._kill = function() {
		$('#loginForm').remove();
		$auth = null;
	};

	auth.prototype._loginErrors = function() {
		$('.login-mask').css('display', 'block');
		$('.login-error-list').html('');
		$('#loginError').css('visibility', 'visible');
		$('#loginError').css('opacity', '1');
		for (var i = 0; i < this.errors.length; i++) {
			$('.login-error-list').append(this.errors[i].msg + '<br />');
		}
		$('#btnCloseErrors').css('display', 'inherit');
		$('#btnCloseErrors').click(function() {
			$('#btnCloseErrors').css('display', 'none');
			$('#loginError').css('visibility', 'hidden');
			$('#loginError').css('opacity', '0');
			$('.login-mask').css('display', 'none'); 
		});
		this.errors = [];
	}

	auth.prototype._renderRegister = function() {

	};

	$auth = new auth();
})();