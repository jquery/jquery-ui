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

})( jQuery );
