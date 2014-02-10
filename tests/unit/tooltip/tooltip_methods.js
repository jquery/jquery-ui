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
	expect( 11 );
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

	// #9719 - Title should be preserved after disabling twice
	element.tooltip( "disable" );
	element.tooltip( "disable" );
	element.tooltip( "enable" );
	equal( element.attr( "title" ), "anchortitle", "title restored on enable after being disabled twice" );

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

test( "preserve changes to title attributes on close and destroy", function() {
	expect( 6 );
	var element = $( "#tooltipped1" ),
		changed = "changed title text",
		original = "original title text",
		tests = [];

	// 1. Changes to title attribute are preserved on close()
	tests[ 0 ] = { title: changed, expected: changed, method: "close" };
	// 2. Changes to title attribute are preserved on destroy()
	tests[ 1 ] = { title: changed, expected: changed , method: "destroy" };
	// 3. Changes to title attribute are NOT preserved when set to empty string on close()
	tests[ 2 ] = { title: "", expected: original, method: "close" };
	// 4. Changes to title attribute are NOT preserved when set to empty string on destroy()
	tests[ 3 ] = { title: "", expected: original, method: "destroy" };
	// 5. Changes to title attribute NOT preserved when attribute has been removed on close()
	tests[ 4 ] = { expected: original, method: "close" };
	// 6. Changes to title attribute NOT preserved when attribute has been removed on destroy()
	tests[ 5 ] = { expected: original, method: "destroy" };

	$.each( tests, function( index, test ) {
		
		element.attr( "title", original ).tooltip()
			.tooltip( "open", $.Event( "mouseover", { target: element[ 0 ] } ) );
		if ( test.title ) {
			element.attr( "title", test.title );
		} else {
			element.removeAttr( "title" );
		}
		element.tooltip( test.method );
		equal( $( "#tooltipped1" ).attr( "title" ), test.expected );
		
	} );
});

}( jQuery ) );
