define( [
	"jquery",
	"lib/helper"
], function( $, helper ) {

var lastItem,
	log = [];

return $.extend( helper, {
	log: function( message, clear ) {
		if ( clear ) {
			log.length = 0;
		}
		if ( message === undefined ) {
			message = lastItem;
		}
		log.push( String.prototype.trim.call( message ) );
	},

	logOutput: function() {
		return log.join( "," );
	},

	clearLog: function() {
		log.length = 0;
	},

	click: function( menu, item ) {
		lastItem = item;
		menu.children()
			.eq( item )
			.children( ".ui-menu-item-wrapper" )
			.trigger( "click" );
	}
} );

} );
