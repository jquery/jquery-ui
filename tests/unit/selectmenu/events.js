define( [
	"jquery",
	"ui/widgets/selectmenu"
], function( $ ) {

module( "selectmenu: events", {
	setup: function() {
		this.element = $( "#speed" );
	}
} );

asyncTest( "change", function() {
	expect( 3 );

	var button, menu, options,
		optionIndex = 1;

	this.element.selectmenu( {
		change: function( event, ui ) {
			equal( ui.item.index, optionIndex, "ui.item.index contains correct option index" );
			equal( ui.item.element[ 0 ], options.eq( optionIndex )[ 0 ],
				"ui.item.element contains original option element" );
			equal( ui.item.value, options.eq( optionIndex ).text(),
				"ui.item.value property updated correctly" );
		}
	} );

	button = this.element.selectmenu( "widget" );
	menu = this.element.selectmenu( "menuWidget" );
	options = this.element.find( "option" );

	button.simulate( "focus" );

	setTimeout( function() {
		button.trigger( "click" );
		menu.find( "li" ).eq( optionIndex ).simulate( "mouseover" ).trigger( "click" );
		start();
	} );
} );

test( "close", function() {
	expect( 2 );

	var shouldFire;

	this.element.selectmenu( {
		close: function() {
			ok( shouldFire, "close event fired on close" );
		}
	} );

	shouldFire = false;
	this.element.selectmenu( "open" );
	shouldFire = true;
	this.element.selectmenu( "close" );
	shouldFire = false;
	this.element.selectmenu( "open" );
	shouldFire = true;
	$( "body" ).trigger( "mousedown" );
} );

asyncTest( "focus", function() {
	expect( 9 );

	var button, menu, links,
		that = this,
		optionIndex = this.element[ 0 ].selectedIndex + 1,
		options = this.element.find( "option" );

	this.element.selectmenu( {
		focus: function( event, ui ) {
			ok( true, "focus event fired on element #" + optionIndex + " mouseover" );
			equal( ui.item.index, optionIndex, "ui.item.index contains correct option index" );
			equal( ui.item.element[ 0 ], options.eq( optionIndex )[ 0 ],
				"ui.item.element contains original option element" );
		}
	} );

	button = this.element.selectmenu( "widget" );
	menu = this.element.selectmenu( "menuWidget" );

	button.simulate( "focus" );
	setTimeout( function() {
		button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		button.trigger( "click" );
		links = menu.find( "li.ui-menu-item" );
		optionIndex = 0;
		links.eq( optionIndex ).simulate( "mouseover" );
		optionIndex += 1;
		links.eq( optionIndex ).simulate( "mouseover" );

		// This tests for unwanted, additional focus event on close
		that.element.selectmenu( "close" );
		start();
	} );
} );

test( "open", function() {
	expect( 1 );

	this.element.selectmenu( {
		open: function() {
			ok( true, "open event fired on open" );
		}
	} );

	this.element.selectmenu( "open" );
} );

asyncTest( "select", function() {
	expect( 3 );

	this.element.selectmenu( {
		select: function( event, ui ) {
			ok( true, "select event fired on item select" );
			equal( ui.item.index, optionIndex, "ui.item.index contains correct option index" );
			equal( ui.item.element[ 0 ], options.eq( optionIndex )[ 0 ],
				"ui.item.element contains original option element" );
		}
	} );

	var button = this.element.selectmenu( "widget" ),
		menu = this.element.selectmenu( "menuWidget" ),
		options = this.element.find( "option" ),
		optionIndex = 1;

	button.simulate( "focus" );
	setTimeout( function() {
		button.trigger( "click" );
		menu.find( "li" ).eq( optionIndex ).simulate( "mouseover" ).trigger( "click" );
		start();
	} );
} );

} );
