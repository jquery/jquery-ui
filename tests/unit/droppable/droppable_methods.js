/*
 * droppable_methods.js
 */
(function($) {

module("droppable: methods");

test("init", function() {
	expect(6);

	$("<div></div>").appendTo('body').droppable().remove();
	ok(true, '.droppable() called on element');

	$([]).droppable();
	ok(true, '.droppable() called on empty collection');

	$("<div></div>").droppable();
	ok(true, '.droppable() called on disconnected DOMElement');

	$("<div></div>").droppable().droppable("foo");
	ok(true, 'arbitrary method called after init');

	$("<div></div>").droppable().droppable("option", "foo");
	ok(true, 'arbitrary option getter after init');

	$("<div></div>").droppable().droppable("option", "foo", "bar");
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	$("<div></div>").appendTo('body').droppable().droppable("destroy").remove();
	ok(true, '.droppable("destroy") called on element');

	$([]).droppable().droppable("destroy");
	ok(true, '.droppable("destroy") called on empty collection');

	$("<div></div>").droppable().droppable("destroy");
	ok(true, '.droppable("destroy") called on disconnected DOMElement');

	$("<div></div>").droppable().droppable("destroy").droppable("foo");
	ok(true, 'arbitrary method called after destroy');
	
	var expected = $('<div></div>').droppable(),
		actual = expected.droppable('destroy');
	equals(actual, expected, 'destroy is chainable');
});

})(jQuery);
