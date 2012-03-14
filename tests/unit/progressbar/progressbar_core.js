/*
 * progressbar_core.js
 */

var el;

(function($) {

module("progressbar: core");

test("accessibility", function() {
	expect(7);
	el = $("#progressbar").progressbar();

	equal(el.attr("role"), "progressbar", "aria role");
	equal(el.attr("aria-valuemin"), 0, "aria-valuemin");
	equal(el.attr("aria-valuemax"), 100, "aria-valuemax");
	equal(el.attr("aria-valuenow"), 0, "aria-valuenow initially");
	el.progressbar("value", 77);
	equal(el.attr("aria-valuenow"), 77, "aria-valuenow");
	el.progressbar("disable");
	equal(el.attr("aria-disabled"), "true", "aria-disabled on");
	el.progressbar("enable");
	// FAIL: for some reason IE6 and 7 return a boolean false instead of the string
	equal(el.attr("aria-disabled"), "false", "aria-disabled off");
});

})(jQuery);
