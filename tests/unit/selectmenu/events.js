define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/selectmenu"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "selectmenu: events", {
	beforeEach: function() {
		this.element = $( "#speed" );
	},
	afterEach: helper.moduleAfterEach
} );

QUnit.test( "change", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );

	var button, menu, options,
		optionIndex = 1;

	this.element.selectmenu( {
		change: function( event, ui ) {
			assert.equal( ui.item.index, optionIndex, "ui.item.index contains correct option index" );
			assert.equal( ui.item.element[ 0 ], options.eq( optionIndex )[ 0 ],
				"ui.item.element contains original option element" );
			assert.equal( ui.item.value, options.eq( optionIndex ).text(),
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
		ready();
	} );
} );

QUnit.test( "close", function( assert ) {
	assert.expect( 2 );

	var shouldFire;

	this.element.selectmenu( {
		close: function() {
			assert.ok( shouldFire, "close event fired on close" );
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

QUnit.test( "focus", function( assert ) {
	var ready = assert.async();
	assert.expect( 9 );

	var button, menu, links,
		that = this,
		optionIndex = this.element[ 0 ].selectedIndex + 1,
		options = this.element.find( "option" );

	this.element.selectmenu( {
		focus: function( event, ui ) {
			assert.ok( true, "focus event fired on element #" + optionIndex + " mouseover" );
			assert.equal( ui.item.index, optionIndex, "ui.item.index contains correct option index" );
			assert.equal( ui.item.element[ 0 ], options.eq( optionIndex )[ 0 ],
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
		links.eq( optionIndex ).simulate( "mouseover", { clientX: 2, clientY: 2 } );
		optionIndex += 1;
		links.eq( optionIndex ).simulate( "mouseover", { clientX: 3, clientY: 3 } );

		// This tests for unwanted, additional focus event on close
		that.element.selectmenu( "close" );
		ready();
	} );
} );

QUnit.test( "open", function( assert ) {
	assert.expect( 1 );

	this.element.selectmenu( {
		open: function() {
			assert.ok( true, "open event fired on open" );
		}
	} );

	this.element.selectmenu( "open" );
} );

QUnit.test( "select", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );

	this.element.selectmenu( {
		select: function( event, ui ) {
			assert.ok( true, "select event fired on item select" );
			assert.equal( ui.item.index, optionIndex, "ui.item.index contains correct option index" );
			assert.equal( ui.item.element[ 0 ], options.eq( optionIndex )[ 0 ],
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
		ready();
	} );
} );

} );
