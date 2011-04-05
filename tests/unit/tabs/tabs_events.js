(function( $ ) {

module( "tabs: events" );

test( "beforeActivate", function() {
	expect( 38 );

	var element = $( "#tabs1" ).tabs({
			// TODO: should be false
			active: -1,
			collapsible: true
		}),
		tabs = element.find( ".ui-tabs-nav a" ),
		panels = element.find( ".ui-tabs-panel" );

	// from collapsed
	element.one( "tabsbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equals( ui.oldTab.size(), 0 );
		equals( ui.oldPanel.size(), 0 );
		equals( ui.newTab.size(), 1 );
		strictEqual( ui.newTab[ 0 ], tabs[ 0 ] );
		equals( ui.newPanel.size(), 1 );
		strictEqual( ui.newPanel[ 0 ], panels[ 0 ] );
		tabs_state( element, 0, 0, 0 );
	});
	element.tabs( "option", "active", 0 );
	tabs_state( element, 1, 0, 0 );

	// switching tabs
	element.one( "tabsbeforeactivate", function( event, ui ) {
		equals( event.originalEvent.type, "click" );
		equals( ui.oldTab.size(), 1 );
		strictEqual( ui.oldTab[ 0 ], tabs[ 0 ] );
		equals( ui.oldPanel.size(), 1 );
		strictEqual( ui.oldPanel[ 0 ], panels[ 0 ] );
		equals( ui.newTab.size(), 1 );
		strictEqual( ui.newTab[ 0 ], tabs[ 1 ] );
		equals( ui.newPanel.size(), 1 );
		strictEqual( ui.newPanel[ 0 ], panels[ 1 ] );
		tabs_state( element, 1, 0, 0 );
	});
	tabs.eq( 1 ).click();
	tabs_state( element, 0, 1, 0 );

	// collapsing
	element.one( "tabsbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equals( ui.oldTab.size(), 1 );
		strictEqual( ui.oldTab[ 0 ], tabs[ 1 ] );
		equals( ui.oldPanel.size(), 1 );
		strictEqual( ui.oldPanel[ 0 ], panels[ 1 ] );
		equals( ui.newTab.size(), 0 );
		equals( ui.newPanel.size(), 0 );
		tabs_state( element, 0, 1, 0 );
	});
	element.tabs( "option", "active", false );
	tabs_state( element, 0, 0, 0 );

	// prevent activation
	element.one( "tabsbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equals( ui.oldTab.size(), 0 );
		equals( ui.oldPanel.size(), 0 );
		equals( ui.newTab.size(), 1 );
		strictEqual( ui.newTab[ 0 ], tabs[ 1 ] );
		equals( ui.newPanel.size(), 1 );
		strictEqual( ui.newPanel[ 0 ], panels[ 1 ] );
		event.preventDefault();
		tabs_state( element, 0, 0, 0 );
	});
	element.tabs( "option", "active", 1 );
	tabs_state( element, 0, 0, 0 );
});

test( "activate", function() {
	expect( 30 );

	var element = $( "#tabs1" ).tabs({
			// TODO: should be false
			active: -1,
			collapsible: true
		}),
		tabs = element.find( ".ui-tabs-nav a" ),
		panels = element.find( ".ui-tabs-panel" );

	// from collapsed
	element.one( "tabsactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equals( ui.oldTab.size(), 0 );
		equals( ui.oldPanel.size(), 0 );
		equals( ui.newTab.size(), 1 );
		strictEqual( ui.newTab[ 0 ], tabs[ 0 ] );
		equals( ui.newPanel.size(), 1 );
		strictEqual( ui.newPanel[ 0 ], panels[ 0 ] );
		tabs_state( element, 1, 0, 0 );
	});
	element.tabs( "option", "active", 0 );
	tabs_state( element, 1, 0, 0 );

	// switching tabs
	element.one( "tabsactivate", function( event, ui ) {
		equals( event.originalEvent.type, "click" );
		equals( ui.oldTab.size(), 1 );
		strictEqual( ui.oldTab[ 0 ], tabs[ 0 ] );
		equals( ui.oldPanel.size(), 1 );
		strictEqual( ui.oldPanel[ 0 ], panels[ 0 ] );
		equals( ui.newTab.size(), 1 );
		strictEqual( ui.newTab[ 0 ], tabs[ 1 ] );
		equals( ui.newPanel.size(), 1 );
		strictEqual( ui.newPanel[ 0 ], panels[ 1 ] );
		tabs_state( element, 0, 1, 0 );
	});
	tabs.eq( 1 ).click();
	tabs_state( element, 0, 1, 0 );

	// collapsing
	element.one( "tabsactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ) );
		equals( ui.oldTab.size(), 1 );
		strictEqual( ui.oldTab[ 0 ], tabs[ 1 ] );
		equals( ui.oldPanel.size(), 1 );
		strictEqual( ui.oldPanel[ 0 ], panels[ 1 ] );
		equals( ui.newTab.size(), 0 );
		equals( ui.newPanel.size(), 0 );
		tabs_state( element, 0, 0, 0 );
	});
	element.tabs( "option", "active", false );
	tabs_state( element, 0, 0, 0 );

	// prevent activation
	element.one( "tabsbeforeactivate", function( event ) {
		ok( true );
		event.preventDefault();
	});
	element.one( "tabsactivate", function() {
		ok( false );
	});
	element.tabs( "option", "active", 1 );
});

test( "beforeLoad", function() {
	expect( 21 );

	var tab, panelId, panel,
		element = $( "#tabs2" ).tabs();

	// TODO: init
//	element.one( "tabsbeforeload", function( event, ui ) {
//	});
//	element.tabs({ active: 2 });

	// .option()
	element.one( "tabsbeforeload", function( event, ui ) {
		tab = element.find( ".ui-tabs-nav a" ).eq( 2 );
		panelId = tab.attr( "aria-controls" );
		panel = $( "#" + panelId );

		ok( !( "originalEvent" in event ), "originalEvent" );
		ok( "abort" in ui.jqXHR, "jqXHR" );
		ok( ui.ajaxSettings.url, "data/test.html", "ajaxSettings.url" );
		equals( ui.tab.size(), 1, "tab size" );
		strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		equals( ui.panel.size(), 1, "panel size" );
		strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		equals( ui.panel.html(), "", "panel html" );
		event.preventDefault();
		tabs_state( element, 1, 0, 0, 0 );
	});
	element.tabs( "option", "active", 2 );
	tabs_state( element, 0, 0, 1, 0 );
	equals( panel.html(), "", "panel html after" );

	// click
	element.one( "tabsbeforeload", function( event, ui ) {
		tab = element.find( ".ui-tabs-nav a" ).eq( 3 );
		panelId = tab.attr( "aria-controls" );
		panel = $( "#" + panelId );

		equals( event.originalEvent.type, "click", "originalEvent" );
		ok( "abort" in ui.jqXHR, "jqXHR" );
		ok( ui.ajaxSettings.url, "data/test.html", "ajaxSettings.url" );
		equals( ui.tab.size(), 1, "tab size" );
		strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		equals( ui.panel.size(), 1, "panel size" );
		strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		ui.panel.html( "<p>testing</p>" );
		event.preventDefault();
		tabs_state( element, 0, 0, 1, 0 );
	});
	element.find( ".ui-tabs-nav a" ).eq( 3 ).click();
	tabs_state( element, 0, 0, 0, 1 );
	equals( panel.html(), "<p>testing</p>", "panel html after" );
});

test('load', function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
