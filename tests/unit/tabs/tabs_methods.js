(function( $ ) {

module( "tabs: methods" );

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

test( "enable", function() {
	expect( 8 );

	var element = $( "#tabs1" ).tabs({ disabled: true });
	tabs_disabled( element, true );
	element.tabs( "enable" );
	tabs_disabled( element, false );
	element.tabs( "destroy" );

	element.tabs({ disabled: [ 0, 1 ] });
	tabs_disabled( element, [ 0, 1 ] );
	element.tabs( "enable" );
	tabs_disabled( element, false );
});

test( "enable( index )", function() {
    expect( 10 );

	var element = $( "#tabs1" ).tabs({ disabled: true });
	tabs_disabled( element, true );
	// fully disabled -> partially disabled
	element.tabs( "enable", 1 );
	tabs_disabled( element, [ 0, 2 ] );
	// partially disabled -> partially disabled
	element.tabs( "enable", 2 );
	tabs_disabled( element, [ 0 ] );
	// already enabled tab, no change
	element.tabs( "enable", 2 );
	tabs_disabled( element, [ 0 ] );
	// partially disabled -> fully enabled
	element.tabs( "enable", 0 );
	tabs_disabled( element, false );
});

test( "disable", function() {
	expect( 8 );

	var element = $( "#tabs1" ).tabs({ disabled: false });
	tabs_disabled( element, false );
	element.tabs( "disable" );
	tabs_disabled( element, true );
	element.tabs( "destroy" );

	element.tabs({ disabled: [ 0, 1 ] });
	tabs_disabled( element, [ 0, 1 ] );
	element.tabs( "disable" );
	tabs_disabled( element, true );
});

test( "disable( index )", function() {
    expect( 10 );

	var element = $( "#tabs1" ).tabs({ disabled: false });
	tabs_disabled( element, false );
	// fully enabled -> partially disabled
	element.tabs( "disable", 1 );
	tabs_disabled( element, [ 1 ] );
	// partially disabled -> partially disabled
	element.tabs( "disable", 2 );
	tabs_disabled( element, [ 1, 2 ] );
	// already disabled tab, no change
	element.tabs( "disable", 2 );
	tabs_disabled( element, [ 1, 2 ] );
	// partially disabled -> fully disabled
	element.tabs( "disable", 0 );
	tabs_disabled( element, true );
});

test('refresh', function() {
	expect( 13 );

	var el = $('<div id="tabs"><ul></ul></div>').tabs(),
		ul = el.find('ul');

	equals(el.tabs('option', 'active'), false, 'Initially empty, no active tab');

	ul.append('<li><a href="data/test.html">Test 1</a></li>');
	el.tabs('refresh');
	equals( el.tabs('option', 'active'), 0, 'First tab added should be auto active');
	ok( $( "li:eq(0)", el).is('.ui-tabs-active'), 'First tab should be auto active');
	equals( el.find('.ui-tabs-panel').length, 1, 'Panel created after refresh');

	ul.find('li').remove();
	el.tabs('refresh');
	equals( el.find('.ui-tabs-panel').length, 0, 'Panel removed after refresh');
	equals( el.tabs('option', 'active'), false, 'No tabs are active');

	// Hide second tab
	$('<li><a href="#test1">Test 1</a></li><li><a href="#test2">Test 2</a></li><li><a href="#test3">Test 3</a></li>')
		.appendTo( ul );
	$('<div id="test1">Test Panel 1</div><div id="test2">Test Panel 2</div><div id="test3">Test Panel 3</div>')
		.insertAfter( ul );
	el.tabs('refresh');
	equals( el.tabs('option', 'active'), 0, 'Second tab added should not be auto active');
	equals( $( "#test2", el ).css("display"), "none", 'Second panel is hidden');

	// Make second tab active and then remove the first one
	el.tabs('option', 'active', 1);
	el.find('a[href="#test1"]').parent().remove();
	el.tabs('refresh');
	equals( el.tabs('option', 'active'), 0, 'Active index correctly updated');
	ok( el.find('a[href="#test2"]').parent().is('.ui-tabs-active'), 'Tab is still active');

	// Refresh with disabled tabs
	el.tabs('disable', 1);
	same( el.tabs('option', 'disabled'), [ 1 ], 'Second tab disabled');

	el.find('a[href="#test3"]').remove();
	ul.append('<li><a href="#test4">Test 4</a></li>');
	$('<div id="test4">Test Panel 4</div>').insertAfter( ul );
	el.tabs('refresh');
	equals( el.tabs('option', 'disabled'), false, 'Not disabled');

	ul.append('<li class="ui-state-disabled"><a href="#test3">Test 3</a></li>');
	$('<div id="test3">Test Panel 3</div>').insertAfter( ul );
	el.tabs('refresh');
	same( el.tabs('option', 'disabled'), [ 2 ], 'Second tab disabled');
});

test('load', function() {
	ok(false, "missing test - untested code is broken code.");
});

}( jQuery ) );
