/*
 * slider unit tests
 */
(function($) {
//
// Slider Test Helper Functions
//

var defaults = {
	max: 100,
	min: 0,
	orientation: 'horizontal',
	step: 1,
	value: 0
};

var el, options;

function handle() {
	return el.find(".ui-slider-handle");
}

// Slider Tests
module("slider");

test("init", function() {
	expect(6);

	$("<div></div>").appendTo('body').slider().remove();
	ok(true, '.slider() called on element');

	$([]).slider().remove();
	ok(true, '.slider() called on empty collection');

	$('<div></div>').slider().remove();
	ok(true, '.slider() called on disconnected DOMElement');

	$('<div></div>').slider().slider("foo").remove();
	ok(true, 'arbitrary method called after init');

	el = $('<div></div>').slider();
	var foo = el.data("foo.slider");
	el.remove();
	ok(true, 'arbitrary option getter after init');

	$('<div></div>').slider().data("foo.slider", "bar").remove();
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(8);

	$("<div></div>").appendTo('body').slider().slider("destroy").remove();
	ok(true, '.slider("destroy") called on element');

	$([]).slider().slider("destroy").remove();
	ok(true, '.slider("destroy") called on empty collection');

	$('<div></div>').appendTo('body').remove().slider().slider("destroy").remove();
	ok(true, '.slider("destroy") called on disconnected DOMElement');

	$('<div></div>').slider().slider("destroy").slider("foo").remove();
	ok(true, 'arbitrary method called after destroy');

	el = $('<div></div>').slider();
	var foo = el.slider("destroy").data("foo.slider");
	el.remove();
	ok(true, 'arbitrary option getter (.data) after destroy');

	el = $('<div></div>').slider();
	var foo = el.slider("destroy").slider("option", "foo");
	el.remove();
	ok(true, 'arbitrary option getter (.slider option method) after destroy');

	$('<div></div>').slider().slider("destroy").data("foo.slider", "bar").remove();
	ok(true, 'arbitrary option setter (.data) after destroy');

	$('<div></div>').slider().slider("destroy").slider("options", "foo", "bar").remove();
	ok(true, 'arbitrary option setter (.slider option method) after destroy');
});

test("defaults", function() {
	el = $('<div></div>').slider();
	$.each(defaults, function(key, val) {
		var actual = el.data(key + ".slider"), expected = val;
		same(actual, expected, key);
	});
	el.remove();
});

module("slider");

test("keydown HOME on handle sets value to min", function() {
	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'horizontal',
		step: 1
	};
	el.slider(options);

	el.slider("value", 0);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.HOME });
	equals(el.slider("value"), options.min);

	el.slider('destroy');	

	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'vertical',
		step: 1
	};
	el.slider(options);

	el.slider("value", 0);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.HOME });
	equals(el.slider("value"), options.min);

	el.slider('destroy');
});

test("keydown END on handle sets value to max", function() {
	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'horizontal',
		step: 1
	};
	el.slider(options);

	el.slider("value", 0);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.END });
	equals(el.slider("value"), options.max);

	el.slider('destroy');	

	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'vertical',
		step: 1
	};
	el.slider(options);

	el.slider("value", 0);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.END });
	equals(el.slider("value"), options.max);

	el.slider('destroy');
});

test("keydown UP on handle increases value by step, not greater than max", function() {
	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'horizontal',
		step: 1
	};
	el.slider(options);

	el.slider("value", options.max - options.step);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.UP });
	equals(el.slider("value"), options.max);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.UP });
	equals(el.slider("value"), options.max);

	el.slider("destroy");	

	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'vertical',
		step: 1
	};
	el.slider(options);

	el.slider("value", options.max - options.step);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.UP });
	equals(el.slider("value"), options.max);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.UP });
	equals(el.slider("value"), options.max);

	el.slider("destroy");	
});

test("keydown RIGHT on handle increases value by step, not greater than max", function() {
	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'horizontal',
		step: 1
	};
	el.slider(options);

	el.slider("value", options.max - options.step);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.RIGHT });
	equals(el.slider("value"), options.max);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.RIGHT });
	equals(el.slider("value"), options.max);

	el.slider("destroy");	

	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'vertical',
		step: 1
	};
	el.slider(options);

	el.slider("value", options.max - options.step);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.RIGHT });
	equals(el.slider("value"), options.max);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.RIGHT });
	equals(el.slider("value"), options.max);

	el.slider("destroy");	
});

test("keydown DOWN on handle decreases value by step, not less than min", function() {
	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'horizontal',
		step: 1
	};
	el.slider(options);

	el.slider("value", options.min + options.step);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.DOWN });
	equals(el.slider("value"), options.min);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.DOWN });
	equals(el.slider("value"), options.min);

	el.slider("destroy");	

	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'vertical',
		step: 1
	};
	el.slider(options);

	el.slider("value", options.min + options.step);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.DOWN });
	equals(el.slider("value"), options.min);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.DOWN });
	equals(el.slider("value"), options.min);

	el.slider("destroy");	
});

test("keydown LEFT on handle decreases value by step, not less than min", function() {
	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'horizontal',
		step: 1
	};
	el.slider(options);

	el.slider("value", options.min + options.step);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.LEFT });
	equals(el.slider("value"), options.min);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.LEFT });
	equals(el.slider("value"), options.min);

	el.slider("destroy");	

	el = $('<div></div>');
	options = {
		max: 5,
		min: -5,
		orientation: 'vertical',
		step: 1
	};
	el.slider(options);

	el.slider("value", options.min + options.step);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.LEFT });
	equals(el.slider("value"), options.min);

	handle().simulate("keydown", { keyCode: $.ui.keyCode.LEFT });
	equals(el.slider("value"), options.min);

	el.slider("destroy");	
});

module("slider: Options");

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

})(jQuery);
