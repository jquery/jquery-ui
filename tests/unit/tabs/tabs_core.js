/*
 * tabs_core.js
 */
var el;

(function($) {

module("tabs: core");

test('navigation markup', function() {
	el = $('#tabs3').tabs();
	ok($('#tabs3-list').hasClass('ui-tabs-nav'), 'custom markup; allow list to be any descendant');
	el.tabs('destroy');

	el = $('#tabs4').tabs();
	ok($('#tabs4-list').hasClass('ui-tabs-nav'), 'first list found becomes nav - ul');
	el.tabs('destroy');

	el = $('#tabs4a').tabs();
	ok($('#tabs4a-list').hasClass('ui-tabs-nav'), 'first list found becomes nav - ol');
	el.tabs('destroy');

	el = $('#tabs5').tabs();
	ok($('#tabs5-list').hasClass('ui-tabs-nav'), 'empty list can be used');
	el.tabs('destroy');
});

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
