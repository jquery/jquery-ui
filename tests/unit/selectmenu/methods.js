define( [
	"jquery",
	"ui/selectmenu"
], function( $ ) {

module( "selectmenu: methods" );

test( "destroy", function( assert ) {
	expect( 1 );
	assert.domEqual( "#speed", function() {
		$( "#speed" ).selectmenu().selectmenu( "destroy" );
	});
});

test( "open / close", function() {
	expect( 5 );

	var element = $( "#speed" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" );

	ok( menu.is( ":hidden" ), "menu hidden on init" );

	element.selectmenu( "open" );
	ok( menu.is( ":visible" ), "open: menu visible" );
	equal( menu.attr( "aria-hidden" ), "false", "open: menu aria-disabled" );

	element.selectmenu( "close" );
	ok( menu.is( ":hidden" ), "close: menu hidden" );
	equal( menu.attr( "aria-hidden" ), "true", "close: menu aria-disabled" );
});

test( "enable / disable", function() {
	expect( 10 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.selectmenu( "disable" );
	ok( element.selectmenu( "option", "disabled" ), "disable: widget option" );
	equal( element.attr( "disabled" ), "disabled", "disable: native select disabled" );
	equal( button.attr( "aria-disabled" ), "true", "disable: button ARIA" );
	equal( button.attr( "tabindex" ), -1, "disable: button tabindex" );
	equal( menu.attr( "aria-disabled" ), "true", "disable: menu ARIA" );

	element.selectmenu( "enable" );
	ok( !element.selectmenu( "option", "disabled" ), "enable: widget option" );
	equal( element.attr( "disabled" ), undefined, "enable: native select disabled" );
	equal( button.attr( "aria-disabled" ), "false", "enable: button ARIA" );
	equal( button.attr( "tabindex" ), 0, "enable: button tabindex" );
	equal( menu.attr( "aria-disabled" ), "false", "enable: menu ARIA" );
});

test( "refresh - structure", function() {
	expect( 3 );

	var menuItems,
		element = $( "#speed" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" ),
		options = element.find( "option" );

	options.eq( 0 )
		.attr( "value", "changed_value" )
		.text( "Changed value" );
	options.eq( 2 ).remove();
	options.eq( 3 ).remove();
	element.append( "<option value=\"added_option\">Added option</option>" );
	element.selectmenu( "refresh" );

	options = element.find( "option" );
	menuItems = menu.find( "li" ).not( ".ui-selectmenu-optgroup" );

	equal( options.length, menuItems.length, "menu item length" );
	equal( "Added option", menuItems.last().text(), "added item" );
	equal( "Changed value", menuItems.eq( 0 ).text(), "changed item" );
});

asyncTest( "refresh - change selected option", function() {
	expect( 4 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" );

	equal( element.find( "option:selected" ).text(), button.text(), "button text after init" );

	button.simulate( "focus" );
	setTimeout(function() {
		equal( element.find( "option:selected" ).text(), button.text(), "button text after focus" );

		element[ 0 ].selectedIndex = 0;
		element.selectmenu( "refresh" );
		equal( element.find( "option:selected" ).text(), button.text(),
			"button text after changing selected option" );

		element.find( "option" ).prop( "selected", false );
		element.append( "<option selected value=\"selected_option\">Selected option</option>" );
		element.selectmenu( "refresh" );
		equal( "Selected option", button.text(), "button text after adding selected option" );

		start();
	});
});

test( "refresh - disabled select", function() {
	expect( 4 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.prop( "disabled", true );
	element.selectmenu( "refresh" );

	ok( element.selectmenu( "option", "disabled" ), "widget option" );
	equal( button.attr( "aria-disabled" ), "true", "button ARIA" );
	equal( button.attr( "tabindex" ), -1, "button tabindex" );
	equal( menu.attr( "aria-disabled" ), "true", "menu ARIA" );
});

test( "refresh - disabled option", function( assert ) {
	expect( 1 );

	var disabledItem,
		element = $( "#speed" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" ).parent();

	element.find( "option" ).eq( 2 ).prop( "disabled", true );
	element.selectmenu( "refresh" );

	disabledItem = menu.find( "li" ).not( ".ui-selectmenu-optgroup" ).eq( 2 );
	assert.hasClasses( disabledItem, "ui-state-disabled" );
});

test( "refresh - disabled optgroup", function( assert ) {
	var i, item,
		element = $( "#files" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" ).parent(),
		originalDisabledOptgroup = element.find( "optgroup" ).first(),
		originalDisabledOptions = originalDisabledOptgroup.find( "option" );

	expect( 2 + originalDisabledOptions.length );

	originalDisabledOptgroup.prop( "disabled", true );
	element.selectmenu( "refresh" );

	item = menu.find( "li.ui-selectmenu-optgroup" ).first();

	assert.hasClasses( item, "ui-state-disabled" );

	equal(
		menu.find( "li" ).not( ".ui-selectmenu-optgroup" ).filter( ".ui-state-disabled" ).length,
		originalDisabledOptions.length,
		"disabled options"
	);
	for ( i = 0; i < originalDisabledOptions.length; i++ ) {
		item = item.next( "li" );
		assert.hasClasses( item, "ui-state-disabled" );
	}
});

test( "refresh - remove all options", function() {
	expect( 2 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.children().remove();
	element.selectmenu( "refresh" );
	equal( button.find( ".ui-selectmenu-text" ).html(), $( "<span>&#160;</span>" ).html(),
		"Empty button text" );
	equal( menu.children().length, 0, "Empty menu" );
});

test( "widget and menuWidget", function( assert ) {
	expect( 4 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	equal( button.length, 1, "button: one element" );
	assert.hasClasses( button, "ui-selectmenu-button" );

	equal( menu.length, 1, "Menu Widget: one element" );
	ok( menu.is( "ul.ui-menu" ), "Menu Widget: element and class" );
});

} );
