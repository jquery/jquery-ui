/*
 * selectable_events.js
 */
(function( $ ) {

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
		contentToForceScroll = $( "<div>" ).css({
			height: "10000px",
			width: "10000px"
		});

	contentToForceScroll.appendTo( "body" );
	$( window ).scrollTop( 100 ).scrollLeft( 100 );

	element.simulate( "mousedown", {
		clientX: 10,
		clientY: 10
	});

	// we do a GTE comparison here because IE7 erroneously subtracts
	// 2 pixels from a simulated mousedown for clientX/Y
	// Support: IE7
	helperOffset = $( ".ui-selectable-helper" ).offset();
	ok( helperOffset.top >= 99, "Scroll top should be accounted for." );
	ok( helperOffset.left >= 99, "Scroll left should be accounted for." );

	// Cleanup
	element.simulate( "mouseup" );
	contentToForceScroll.remove();
	$( window ).scrollTop( 0 ).scrollLeft( 0 );
});

})( jQuery );
