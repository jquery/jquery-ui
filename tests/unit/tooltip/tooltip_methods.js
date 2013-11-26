(function( $ ) {

module( "tooltip: methods" );

test( "destroy", function() {
	expect( 3 );
	var element = $( "#tooltipped1" );

	domEqual( "#tooltipped1", function() {
		element.tooltip().tooltip( "destroy" );
	});

	// make sure that open tooltips are removed on destroy
	domEqual( "#tooltipped1", function() {
		element
			.tooltip()
			.tooltip( "open", $.Event( "mouseover", { target: element[0] }) )
			.tooltip( "destroy" );
	});
	equal( $( ".ui-tooltip" ).length, 0 );
});

test( "open/close", function() {
	expect( 3 );
	$.fx.off = true;
	var tooltip,
		element = $( "#tooltipped1" ).tooltip();
	equal( $( ".ui-tooltip" ).length, 0, "no tooltip on init" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	ok( tooltip.is( ":visible" ) );

	element.tooltip( "close" );
	ok( tooltip.is( ":hidden" ) );
	$.fx.off = false;
});

// #8626 - Calling open() without an event
test( "open/close with tracking", function() {
	expect( 3 );
	$.fx.off = true;
	var tooltip,
		element = $( "#tooltipped1" ).tooltip({ track: true });
	equal( $( ".ui-tooltip" ).length, 0, "no tooltip on init" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	ok( tooltip.is( ":visible" ) );

	element.tooltip( "close" );
	ok( tooltip.is( ":hidden" ) );
	$.fx.off = false;
});

test( "enable/disable", function() {
	expect( 10 );
	$.fx.off = true;
	var tooltip,
		element = $( "#tooltipped1" ).tooltip();
	equal( $( ".ui-tooltip" ).length, 0, "no tooltip on init" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	ok( tooltip.is( ":visible" ) );

	element.tooltip( "disable" );
	equal( $( ".ui-tooltip" ).length, 0, "no tooltip when disabled" );

	ok( !element.tooltip( "widget" ).hasClass( "ui-state-disabled" ), "element doesn't get ui-state-disabled" );
	ok( !element.tooltip( "widget" ).attr( "aria-disabled" ), "element doesn't get aria-disabled" );
	ok( !element.tooltip( "widget" ).hasClass( "ui-tooltip-disabled" ), "element doesn't get ui-tooltip-disabled" );

	// support: jQuery <1.6.2
	// support: IE <8
	// We should use strictEqual( ..., undefined ) when dropping jQuery 1.6.1 support (or IE6/7)
	ok( !tooltip.attr( "title" ), "title removed on disable" );

	element.tooltip( "open" );
	equal( $( ".ui-tooltip" ).length, 0, "open does nothing when disabled" );

	element.tooltip( "enable" );
	equal( element.attr( "title" ), "anchortitle", "title restored on enable" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	ok( tooltip.is( ":visible" ) );
	$.fx.off = false;
});

test( "widget", function() {
	expect( 2 );
	var element = $( "#tooltipped1" ).tooltip(),
		widgetElement = element.tooltip( "widget" );
	equal( widgetElement.length, 1, "one element" );
	strictEqual( widgetElement[ 0 ], element[ 0 ], "same element" );
});

// #8925 - Changes to title attribute are preserved after close() or destroy()
test( "preserve changes to title attributes on close and destroy", function() {
	expect( 4 );
	var element = $( "#tooltipped1" ),
		changed = "changed title text";
		
	// 1. Changes to title attribute are preserved on close()
	element.attr( "title", "original title text" ).tooltip()
	       .tooltip( "open", $.Event( "mouseover", { target: element[0] }) )
		   .attr( "title", changed )
		   .tooltip( "close" );
	equal( $( "#tooltipped1" ).attr( "title" ), changed );
	
	// 2. Changes to title attribute are preserved on destroy()
	element.attr( "title", "original title text" ).tooltip()
	       .tooltip( "open", $.Event( "mouseover", { target: element[0] }) )
		   .attr( "title", changed )
		   .tooltip( "destroy" );
	equal( $( "#tooltipped1" ).attr( "title" ), changed );
	
	// 3. Changes to title attribute are NOT preserved when set to empty string
	element.attr( "title", "original title text" ).tooltip()
	       .tooltip( "open", $.Event( "mouseover", { target: element[0] }) )
		   .attr( "title", "" )
		   .tooltip( "close" );
	notEqual( $( "#tooltipped1" ).attr( "title" ), changed );
	
	// 4. Changes to title attribute NOT preserved when attribute has been removed
	element.attr( "title", "original title text" ).tooltip()
	       .tooltip( "open", $.Event( "mouseover", { target: element[0] }) )
		   .removeAttr( "title" )
		   .tooltip( "close" );
	notEqual( $( "#tooltipped1" ).attr( "title" ), changed );
});

}( jQuery ) );
