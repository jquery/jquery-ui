define( [
	"jquery",
	"ui/draggable"
], function( $ ) {

var element;

module( "draggable: events", {
	setup: function() {
		element = $("<div>").appendTo("#qunit-fixture");
	},
	teardown: function() {
		element.draggable("destroy");
	}
});

test( "callbacks occurrence count", function() {
	expect( 3 );

	var start = 0,
		stop = 0,
		dragc = 0;

	element.draggable({
		start: function() {
			start++;
		},
		drag: function() {
			dragc++;
		},
		stop: function() {
			stop++;
		}
	});

	element.simulate( "drag", {
		dx: 10,
		dy: 10
	});

	equal( start, 1, "start callback should happen exactly once" );
	equal( dragc, 3, "drag callback should happen exactly once per mousemove" );
	equal( stop, 1, "stop callback should happen exactly once" );
});

test( "stopping the start callback", function() {
	expect( 3 );

	var start = 0,
		stop = 0,
		dragc = 0;

	element.draggable({
		start: function() {
			start++;
			return false;
		},
		drag: function() {
			dragc++;
		},
		stop: function() {
			stop++;
		}
	});

	element.simulate( "drag", {
		dx: 10,
		dy: 10
	});

	equal( start, 1, "start callback should happen exactly once" );
	equal( dragc, 0, "drag callback should not happen at all" );
	equal( stop, 0, "stop callback should not happen if there wasnt even a start" );
});

test( "stopping the drag callback", function() {
	expect( 2 );

	var start = 0,
		stop = 0,
		dragc = 0;

	element.draggable({
		start: function() {
			start++;
		},
		drag: function() {
			dragc++;
			return false;
		},
		stop: function() {
			stop++;
		}
	});

	element.simulate( "drag", {
		dx: 10,
		dy: 10
	});

	equal( start, 1, "start callback should happen exactly once" );
	equal( stop, 1, "stop callback should happen, as we need to actively stop the drag" );
});

test( "stopping the stop callback", function() {
	expect( 1 );

	element.draggable({
		helper: "clone",
		stop: function() {
			return false;
		}
	});

	element.simulate( "drag", {
		dx: 10,
		dy: 10
	});

	ok( element.draggable( "instance" ).helper, "the clone should not be deleted if the stop callback is stopped" );
});

// http://bugs.jqueryui.com/ticket/6884
// Draggable: ui.offset.left differs between the "start" and "drag" hooks
test( "position and offset in hash is consistent between start, drag, and stop", function() {
	expect( 4 );

	var startPos, startOffset, dragPos, dragOffset, stopPos, stopOffset;

	element = $( "<div style='margin: 2px;'></div>" ).appendTo( "#qunit-fixture" );

	element.draggable({
		start: function( event, ui ) {
			startPos = ui.position;
			startOffset = ui.offset;
		},
		drag: function( event, ui ) {
			dragPos = ui.position;
			dragOffset = ui.offset;
		},
		stop: function( event, ui ) {
			stopPos = ui.position;
			stopOffset = ui.offset;
		}
	});

	element.simulate( "drag", {
		dx: 10,
		dy: 10,
		moves: 1
	});

	startPos.left += 10;
	startPos.top += 10;
	startOffset.left += 10;
	startOffset.top += 10;

	deepEqual( startPos, dragPos, "start position equals drag position plus distance" );
	deepEqual( dragPos, stopPos, "drag position equals stop position" );
	deepEqual( startOffset, dragOffset, "start offset equals drag offset plus distance" );
	deepEqual( dragOffset, stopOffset, "drag offset equals stop offset" );
});

} );
