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
		equal( button.attr( "role" ), "combobox", "button link role" );
		equal( button.attr( "aria-haspopup" ), "true", "button link aria-haspopup" );
		equal( button.attr( "aria-expanded" ), "false", "button link aria-expanded" );
		equal( button.attr( "aria-autocomplete" ), "list", "button link aria-autocomplete" );
		equal( button.attr( "aria-owns" ), menu.attr("id"), "button link aria-owns" );
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
		$.each( links, function( index ){
			equal( $( this ).attr( "role" ), "option", "menu link #" + index +" role" );
			equal( $( this ).attr( "tabindex" ), -1, "menu link #" + index +" tabindex" );
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
	asyncTest( "state synchronization - after keydown on button - " + settings.type, function () {
		expect( 4 );

		var links,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),
			selected = element.find( "option:selected" );

		button.simulate( "focus" );
		setTimeout(function() {
			links = menu.find("li.ui-menu-item");

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
				selected.next( "option" ).val() ,
				"original select state"
			);
			equal( button.text(), selected.next( "option" ).text(), "button text" );
			start();
		}, 1 );
	});

	asyncTest( "state synchronization - after click on item - " + settings.type, function () {
		expect( 4 );

		var links,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" );

		button.simulate( "focus" );
		setTimeout(function() {
			links = menu.find("li.ui-menu-item");

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
				element.find( "option" ).last().val(),
				"original select state"
			);
			equal( button.text(), element.find( "option" ).last().text(), "button text" );
			start();
		}, 1 );
	});

	asyncTest( "state synchronization - after focus item and keydown on button - " + settings.type, function () {
		expect( 4 );

		var links,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),
			options = element.find( "option" );

		// init menu
		button.simulate( "focus" );

		setTimeout(function() {
			links = menu.find( "li.ui-menu-item" );
			// open menu and click first item
			button.trigger( "click" );
			links.first().simulate( "mouseover" ).trigger( "click" );
			// open menu again and hover item
			button.trigger( "click" );
			links.eq( 3 ).simulate( "mouseover" );
			// close and use keyboard control on button
			button.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
			button.simulate( "focus" );
			setTimeout(function() {
				button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

				equal( menu.attr( "aria-activedescendant" ), links.eq( 1 ).attr( "id" ), "menu aria-activedescendant" );
				equal( button.attr( "aria-activedescendant" ), links.eq( 1 ).attr( "id" ), "button aria-activedescendant" );
				equal( element.find( "option:selected" ).val(), options.eq( 1 ).val() , "original select state" );
				equal( button.text(), options.eq( 1 ).text(), "button text" );
				start();
			}, 1 );
		}, 1 );
	});

	asyncTest( "item looping - " + settings.type, function () {
		expect( 2 );

		var links,
			element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" );

		// init menu
		button.simulate( "focus" );

		setTimeout(function() {
			links = menu.find( "li.ui-menu-item" );

			button.trigger( "click" );
			links.first().simulate( "mouseover" ).trigger( "click" );
			button.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
			equal( element[ 0 ].selectedIndex, 0, "No looping beyond first item" );

			button.trigger( "click" );
			links.last().simulate( "mouseover" ).trigger( "click" );
			button.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			equal( element[ 0 ].selectedIndex + 1, links.length, "No looping behind last item" );
			start();
		}, 1 );
	});

	asyncTest( "item focus and active state - " + settings.type, function () {
		expect( 8 );

		var element = $( settings.selector ).selectmenu(),
			button = element.selectmenu( "widget" ),
			menu = element.selectmenu( "menuWidget" ),
			links, focusedItem, activeItem;

		// init menu
		button.simulate( "focus" );

		setTimeout(function() {
			links = menu.find( "li.ui-menu-item" );

			button.trigger( "click" );
			setTimeout(function() {
				checkItemClasses();

				links.eq( 3 ).simulate( "mouseover" ).trigger( "click" );

				button.trigger( "click" );
				links.eq( 2 ).simulate( "mouseover" );
				$( document ).trigger( "click" );

				button.trigger( "click" );
				links.eq( 1 ).simulate( "mouseover" );
				$( document ).trigger( "click" );

				button.trigger( "click" );
				setTimeout(function() {
					 checkItemClasses();
					start();
				}, 350 );
			}, 350 );
		}, 1 );

		function checkItemClasses() {
			focusedItem = menu.find( "li.ui-state-focus" );
			equal( focusedItem.length, 1, "only one item has ui-state-focus class" );
			equal( focusedItem.attr( "id" ), links.eq( element[ 0 ].selectedIndex ).attr( "id" ), "selected item has ui-state-focus class" );

			activeItem = menu.find( "li.ui-state-active" );
			equal( activeItem.length, 1, "only one item has ui-state-active class" );
			equal( activeItem.attr( "id" ), links.eq( element[ 0 ].selectedIndex ).attr( "id" ), "selected item has ui-state-active class" );
		}
	});

	asyncTest( "empty option - " + settings.type, function () {
		expect( 7 );

		var element = $( settings.selector ),
			button, menu, links, link;

		element.find( "option" ).first().text( "" );
		element.selectmenu();
		button = element.selectmenu( "widget" );
		menu = element.selectmenu( "menuWidget" );

		// init menu
		button.simulate( "focus" );

		setTimeout(function() {
			links = menu.find( "li:not(.ui-selectmenu-optgroup)" );
			link = links.first();

			button.trigger( "click" );

			equal( links.length, element.find( "option" ).length, "correct amount of list elements" );
			ok( link.outerHeight() > 10, "empty item seems to have reasonable height" );
			ok( link.attr( "id" ), "empty item has id attribute" );
			ok( link.hasClass( "ui-menu-item" ), "empty item has ui-menu-item class" );
			ok( !link.hasClass( "ui-menu-divider" ), "empty item has not ui-menu-divider class" );
			equal( link.attr( "tabindex" ), -1, "empty item has tabindex" );
			equal( link.attr( "role" ), "option", "empty item has role option" );

			start();
		}, 1 );
	});
});

})( jQuery );
