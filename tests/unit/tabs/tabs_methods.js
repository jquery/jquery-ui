/*
 * tabs_methods.js
 */
(function($) {

module("tabs: methods");

test('init', function() {
	expect(9);

	el = $('#tabs1').tabs();
	
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
	
	el = $('#tabs1').tabs();
	el.tabs('destroy');
	
	ok( el.is(':not(.ui-tabs, .ui-widget, .ui-widget-content, .ui-corner-all)'), 'remove classes from container');
	ok( $('ul', el).is(':not(.ui-tabs-nav, .ui-helper-reset, .ui-helper-clearfix, .ui-widget-header, .ui-corner-all)'), 'remove classes from list' );
	ok( $('div:eq(1)', el).is(':not(.ui-tabs-panel, .ui-widget-content, .ui-corner-bottom, .ui-tabs-hide)'), 'remove classes to panel' );
	ok( $('li:eq(0)', el).is(':not(.ui-tabs-selected, .ui-state-active, .ui-corner-top)'), 'remove classes from active li');	
	ok( $('li:eq(1)', el).is(':not(.ui-state-default, .ui-corner-top)'), 'remove classes from inactive li');

});

test('enable', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('disable', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('add', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('remove', function() {
	expect(4);

	el = $('#tabs1').tabs();
	
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

test('select', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('load', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('url', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('length', function() {
	expect(1);
	
	el = $('#tabs1').tabs();
	equals(el.tabs('length'), $('ul a', el).length, ' should return length');
	
});

test('rotate', function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
