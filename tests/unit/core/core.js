/*
 * core unit tests
 */
(function($) {

module('core - jQuery extensions');

test("attr - aria", function() {
	expect(6);

	var el = $('#aria');

	ok(!el.attr('role'), 'role is empty via attr');
	equals(el.attr('role', 'tablist').attr('role'), 'tablist', 'role is tablist');

	equals(el.attr('aria-expanded'), undefined, 'aria expanded is undefined');

	el.attr('aria-expanded', true);
	equals(el.attr('aria-expanded'), 'true', 'aria expanded is true');

	el.removeAttr('aria-expanded');
	equals(el.attr('aria-expanded'), undefined, 'aria expanded is undefined after removing');

	el.attr('aria-expanded', false);
	equals(el.attr('aria-expanded'), 'false', 'aria expanded is false');
});

test('focus', function() {
	expect(3);
	
	var el = $('#inputTabindex0'),
		// used to remove focus from the main element
		other = $('#inputTabindex10');
	
	// test original functionality
	el.focus(function() {
		ok(true, 'event triggered');
	});
	el.focus();
	other.focus();
	
	// trigger event handler + callback
	stop();
	el.focus(500, function() {
		start();
		ok(true, 'callback triggered');
	});
	other.focus();
});

test('zIndex', function() {
	var el = $('#zIndexAutoWithParent');
	equals(el.zIndex(), 100, 'zIndex traverses up to find value');
	equals(el.zIndex(200), el, 'zIndex setter is chainable');
	equals(el.zIndex(), 200, 'zIndex setter changed zIndex');
	
	equals($('#zIndexAutoNoParent').zIndex(), 0, 'zIndex never explicitly set in hierarchy');
});

test('widget factory, merge multiple option arguments', function() {
	expect(1);
	$.widget("ui.widgetTest", {
		_init: function() {
			same(this.options, {
				disabled: false,
				option1: "value1",
				option2: "value2",
				option3: "value3",
				option4: {
					option4a: "valuea",
					option4b: "valueb"
				}
			});
		}
	});
	$("#main > :first").widgetTest({
		option1: "valuex",
		option2: "valuex",
		option3: "value3",
		option4: {
			option4a: "valuex"
		}
	}, {
		option1: "value1",
		option2: "value2",
		option4: {
			option4b: "valueb"
		}
	}, {
		option4: {
			option4a: "valuea"
		}
	});
});

})(jQuery);
