define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/menu"
], function( QUnit, $, testHelper ) {

var log = testHelper.log,
	logOutput = testHelper.logOutput,
	click = testHelper.click;

QUnit.module( "menu: options", {
	beforeEach: function() {
		testHelper.clearLog();
	}
} );

QUnit.test( "{ disabled: true }", function( assert ) {
	assert.expect( 2 );
	var element = $( "#menu1" ).menu( {
		disabled: true,
		select: function() {
			log();
		}
	} );
	assert.hasClasses( element, "ui-state-disabled" );
	log( "click", true );
	click( element, "1" );
	log( "afterclick" );
	assert.equal( logOutput(), "click,afterclick", "Click order not valid." );
} );

QUnit.test( "{ disabled: false }", function( assert ) {
	assert.expect( 2 );
	var element = $( "#menu1" ).menu( {
		disabled: false,
		select: function() {
			log();
		}
	} );
	assert.lacksClasses( element, "ui-state-disabled" );
	log( "click", true );
	click( element, "1" );
	log( "afterclick" );
	assert.equal( logOutput(), "click,1,afterclick", "Click order not valid." );
} );

QUnit.test( "{ icons: default }", function( assert ) {
	assert.expect( 8 );
	var element = $( "#menu2" ).menu();
	element.find( ".ui-menu-icon" ).each( function() {
		assert.hasClasses( this, "ui-menu-icon ui-icon ui-icon-caret-1-e" );
	} );

	element.menu( "option", "icons.submenu", "ui-icon-triangle-1-e" );
	element.find( ".ui-menu-icon" ).each( function() {
		assert.hasClasses( this, "ui-menu-icon ui-icon ui-icon-triangle-1-e" );
	} );
} );

QUnit.test( "{ icons: { submenu: 'custom' } }", function( assert ) {
	assert.expect( 4 );
	var element = $( "#menu2" ).menu( {
		icons: {
			submenu: "custom-class"
		}
	} );
	element.find( ".ui-menu-icon" ).each( function() {
		assert.hasClasses( this, "ui-menu-icon ui-icon custom-class" );
	} );
} );

// TODO: test menus option

// TODO: test position option

QUnit.test( "{ role: 'menu' } ", function( assert ) {
	var element = $( "#menu1" ).menu(),
		items = element.find( "li" );
	assert.expect( 2 + 3 * items.length );
	assert.equal( element.attr( "role" ), "menu" );
	assert.ok( items.length > 0, "number of menu items" );
	items.each( function( item ) {
		assert.hasClasses( $( this ), "ui-menu-item" );
		assert.equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "role" ),
			"menuitem", "menu item (" + item + ") role" );
		assert.equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "tabindex" ), "-1",
			"tabindex for menu item (" + item + ")" );
	} );
} );

QUnit.test( "{ role: 'listbox' } ", function( assert ) {
	var element = $( "#menu1" ).menu( {
			role: "listbox"
		} ),
		items = element.find( "li" );
	assert.expect( 2 + 3 * items.length );
	assert.equal( element.attr( "role" ), "listbox" );
	assert.ok( items.length > 0, "number of menu items" );
	items.each( function( item ) {
		assert.hasClasses( $( this ), "ui-menu-item" );
		assert.equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "role" ), "option",
			"menu item (" + item + ") role" );
		assert.equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "tabindex" ), "-1",
			"tabindex for menu item (" + item + ")" );
	} );
} );

QUnit.test( "{ role: null }", function( assert ) {
	var element = $( "#menu1" ).menu( {
			role: null
		} ),
		items = element.find( "li" );
	assert.expect( 2 + 3 * items.length );
	assert.equal( element.attr( "role" ), null );
	assert.ok( items.length > 0, "number of menu items" );
	items.each( function( item ) {
		assert.hasClasses( $( this ), "ui-menu-item" );
		assert.equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "role" ), null,
			"menu item (" + item + ") role" );
		assert.equal( $( this ).find( ".ui-menu-item-wrapper" ).attr( "tabindex" ), "-1",
			"tabindex for menu item (" + item + ")" );
	} );
} );

} );
