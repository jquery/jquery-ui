/*
 * spinner_methods.js
 */
(function($) {

module("spinner: methods");

test("disable", function() {
	var el = $("#spin").spinner({ disabled: false }),
		val = el.val(),
		wrapper = $("#spin").spinner("widget");
	
	ok(!wrapper.hasClass("ui-spinner-disabled"), "before: wrapper does not have ui-spinner-disabled class");
	ok(!el.is(':disabled'), "before: input does not have disabled attribute");

	el.spinner("disable");
	ok(wrapper.hasClass("ui-spinner-disabled"), "after: wrapper has ui-spinner-disabled class");
	ok(el.is(':disabled'), "after: input has disabled attribute");
		
	simulateKeyDownUp(el, $.ui.keyCode.UP);	
	equals(val, el.val(), "keyboard - value does not change on key UP");

	simulateKeyDownUp(el, $.ui.keyCode.DOWN);
	equals(val, el.val(), "keyboard - value does not change on key DOWN");

	simulateKeyDownUp(el, $.ui.keyCode.PAGE_UP);
	equals(val, el.val(), "keyboard - value does not change on key PGUP");

	simulateKeyDownUp(el, $.ui.keyCode.PAGE_DOWN);
	equals(val, el.val(), "keyboard - value does not change on key PGDN");
	
	wrapper.find(":ui-button").first().trigger('mousedown').trigger('mouseup');
	equals(val, el.val(), "mouse - value does not change on clicking up button");

	wrapper.find(":ui-button").last().trigger('mousedown').trigger('mouseup');
	equals(val, el.val(), "mouse - value does not change on clicking down button");
	
	el.spinner('stepUp', 6);
	equals(6, el.val(), "script - stepUp 6 steps changes value");

	el.spinner('stepDown');
	equals(5, el.val(), "script - stepDown 1 step changes value");

	el.spinner('pageUp');
	equals(15, el.val(), "script - pageUp 1 page changes value");

	el.spinner('pageDown');
	equals(5, el.val(), "script - pageDown 1 page changes value");

});

test("enable", function() {
	var el = $("#spin").spinner({ disabled: true })
		val = el.val(),
		wrapper = el.spinner("widget");

	ok(wrapper.hasClass("ui-spinner-disabled"), "before: wrapper has ui-spinner-disabled class");
	ok(el.is(':disabled'), "before: input has disabled attribute");
	
	el.spinner("enable");
	
	ok(!wrapper.hasClass(".ui-spinner-disabled"), "after: wrapper does not have ui-spinner-disabled class");
	ok(!el.is(':disabled'), "after: input does not have disabled attribute");
});

test("pageDown", function() {
	var el = $('#spin').spinner({
		step: 2,
		value: 0,
		min: -100
	});

	el.spinner('pageDown');
	equals(el.val(), -20, "pageDown 1 page");

	el.spinner('pageDown', 3);
	equals(el.val(), -80, "pageDown 3 pages");
	
	el.val(-91).spinner('pageDown');
	equals(el.val(), -100, "value close to min and pageDown 1 page");
	
	el.spinner('pageDown', 10);
	equals(el.val(), -100, "value at min and pageDown 10 pages");
});

test("pageUp", function() {
	var el = $('#spin').spinner({
		step: 2,
		value: 0,
		max: 100
	});

	el.spinner('pageUp');
	equals(el.val(), 20, "pageUp 1 page");

	el.spinner('pageUp', 3);
	equals(el.val(), 80, "pageUp 3 pages");

	el.val(91).spinner('pageUp');
	equals(el.val(), 100, "value close to max and pageUp 1 page");
	
	el.spinner('pageUp', 10);
	equals(el.val(), 100, "value at max and pageUp 10 pages");
	
});

test("stepDown", function() {
	expect(4);

	el = $('#spin').spinner({ step: 2, page: 5, value: 0, min: -15 });

	el.spinner('stepDown')
	equals(el.val(), -2, "stepDown 1 step");

	el.spinner('stepDown', 5)
	equals(el.val(), -12, "stepDown 5 steps");
	
	el.spinner('stepDown', 3);
	equals(el.val(), -15, "close to min and stepDown 3 steps");

	el.spinner('stepDown');
	equals(el.val(), -15, "at min and stepDown 1 step");
});

test("stepUp", function() {
	expect(4);

	el = $('#spin').spinner({ step: 2, page: 5, value: 0, max: 15 });

	el.spinner('stepUp')
	equals(el.val(), 2, "stepUp 1 steps");

	el.spinner('stepUp', 5)
	equals(el.val(), 12, "stepUp 5 steps");
	
	el.spinner('stepUp', 3);
	equals(el.val(), 15, "close to min and stepUp 3 steps");

	el.spinner('stepUp');
	equals(el.val(), 15, "at min and stepUp 1 step");

});

test("value", function() {
	expect(2);
	
	el = $('#spin').spinner({ value: 0 });
	
	el.spinner('value', 10);
	equals(el.val(), 10, "change value via value method");
	
	equals(10, el.spinner('value'), "get value via value method");
});

})(jQuery);
