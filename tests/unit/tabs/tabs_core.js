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

})(jQuery);
