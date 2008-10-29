/*
 * progressbar unit tests
 */
(function($) {

// Spinner Tests
module("progressbar");

test("init", function() {
	expect(1);

	el = $("#progressbar").progressbar();
	ok(true, '.progressbar() called on element');

});

test("destroy", function() {
	expect(1);

	$("#progressbar").progressbar().progressbar("destroy");	
	ok(true, '.progressbar("destroy") called on element');

});

test("defaults", function() {
	expect(5);
	el = $("#progressbar").progressbar();

	equals(el.data("width.progressbar"), 300, "width");
	equals(el.data("duration.progressbar"), 3000, "duration");
	equals(el.data("interval.progressbar"), 200, "interval");
	equals(el.data("increment.progressbar"), 1, "increment");
	equals(el.data("range.progressbar"), true, "range");

});

test("set defaults on init", function() {
	expect(5);
	el = $("#progressbar").progressbar({ 
		width: 500,
		duration: 5000,
		interval: 500,
		increment: 5,
		range: false
	});

	equals(el.data("width.progressbar"), 500, "width");
	equals(el.data("duration.progressbar"), 5000, "duration");
	equals(el.data("interval.progressbar"), 500, "interval");
	equals(el.data("increment.progressbar"), 5, "increment");
	equals(el.data("range.progressbar"), false, "range");

});

test("accessibility", function() {
	expect(7);
	el = $("#progressbar").progressbar();

	equals(el.ariaRole(), "progressbar", "aria role");
	equals(el.ariaState("valuemin"), 0, "aria-valuemin");
	equals(el.ariaState("valuemax"), 100, "aria-valuemax");
	equals(el.ariaState("valuenow"), 0, "aria-valuenow initially");
	el.progressbar("progress", 77);
	equals(el.ariaState("valuenow"), 77, "aria-valuenow");
	el.progressbar("disable");
	equals(el.ariaState("disabled"), "true", "aria-disabled");
	el.progressbar("enable");
	equals(el.ariaState("disabled"), "false", "enabled");
});

})(jQuery);
