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
		contentToForceScroll = TestHelpers.forceScrollableWindow( "body" );

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

test( "mousedown: select child", function() {
	expect( 2 );

	var childItemClass,
		element = $( "#selectable2 #child-item" );

	$( "#selectable2" ).selectable({filter:".item"});

	childItemClass = element.hasClass( "ui-selectee" );
	ok( childItemClass, "Child item should be selectee." );

	element.simulate( "mousedown" );
	element.simulate( "mouseup" );

	childItemClass = element.hasClass( "ui-selected" );
	ok( childItemClass, "Child item should be selected." );
});

})( jQuery );
