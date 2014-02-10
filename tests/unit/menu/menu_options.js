(function( $ ) {

var log = TestHelpers.menu.log,
	logOutput = TestHelpers.menu.logOutput,
	click = TestHelpers.menu.click;

module( "menu: options", {
	setup: function() {
		TestHelpers.menu.clearLog();
	}
});

test( "{ disabled: true }", function() {
	expect( 2 );
	var element = $( "#menu1" ).menu({
		disabled: true,
		select: function() {
			log();
		}
	});
	ok( element.hasClass( "ui-state-disabled" ), "Missing ui-state-disabled class" );
	log( "click", true );
	click( element, "1" );
	log( "afterclick" );
	equal( logOutput(), "click,afterclick", "Click order not valid." );
});

test( "{ disabled: false }", function() {
	expect( 2 );
	var element = $( "#menu1" ).menu({
		disabled: false,
		select: function() {
			log();
		}
	});
	ok( !element.hasClass( "ui-state-disabled" ), "Has ui-state-disabled class" );
	log( "click", true );
	click( element, "1" );
	log( "afterclick" );
	equal( logOutput(), "click,1,afterclick", "Click order not valid." );
});

test( "{ icons: default }", function() {
	expect( 2 );
	var element = $( "#menu2" ).menu();
	equal( element.find( ".ui-menu-icon" ).attr( "class" ), "ui-menu-icon ui-icon ui-icon-carat-1-e" );

	element.menu( "option", "icons.submenu", "ui-icon-triangle-1-e" );
	equal( element.find( ".ui-menu-icon" ).attr( "class" ), "ui-menu-icon ui-icon ui-icon-triangle-1-e" );
});

test( "{ icons: { submenu: 'custom' } }", function() {
	expect( 1 );
	var element = $( "#menu2" ).menu({
		icons: {
			submenu: "custom-class"
		}
	});
	equal( element.find( ".ui-menu-icon" ).attr( "class" ), "ui-menu-icon ui-icon custom-class" );
});

// TODO: test menus option

// TODO: test position option

test( "{ role: 'menu' } ", function() {
	var element = $( "#menu1" ).menu(),
		items = element.find( "li" );
	expect( 2 + 3 * items.length );
	equal( element.attr( "role" ), "menu" );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		ok( $( this ).hasClass( "ui-menu-item" ), "menu item ("+ item + ") class for item" );
		equal( $( this ).attr( "role" ), "menuitem", "menu item ("+ item + ") role" );
		equal( $( this ).attr( "tabindex" ), "-1", "tabindex for menu item ("+ item + ")" );
	});
});

test( "{ role: 'listbox' } ", function() {
	var element = $( "#menu1" ).menu({
			role: "listbox"
		}),
		items = element.find( "li" );
	expect( 2 + 3 * items.length );
	equal( element.attr( "role" ), "listbox" );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		ok( $( this ).hasClass( "ui-menu-item" ), "menu item ("+ item + ") class for item" );
		equal( $( this ).attr( "role" ), "option", "menu item ("+ item + ") role" );
		equal( $( this ).attr( "tabindex" ), "-1", "tabindex for menu item ("+ item + ")" );
	});
});

test( "{ role: null }", function() {
	var element = $( "#menu1" ).menu({
			role: null
		}),
		items = element.find( "li" );
	expect( 2 + 3 * items.length );
	strictEqual( element.attr( "role" ), undefined );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		ok( $( this ).hasClass( "ui-menu-item" ), "menu item ("+ item + ") class for item" );
		equal( $( this ).attr( "role" ), undefined, "menu item ("+ item + ") role" );
		equal( $( this ).attr( "tabindex" ), "-1", "tabindex for menu item ("+ item + ")" );
	});
});

})( jQuery );
