/*
 * slider_options.js
 */
(function($) {

var el, options;

function handle() {
	return el.find(".ui-slider-handle");
}

module("slider: options");

test("max", function() {
	expect( 2 );
	el = $("<div></div>");

	options = {
		max: 37,
		min: 6,
		orientation: "horizontal",
		step: 1,
		value: 50
	};

	el.slider(options);
	ok(el.slider("option", "value") === options.value, "value option is not contained by max");
	ok(el.slider("value") === options.max, "value method is contained by max");
	el.slider("destroy");

});

test("min", function() {
	expect( 2 );
	el = $("<div></div>");

	options = {
		max: 37,
		min: 6,
		orientation: "vertical",
		step: 1,
		value: 2
	};

	el.slider(options);
	ok(el.slider("option", "value") === options.value, "value option is not contained by min");
	ok(el.slider("value") === options.min, "value method is contained by min");
	el.slider("destroy");

});

test("orientation", function() {
	expect( 6 );
	el = $("#slider1");

	options = {
		max: 2,
		min: -2,
		orientation: "vertical",
		value: 1
	};

	var percentVal = (options.value - options.min) / (options.max - options.min) * 100;

	el.slider(options).slider("option", "orientation", "horizontal");
	ok(el.is(".ui-slider-horizontal"), "horizontal slider has class .ui-slider-horizontal");
	ok(!el.is(".ui-slider-vertical"), "horizontal slider does not have class .ui-slider-vertical");
	equal(handle()[0].style.left, percentVal + "%", "horizontal slider handle is positioned with left: %");

	el.slider("destroy");

	options = {
		max: 2,
		min: -2,
		orientation: "horizontal",
		value: -1
	};

	percentVal = (options.value - options.min) / (options.max - options.min) * 100;

	el.slider(options).slider("option", "orientation", "vertical");
	ok(el.is(".ui-slider-vertical"), "vertical slider has class .ui-slider-vertical");
	ok(!el.is(".ui-slider-horizontal"), "vertical slider does not have class .ui-slider-horizontal");
	equal(handle()[0].style.bottom, percentVal + "%", "vertical slider handle is positioned with bottom: %");

	el.slider("destroy");

});

//test("range", function() {
//	ok(false, "missing test - untested code is broken code.");
//});

//spec: http://wiki.jqueryui.com/Slider#specs
// value option/method: the value option is not restricted by min/max/step.
// What is returned by the value method is restricted by min (>=), max (<=), and step (even multiple)
test("step", function() {
	expect( 9 );
	var el = $("<div></div>").slider({
		min: 0,
		value: 0,
		step: 10,
		max: 100
	});
	equal( el.slider("value"), 0 );

	el.slider("value", 1);
	equal( el.slider("value"), 0 );

	el.slider("value", 9);
	equal( el.slider("value"), 10 );

	el.slider("value", 11);
	equal( el.slider("value"), 10 );

	el.slider("value", 19);
	equal( el.slider("value"), 20 );

	el = $("<div></div>").slider({
		min: 0,
		value: 0,
		step: 20,
		max: 100
	});
	el.slider("value", 0);

	el.slider("option", "value", 1);
	equal( el.slider("value"), 0 );

	el.slider("option", "value", 9);
	equal( el.slider("value"), 0 );

	el.slider("option", "value", 11);
	equal( el.slider("value"), 20 );

	el.slider("option", "value", 19);
	equal( el.slider("value"), 20 );

	el.slider("destroy");
});

//test("value", function() {
//	ok(false, "missing test - untested code is broken code.");
//});

test("values", function() {
	expect( 2 );

	// testing multiple ranges on the same page, the object reference to the values
	// property is preserved via multiple range elements, so updating options.values
	// of 1 slider updates options.values of all the others
	var ranges = $([
		document.createElement("div"),
		document.createElement("div")
	]).slider({
		range:  true,
		values: [ 25, 75 ]
	});

	notStrictEqual(
		ranges.eq(0).data("uiSlider").options.values,
		ranges.eq(1).data("uiSlider").options.values,
		"multiple range sliders should not have a reference to the same options.values array"
	);

	ranges.eq(0).slider("values", 0, 10);

	notEqual(
		ranges.eq(0).slider("values", 0),
		ranges.eq(1).slider("values", 0),
		"the values for multiple sliders should be different"
	);
});

})(jQuery);
