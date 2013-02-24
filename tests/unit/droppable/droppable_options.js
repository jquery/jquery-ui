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


/*

test("greedy", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("hoverClass", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("scope", function() {
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
