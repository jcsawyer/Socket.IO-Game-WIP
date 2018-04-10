var $chat;

var messageType = {
	'SERVER': { id: 0, prefix: 'SERVER', color: '#444444' },
	SAY: { id: 1, prefix: 'S', color: '#000000' }
};

(function() {
	var chat = function() {
		this.tabs = [];
		this.activeTab = null;
		this.initialize();
	};

	chat.prototype.initialize = function() {
		this.render();
	};

	chat.prototype.render = function() {
		var html = '<div id="chat-panel" class="panel panel-primary panel-chat"></div>';
		if (document && document.body) {
			$(document.body).append(html);
			this.bindEvents();
		} 
	};

	chat.prototype.bindEvents = function() {
		// SEND MESSAGE BUTTON
		// SWITCH TAB EVENTS?
		// TRANSPARENT BUTTON
		$network.on('chat-broadcast', function(data) {
			$('#chat-panel').append('<br /><span style="color: ' + data.color + '">' + data.msg + '</span>');
		});
		$network.on('chat-say', function(data) {
			$('#chat-panel').append('<br /><span style="color: ' + data.color + '">' + data.msg + '</span>');
		});
	};
	$chat = new chat();
})();