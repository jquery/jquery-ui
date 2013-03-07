(function( $ ) {

module( "selectmenu: methods" );

test( "destroy", function() {
	expect( 1 );
	domEqual( "#speed", function() {
		$( "#speed" ).selectmenu().selectmenu( "destroy" );
	});
});


test( "open / close", function() {
	expect( 4 );

	var element = $( "#speed" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" );

	element.selectmenu( "open" );
	ok( menu.is( ":visible" ), "open: menu visible" );
	equal( menu.attr( "aria-hidden" ), "false", "open: menu aria-disabled" );

	element.selectmenu( "close" );
	ok( menu.is( ":hidden" ), "close: menu hidden" );
	equal( menu.attr( "aria-hidden" ), "true", "close: menu aria-disabled" );
});


test( "enable / disable", function () {
	expect(10);

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.selectmenu( "disable" );
	ok( element.selectmenu( "option", "disabled" ), "disable: widget option" );
	equal( element.attr( "disabled" ), "disabled", "disable: native select disabled" );
	equal( button.attr( "aria-disabled" ), "true", "disable: button wrapper ARIA" );
	equal( button.attr( "tabindex" ), -1, "disable: button tabindex" );
	equal( menu.attr( "aria-disabled" ), "true", "disable: menu wrapper ARIA" );

	element.selectmenu( "enable" );
	ok( !element.selectmenu( "option", "disabled" ), "enable: widget option" );
	equal( element.attr( "disabled" ), undefined, "enable: native select disabled" );
	equal( button.attr( "aria-disabled" ), "false", "enable: button wrapper ARIA" );
	equal( button.attr( "tabindex" ), 0, "enable: button tabindex" );
	equal( menu.attr( "aria-disabled" ), "false", "enable: menu wrapper ARIA" );
});


test( "refresh - structure", function () {
	expect( 3 );

	var element = $( "#speed" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" ).parent();

	element.find( "option" ).eq( 2 ).remove();
	element.find( "option" ).eq( 3 ).remove();
	element.append( "<option value=\"added_option\">Added option</option>" );
	element.find( "option" ).first()
		.attr( "value", "changed_value" )
		.text( "Changed value" );
	element.selectmenu( "refresh" );

	equal( element.find( "option" ).length, menu.find( "li" ).not( ".ui-selectmenu-optgroup" ).length, "menu item length" );
	equal( element.find( "option" ).last().text(), menu.find( "li" ).not( ".ui-selectmenu-optgroup" ).last().text(), "added item" );
	equal( element.find( "option" ).first().text(), menu.find( "li" ).not( ".ui-selectmenu-optgroup" ).first().text(), "changed item" );
});

test( "refresh - change selected option", function () {
	expect( 3 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" );

	equal( element.find( "option:selected" ).text(), button.text(), "button text after init" );

	button.simulate( "focus" );

	equal( element.find( "option:selected" ).text(), button.text(), "button text after focus" );

	element.find( "option" ).eq( 2 ).removeAttr( "selected" );
	element.find( "option" ).eq( 0 ).attr( "selected", "selected" );
	element.selectmenu( "refresh" );

	equal( element.find( "option:selected" ).text(), button.text(), "button text after changing selected option" );
});


test( "refresh - disabled select", function () {
	expect( 4 );

	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.attr( "disabled", "disabled" );
	element.selectmenu( "refresh" );

	ok( element.selectmenu( "option", "disabled" ), "widget option" );
	equal( button.attr( "aria-disabled" ), "true", "button wrapper ARIA" );
	equal( button.attr( "tabindex" ), -1, "button tabindex" );
	equal( menu.attr( "aria-disabled" ), "true", "menu wrapper ARIA" );
});


test( "refresh - disabled option", function () {
	expect(1);

	var disabledItem,
		element = $( "#speed" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" ).parent();

	element.attr( "disabled", "disabled" );
	element.find( "option" ).eq( 2 ).attr( "disabled", "disabled" );
	element.selectmenu( "refresh" );

	disabledItem = menu.find( "li" ).not( ".ui-selectmenu-optgroup" ).eq(2);
	ok( disabledItem.hasClass( "ui-state-disabled" ), "class" );
});


test( "refresh - disabled optgroup", function () {

	var i,
		item,
		element = $( "#files" ).selectmenu(),
		menu = element.selectmenu( "menuWidget" ).parent(),
		originalDisabledOptgroup = element.find( "optgroup" ).first(),
		originalDisabledOptions = originalDisabledOptgroup.find( "option" );

	expect(2 + originalDisabledOptions.length);

	originalDisabledOptgroup.attr( "disabled", "disabled" );
	element.selectmenu( "refresh" );

	item = menu.find( "li.ui-selectmenu-optgroup" ).first();
	ok( item.hasClass( "ui-state-disabled" ), "class" );

	equal( menu.find( "li" ).not( ".ui-selectmenu-optgroup" ).filter( ".ui-state-disabled" ).length, originalDisabledOptions.length, "disabled options" );
	for ( i = 0; i < originalDisabledOptions.length; i++ ) {
		item = item.next( "li" );
		ok( item.hasClass( "ui-state-disabled" ), "item #" + i + ": class" );
	}
});

test( "widget", function() {
	expect( 4 );
	var element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	element.selectmenu( "refresh" );

	equal( button.length, 1, "widget: one element" );
	ok( button.is( "span.ui-selectmenu-button" ), "widget: button element" );

	equal( menu.length, 1, "menuWidget: one element" );
	ok( menu.is( "ul.ui-menu" ), "menuWidget: menu element" );
});

})( jQuery );
