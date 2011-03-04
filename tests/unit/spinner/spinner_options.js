/*
 * spinner_options.js
 */
(function($) {

module("spinner: options");

test("numberformat, number", function() {
	var el = $("#spin").spinner({
		value: "1",
		numberformat: "n"
	});
	equal(el.val(), "1.00");
});

test("numberformat, number, simple", function() {
	var el = $("#spin").spinner({
		value: "1",
		numberformat: "n0"
	});
	equal(el.val(), "1");
});

test("numberformat, currency", function() {
	var el = $("#spin").spinner({
		value: "1",
		numberformat: "C"
	});
	equal(el.val(), "$1.00");
});

/* TODO figure out how to test this properly
test("incremental - false (default)", function() {
	var el = $("#spin").spinner({ incremental:false });

	for ( var i = 1 ; i<=120 ; i++ ) {
		el.simulate("keydown",{keyCode:$.ui.keyCode.UP});
	}
	el.simulate("keyup",{keyCode:$.ui.keyCode.UP});

	equals(el.val(), 120, "incremental false - keydown 120 times");

	for ( var i = 1 ; i<=210 ; i++ ) {
		el.simulate("keydown",{keyCode:$.ui.keyCode.DOWN});
	}
	el.simulate("keyup",{keyCode:$.ui.keyCode.DOWN});

	equals(el.val(), -90, "incremental false - keydown 210 times");
});

test("incremental - true (default)", function() {
	var el = $("#spin").spinner();

	for ( var i = 1 ; i<=120 ; i++ ) {
		el.simulate("keydown",{keyCode:$.ui.keyCode.UP});
	}
	el.simulate("keyup",{keyCode:$.ui.keyCode.UP});

	equals(el.val(), 300, "incremental true - keydown 120 times (100+20*10)");

	for ( var i = 1 ; i<=210 ; i++ ) {
		el.simulate("keydown",{keyCode:$.ui.keyCode.DOWN});
	}
	el.simulate("keyup",{keyCode:$.ui.keyCode.DOWN});

	equals(el.val(), -1800, "incremental true - keydown 210 times (300-100-100*10-10*100)");
});
*/

test("max", function() {
	var el = $("#spin").spinner({ max: 100, value: 1000 });
	equals(el.val(), 100, "max constrained if value option is greater");
	
	el.spinner('value', 1000);
	equals(el.val(), 100, "max constrained if value method is greater");
	
	el.val(1000).blur();
	equals(el.val(), 100, "max constrained if manual entry");
});

test("min", function() {
	var el = $("#spin").spinner({ min: -100, value: -1000 });
	equals(el.val(), -100, "min constrained if value option is greater");
	
	el.spinner('value', -1000);
	equals(el.val(), -100, "min constrained if value method is greater");
	
	el.val(-1000).blur();
	equals(el.val(), -100, "min constrained if manual entry");
});

test("step, 2", function() {
	var el = $("#spin").spinner({ step: 2 });
	equals(el.val(), "0", "value initialized to");
	
	for ( var i = 0 ; i < 5 ; i++ ) {
		simulateKeyDownUp(el, $.ui.keyCode.UP);
	}
	equals(el.val(), "10", "UP 5 times with step: 2");

	el.spinner('value', '10.5');
	equals(el.val(), "10.5", "value reset to");

	el.spinner('option', 'step', 2);
	for ( var i = 0 ; i < 5 ; i++ ) {
		simulateKeyDownUp(el, $.ui.keyCode.UP);
	}
	equals(el.val(), "20.5", "UP 5 times with step: 2");
});

test("step, 0.7", function() {
	var el = $("#spin").spinner({
		step: 0.7,
		numberformat: "n1"
	});
	equals(el.val(), "0.0", "value initialized to");

	simulateKeyDownUp(el, $.ui.keyCode.DOWN);
	equals(el.val(), "-0.7", "DOWN 1 time with step: 0.7");

	for ( var i = 0 ; i < 11 ; i++ ) {
		simulateKeyDownUp(el, $.ui.keyCode.UP);
	}
	equals(el.val(), "7.0", "UP 11 times with step: 0.7");
});

test("value, default, specified in markup", function() {
	var el = $('#spin2').spinner();
	equals(el.val(), 2, "starting value");
});

test("value, default, nothing specified", function() {
	var el = $('#spin').spinner();
	equals(el.val(), 0, "starting value");
});

test("value, override", function() {
	var el = $('#spin').spinner({ value: 100 });
	equals(el.val(), 100, "starting value");
});

test("value, override markup", function() {
	var el = $('#spin2').spinner({ value: 100 });
	equals(el.val(), 100, "starting value");
});

test("value, override later", function() {
	var el = $('#spin').spinner();
	equals(el.val(), 0, "starting value");
	el.spinner('option', 'value', 1000);
	equals(el.val(), 1000, "value option changed and set as current value");
});

})(jQuery);
