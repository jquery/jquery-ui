define( [
	"qunit",
	"jquery",
	"ui/widgets/selectmenu"
], function( QUnit, $ ) {

QUnit.module( "selectmenu: methods" );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 1 );
	assert.domEqual( "#speed", function() {
		$( "#speed" ).selectmenu().selectmenu( "destroy" );
	} );
} );

QUnit.test( "open / close", function( assert ) {
	assert.expect( 5 );

	var element = $( "#speed" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" );

	assert.ok( menu.is( ":hidden" ), "menu hidden on init" );

	element.selectmenu( "open" );
	assert.ok( menu.is( ":visible" ), "open: menu visible" );
	assert.equal( menu.attr( "aria-hidden" ), "false", "open: menu aria-disabled" );

	element.selectmenu( "close" );
	assert.ok( menu.is( ":hidden" ), "close: menu hidden" );
	assert.equal( menu.attr( "aria-hidden" ), "true", "close: menu aria-disabled" );
} );

QUnit.test( "enable / disable", function( assert ) {
	assert.expect( 10 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.selectmenu( "disable" );
	assert.ok( element.selectmenu( "option", "disabled" ), "disable: widget option" );
	assert.equal( element.attr( "disabled" ), "disabled", "disable: native select disabled" );
	assert.equal( button.attr( "aria-disabled" ), "true", "disable: button ARIA" );
	assert.equal( button.attr( "tabindex" ), -1, "disable: button tabindex" );
	assert.equal( menu.attr( "aria-disabled" ), "true", "disable: menu ARIA" );

	element.selectmenu( "enable" );
	assert.ok( !element.selectmenu( "option", "disabled" ), "enable: widget option" );
	assert.equal( element.attr( "disabled" ), undefined, "enable: native select disabled" );
	assert.equal( button.attr( "aria-disabled" ), "false", "enable: button ARIA" );
	assert.equal( button.attr( "tabindex" ), 0, "enable: button tabindex" );
	assert.equal( menu.attr( "aria-disabled" ), "false", "enable: menu ARIA" );
} );

QUnit.test( "refresh - structure", function( assert ) {
	assert.expect( 3 );

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

	assert.equal( options.length, menuItems.length, "menu item length" );
	assert.equal( "Added option", menuItems.last().text(), "added item" );
	assert.equal( "Changed value", menuItems.eq( 0 ).text(), "changed item" );
} );

QUnit.test( "refresh - change selected option", function( assert ) {
	var ready = assert.async();
	assert.expect( 4 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" );

	assert.equal( $.trim( button.text() ), "Medium", "button text after init" );

	button.simulate( "focus" );

	setTimeout( function() {
		assert.equal( $.trim( button.text() ), "Medium", "button text after focus" );

		element[ 0 ].selectedIndex = 0;
		element.selectmenu( "refresh" );
		assert.equal( $.trim( button.text() ), "Slower", "button text after changing selected option" );

		element.find( "option" ).prop( "selected", false );
		element.append( "<option selected value=\"selected_option\">Selected option</option>" );
		element.selectmenu( "refresh" );
		assert.equal( $.trim( button.text() ), "Selected option", "button text after adding selected option" );

		ready();
	} );
} );

QUnit.test( "refresh - disabled select", function( assert ) {
	assert.expect( 4 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.prop( "disabled", true );
	element.selectmenu( "refresh" );

	assert.ok( element.selectmenu( "option", "disabled" ), "widget option" );
	assert.equal( button.attr( "aria-disabled" ), "true", "button ARIA" );
	assert.equal( button.attr( "tabindex" ), -1, "button tabindex" );
	assert.equal( menu.attr( "aria-disabled" ), "true", "menu ARIA" );
} );

QUnit.test( "refresh - disabled option", function( assert ) {
	assert.expect( 1 );

	var disabledItem,
		element = $( "#speed" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" ).parent();

	element.find( "option" ).eq( 2 ).prop( "disabled", true );
	element.selectmenu( "refresh" );

	disabledItem = menu.find( "li" ).not( ".ui-selectmenu-optgroup" ).eq( 2 );
	assert.hasClasses( disabledItem, "ui-state-disabled" );
} );

QUnit.test( "refresh - disabled optgroup", function( assert ) {
	var i, item,
		element = $( "#files" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" ).parent(),
		originalDisabledOptgroup = element.find( "optgroup" ).first(),
		originalDisabledOptions = originalDisabledOptgroup.find( "option" );

	assert.expect( 2 + originalDisabledOptions.length );

	originalDisabledOptgroup.prop( "disabled", true );
	element.selectmenu( "refresh" );

	item = menu.find( "li.ui-selectmenu-optgroup" ).first();

	assert.hasClasses( item, "ui-state-disabled" );

	assert.equal(
		menu.find( "li" ).not( ".ui-selectmenu-optgroup" ).filter( ".ui-state-disabled" ).length,
		originalDisabledOptions.length,
		"disabled options"
	);
	for ( i = 0; i < originalDisabledOptions.length; i++ ) {
		item = item.next( "li" );
		assert.hasClasses( item, "ui-state-disabled" );
	}
} );

QUnit.test( "refresh - remove all options", function( assert ) {
	assert.expect( 2 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.children().remove();
	element.selectmenu( "refresh" );
	assert.equal( button.find( ".ui-selectmenu-text" ).html(), $( "<span>&#160;</span>" ).html(),
		"Empty button text" );
	assert.equal( menu.children().length, 0, "Empty menu" );
} );

QUnit.test( "widget and menuWidget", function( assert ) {
	assert.expect( 4 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	assert.equal( button.length, 1, "button: one element" );
	assert.hasClasses( button, "ui-button" );

	assert.equal( menu.length, 1, "Menu Widget: one element" );
	assert.ok( menu.is( "ul.ui-menu" ), "Menu Widget: element and class" );
} );

} );
