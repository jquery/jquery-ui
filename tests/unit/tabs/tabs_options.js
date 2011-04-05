/*
 * tabs_options.js
 */
(function($) {

module("tabs: options");

test('collapsible', function() {
	expect(4);

	el = $('#tabs1');

	el.tabs({ collapsible: true });
	equals(el.tabs('option', 'collapsible'), true, 'option set');
	ok(el.is('.ui-tabs-collapsible'), 'extra class "ui-tabs-collapsible" attached');

	el.tabs('option', 'active', false);
	equals($('div:hidden', '#tabs1').length, 3, 'all panels should be hidden');

	el.tabs('option', 'collapsible', false);
	ok(el.is(':not(.ui-tabs-collapsible)'), 'extra class "ui-tabs-collapsible" not attached');

});

test('disabled', function() {
	expect(4);

	el = $('#tabs1').tabs();
	same(el.tabs('option', 'disabled'), false, "should not disable any tab by default");

	el.tabs('option', 'disabled', [ 1 ]);
	same(el.tabs('option', 'disabled'), [ 1 ], "should set property"); // everything else is being tested in methods module...

	el.tabs('option', 'disabled', [ 0, 1 ]);
	same(el.tabs('option', 'disabled'), [ 0, 1 ], "should disable given tabs, even selected one"); // ...

	el.tabs('option', 'disabled', [ ]);
	same(el.tabs('option', 'disabled'), false, "should not disable any tab"); // ...
});

test('event', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('fx', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('active', function() {
	expect(8);

	el = $('#tabs1').tabs();
	equals(el.tabs('option', 'active'), 0, 'should be 0 by default');

	el.tabs('destroy');
	el.tabs({ active: false });
	equals(el.tabs('option', 'active'), false, 'should be false for all tabs deactive');
	equals( $('li.ui-tabs-selected', el).length, 0, 'no tab should be active' );
	equals( $('div:hidden', '#tabs1').length, 3, 'all panels should be hidden' );

	el.tabs('destroy');
	el.tabs({ active: null });
	equals(el.tabs('option', 'active'), false, 'should be false for all tabs deactive with value null (deprecated)');

	el.tabs('destroy');
	el.tabs({ active: 1 });
	equals(el.tabs('option', 'active'), 1, 'should be specified tab');

	el.tabs('destroy');
	el.tabs({ active: 99 });
	equals(el.tabs('option', 'active'), 0, 'active should default to zero if given value is out of index');

	el.tabs('destroy');
	el.tabs({ collapsible: true });
	el.tabs('option', 'active', 0);
	equals(el.tabs('option', 'active'), 0, 'should not collapse tab if value is same as active');
});

})(jQuery);
