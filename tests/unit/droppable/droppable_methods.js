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

test( "intersect", function() {
	expect( 8 );

	var actual, data,
		draggable = $( "<div />" ).appendTo( "#qunit-fixture" ).css({ width: 10, height: 10, position: "absolute" }).draggable(),
		droppable = $( "<div />" ).appendTo( "#qunit-fixture" ).css({ width: 10, height: 10, position: "absolute", top: 5, left: 5 }).droppable(),
		dataset = [
			[ -1, -1, false, "too far up and left" ],
			[ -1, 0, false, "too far left" ],
			[ 0, -1, false, "too far up" ],
			[ 0, 0, true, "top left corner" ],
			[ 9, 9, true, "bottom right corner" ],
			[ 10, 9, false, "too far right" ],
			[ 9, 10, false, "too far down" ],
			[ 10, 10, false, "too far down and right" ]
		],
		x = 0;

	for ( ; x < dataset.length; x++ ) {
		data = dataset[ x ];
		$( draggable ).simulate( "drag", {
			dx: ( data[ 0 ] - $( draggable ).position().left ),
			dy: ( data[ 1 ] - $( draggable ).position().top )
		});
		actual = $.ui.intersect( $( draggable ).draggable( "instance" ), $( droppable ).droppable( "instance" ), "pointer" );
		equal( actual, data[ 2 ], data[ 3 ] );
	}
});

})( jQuery );
