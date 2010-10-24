/*
 * spinner_options.js
 */
(function($) {

module("spinner: options");

test("buttons - show (default)", function() {
	expect(4);
	
	el = $('#spin');	
	el.spinner({ 
		buttons: 'show' 
	});
	
	ok(upButton().is(':visible'), "show - before hover: up button visible");
	ok(downButton().is(':visible'), "show - before hover: down button visible");
	
	el.trigger('mouseover');
	
	ok(upButton().is(':visible'), "show - after hover: up button visible");
	ok(downButton().is(':visible'), "show - after hover: down button visible");
	
	el.trigger('mouseout');		
});

test("buttons - hide", function() {
	expect(4);
	
	el = $('#spin');	
	el.spinner({ 
		buttons: 'hide' 
	});
	
	ok(upButton().is(':hidden'), "hide - before hover: up button hidden");
	ok(downButton().is(':hidden'), "hide - before hover: down button hidden");

	el.trigger('mouseover');
	
	ok(upButton().is(':hidden'), "hide - after hover: up button hidden");
	ok(downButton().is(':hidden'), "hide - after hover: down button hidden");

	el.trigger('mouseout');	
});

test("buttons - auto (hover)", function() {
	expect(4);
	
	el = $('#spin');
	el.spinner({ 
		buttons: 'auto' 
	});
		
	ok(upButton().is(':hidden'), "auto - before hover: up button hidden");
	ok(downButton().is(':hidden'), "auto - before hover: down button hidden");

	el.trigger('mouseover');
	
	ok(upButton().is(':visible'), "auto - after hover: up button visible");
	ok(downButton().is(':visible'), "auto - after hover: down button visible");

	el.trigger('mouseout');
});

test("buttons - auto (focus)", function() {
	expect(4);
	
	el = $('#spin');
	el.spinner({ 
		buttons: 'auto' 
	});
		
	ok(upButton().is(':hidden'), "auto - before focus: up button hidden");
	ok(downButton().is(':hidden'), "auto - before focus: down button hidden");

	el.focus();
	
	ok(upButton().is(':visible'), "auto - after focus: up button visible");
	ok(downButton().is(':visible'), "auto - after focus: down button visible");

	el.trigger('mouseout');
});

test("currency - single character currency symbol", function() {
	expect(5);

	el = $("#spin");
	
	options = { 
		currency:"$",
		max:120,
		min:-50,
		step:0.3
	};
	
	el.spinner(options);

	equals(el.val(), "$0.00", "start number");

	simulateKeyDownUp(el, $.ui.keyCode.UP);

	equals(el.val(), "$0.30", "stepping 0.30");

	simulateKeyDownUp(el, $.ui.keyCode.END);

	equals(el.val(), "$120.00", "End key to max");

	simulateKeyDownUp(el, $.ui.keyCode.HOME);

	equals(el.val(), "-$50.00", "Home key to min");
	
	for ( var i = 1 ; i<=120 ; i++ ) {
		simulateKeyDownUp(el, $.ui.keyCode.UP);
	}

	equals(el.val(), "-$14.00", "keydown 120 times");
});

test("currency - combined character currency symbol", function() {
	expect(2);
	
	el = $('#spin');
	
	options = {
		currency: 'HK$',
		step: 1500.50,
		value: 1000
	}
	
	el.spinner(options);

	equals(el.val(), "HK$1,000.00", "Hong Kong Dollar");

	simulateKeyDownUp(el, $.ui.keyCode.UP);
	
	equals(el.val(), "HK$2,500.50", "Hong Kong Dollar step-up once");	
});

test("currency - space as group separator", function() {
	expect(2);
	
	el = $('#spin');
	
	options = {
		currency: '$',
		groupSeparator: ' ',
		radixPoint: '.',
		step: 1500.50,
		value: 1000
	}
	
	el.spinner(options);

	equals(el.val(), "$1 000.00", "Australian Dollar");

	simulateKeyDownUp(el, $.ui.keyCode.UP);

	equals(el.val(), "$2 500.50", "Australian Dollar step-up once");
});

test("currency - apos as group separator", function() {
	expect(2);
	
	el = $('#spin');
	options = {
		currency: 'Fr ',
		groupSeparator: "'",
		radixPoint: '.',
		step: 1500.50,
		value: 1000
	}
	el.spinner(options);

	equals(el.val(), "Fr 1'000.00", "Swiss Franc");

	simulateKeyDownUp(el, $.ui.keyCode.UP);

	equals(el.val(), "Fr 2'500.50", "Swiss Franc step-up once");
});

test("currency - period as group separator and comma as radixPoint", function() {
	expect(2);
	
	el = $('#spin');
	options = {
		currency: 'RUB',
		groupSeparator: ".",
		radixPoint: ',',
		step: 1.5,
		value: 1000
	}
	el.spinner(options);

	equals(el.val(), "RUB1.000,00", "Russian Ruble");

	simulateKeyDownUp(el, $.ui.keyCode.UP);
	
	equals(el.val(), "RUB1.001,50", "Russian Ruble step-up once");
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

test("groupSeparator - comma separator (default)", function() {	
	expect(1);
	
	el = $('#spin');
	options = {
		groupSeparator: ',',
		value: 1000000
	};
	el.spinner(options);
	equals(el.val(), "1,000,000", "value contains 2 commas separated by 3 digits");
});

test("groupSeparator - space separator", function() {
	expect(1);
	
	el = $('#spin');
	options = {
		groupSeparator: ' ',
		value: 1000000
	};
	el.spinner(options);
	equals(el.val(), "1 000 000", "value contains 2 spaces separated by 3 digits");	
});

test("groupSeparator - apos separator", function() {
	expect(1);
	
	el = $('#spin');
	options = {
		groupSeparator: "'",
		value: 1000000
	};
	el.spinner(options);
	equals(el.val(), "1'000'000", "value contains apos separated by 3 digits");
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

test("padding", function() {
	expect(3);
	
	el = $('#spin').spinner({ padding: 5, value: 10 });
	
	equals(el.val(), '00010', 'padded output');

	el.spinner('option', 'padding', 4);
	equals(el.val(), '0010', 'padded output');

	el.spinner('value', 15);
	equals(el.val(), '0015', 'padded output');
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

test("precision", function() {
	expect(3);
	
	el = $("#spin").spinner({ precision: 4, value: 1.23456789 });
	
	equals(el.val(), '1.2346', "4 decimal places");
	
	el.spinner('option', 'precision', 2);

	equals(el.val(), '1.23', "2 decimal places");	

	el.spinner('option', 'precision', 6);

	equals(el.val(), '1.234568', "6 decimal places");	
});

test("radix", function() {
	expect(2);
	
	el = $("#spin").spinner({
		radix: 16,
		value: 10
	});
	
	equals(el.val(), 'a', 'start value');
	
	simulateKeyDownUp(el, $.ui.keyCode.UP);
	
	equals(el.val(), 'b', 'key UP on spinner')
});

test("radixPoint", function() {
	el = $("#spin").spinner({
		radixPoint: ',',
		value: 20.00,
		precision: 2
	});
	
	equals(el.val(), '20,00', 'comma radix point');
	
	el.spinner('stepUp');
	
	equals(el.val(), '21,00', 'step up one');
	
	el.spinner('pageDown', 10);
	
	equals(el.val(), '-29,00', 'page down into negative space');
});

test("spinnerClass", function() {
	expect(3);
	
	el = $('#spin').spinner({spinnerClass: 'my-spinner-class'});
	ok(wrapper().hasClass('my-spinner-class'), 'spinner container has custom class');

	el.spinner('option', 'spinnerClass', 'new-spinner-class');
	ok(!wrapper().hasClass('my-spinner-class'), 'spinner no longer has old custom class');
	ok(wrapper().hasClass('new-spinner-class'), 'spinner now has new custom class');
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

test("value", function() {
	expect(2);
	
	el = $('#spin').spinner({ value: 100 });
	
	equals(el.val(), 100, "starting value");
	
	el.spinner('option', 'value', 1000);
	
	equals(el.val(), 1000, "value option changed and set as current value");
});

})(jQuery);
