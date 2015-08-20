define( [
	"jquery",
	"./helper",
	"ui/widgets/droppable"
], function( $, testHelper ) {

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
	testHelper.shouldNotDrop();
	el.droppable("enable");
	testHelper.shouldDrop();
	equal(el.droppable("option", "disabled"), false, "disabled option getter");
	el.droppable("destroy");
	el.droppable({ disabled: true });
	testHelper.shouldNotDrop();
	el.droppable("option", "disabled", false);
	equal(el.droppable("option", "disabled"), false, "disabled option setter");
	testHelper.shouldDrop();

	expected = $("<div></div>").droppable(),
	actual = expected.droppable("enable");
	equal(actual, expected, "enable is chainable");
});

test( "disable", function( assert ) {
	expect( 10 );

	var actual, expected,
		element = $( "#droppable1" ).droppable({ disabled: false });

	testHelper.shouldDrop();
	element.droppable( "disable" );
	testHelper.shouldNotDrop();
	equal( element.droppable( "option", "disabled" ), true, "disabled option getter" );
	element.droppable( "destroy" );
	element.droppable({ disabled: false });
	testHelper.shouldDrop();
	element.droppable( "option", "disabled", true );
	assert.lacksClasses( element.droppable( "widget" ), "ui-state-disabled" );
	ok( !element.droppable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.droppable( "widget" ), "ui-droppable-disabled" );
	equal( element.droppable( "option", "disabled" ), true, "disabled option setter" );
	testHelper.shouldNotDrop();

	expected = $( "<div></div>" ).droppable();
	actual = expected.droppable( "disable" );
	equal( actual, expected, "disable is chainable" );
});

} );
