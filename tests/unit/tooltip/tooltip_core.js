(function( $ ) {

module( "tooltip: core" );

test( "markup structure", function() {
	expect( 7 );
	var element = $( "#tooltipped1" ).tooltip(),
		tooltip = $( ".ui-tooltip" );

	equal( element.attr( "aria-describedby" ), undefined, "no aria-describedby on init" );
	equal( tooltip.length, 0, "no tooltip on init" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	equal( tooltip.length, 1, "tooltip exists" );
	equal( element.attr( "aria-describedby"), tooltip.attr( "id" ), "aria-describedby" );
	ok( tooltip.hasClass( "ui-tooltip" ), "tooltip is .ui-tooltip" );
	equal( tooltip.length, 1, ".ui-tooltip exists" );
	equal( tooltip.find( ".ui-tooltip-content" ).length, 1,
		".ui-tooltip-content exists" );
});

test( "accessibility", function() {
	// TODO: full tests
	expect( 2 );

	var tooltipId,
		element = $( "#multiple-describedby" ).tooltip();

	element.tooltip( "open" );
	tooltipId = element.data( "ui-tooltip-id" );
	equal( element.attr( "aria-describedby" ), "fixture-span " + tooltipId,
		"multiple describedby when open" );
	element.tooltip( "close" );
	equal( element.attr( "aria-describedby" ), "fixture-span",
		"correct describedby when closed" );
});

}( jQuery ) );
