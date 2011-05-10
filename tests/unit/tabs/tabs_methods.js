(function( $ ) {

module( "tabs: methods" );

test( "destroy", function() {
	domEqual( "#tabs1", function() {
		$( "#tabs1" ).tabs().tabs( "destroy" );
	});
});

test( "enable", function() {
	expect( 8 );

	var element = $( "#tabs1" ).tabs({ disabled: true });
	tabs_disabled( element, true );
	element.tabs( "enable" );
	tabs_disabled( element, false );
	element.tabs( "destroy" );

	element.tabs({ disabled: [ 0, 1 ] });
	tabs_disabled( element, [ 0, 1 ] );
	element.tabs( "enable" );
	tabs_disabled( element, false );
});

test( "enable( index )", function() {
    expect( 10 );

	var element = $( "#tabs1" ).tabs({ disabled: true });
	tabs_disabled( element, true );
	// fully disabled -> partially disabled
	element.tabs( "enable", 1 );
	tabs_disabled( element, [ 0, 2 ] );
	// partially disabled -> partially disabled
	element.tabs( "enable", 2 );
	tabs_disabled( element, [ 0 ] );
	// already enabled tab, no change
	element.tabs( "enable", 2 );
	tabs_disabled( element, [ 0 ] );
	// partially disabled -> fully enabled
	element.tabs( "enable", 0 );
	tabs_disabled( element, false );
});

test( "disable", function() {
	expect( 8 );

	var element = $( "#tabs1" ).tabs({ disabled: false });
	tabs_disabled( element, false );
	element.tabs( "disable" );
	tabs_disabled( element, true );
	element.tabs( "destroy" );

	element.tabs({ disabled: [ 0, 1 ] });
	tabs_disabled( element, [ 0, 1 ] );
	element.tabs( "disable" );
	tabs_disabled( element, true );
});

test( "disable( index )", function() {
    expect( 10 );

	var element = $( "#tabs1" ).tabs({ disabled: false });
	tabs_disabled( element, false );
	// fully enabled -> partially disabled
	element.tabs( "disable", 1 );
	tabs_disabled( element, [ 1 ] );
	// partially disabled -> partially disabled
	element.tabs( "disable", 2 );
	tabs_disabled( element, [ 1, 2 ] );
	// already disabled tab, no change
	element.tabs( "disable", 2 );
	tabs_disabled( element, [ 1, 2 ] );
	// partially disabled -> fully disabled
	element.tabs( "disable", 0 );
	tabs_disabled( element, true );
});

test( "refresh", function() {
	expect( 27 );

	var element = $( "#tabs1" ).tabs();
	tabs_state( element, 1, 0, 0 );
	tabs_disabled( element, false );

	// disable tab via markup
	element.find( ".ui-tabs-nav li" ).eq( 1 ).addClass( "ui-state-disabled" );
	element.tabs( "refresh" );
	tabs_state( element, 1, 0, 0 );
	tabs_disabled( element, [ 1 ] );

	// add remote tab
	element.find( ".ui-tabs-nav" ).append( "<li id='newTab'><a href='data/test.html'>new</a></li>" );
	element.tabs( "refresh" );
	tabs_state( element, 1, 0, 0, 0 );
	tabs_disabled( element, [ 1 ] );
	equals( element.find( "#" + $( "#newTab a" ).attr( "aria-controls" ) ).length, 1,
		"panel added for remote tab" );

	// remove all tabs
	element.find( ".ui-tabs-nav li, .ui-tabs-panel" ).remove();
	element.tabs( "refresh" );
	tabs_state( element );
	equals( element.tabs( "option", "active" ), false, "no active tab" );

	// add tabs
	element.find( ".ui-tabs-nav" )
		.append( "<li class='ui-state-disabled'><a href='#newTab2'>new 2</a></li>" )
		.append( "<li><a href='#newTab3'>new 3</a></li>" )
		.append( "<li><a href='#newTab4'>new 4</a></li>" )
		.append( "<li><a href='#newTab5'>new 5</a></li>" );
	element
		.append( "<div id='newTab2'>new 2</div>" )
		.append( "<div id='newTab3'>new 3</div>" )
		.append( "<div id='newTab4'>new 4</div>" )
		.append( "<div id='newTab5'>new 5</div>" );
	element.tabs( "refresh" );
	tabs_state( element, 0, 0, 0, 0 );
	tabs_disabled( element, [ 0 ] );

	// activate third tab
	element.tabs( "option", "active", 2 );
	tabs_state( element, 0, 0, 1, 0 );
	tabs_disabled( element, [ 0 ] );

	// remove fourth tab, third tab should stay active
	element.find( ".ui-tabs-nav li" ).eq( 3 ).remove();
	element.find( ".ui-tabs-panel" ).eq( 3 ).remove();
	element.tabs( "refresh" );
	tabs_state( element, 0, 0, 1 );
	tabs_disabled( element, [ 0 ] );

	// remove third (active) tab, second tab should become active
	element.find( ".ui-tabs-nav li" ).eq( 2 ).remove();
	element.find( ".ui-tabs-panel" ).eq( 2 ).remove();
	element.tabs( "refresh" );
	tabs_state( element, 0, 1 );
	tabs_disabled( element, [ 0 ] );
	
	// remove first tab, previously active tab (now first) should stay active
	element.find( ".ui-tabs-nav li" ).eq( 0 ).remove();
	element.find( ".ui-tabs-panel" ).eq( 0 ).remove();
	element.tabs( "refresh" );
	tabs_state( element, 1 );
	tabs_disabled( element, false );
});

test('load', function() {
	ok(false, "missing test - untested code is broken code.");
});

}( jQuery ) );
