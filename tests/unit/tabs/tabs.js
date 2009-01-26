/*
 * tabs unit tests
 */
(function($) {
//
// Tabs Test Helper Functions
//

var defaults = {
	ajaxOptions: null,
	cache: false,
	cookie: null,
	deselectable: false,
	disabled: [],
	event: 'click',
	fx: null,
	idPrefix: 'ui-tabs-',
	panelTemplate: '<div></div>',
	spinner: 'Loading&#8230;',
	tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>'
};

var el;

// need to wait a bit for the pseudo animation...
function defer(defered, ms) {
	var queue = defer.queue || (defer.queue = []);
	if (!queue.length) stop();
	queue.push(defered);
	setTimeout(function() {
		queue.shift()();
		if (!queue.length) start();
	}, ms || 100);
}

module('tabs');

	test('init', function() {
		expect(9);

		var el = $('#tabs1').tabs();
		
		ok(true, '.tabs() called on element');
		ok( el.is('.ui-tabs.ui-widget.ui-widget-content.ui-corner-all'), 'attach classes to container');
		ok( $('ul', el).is('.ui-tabs-nav.ui-helper-reset.ui-helper-clearfix.ui-widget-header.ui-corner-all'), 'attach classes to list' );
		ok( $('div:eq(0)', el).is('.ui-tabs-panel.ui-widget-content.ui-corner-bottom'), 'attach classes to panel' );
		ok( $('li:eq(0)', el).is('.ui-tabs-selected.ui-state-active.ui-corner-top'), 'attach classes to active li');
		ok( $('li:eq(1)', el).is('.ui-state-default.ui-corner-top'), 'attach classes to inactive li');
		equals( el.data('selected.tabs'), 0, 'selected.tabs set' );
		equals( $('li', el).index( $('li.ui-tabs-selected', el) ), 0, 'second tab active');
		equals( $('div', el).index( $('div.ui-tabs-hide', '#tabs1') ), 1, 'second panel should be hidden' );

	});

	test('destroy', function() {
		expect(5);
		
		var el = $('#tabs1').tabs();
		el.tabs('destroy');
		
		ok( el.is(':not(.ui-tabs, .ui-widget, .ui-widget-content, .ui-corner-all)'), 'remove classes from container');
		ok( $('ul', el).is(':not(.ui-tabs-nav, .ui-helper-reset, .ui-helper-clearfix, .ui-widget-header, .ui-corner-all)'), 'remove classes from list' );
		ok( $('div:eq(1)', el).is(':not(.ui-tabs-panel, .ui-widget-content, .ui-corner-bottom, .ui-tabs-hide)'), 'remove classes to panel' );
		ok( $('li:eq(0)', el).is(':not(.ui-tabs-selected, .ui-state-active, .ui-corner-top)'), 'remove classes from active li');	
		ok( $('li:eq(1)', el).is(':not(.ui-state-default, .ui-corner-top)'), 'remove classes from inactive li');

	});

	test("defaults", function() {
		el = $('#tabs1 > ul').tabs();
		$.each(defaults, function(key, val) {
			var actual = el.data(key + '.tabs'), expected = val;
			same(actual, expected, key);
		});
		el.tabs('destroy');
	});

	test('add', function() {
		expect(0);

	});

	test('remove', function() {
		expect(4);

		var el = $('#tabs1').tabs();
		
		el.tabs('remove', 0);
		equals(el.tabs('length'), 2, 'remove tab');
		equals($('li a[href$="fragment-1"]', el).length, 0, 'remove associated list item');
		equals($('#fragment-1').length, 0, 'remove associated panel');
		
		// TODO delete tab -> focus tab to right
		// TODO delete last tab -> focus tab to left
		
		el.tabs('select', 1);
		el.tabs('remove', 1);
		equals(el.data('selected.tabs'), 0, 'update selected property');		
	});

	test('enable', function() {
		expect(0);

	});

	test('disable', function() {
		expect(0);

	});

	test('select', function() {
		expect(0);

	});

	test('load', function() {
		expect(0);

	});

	test('url', function() {
		expect(0);

	});

	test('callback ui object', function() {
		expect(3);

		var uiObj;
		$('#tabs1').tabs({
			show: function(event, ui) {
				uiObj = ui;
			}
		});
		equals(uiObj.tab, $('#tabs1 a')[0], 'should have tab as DOM anchor element');
		equals(uiObj.panel, $('#tabs1 div')[0], 'should have panel as DOM div element');
		equals(uiObj.index, 0, ' should have index');
		
	});
	
	test('selected property', function() {
		expect(5);
		
		$('#tabs1').tabs();
		equals($('#tabs1').data('selected.tabs'), 0, 'selected should be 0 by default');
		
		reset();
		$('#tabs1').tabs({ selected: null });
		equals($('#tabs1').data('selected.tabs'), -1, 'selected should be -1 for all tabs unselected');
		
		reset();
		$('#tabs1').tabs({ selected: -1 });
		equals($('#tabs1').data('selected.tabs'), -1, 'selected should be -1 for all tabs unselected');
		
		reset();
		$('#tabs1').tabs({ selected: 1 });
		equals($('#tabs1').data('selected.tabs'), 1, 'selected should be specified tab');
		
		reset();
		$('#tabs1').tabs({ selected: 8 });
		equals($('#tabs1').data('selected.tabs'), 0, 'selected should default to zero if given value is out of index');
		
	});
	
module('tabs: Options');

	test('selected: null', function() {
		expect(2);

		var el = $('#tabs1');

		el.tabs({ selected: null });
		equals( $('li.ui-tabs-selected', el).length, 0, 'no tab should be selected' );
		equals( $('div.ui-tabs-hide', '#tabs1').length, 3, 'all panels should be hidden' );

	});

	test('deselectable: true', function() {
		expect(7);

		var el = $('#tabs1 > ul');

		el.tabs({ deselectable: true });
		equals( el.data('deselectable.tabs'), true, 'option set' );
		equals( $('li.ui-tabs-deselectable', el).length, 1, 'class "ui-tabs-deselectable" attached once');
		equals( $('li', el).index( $('li.ui-tabs-deselectable', el) ), 0, 'class "ui-tabs-deselectable" attached to first tab');

		el.tabs('select', 1);
		equals( $('li.ui-tabs-deselectable', el).length, 1, 'class "ui-tabs-deselectable" attached once');
		equals( $('li', el).index( $('li.ui-tabs-deselectable', el) ), 1, 'class "ui-tabs-deselectable" attached to second tab');

		el.tabs('select', 1);
		equals( $('li.ui-tabs-deselectable', el).length, 0, 'class "ui-tabs-deselectable" not attached');
		defer(function() {
			equals( $('div.ui-tabs-hide', '#tabs1').length, 3, 'all panels should be hidden' );
		});

	});

	test('cookie', function() {
		expect(6);

		var el = $('#tabs1 > ul');
		var cookieName = 'ui-tabs-' + $.data(el[0]);
		$.cookie(cookieName, null); // blank state
		var cookie = function() {
			return parseInt($.cookie(cookieName), 10);
		};

		el.tabs({ cookie: {} });
		equals(cookie(), 0, 'initial cookie value, no cookie given');

		el.tabs('destroy');
		el.tabs({ selected: 1, cookie: {} });
		equals(cookie(), 1, 'initial cookie value, given selected');

		el.tabs('select', 2);
		equals(cookie(), 2, 'cookie value after tabs select');

		el.tabs('destroy');
		$.cookie(cookieName, 1);
		el.tabs({ cookie: {} });
		equals(cookie(), 1, 'initial cookie value, from existing cookie');

		el.tabs('destroy');
		el.tabs({ cookie: {}, deselectable: true });
		el.tabs('select', 0);
		equals(cookie(), -1, 'cookie value for all unselected tabs');
		
		el.tabs('destroy');
		ok($.cookie(cookieName) === null, 'erase cookie after destroy');

	});


module('tabs: Tickets');

	test('id containing colon, #2715', function() { // http://ui.jquery.com/bugs/ticket/2715
		expect(4);

		var el = $('#tabs2 > ul').tabs();
		ok( $('div.ui-tabs-panel:eq(0)', '#tabs2').is(':visible'), 'first panel should be visible' );
		ok( $('div.ui-tabs-panel:eq(1)', '#tabs2').is(':hidden'), 'second panel should be hidden' );

		el.tabs('select', 1).tabs('select', 0);
		defer(function() {
			ok( $('div.ui-tabs-panel:eq(0)', '#tabs2').is(':visible'), 'first panel should be visible' );
			ok( $('div.ui-tabs-panel:eq(1)', '#tabs2').is(':hidden'), 'second panel should be hidden' );
		});

	});

	test('panel containing inline style, #????', function() {
		expect(3);

		var inlineStyle = function(property) {
			return $('#inline-style')[0].style[property];
		};
		var expected = inlineStyle('height');

		var el = $('#tabs2').tabs();
		equals(inlineStyle('height'), expected, 'init should not remove inline style');

		el.tabs('select', 1);
		defer(function() {
			equals(inlineStyle('height'), expected, 'show tab should not remove inline style');

			el.tabs('select', 0);
			defer(function() {
				equals(inlineStyle('height'), expected, 'hide tab should not remove inline style');
			});

		});

	});
	
	test('Ajax tab with url containing a fragment identifier fails to load, #3627', function() { // http://ui.jquery.com/bugs/ticket/3627
		expect(1);

		var el = $('#tabs2').tabs();
		
		equals( $('a:eq(2)', el).data('load.tabs'), 'test.html', 'should ignore fragment identifier' );

	});

// test('', function() {
// 	expect(0);
// 
// });

})(jQuery);
