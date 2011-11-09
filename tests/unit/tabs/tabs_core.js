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

// #5893 - Sublist in the tab list are considered as tab
test( "nested list", function() {
	expect( 1 );

	var element = $( "#tabs6" ).tabs();
	equals( element.data( "tabs" ).anchors.length, 2, "should contain 2 tab" );
});

test( "disconnected from DOM", function() {
	expect( 2 );

	var element = $( "#tabs1" ).remove().tabs();
	equals( element.find( ".ui-tabs-nav" ).length, 1, "should initialize nav" );
	equals( element.find( ".ui-tabs-panel" ).length, 3, "should initialize panels" );
});

test( "aria-controls", function() {
	expect( 7 );
	var element = $( "#tabs1" ).tabs(),
		tabs = element.find( ".ui-tabs-nav a" );
	tabs.each(function() {
		var tab = $( this );
		equal( tab.prop( "hash" ).substring( 1 ), tab.attr( "aria-controls" ) );
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

test( "#3627 - Ajax tab with url containing a fragment identifier fails to load", function() {
	expect( 1 );

	var element = $( "#tabs2" ).tabs({
		active: 2,
		beforeLoad: function( event, ui ) {
			event.preventDefault();
			ok( /test.html$/.test( ui.ajaxSettings.url ), "should ignore fragment identifier" );
		}
	});
});

test( "#4033 - IE expands hash to full url and misinterprets tab as ajax", function() {
	expect( 2 );

	var element = $( "<div><ul><li><a href='#tab'>Tab</a></li></ul><div id='tab'></div></div>" );
	element.appendTo( "#main" );
	element.tabs({
		beforeLoad: function( event, ui ) {
			event.preventDefault();
			ok( false, 'should not be an ajax tab');
		}
	});

	equals( element.find( ".ui-tabs-nav a" ).attr( "aria-controls" ), "tab", "aria-contorls attribute is correct" );
	tabs_state( element, 1 );
});

}( jQuery ) );
