var $uiManager;

(function() {
	var uiManager = function() {
		this.open = [];
		this.auth = null;
		this.chat = null;
		this.inventory = null;
	}

	uiManager.prototype.initialize = function() {
		this.auth = new auth();
	};

	$uiManager = new uiManager();
})();