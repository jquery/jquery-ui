(function( $ ) {

module( "tabs: events" );

test( "create", function() {
	expect( 10 );

	var element = $( "#tabs1" ),
		tabs = element.find( "ul a" ),
		panels = element.children( "div" );

	element.tabs({
		create: function( event, ui ) {
			equal( ui.tab.size(), 1, "tab size" );
			strictEqual( ui.tab[ 0 ], tabs[ 0 ], "tab" );
			equal( ui.panel.size(), 1, "panel size" );
			strictEqual( ui.panel[ 0 ], panels[ 0 ], "panel" );
		}
	});
	element.tabs( "destroy" );

	element.tabs({
		active: 2,
		create: function( event, ui ) {
			equal( ui.tab.size(), 1, "tab size" );
			strictEqual( ui.tab[ 0 ], tabs[ 2 ], "tab" );
			equal( ui.panel.size(), 1, "panel size" );
			strictEqual( ui.panel[ 0 ], panels[ 2 ], "panel" );
		}
	});
	element.tabs( "destroy" );

	element.tabs({
		active: false,
		collapsible: true,
		create: function( event, ui ) {
			equal( ui.tab.size(), 0, "tab size" );
			equal( ui.panel.size(), 0, "panel size" );
		}
	});
	element.tabs( "destroy" );
});

test( "beforeActivate", function() {
	expect( 38 );

	var element = $( "#tabs1" ).tabs({
			active: false,
			collapsible: true
		}),
		tabs = element.find( ".ui-tabs-nav a" ),
		panels = element.find( ".ui-tabs-panel" );

	// from collapsed
	element.one( "tabsbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ), "originalEvent" );
		equal( ui.oldTab.size(), 0, "oldTab size" );
		equal( ui.oldPanel.size(), 0, "oldPanel size" );
		equal( ui.newTab.size(), 1, "newTab size" );
		strictEqual( ui.newTab[ 0 ], tabs[ 0 ], "newTab" );
		equal( ui.newPanel.size(), 1, "newPanel size" );
		strictEqual( ui.newPanel[ 0 ], panels[ 0 ], "newPanel" );
		tabs_state( element, 0, 0, 0 );
	});
	element.tabs( "option", "active", 0 );
	tabs_state( element, 1, 0, 0 );

	// switching tabs
	element.one( "tabsbeforeactivate", function( event, ui ) {
		equal( event.originalEvent.type, "click", "originalEvent" );
		equal( ui.oldTab.size(), 1, "oldTab size" );
		strictEqual( ui.oldTab[ 0 ], tabs[ 0 ], "oldTab" );
		equal( ui.oldPanel.size(), 1, "oldPanel size" );
		strictEqual( ui.oldPanel[ 0 ], panels[ 0 ], "oldPanel" );
		equal( ui.newTab.size(), 1, "newTab size" );
		strictEqual( ui.newTab[ 0 ], tabs[ 1 ], "newTab" );
		equal( ui.newPanel.size(), 1, "newPanel size" );
		strictEqual( ui.newPanel[ 0 ], panels[ 1 ], "newPanel" );
		tabs_state( element, 1, 0, 0 );
	});
	tabs.eq( 1 ).click();
	tabs_state( element, 0, 1, 0 );

	// collapsing
	element.one( "tabsbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ), "originalEvent" );
		equal( ui.oldTab.size(), 1, "oldTab size" );
		strictEqual( ui.oldTab[ 0 ], tabs[ 1 ], "oldTab" );
		equal( ui.oldPanel.size(), 1, "oldPanel size" );
		strictEqual( ui.oldPanel[ 0 ], panels[ 1 ], "oldPanel" );
		equal( ui.newTab.size(), 0, "newTab size" );
		equal( ui.newPanel.size(), 0, "newPanel size" );
		tabs_state( element, 0, 1, 0 );
	});
	element.tabs( "option", "active", false );
	tabs_state( element, 0, 0, 0 );

	// prevent activation
	element.one( "tabsbeforeactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ), "originalEvent" );
		equal( ui.oldTab.size(), 0, "oldTab size" );
		equal( ui.oldPanel.size(), 0, "oldTab" );
		equal( ui.newTab.size(), 1, "newTab size" );
		strictEqual( ui.newTab[ 0 ], tabs[ 1 ], "newTab" );
		equal( ui.newPanel.size(), 1, "newPanel size" );
		strictEqual( ui.newPanel[ 0 ], panels[ 1 ], "newPanel" );
		event.preventDefault();
		tabs_state( element, 0, 0, 0 );
	});
	element.tabs( "option", "active", 1 );
	tabs_state( element, 0, 0, 0 );
});

