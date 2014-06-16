(function( $ ) {

module( "selectmenu: core" );

asyncTest( "accessibility", function() {
	var links,
		element = $( "#speed" ).selectmenu(),
		button = element.selectmenu( "widget" ),
		menu = element.selectmenu( "menuWidget" );

	button.simulate( "focus" );
	links = menu.find( "li.ui-menu-item" );

	expect( 12 + links.length * 2 );

	setTimeout(function() {
		equal( button.attr( "role" ), "combobox", "button role" );
		equal( button.attr( "aria-haspopup" ), "true", "button aria-haspopup" );
		equal( button.attr( "aria-expanded" ), "false", "button aria-expanded" );
		equal( button.attr( "aria-autocomplete" ), "list", "button aria-autocomplete" );
		equal( button.attr( "aria-owns" ), menu.attr( "id" ), "button aria-owns" );
		equal(
			button.attr( "aria-labelledby" ),
			links.eq( element[ 0 ].selectedIndex ).attr( "id" ),
			"button link aria-labelledby"
		);
		equal( button.attr( "tabindex" ), 0, "button link tabindex" );

		equal( menu.attr( "role" ), "listbox", "menu role" );
		equal( menu.attr( "aria-labelledby" ), button.attr( "id" ), "menu aria-labelledby" );
		equal( menu.attr( "aria-hidden" ), "true", "menu aria-hidden" );
		equal( menu.attr( "tabindex" ), 0, "menu tabindex" );
		equal(
			menu.attr( "aria-activedescendant" ),
			links.eq( element[ 0 ].selectedIndex ).attr( "id" ),
			"menu aria-activedescendant"
		);
		$.each( links, function( index ) {
			var link = $( this );
			equal( link.attr( "role" ), "option", "menu link #" + index +" role" );
			equal( link.attr( "tabindex" ), -1, "menu link #" + index +" tabindex" );
		});
		start();
	});
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

		var links,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),

			// Get the option after the currently selected option because
			// we simulate pressing DOWN.
			selected = element.find( "option:selected" ).next();

		button.simulate( "focus" );
		setTimeout(function() {
			links = menu.find( "li.ui-menu-item" );

			button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			equal(
				menu.attr( "aria-activedescendant" ),
				links.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"menu aria-activedescendant"
			);
			equal(
				button.attr( "aria-activedescendant" ),
				links.eq( element[ 0 ].selectedIndex ).attr( "id" ),
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

		var links,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),
			selected = element.find( "option" ).last();

		button.simulate( "focus" );
		setTimeout(function() {
			links = menu.find( "li.ui-menu-item" );

			button.trigger( "click" );
			menu.find( "li" ).last().simulate( "mouseover" ).trigger( "click" );
			equal(
				menu.attr( "aria-activedescendant" ),
				links.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"menu aria-activedescendant"
			);
			equal(
				button.attr( "aria-activedescendant" ),
				links.eq( element[ 0 ].selectedIndex ).attr( "id" ),
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

		var links,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),
			options = element.find( "option" );

		// Init menu
		button.simulate( "focus" );

		setTimeout(function() {
			links = menu.find( "li.ui-menu-item" );

			// Open menu and click first item
			button.trigger( "click" );
			links.first().simulate( "mouseover" ).trigger( "click" );

			// Open menu again and hover item
			button.trigger( "click" );
			links.eq( 3 ).simulate( "mouseover" );

			// Close and use keyboard control on button
			button.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
			button.simulate( "focus" );
			setTimeout(function() {
				button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

				equal( menu.attr( "aria-activedescendant" ), links.eq( 1 ).attr( "id" ),
					"menu aria-activedescendant" );
				equal( button.attr( "aria-activedescendant" ), links.eq( 1 ).attr( "id" ),
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

		var links,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" );

		button.simulate( "focus" );
		setTimeout(function() {
			links = menu.find( "li.ui-menu-item" );

			button.trigger( "click" );
			links.first().simulate( "mouseover" ).trigger( "click" );
			equal( element[ 0 ].selectedIndex, 0, "First item is selected" );
			button.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
			equal( element[ 0 ].selectedIndex, 0, "No looping beyond first item" );

			button.trigger( "click" );
			links.last().simulate( "mouseover" ).trigger( "click" );
			equal( element[ 0 ].selectedIndex, links.length - 1, "Last item is selected" );
			button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			equal( element[ 0 ].selectedIndex, links.length - 1, "No looping behind last item" );
			start();
		});
	});

	asyncTest( "item focus and active state - " + settings.type, function() {
		expect( 4 );

		var items, focusedItem,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" );

		button.simulate( "focus" );
		setTimeout(function() {
			items = menu.find( "li.ui-menu-item" );

			button.trigger( "click" );
			setTimeout(function() {
				checkItemClasses();

				items.eq( 3 ).simulate( "mouseover" ).trigger( "click" );

				button.trigger( "click" );
				items.eq( 2 ).simulate( "mouseover" );
				$( document ).trigger( "click" );

				button.trigger( "click" );
				items.eq( 1 ).simulate( "mouseover" );
				$( document ).trigger( "click" );

				button.trigger( "click" );
				setTimeout(function() {
					checkItemClasses();
					start();
				});
			});
		});

		function checkItemClasses() {
			focusedItem = menu.find( "li.ui-state-focus" );
			equal( focusedItem.length, 1, "only one item has ui-state-focus class" );
			equal( focusedItem.attr( "id" ), items.eq( element[ 0 ].selectedIndex ).attr( "id" ),
				"selected item has ui-state-focus class" );
		}
	});

	asyncTest( "empty option - " + settings.type, function() {
		expect( 7 );

		var button, menu, links, link,
			element = $( settings.selector );

		element.find( "option" ).first().text( "" );
		element.selectmenu();
		button = element.selectmenu( "widget" );
		menu = element.selectmenu( "menuWidget" );

		button.simulate( "focus" );
		setTimeout(function() {
			links = menu.find( "li:not(.ui-selectmenu-optgroup)" );
			link = links.first();

			button.trigger( "click" );

			equal( links.length, element.find( "option" ).length,
				"correct amount of list elements" );
			ok( link.outerHeight() > 10, "empty item seems to have reasonable height" );
			ok( link.attr( "id" ), "empty item has id attribute" );
			ok( link.hasClass( "ui-menu-item" ), "empty item has ui-menu-item class" );
			ok( !link.hasClass( "ui-menu-divider" ),
				"empty item does not have ui-menu-divider class" );
			equal( link.attr( "tabindex" ), -1, "empty item has tabindex" );
			equal( link.attr( "role" ), "option", "empty item has role option" );

			start();
		});
	});
});

})( jQuery );
