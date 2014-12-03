(function( $ ) {

module( "selectmenu: core" );

test( "markup structure", function( assert ) {
	expect( 4 );

	var element = $( "#files" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" ),
		menuWrap = menu.parent();

	assert.hasClasses( button,
		"ui-selectmenu-button ui-selectmenu-button-closed ui-widget ui-state-default" );
	ok( !button.hasClass( "ui-selectmenu-button-open" ), "button is not .ui-selectmenu-button-open" );
	assert.hasClasses( menuWrap, "ui-selectmenu-menu" );
	ok( !menuWrap.hasClass( "ui-selectmenu-menu-open" ), "menu is not .ui-selectmenu-menu-open" );
});

asyncTest( "accessibility", function() {
	var wrappers, button, menu,
		element = $( "#speed" ).attr( "title", "A demo title" );

	element.find( "option" ).each(function( index ) {
		$( this ).attr( "title", "A demo title #" + index );
	});

	element.selectmenu();
	button = element.selectmenu( "widget" );
	menu = element.selectmenu( "menuWidget" );

	button.simulate( "focus" );
	wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

	expect( 13 + wrappers.length * 3 );

	setTimeout(function() {
		equal( button.attr( "role" ), "combobox", "button role" );
		equal( button.attr( "aria-haspopup" ), "true", "button aria-haspopup" );
		equal( button.attr( "aria-expanded" ), "false", "button aria-expanded" );
		equal( button.attr( "aria-autocomplete" ), "list", "button aria-autocomplete" );
		equal( button.attr( "aria-owns" ), menu.attr( "id" ), "button aria-owns" );
		equal(
			button.attr( "aria-labelledby" ),
			wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
			"button link aria-labelledby"
		);
		equal( button.attr( "tabindex" ), 0, "button link tabindex" );
		equal( button.attr( "title" ), "A demo title", "button title" );

		equal( menu.attr( "role" ), "listbox", "menu role" );
		equal( menu.attr( "aria-labelledby" ), button.attr( "id" ), "menu aria-labelledby" );
		equal( menu.attr( "aria-hidden" ), "true", "menu aria-hidden" );
		equal( menu.attr( "tabindex" ), 0, "menu tabindex" );
		equal(
			menu.attr( "aria-activedescendant" ),
			wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
			"menu aria-activedescendant"
		);
		$.each( wrappers, function( index ) {
			var item = $( this );
			equal( item.attr( "role" ), "option", "menu item #" + index +" role" );
			equal( item.attr( "tabindex" ), -1, "menu item #" + index +" tabindex" );
			equal( item.attr( "title" ), "A demo title #" + index, "menu item #" + index + " title" );
		});
		start();
	});
});

test( "_renderButtonItem()", function() {
	expect( 2 );

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
	equal(
		option.text() + element[ 0 ].selectedIndex,
		button.text(),
		"refresh: button item text"
	);

	button.trigger( "click" );
	menu.find( "li" ).last().simulate( "mouseover" ).trigger( "click" );
	option = element.find( "option" ).last();
	equal(
		option.text() + element[ 0 ].selectedIndex,
		button.text(),
		"click: button item text"
	);
});

$.each([
	{
		type: "default",
		selector: "#speed"
	},
	{
		type: "optgroups",
		selector: "#files"
	}
], function( i, settings ) {
	asyncTest( "state synchronization - after keydown on button - " + settings.type, function() {
		expect( 4 );

		var wrappers,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),

			// Get the option after the currently selected option because
			// we simulate pressing DOWN.
			selected = element.find( "option:selected" ).next();

		button.simulate( "focus" );
		setTimeout(function() {
			wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

			button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			equal(
				menu.attr( "aria-activedescendant" ),
				wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"menu aria-activedescendant"
			);
			equal(
				button.attr( "aria-activedescendant" ),
				wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"button aria-activedescendant"
			);
			equal(
				element.find( "option:selected" ).val(),
				selected.val() ,
				"original select state"
			);
			equal( button.text(), selected.text(), "button text" );
			start();
		});
	});

	asyncTest( "state synchronization - after click on item - " + settings.type, function() {
		expect( 4 );

		var wrappers,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),
			selected = element.find( "option" ).last();

		button.simulate( "focus" );
		setTimeout(function() {
			wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

			button.trigger( "click" );
			menu.find( "li" ).last().simulate( "mouseover" ).trigger( "click" );
			equal(
				menu.attr( "aria-activedescendant" ),
				wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"menu aria-activedescendant"
			);
			equal(
				button.attr( "aria-activedescendant" ),
				wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"button aria-activedescendant"
			);
			equal(
				element.find( "option:selected" ).val(),
				selected.val(),
				"original select state"
			);
			equal( button.text(), selected.text(), "button text" );
			start();
		}, 1 );
	});

	asyncTest( "state synchronization - " +
			"after focus item and keydown on button - " + settings.type, function() {
		expect( 4 );

		var wrappers,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),
			options = element.find( "option" );

		// Init menu
		button.simulate( "focus" );

		setTimeout(function() {
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
			setTimeout(function() {
				button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

				equal( menu.attr( "aria-activedescendant" ), wrappers.eq( 1 ).attr( "id" ),
					"menu aria-activedescendant" );
				equal( button.attr( "aria-activedescendant" ), wrappers.eq( 1 ).attr( "id" ),
					"button aria-activedescendant" );
				equal( element.find( "option:selected" ).val(), options.eq( 1 ).val() ,
					"original select state" );
				equal( button.text(), options.eq( 1 ).text(), "button text" );
				start();
			});
		});
	});

	asyncTest( "item looping - " + settings.type, function() {
		expect( 4 );

		var wrappers,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" );

		button.simulate( "focus" );
		setTimeout(function() {
			wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

			button.trigger( "click" );
			wrappers.first().simulate( "mouseover" ).trigger( "click" );
			equal( element[ 0 ].selectedIndex, 0, "First item is selected" );
			button.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
			equal( element[ 0 ].selectedIndex, 0, "No looping beyond first item" );

			button.trigger( "click" );
			wrappers.last().simulate( "mouseover" ).trigger( "click" );
			equal( element[ 0 ].selectedIndex, wrappers.length - 1, "Last item is selected" );
			button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			equal( element[ 0 ].selectedIndex, wrappers.length - 1, "No looping behind last item" );
			start();
		});
	});

	asyncTest( "item focus and active state - " + settings.type, function() {
		expect( 4 );

		var wrappers, focusedItem,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" );

		button.simulate( "focus" );
		setTimeout(function() {
			wrappers = menu.find( "li.ui-menu-item .ui-menu-item-wrapper" );

			button.trigger( "click" );
			setTimeout(function() {
				checkItemClasses();

				wrappers.eq( 3 ).simulate( "mouseover" ).trigger( "click" );

				button.trigger( "click" );
				wrappers.eq( 2 ).simulate( "mouseover" );
				$( document ).trigger( "click" );

				button.trigger( "click" );
				wrappers.eq( 1 ).simulate( "mouseover" );
				$( document ).trigger( "click" );

				button.trigger( "click" );
				setTimeout(function() {
					checkItemClasses();
					start();
				});
			});
		});

		function checkItemClasses() {
			focusedItem = menu.find( ".ui-menu-item-wrapper.ui-state-active" );
			equal( focusedItem.length, 1, "only one item has ui-state-focus class" );
			equal( focusedItem.attr( "id" ), wrappers.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"selected item has ui-state-focus class" );
		}
	});

	asyncTest( "empty option - " + settings.type, function() {
		expect( 7 );

		var button, menu, wrappers, wrapper,
			element = $( settings.selector );

		element.find( "option" ).first().text( "" );
		element.selectmenu();
		button = element.selectmenu( "widget" );
		menu = element.selectmenu( "menuWidget" );

		button.simulate( "focus" );
		setTimeout(function() {
			wrappers = menu.find( "li:not(.ui-selectmenu-optgroup) .ui-menu-item-wrapper" );
			wrapper = wrappers.first();

			button.trigger( "click" );

			equal( wrappers.length, element.find( "option" ).length,
				"correct amount of list elements" );
			ok( wrapper.outerHeight() > 10, "empty item seems to have reasonable height" );
			ok( wrapper.attr( "id" ), "empty item has id attribute" );
			ok( wrapper.parent().hasClass( "ui-menu-item" ),
				"empty item has ui-menu-item class" );
			ok( !wrapper.hasClass( "ui-menu-divider" ),
				"empty item does not have ui-menu-divider class" );
			equal( wrapper.attr( "tabindex" ), -1, "empty item has tabindex" );
			equal( wrapper.attr( "role" ), "option", "empty item has role option" );

			start();
		});
	});
});

})( jQuery );
