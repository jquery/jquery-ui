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

asyncTest( "load", function() {
	expect( 30 );

	var element = $( "#tabs2" ).tabs();

	// load content of inactive tab
	// useful for preloading content with custom caching
	element.one( "tabsbeforeload", function( event, ui ) {
		var tab = element.find( ".ui-tabs-nav a" ).eq( 3 ),
			panelId = tab.attr( "aria-controls" ),
			panel = $( "#" + panelId );

		ok( !( "originalEvent" in event ), "originalEvent" );
		equals( ui.tab.size(), 1, "tab size" );
		strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		equals( ui.panel.size(), 1, "panel size" );
		strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		tabs_state( element, 1, 0, 0, 0, 0 );
	});
	element.one( "tabsload", function( event, ui ) {
		// TODO: remove wrapping in 2.0
		var uiTab = $( ui.tab ),
			uiPanel = $( ui.panel );

		var tab = element.find( ".ui-tabs-nav a" ).eq( 3 ),
			panelId = tab.attr( "aria-controls" ),
			panel = $( "#" + panelId );
		
		ok( !( "originalEvent" in event ), "originalEvent" );
		equals( uiTab.size(), 1, "tab size" );
		strictEqual( uiTab[ 0 ], tab[ 0 ], "tab" );
		equals( uiPanel.size(), 1, "panel size" );
		strictEqual( uiPanel[ 0 ], panel[ 0 ], "panel" );
		equals( uiPanel.find( "p" ).length, 1, "panel html" );
		tabs_state( element, 1, 0, 0, 0, 0 );
		setTimeout( tabsload1, 1 );
	});
	element.tabs( "load", 3 );
	tabs_state( element, 1, 0, 0, 0, 0 );

	function tabsload1() {
		// no need to test details of event (tested in events tests)
		element.one( "tabsbeforeload", function() {
			ok( true, "tabsbeforeload invoked" );
		});
		element.one( "tabsload", function() {
			ok( true, "tabsload invoked" );
			setTimeout( tabsload2, 1 );
		});
		element.tabs( "option", "active", 3 );
		tabs_state( element, 0, 0, 0, 1, 0 );
	}

	function tabsload2() {
		// reload content of active tab
		element.one( "tabsbeforeload", function( event, ui ) {
			var tab = element.find( ".ui-tabs-nav a" ).eq( 3 ),
				panelId = tab.attr( "aria-controls" ),
				panel = $( "#" + panelId );

			ok( !( "originalEvent" in event ), "originalEvent" );
			equals( ui.tab.size(), 1, "tab size" );
			strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
			equals( ui.panel.size(), 1, "panel size" );
			strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
			tabs_state( element, 0, 0, 0, 1, 0 );
		});
		element.one( "tabsload", function( event, ui ) {
			// TODO: remove wrapping in 2.0
			var uiTab = $( ui.tab ),
				uiPanel = $( ui.panel );

			var tab = element.find( ".ui-tabs-nav a" ).eq( 3 ),
				panelId = tab.attr( "aria-controls" ),
				panel = $( "#" + panelId );
			
			ok( !( "originalEvent" in event ), "originalEvent" );
			equals( uiTab.size(), 1, "tab size" );
			strictEqual( uiTab[ 0 ], tab[ 0 ], "tab" );
			equals( uiPanel.size(), 1, "panel size" );
			strictEqual( uiPanel[ 0 ], panel[ 0 ], "panel" );
			tabs_state( element, 0, 0, 0, 1, 0 );
			start();
		});
		element.tabs( "load", 3 );
		tabs_state( element, 0, 0, 0, 1, 0 );
	}
});

}( jQuery ) );
