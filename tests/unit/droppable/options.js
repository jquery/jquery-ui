define( [
	"qunit",
	"jquery",
	"ui/widgets/droppable"
], function( QUnit, $ ) {

QUnit.module( "droppable: options" );

/*
Test( "{ accept '*' }, default ", function() {
	ok(false, 'missing test - untested code is broken code');
});

test( "{ accept: Selector }", function() {
	ok(false, 'missing test - untested code is broken code');
});

test( "{ accept: function(draggable) }", function() {
	ok(false, 'missing test - untested code is broken code');
});

test( "activeClass", function() {
	ok(false, 'missing test - untested code is broken code');
});
*/
QUnit.test( "{ addClasses: true }, default", function( assert ) {
	assert.expect( 1 );
	var el = $( "<div />" ).droppable( { addClasses: true } );
	assert.hasClasses( el, "ui-droppable" );
	el.droppable( "destroy" );
} );

QUnit.test( "{ addClasses: false }", function( assert ) {
	assert.expect( 1 );
	var el = $( "<div />" ).droppable( { addClasses: false } );

	assert.lacksClasses( el, "ui-droppable" );
	el.droppable( "destroy" );
} );

QUnit.test( "scope", function( assert ) {
	assert.expect( 4 );
	var droppableOffset, draggableOffset, oldDraggableOffset, dx, dy,
		draggable1 = $( "<div />" ).appendTo( "#qunit-fixture" ).draggable( { revert: "invalid" } ),
		draggable2 = $( "<div />" ).appendTo( "#qunit-fixture" ).droppable(),
		droppable = $( "<div />" ).appendTo( "#qunit-fixture" ).droppable(),
		newScope = "test";

	draggable1.draggable( "option", "scope", newScope );
	droppable.droppable( "option", "scope", newScope );

	// Test that droppable accepts draggable with new scope.
	droppableOffset = droppable.offset();
	draggableOffset = draggable1.offset();
	dx = droppableOffset.left - draggableOffset.left;
	dy = droppableOffset.top - draggableOffset.top;

	draggable1.simulate( "drag", {
		dx: dx,
		dy: dy
	} );

	draggableOffset = draggable1.offset();
	assert.equal( draggableOffset.left, droppableOffset.left );
	assert.equal( draggableOffset.top, droppableOffset.top );

	// Test that droppable doesn't accept draggable with old scope.
	draggableOffset = draggable2.offset();
	dx = droppableOffset.left - draggableOffset.left;
	dy = droppableOffset.top - draggableOffset.top;
	oldDraggableOffset = draggableOffset;

	draggable2.simulate( "drag", {
		dx: dx,
		dy: dy
	} );

	draggableOffset = draggable2.offset();
	assert.equal( draggableOffset.left, oldDraggableOffset.left );
	assert.equal( draggableOffset.top, oldDraggableOffset.top );
} );
/*
Test( "greedy", function() {
	ok(false, 'missing test - untested code is broken code');
});

test( "hoverClass", function() {
	ok(false, 'missing test - untested code is broken code');
});

test( "tolerance, fit", function() {
	ok(false, 'missing test - untested code is broken code');
});
*/

QUnit.test( "tolerance, intersect", function( assert ) {
	assert.expect( 2 );

	var draggable, droppable,
		dataset = [
			[ 0, 0, false, "too far up and left" ],
			[ 6, 0, false, "too far up" ],
			[ 0, 6, false, "too far left" ],
			[ 6, 6, true, "top left corner" ],
			[ 14, 14, true, "bottom right corner" ],
			[ 15, 6, false, "too far right" ],
			[ 6, 15, false, "too far down" ],
			[ 15, 15, false, "too far down and right" ]
		];

	draggable = $( "<div />" )
		.appendTo( "#qunit-fixture" )
		.css( {
			width: 10,
			height: 10,
			position: "absolute",

			// Http://bugs.jqueryui.com/ticket/6876
			// Droppable: droppable region is offset by draggables margin
			marginTop: 3,
			marginLeft: 3
		} )
		.draggable();

	droppable = $( "<div />" )
		.appendTo( "#qunit-fixture" )
		.css( { width: 10, height: 10, position: "absolute", top: 13, left: 13 } )
		.droppable( { tolerance: "intersect" } );

	$.each( dataset, function() {
		var data = this;

		draggable.css( {
			top: 0,
			left: 0
		} );

		droppable.off( "drop" ).on( "drop", function() {
			assert.equal( true, data[ 2 ], data[ 3 ] );
		} );

		$( draggable ).simulate( "drag", {
			dx: data[ 0 ],
			dy: data[ 1 ]
		} );
	} );
} );

QUnit.test( "tolerance, pointer", function( assert ) {
	assert.expect( 3 );

	var draggable, droppable,
		dataset = [
			[ -1, -1, false, "too far up and left" ],
			[ -1, 0, false, "too far left" ],
			[ 0, -1, false, "too far up" ],
			[ 0, 0, true, "top left corner" ],
			[ 9, 9, true, "bottom right corner" ],
			[ 10, 9, false, "too far right" ],
			[ 9, 10, false, "too far down" ],
			[ 10, 10, false, "too far down and right" ]
		];

	draggable = $( "<div />" )
		.appendTo( "#qunit-fixture" )
		.css( { width: 10, height: 10, position: "absolute" } )
		.draggable();

	droppable = $( "<div />" )
		.appendTo( "#qunit-fixture" )
		.css( { width: 10, height: 10, position: "absolute", top: 5, left: 5 } )
		.droppable( { tolerance: "pointer" } );

	$.each( dataset, function() {
		var data = this;

		droppable.off( "drop" ).on( "drop", function() {
			assert.equal( true, data[ 2 ], data[ 3 ] );
		} );

		$( draggable ).simulate( "drag", {
			dx: ( data[ 0 ] - $( draggable ).position().left ),
			dy: ( data[ 1 ] - $( draggable ).position().top )
		} );
	} );

	// Http://bugs.jqueryui.com/ticket/4977 - tolerance, pointer - bug when pointer outside draggable
	draggable.css( { top: 0, left: 0 } ).draggable( "option", "axis", "x" );
	droppable.css( { top: 15, left: 15 } );

	droppable.off( "drop" ).on( "drop", function() {
		assert.ok( true, "drop fires as long as pointer is within droppable" );
	} );

	$( draggable ).simulate( "drag", {
		dx: 10,
		dy: 10
	} );
} );

/*
Test( "tolerance, touch", function() {
	ok(false, 'missing test - untested code is broken code');
});
*/
} );
