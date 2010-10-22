/*
 * spinner_core.js
 */

var el,
	options,
	simulateKeyDownUp = function(el, kCode, shift) {
		el.simulate("keydown",{keyCode:kCode, shiftKey: shift || false })
			.simulate("keyup",{keyCode:kCode, shiftKey: shift || false });
	},
	wrapper = function() {
		return el.closest('.ui-spinner');
	},
	upButton = function() {
		return wrapper().find('.ui-spinner-up');
	},
	downButton = function() {
		return wrapper().find('.ui-spinner-down');
	},
	box = function() {
		return $('.ui-spinner-input', wrapper());
	};

(function($) {

// Spinner Tests
module("spinner: core");

test("init", function() {
	expect(3);

	$("<input>").appendTo('body').spinner().remove();
	ok(true, '.spinner() called on element');

	$('<input id="spinner_dis">').spinner().remove();
	ok(true, '.spinner() called on disconnected element');

	el = $('<input>').spinner();
	ok(el.hasClass('ui-spinner-input'), 'input gets ui-spinner-input class on init');

});

test("destroy", function() {
	expect(3);

	$("<input>").appendTo('body').spinner().spinner("destroy").remove();
	ok(true, '.spinner("destroy") called on element');

	$('<input id="spinner_dis">').spinner().spinner("destroy").remove();
	ok(true, '.spinner().spinner("destroy") called on disconnected element');

	el = $('<input>').spinner().spinner('destroy');
	ok(!el.hasClass('ui-spinner-input'), 'ui-spinner-input class removed on destroy');
});

test("re-attach", function() {
	expect(2);

	el = $("<input>").spinner().spinner("destroy").spinner();
	ok(true, '.spinner().spinner("destroy").spinner() called on element');

	el = $('<input id="spinner_dis">').spinner().spinner("destroy").spinner().remove();
	ok(true, '.spinner().spinner("destroy").spinner() called on disconnected element');

});

test("keydown UP on input, increases value not greater than max", function() {
	expect(3);
	
	el = $("#spin");
	options = {
		max:100,
		value:50,
		step:10
	}
	el.spinner(options);
	
	simulateKeyDownUp(el, $.ui.keyCode.UP);
	
	equals(el.val(), 60);
	
	for (i = 0; i<11; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.UP);	
	}
	
	equals(el.val(), 100);
	
	el.val(50);
	
	simulateKeyDownUp(el, $.ui.keyCode.UP);
	
	equals(el.val(), 60);
});

test("keydown DOWN on input, decreases value not less than min", function() {
	expect(3);
	
	el = $("#spin");
	options = {
		min:-100,
		value:50,
		step:10
	}
	el.spinner(options);

	simulateKeyDownUp(el, $.ui.keyCode.DOWN);
	
	equals(el.val(), 40);
	
	for (i = 0; i<21; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.DOWN);	
	}
	
	equals(el.val(), -100);
	
	el.val(50);
	
	simulateKeyDownUp(el, $.ui.keyCode.DOWN);
	
	equals(el.val(), 40);

});

test("keydown PGUP on input, increases value not greater than max", function() {
	expect(3);
	
	el = $("#spin");
	options = {
		max:100,
		value:0,
		step:10
	}
	el.spinner(options);
		
	simulateKeyDownUp(el, $.ui.keyCode.PAGE_UP);
	
	equals(el.val(), 50);
	
	for (i = 0; i<5; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.PAGE_UP);	
	}
	
	equals(el.val(), 100);

	el.val(0);
	
	simulateKeyDownUp(el, $.ui.keyCode.PAGE_UP);
	
	equals(el.val(), 50);
});

test("keydown PGDN on input, decreases value not less than min", function() {
	expect(3);
	
	el = $("#spin");
	options = {
		min:-100,
		value:0,
		step:10
	}
	el.spinner(options);
		
	simulateKeyDownUp(el, $.ui.keyCode.PAGE_DOWN);
	
	equals(el.val(), -50);
	
	for (i = 0; i<5; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.PAGE_DOWN);	
	}
	
	equals(el.val(), -100);
	
	el.val(0);
	
	simulateKeyDownUp(el, $.ui.keyCode.PAGE_DOWN);
	
	equals(el.val(), -50);
});

