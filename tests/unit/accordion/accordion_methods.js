/*
 * accordion_methods.js
 */
(function($) {

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

	var el = $('<div></div>').accordion();
	var foo = el.accordion("option", "foo");
	el.remove();
	ok(true, 'arbitrary option getter after init');

	$('<div></div>').accordion().accordion("option", "foo", "bar").remove();
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	var beforeHtml = $("#list1").find("div").css("font-style", "normal").end().parent().html();
	var afterHtml = $("#list1").accordion().accordion("destroy").parent().html();
	// Opera 9 outputs role="" instead of removing the attribute like everyone else
	if ($.browser.opera) {
		afterHtml = afterHtml.replace(/ role=""/g, "");
	}
	equal( afterHtml, beforeHtml );
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

test("activate, jQuery or DOM element", function() {
	var ac = $('#list1').accordion({ active: $("#list1 a:last") });
	state(ac, 0, 0, 1);
	ac.accordion("activate", $("#list1 a:first"));
	state(ac, 1, 0, 0);
	ac.accordion("activate", $("#list1 a")[1]);
	state(ac, 0, 1, 0);
});

test("resize", function() {
	var expected = $('#navigation').parent().height(300).end().accordion({
		fillSpace: true
	});
	equalHeights(expected, 246, 258);
	
	expected.parent().height(500);
	expected.accordion("resize");
	equalHeights(expected, 446, 458);
});

})(jQuery);
