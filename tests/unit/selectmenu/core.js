define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/selectmenu"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "selectmenu: core", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "markup structure", function( assert ) {
	assert.expect( 7 );

	var element = $( "#files" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		icon = button.find( ".ui-icon" ),
		menu = element.selectmenu( "menuWidget" ),
		menuWrap = menu.parent();

	assert.strictEqual( icon.length, 1, "Exactly one icon exists" );
	assert.hasClasses( icon, "ui-selectmenu-icon" );
	assert.hasClasses( button,
		"ui-selectmenu-button ui-selectmenu-button-closed ui-widget" );
	assert.lacksClasses( button, "ui-selectmenu-button-open ui-selectmenu-open" );
	assert.hasClasses( menuWrap, "ui-selectmenu-menu" );
	assert.lacksClasses( menuWrap, "ui-selectmenu-menu-open" );
	assert.strictEqual( icon[ 0 ], button.children()[ 0 ], "Icon is first child of button" );
} );

QUnit.test( "accessibility", function( assert ) {
	var ready = assert.async();
	var wrappers, button, menu,
		element = $( "#speed" ).attr( "title", "A demo title" );

	element.find( "option" ).each( function( index ) {
		$( this ).attr( "title", "A demo title #" + index );
	} );

	element.selectmenu();
	button = element.selectmenu( "widget" );
	menu = element.selectmenu( "menuWidget" );

	button.simulate( "focus" );
	wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

	assert.expect( 13 + wrappers.length * 3 );

	setTimeout( function() {
		assert.equal( button.attr( "role" ), "combobox", "button role" );
		assert.equal( button.attr( "aria-haspopup" ), "true", "button aria-haspopup" );
		assert.equal( button.attr( "aria-expanded" ), "false", "button aria-expanded" );
		assert.equal( button.attr( "aria-autocomplete" ), "list", "button aria-autocomplete" );
		assert.equal( button.attr( "aria-owns" ), menu.attr( "id" ), "button aria-owns" );
		assert.equal(
			button.attr( "aria-labelledby" ),
			wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
			"button link aria-labelledby"
		);
		assert.equal( button.attr( "tabindex" ), 0, "button link tabindex" );
		assert.equal( button.attr( "title" ), "A demo title", "button title" );

		assert.equal( menu.attr( "role" ), "listbox", "menu role" );
		assert.equal( menu.attr( "aria-labelledby" ), button.attr( "id" ), "menu aria-labelledby" );
		assert.equal( menu.attr( "aria-hidden" ), "true", "menu aria-hidden" );
		assert.equal( menu.attr( "tabindex" ), 0, "menu tabindex" );
		assert.equal(
			menu.attr( "aria-activedescendant" ),
			wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
			"menu aria-activedescendant"
		);
		$.each( wrappers, function( index ) {
			var item = $( this );
			assert.equal( item.attr( "role" ), "option", "menu item #" + index + " role" );
			assert.equal( item.attr( "tabindex" ), -1, "menu item #" + index + " tabindex" );
			assert.equal( item.attr( "title" ), "A demo title #" + index, "menu item #" + index + " title" );
		} );
		ready();
	} );
} );

QUnit.test( "_renderButtonItem()", function( assert ) {
	assert.expect( 2 );

	var option,
		element = $( "#speed" ).selectmenu(),
		instance = element.selectmenu( "instance" ),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	instance._renderButtonItem = function( item ) {
		var buttonItem = $( "<span>" );
		this._setText( buttonItem, item.label + item.index );

		return buttonItem;
	};

	element.selectmenu( "refresh" );
	option = element.find( "option:selected" );
	assert.equal(
		String.prototype.trim.call( button.text() ),
		option.text() + element[ 0 ].selectedIndex,
		"refresh: button item text"
	);

	button.trigger( "click" );
	menu.find( "li" ).last().simulate( "mouseover" ).trigger( "click" );
	option = element.find( "option" ).last();
	assert.equal(
		String.prototype.trim.call( button.text() ),
		option.text() + element[ 0 ].selectedIndex,
		"click: button item text"
	);
} );

