var loginForm = function() {
	var html = '';
	html += '<div id="loginForm" class="panel panel-primary panel-login">';
	html += '<h2>Login</h2>';
	html += '<div id="loginError"></div>';
	html += '<div class="input-group">';
	html += '<span class="input-group-addon" id="username-addon"><i class="fa fa-user"></i></span>';
	html += '<input type="text" class="form-control login-input" placeholder="Username" id="loginUsername" aria-describedby="username-addon">';
	html += '</div>';
	html += '<div class="input-group">';
	html += '<span class"input-group-addon" id="password-addon"><i class="fa fa-lock"></i></span>';
	html += '<input type="password" class="form-control login-input" placeholder="Password" id="loginPassword" aria-describedby="password-addon">';
	html += '</div>';
	html += '<button id="btnConnect" class="btn btn-primary">Login</button>';
	html += '</div>';
	return html;
};