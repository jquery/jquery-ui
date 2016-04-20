define( [
	"qunit",
	"jquery",
	"ui/widgets/tooltip"
], function( QUnit, $ ) {

QUnit.module( "tooltip: methods" );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 3 );
	var element = $( "#tooltipped1" );

	assert.domEqual( "#tooltipped1", function() {
		element.tooltip().tooltip( "destroy" );
	} );

	// Make sure that open tooltips are removed on destroy
	assert.domEqual( "#tooltipped1", function() {
		element
			.tooltip()
			.tooltip( "open", $.Event( "mouseover", { target: element[ 0 ] } ) )
			.tooltip( "destroy" );
	} );
	assert.equal( $( ".ui-tooltip" ).length, 0 );
} );

QUnit.test( "open/close", function( assert ) {
	assert.expect( 3 );
	$.fx.off = true;
	var tooltip,
		element = $( "#tooltipped1" ).tooltip();
	assert.equal( $( ".ui-tooltip" ).length, 0, "no tooltip on init" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	assert.ok( tooltip.is( ":visible" ) );

	element.tooltip( "close" );
	assert.ok( tooltip.is( ":hidden" ) );
	$.fx.off = false;
} );

// #8626 - Calling open() without an event
QUnit.test( "open/close with tracking", function( assert ) {
	assert.expect( 3 );
	$.fx.off = true;
	var tooltip,
		element = $( "#tooltipped1" ).tooltip( { track: true } );
	assert.equal( $( ".ui-tooltip" ).length, 0, "no tooltip on init" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	assert.ok( tooltip.is( ":visible" ) );

	element.tooltip( "close" );
	assert.ok( tooltip.is( ":hidden" ) );
	$.fx.off = false;
} );

QUnit.test( "enable/disable", function( assert ) {
	assert.expect( 11 );
	$.fx.off = true;
	var tooltip,
		element = $( "#tooltipped1" ).tooltip();
	assert.equal( $( ".ui-tooltip" ).length, 0, "no tooltip on init" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	assert.ok( tooltip.is( ":visible" ) );

	element.tooltip( "disable" );
	assert.equal( $( ".ui-tooltip" ).length, 0, "no tooltip when disabled" );

	assert.lacksClasses( element.tooltip( "widget" ), "ui-state-disabled" );
	assert.ok( !element.tooltip( "widget" ).attr( "aria-disabled" ), "element doesn't get aria-disabled" );
	assert.lacksClasses( element.tooltip( "widget" ), "ui-tooltip-disabled" );
	assert.equal( tooltip.attr( "title" ), null, "title removed on disable" );

	element.tooltip( "open" );
	assert.equal( $( ".ui-tooltip" ).length, 0, "open does nothing when disabled" );

	element.tooltip( "enable" );
	assert.equal( element.attr( "title" ), "anchortitle", "title restored on enable" );

	// #9719 - Title should be preserved after disabling twice
	element.tooltip( "disable" );
	element.tooltip( "disable" );
	element.tooltip( "enable" );
	assert.equal( element.attr( "title" ), "anchortitle", "title restored on enable after being disabled twice" );

	element.tooltip( "open" );
	tooltip = $( "#" + element.data( "ui-tooltip-id" ) );
	assert.ok( tooltip.is( ":visible" ) );
	$.fx.off = false;
} );

QUnit.test( "enable/disable delegated", function( assert ) {
	assert.expect( 1 );
	var element = $( "#qunit-fixture" ).tooltip();
	var tooltipped = $( "#tooltipped1" );

	element.tooltip( "disable" );
	element.tooltip( "enable" );

	tooltipped.trigger( "mouseover" );
	assert.equal( $( ".ui-tooltip" ).length, 1, "open" );

	element.tooltip( "destroy" );
} );

QUnit.test( "widget", function( assert ) {
	assert.expect( 2 );
	var element = $( "#tooltipped1" ).tooltip(),
		widgetElement = element.tooltip( "widget" );
	assert.equal( widgetElement.length, 1, "one element" );
	assert.strictEqual( widgetElement[ 0 ], element[ 0 ], "same element" );
} );

QUnit.test( "preserve changes to title attributes on close and destroy", function( assert ) {
	assert.expect( 6 );
	var element = $( "#tooltipped1" ),
		changed = "changed title text",
		original = "original title text",
		tests = [];

	// 1. Changes to title attribute are preserved on close()
	tests[ 0 ] = { title: changed, expected: changed, method: "close" };

	// 2. Changes to title attribute are preserved on destroy()
	tests[ 1 ] = { title: changed, expected: changed, method: "destroy" };

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
		assert.equal( $( "#tooltipped1" ).attr( "title" ), test.expected );

	} );
} );

} );
