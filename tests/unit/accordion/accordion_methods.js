/*
 * accordion_methods.js
 */
(function($) {

function state(accordion) {
	var expected = $.makeArray(arguments).slice(1);
	var actual = [];
	$.each(expected, function(i, n) {
		actual.push( accordion.find(".ui-accordion-content").eq(i).is(":visible") ? 1 : 0 );
	});
	same(actual, expected)
}

module("accordion: methods");

test("init", function() {
	$("<div></div>").appendTo('body').accordion().remove();
	ok(true, '.accordion() called on element');

	$([]).accordion().remove();
	ok(true, '.accordion() called on empty collection');

	$('<div></div>').accordion().remove();
	ok(true, '.accordion() called on disconnected DOMElement - never connected');

	$('<div></div>').appendTo('body').remove().accordion().remove();
	ok(true, '.accordion() called on disconnected DOMElement - removed');

	$('<div></div>').accordion().accordion("foo").remove();
	ok(true, 'arbitrary method called after init');

	var el = $('<div></div>').accordion();
	var foo = el.accordion("option", "foo");
	el.remove();
	ok(true, 'arbitrary option getter after init');

	$('<div></div>').accordion().accordion("option", "foo", "bar").remove();
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	$("<div></div>").appendTo('body').accordion().accordion("destroy").remove();
	ok(true, '.accordion("destroy") called on element');

	$([]).accordion().accordion("destroy").remove();
	ok(true, '.accordion("destroy") called on empty collection');

	$('<div></div>').accordion().accordion("destroy").remove();
	ok(true, '.accordion("destroy") called on disconnected DOMElement');

	$('<div></div>').accordion().accordion("destroy").accordion("foo").remove();
	ok(true, 'arbitrary method called after destroy');

	var expected = $('<div></div>').accordion(),
		actual = expected.accordion('destroy');
	equals(actual, expected, 'destroy is chainable');
});

test("enable", function() {
	var expected = $('#list1').accordion(),
		actual = expected.accordion('enable');
	equals(actual, expected, 'enable is chainable');
	state(expected, 1, 0, 0)
});

test("disable", function() {
	var expected = $('#list1').accordion(),
		actual = expected.accordion('disable');
	equals(actual, expected, 'disable is chainable');
	
	state(expected, 1, 0, 0)
	expected.accordion("activate", 1);
	state(expected, 1, 0, 0)
	expected.accordion("enable");
	expected.accordion("activate", 1);
	state(expected, 0, 1, 0)
});

test("activate", function() {
	var expected = $('#list1').accordion(),
		actual = expected.accordion('activate', 2);
	equals(actual, expected, 'activate is chainable');
});

test("activate, numeric", function() {
	var ac = $('#list1').accordion({ active: 1 });
	state(ac, 0, 1, 0);
	ac.accordion("activate", 2);
	state(ac, 0, 0, 1);
	ac.accordion("activate", 0);
	state(ac, 1, 0, 0);
	ac.accordion("activate", 1);
	state(ac, 0, 1, 0);
	ac.accordion("activate", 2);
	state(ac, 0, 0, 1);
});

test("activate, boolean and numeric, collapsible:true", function() {
	var ac = $('#list1').accordion({collapsible: true}).accordion("activate", 2);
	state(ac, 0, 0, 1);
	ok("x", "----");
	ac.accordion("activate", 0);
	state(ac, 1, 0, 0);
	ok("x", "----");
	ac.accordion("activate", -1);
	state(ac, 0, 0, 0);
});

test("activate, boolean, collapsible: false", function() {
	var ac = $('#list1').accordion().accordion("activate", 2);
	state(ac, 0, 0, 1);
	ac.accordion("activate", false);
	state(ac, 0, 0, 1);
});

test("activate, string expression", function() {
	var ac = $('#list1').accordion({ active: "a:last" });
	state(ac, 0, 0, 1);
	ac.accordion("activate", ":first");
	state(ac, 1, 0, 0);
	ac.accordion("activate", ":eq(1)");
	state(ac, 0, 1, 0);
	ac.accordion("activate", ":last");
	state(ac, 0, 0, 1);
});
//[ 0, 1, 1 ] result: [ 0, 0, 1 ]
//[   0,   1,   1] result: [   0,   0,   1]
test("activate, jQuery or DOM element", function() {
	var ac = $('#list1').accordion({ active: $("#list1 a:last") });
	state(ac, 0, 0, 1);
	ac.accordion("activate", $("#list1 a:first"));
	state(ac, 1, 0, 0);
	ac.accordion("activate", $("#list1 a")[1]);
	state(ac, 0, 1, 0);
});

test("resize", function() {
	var expected = $('#list1').accordion();
	
	var sizes = [];
	expected.find(".ui-accordion-content").each(function() {
		sizes.push($(this).outerHeight());
	});
	
	var actual = expected.accordion('resize');
	equals(actual, expected, 'resize is chainable');
	
	var sizes2 = [];
	expected.find(".ui-accordion-content").each(function() {
		sizes2.push($(this).outerHeight());
	});
	same(sizes, sizes2);
	
	expected.find(".ui-accordion-content:first").height(500)
	var sizes3 = [];
});

})(jQuery);
