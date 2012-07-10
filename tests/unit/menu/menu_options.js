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
		select: function(event, ui) {
			log();
		}
	});
	ok( element.is( ".ui-state-disabled" ), "Missing ui-state-disabled class" );
	log( "click", true );
	click( element, "1" );
	log( "afterclick" );
	equal( logOutput(), "click,afterclick", "Click order not valid." );
});

test( "{ disabled: false }", function() {
	expect( 2 );
	var element = $( "#menu1" ).menu({
		disabled: false,
		select: function( event, ui ) {
			log();
		}
	});
	ok( element.not( ".ui-state-disabled" ), "Has ui-state-disabled class" );
	log( "click", true );
	click( element, "1" );
	log( "afterclick" );
	equal( logOutput(), "click,1,afterclick", "Click order not valid." );
});

// TODO: test icon option

// TODO: test menus option

// TODO: test position option

test( "{ role: 'menu' } ", function() {
	var element = $( "#menu1" ).menu(),
		items = element.find( "li" );
	expect( 2 + 5 * items.length );
	equal( element.attr( "role" ), "menu" );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		ok( $( this ).hasClass( "ui-menu-item" ), "menu item ("+ item + ") class for item" );
		equal( $( this ).attr( "role" ), "presentation", "menu item ("+ item + ") role" );
		equal( $( "a", this ).attr( "role" ), "menuitem", "menu item ("+ item + ") role" );
		ok( $( "a", this ).hasClass( "ui-corner-all" ), "a element class for menu item ("+ item + ")" );
		equal( $( "a", this ).attr( "tabindex" ), "-1", "a element tabindex for menu item ("+ item + ")" );
	});
});

test( "{ role: 'listbox' } ", function() {
	var element = $( "#menu1" ).menu({
			role: "listbox"
		}),
		items = element.find( "li" );
	expect( 2 + 5 * items.length );
	equal( element.attr( "role" ), "listbox" );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		ok( $( this ).hasClass( "ui-menu-item" ), "menu item ("+ item + ") class for item" );
		equal( $( this ).attr( "role" ), "presentation", "menu item ("+ item + ") role" );
		equal( $( "a", this ).attr( "role" ), "option", "menu item ("+ item + ") role" );
		ok( $( "a", this ).hasClass( "ui-corner-all" ), "a element class for menu item ("+ item + ")" );
		equal( $( "a", this ).attr( "tabindex" ), "-1", "a element tabindex for menu item ("+ item + ")" );
	});
});

test( "{ role: null }", function() {
	var element = $( "#menu1" ).menu({
			role: null
		}),
		items = element.find( "li" );
	expect( 2 + 5 * items.length );
	strictEqual( element.attr( "role" ), undefined );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		ok( $( this ).hasClass( "ui-menu-item" ), "menu item ("+ item + ") class for item" );
		equal( $( this ).attr( "role" ), "presentation", "menu item ("+ item + ") role" );
		equal( $( "a", this ).attr( "role" ), undefined, "menu item ("+ item + ") role" );
		ok( $( "a", this ).hasClass( "ui-corner-all" ), "a element class for menu item ("+ item + ")" );
		equal( $( "a", this ).attr( "tabindex" ), "-1", "a element tabindex for menu item ("+ item + ")" );
	});
});

})( jQuery );