test( "activate", function() {
	expect( 30 );

	var element = $( "#tabs1" ).tabs({
			active: false,
			collapsible: true
		}),
		tabs = element.find( ".ui-tabs-nav a" ),
		panels = element.find( ".ui-tabs-panel" );

	// from collapsed
	element.one( "tabsactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ), "originalEvent" );
		equal( ui.oldTab.size(), 0, "oldTab size" );
		equal( ui.oldPanel.size(), 0, "oldPanel size" );
		equal( ui.newTab.size(), 1, "newTab size" );
		strictEqual( ui.newTab[ 0 ], tabs[ 0 ], "newTab" );
		equal( ui.newPanel.size(), 1, "newPanel size" );
		strictEqual( ui.newPanel[ 0 ], panels[ 0 ], "newPanel" );
		tabs_state( element, 1, 0, 0 );
	});
	element.tabs( "option", "active", 0 );
	tabs_state( element, 1, 0, 0 );

	// switching tabs
	element.one( "tabsactivate", function( event, ui ) {
		equal( event.originalEvent.type, "click", "originalEvent" );
		equal( ui.oldTab.size(), 1, "oldTab size" );
		strictEqual( ui.oldTab[ 0 ], tabs[ 0 ], "oldTab" );
		equal( ui.oldPanel.size(), 1, "oldPanel size" );
		strictEqual( ui.oldPanel[ 0 ], panels[ 0 ], "oldPanel" );
		equal( ui.newTab.size(), 1, "newTab size" );
		strictEqual( ui.newTab[ 0 ], tabs[ 1 ], "newTab" );
		equal( ui.newPanel.size(), 1, "newPanel size" );
		strictEqual( ui.newPanel[ 0 ], panels[ 1 ], "newPanel" );
		tabs_state( element, 0, 1, 0 );
	});
	tabs.eq( 1 ).click();
	tabs_state( element, 0, 1, 0 );

	// collapsing
	element.one( "tabsactivate", function( event, ui ) {
		ok( !( "originalEvent" in event ), "originalEvent" );
		equal( ui.oldTab.size(), 1, "oldTab size" );
		strictEqual( ui.oldTab[ 0 ], tabs[ 1 ], "oldTab" );
		equal( ui.oldPanel.size(), 1, "oldPanel size" );
		strictEqual( ui.oldPanel[ 0 ], panels[ 1 ], "oldPanel" );
		equal( ui.newTab.size(), 0, "newTab size" );
		equal( ui.newPanel.size(), 0, "newPanel size" );
		tabs_state( element, 0, 0, 0 );
	});
	element.tabs( "option", "active", false );
	tabs_state( element, 0, 0, 0 );

	// prevent activation
	element.one( "tabsbeforeactivate", function( event ) {
		ok( true, "tabsbeforeactivate" );
		event.preventDefault();
	});
	element.one( "tabsactivate", function() {
		ok( false, "tabsactivate" );
	});
	element.tabs( "option", "active", 1 );
});

