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
	expect( 5 );

	var tooltipId,
		tooltip,
		element = $( "#multiple-describedby" ).tooltip();

	element.tooltip( "open" );
	tooltipId = element.data( "ui-tooltip-id" );
	tooltip = $( "#" + tooltipId );
	equal( tooltip.attr( "role" ), "tooltip", "role" );
	equal( element.attr( "aria-describedby" ), "fixture-span " + tooltipId,
		"multiple describedby when open" );
	// strictEqual to distinguish between .removeAttr( "title" ) and .attr( "title", "" )
	// support: jQuery <1.6.2
	// support: IE <8
	// We should use strictEqual( ..., undefined ) when dropping jQuery 1.6.1 support (or IE6/7)
	ok( !element.attr( "title" ), "no title when open" );
	element.tooltip( "close" );
	equal( element.attr( "aria-describedby" ), "fixture-span",
		"correct describedby when closed" );
	equal( element.attr( "title" ), "...", "title restored when closed" );
});

test( "delegated removal", function() {
	expect( 2 );

	var container = $( "#contains-tooltipped" ).tooltip(),
		element = $( "#contained-tooltipped" );

	element.trigger( "mouseover" );
	equal( $( ".ui-tooltip" ).length, 1 );

	container.empty();
	equal( $( ".ui-tooltip" ).length, 0 );
});

test( "nested tooltips", function() {
	expect( 2 );

	var child = $( "#contained-tooltipped" ),
		parent = $( "#contains-tooltipped" ).tooltip({
			show: null,
			hide: null
		});

	parent.trigger( "mouseover" );
	equal( $( ".ui-tooltip:visible" ).text(), "parent" );

	child.trigger( "mouseover" );
	equal( $( ".ui-tooltip" ).text(), "child" );
});

}( jQuery ) );
