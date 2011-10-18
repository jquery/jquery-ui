/*
 * sortable_methods.js
 */
(function($) {

var el, offsetBefore, offsetAfter, dragged;

var drag = function(handle, dx, dy) {
	offsetBefore = $(handle).offset();
	$(handle).simulate("drag", {
		dx: dx || 0,
		dy: dy || 0
	});
	dragged = { dx: dx, dy: dy };
	offsetAfter = $(handle).offset();
}

var sort = function(handle, dx, dy, index, msg) {
	drag(handle, dx, dy);
	equals($(handle).parent().children().index(handle), index, msg);
}

module("sortable: methods");

test("init", function() {
	expect(6);

	$("<div></div>").appendTo('body').sortable().remove();
	ok(true, '.sortable() called on element');

	$([]).sortable();
	ok(true, '.sortable() called on empty collection');

	$("<div></div>").sortable();
	ok(true, '.sortable() called on disconnected DOMElement');

	$("<div></div>").sortable().sortable("foo");
	ok(true, 'arbitrary method called after init');

	$("<div></div>").sortable().sortable("option", "foo");
	ok(true, 'arbitrary option getter after init');

	$("<div></div>").sortable().sortable("option", "foo", "bar");
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	$("<div></div>").appendTo('body').sortable().sortable("destroy").remove();
	ok(true, '.sortable("destroy") called on element');

	$([]).sortable().sortable("destroy");
	ok(true, '.sortable("destroy") called on empty collection');

	$("<div></div>").sortable().sortable("destroy");
	ok(true, '.sortable("destroy") called on disconnected DOMElement');

	$("<div></div>").sortable().sortable("destroy").sortable("foo");
	ok(true, 'arbitrary method called after destroy');

	var expected = $('<div></div>').sortable(),
		actual = expected.sortable('destroy');
	equals(actual, expected, 'destroy is chainable');
});

test("enable", function() {
	expect(4);
	el = $("#sortable").sortable({ disabled: true });

	sort($("li", el)[0], 0, 40, 0, '.sortable({ disabled: true })');

	el.sortable("enable");
	equals(el.sortable("option", "disabled"), false, "disabled option getter");

	el.sortable("destroy");
	el.sortable({ disabled: true });
	el.sortable("option", "disabled", false);
	equals(el.sortable("option", "disabled"), false, "disabled option setter");

//	sort($("li", el)[0], 0, 40, 2, '.sortable("option", "disabled", false)');
	
	var expected = $('<div></div>').sortable(),
		actual = expected.sortable('enable');
	equals(actual, expected, 'enable is chainable');
});

test("disable", function() {
	expect(6);
	el = $("#sortable").sortable({ disabled: false });
	sort($("li", el)[0], 0, 40, 2, '.sortable({ disabled: false })');

	el.sortable("disable");
	sort($("li", el)[0], 0, 40, 0, 'disabled.sortable getter');

	el.sortable("destroy");

	el.sortable({ disabled: false });
//	sort($("li", el)[0], 0, 40, 2, '.sortable({ disabled: false })');
	el.sortable("option", "disabled", true);
	equals(el.sortable("option", "disabled"), true, "disabled option setter");
	ok(el.sortable("widget").is(":not(.ui-state-disabled)"), "sortable element does not get ui-state-disabled since it's an interaction");
	sort($("li", el)[0], 0, 40, 0, '.sortable("option", "disabled", true)');
	
	var expected = $('<div></div>').sortable(),
		actual = expected.sortable('disable');
	equals(actual, expected, 'disable is chainable');
});

})(jQuery);
