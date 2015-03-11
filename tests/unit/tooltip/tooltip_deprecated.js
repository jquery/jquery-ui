(function( $ ) {

module( "tooltip: (deprecated) options" );

test( "tooltipClass", function( assert ) {
	expect( 1 );
	var element = $( "#tooltipped1" ).tooltip({
		tooltipClass: "custom"
	}).tooltip( "open" );
	assert.hasClasses( $( "#" + element.data( "ui-tooltip-id" ) ), "custom" );
});

}( jQuery ) );
