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

	$("<div></div>").droppable().data("foo.droppable");
	ok(true, 'arbitrary option getter after init');

	$("<div></div>").droppable().data("foo.droppable", "bar");
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(7);

	$("<div></div>").appendTo('body').droppable().droppable("destroy").remove();
	ok(true, '.droppable("destroy") called on element');

	$([]).droppable().droppable("destroy");
	ok(true, '.droppable("destroy") called on empty collection');

	$("<div></div>").droppable().droppable("destroy");
	ok(true, '.droppable("destroy") called on disconnected DOMElement');

	$("<div></div>").droppable().droppable("destroy").droppable("foo");
	ok(true, 'arbitrary method called after destroy');

	$("<div></div>").droppable().droppable("destroy").data("foo.droppable");
	ok(true, 'arbitrary option getter after destroy');

	$("<div></div>").droppable().droppable("destroy").data("foo.droppable", "bar");
	ok(true, 'arbitrary option setter after destroy');
	
	var expected = $('<div></div>').droppable(),
		actual = expected.droppable('destroy');
	equals(actual, expected, 'destroy is chainable');
});

test("enable", function() {
	expect(7);
	el = $("#droppable1").droppable({ disabled: true });
	shouldNotBeDroppable();
	el.droppable("enable");
	shouldBeDroppable();
	equals(el.data("disabled.droppable"), false, "disabled.droppable getter");
	el.droppable("destroy");
	el.droppable({ disabled: true });
	shouldNotBeDroppable();
	el.data("disabled.droppable", false);
	equals(el.data("disabled.droppable"), false, "disabled.droppable setter");
	shouldBeDroppable();
	
	var expected = $('<div></div>').droppable(),
		actual = expected.droppable('enable');
	equals(actual, expected, 'enable is chainable');
});

test("disable", function() {
	expect(7);
	el = $("#droppable1").droppable({ disabled: false });
	shouldBeDroppable();
	el.droppable("disable");
	shouldNotBeDroppable();
	equals(el.data("disabled.droppable"), true, "disabled.droppable getter");
	el.droppable("destroy");
	el.droppable({ disabled: false });
	shouldBeDroppable();
	el.data("disabled.droppable", true);
	equals(el.data("disabled.droppable"), true, "disabled.droppable setter");
	shouldNotBeDroppable();
	
	var expected = $('<div></div>').droppable(),
		actual = expected.droppable('disable');
	equals(actual, expected, 'disable is chainable');
});

})(jQuery);
