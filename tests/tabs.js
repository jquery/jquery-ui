/*
 * tabs unit tests
 */
(function($) {

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
		expect(4);

		var el = $('#tabs1 > ul').tabs();
		ok(true, '.tabs() called on element');
	
		el.tabs('destroy').tabs({ selected: 1 });
		equals( el.data('selected.tabs'), 1, 'selected.tabs set' );
		equals( $('li', el).index( $('li.ui-tabs-selected', el) ), 1, 'second tab active');
		equals( $('div', '#tabs1').index( $('div.ui-tabs-hide', '#tabs1') ), 0, 'first panel should be hidden' );
	
	});

	test('destroy', function() {
		expect(0);
	
	});

	test("defaults", function() {
	
		var expected = {
			deselectable: false,
			event: 'click',
			disabled: [],
			cookie: null,
			spinner: 'Loading&#8230;',
			cache: false,
			idPrefix: 'ui-tabs-',
			ajaxOptions: null,
			fx: null,
			tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a></li>',
			panelTemplate: '<div></div>',
			navClass: 'ui-tabs-nav',
			selectedClass: 'ui-tabs-selected',
			deselectableClass: 'ui-tabs-deselectable',
			disabledClass: 'ui-tabs-disabled',
			panelClass: 'ui-tabs-panel',
			hideClass: 'ui-tabs-hide',
			loadingClass: 'ui-tabs-loading'
		};

		var el = $("#tabs1").tabs();

		for (var optionName in expected) {
			var actual = el.data(optionName + '.tabs'), expects = expected[optionName];

			if (optionName == 'disabled')
				compare(actual, expects, optionName);
			else
				equals(actual, expects, optionName);
			
		}
	
	});

	test('add', function() {
		expect(0);
	
	});

	test('remove', function() {
		expect(0);
	
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


module('tabs: Options');

	test('select: null', function() {
		expect(3);
	
		var el = $('#tabs1 > ul');
	
		el.tabs({ selected: null });
		equals( el.data('selected.tabs'), null, 'option set' );
		equals( $('li.ui-tabs-selected', el).length, 0, 'all tabs should be deselected' );
		equals( $('div.ui-tabs-hide', '#tabs1').length, 3, 'all panels should be hidden' );
	
		// TODO select == null with cookie
		// TODO select == null with select method
	
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
		expect(5);
	
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
		ok($.cookie(cookieName) === null, 'erase cookie after destroy');
	
	});


module('tabs: Tickets');

	test('id containing colon, #????', function() {
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
		
		var el = $('#tabs2 > ul').tabs();
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
	
// test('', function() {
// 	expect(0);
// 	
// });

})(jQuery);
