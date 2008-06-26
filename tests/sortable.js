/*
 * draggable unit tests
 */
(function($) {
//
// Sortable Test Helper Functions
//
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

	el = $("#sortable").sortable();
	ok(true, '.sortable() called on element');

	$([]).sortable();
	ok(true, '.sortable() called on empty collection');

	$("<div/>").sortable();
	ok(true, '.sortable() called on disconnected DOMElement');

	$("<div/>").sortable().sortable("foo");
	ok(true, 'arbitrary method called after init');

	$("<div/>").sortable().data("foo.sortable");
	ok(true, 'arbitrary option getter after init');

	$("<div/>").sortable().data("foo.sortable", "bar");
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(6);

	$("#sortable").sortable().sortable("destroy");	
	ok(true, '.sortable("destroy") called on element');

	$([]).sortable().sortable("destroy");
	ok(true, '.sortable("destroy") called on empty collection');

	$("<div/>").sortable().sortable("destroy");
	ok(true, '.sortable("destroy") called on disconnected DOMElement');

	$("<div/>").sortable().sortable("destroy").sortable("foo");
	ok(true, 'arbitrary method called after destroy');

	$("<div/>").sortable().sortable("destroy").data("foo.sortable");
	ok(true, 'arbitrary option getter after destroy');

	$("<div/>").sortable().sortable("destroy").data("foo.sortable", "bar");
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
	el = $("#sortable").sortable();

	equals(el.data("helper.sortable"), "clone", "helper");
	equals(el.data("tolerance.sortable"), "guess", "tolerance");
	equals(el.data("distance.sortable"), 1, "distance");
	equals(el.data("disabled.sortable"), false, "disabled");
	equals(el.data("delay.sortable"), 0, "delay");
	equals(el.data("scroll.sortable"), true, "scroll");
	equals(el.data("scrollSensitivity.sortable"), 20, "scrollSensitivity");
	equals(el.data("scrollSpeed.sortable"), 20, "scrollSpeed");
	equals(el.data("cancel.sortable"), ":input", "cancel");
	equals(el.data("items.sortable"), "> *", "items");
	equals(el.data("zIndex.sortable"), 1000, "zIndex");	
	equals(el.data("dropOnEmpty.sortable"), true, "dropOnEmpty");
	equals(el.data("appendTo.sortable"), "parent", "appendTo");

});

test("#3019: Stop fires too early", function() {
	
	var helper = null;
	el = $("#sortable").sortable({ stop: function(e, ui) {
		helper = ui.helper;
	}});
	
	sort($("li", el)[0], 0, 40, 2, 'Dragging the sortable');
	equals(helper, null, "helper should be false");

});


})(jQuery);
