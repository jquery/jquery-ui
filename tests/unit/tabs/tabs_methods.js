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
	ok( $('li:eq(0)', el).is('.ui-tabs-active.ui-state-active.ui-corner-top'), 'attach classes to active li');
	ok( $('li:eq(1)', el).is('.ui-state-default.ui-corner-top'), 'attach classes to inactive li');
	equals( el.tabs('option', 'active'), 0, 'active option set' );
	equals( $('li', el).index( $('li.ui-tabs-active', el) ), 0, 'second tab active');
	equals( $('div', el).index( $('div:hidden', '#tabs1') ), 1, 'second panel should be hidden' );
});

test('init with hash', function() {
	expect(5);
	
	//set a hash in the url
	location.hash = '#fragment-2';
	
	//selection of tab with divs ordered differently than list
	el = $('#tabs1').tabs();
	
	equals(el.tabs('option', 'active'), 1, 'second tab should be active');
	
	ok(!$('#tabs1 ul li:eq(0)').is('.ui-tabs-active.ui-state-active'), 'first tab should not be selected nor active');
	ok($('#tabs1 div:eq(0)').is(':hidden'), 'first div for first tab should be hidden');
	
	ok($('#tabs1 ul li:eq(1)').is('.ui-tabs-active.ui-state-active'), 'second tab should be selected and active');
	ok(!$('#tabs1 div:eq(1)').is(':hidden'), 'second div for second tab should not be hidden');
});

test('init mismatched order with hash', function() {
	expect(5);
	
	//set a hash in the url
	location.hash = '#tabs7-2';
	
	//selection of tab with divs ordered differently than list
	el = $('#tabs7').tabs();
	
	equals(el.tabs('option', 'active'), 1, 'second tab should be active');
	
	ok(!$('#tabs7-list li:eq(0)').is('.ui-tabs-active.ui-state-active'), 'first tab should not be selected nor active');
	ok($('#tabs7 div:eq(1)').is(':hidden'), 'second div for first tab should be hidden');
	
	ok($('#tabs7-list li:eq(1)').is('.ui-tabs-active.ui-state-active'), 'second tab should be selected and active');
	ok(!$('#tabs7 div:eq(0)').is(':hidden'), 'first div for second tab should not be hidden');
});

test('destroy', function() {
	expect(6);

	el = $('#tabs1').tabs({ collapsible: true });
	$('li:eq(2)', el).simulate('mouseover').find('a').focus();
	el.tabs('destroy');

	ok( el.is(':not(.ui-tabs, .ui-widget, .ui-widget-content, .ui-corner-all, .ui-tabs-collapsible)'), 'remove classes from container');
	ok( $('ul', el).is(':not(.ui-tabs-nav, .ui-helper-reset, .ui-helper-clearfix, .ui-widget-header, .ui-corner-all)'), 'remove classes from list' );
	ok( $('div:eq(1)', el).is(':not(.ui-tabs-panel, .ui-widget-content, .ui-corner-bottom)'), 'remove classes to panel' );
	ok( $('li:eq(0)', el).is(':not(.ui-tabs-active, .ui-state-active, .ui-corner-top)'), 'remove classes from active li');
	ok( $('li:eq(1)', el).is(':not(.ui-state-default, .ui-corner-top)'), 'remove classes from inactive li');
	ok( $('li:eq(2)', el).is(':not(.ui-state-hover, .ui-state-focus)'), 'remove classes from mouseovered or focused li');
});

test('enable', function() {
    expect(8);

	el = $('#tabs1').tabs({ disabled: [ 0, 1 ] });
	el.tabs("enable", 1);
	ok( $('li:eq(1)', el).is(':not(.ui-state-disabled)'), 'remove class from li');
	same(el.tabs('option', 'disabled'), [ 0 ], 'update property');
	
	// enable all tabs
	el.tabs({ disabled: [ 0, 1 ] });
	el.tabs("enable");
	ok( !$('li.ui-state-disabled', el).length, 'enable all');
	same(el.tabs('option', 'disabled'), false, 'update property');

	el.tabs('destroy');
	// enable all tabs one by one
	el.tabs({ disabled: [ 1, 2 ] });
	el.tabs("enable", 1);
	ok( $('li:eq(1)', el).is(':not(.ui-state-disabled)'), 'remove class from li');
	same(el.tabs('option', 'disabled'), [ 2 ], 'update property');
	el.tabs("enable", 2);
	ok( $('li:eq(2)', el).is(':not(.ui-state-disabled)'), 'remove class from li');
	same( el.tabs('option', 'disabled'), false, 'set to false');
});

test('disable', function() {
    expect(12);

	// normal
	el = $('#tabs1').tabs();
	el.tabs('disable', 1);
	ok( $('li:eq(1)', el).is('.ui-state-disabled'), 'add class to li');
	same(el.tabs('option', 'disabled'), [ 1 ], 'update disabled property');

	// disable selected
	el.tabs('disable', 0);
	ok( $('li:eq(0)', el).is('.ui-state-disabled'), 'add class to selected li');
	same(el.tabs('option', 'disabled'), [ 0, 1 ], 'update disabled property');
	
	// disable all tabs
	el.tabs('disable');
	same( $('li.ui-state-disabled', el).length, 3, 'disable all');
	same(el.tabs('option', 'disabled'), true, 'set to true');

	el.tabs("destroy");
	// disable all tabs one by one
	el.tabs();
	el.tabs('disable', 0);
	ok( $('li:eq(0)', el).is('.ui-state-disabled'), 'add class to li');
	same(el.tabs('option', 'disabled'), [ 0 ], 'update disabled property');
	el.tabs('disable', 1);
	ok( $('li:eq(1)', el).is('.ui-state-disabled'), 'add class to li');
	same(el.tabs('option', 'disabled'), [ 0, 1 ], 'update disabled property');
	el.tabs('disable', 2);
	ok( $('li:eq(2)', el).is('.ui-state-disabled'), 'add class to li');
	same(el.tabs('option', 'disabled'), true, 'set to true');
});

test('refresh', function() {
	expect(5);

	var el = $('<div id="tabs"><ul></ul></div>').tabs(),
		ul = el.find('ul');

	equals(el.tabs('option', 'active'), false, 'Initially empty, no active tab');

	ul.append('<li><a href="data/test.html">Test 1</a></li>');
	el.tabs('refresh');
	equals( el.find('.ui-tabs-panel').length, 1, 'Panel created after refresh');

	ul.find('li').remove();
	el.tabs('refresh');
	equals( el.find('.ui-tabs-panel').length, 0, 'Panel removed after refresh');

	ul.append('<li><a href="#test1">Test 1</a></li>');
	$('<div id="test1">Test Panel 1</div>').insertAfter( ul );
	el.tabs('refresh');
	el.tabs('option', 'active', 0);
	equals( el.tabs('option', 'active'), 0, 'First tab added should be auto active');

	ul.append('<li><a href="#test2">Test 2</a></li>');
	$('<div id="test2">Test Panel 2</div>').insertAfter( ul );
	el.tabs('refresh');
	equals( el.tabs('option', 'active'), 0, 'Second tab added should not be auto active');
});

test('load', function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
