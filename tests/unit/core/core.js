/*
 * core unit tests
 */
(function($) {

module('core - jQuery extensions');

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
		ok(true, 'callback triggered');
		start();
	});
	other.focus();
});

test('zIndex', function() {
	var el = $('#zIndexAutoWithParent'),
		parent = el.parent();
	equals(el.zIndex(), 100, 'zIndex traverses up to find value');
	equals(parent.zIndex(200), parent, 'zIndex setter is chainable');
	equals(el.zIndex(), 200, 'zIndex setter changed zIndex');
	
	el = $('#zIndexAutoWithParentViaCSS');
	equals(el.zIndex(), 0, 'zIndex traverses up to find CSS value, not found because not positioned');
	
	el = $('#zIndexAutoWithParentViaCSSPositioned');
	equals(el.zIndex(), 100, 'zIndex traverses up to find CSS value');
	el.parent().zIndex(200);
	equals(el.zIndex(), 200, 'zIndex setter changed zIndex, overriding CSS');
	
	equals($('#zIndexAutoNoParent').zIndex(), 0, 'zIndex never explicitly set in hierarchy');
});

})(jQuery);
