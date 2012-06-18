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
	var menu = $( "#menu1" ).menu({
		disabled: true,
		select: function(event, ui) {
			log();
		}
	});
	ok( menu.is( ".ui-state-disabled" ), "Missing ui-state-disabled class" );
	log( "click", true );
	click( menu, "1" );
	log( "afterclick" );
	equal( logOutput(), "click,afterclick", "Click order not valid." );
});

test( "{ disabled: false }", function() {
	expect( 2 );
	var menu = $( "#menu1" ).menu({
		disabled: false,
		select: function( event, ui ) {
			log();
		}
	});
	ok( menu.not( ".ui-state-disabled" ), "Has ui-state-disabled class" );
	log( "click", true );
	click( menu, "1" );
	log( "afterclick" );
	equal( logOutput(), "click,1,afterclick", "Click order not valid." );
});

test( "{ role: 'menu' } ", function () {
	var menu = $( "#menu1" ).menu(),
		items = menu.find( "li" );
	expect( 2 + 5 * items.length );
	equal( menu.attr( "role" ), "menu" );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		ok( $( this ).hasClass( "ui-menu-item" ), "menu item ("+ item + ") class for item" );
		equal( $( this ).attr( "role" ), "presentation", "menu item ("+ item + ") role" );
		equal( $( "a", this ).attr( "role" ), "menuitem", "menu item ("+ item + ") role" );
		ok( $( "a", this ).hasClass( "ui-corner-all" ), "a element class for menu item ("+ item + ") " );
		equal( $( "a", this ).attr( "tabindex" ), "-1", "a element tabindex for menu item ("+ item + ") " );
	});
});

test( "{ role: 'listbox' } ", function () {
	var menu = $( "#menu1" ).menu({
			role: "listbox"
		}),
		items = menu.find( "li" );
	expect(2 + items.length);
	equal( menu.attr( "role" ), "listbox" );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		equal( $( "a", this ).attr( "role" ), "option", "menu item ("+ item + ") role" );
	});
});

})( jQuery );
