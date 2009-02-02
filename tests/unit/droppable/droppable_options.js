/*
 * droppable_optinos.js
 */
(function($) {

module("droppable: options");

test("accept, selector", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("accept, fn", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("activeClass", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("cssNamespace", function() {
	//cssNamespace should be appended with '-droppable' and added as className
	el = $("<div></div>").droppable({ cssNamespace: "ui" });
	equals(el[0].className, "ui-droppable");
	el.droppable("destroy");

	//no className should be added if cssNamepsace is null
	el = $("<div></div>").droppable({ cssNamespace: null });
	equals(el[0].className, "");
	el.droppable("destroy");
});

test("greedy", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("hoverClass", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("scope", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("tolerance, fit", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("tolerance, intersect", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("tolerance, pointer", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("tolerance, touch", function() {
	ok(false, 'missing test - untested code is broken code');
});

})(jQuery);
