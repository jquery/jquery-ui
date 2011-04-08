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

	el.tabs('option', 'active', 1).tabs('option', 'active', 0);
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

	el.tabs('option', 'active', 1);
	equals(inlineStyle('height'), expected, 'show tab should not remove inline style');

	el.tabs('option', 'active', 0);
	equals(inlineStyle('height'), expected, 'hide tab should not remove inline style');

});

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

test('#5893 - Sublist in the tab list are considered as tab', function() {
	// http://dev.jqueryui.com/ticket/5893
	expect(1);

	el = $('#tabs6').tabs();
	equals(el.data("tabs").anchors.length, 2, 'should contain 2 tab');

});

test('#6710 - selectors are global', function() {
	// http://bugs.jqueryui.com/ticket/6710
	expect(1);

	var container = $('\
		<div>\
			<div id="tabs_6710">\
			<ul>\
				<li><a href="#tabs-1_6710">Nunc tincidunt</a></li>\
				<li><a href="#tabs-2_6710">Proin dolor</a></li>\
			</ul>\
			<div id="tabs-1_6710"> <p>first</p> </div>\
			<div id="tabs-2_6710"> <p>second</p>\
		</div>\
	</div>');
	container.find('#tabs_6710').tabs();
	ok( container.find('#tabs-2_6710').is(':hidden'),  'should find panels and add corresponding classes' );
});


})(jQuery);
