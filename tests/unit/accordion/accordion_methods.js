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
	expected.accordion("option", "active", 1);
	state(expected, 1, 0, 0)
	expected.accordion("enable");
	expected.accordion("option", "active", 1);
	state(expected, 0, 1, 0)
});

test("refresh", function() {
	var expected = $('#navigation').parent().height(300).end().accordion({
		heightStyle: "fill"
	});
	equalHeights(expected, 246, 258);
	
	expected.parent().height(500);
	expected.accordion("refresh");
	equalHeights(expected, 446, 458);
});

})(jQuery);
