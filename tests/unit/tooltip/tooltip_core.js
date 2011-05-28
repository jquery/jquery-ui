(function( $ ) {

module( "tooltip: core" );

test( "markup structure", function() {
	expect( 6 );
	var element = $( "#tooltipped1" ).tooltip(),
		tooltip = $( ".ui-tooltip" );

	equal( element.attr( "aria-describedby" ), undefined, "no aria-describedby on init" );
	equal( tooltip.length, 0, "no tooltip on init" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.attr( "aria-describedby" ) );
	equal( tooltip.length, 1, "tooltip exists" );
	ok( tooltip.hasClass( "ui-tooltip" ), "tooltip is .ui-tooltip" );
	equal( tooltip.length, 1, ".ui-tooltip exists" );
	equal( tooltip.find( ".ui-tooltip-content" ).length, 1,
		".ui-tooltip-content exists" );
});

test( "accessibility", function() {
	// TODO: add tests
});

}( jQuery ) );
