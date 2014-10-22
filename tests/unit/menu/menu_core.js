(function( $ ) {

module( "menu: core" );

test( "markup structure", function() {
	expect( 7 );
	var element = $( "#menu1" ).menu();
	ok( element.hasClass( "ui-menu" ), "main element is .ui-menu" );
	ok( element.hasClass( "ui-corner-all" ), "main element is .ui-corner-all" );
	element.children().each(function( index ) {
		ok( $( this ).hasClass( "ui-menu-item" ), "child " + index + " is .ui-menu-item" );
	});
});

test( "accessibility", function () {
	expect( 4 );
	var element = $( "#menu1" ).menu();

	equal( element.attr( "role" ), "menu", "main role" );
	ok( !element.attr( "aria-activedescendant" ), "aria-activedescendant not set" );

	element.menu( "focus", $.Event(), element.children().eq( -2 ) );
	equal( element.attr( "aria-activedescendant" ), "testID1", "aria-activedescendant from existing id" );

	element.menu( "focus", $.Event(), element.children().eq( 0 ) );
	ok( /^ui-id-\d+$/.test( element.attr( "aria-activedescendant" ) ), "aria-activedescendant from generated id" );

	// Item roles are tested in the role option tests
});

asyncTest( "#9044: Autofocus issue with dialog opened from menu widget", function() {
	expect( 1 );
	var element = $( "#menu1" ).menu();

	$( "<input>", { id: "test9044" } ).appendTo( "body" );

	$( "#testID1" ).bind( "click", function() {
		$( "#test9044" ).focus();
	});

	TestHelpers.menu.click( element, "3" );
	setTimeout( function() {
		equal( document.activeElement.id, "test9044", "Focus was swallowed by menu" );
		$( "#test9044" ).remove();
		start();
	});
});

asyncTest( "#9532: Need a way in Menu to keep ui-state-active class on selected item for Selectmenu", function() {
	expect( 1 );
	var element = $( "#menu1" ).menu(),
		firstChild = element.children().eq( 0 );

	element.menu( "focus", null, firstChild );
	firstChild.addClass( "ui-state-active" );
	setTimeout( function() {
		ok( firstChild.is( ".ui-state-active" ), "ui-state-active improperly removed" );
		start();
	}, 500 );
});

})( jQuery );
