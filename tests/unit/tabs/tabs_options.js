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
	equals(el.data('collapsible.tabs'), true, 'option set');
	ok(el.is('.ui-tabs-collapsible'), 'extra class "ui-tabs-collapsible" attached');
	el.tabs('select', 0);
	equals($('div.ui-tabs-hide', '#tabs1').length, 3, 'all panels should be hidden');
	el.data('collapsible.tabs', false);
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

// deprecated... shadows collapsible
test('deselectable (deprecated)', function() {
	expect(4);

	el = $('#tabs1');
	
	el.tabs({ deselectable: true });
	equals(el.data('collapsible.tabs'), true, 'option set');
	ok(el.is('.ui-tabs-collapsible'), 'extra class "ui-tabs-collapsible" attached');
	el.tabs('select', 0);
	equals($('div.ui-tabs-hide', '#tabs1').length, 3, 'all panels should be hidden');
	el.data('deselectable.tabs', false);
	ok(el.is(':not(.ui-tabs-collapsible)'), 'extra class "ui-tabs-collapsible" not attached');
	
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

test('selected: null', function() { // TODO move to selected
	expect(2);

	el = $('#tabs1');

	el.tabs({ selected: null });
	equals( $('li.ui-tabs-selected', el).length, 0, 'no tab should be selected' );
	equals( $('div.ui-tabs-hide', '#tabs1').length, 3, 'all panels should be hidden' );

});

test('selected', function() {
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

test('spinner', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('tabTemplate', function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
