define( [
	"jquery"
], function( $ ) {

var exports = {},

	// Store the old count so that we only assert on tests that have actually leaked,
	// instead of asserting every time a test has leaked sometime in the past
	oldActive = 0,
	splice = [].splice;

exports.forceScrollableWindow = function( appendTo ) {

	// The main testable area is 10000x10000 so to enforce scrolling,
	// this DIV must be greater than 10000 to work
	return $( "<div>" )
		.css( {
			height: "11000px",
			width: "11000px"
		} )
		.appendTo( appendTo || "#qunit-fixture" );
};

exports.onFocus = function( element, onFocus ) {
	var fn = function( event ) {
		if ( !event.originalEvent ) {
			return;
		}
		element.off( "focus", fn );
		onFocus();
	};

	element.on( "focus", fn )[ 0 ].focus();
};

/**
 * Ensures that tests have cleaned up properly after themselves. Should be passed as the
 * afterEach function on all modules' lifecycle object.
 */
exports.moduleAfterEach = function( assert ) {

	// Check for (and clean up, if possible) incomplete animations/requests/etc.
	if ( jQuery.timers && jQuery.timers.length !== 0 ) {
		assert.equal( jQuery.timers.length, 0, "No timers are still running" );
		splice.call( jQuery.timers, 0, jQuery.timers.length );
		jQuery.fx.stop();
	}
	if ( jQuery.active !== undefined && jQuery.active !== oldActive ) {
		assert.equal( jQuery.active, oldActive, "No AJAX requests are still active" );
		oldActive = jQuery.active;
	}
};

return exports;

} );
