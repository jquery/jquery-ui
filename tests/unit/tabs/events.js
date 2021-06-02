define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/tabs"
], function( QUnit, $, helper, testHelper ) {
"use strict";

var state = testHelper.state;

QUnit.module( "tabs: events", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "create", function( assert ) {
	assert.expect( 10 );

	var element = $( "#tabs1" ),
		tabs = element.find( "ul li" ),
		panels = element.children( "div" );

	element.tabs( {
		create: function( event, ui ) {
			assert.equal( ui.tab.length, 1, "tab length" );
			assert.strictEqual( ui.tab[ 0 ], tabs[ 0 ], "tab" );
			assert.equal( ui.panel.length, 1, "panel length" );
			assert.strictEqual( ui.panel[ 0 ], panels[ 0 ], "panel" );
		}
	} );
	element.tabs( "destroy" );

	element.tabs( {
		active: 2,
		create: function( event, ui ) {
			assert.equal( ui.tab.length, 1, "tab length" );
			assert.strictEqual( ui.tab[ 0 ], tabs[ 2 ], "tab" );
			assert.equal( ui.panel.length, 1, "panel length" );
			assert.strictEqual( ui.panel[ 0 ], panels[ 2 ], "panel" );
		}
	} );
	element.tabs( "destroy" );

	element.tabs( {
		active: false,
		collapsible: true,
		create: function( event, ui ) {
			assert.equal( ui.tab.length, 0, "tab length" );
			assert.equal( ui.panel.length, 0, "panel length" );
		}
	} );
	element.tabs( "destroy" );
} );

QUnit.test( "beforeActivate", function( assert ) {
	assert.expect( 38 );

	var element = $( "#tabs1" ).tabs( {
			active: false,
			collapsible: true
		} ),
		tabs = element.find( ".ui-tabs-nav li" ),
		anchors = tabs.find( ".ui-tabs-anchor" ),
		panels = element.find( ".ui-tabs-panel" );

	// From collapsed
	element.one( "tabsbeforeactivate", function( event, ui ) {
		assert.ok( !( "originalEvent" in event ), "originalEvent" );
		assert.equal( ui.oldTab.length, 0, "oldTab length" );
		assert.equal( ui.oldPanel.length, 0, "oldPanel length" );
		assert.equal( ui.newTab.length, 1, "newTab length" );
		assert.strictEqual( ui.newTab[ 0 ], tabs[ 0 ], "newTab" );
		assert.equal( ui.newPanel.length, 1, "newPanel length" );
		assert.strictEqual( ui.newPanel[ 0 ], panels[ 0 ], "newPanel" );
		state( assert, element, 0, 0, 0 );
	} );
	element.tabs( "option", "active", 0 );
	state( assert, element, 1, 0, 0 );

	// Switching tabs
	element.one( "tabsbeforeactivate", function( event, ui ) {
		assert.equal( event.originalEvent.type, "click", "originalEvent" );
		assert.equal( ui.oldTab.length, 1, "oldTab length" );
		assert.strictEqual( ui.oldTab[ 0 ], tabs[ 0 ], "oldTab" );
		assert.equal( ui.oldPanel.length, 1, "oldPanel length" );
		assert.strictEqual( ui.oldPanel[ 0 ], panels[ 0 ], "oldPanel" );
		assert.equal( ui.newTab.length, 1, "newTab length" );
		assert.strictEqual( ui.newTab[ 0 ], tabs[ 1 ], "newTab" );
		assert.equal( ui.newPanel.length, 1, "newPanel length" );
		assert.strictEqual( ui.newPanel[ 0 ], panels[ 1 ], "newPanel" );
		state( assert, element, 1, 0, 0 );
	} );
	anchors.eq( 1 ).trigger( "click" );
	state( assert, element, 0, 1, 0 );

	// Collapsing
	element.one( "tabsbeforeactivate", function( event, ui ) {
		assert.ok( !( "originalEvent" in event ), "originalEvent" );
		assert.equal( ui.oldTab.length, 1, "oldTab length" );
		assert.strictEqual( ui.oldTab[ 0 ], tabs[ 1 ], "oldTab" );
		assert.equal( ui.oldPanel.length, 1, "oldPanel length" );
		assert.strictEqual( ui.oldPanel[ 0 ], panels[ 1 ], "oldPanel" );
		assert.equal( ui.newTab.length, 0, "newTab length" );
		assert.equal( ui.newPanel.length, 0, "newPanel length" );
		state( assert, element, 0, 1, 0 );
	} );
	element.tabs( "option", "active", false );
	state( assert, element, 0, 0, 0 );

	// Prevent activation
	element.one( "tabsbeforeactivate", function( event, ui ) {
		assert.ok( !( "originalEvent" in event ), "originalEvent" );
		assert.equal( ui.oldTab.length, 0, "oldTab length" );
		assert.equal( ui.oldPanel.length, 0, "oldTab" );
		assert.equal( ui.newTab.length, 1, "newTab length" );
		assert.strictEqual( ui.newTab[ 0 ], tabs[ 1 ], "newTab" );
		assert.equal( ui.newPanel.length, 1, "newPanel length" );
		assert.strictEqual( ui.newPanel[ 0 ], panels[ 1 ], "newPanel" );
		event.preventDefault();
		state( assert, element, 0, 0, 0 );
	} );
	element.tabs( "option", "active", 1 );
	state( assert, element, 0, 0, 0 );
} );

QUnit.test( "activate", function( assert ) {
	assert.expect( 30 );

	var element = $( "#tabs1" ).tabs( {
			active: false,
			collapsible: true
		} ),
		tabs = element.find( ".ui-tabs-nav li" ),
		anchors = element.find( ".ui-tabs-anchor" ),
		panels = element.find( ".ui-tabs-panel" );

	// From collapsed
	element.one( "tabsactivate", function( event, ui ) {
		assert.ok( !( "originalEvent" in event ), "originalEvent" );
		assert.equal( ui.oldTab.length, 0, "oldTab length" );
		assert.equal( ui.oldPanel.length, 0, "oldPanel length" );
		assert.equal( ui.newTab.length, 1, "newTab length" );
		assert.strictEqual( ui.newTab[ 0 ], tabs[ 0 ], "newTab" );
		assert.equal( ui.newPanel.length, 1, "newPanel length" );
		assert.strictEqual( ui.newPanel[ 0 ], panels[ 0 ], "newPanel" );
		state( assert, element, 1, 0, 0 );
	} );
	element.tabs( "option", "active", 0 );
	state( assert, element, 1, 0, 0 );

	// Switching tabs
	element.one( "tabsactivate", function( event, ui ) {
		assert.equal( event.originalEvent.type, "click", "originalEvent" );
		assert.equal( ui.oldTab.length, 1, "oldTab length" );
		assert.strictEqual( ui.oldTab[ 0 ], tabs[ 0 ], "oldTab" );
		assert.equal( ui.oldPanel.length, 1, "oldPanel length" );
		assert.strictEqual( ui.oldPanel[ 0 ], panels[ 0 ], "oldPanel" );
		assert.equal( ui.newTab.length, 1, "newTab length" );
		assert.strictEqual( ui.newTab[ 0 ], tabs[ 1 ], "newTab" );
		assert.equal( ui.newPanel.length, 1, "newPanel length" );
		assert.strictEqual( ui.newPanel[ 0 ], panels[ 1 ], "newPanel" );
		state( assert, element, 0, 1, 0 );
	} );
	anchors.eq( 1 ).trigger( "click" );
	state( assert, element, 0, 1, 0 );

	// Collapsing
	element.one( "tabsactivate", function( event, ui ) {
		assert.ok( !( "originalEvent" in event ), "originalEvent" );
		assert.equal( ui.oldTab.length, 1, "oldTab length" );
		assert.strictEqual( ui.oldTab[ 0 ], tabs[ 1 ], "oldTab" );
		assert.equal( ui.oldPanel.length, 1, "oldPanel length" );
		assert.strictEqual( ui.oldPanel[ 0 ], panels[ 1 ], "oldPanel" );
		assert.equal( ui.newTab.length, 0, "newTab length" );
		assert.equal( ui.newPanel.length, 0, "newPanel length" );
		state( assert, element, 0, 0, 0 );
	} );
	element.tabs( "option", "active", false );
	state( assert, element, 0, 0, 0 );

	// Prevent activation
	element.one( "tabsbeforeactivate", function( event ) {
		assert.ok( true, "tabsbeforeactivate" );
		event.preventDefault();
	} );
	element.one( "tabsactivate", function() {
		assert.ok( false, "tabsactivate" );
	} );
	element.tabs( "option", "active", 1 );
} );

QUnit.test( "beforeLoad", function( assert ) {
	assert.expect( 32 );

	var tab, panelId, panel,
		element = $( "#tabs2" );

	// Init
	element.one( "tabsbeforeload", function( event, ui ) {
		tab = element.find( ".ui-tabs-nav li" ).eq( 2 );
		panelId = tab.attr( "aria-controls" );
		panel = $( "#" + panelId );

		assert.ok( !( "originalEvent" in event ), "originalEvent" );
		assert.ok( "abort" in ui.jqXHR, "jqXHR" );
		assert.ok( ui.ajaxSettings.url, "data/test.html", "ajaxSettings.url" );
		assert.equal( ui.tab.length, 1, "tab length" );
		assert.strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		assert.equal( ui.panel.length, 1, "panel length" );
		assert.strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		assert.equal( ui.panel.html(), "", "panel html" );
		event.preventDefault();
		state( assert, element, 0, 0, 1, 0, 0 );
	} );
	element.tabs( { active: 2 } );
	state( assert, element, 0, 0, 1, 0, 0 );
	assert.equal( panel.html(), "", "panel html after" );
	element.tabs( "destroy" );

	// .option()
	element.one( "tabsbeforeload", function( event, ui ) {
		tab = element.find( ".ui-tabs-nav li" ).eq( 2 );
		panelId = tab.attr( "aria-controls" );
		panel = $( "#" + panelId );

		assert.ok( !( "originalEvent" in event ), "originalEvent" );
		assert.ok( "abort" in ui.jqXHR, "jqXHR" );
		assert.ok( ui.ajaxSettings.url, "data/test.html", "ajaxSettings.url" );
		assert.equal( ui.tab.length, 1, "tab length" );
		assert.strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		assert.equal( ui.panel.length, 1, "panel length" );
		assert.strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		assert.equal( ui.panel.html(), "", "panel html" );
		event.preventDefault();
		state( assert, element, 1, 0, 0, 0, 0 );
	} );
	element.tabs();
	element.tabs( "option", "active", 2 );
	state( assert, element, 0, 0, 1, 0, 0 );
	assert.equal( panel.html(), "", "panel html after" );

	// Click, change panel content
	element.one( "tabsbeforeload", function( event, ui ) {
		tab = element.find( ".ui-tabs-nav li" ).eq( 3 );
		panelId = tab.attr( "aria-controls" );
		panel = $( "#" + panelId );

		assert.equal( event.originalEvent.type, "click", "originalEvent" );
		assert.ok( "abort" in ui.jqXHR, "jqXHR" );
		assert.ok( ui.ajaxSettings.url, "data/test.html", "ajaxSettings.url" );
		assert.equal( ui.tab.length, 1, "tab length" );
		assert.strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		assert.equal( ui.panel.length, 1, "panel length" );
		assert.strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		ui.panel.html( "<p>testing</p>" );
		event.preventDefault();
		state( assert, element, 0, 0, 1, 0, 0 );
	} );
	element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 3 ).trigger( "click" );
	state( assert, element, 0, 0, 0, 1, 0 );

	// .toLowerCase() is needed to convert <P> to <p> in old IEs
	assert.equal( panel.html().toLowerCase(), "<p>testing</p>", "panel html after" );
} );