$.each( [
	{
		type: "default",
		selector: "#speed"
	},
	{
		type: "optgroups",
		selector: "#files"
	}
], function( i, settings ) {
	QUnit.test( "state synchronization - after keydown on button - " + settings.type, function( assert ) {
		var ready = assert.async();
		assert.expect( 4 );

		var wrappers,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),

			// Get the option after the currently selected option because
			// we simulate pressing DOWN.
			selected = element.find( "option:selected" ).next();

		button.simulate( "focus" );
		setTimeout( function() {
			wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

			button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			assert.equal(
				menu.attr( "aria-activedescendant" ),
				wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"menu aria-activedescendant"
			);
			assert.equal(
				button.attr( "aria-activedescendant" ),
				wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"button aria-activedescendant"
			);
			assert.equal(
				element.find( "option:selected" ).val(),
				selected.val(),
				"original select state"
			);
			assert.equal( String.prototype.trim.call( button.text() ), selected.text(), "button text" );
			ready();
		} );
	} );

	QUnit.test( "state synchronization - after click on item - " + settings.type, function( assert ) {
		var ready = assert.async();
		assert.expect( 4 );

		var wrappers,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),
			selected = element.find( "option" ).last();

		button.simulate( "focus" );
		setTimeout( function() {
			wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

			button.trigger( "click" );
			menu.find( "li" ).last().simulate( "mouseover" ).trigger( "click" );
			assert.equal(
				menu.attr( "aria-activedescendant" ),
				wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"menu aria-activedescendant"
			);
			assert.equal(
				button.attr( "aria-activedescendant" ),
				wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"button aria-activedescendant"
			);
			assert.equal(
				element.find( "option:selected" ).val(),
				selected.val(),
				"original select state"
			);
			assert.equal( String.prototype.trim.call( button.text() ), selected.text(), "button text" );
			ready();
		}, 1 );
	} );

	QUnit.test( "state synchronization - " +
			"after focus item and keydown on button - " + settings.type, function( assert ) {
		var ready = assert.async();
		assert.expect( 4 );

		var wrappers,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),
			options = element.find( "option" );

		// Init menu
		button.simulate( "focus" );

		setTimeout( function() {
			wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

			// Open menu and click first item
			button.trigger( "click" );
			wrappers.first().simulate( "mouseover" ).trigger( "click" );

			// Open menu again and hover item
			button.trigger( "click" );
			wrappers.eq( 3 ).simulate( "mouseover" );

			// Close and use keyboard control on button
			button.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
			button.simulate( "focus" );
			setTimeout( function() {
				button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

				assert.equal( menu.attr( "aria-activedescendant" ), wrappers.eq( 1 ).attr( "id" ),
					"menu aria-activedescendant" );
				assert.equal( button.attr( "aria-activedescendant" ), wrappers.eq( 1 ).attr( "id" ),
					"button aria-activedescendant" );
				assert.equal( element.find( "option:selected" ).val(), options.eq( 1 ).val(),
					"original select state" );
				assert.equal( String.prototype.trim.call( button.text() ), options.eq( 1 ).text(), "button text" );
				ready();
			} );
		} );
	} );

	QUnit.test( "item looping - " + settings.type, function( assert ) {
		var ready = assert.async();
		assert.expect( 4 );

		var wrappers,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" );

		button.simulate( "focus" );
		setTimeout( function() {
			wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

			button.trigger( "click" );
			wrappers.first().simulate( "mouseover", { clientX: 2, clientY: 2 } ).trigger( "click" );
			assert.equal( element[ 0 ].selectedIndex, 0, "First item is selected" );
			button.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
			assert.equal( element[ 0 ].selectedIndex, 0, "No looping beyond first item" );

			button.trigger( "click" );
			wrappers.last().simulate( "mouseover", { clientX: 3, clientY: 3 } ).trigger( "click" );
			assert.equal( element[ 0 ].selectedIndex, wrappers.length - 1, "Last item is selected" );
			button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			assert.equal( element[ 0 ].selectedIndex, wrappers.length - 1, "No looping behind last item" );
			ready();
		} );
	} );

	QUnit.test( "item focus and active state - " + settings.type, function( assert ) {
		var ready = assert.async();
		assert.expect( 4 );

		var wrappers, focusedItem,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" );

		button.simulate( "focus" );
		setTimeout( function() {
			wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

			button.trigger( "click" );
			setTimeout( function() {
				checkItemClasses();

				wrappers.eq( 3 ).simulate( "mouseover" ).trigger( "click" );

				button.trigger( "click" );
				wrappers.eq( 2 ).simulate( "mouseover" );
				$( document ).trigger( "click" );

				button.trigger( "click" );
				wrappers.eq( 1 ).simulate( "mouseover" );
				$( document ).trigger( "click" );

				button.trigger( "click" );
				setTimeout( function() {
					checkItemClasses();
					ready();
				} );
			} );
		} );

		function checkItemClasses() {
			focusedItem = menu.find( ".ui-menu-item-wrapper.ui-state-active" );
			assert.equal( focusedItem.length, 1, "only one item has ui-state-focus class" );
			assert.equal( focusedItem.attr( "id" ), wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"selected item has ui-state-focus class" );
		}
	} );

	QUnit.test( "empty option - " + settings.type, function( assert ) {
		var ready = assert.async();
		assert.expect( 7 );

		var button, menu, wrappers, wrapper,
			element = $( settings.selector );

		element.find( "option" ).first().text( "" );
		element.selectmenu();
		button = element.selectmenu( "widget" );
		menu = element.selectmenu( "menuWidget" );

		button.simulate( "focus" );
		setTimeout( function() {
			wrappers = menu.find( "li:not(.ui-selectmenu-optgroup) .ui-menu-item-wrapper" );
			wrapper = wrappers.first();

			button.trigger( "click" );

			assert.equal( wrappers.length, element.find( "option" ).length,
				"correct amount of list elements" );
			assert.ok( wrapper.outerHeight() > 10, "empty item seems to have reasonable height" );
			assert.ok( wrapper.attr( "id" ), "empty item has id attribute" );
			assert.hasClasses( wrapper.parent(), "ui-menu-item" );
			assert.lacksClasses( wrapper, "ui-menu-divider" );
			assert.equal( wrapper.attr( "tabindex" ), -1, "empty item has tabindex" );
			assert.equal( wrapper.attr( "role" ), "option", "empty item has role option" );

			ready();
		} );
	} );
} );

