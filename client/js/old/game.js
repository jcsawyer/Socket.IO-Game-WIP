var bleh = '';
/*$(document).ready(function() {

});

dsplayLoginForm = function() {
	$(document.body).append(loginForm());
}

attemptLogin = function() {
	var username = $('#loginUsername').val();
	var password = $('#loginPassword').val();
	if (username.length == 0)
		console.log('Must enter username');
		//Not long enough
	if (password.length == 0)
		console.log('Must enter password');
		// Not long enough

	shapwd = CryptoJS.SHA1(password + 'iu8udy76Shjey6DSjh37rfjh').toString(CryptoJS.enc.Hex);
	// TODO Show connecting
	$network.on('login-response', function(data) {
		if (data.error)
			console.log(data.error);
		// TODO Display error
		if (data.message && data.message == username) {
			// TODO Success!
			console.log('logged in as ' + data.message);
		}
		$network.socket.off('login-response');
	});
	$network.emit('login-request', { username: username, password: shapwd }); 
}

$(document).ready(function() {
	dsplayLoginForm();
	$('login-input').keypress(function(e) {
		if (e.which == 13) {
			attemptLogin();
		};
	});
	
	
	$('#btnConnect').click(function() { attemptLogin(); });
});

/*