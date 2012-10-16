(function() {

var lastItem,
	log = [];

TestHelpers.menubar = {
	log: function( message, clear ) {
		if ( clear ) {
			log.length = 0;
		}
		if ( message === undefined ) {
			message = lastItem;
		}
		log.push( $.trim( message ) );
	},

	logOutput: function() {
		return log.join( "," );
	},

	clearLog: function() {
		log.length = 0;
	},

	click: function( menubar, item, menuItem ) {
		lastItem = "(" + item + "," + menuItem + ")";
		menubar
			.children(":eq(" + item + ")")
			.children(".ui-menu")
			.children(":eq(" + menuItem + ")")
			.find("a:first")
			.trigger("click");
	}
};

})();
