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
	equals( el.tabs('option', 'selected'), 0, 'selected option set' );
	equals( $('li', el).index( $('li.ui-tabs-selected', el) ), 0, 'second tab active');
	equals( $('div', el).index( $('div.ui-tabs-hide', '#tabs1') ), 1, 'second panel should be hidden' );
});

test('init with hash', function() {
	expect(5);
	
	//set a hash in the url
	location.hash = '#fragment-2';
	
	//selection of tab with divs ordered differently than list
	el = $('#tabs1').tabs();
	
	equals(el.tabs('option', 'selected'), 1, 'second tab should be selected');
	
	ok(!$('#tabs1 ul li:eq(0)').is('.ui-tabs-selected.ui-state-active'), 'first tab should not be selected nor active');
	ok($('#tabs1 div:eq(0)').is('.ui-tabs-hide'), 'first div for first tab should be hidden');
	
	ok($('#tabs1 ul li:eq(1)').is('.ui-tabs-selected.ui-state-active'), 'second tab should be selected and active');
	ok(!$('#tabs1 div:eq(1)').is('.ui-tabs-hide'), 'second div for second tab should not be hidden');
});

test('init mismatched order with hash', function() {
	expect(5);
	
	//set a hash in the url
	location.hash = '#tabs7-2';
	
	//selection of tab with divs ordered differently than list
	el = $('#tabs7').tabs();
	
	equals(el.tabs('option', 'selected'), 1, 'second tab should be selected');
	
	ok(!$('#tabs7-list li:eq(0)').is('.ui-tabs-selected.ui-state-active'), 'first tab should not be selected nor active');
	ok($('#tabs7 div:eq(1)').is('.ui-tabs-hide'), 'second div for first tab should be hidden');
	
	ok($('#tabs7-list li:eq(1)').is('.ui-tabs-selected.ui-state-active'), 'second tab should be selected and active');
	ok(!$('#tabs7 div:eq(0)').is('.ui-tabs-hide'), 'first div for second tab should not be hidden');
});

test('destroy', function() {
	expect(6);

	el = $('#tabs1').tabs({ collapsible: true });
	$('li:eq(2)', el).simulate('mouseover').find('a').focus();
	el.tabs('destroy');

	ok( el.is(':not(.ui-tabs, .ui-widget, .ui-widget-content, .ui-corner-all, .ui-tabs-collapsible)'), 'remove classes from container');
	ok( $('ul', el).is(':not(.ui-tabs-nav, .ui-helper-reset, .ui-helper-clearfix, .ui-widget-header, .ui-corner-all)'), 'remove classes from list' );
	ok( $('div:eq(1)', el).is(':not(.ui-tabs-panel, .ui-widget-content, .ui-corner-bottom, .ui-tabs-hide)'), 'remove classes to panel' );
	ok( $('li:eq(0)', el).is(':not(.ui-tabs-selected, .ui-state-active, .ui-corner-top)'), 'remove classes from active li');
	ok( $('li:eq(1)', el).is(':not(.ui-state-default, .ui-corner-top)'), 'remove classes from inactive li');
	ok( $('li:eq(2)', el).is(':not(.ui-state-hover, .ui-state-focus)'), 'remove classes from mouseovered or focused li');
});

test('enable', function() {
    expect(2);

	el = $('#tabs1').tabs({ disabled: [ 0, 1 ] });
	el.tabs("enable", 1);
	ok( $('li:eq(1)', el).is(':not(.ui-state-disabled)'), 'remove class from li');
	same(el.tabs('option', 'disabled'), [ ], 'update property');
});

test('disable', function() {
    expect(4);

	// normal
	el = $('#tabs1').tabs();
	el.tabs('disable', 1);
	ok( $('li:eq(1)', el).is('.ui-state-disabled'), 'add class to li');
	same(el.tabs('option', 'disabled'), [ 1 ], 'update disabled property');

	// attempt to disable selected has no effect
	el.tabs('disable', 0);
	ok( $('li:eq(0)', el).is(':not(.ui-state-disabled)'), 'not add class to li');
	same(el.tabs('option', 'disabled'), [ 1 ], 'not update property');
});

test('add', function() {
	expect(4);

	el = $('#tabs1').tabs();
	el.tabs('add', '#new', 'New');

	var added = $('li:last', el).simulate('mouseover');
	ok(added.is('.ui-state-hover'), 'should add mouseover handler to added tab');
	added.simulate('mouseout');
	var other = $('li:first', el).simulate('mouseover');
	ok(other.is('.ui-state-hover'), 'should not remove mouseover handler from existing tab');
	other.simulate('mouseout');

	equals($('a', added).attr('href'), '#new', 'should not expand href to full url of current page');

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
	equals(el.tabs('option', 'selected'), 0, 'update selected property');
});

test('select', function() {
	expect(6);

	el = $('#tabs1').tabs();

	el.tabs('select', 1);
	equals(el.tabs('option', 'selected'), 1, 'should select tab');

	el.tabs('destroy');
	el.tabs({ collapsible: true });
	el.tabs('select', 0);
	equals(el.tabs('option', 'selected'), -1, 'should collapse tab passing in the already selected tab');

	el.tabs('destroy');
	el.tabs({ collapsible: true });
	el.tabs('select', -1);
	equals(el.tabs('option', 'selected'), -1, 'should collapse tab passing in -1');

	el.tabs('destroy');
	el.tabs();
	el.tabs('select', 0);
	equals(el.tabs('option', 'selected'), 0, 'should not collapse tab if collapsible is not set to true');
	el.tabs('select', -1);
	equals(el.tabs('option', 'selected'), 0, 'should not collapse tab if collapsible is not set to true');

	el.tabs('select', '#fragment-2');
	equals(el.tabs('option', 'selected'), 1, 'should select tab by id');
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
