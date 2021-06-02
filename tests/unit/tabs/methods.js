define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/tabs"
], function( QUnit, $, helper, testHelper ) {
"use strict";

var disabled = testHelper.disabled,
	state = testHelper.state;

QUnit.module( "tabs: methods", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 2 );
	assert.domEqual( "#tabs1", function() {
		$( "#tabs1" ).tabs().tabs( "destroy" );
	} );
	assert.domEqual( "#tabs2", function() {
		$( "#tabs2" ).tabs().tabs( "destroy" );
	} );
} );

QUnit.test( "destroy - ajax", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	assert.domEqual( "#tabs2", function( done ) {
		var element = $( "#tabs2" ).tabs( {
			load: function() {
				setTimeout( function() {
					element.tabs( "destroy" );
					done();
					ready();
				} );
			}
		} );
		element.tabs( "option", "active", 2 );
	} );
} );

QUnit.test( "enable", function( assert ) {
	assert.expect( 8 );

	var element = $( "#tabs1" ).tabs( { disabled: true } );
	disabled( assert, element, true );
	element.tabs( "enable" );
	disabled( assert, element, false );
	element.tabs( "destroy" );

	element.tabs( { disabled: [ 0, 1 ] } );
	disabled( assert, element, [ 0, 1 ] );
	element.tabs( "enable" );
	disabled( assert, element, false );
} );

QUnit.test( "enable( index )", function( assert ) {
	assert.expect( 10 );

	var element = $( "#tabs1" ).tabs( { disabled: true } );
	disabled( assert, element, true );

	// fully disabled -> partially disabled
	element.tabs( "enable", 1 );
	disabled( assert, element, [ 0, 2 ] );

	// partially disabled -> partially disabled
	element.tabs( "enable", 2 );
	disabled( assert, element, [ 0 ] );

	// already enabled tab, no change
	element.tabs( "enable", 2 );
	disabled( assert, element, [ 0 ] );

	// partially disabled -> fully enabled
	element.tabs( "enable", 0 );
	disabled( assert, element, false );
} );

QUnit.test( "disable", function( assert ) {
	assert.expect( 8 );

	var element = $( "#tabs1" ).tabs( { disabled: false } );
	disabled( assert, element, false );
	element.tabs( "disable" );
	disabled( assert, element, true );
	element.tabs( "destroy" );

	element.tabs( { disabled: [ 0, 1 ] } );
	disabled( assert, element, [ 0, 1 ] );
	element.tabs( "disable" );
	disabled( assert, element, true );
} );

QUnit.test( "disable( index )", function( assert ) {
	assert.expect( 10 );

	var element = $( "#tabs1" ).tabs( { disabled: false } );
	disabled( assert, element, false );

	// fully enabled -> partially disabled
	element.tabs( "disable", 1 );
	disabled( assert, element, [ 1 ] );

	// partially disabled -> partially disabled
	element.tabs( "disable", 2 );
	disabled( assert, element, [ 1, 2 ] );

	// already disabled tab, no change
	element.tabs( "disable", 2 );
	disabled( assert, element, [ 1, 2 ] );

	// partially disabled -> fully disabled
	element.tabs( "disable", 0 );
	disabled( assert, element, true );
} );

QUnit.test( "refresh", function( assert ) {
	assert.expect( 27 );

	var element = $( "#tabs1" ).tabs();
	state( assert, element, 1, 0, 0 );
	disabled( assert, element, false );

	// Disable tab via markup
	element.find( ".ui-tabs-nav li" ).eq( 1 ).addClass( "ui-state-disabled" );
	element.tabs( "refresh" );
	state( assert, element, 1, 0, 0 );
	disabled( assert, element, [ 1 ] );

	// Add remote tab
	element.find( ".ui-tabs-nav" ).append( "<li id='newTab'><a href='data/test.html'>new</a></li>" );
	element.tabs( "refresh" );
	state( assert, element, 1, 0, 0, 0 );
	disabled( assert, element, [ 1 ] );
	assert.equal( element.find( "#" + $( "#newTab" ).attr( "aria-controls" ) ).length, 1,
		"panel added for remote tab" );

	// Remove all tabs
	element.find( ".ui-tabs-nav li, .ui-tabs-panel" ).remove();
	element.tabs( "refresh" );
	state( assert, element );
	assert.equal( element.tabs( "option", "active" ), false, "no active tab" );

	// Add tabs
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
	state( assert, element, 0, 0, 0, 0 );
	disabled( assert, element, [ 0 ] );

	// Activate third tab
	element.tabs( "option", "active", 2 );
	state( assert, element, 0, 0, 1, 0 );
	disabled( assert, element, [ 0 ] );

	// Remove fourth tab, third tab should stay active
	element.find( ".ui-tabs-nav li" ).eq( 3 ).remove();
	element.find( ".ui-tabs-panel" ).eq( 3 ).remove();
	element.tabs( "refresh" );
	state( assert, element, 0, 0, 1 );
	disabled( assert, element, [ 0 ] );

	// Remove third (active) tab, second tab should become active
	element.find( ".ui-tabs-nav li" ).eq( 2 ).remove();
	element.find( ".ui-tabs-panel" ).eq( 2 ).remove();
	element.tabs( "refresh" );
	state( assert, element, 0, 1 );
	disabled( assert, element, [ 0 ] );

	// Remove first tab, previously active tab (now first) should stay active
	element.find( ".ui-tabs-nav li" ).eq( 0 ).remove();
	element.find( ".ui-tabs-panel" ).eq( 0 ).remove();
	element.tabs( "refresh" );
	state( assert, element, 1 );
	disabled( assert, element, false );
} );

