/*
 * spinner_options.js
 */
(function($) {

module("spinner: options");

test("numberformat", function() {
	ok( false, "tests for numberformat!");
});

test("dir - left-to-right (default)", function() {	
	expect(3);
	
	el = $("#spin");	
	el.spinner();
	
	ok(upButton().position().left > box().position().left, 'input on left up button on right');
	ok(downButton().position().left > box().position().left, 'input on left down button on right');
	ok(wrapper().hasClass('ui-spinner-ltr'), 'container has correct text direction class setting');
});

test("dir - right-to-left", function() {
	expect(3);
	
	el = $("#spin");
	el.spinner({ dir: 'rtl' });
	
	ok(upButton().position().left < box().position().left, 'input on right up button on left');
	ok(downButton().position().left < box().position().left, 'input on right down button on left');
	ok(wrapper().hasClass('ui-spinner-rtl'), 'container has correct text direction class setting');
});

test("incremental - false (default)", function() {
	expect(2);
	
	el = $("#spin").spinner({ incremental:false });

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

test("incremental - true", function() {
	expect(2);
	
	el.spinner('option', 'incremental', true );

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

test("max", function() {
	expect(3);
	
	el = $("#spin").spinner({ max: 100, value: 1000 });
	equals(el.val(), 100, "max constrained if value option is greater");
	
	el.spinner('value', 1000);
	equals(el.val(), 100, "max constrained if value method is greater");
	
	el.val(1000).blur();
	equals(el.val(), 100, "max constrained if manual entry");
});

test("min", function() {
	expect(3);
	
	el = $("#spin").spinner({ min: -100, value: -1000 });
	equals(el.val(), -100, "min constrained if value option is greater");
	
	el.spinner('value', -1000);
	equals(el.val(), -100, "min constrained if value method is greater");
	
	el.val(-1000).blur();
	equals(el.val(), -100, "min constrained if manual entry");
});

test("mouseWheel", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("page", function() {
	expect(3);

	el = $("#spin").spinner({ step: 2, page:2.5 });

	equals(el.val(), "0", "start number");

	simulateKeyDownUp(el, $.ui.keyCode.PAGE_DOWN);

	equals(el.val(), "-5", "PAGE_DOWN on spinner once");

	for ( var i = 1 ; i<=11 ; i++ ) {
		simulateKeyDownUp(el, $.ui.keyCode.PAGE_UP);
	}

	equals(el.val(), "50", "PAGE_UP 11 times on spinner");
});

test("step", function() {
	expect(7);

	el = $("#spin").spinner({ step:0.7 });
	equals(el.val(), "0.0", "value initialized to");

	simulateKeyDownUp(el, $.ui.keyCode.DOWN);
	equals(el.val(), "-0.7", "DOWN 1 time with step: 0.7");

	for ( var i = 0 ; i < 11 ; i++ ) {
		simulateKeyDownUp(el, $.ui.keyCode.UP);
	}
	equals(el.val(), "7.0", "UP 11 times with step: 0.7");

	el.spinner('option', 'step', 1);
	for ( var i = 0 ; i < 3 ; i++ ) {
		simulateKeyDownUp(el, $.ui.keyCode.UP);
	}
	equals(el.val(), "10.0", "UP 3 times with step: 1");
	
	el.spinner('option', 'step', 2);
	for ( var i = 0 ; i < 5 ; i++ ) {
		simulateKeyDownUp(el, $.ui.keyCode.UP);
	}
	equals(el.val(), "20.0", "UP 5 times with step: 2");

	el.spinner('value', '10.5');
	equals(el.val(), "10.5", "value reset to");

	el.spinner('option', 'step', 2);
	for ( var i = 0 ; i < 5 ; i++ ) {
		simulateKeyDownUp(el, $.ui.keyCode.UP);
	}
	equals(el.val(), "20.5", "UP 5 times with step: 2");


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
