/*
 * sortable unit tests
 */
(function($) {
//
// Sortable Test Helper Functions
//

var defaults = {
	appendTo: "parent",
	cancel: ":input",
	delay: 0,
	disabled: false,
	distance: 1,
	dropOnEmpty: true,
	helper: "original",
	items: "> *",
	scroll: true,
	scrollSensitivity: 20,
	scrollSpeed: 20,
	tolerance: "guess",
	zIndex: 1000
};

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

var border = function(el, side) { return parseInt(el.css('border-' + side + '-width')); }
var margin = function(el, side) { return parseInt(el.css('margin-' + side)); }

// Sortable Tests
module("sortable");

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

test("defaults", function() {
	el = $('<div></div>').sortable();
	$.each(defaults, function(key, val) {
		var actual = el.data(key + ".sortable"), expected = val;
		same(actual, expected, key);
	});
	el.remove();
});

test("#3019: Stop fires too early", function() {

	var helper = null;
	el = $("#sortable").sortable({ stop: function(event, ui) {
		helper = ui.helper;
	}});

	sort($("li", el)[0], 0, 40, 2, 'Dragging the sortable');
	equals(helper, null, "helper should be false");

});


})(jQuery);
