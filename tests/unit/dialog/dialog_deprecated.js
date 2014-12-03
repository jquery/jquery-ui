(function( $ ) {

module( "dialog (deprecated): options" );

test( "dialogClass", function() {
	expect( 6 );

	var element = $( "<div></div>" ).dialog(),
		widget = element.dialog( "widget" );
	equal( widget.is( ".foo" ), false, "dialogClass not specified. class not added" );
	element.remove();

	element = $( "<div></div>" ).dialog({ dialogClass: "foo" });
	widget = element.dialog( "widget" );
	equal( widget.is( ".foo" ), true, "dialogClass in init, foo class added" );
	element.dialog( "option", "dialogClass", "foobar" );
	equal( widget.is( ".foo" ), false, "dialogClass changed, previous one was removed" );
	equal( widget.is( ".foobar" ), true, "dialogClass changed, new one was added" );
	element.remove();

	element = $( "<div></div>" ).dialog({ dialogClass: "foo bar" });
	widget = element.dialog( "widget" );
	equal( widget.is( ".foo" ), true, "dialogClass in init, two classes. foo class added" );
	equal( widget.is( ".bar" ), true, "dialogClass in init, two classes. bar class added" );
	element.remove();
});

})( jQuery );
