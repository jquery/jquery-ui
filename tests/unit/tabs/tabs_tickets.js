/*
 * tabs_tickets.js
 */
(function($) {

module("tabs: tickets");

test('#2715 - id containing colon', function() {
	// http://dev.jqueryui.com/ticket/2715
	expect(4);

	el = $('#tabs2').tabs();
	ok( $('div.ui-tabs-panel:eq(0)', '#tabs2').is(':visible'), 'first panel should be visible' );
	ok( $('div.ui-tabs-panel:eq(1)', '#tabs2').is(':hidden'), 'second panel should be hidden' );

	el.tabs('select', 1).tabs('select', 0);
	ok( $('div.ui-tabs-panel:eq(0)', '#tabs2').is(':visible'), 'first panel should be visible' );
	ok( $('div.ui-tabs-panel:eq(1)', '#tabs2').is(':hidden'), 'second panel should be hidden' );

});

test('#???? - panel containing inline style', function() {
	expect(3);

	var inlineStyle = function(property) {
		return $('#inline-style')[0].style[property];
	};
	var expected = inlineStyle('height');

	el = $('#tabs2').tabs();
	equals(inlineStyle('height'), expected, 'init should not remove inline style');

	el.tabs('select', 1);
	equals(inlineStyle('height'), expected, 'show tab should not remove inline style');

	el.tabs('select', 0);
	equals(inlineStyle('height'), expected, 'hide tab should not remove inline style');

});

test('#3627 - Ajax tab with url containing a fragment identifier fails to load', function() {
	// http://dev.jqueryui.com/ticket/3627
	expect(1);

	el = $('#tabs2').tabs();
	
	ok(/test.html$/.test( $('a:eq(2)', el).data('load.tabs') ), 'should ignore fragment identifier');

});

test('#4033 - IE expands hash to full url and misinterprets tab as ajax', function() {
	// http://dev.jqueryui.com/ticket/4033
	expect(1);
	
	el = $('<div><ul><li><a href="#tab">Tab</a></li></ul><div id="tab"></div></div>')
			.appendTo('#main').tabs();
    
	equals($('a', el).data('load.tabs'), undefined, 'should not create ajax tab');
	
});


})(jQuery);
