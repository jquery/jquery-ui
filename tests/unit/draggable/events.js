define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/draggable"
], function( QUnit, $, helper ) {
"use strict";

var element;

QUnit.module( "draggable: events", {
	beforeEach: function() {
		element = $( "<div>" ).appendTo( "#qunit-fixture" );
	},
	afterEach: function() {
		element.draggable( "destroy" );
		return helper.moduleAfterEach.apply( this, arguments );
	}
} );

QUnit.test( "callbacks occurrence count", function( assert ) {
	assert.expect( 3 );

	var start = 0,
		stop = 0,
		dragc = 0;

	element.draggable( {
		start: function() {
			start++;
		},
		drag: function() {
			dragc++;
		},
		stop: function() {
			stop++;
		}
	} );

	element.simulate( "drag", {
		dx: 10,
		dy: 10
	} );

	assert.equal( start, 1, "start callback should happen exactly once" );
	assert.equal( dragc, 3, "drag callback should happen exactly once per mousemove" );
	assert.equal( stop, 1, "stop callback should happen exactly once" );
} );

QUnit.test( "stopping the start callback", function( assert ) {
	assert.expect( 3 );

	var start = 0,
		stop = 0,
		dragc = 0;

	element.draggable( {
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
	} );

	element.simulate( "drag", {
		dx: 10,
		dy: 10
	} );

	assert.equal( start, 1, "start callback should happen exactly once" );
	assert.equal( dragc, 0, "drag callback should not happen at all" );
	assert.equal( stop, 0, "stop callback should not happen if there wasnt even a start" );
} );

QUnit.test( "stopping the drag callback", function( assert ) {
	assert.expect( 2 );

	var start = 0,
		stop = 0,
		dragc = 0;

	element.draggable( {
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
	} );

	element.simulate( "drag", {
		dx: 10,
		dy: 10
	} );

	assert.equal( start, 1, "start callback should happen exactly once" );
	assert.equal( stop, 1, "stop callback should happen, as we need to actively stop the drag" );
} );

QUnit.test( "stopping the stop callback", function( assert ) {
	assert.expect( 1 );

	element.draggable( {
		helper: "clone",
		stop: function() {
			return false;
		}
	} );

	element.simulate( "drag", {
		dx: 10,
		dy: 10
	} );

	assert.ok( element.draggable( "instance" ).helper, "the clone should not be deleted if the stop callback is stopped" );
} );

// http://bugs.jqueryui.com/ticket/6884
// Draggable: ui.offset.left differs between the "start" and "drag" hooks
QUnit.test( "position and offset in hash is consistent between start, drag, and stop", function( assert ) {
	assert.expect( 4 );

	var startPos, startOffset, dragPos, dragOffset, stopPos, stopOffset;

	element = $( "<div style='margin: 2px;'></div>" ).appendTo( "#qunit-fixture" );

	element.draggable( {
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
	} );

	element.simulate( "drag", {
		dx: 10,
		dy: 10,
		moves: 1
	} );

	startPos.left += 10;
	startPos.top += 10;
	startOffset.left += 10;
	startOffset.top += 10;

	assert.deepEqual( startPos, dragPos, "start position equals drag position plus distance" );
	assert.deepEqual( dragPos, stopPos, "drag position equals stop position" );
	assert.deepEqual( startOffset, dragOffset, "start offset equals drag offset plus distance" );
	assert.deepEqual( dragOffset, stopOffset, "drag offset equals stop offset" );
} );

} );
