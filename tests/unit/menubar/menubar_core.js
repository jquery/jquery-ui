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
} );

})( jQuery );