QUnit.test( "refresh - looping", function( assert ) {
	assert.expect( 6 );

	var element = $( "#tabs1" ).tabs( {
		disabled: [ 0 ],
		active: 1
	} );
	state( assert, element, 0, 1, 0 );
	disabled( assert, element, [ 0 ] );

	// Remove active, jump to previous
	// previous is disabled, just back one more
	// reached first tab, move to end
	// activate last tab
	element.find( ".ui-tabs-nav li" ).eq( 2 ).remove();
	element.tabs( "refresh" );
	state( assert, element, 0, 1 );
	disabled( assert, element, [ 0 ] );
} );

QUnit.test( "load", function( assert ) {
	var ready = assert.async();
	assert.expect( 30 );

	var element = $( "#tabs2" ).tabs();

	// Load content of inactive tab
	// useful for preloading content with custom caching
	element.one( "tabsbeforeload", function( event, ui ) {
		var tab = element.find( ".ui-tabs-nav li" ).eq( 3 ),
			panelId = tab.attr( "aria-controls" ),
			panel = $( "#" + panelId );

		assert.ok( !( "originalEvent" in event ), "originalEvent" );
		assert.equal( ui.tab.length, 1, "tab length" );
		assert.strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
		assert.equal( ui.panel.length, 1, "panel length" );
		assert.strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
		state( assert, element, 1, 0, 0, 0, 0 );
	} );
	element.one( "tabsload", function( event, ui ) {

		// TODO: remove wrapping in 2.0
		var uiTab = $( ui.tab ),
			uiPanel = $( ui.panel ),
			tab = element.find( ".ui-tabs-nav li" ).eq( 3 ),
			panelId = tab.attr( "aria-controls" ),
			panel = $( "#" + panelId );

		assert.ok( !( "originalEvent" in event ), "originalEvent" );
		assert.equal( uiTab.length, 1, "tab length" );
		assert.strictEqual( uiTab[ 0 ], tab[ 0 ], "tab" );
		assert.equal( uiPanel.length, 1, "panel length" );
		assert.strictEqual( uiPanel[ 0 ], panel[ 0 ], "panel" );
		assert.equal( uiPanel.find( "p" ).length, 1, "panel html" );
		state( assert, element, 1, 0, 0, 0, 0 );
		setTimeout( tabsload1 );
	} );
	element.tabs( "load", 3 );
	state( assert, element, 1, 0, 0, 0, 0 );

	function tabsload1() {

		// no need to test details of event (tested in events tests)
		element.one( "tabsbeforeload", function() {
			assert.ok( true, "tabsbeforeload invoked" );
		} );
		element.one( "tabsload", function() {
			assert.ok( true, "tabsload invoked" );
			setTimeout( tabsload2 );
		} );
		element.tabs( "option", "active", 3 );
		state( assert, element, 0, 0, 0, 1, 0 );
	}

	function tabsload2() {

		// reload content of active tab
		element.one( "tabsbeforeload", function( event, ui ) {
			var tab = element.find( ".ui-tabs-nav li" ).eq( 3 ),
				panelId = tab.attr( "aria-controls" ),
				panel = $( "#" + panelId );

			assert.ok( !( "originalEvent" in event ), "originalEvent" );
			assert.equal( ui.tab.length, 1, "tab length" );
			assert.strictEqual( ui.tab[ 0 ], tab[ 0 ], "tab" );
			assert.equal( ui.panel.length, 1, "panel length" );
			assert.strictEqual( ui.panel[ 0 ], panel[ 0 ], "panel" );
			state( assert, element, 0, 0, 0, 1, 0 );
		} );
		element.one( "tabsload", function( event, ui ) {

			// TODO: remove wrapping in 2.0
			var uiTab = $( ui.tab ),
				uiPanel = $( ui.panel ),
				tab = element.find( ".ui-tabs-nav li" ).eq( 3 ),
				panelId = tab.attr( "aria-controls" ),
				panel = $( "#" + panelId );

			assert.ok( !( "originalEvent" in event ), "originalEvent" );
			assert.equal( uiTab.length, 1, "tab length" );
			assert.strictEqual( uiTab[ 0 ], tab[ 0 ], "tab" );
			assert.equal( uiPanel.length, 1, "panel length" );
			assert.strictEqual( uiPanel[ 0 ], panel[ 0 ], "panel" );
			state( assert, element, 0, 0, 0, 1, 0 );
			ready();
		} );
		element.tabs( "load", 3 );
		state( assert, element, 0, 0, 0, 1, 0 );
	}
} );

QUnit.test( "widget", function( assert ) {
	assert.expect( 2 );
	var element = $( "#tabs1" ).tabs(),
		widgetElement = element.tabs( "widget" );
	assert.equal( widgetElement.length, 1, "one element" );
	assert.strictEqual( widgetElement[ 0 ], element[ 0 ], "same element" );
} );

} );
