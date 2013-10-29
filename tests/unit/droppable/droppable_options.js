/*
 * droppable_options.js
 */
(function($) {

module("droppable: options");

/*
test("{ accept '*' }, default ", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("{ accept: Selector }", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("{ accept: function(draggable) }", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("activeClass", function() {
	ok(false, 'missing test - untested code is broken code');
});
*/
test("{ addClasses: true }, default", function() {
	expect( 1 );
	var el = $("<div></div>").droppable({ addClasses: true });
	ok(el.is(".ui-droppable"), "'ui-droppable' class added");
	el.droppable("destroy");
});

test("{ addClasses: false }", function() {
	expect( 1 );
	var el = $("<div></div>").droppable({ addClasses: false });
	ok(!el.is(".ui-droppable"), "'ui-droppable' class not added");
	el.droppable("destroy");
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
