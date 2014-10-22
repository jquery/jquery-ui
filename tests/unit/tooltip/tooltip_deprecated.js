/*
 * dialog_deprecated.js
 */
(function( $ ) {

module( "tooltip: (deprecated) options" );

test( "tooltipClass", function() {
	expect( 1 );
	var element = $( "#tooltipped1" ).tooltip({
		tooltipClass: "custom"
	}).tooltip( "open" );
	ok( $( "#" + element.data( "ui-tooltip-id" ) ).hasClass( "custom" ) );
});

}( jQuery ) );
