/*
 * spinner_core.js
 */

var simulateKeyDownUp = function(el, kCode, shift) {
	el.simulate("keydown",{keyCode:kCode, shiftKey: shift || false })
		.simulate("keyup",{keyCode:kCode, shiftKey: shift || false });
};

(function($) {

// Spinner Tests
module("spinner: core");

test("destroy", function() {
	// cheat a bit to get IE6 to pass
	$("#spin").val(0);
	var beforeHtml = $("#spin").parent().html();
	var afterHtml = $("#spin").spinner().spinner("destroy").parent().html();
	equal( afterHtml, beforeHtml, "before/after html should be the same" );
});

test("keydown UP on input, increases value not greater than max", function() {
	var el = $("#spin").spinner({
		max:100,
		value:50,
		step:10
	});
	
	simulateKeyDownUp(el, $.ui.keyCode.UP);
	equals(el.val(), 60);
	
	for (i = 0; i<11; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.UP);	
	}
	equals(el.val(), 100);
	
	el.spinner("value", 50);
	simulateKeyDownUp(el, $.ui.keyCode.UP);
	equals(el.val(), 60);
});

test("keydown DOWN on input, decreases value not less than min", function() {
	var el = $("#spin").spinner({
		min:-100,
		value:50,
		step:10
	});

	simulateKeyDownUp(el, $.ui.keyCode.DOWN);
	equals(el.val(), 40);
	
	for (i = 0; i<21; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.DOWN);	
	}
	equals(el.val(), -100);
	
	el.spinner("value", 50);
	simulateKeyDownUp(el, $.ui.keyCode.DOWN);
	equals(el.val(), 40);
});

test("keydown PGUP on input, increases value not greater than max", function() {
	var el = $("#spin").spinner({
		max: 500,
		value: 0,
		step: 10
	});
	
	simulateKeyDownUp(el, $.ui.keyCode.PAGE_UP);
	equal(el.val(), 100);
	
	for (i = 0; i<5; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.PAGE_UP);	
	}
	equal(el.val(), 500);
	
	el.spinner("value", 0);
	simulateKeyDownUp(el, $.ui.keyCode.PAGE_UP);
	equals(el.val(), 100);
});

test("keydown PGDN on input, decreases value not less than min", function() {
	var el = $("#spin").spinner({
		min:-500,
		value:0,
		step:10
	});
		
	simulateKeyDownUp(el, $.ui.keyCode.PAGE_DOWN);
	equals(el.val(), -100);
	
	for (i = 0; i<5; i++) {
		simulateKeyDownUp(el, $.ui.keyCode.PAGE_DOWN);	
	}
	equals(el.val(), -500);
	
	el.spinner("value", 0);
	simulateKeyDownUp(el, $.ui.keyCode.PAGE_DOWN);
	equals(el.val(), -100);
});

test("mouse click on buttons", function() {
	var el = $("#spin").spinner(),
		val = 0;
	
	$(".ui-spinner-up").trigger("mousedown").trigger("mouseup");
	equals(el.val(), ++val, "mouse click to up");

	$(".ui-spinner-down").trigger("mousedown").trigger("mouseup");
	equals(el.val(), --val, "mouse click to down");
	
	el.spinner("value", 50);
	$(".ui-spinner-up").trigger("mousedown").trigger("mouseup");
	equals(el.val(), 51);

	el.spinner("value", 50);
	$(".ui-spinner-down").trigger("mousedown").trigger("mouseup");
	equals(el.val(), 49);
});

test("mouse wheel on input", function() {
	expect(3);
	
	var el = $("#spin").spinner();
	el.trigger("mousewheel", 1);
	equal(el.val(), 1);
	
	// mousewheel handler uses a timeout, need to accomodate that
	stop();
	setTimeout(function() {
		el.trigger("mousewheel", -1);
		equal(el.val(), 0);
		
		setTimeout(function() {
			el.trigger("mousewheel", -1);
			equal(el.val(), -1);
			start();
		}, 100);
	}, 100);
	
});

test("reading HTML5 attributes", function() {
	var el = $('<input id="spinner" type="number" min="-100" max="100" value="5" step="2">').spinner();
	equals(el.spinner('option', 'value'), 5, 'value');	
	equals(el.spinner('option', 'max'), 100, 'max');
	equals(el.spinner('option', 'min'), -100, 'min');
	equals(el.spinner('option', 'step'), 2, 'step');
});

test("ARIA attributes", function() {
	var el = $('#spin').spinner({ min: -5, max: 5, value: 2 });;
	
	equals(el.attr('role'), 'spinbutton', 'role');
	equals(el.attr('aria-valuemin'), -5, 'aria-valuemin');
	equals(el.attr('aria-valuemax'), 5, 'aria-valuemax');
	equals(el.attr('aria-valuenow'), 2, 'aria-valuenow');
	
	el.spinner('stepUp');
	
	equals(el.attr('aria-valuenow'), 3, 'stepUp 1 step changes aria-valuenow');
	
	el.spinner('option', { min: -10, max: 10 });
	
	equals(el.attr('aria-valuemin'), -10, 'min option changed aria-valuemin changes');
	equals(el.attr('aria-valuemax'), 10, 'max option changed aria-valuemax changes');
});

})(jQuery);
