/*
 * progressbar_core.js
 */

var el;

(function($) {

module("progressbar: core");

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
	equals(el.attr("aria-disabled"), "true", "aria-disabled on");
	el.progressbar("enable");
	// FAIL: for some reason IE6 and 7 return a boolean false instead of the string
	equals(el.attr("aria-disabled"), "false", "aria-disabled off");
});

})(jQuery);