test( "beforeLoad", function() {
	expect( 32 );

	var tab, panelId, panel,
		element = $( "#tabs2" );

	// init
	element.one( "tabsbeforeload", function( event, ui ) {
		tab = element.find( ".ui-tabs-nav a" ).eq( 2 );
		panelId = tab.attr( "aria-controls" );
		panel = $( "#" + panelId );

		ok( !( "originalEvent" in event ), "originalEvent" );
		ok( "abort" in ui.jqXHR, "jqXHR" );
		ok( ui.ajaxSettings.url, "data/test.html", "ajaxSettings.url" );
		equal( ui.tab.size(), 1, "tab size" );
		strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		equal( ui.panel.size(), 1, "panel size" );
		strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		equal( ui.panel.html(), "", "panel html" );
		event.preventDefault();
		tabs_state( element, 0, 0, 1, 0, 0 );
	});
	element.tabs({ active: 2 });
	tabs_state( element, 0, 0, 1, 0, 0 );
	equal( panel.html(), "", "panel html after" );
	element.tabs( "destroy" );

	// .option()
	element.one( "tabsbeforeload", function( event, ui ) {
		tab = element.find( ".ui-tabs-nav a" ).eq( 2 );
		panelId = tab.attr( "aria-controls" );
		panel = $( "#" + panelId );

		ok( !( "originalEvent" in event ), "originalEvent" );
		ok( "abort" in ui.jqXHR, "jqXHR" );
		ok( ui.ajaxSettings.url, "data/test.html", "ajaxSettings.url" );
		equal( ui.tab.size(), 1, "tab size" );
		strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		equal( ui.panel.size(), 1, "panel size" );
		strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		equal( ui.panel.html(), "", "panel html" );
		event.preventDefault();
		tabs_state( element, 1, 0, 0, 0, 0 );
	});
	element.tabs();
	element.tabs( "option", "active", 2 );
	tabs_state( element, 0, 0, 1, 0, 0 );
	equal( panel.html(), "", "panel html after" );

	// click, change panel content
	element.one( "tabsbeforeload", function( event, ui ) {
		tab = element.find( ".ui-tabs-nav a" ).eq( 3 );
		panelId = tab.attr( "aria-controls" );
		panel = $( "#" + panelId );

		equal( event.originalEvent.type, "click", "originalEvent" );
		ok( "abort" in ui.jqXHR, "jqXHR" );
		ok( ui.ajaxSettings.url, "data/test.html", "ajaxSettings.url" );
		equal( ui.tab.size(), 1, "tab size" );
		strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		equal( ui.panel.size(), 1, "panel size" );
		strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		ui.panel.html( "<p>testing</p>" );
		event.preventDefault();
		tabs_state( element, 0, 0, 1, 0, 0 );
	});
	element.find( ".ui-tabs-nav a" ).eq( 3 ).click();
	tabs_state( element, 0, 0, 0, 1, 0 );
	// .toLowerCase() is needed to convert <P> to <p> in old IEs
	equal( panel.html().toLowerCase(), "<p>testing</p>", "panel html after" );
});

if ( $.uiBackCompat === false ) {
	asyncTest( "load", function() {
		expect( 21 );

		var tab, panelId, panel,
			element = $( "#tabs2" );

		// init
		element.one( "tabsload", function( event, ui ) {
			tab = element.find( ".ui-tabs-nav a" ).eq( 2 );
			panelId = tab.attr( "aria-controls" );
			panel = $( "#" + panelId );

			ok( !( "originalEvent" in event ), "originalEvent" );
			equal( ui.tab.size(), 1, "tab size" );
			strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
			equal( ui.panel.size(), 1, "panel size" );
			strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
			equal( ui.panel.find( "p" ).length, 1, "panel html" );
			tabs_state( element, 0, 0, 1, 0, 0 );
			tabsload1();
		});
		element.tabs({ active: 2 });

		function tabsload1() {
			// .option()
			element.one( "tabsload", function( event, ui ) {
				tab = element.find( ".ui-tabs-nav a" ).eq( 3 );
				panelId = tab.attr( "aria-controls" );
				panel = $( "#" + panelId );

				ok( !( "originalEvent" in event ), "originalEvent" );
				equal( ui.tab.size(), 1, "tab size" );
				strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
				equal( ui.panel.size(), 1, "panel size" );
				strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
				equal( ui.panel.find( "p" ).length, 1, "panel html" );
				tabs_state( element, 0, 0, 0, 1, 0 );
				tabsload2();
			});
			element.tabs( "option", "active", 3 );
		}

		function tabsload2() {
			// click, change panel content
			element.one( "tabsload", function( event, ui ) {
				tab = element.find( ".ui-tabs-nav a" ).eq( 4 );
				panelId = tab.attr( "aria-controls" );
				panel = $( "#" + panelId );

				equal( event.originalEvent.type, "click", "originalEvent" );
				equal( ui.tab.size(), 1, "tab size" );
				strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
				equal( ui.panel.size(), 1, "panel size" );
				strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
				equal( ui.panel.find( "p" ).length, 1, "panel html" );
				tabs_state( element, 0, 0, 0, 0, 1 );
				start();
			});
			element.find( ".ui-tabs-nav a" ).eq( 4 ).click();
		}
	});
}

}( jQuery ) );
