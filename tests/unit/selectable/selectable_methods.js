/*
 * selectable_methods.js
 */
(function($) {

module("selectable: methods");

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

})(jQuery);
