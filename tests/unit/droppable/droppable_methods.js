/*
 * droppable_methods.js
 */
(function($) {

module("droppable: methods");

test("init", function() {
	expect( 5 );

	$("<div></div>").appendTo("body").droppable().remove();
	ok(true, ".droppable() called on element");

	$([]).droppable();
	ok(true, ".droppable() called on empty collection");

	$("<div></div>").droppable();
	ok(true, ".droppable() called on disconnected DOMElement");

	$("<div></div>").droppable().droppable("option", "foo");
	ok(true, "arbitrary option getter after init");

	$("<div></div>").droppable().droppable("option", "foo", "bar");
	ok(true, "arbitrary option setter after init");
});

test("destroy", function() {
	expect( 4 );

	$("<div></div>").appendTo("body").droppable().droppable("destroy").remove();
	ok(true, ".droppable('destroy') called on element");

	$([]).droppable().droppable("destroy");
	ok(true, ".droppable('destroy') called on empty collection");

	$("<div></div>").droppable().droppable("destroy");
	ok(true, ".droppable('destroy') called on disconnected DOMElement");

	var expected = $("<div></div>").droppable(),
		actual = expected.droppable("destroy");
	equal(actual, expected, "destroy is chainable");
});

test("enable", function() {
	expect(7);

	var el, expected, actual;

	el = $("#droppable1").droppable({ disabled: true });
	TestHelpers.droppable.shouldNotDrop();
	el.droppable("enable");
	TestHelpers.droppable.shouldDrop();
	equal(el.droppable("option", "disabled"), false, "disabled option getter");
	el.droppable("destroy");
	el.droppable({ disabled: true });
	TestHelpers.droppable.shouldNotDrop();
	el.droppable("option", "disabled", false);
	equal(el.droppable("option", "disabled"), false, "disabled option setter");
	TestHelpers.droppable.shouldDrop();

	expected = $("<div></div>").droppable(),
	actual = expected.droppable("enable");
	equal(actual, expected, "enable is chainable");
});

test( "disable", function() {
	expect( 10 );

	var actual, expected,
		element = $( "#droppable1" ).droppable({ disabled: false });

	TestHelpers.droppable.shouldDrop();
	element.droppable( "disable" );
	TestHelpers.droppable.shouldNotDrop();
	equal( element.droppable( "option", "disabled" ), true, "disabled option getter" );
	element.droppable( "destroy" );
	element.droppable({ disabled: false });
	TestHelpers.droppable.shouldDrop();
	element.droppable( "option", "disabled", true );
	ok( !element.droppable( "widget" ).hasClass( "ui-state-disabled" ), "element does not get ui-state-disabled" );
	ok( !element.droppable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	ok( element.droppable( "widget" ).hasClass( "ui-droppable-disabled" ), "element gets ui-droppable-disabled" );
	equal( element.droppable( "option", "disabled" ), true, "disabled option setter" );
	TestHelpers.droppable.shouldNotDrop();

	expected = $( "<div></div>" ).droppable();
	actual = expected.droppable( "disable" );
	equal( actual, expected, "disable is chainable" );
});

test("intersect", function() {
	expect(8);

  var draggable = $("<div></div>").appendTo("body").draggable();
  var droppable = $("<div></div>").appendTo("body").droppable();
  
  $(droppable).width(10).height(10);
  $(draggable).width(10).height(10);
  $(droppable).offset({top: 5, left: 5});
  
  $(draggable).simulate("drag", {dx: (-1 - $(draggable).position().left), dy: (-1 - $(draggable).position().top)});
  var actual = $.ui.intersect($(draggable).data('ui-draggable'), $(droppable).data('ui-droppable'), "pointer");
  var expected = false;
  equal(actual, expected, "no intersection - too far up and left");
  
  $(draggable).simulate("drag", {dx: (-1 - $(draggable).position().left), dy: (0 - $(draggable).position().top)});
  actual = $.ui.intersect($(draggable).data('ui-draggable'), $(droppable).data('ui-droppable'), "pointer");
  expected = false;
  equal(actual, expected, "no intersection - too far left");
  
  $(draggable).simulate("drag", {dx: (0 - $(draggable).position().left), dy: (-1 - $(draggable).position().top)});
  actual = $.ui.intersect($(draggable).data('ui-draggable'), $(droppable).data('ui-droppable'), "pointer");
  expected = false;
  equal(actual, expected, "no intersection - too far up");
  
  $(draggable).simulate("drag", {dx: (0 - $(draggable).position().left), dy: (0 - $(draggable).position().top)});
  actual = $.ui.intersect($(draggable).data('ui-draggable'), $(droppable).data('ui-droppable'), "pointer");
  expected = true;
  equal(actual, expected, "intersection - top left corner");
  
  $(draggable).simulate("drag", {dx: (9 - $(draggable).position().left), dy: (9 - $(draggable).position().top)});
  actual = $.ui.intersect($(draggable).data('ui-draggable'), $(droppable).data('ui-droppable'), "pointer");
  expected = true;
  equal(actual, expected, "intersection - bottom right corner");
  
  $(draggable).simulate("drag", {dx: (10 - $(draggable).position().left), dy: (9 - $(draggable).position().top)});
  actual = $.ui.intersect($(draggable).data('ui-draggable'), $(droppable).data('ui-droppable'), "pointer");
  expected = false;
  equal(actual, expected, "no intersection - too far right");
  
  $(draggable).simulate("drag", {dx: (9 - $(draggable).position().left), dy: (10 - $(draggable).position().top)});
  actual = $.ui.intersect($(draggable).data('ui-draggable'), $(droppable).data('ui-droppable'), "pointer");
  expected = false;
  equal(actual, expected, "no intersection - too far down");
  
  $(draggable).simulate("drag", {dx: (10 - $(draggable).position().left), dy: (10 - $(draggable).position().top)});
  actual = $.ui.intersect($(draggable).data('ui-draggable'), $(droppable).data('ui-droppable'), "pointer");
  expected = false;
  equal(actual, expected, "no intersection - too far down and right");
});

})(jQuery);
