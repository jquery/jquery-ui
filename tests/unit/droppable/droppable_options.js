/*
 * droppable_options.js
 */
(function($) {

module("droppable: options");

test("{ accept '*' }, default ", function() {

	expect( 1 );

	var droppable = $("#droppable1").droppable(),
		draggable = $("#draggable1").draggable();

	TestHelpers.droppable.shouldDrop( draggable, droppable, "Default" );

});

test("{ accept: Selector }", function() {
	expect( 3 );

	var target = $("#droppable1").droppable(),
		source = $("#draggable1").draggable();

	TestHelpers.droppable.shouldDrop( source, target, "Default" );

	target.droppable( "option", "accept", "#foo" );
	TestHelpers.droppable.shouldNotDrop( source, target, "Not correct selector" );

	target.droppable( "option", "accept", "#draggable1" );
	TestHelpers.droppable.shouldDrop( source, target, "Correct selector" );

});

test("{ accept: Function }", function() {

	expect( 5 );

	var target = $("#droppable1").droppable(),
		source = $("#draggable1").draggable(),
		counter = 0;

	function accept() {
		++counter;
		return ( counter%2 === 0 );
	}

	target.droppable( "option", "accept", accept );

	TestHelpers.droppable.shouldNotDrop( source, target, "Function returns false" );
	TestHelpers.droppable.shouldDrop( source, target, "Function returns true" );
	TestHelpers.droppable.shouldNotDrop( source, target, "Function returns false" );
	TestHelpers.droppable.shouldDrop( source, target, "Function returns true" );

	target.droppable( "option", "accept", "*" );
	TestHelpers.droppable.shouldDrop( source, target, "Reset back to *" );

});

test("activeClass", function() {

	expect( 6 );

	var target = $("#droppable1").droppable(),
		source = $("#draggable1").draggable(),
		myclass = "myclass",
		hasclass = false;

	source.on( "drag", function() {
		hasclass = target.hasClass( myclass );
	});

	TestHelpers.droppable.shouldDrop( source, target );
	equal( hasclass, false, "Option not set yet" );

	target.droppable( "option", "activeClass", myclass );
	TestHelpers.droppable.shouldDrop( source, target );
	equal( hasclass, true, "Option set" );

	target.droppable( "option", "activeClass", false );
	TestHelpers.droppable.shouldDrop( source, target );
	equal( hasclass, false, "Option unset" );

});

test( "scope", function() {
	expect( 4 );
	var droppableOffset, draggableOffset, oldDraggableOffset, dx, dy,
			draggable1 = $("<div></div>").appendTo( "#qunit-fixture" ).draggable({ revert: "invalid" }),
			draggable2 = $("<div></div>").appendTo( "#qunit-fixture" ).droppable(),
			droppable = $("<div></div>").appendTo( "#qunit-fixture" ).droppable(),
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
	});

	draggableOffset = draggable1.offset();
	equal( draggableOffset.left, droppableOffset.left );
	equal( draggableOffset.top, droppableOffset.top );

	// Test that droppable doesn't accept draggable with old scope.
	draggableOffset = draggable2.offset();
	dx = droppableOffset.left - draggableOffset.left;
	dy = droppableOffset.top - draggableOffset.top;
	oldDraggableOffset = draggableOffset;

	draggable2.simulate( "drag", {
		dx: dx,
		dy: dy
	});

	draggableOffset = draggable2.offset();
	equal( draggableOffset.left, oldDraggableOffset.left );
	equal( draggableOffset.top, oldDraggableOffset.top );
});
/*

test("greedy", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("hoverClass", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("tolerance, fit", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("tolerance, intersect", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("tolerance, pointer", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("tolerance, touch", function() {
	ok(false, 'missing test - untested code is broken code');
});
*/
})(jQuery);
