(function( $ ) {

module( "tabs: options" );

test( "{ active: default }", function() {
	expect( 4 );

	var element = $( "#tabs1" ).tabs();
	equals( element.tabs( "option", "active" ), 0, "should be 0 by default" );
	tabs_state( element, 1, 0, 0 );
	element.tabs( "destroy" );

	location.hash = "#fragment-3";
	element = $( "#tabs1" ).tabs();
	equals( element.tabs( "option", "active" ), 2, "should be 2 based on URL" );
	tabs_state( element, 0, 0, 1 );
	element.tabs( "destroy" );
	location.hash = "#";
});

test( "{ active: false }", function() {
	expect( 7 );

	var element = $( "#tabs1" ).tabs({
		active: false,
		collapsible: true
	});
	tabs_state( element, 0, 0, 0 );
	equal( element.find( ".ui-tabs-nav .ui-state-active" ).size(), 0, "no tabs selected" );
	strictEqual( element.tabs( "option", "active" ), false );

	element.tabs( "option", "collapsible", false );
	tabs_state( element, 1, 0, 0 );
	equal( element.tabs( "option", "active" ), 0 );

	element.tabs( "destroy" );
	element.tabs({
		active: false
	});
	tabs_state( element, 1, 0, 0 );
	strictEqual( element.tabs( "option", "active" ), 0 );
});

test( "{ active: Number }", function() {
	expect( 8 );

	var element = $( "#tabs1" ).tabs({
		active: 2
	});
	equals( element.tabs( "option", "active" ), 2 );
	tabs_state( element, 0, 0, 1 );

	element.tabs( "option", "active", 0 );
	equals( element.tabs( "option", "active" ), 0 );
	tabs_state( element, 1, 0, 0 );

	element.find( ".ui-tabs-nav a" ).eq( 1 ).click();
	equals( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );

	element.tabs( "option", "active", 10 );
	equals( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );
});

if ( $.uiBackCompat === false ) {
	test( "{ active: -Number }", function() {
		var element = $( "#tabs1" ).tabs({
			active: -1
		});
		equals( element.tabs( "option", "active" ), 2 );
		tabs_state( element, 0, 0, 1 );

		element.tabs( "option", "active", -2 );
		equals( element.tabs( "option", "active" ), 1 );
		tabs_state( element, 0, 1, 0 );

		element.tabs( "option", "active", -10 );
		equals( element.tabs( "option", "active" ), 1 );
		tabs_state( element, 0, 1, 0 );

		element.tabs( "option", "active", -3 );
		equals( element.tabs( "option", "active" ), 0 );
		tabs_state( element, 1, 0, 0 );
	});
}

test( "active - mismatched tab/panel order", function() {
	expect( 3 );

	location.hash = "#tabs7-2";
	var element = $( "#tabs7" ).tabs();
	equals( element.tabs( "option", "active" ), 1, "should be 1 based on URL" );
	tabs_state( element, 0, 1 );
	element.tabs( "option", "active", 0 );
	tabs_state( element, 1, 0 );
	location.hash = "#";
});

test( "{ collapsible: false }", function() {
	expect( 4 );

	var element = $( "#tabs1" ).tabs({
		active: 1
	});
	element.tabs( "option", "active", false );
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );

	element.find( ".ui-state-active a" ).eq( 1 ).click();
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );
});

test( "{ collapsible: true }", function() {
	expect( 6 );

	var element = $( "#tabs1" ).tabs({
		active: 1,
		collapsible: true
	});

	element.tabs( "option", "active", false );
	equal( element.tabs( "option", "active" ), false );
	tabs_state( element, 0, 0, 0 );

	element.tabs( "option", "active", 1 );
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );

	element.find( ".ui-state-active a" ).click();
	equal( element.tabs( "option", "active" ), false );
	tabs_state( element, 0, 0, 0 );
});

test( "disabled", function() {
	expect( 10 );

	// fully enabled by default
	var element = $( "#tabs1" ).tabs();
	tabs_disabled( element, false );

	// disable single tab
	element.tabs( "option", "disabled", [ 1 ] );
	tabs_disabled( element, [ 1 ] );

	// disabled active tab
	element.tabs( "option", "disabled", [ 0, 1 ] );
	tabs_disabled( element, [ 0, 1 ] );

	// disable all tabs
	element.tabs( "option", "disabled", [ 0, 1, 2 ] );
	tabs_disabled( element, true );

	// enable all tabs
	element.tabs( "option", "disabled", [] );
	tabs_disabled( element, false );
});

test( "{ event: null }", function() {
	expect( 5 );

	var element = $( "#tabs1" ).tabs({
		event: null
	});
	tabs_state( element, 1, 0, 0 );

	element.tabs( "option", "active", 1 );
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );

	// ensure default click handler isn't bound
	element.find( ".ui-tabs-nav a" ).eq( 2 ).click();
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );
});

test( "{ event: custom }", function() {
	expect( 11 );

	var element = $( "#tabs1" ).tabs({
		event: "custom1 custom2"
	});
	tabs_state( element, 1, 0, 0 );

	element.find( ".ui-tabs-nav a" ).eq( 1 ).trigger( "custom1" );
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );

	// ensure default click handler isn't bound
	element.find( ".ui-tabs-nav a" ).eq( 2 ).trigger( "click" );
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );

	element.find( ".ui-tabs-nav a" ).eq( 2 ).trigger( "custom2" );
	equal( element.tabs( "option", "active" ), 2 );
	tabs_state( element, 0, 0, 1 );

	element.tabs( "option", "event", "custom3" );

	// ensure old event handlers are unbound
	element.find( ".ui-tabs-nav a" ).eq( 1 ).trigger( "custom1" );
	equal( element.tabs( "option", "active" ), 2 );
	tabs_state( element, 0, 0, 1 );

	element.find( ".ui-tabs-nav a" ).eq( 1 ).trigger( "custom3" );
	equal( element.tabs( "option", "active" ), 1 );
	tabs_state( element, 0, 1, 0 );
});

// TODO: add animation tests

}( jQuery ) );