QUnit.test( "load", function( assert ) {
	var ready = assert.async();
	assert.expect( 21 );

	var tab, panelId, panel,
		element = $( "#tabs2" );

	// Init
	element.one( "tabsload", function( event, ui ) {
		tab = element.find( ".ui-tabs-nav li" ).eq( 2 );
		panelId = tab.attr( "aria-controls" );
		panel = $( "#" + panelId );

		assert.ok( !( "originalEvent" in event ), "originalEvent" );
		assert.equal( ui.tab.length, 1, "tab length" );
		assert.strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		assert.equal( ui.panel.length, 1, "panel length" );
		assert.strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		assert.equal( ui.panel.find( "p" ).length, 1, "panel html" );
		state( assert, element, 0, 0, 1, 0, 0 );
		tabsload1();
	} );
	element.tabs( { active: 2 } );

	function tabsload1() {

		// .option()
		element.one( "tabsload", function( event, ui ) {
			tab = element.find( ".ui-tabs-nav li" ).eq( 3 );
			panelId = tab.attr( "aria-controls" );
			panel = $( "#" + panelId );

			assert.ok( !( "originalEvent" in event ), "originalEvent" );
			assert.equal( ui.tab.length, 1, "tab length" );
			assert.strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
			assert.equal( ui.panel.length, 1, "panel length" );
			assert.strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
			assert.equal( ui.panel.find( "p" ).length, 1, "panel html" );
			state( assert, element, 0, 0, 0, 1, 0 );
			tabsload2();
		} );
		element.tabs( "option", "active", 3 );
	}

	function tabsload2() {

		// Click, change panel content
		element.one( "tabsload", function( event, ui ) {
			tab = element.find( ".ui-tabs-nav li" ).eq( 4 );
			panelId = tab.attr( "aria-controls" );
			panel = $( "#" + panelId );

			assert.equal( event.originalEvent.type, "click", "originalEvent" );
			assert.equal( ui.tab.length, 1, "tab length" );
			assert.strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
			assert.equal( ui.panel.length, 1, "panel length" );
			assert.strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
			assert.equal( ui.panel.find( "p" ).length, 1, "panel html" );
			state( assert, element, 0, 0, 0, 0, 1 );
			ready();
		} );
		element.find( ".ui-tabs-nav .ui-tabs-anchor" ).eq( 4 ).trigger( "click" );
	}
} );

} );
