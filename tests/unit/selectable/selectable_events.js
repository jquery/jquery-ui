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

	var contentToForceScroll, helper,
		el = $("#selectable1").selectable();

	contentToForceScroll = $("<div></div>").css({
		height: "10000px",
		width: "10000px"
	});

	$("body").append( contentToForceScroll );
	$( window ).scrollTop( 1 ).scrollLeft( 1 );
	el.simulate( "mousedown", {
		clientX: 10,
		clientY: 10
	});

	helper = $(".ui-selectable-helper");
	equal( helper.css("top"), "11px", "Scrolling should be accounted for, see #8915." );
	equal( helper.css("left"), "11px", "Scrolling left should also be accounted for." );

	// Cleanup
	el.simulate("mouseup");
	contentToForceScroll.remove();
	$( window ).scrollTop( 0 ).scrollLeft( 0 );
});

})( jQuery );