QUnit.test( "Selectmenu should reset when its parent form resets", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );

	var element = $( "#speed" ).selectmenu(),
		widget = element.selectmenu( "widget" ),
		initialValue = element.val(),
		form = element.closest( "form" );

	element.val( "Slower" );
	element.selectmenu( "refresh" );
	assert.equal( String.prototype.trim.call( widget.text() ), "Slower" );
	form[ 0 ].reset();
	setTimeout( function() {
		assert.equal( String.prototype.trim.call( widget.text() ), initialValue );
		ready();
	} );
} );

QUnit.test( "Number pad input should change value", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );

	var element = $( "#number" ).selectmenu(),
		button = element.selectmenu( "widget" );

	button.simulate( "focus" );
	button.simulate( "keydown", { keyCode: 101 } );

	setTimeout( function() {
		assert.equal( element.val(), 5 );
		ready();
	} );
} );

QUnit.test( "Options with hidden attribute should not be rendered", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );

	var button, menu, options,
		element = $( "#speed" );

	element.find( "option" ).eq( 1 ).prop( "hidden", true );
	element.selectmenu();
	button = element.selectmenu( "widget" );
	menu = element.selectmenu( "menuWidget" );

	button.simulate( "focus" );
	setTimeout( function() {
		button.trigger( "click" );
		options = menu.children()
			.map( function() {
				return $( this ).text();
			} )
			.get();
		assert.deepEqual( options, [ "Slower", "Medium", "Fast", "Faster" ], "correct elements" );

		ready();
	} );
} );

QUnit.test( "extra listeners created after selection (trac-15078, trac-15152)", function( assert ) {
	assert.expect( 3 );

	var origRemoveListenersCount;
	var element = $( "#speed" ).selectmenu();
	var menu = element.selectmenu( "widget" );

	element.val( "Slow" );
	element.selectmenu( "refresh" );
	origRemoveListenersCount = jQuery._data( menu[ 0 ], "events" ).remove.length;

	element.val( "Fast" );
	element.selectmenu( "refresh" );
	assert.equal( jQuery._data( menu[ 0 ], "events" ).remove.length,
		origRemoveListenersCount,
		"No extra listeners after typing multiple letters" );

	element.val( "Faster" );
	element.selectmenu( "refresh" );
	assert.equal( jQuery._data( menu[ 0 ], "events" ).remove.length,
		origRemoveListenersCount,
		"No extra listeners after typing multiple letters" );

	element.val( "Slow" );
	element.selectmenu( "refresh" );
	assert.equal( jQuery._data( menu[ 0 ], "events" ).remove.length,
		origRemoveListenersCount,
		"No extra listeners after typing multiple letters" );
} );

} );
