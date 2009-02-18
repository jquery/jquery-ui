/*
 * tabs_core.js
 */
var el;

(function($) {

module("tabs: core");

test('ajax', function() {
	expect(4);
	stop();
	
	el = $('#tabs2');
	
	el.tabs({
		selected: 2,
		load: function() {
			// spinner: default spinner
			equals($('li:eq(2) > a > span', el).length, 1, "should restore tab markup after spinner is removed");
			equals($('li:eq(2) > a > span', el).html(), '3', "should restore tab label after spinner is removed");
			el.tabs('destroy');
			el.tabs({
				selected: 2,
				spinner: '<img src="spinner.gif" alt="">',
				load: function() {
					// spinner: image
					equals($('li:eq(2) > a > span', el).length, 1, "should restore tab markup after spinner is removed");
					equals($('li:eq(2) > a > span', el).html(), '3', "should restore tab label after spinner is removed");
					start();
				}
			});			
		}
	});
	
});
	
	
})(jQuery);
