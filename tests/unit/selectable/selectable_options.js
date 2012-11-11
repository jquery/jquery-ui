/*
 * selectable_options.js
 */
(function($) {

module("selectable: options");

test("autoRefresh", function() {
	expect(3);

	var actual = 0,
		el = $("#selectable1"),
		sel = $("*", el),
		selected = function() { actual += 1; };

	el = $("#selectable1").selectable({ autoRefresh: false,	selected: selected });
	sel.hide();
	TestHelpers.selectable.drag(el, 1000, 1000);
	equal(actual, sel.length);
	el.selectable("destroy");

	actual = 0;
	sel.show();
	el = $("#selectable1").selectable({ autoRefresh: true,	selected: selected });
	sel.hide();
	TestHelpers.selectable.drag(el, 1000, 1000);
	equal(actual, 0);
	sel.show();
	TestHelpers.selectable.drag( sel[ 0 ], 1000, 1000 );
	equal(actual, sel.length);
	el.selectable("destroy");
	sel.show();
});

test("filter", function() {
	expect(2);

	var actual =0,
		el = $("#selectable1"),
		sel = $("*", el),
		selected = function() { actual += 1; };


	el = $("#selectable1").selectable({ filter: '.special', selected: selected });
	TestHelpers.selectable.drag(el, 1000, 1000);
	ok(sel.length !== 1, "this test assumes more than 1 selectee");
	equal(actual, 1);
	el.selectable("destroy");
});

})(jQuery);
