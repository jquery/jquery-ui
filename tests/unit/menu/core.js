define( [
	"jquery",
	"./helper",
	"ui/widgets/menu"
], function( $, testHelper ) {

module( "menu: core" );

test( "markup structure", function( assert ) {
	expect( 11 );
	var element = $( "#menu9" ).menu(),
		items = element.children(),
		firstItemChildren = items.eq( 0 ).children();

	assert.hasClasses( element, "ui-menu ui-widget ui-widget-content" );
	assert.hasClasses( items[ 0 ], "ui-menu-item" );
	equal( items.eq( 0 ).children().length, 2, "Item has exactly 2 children when it has a sub menu" );
	assert.hasClasses( firstItemChildren[ 0 ], "ui-menu-item-wrapper" );
	assert.hasClasses( firstItemChildren[ 1 ], "ui-menu ui-widget ui-widget-content" );
	assert.hasClasses( firstItemChildren.eq( 1 ).children()[ 0 ], "ui-menu-item" );
	assert.hasClasses( firstItemChildren.eq( 1 ).children().eq( 0 ).children(), "ui-menu-item-wrapper" );
	assert.hasClasses( items[ 1 ], "ui-menu-item" );
	equal( items.eq( 1 ).children().length, 1, "Item has exactly 1 child when it does not have a sub menu" );
	assert.hasClasses( items[ 2 ], "ui-menu-item" );
	equal( items.eq( 2 ).children().length, 1, "Item has exactly 1 child when it does not have a sub menu" );
} );

test( "accessibility", function() {
	expect( 4 );
	var element = $( "#menu1" ).menu();

	equal( element.attr( "role" ), "menu", "main role" );
	ok( !element.attr( "aria-activedescendant" ), "aria-activedescendant not set" );

	element.menu( "focus", $.Event(), element.children().eq( -2 ) );
	equal( element.attr( "aria-activedescendant" ), "testID1", "aria-activedescendant from existing id" );

	element.menu( "focus", $.Event(), element.children().eq( 0 ) );
	ok( /^ui-id-\d+$/.test( element.attr( "aria-activedescendant" ) ), "aria-activedescendant from generated id" );

	// Item roles are tested in the role option tests
} );

asyncTest( "#9044: Autofocus issue with dialog opened from menu widget", function() {
	expect( 1 );
	var element = $( "#menu1" ).menu();

	$( "<input>", { id: "test9044" } ).appendTo( "body" );

	$( "#testID1" ).on( "click", function() {
		$( "#test9044" ).trigger( "focus" );
	} );

	testHelper.click( element, "3" );
	setTimeout( function() {
		equal( document.activeElement.id, "test9044", "Focus was swallowed by menu" );
		$( "#test9044" ).remove();
		start();
	} );
} );

asyncTest( "#9532: Need a way in Menu to keep ui-state-active class on selected item for Selectmenu", function( assert ) {
	expect( 1 );
	var element = $( "#menu1" ).menu(),
		firstChild = element.children().eq( 0 ),
		wrapper = firstChild.children( ".ui-menu-item-wrapper" );

	element.menu( "focus", null, firstChild );
	wrapper.addClass( "ui-state-active" );
	setTimeout( function() {
		assert.hasClasses( wrapper, "ui-state-active" );
		start();
	} );
} );

} );
