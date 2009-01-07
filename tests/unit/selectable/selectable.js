/*
 * selectable unit tests
 */
(function($) {
//
// Selectable Test Helper Functions
//

var defaults = {
	autoRefresh: true,
	disabled: false,
	filter: '*'
};

var el;

var drag = function(dx, dy) {
	var off = el.offset(), pos = { clientX: off.left, clientY: off.top };
	el.simulate("mousedown", pos);
	$(document).simulate("mousemove", pos);
	pos.clientX += dx;
	pos.clientY += dy;
	$(document).simulate("mousemove", pos);
	$(document).simulate("mouseup", pos);
}

var border = function(el, side) { return parseInt(el.css('border-' + side + '-width')); }

var margin = function(el, side) { return parseInt(el.css('margin-' + side)); }

// Selectable Tests
module("selectable");

test("init", function() {
	expect(6);

	$("<div></div>").appendTo('body').selectable().remove();
	ok(true, '.selectable() called on element');

	$([]).selectable().remove();
	ok(true, '.selectable() called on empty collection');

	$("<div></div>").selectable().remove();
	ok(true, '.selectable() called on disconnected DOMElement');

	$("<div></div>").selectable().selectable("foo").remove();
	ok(true, 'arbitrary method called after init');

	el = $("<div></div>").selectable()
	var foo = el.data("foo.selectable");
	el.remove();
	ok(true, 'arbitrary option getter after init');

	$("<div></div>").selectable().data("foo.selectable", "bar").remove();
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(6);

	$("<div></div>").appendTo('body').selectable().selectable("destroy").remove();
	ok(true, '.selectable("destroy") called on element');

	$([]).selectable().selectable("destroy").remove();
	ok(true, '.selectable("destroy") called on empty collection');

	$("<div></div>").selectable().selectable("destroy").remove();
	ok(true, '.selectable("destroy") called on disconnected DOMElement');

	$("<div></div>").selectable().selectable("destroy").selectable("foo").remove();
	ok(true, 'arbitrary method called after destroy');

	el = $("<div></div>").selectable();
	var foo = el.selectable("destroy").data("foo.selectable");
	el.remove();
	ok(true, 'arbitrary option getter after destroy');

	$("<div></div>").selectable().selectable("destroy").data("foo.selectable", "bar").remove();
	ok(true, 'arbitrary option setter after destroy');
});

test("defaults", function() {
	el = $('<div></div>').selectable();
	$.each(defaults, function(key, val) {
		var actual = el.data(key + ".selectable"), expected = val;
		same(actual, expected, key);
	});
	el.remove();
});

module("selectable: Options");

test("autoRefresh", function() {
	expect(3);
	el = $("#selectable1");
	var actual, sel = $("*", el), selected = function() { actual += 1 };

	actual = 0;
	el = $("#selectable1").selectable({ autoRefresh: false,	selected: selected });
	sel.hide();
	drag(1000, 1000);
	equals(actual, sel.length);
	el.selectable("destroy");

	actual = 0;
	sel.show();
	el = $("#selectable1").selectable({ autoRefresh: true,	selected: selected });
	sel.hide();
	drag(1000, 1000);
	equals(actual, 0);
	sel.show();
	drag(1000, 1000);
	equals(actual, sel.length);
	el.selectable("destroy");
	sel.show();
});

test("filter", function() {
	expect(2);
	el = $("#selectable1");
	var actual, sel = $("*", el), selected = function() { actual += 1 };

	actual = 0;
	el = $("#selectable1").selectable({ filter: '.special', selected: selected });
	drag(1000, 1000);
	ok(sel.length != 1, "this test assumes more than 1 selectee");
	equals(actual, 1);
	el.selectable("destroy");
});

module("selectable: Methods");

test("disable", function() {
	expect(2);
	var fired = false;

	el = $("#selectable1");
	el.selectable({
		disabled: false,
		start: function() { fired = true; }
	});
	el.simulate("drag", 20, 20);
	equals(fired, true, "start fired");
	el.selectable("disable");
	fired = false;
	el.simulate("drag", 20, 20);
	equals(fired, false, "start fired");
	el.selectable("destroy");
});

test("enable", function() {
	expect(2);
	var fired = false;

	el = $("#selectable1");
	el.selectable({
		disabled: true,
		start: function() { fired = true; }
	});
	el.simulate("drag", 20, 20);
	equals(fired, false, "start fired");
	el.selectable("enable");
	el.simulate("drag", 20, 20);
	equals(fired, true, "start fired");
	el.selectable("destroy");
});

module("selectable: Callbacks");

test("start", function() {
	expect(2);
	el = $("#selectable1");
	el.selectable({
		start: function(ev, ui) {
			ok(true, "drag fired start callback");
			equals(this, el[0], "context of callback");
		}
	});
	el.simulate("drag", 20, 20);
});

test("stop", function() {
	expect(2);
	el = $("#selectable1");
	el.selectable({
		start: function(ev, ui) {
			ok(true, "drag fired stop callback");
			equals(this, el[0], "context of callback");
		}
	});
	el.simulate("drag", 20, 20);
});

module("selectable: Tickets");

})(jQuery);
