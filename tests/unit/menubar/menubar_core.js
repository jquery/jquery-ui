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

})( jQuery );
