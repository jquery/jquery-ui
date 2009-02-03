/*
 * accordion_methods.js
 */
(function($) {

module("accordion: methods");

test("init", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("destroy", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("enable", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("disable", function() {
	ok(false, 'missing test - untested code is broken code');
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
	ac.accordion("activate", -1);
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

test("activate, boolean, collapsible:false", function() {
	var ac = $('#list1').accordion().accordion("activate", 2);
	state(ac, 0, 0, 1);
	ac.accordion("activate", -1);
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

})(jQuery);
