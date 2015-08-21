define( [
	"jquery"
], function( $ ) {

var exports = {};

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

return exports;

} );
