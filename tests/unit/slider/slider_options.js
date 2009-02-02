/*
 * slider_options.js
 */
(function($) {

function handle() {
	return el.find(".ui-slider-handle");
}

module("slider: options");

test("animate", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("max", function() {
	el = $('<div></div>');
	
	options = {
		max: 37,
		min: 6,
		orientation: 'horizontal',
		step: 1,
		value: 50
	};

	el.slider(options);
	ok(el.slider("option", "value") == options.value, "value option is not contained by max");
	ok(el.slider("value") == options.max, "value method is contained by max");
	el.slider('destroy');

});

test("min", function() {
	el = $('<div></div>');
	
	options = {
		max: 37,
		min: 6,
		orientation: 'vertical',
		step: 1,
		value: 2
	};

	el.slider(options);
	ok(el.slider("option", "value") == options.value, "value option is not contained by min");
	ok(el.slider("value") == options.min, "value method is contained by min");
	el.slider('destroy');

});

test("orientation", function() {
	el = $('<div></div>');

	options = {
		max: 2,
		min: -2,
		orientation: 'vertical',
		value: 1
	};

	var percentVal = (options.value - options.min) / (options.max - options.min) * 100;

	el.slider(options).slider("option", "orientation", "horizontal");
	ok(el.is('.ui-slider-horizontal'), "horizontal slider has class .ui-slider-horizontal");
	ok(!el.is('.ui-slider-vertical'), "horizontal slider does not have class .ui-slider-vertical");
	equals(handle().css('left'), percentVal + '%', "horizontal slider handle is positioned with left: %");

	el.slider('destroy');

	options = {
		max: 2,
		min: -2,
		orientation: 'horizontal',
		value: -1
	};

	var percentVal = (options.value - options.min) / (options.max - options.min) * 100;

	el.slider(options).slider("option", "orientation", "vertical");
	ok(el.is('.ui-slider-vertical'), "vertical slider has class .ui-slider-vertical");
	ok(!el.is('.ui-slider-horizontal'), "vertical slider does not have class .ui-slider-horizontal");
	equals(handle().css('bottom'), percentVal + '%', "vertical slider handle is positioned with bottom: %");

	el.slider('destroy');

});

test("range", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("step", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("value", function() {
	ok(false, "missing test - untested code is broken code.");
});

test("values", function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
