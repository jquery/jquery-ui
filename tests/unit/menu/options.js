define( [
	"jquery",
	"./helper",
	"ui/menu"
], function( $, testHelper ) {

var log = testHelper.log,
	logOutput = testHelper.logOutput,
	click = testHelper.click;

module( "menu: options", {
	setup: function() {
		testHelper.clearLog();
	}
});

test( "{ disabled: true }", function( assert ) {
	expect( 2 );
	var element = $( "#menu1" ).menu({
		disabled: true,
		select: function() {
			log();
		}
	});
	assert.hasClasses( element, "ui-state-disabled" );
	log( "click", true );
	click( element, "1" );
	log( "afterclick" );
	equal( logOutput(), "click,afterclick", "Click order not valid." );
});

test( "{ disabled: false }", function( assert ) {
	expect( 2 );
	var element = $( "#menu1" ).menu({
		disabled: false,
		select: function() {
			log();
		}
	});
	assert.lacksClasses( element, "ui-state-disabled" );
	log( "click", true );
	click( element, "1" );
	log( "afterclick" );
	equal( logOutput(), "click,1,afterclick", "Click order not valid." );
});

test( "{ icons: default }", function( assert ) {
	expect( 8 );
	var element = $( "#menu2" ).menu();
	element.find( ".ui-menu-icon" ).each( function() {
		assert.hasClasses( this, "ui-menu-icon ui-icon ui-icon-caret-1-e" );
	});

	element.menu( "option", "icons.submenu", "ui-icon-triangle-1-e" );
	element.find( ".ui-menu-icon" ).each( function() {
		assert.hasClasses( this, "ui-menu-icon ui-icon ui-icon-triangle-1-e" );
	});
});

test( "{ icons: { submenu: 'custom' } }", function( assert ) {
	expect( 4 );
	var element = $( "#menu2" ).menu({
		icons: {
			submenu: "custom-class"
		}
	});
	element.find( ".ui-menu-icon" ).each( function() {
		assert.hasClasses( this, "ui-menu-icon ui-icon custom-class" );
	});
});

// TODO: test menus option

// TODO: test position option

test( "{ role: 'menu' } ", function( assert ) {
	var element = $( "#menu1" ).menu(),
		items = element.find( "li" );
	expect( 2 + 3 * items.length );
	equal( element.attr( "role" ), "menu" );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		assert.hasClasses( $( this ), "ui-menu-item" );
		equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "role" ),
			"menuitem", "menu item ("+ item + ") role" );
		equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "tabindex" ), "-1",
			"tabindex for menu item ("+ item + ")" );
	});
});

test( "{ role: 'listbox' } ", function( assert ) {
	var element = $( "#menu1" ).menu({
			role: "listbox"
		}),
		items = element.find( "li" );
	expect( 2 + 3 * items.length );
	equal( element.attr( "role" ), "listbox" );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		assert.hasClasses( $( this ), "ui-menu-item" );
		equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "role" ), "option",
			"menu item ("+ item + ") role" );
		equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "tabindex" ), "-1",
			"tabindex for menu item ("+ item + ")" );
	});
});

test( "{ role: null }", function( assert ) {
	var element = $( "#menu1" ).menu({
			role: null
		}),
		items = element.find( "li" );
	expect( 2 + 3 * items.length );
	equal( element.attr( "role" ), null );
	ok( items.length > 0, "number of menu items" );
	items.each(function( item ) {
		assert.hasClasses( $( this ), "ui-menu-item" );
		equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "role" ), null,
			"menu item ("+ item + ") role" );
		equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "tabindex" ), "-1",
			"tabindex for menu item ("+ item + ")" );
	});
});

} );
