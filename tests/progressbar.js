/*
 * progressbar unit tests
 */
(function($) {
//
// Progressbar Test Helper Functions
//

var defaults = {
	disabled: false,
	height: 20,
	label: true,
	labelAlign: 'left',
	value: 0,
	width: 300
};

var el;

// Progressbar Tests
module("progressbar");

test("init", function() {
	expect(1);

	$("<div></div>").appendTo('body').progressbar().remove();
	ok(true, '.progressbar() called on element');

});

test("destroy", function() {
	expect(1);

	$("<div></div>").appendTo('body').progressbar().progressbar("destroy").remove();
	ok(true, '.progressbar("destroy") called on element');

});

test("defaults", function() {
	el = $('<div></div>').progressbar();
	$.each(defaults, function(key, val) {
		var actual = el.data(key + ".progressbar"), expected = val;
		same(actual, expected, key);
	});
	el.remove();
});

test("set defaults on init", function() {
	el = $("#progressbar").progressbar({ 
		height: 30,
		label: false,
		labelAlign: 'right',
		value: 50,
		width: 200
	});

	equals(el.progressbar("option", "height"), 30, "height");
	equals(el.progressbar("option", "label"), false, "label");
	equals(el.progressbar("option", "labelAlign"), "right", "labelAlign");
	equals(el.progressbar("option", "value"), 50, "value");
	equals(el.progressbar("option", "width"), 200, "width");

});

test("accessibility", function() {
	expect(7);
	el = $("#progressbar").progressbar();

	equals(el.attr("role"), "progressbar", "aria role");
	equals(el.attr("aria-valuemin"), 0, "aria-valuemin");
	equals(el.attr("aria-valuemax"), 100, "aria-valuemax");
	equals(el.attr("aria-valuenow"), 0, "aria-valuenow initially");
	el.progressbar("value", 77);
	equals(el.attr("aria-valuenow"), 77, "aria-valuenow");
	el.progressbar("disable");
	equals(el.attr("aria-disabled"), "true", "aria-disabled");
	el.progressbar("enable");
	equals(el.attr("aria-disabled"), "false", "enabled");
});

})(jQuery);
