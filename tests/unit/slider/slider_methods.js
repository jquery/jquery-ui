/*
 * slider_methods.js
 */
(function($) {

module("slider: methods");

test("init", function() {
	expect(6);

	$("<div></div>").appendTo('body').slider().remove();
	ok(true, '.slider() called on element');

	$([]).slider().remove();
	ok(true, '.slider() called on empty collection');

	$('<div></div>').slider().remove();
	ok(true, '.slider() called on disconnected DOMElement');

	$('<div></div>').slider().slider("foo").remove();
	ok(true, 'arbitrary method called after init');

	el = $('<div></div>').slider();
	var foo = el.data("foo.slider");
	el.remove();
	ok(true, 'arbitrary option getter after init');

	$('<div></div>').slider().data("foo.slider", "bar").remove();
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(9);

	$("<div></div>").appendTo('body').slider().slider("destroy").remove();
	ok(true, '.slider("destroy") called on element');

	$([]).slider().slider("destroy").remove();
	ok(true, '.slider("destroy") called on empty collection');

	$('<div></div>').appendTo('body').remove().slider().slider("destroy").remove();
	ok(true, '.slider("destroy") called on disconnected DOMElement');

	$('<div></div>').slider().slider("destroy").slider("foo").remove();
	ok(true, 'arbitrary method called after destroy');

	el = $('<div></div>').slider();
	var foo = el.slider("destroy").data("foo.slider");
	el.remove();
	ok(true, 'arbitrary option getter (.data) after destroy');

	el = $('<div></div>').slider();
	var foo = el.slider("destroy").slider("option", "foo");
	el.remove();
	ok(true, 'arbitrary option getter (.slider option method) after destroy');

	$('<div></div>').slider().slider("destroy").data("foo.slider", "bar").remove();
	ok(true, 'arbitrary option setter (.data) after destroy');

	$('<div></div>').slider().slider("destroy").slider("options", "foo", "bar").remove();
	ok(true, 'arbitrary option setter (.slider option method) after destroy');
	
	var expected = $('<div></div>').slider(),
		actual = expected.slider('destroy');
	equals(actual, expected, 'destroy is chainable');
});

test("enable", function() {
	var expected = $('<div></div>').slider(),
		actual = expected.slider('enable');
	equals(actual, expected, 'enable is chainable');
	ok(false, "missing test - untested code is broken code.");
});

test("disable", function() {
	var expected = $('<div></div>').slider(),
		actual = expected.slider('disable');
	equals(actual, expected, 'disable is chainable');
	ok(false, "missing test - untested code is broken code.");
});

test("value", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("values", function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