test("hold SHIFT and keydown UP, increments value but no greater than max", function() {
	expect(2);
	
	el = $("#spin");
	options = {
		max:100,
		value:0,
		step:10
	}
	el.spinner(options);
	
	simulateKeyDownUp(el, $.ui.keyCode.UP, true);
	
	equals(el.val(), 50);
	
	for (i = 0; i<5; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.UP, true);
	}
	
	equals(el.val(), 100);
});

test("hold SHIFT and keydown DOWN, decreases value but no less than min", function() {
	expect(2);
	
	el = $("#spin");
	options = {
		min:-100,
		value:0,
		step:10
	}
	el.spinner(options);
		
	simulateKeyDownUp(el, $.ui.keyCode.DOWN, true);
	
	equals(el.val(), -50);
	
	for (i = 0; i<5; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.DOWN, true);	
	}
	
	equals(el.val(), -100);	
});

test("keydown HOME on input, sets value to minimum", function() {
	el = $("#spin");
	options = {
		min:-100,
		value:50,
		step:10
	}
	el.spinner(options);

	simulateKeyDownUp(el, $.ui.keyCode.HOME);	
	equals(el.val(), -100);
	
	el.spinner('option', 'min', -200);
	
	simulateKeyDownUp(el, $.ui.keyCode.HOME);
	
	equals(el.val(), -200);
});

test("keydown END on input, sets value to maximum", function() {
	el = $("#spin");
	options = {
		max:100,
		value:50,
		step:10
	}
	el.spinner(options);

	simulateKeyDownUp(el, $.ui.keyCode.END);	
	equals(el.val(), 100);
	
	el.spinner('option', 'max', 200);
	
	simulateKeyDownUp(el, $.ui.keyCode.END);
	
	equals(el.val(), 200);
});

test("keydown LEFT on input has no effect", function() {
	el = $("#spin");
	el.spinner();
	var value = el.val();
	
	simulateKeyDownUp(el, $.ui.keyCode.LEFT);	
	equals(el.val(), value);
	
	for (i = 0; i<5; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.LEFT);	
	}
	
	equals(el.val(), value);
});

test("keydown RIGHT on input has no effect", function() {
	expect(2);
	
	el = $("#spin");
	el.spinner();
	var value = el.val();
	
	simulateKeyDownUp(el, $.ui.keyCode.RIGHT);	
	equals(el.val(), value);
	
	for (i = 0; i<5; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.RIGHT);	
	}
	
	equals(el.val(), value);
});

test("mouse click on buttons", function() {
	expect(4);
	
	el = $("#spin").spinner();
	val = 0;
	
	$(".ui-spinner-up").trigger("mousedown").trigger("mouseup");

	equals(el.val(), ++val, "mouse click to up");

	$(".ui-spinner-down").trigger("mousedown").trigger("mouseup");

	equals(el.val(), --val, "mouse click to down");
	
	el.val(50);
	
	$(".ui-spinner-up").trigger("mousedown").trigger("mouseup");
	
	equals(el.val(), 51);

	el.val(50);
	
	$(".ui-spinner-down").trigger("mousedown").trigger("mouseup");
	
	equals(el.val(), 49);
	
});

test("mouse wheel on input", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("reading HTML5 attributes", function() {
	expect(4);
	
	el = $('<input id="spinner" type="number" min="-100" max="100" value="5" step="2">').spinner();

	equals(el.spinner('option', 'value'), 5, 'value');	
	equals(el.spinner('option', 'max'), 100, 'max');
	equals(el.spinner('option', 'min'), -100, 'min');
	equals(el.spinner('option', 'step'), 2, 'step');
});

test("ARIA attributes", function() {
	expect(7);
	
	el = $('#spin').spinner({ min: -5, max: 5, value: 2 });
	
	equals(wrapper().attr('role'), 'spinbutton', 'role');
	equals(wrapper().attr('aria-valuemin'), -5, 'aria-valuemin');
	equals(wrapper().attr('aria-valuemax'), 5, 'aria-valuemax');
	equals(wrapper().attr('aria-valuenow'), 2, 'aria-valuenow');
	
	el.spinner('stepUp');
	
	equals(wrapper().attr('aria-valuenow'), 3, 'stepUp 1 step changes aria-valuenow');
	
	el.spinner('option', { min: -10, max: 10 });
	
	equals(wrapper().attr('aria-valuemin'), -10, 'min option changed aria-valuemin changes');
	equals(wrapper().attr('aria-valuemax'), 10, 'max option changed aria-valuemax changes');
});

})(jQuery);
