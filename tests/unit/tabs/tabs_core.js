(function( $ ) {

module( "tabs: core" );

test( "markup structure", function() {
	expect( 3 );
	var el = $( "#tabs1" ).tabs();
	ok( el.hasClass( "ui-tabs" ), "main element is .ui-tabs" );
	ok( el.find( "ul" ).hasClass( "ui-tabs-nav" ), "list item is .ui-tabs-nav" );
	equal( el.find( ".ui-tabs-panel" ).length, 3,
		".ui-tabs-panel elements exist, correct number" );
});

$.each({
	"deep ul": "#tabs3",
	"multiple lists, ul first": "#tabs4",
	"multiple lists, ol first": "#tabs5",
	"empty list": "#tabs6"
}, function( type, selector ) {
	test( "markup structure: " + type, function() {
		expect( 2 );
		var el = $( selector ).tabs();
		ok( el.hasClass( "ui-tabs" ), "main element is .ui-tabs" );
		ok( $( selector + "-list" ).hasClass( "ui-tabs-nav" ),
			"list item is .ui-tabs-nav" );
	});
});

test( "accessibility", function() {
	// TODO: add tests
});

}( jQuery ) );
