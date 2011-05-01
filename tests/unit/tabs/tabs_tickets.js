/*
 * tabs_tickets.js
 */
(function($) {

module("tabs: tickets");

test('#3627 - Ajax tab with url containing a fragment identifier fails to load', function() {
	// http://dev.jqueryui.com/ticket/3627
	expect(1);

	el = $('#tabs2').tabs({
		active: 2,
		beforeLoad: function( event, ui ) {
			event.preventDefault();
			ok(/test.html$/.test( ui.ajaxSettings.url ), 'should ignore fragment identifier');
		}
	});
});

test('#4033 - IE expands hash to full url and misinterprets tab as ajax', function() {
	// http://dev.jqueryui.com/ticket/4033
	expect(1);
	
	el = $('<div><ul><li><a href="#tab">Tab</a></li></ul><div id="tab"></div></div>');
	el.appendTo('#main');
	el.tabs({
		beforeLoad: function( event, ui ) {
			event.preventDefault();
			ok( false, 'should not be an ajax tab');
		}
	});

	equals($('a', el).attr('aria-controls'), 'tab', 'aria-contorls attribute is correct');
});

})(jQuery);
