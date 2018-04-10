var chat = function() {
	this.isOpen = false;
	this.errors = [];
	this.initialize();
};

chat.prototype.initialize = function() {

};

chat.prototype.bindEvents = function() {
	$game.network.on('chat-broadcast', function(data) {
		this._append(data);
	}.bind(this));
	$game.network.on('chat-say', function(data) {
		this._append(data);
	}.bind(this));
	$('#chatMessage').keypress(function(e) {
		// TODO add setting different channels etc on particular code
		if (e.which == 13){
			this._say();
			$('#chatMessage').val('');
		}
	}.bind(this));
	$('#btnChatSend').click(function() { 
		this._say(); 
		$('#chatMessage').val('');
	}.bind(this));
};

chat.prototype._append = function(data) {
	$('#chat-messages').append('<div class="message" style="color: ' + data.color + '"">' + data.msg + '</div>');
};

chat.prototype._say = function() {
	var message = $('#chatMessage').val();
	$game.network.emit('chat-say', { msg: message });
};

chat.prototype._error = function() {
	// TODO
	this.errors = [];	
};

chat.prototype.open = function() {
	if (!this.isOpen) {
		$game.auth.isAuthenticated(function(data) {
			if (data) {
				this.isOpen = true;
				var html = '<div id="chat-panel" class="panel panel-primary panel-chat"><div class="container"><div id="chat-messages" class="messages"></div></div><input type="text" id="chatMessage" placeholder="Type your message here..."><button id="btnChatSend">Send</button></div>';
				if (document && document.body) {
					$(document.body).append(html);
					this._append({ msg: data + ' loogged in', color: '#266ae0' });
					this.bindEvents();
				}
			}
		}.bind(this));
	}
};

chat.prototype.close = function() {
	if (this.isOpen) {
		this.isOpen = false;
		$('#chat-panel').remove();
	}
};