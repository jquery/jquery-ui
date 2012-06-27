(function( $ ) {

module( "menu: core" );

test( "accessibility", function () {
	expect( 5 );
	var item,
		element = $( "#menu1" ).menu(),
		item0 = $( "li:eq(0) a" );

	ok( element.hasClass( "ui-menu ui-widget ui-widget-content ui-corner-all" ), "menu class");
	equal( element.attr( "role" ), "menu", "main role" );
	ok( !element.attr( "aria-activedescendant" ), "aria attribute not yet active" );

	item = element.find( "li:first" ).find( "a" ).attr( "id", "xid" ).end();
	element.menu( "focus", $.Event(), item );
	equal( element.attr( "aria-activedescendant" ), "xid", "aria attribute, id from DOM" );

	item = element.find( "li:last" );
	element.menu( "focus", $.Event(), item );
	ok( /^ui-id-\d+$/.test( element.attr( "aria-activedescendant" ) ), "aria attribute, generated id");
});

})( jQuery );
