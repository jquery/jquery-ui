define( [
	"jquery",
	"lib/helper",
	"ui/selectable"
], function( $, testHelpers ) {

module("selectable: events");

test( "start", function() {
	expect( 2 );
	var el = $("#selectable1");
	el.selectable({
		start: function() {
			ok( true, "drag fired start callback" );
			equal( this, el[0], "context of callback" );
		}
	});
	el.simulate( "drag", {
		dx: 20,
		dy: 20
	});
});

test( "stop", function() {
	expect( 2 );
	var el = $("#selectable1");
	el.selectable({
		start: function() {
			ok( true, "drag fired stop callback" );
			equal( this, el[0], "context of callback" );
		}
	});
	el.simulate( "drag", {
		dx: 20,
		dy: 20
	});
});

test( "mousedown: initial position of helper", function() {
	expect( 2 );

	var helperOffset,
		element = $( "#selectable1" ).selectable(),
		contentToForceScroll = testHelpers.forceScrollableWindow( "body" );

	$( window ).scrollTop( 100 ).scrollLeft( 100 );

	element.simulate( "mousedown", {
		clientX: 10,
		clientY: 10
	});

	helperOffset = $( ".ui-selectable-helper" ).offset();
	ok( helperOffset.top, 110, "Scroll top should be accounted for." );
	ok( helperOffset.left, 110, "Scroll left should be accounted for." );

	// Cleanup
	element.simulate( "mouseup" );
	contentToForceScroll.remove();
	$( window ).scrollTop( 0 ).scrollLeft( 0 );
});

} );
