(function( $ ) {

module( "menubar: core" );

test( "markup structure", function() {
	expect( 5 );
	var element = $( "#bar1" ).menubar();
	ok( element.hasClass( "ui-menubar" ), "main element is .ui-menubar" );
	element.children().each(function( index ) {
		ok( $( this ).hasClass( "ui-menubar-item" ), "child " + index + " is .ui-menu-item" );
	});
});

test( "Passing a vertical orientation parameter adds vertical classes on ui elements", function() {
	expect( 11 );

	var secondMenuItem,
		element = $( "#bar1" ).menubar({ orientation: "vertical" }),
		widget = element.data( "ui-menubar" ),
		options = widget.options,
		menuItemCount = element.children( ".ui-menubar-item" ).length,
		firstMenuItem = $( "#bar1 .ui-menubar-item .ui-button:first" ),
		defaultOrientation = $( "#bar2" ).menubar().data( "ui-menubar" ).options.orientation;

	equal( "horizontal", defaultOrientation, "menubars shoud have horizontal orientation by default" );
	equal( "vertical", options.orientation, "options should reflect vertical option being set" );
	ok( element.hasClass( "vertical" ) , "menubar should have a vertical class applied" );
	equal( element.children( ".ui-menubar-item.vertical" ).length, menuItemCount, "menuItems should have a vertical class applied" );

	firstMenuItem[ 0 ].focus();
	equal( document.activeElement, firstMenuItem[0], "Focus set on first menuItem" );

	$( firstMenuItem ).simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	ok( firstMenuItem.hasClass( "ui-state-focus" ), "RIGHT should NOT move focus off of focused item if vertically oriented" );

	$( firstMenuItem ).simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	ok( firstMenuItem.hasClass( "ui-state-focus" ), "LEFT should NOT move focus off of focused item if vertically oriented" );

	$( firstMenuItem ).simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	ok( !firstMenuItem.hasClass( "ui-state-focus" ), "DOWN should move focus off of focused item if vertically oriented" );

	secondMenuItem = firstMenuItem.parent().next().children(":first");
	equal( document.activeElement, secondMenuItem[ 0 ], "Focus is set on second menuItem" );

	$( secondMenuItem ).simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	ok( firstMenuItem.hasClass( "ui-state-focus" ), "UP should move focus back to the original menu item" );

	$( firstMenuItem ).simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	$( secondMenuItem ).simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	ok( widget.active, "Pressing RIGHT on a menuItem with a subMenu should make the submenu active" );
});

test( "accessibility", function () {
	expect( 2 );
	var element = $( "#bar1" ).menubar();

	equal( element.attr( "role" ), "menubar", "main role" );
	ok( !element.attr( "aria-activedescendant" ), "aria-activedescendant not set" );
});

test( "Cursor keys should move the focus", function() {
	expect( 3 );

	var element = $( "#bar1" ).menubar(),
		firstMenuItem = $( "#bar1 .ui-menubar-item .ui-button:first" );

	firstMenuItem[ 0 ].focus();
	equal( document.activeElement, firstMenuItem[0], "Focus set on first menuItem" );
	$( firstMenuItem ).simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	ok( !firstMenuItem.hasClass( "ui-state-focus" ), "RIGHT should move focus off of focused item" );
	$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equal( document.activeElement, firstMenuItem[0], "LEFT should return focus first menuItem" );
});

test ( "_destroy should successfully unwrap 'span.ui-button-text' elements" , function() {
	expect(1);

	var containedButtonTextSpans,
		element = $( "#bar1" ).menubar();

	element.menubar( "destroy" );
	containedButtonTextSpans = element.find( "span.ui-button-text" ).length
	equal( containedButtonTextSpans, 0, "All 'span.ui-button-text'	should be removed by destroy" );
});


})( jQuery );
