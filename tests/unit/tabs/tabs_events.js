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
	expect( 5 );

	el = $( "#tabs2" );

	el.tabs({
		active: 2,
		beforeLoad: function( event, ui ) {
			ok( $.isFunction( ui.jqXHR.promise ), 'contain jqXHR object');
			equals( ui.settings.url, "data/test.html", 'contain ajax settings url');
			equals( ui.tab, el.find('a')[ 2 ], 'contain tab as DOM anchor element');
			equals( ui.panel, el.find('div')[ 2 ], 'contain panel as DOM div element');
			equals( ui.index, 2, 'contain index');
			event.preventDefault();
		}
	});
});

test('load', function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
