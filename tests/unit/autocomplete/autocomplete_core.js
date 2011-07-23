(function( $ ) {

module( "autocomplete: core" );

asyncTest( "close-on-blur is properly delayed", function() {
	expect( 3 );
	var element = $( "#autocomplete" )
			.autocomplete({
				source: [ "java", "javascript" ]
			})
			.val( "ja" )
			.autocomplete( "search" ),
		menu = element.autocomplete( "widget" );

	ok( menu.is( ":visible" ) );
	element.blur();
	ok( menu.is( ":visible" ) );
	setTimeout(function() {
		ok( menu.is( ":hidden") );
		start();
	}, 200 );
});

asyncTest( "close-on-blur is cancelled when starting a search", function() {
	expect( 3 );
	var element = $( "#autocomplete" )
			.autocomplete({
				source: [ "java", "javascript" ]
			})
			.val( "ja" )
			.autocomplete( "search" ),
		menu = element.autocomplete( "widget" );

	ok( menu.is( ":visible" ) );
	element.blur();
	ok( menu.is( ":visible" ) );
	element.autocomplete( "search" );
	setTimeout(function() {
		ok( menu.is( ":visible" ) );
		start();
	}, 200 );
});

test( "prevent form submit on enter when menu is active", function() {
	expect( 2 );
	var event,
		element = $( "#autocomplete" )
			.autocomplete({
				source: [ "java", "javascript" ]
			})
			.val( "ja" )
			.autocomplete( "search" ),
		menu = element.autocomplete( "widget" );

	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.DOWN;
	element.trigger( event );
	deepEqual( menu.find( ".ui-menu-item:has(.ui-state-focus)" ).length, 1, "menu item is active" );

	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.ENTER;
	element.trigger( event );
	ok( event.isDefaultPrevented(), "default action is prevented" );
});

test( "allow form submit on enter when menu is not active", function() {
	expect( 1 );
	var event,
		element = $( "#autocomplete" )
			.autocomplete({
				autoFocus: false,
				source: [ "java", "javascript" ]
			})
			.val( "ja" )
			.autocomplete( "search" );

	event = $.Event( "keydown" );
	event.keyCode = $.ui.keyCode.ENTER;
	element.trigger( event );
	ok( !event.isDefaultPrevented(), "default action is prevented" );
});

}( jQuery ) );
