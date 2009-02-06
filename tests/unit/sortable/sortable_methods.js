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

	$("<div></div>").sortable().data("foo.sortable");
	ok(true, 'arbitrary option getter after init');

	$("<div></div>").sortable().data("foo.sortable", "bar");
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(6);

	$("<div></div>").appendTo('body').sortable().sortable("destroy").remove();
	ok(true, '.sortable("destroy") called on element');

	$([]).sortable().sortable("destroy");
	ok(true, '.sortable("destroy") called on empty collection');

	$("<div></div>").sortable().sortable("destroy");
	ok(true, '.sortable("destroy") called on disconnected DOMElement');

	$("<div></div>").sortable().sortable("destroy").sortable("foo");
	ok(true, 'arbitrary method called after destroy');

	$("<div></div>").sortable().sortable("destroy").data("foo.sortable");
	ok(true, 'arbitrary option getter after destroy');

	$("<div></div>").sortable().sortable("destroy").data("foo.sortable", "bar");
	ok(true, 'arbitrary option setter after destroy');
});

test("enable", function() {
	expect(4);
	el = $("#sortable").sortable({ disabled: true });

	sort($("li", el)[0], 0, 40, 0, '.sortable({ disabled: true })');

	el.sortable("enable");
	equals(el.data("disabled.sortable"), false, "disabled.sortable getter");

	el.sortable("destroy");
	el.sortable({ disabled: true });
	el.data("disabled.sortable", false);
	equals(el.data("disabled.sortable"), false, "disabled.sortable setter");

	sort($("li", el)[0], 0, 40, 2, '.data("disabled.sortable", false)');
});

test("disable", function() {
	expect(5);
	el = $("#sortable").sortable({ disabled: false });
	sort($("li", el)[0], 0, 40, 2, '.sortable({ disabled: false })');

	el.sortable("disable");
	sort($("li", el)[0], 0, 40, 0, 'disabled.sortable getter');

	el.sortable("destroy");

	el.sortable({ disabled: false });
	sort($("li", el)[0], 0, 40, 2, '.sortable({ disabled: false })');
	el.data("disabled.sortable", true);
	equals(el.data("disabled.sortable"), true, "disabled.sortable setter");
	sort($("li", el)[0], 0, 40, 0, '.data("disabled.sortable", true)');
});

})(jQuery);
