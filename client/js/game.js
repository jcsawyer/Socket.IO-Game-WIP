var $game;

(function() {
	var game = function() {
		this.network = new network();
		this.chat = new chat();
		this.auth = new auth();
	};

	$game = new game();

	$game.auth.initialize();
})();