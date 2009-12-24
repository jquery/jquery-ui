/*
 * tabs_options.js
 */
(function($) {

module("tabs: options");

test('ajaxOptions', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('cache', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('collapsible', function() {
	expect(4);

	el = $('#tabs1');

	el.tabs({ collapsible: true });
	equals(el.tabs('option', 'collapsible'), true, 'option set');
	ok(el.is('.ui-tabs-collapsible'), 'extra class "ui-tabs-collapsible" attached');
	el.tabs('select', 0);
	equals($('div.ui-tabs-hide', '#tabs1').length, 3, 'all panels should be hidden');
	el.tabs('option', 'collapsible', false);
	ok(el.is(':not(.ui-tabs-collapsible)'), 'extra class "ui-tabs-collapsible" not attached');
	
});

test('cookie', function() {
	expect(6);

	el = $('#tabs1');
	var cookieName = 'tabs_test', cookieObj = { name: cookieName };
	$.cookie(cookieName, null); // blank state
	var cookie = function() {
		return parseInt($.cookie(cookieName), 10);
	};

	el.tabs({ cookie: cookieObj });
	equals(cookie(), 0, 'initial cookie value');

	el.tabs('destroy');
	el.tabs({ selected: 1, cookie: cookieObj });
	equals(cookie(), 1, 'initial cookie value, from selected property');

	el.tabs('select', 2);
	equals(cookie(), 2, 'cookie value updated after select');
	
	el.tabs('destroy');
	$.cookie(cookieName, 1);
	el.tabs({ cookie: cookieObj });
	equals(cookie(), 1, 'initial cookie value, from existing cookie');
	
	el.tabs('destroy');
	el.tabs({ cookie: cookieObj, collapsible: true });
	el.tabs('select', 0);
	equals(cookie(), -1, 'cookie value for all tabs unselected');
	
	el.tabs('destroy');
	ok($.cookie(cookieName) === null, 'erase cookie after destroy');

});

test('disabled', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('event', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('fx', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('idPrefix', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('panelTemplate', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('selected', function() {
	expect(8);
		
	el = $('#tabs1').tabs();
	equals(el.tabs('option', 'selected'), 0, 'should be 0 by default');
	
	el.tabs('destroy');
	el.tabs({ selected: -1 });
	equals(el.tabs('option', 'selected'), -1, 'should be -1 for all tabs unselected');
	equals( $('li.ui-tabs-selected', el).length, 0, 'no tab should be selected' );
	equals( $('div.ui-tabs-hide', '#tabs1').length, 3, 'all panels should be hidden' );

	el.tabs('destroy');
	el.tabs({ selected: null });
	equals(el.tabs('option', 'selected'), -1, 'should be -1 for all tabs unselected with value null (deprecated)');
	
	el.tabs('destroy');
	el.tabs({ selected: 1 });
	equals(el.tabs('option', 'selected'), 1, 'should be specified tab');
	
	el.tabs('destroy');
	el.tabs({ selected: 99 });
	equals(el.tabs('option', 'selected'), 0, 'selected should default to zero if given value is out of index');
	
	el.tabs('destroy');
	el.tabs({ collapsible: true });
	el.tabs('option', 'selected', 0);
	equals(el.tabs('option', 'selected'), 0, 'should not collapse tab if value is same as selected');
});

test('spinner', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('tabTemplate', function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
