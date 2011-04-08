(function( $ ) {

module( "tabs: core" );

test( "markup structure", function() {
	expect( 3 );
	var element = $( "#tabs1" ).tabs();
	ok( element.hasClass( "ui-tabs" ), "main element is .ui-tabs" );
	ok( element.find( "ul" ).hasClass( "ui-tabs-nav" ), "list item is .ui-tabs-nav" );
	equal( element.find( ".ui-tabs-panel" ).length, 3,
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
		var element = $( selector ).tabs();
		ok( element.hasClass( "ui-tabs" ), "main element is .ui-tabs" );
		ok( $( selector + "-list" ).hasClass( "ui-tabs-nav" ),
			"list item is .ui-tabs-nav" );
	});
});

test( "aria-controls", function() {
	expect( 7 );
	var element = $( "#tabs1" ).tabs(),
		tabs = element.find( ".ui-tabs-nav a" );
	tabs.each(function() {
		var tab = $( this );
		equal( tab.attr( "href" ).substring( 1 ), tab.attr( "aria-controls" ) );
	});

	element = $( "#tabs2" ).tabs();
	tabs = element.find( ".ui-tabs-nav a" );
	equal( tabs.eq( 0 ).attr( "aria-controls" ), "colon:test" );
	equal( tabs.eq( 1 ).attr( "aria-controls" ), "inline-style" );
	ok( /^ui-tabs-\d+$/.test( tabs.eq( 2 ).attr( "aria-controls" ) ), "generated id" );
	equal( tabs.eq( 3 ).attr( "aria-controls" ), "custom-id" );
});

test( "accessibility", function() {
	// TODO: add tests
});

}( jQuery ) );
