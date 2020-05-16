define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/tabs"
], function( QUnit, $, helper, testHelper ) {

var state = testHelper.state;

QUnit.module( "tabs: core", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "markup structure", function( assert ) {
	assert.expect( 20 );
	var element = $( "#tabs1" ).tabs(),
		tabList = element.find( "ul, ol" ),
		tabs = tabList.find( "li" ),
		active = tabs.eq( 0 ),
		anchors = tabs.find( "a" ),
		panels = element.find( ".ui-tabs-panel" );

	assert.hasClasses( element, "ui-tabs ui-widget ui-widget-content" );
	assert.lacksClasses( element, "ui-tabs-collapsible" );
	assert.hasClasses( tabList, "ui-tabs-nav ui-widget-header" );
	assert.equal( tabList.length, 1, "The widget contains exactly one tab list" );
	assert.hasClasses( tabs[ 0 ], "ui-tabs-tab" );
	assert.hasClasses( tabs[ 1 ], "ui-tabs-tab" );
	assert.hasClasses( tabs[ 2 ], "ui-tabs-tab" );

	// DEPRECATED
	assert.hasClasses( tabs[ 0 ], "ui-tab" );
	assert.hasClasses( tabs[ 1 ], "ui-tab" );
	assert.hasClasses( tabs[ 2 ], "ui-tab" );

	assert.equal( tabs.length, 3, "There are exactly three tabs" );
	assert.hasClasses( anchors[ 0 ], "ui-tabs-anchor" );
	assert.hasClasses( anchors[ 1 ], "ui-tabs-anchor" );
	assert.hasClasses( anchors[ 2 ], "ui-tabs-anchor" );
	assert.equal( anchors.length, 3, "There are exactly 3 anchors" );
	assert.hasClasses( active, "ui-tabs-active" );
	assert.hasClasses( panels[ 0 ], "ui-tabs-panel ui-widget-content" );
	assert.hasClasses( panels[ 1 ], "ui-tabs-panel ui-widget-content" );
	assert.hasClasses( panels[ 2 ], "ui-tabs-panel ui-widget-content" );
	assert.equal( panels.length, 3, "There are exactly 3 tab panels" );
} );

$.each( {
	"deep ul": "#tabs3",
	"multiple lists, ul first": "#tabs4",
	"multiple lists, ol first": "#tabs5",
	"empty list": "#tabs6"
}, function( type, selector ) {
	QUnit.test( "markup structure: " + type, function( assert ) {
		assert.expect( 2 );
		var element = $( selector ).tabs();
		assert.hasClasses( element, "ui-tabs" );
		assert.hasClasses( $( selector + "-list" ), "ui-tabs-nav" );
	} );
} );

// #5893 - Sublist in the tab list are considered as tab
QUnit.test( "nested list", function( assert ) {
	assert.expect( 1 );

	var element = $( "#tabs6" ).tabs();
	assert.equal( element.tabs( "instance" ).anchors.length, 2, "should contain 2 tab" );
} );

QUnit.test( "disconnected from DOM", function( assert ) {
	assert.expect( 2 );

	var element = $( "#tabs1" ).remove().tabs();
	assert.equal( element.find( ".ui-tabs-nav" ).length, 1, "should initialize nav" );
	assert.equal( element.find( ".ui-tabs-panel" ).length, 3, "should initialize panels" );
} );

QUnit.test( "non-tab list items", function( assert ) {
	assert.expect( 2 );

	var element = $( "#tabs9" ).tabs();
	assert.equal( element.tabs( "option", "active" ), 0, "defaults to first tab" );
	assert.equal( element.find( ".ui-tabs-nav li.ui-state-active" ).index(), 1,
		"first actual tab is active" );
} );

QUnit.test( "aria-controls", function( assert ) {
	assert.expect( 7 );
	var element = $( "#tabs1" ).tabs(),
		tabs = element.find( ".ui-tabs-nav li" );
	tabs.each( function() {
		var tab = $( this ),
			anchor = tab.find( ".ui-tabs-anchor" );
		assert.equal( anchor.prop( "hash" ).substring( 1 ), tab.attr( "aria-controls" ) );
	} );

	element = $( "#tabs2" ).tabs();
	tabs = element.find( ".ui-tabs-nav li" );
	assert.equal( tabs.eq( 0 ).attr( "aria-controls" ), "colon:test" );
	assert.equal( tabs.eq( 1 ).attr( "aria-controls" ), "inline-style" );
	assert.ok( /^ui-id-\d+$/.test( tabs.eq( 2 ).attr( "aria-controls" ) ), "generated id" );
	assert.equal( tabs.eq( 3 ).attr( "aria-controls" ), "custom-id" );
} );

QUnit.test( "accessibility", function( assert ) {
	assert.expect( 46 );
	var element = $( "#tabs1" ).tabs( {
			active: 1,
			disabled: [ 2 ]
		} ),
		tabs = element.find( ".ui-tabs-nav li" ),
		anchors = tabs.find( ".ui-tabs-anchor" ),
		panels = element.find( ".ui-tabs-panel" );

	assert.equal( element.find( ".ui-tabs-nav" ).attr( "role" ), "tablist", "tablist role" );
	tabs.each( function( index ) {
		var tab = tabs.eq( index ),
			anchor = anchors.eq( index ),
			anchorId = anchor.attr( "id" ),
			panel = panels.eq( index );
		assert.equal( tab.attr( "role" ), "tab", "tab " + index + " role" );
		assert.equal( tab.attr( "aria-labelledby" ), anchorId, "tab " + index + " aria-labelledby" );
		assert.equal( anchor.attr( "tabindex" ), -1, "anchor " + index + " tabindex" );
		assert.equal( panel.attr( "role" ), "tabpanel", "panel " + index + " role" );
		assert.equal( panel.attr( "aria-labelledby" ), anchorId, "panel " + index + " aria-labelledby" );
	} );

	assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "true", "active tab has aria-selected=true" );
	assert.equal( tabs.eq( 1 ).attr( "tabindex" ), 0, "active tab has tabindex=0" );
	assert.equal( tabs.eq( 1 ).attr( "aria-disabled" ), null, "enabled tab does not have aria-disabled" );
	assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "true", "active tab has aria-expanded=true" );
	assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "false", "active panel has aria-hidden=false" );
	assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "false", "inactive tab has aria-selected=false" );
	assert.equal( tabs.eq( 0 ).attr( "tabindex" ), -1, "inactive tab has tabindex=-1" );
	assert.equal( tabs.eq( 0 ).attr( "aria-disabled" ), null, "enabled tab does not have aria-disabled" );
	assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "false", "inactive tab has aria-expanded=false" );
	assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "true", "inactive panel has aria-hidden=true" );
	assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "inactive tab has aria-selected=false" );
	assert.equal( tabs.eq( 2 ).attr( "tabindex" ), -1, "inactive tab has tabindex=-1" );
	assert.equal( tabs.eq( 2 ).attr( "aria-disabled" ), "true", "disabled tab has aria-disabled=true" );
	assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "inactive tab has aria-expanded=false" );
	assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "inactive panel has aria-hidden=true" );

	element.tabs( "option", "active", 0 );
	assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "active tab has aria-selected=true" );
	assert.equal( tabs.eq( 0 ).attr( "tabindex" ), 0, "active tab has tabindex=0" );
	assert.equal( tabs.eq( 0 ).attr( "aria-disabled" ), null, "enabled tab does not have aria-disabled" );
	assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "active tab has aria-expanded=true" );
	assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "active panel has aria-hidden=false" );
	assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "false", "inactive tab has aria-selected=false" );
	assert.equal( tabs.eq( 1 ).attr( "tabindex" ), -1, "inactive tab has tabindex=-1" );
	assert.equal( tabs.eq( 1 ).attr( "aria-disabled" ), null, "enabled tab does not have aria-disabled" );
	assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "false", "inactive tab has aria-expanded=false" );
	assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "true", "inactive panel has aria-hidden=true" );
	assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "inactive tab has aria-selected=false" );
	assert.equal( tabs.eq( 2 ).attr( "tabindex" ), -1, "inactive tab has tabindex=-1" );
	assert.equal( tabs.eq( 2 ).attr( "aria-disabled" ), "true", "disabled tab has aria-disabled=true" );
	assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "inactive tab has aria-expanded=false" );
	assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "inactive panel has aria-hidden=true" );
} );

QUnit.test( "accessibility - ajax", function( assert ) {
	var ready = assert.async();
	assert.expect( 6 );
	var element = $( "#tabs2" ).tabs(),
		tab = element.find( ".ui-tabs-nav li" ).eq( 3 ),
		panel = $( "#custom-id" );

	assert.equal( panel.attr( "aria-live" ), "polite", "remote panel has aria-live" );
	assert.equal( panel.attr( "aria-busy" ), null, "does not have aria-busy on init" );
	element.tabs( "option", "active", 3 );
	assert.hasClasses( tab, "ui-tabs-loading" );
	assert.equal( panel.attr( "aria-busy" ), "true", "panel has aria-busy during load" );
	element.one( "tabsload", function() {
		setTimeout( function() {
			assert.equal( panel.attr( "aria-busy" ), null, "panel does not have aria-busy after load" );
			assert.lacksClasses( tab, "ui-tabs-loading" );
			ready();
		}, 1 );
	} );
} );

QUnit.test( "keyboard support - LEFT, RIGHT, UP, DOWN, HOME, END, SPACE, ENTER", function( assert ) {
	var ready = assert.async();
	assert.expect( 92 );
	var element = $( "#tabs1" ).tabs( {
			collapsible: true
		} ),
		tabs = element.find( ".ui-tabs-nav li" ),
		panels = element.find( ".ui-tabs-panel" ),
		keyCode = $.ui.keyCode;

	element.tabs( "instance" ).delay = 1;

	assert.equal( tabs.filter( ".ui-state-focus" ).length, 0, "no tabs focused on init" );
	tabs.eq( 0 ).simulate( "focus" );

	// Down, right, down (wrap), up (wrap)
	function step1() {
		assert.hasClasses( tabs.eq( 0 ), "ui-state-focus", "first tab has focus" );
		assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
		assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );

		tabs.eq( 0 ).simulate( "keydown", { keyCode: keyCode.DOWN } );
		assert.hasClasses( tabs.eq( 1 ), "ui-state-focus", "DOWN moves focus to next tab" );
		assert.lacksClasses( tabs.eq( 0 ), "ui-state-focus", "first tab is no longer focused" );
		assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "true", "second tab has aria-selected=true" );
		assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "false", "first tab has aria-selected=false" );
		assert.ok( panels.eq( 1 ).is( ":hidden" ), "second panel is still hidden" );
		assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "false", "second tab has aria-expanded=false" );
		assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "true", "second panel has aria-hidden=true" );
		assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

		tabs.eq( 1 ).simulate( "keydown", { keyCode: keyCode.RIGHT } );
		assert.hasClasses( tabs.eq( 2 ), "ui-state-focus", "RIGHT moves focus to next tab" );
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "true", "third tab has aria-selected=true" );
		assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "false", "second tab has aria-selected=false" );
		assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is still hidden" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );
		assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

		tabs.eq( 2 ).simulate( "keydown", { keyCode: keyCode.DOWN } );
		assert.hasClasses( tabs.eq( 0 ), "ui-state-focus", "DOWN wraps focus to first tab" );
		assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "third tab has aria-selected=false" );
		assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

		tabs.eq( 0 ).simulate( "keydown", { keyCode: keyCode.UP } );
		assert.hasClasses( tabs.eq( 2 ), "ui-state-focus", "UP wraps focus to last tab" );
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "true", "third tab has aria-selected=true" );
		assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "false", "first tab has aria-selected=false" );
		assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is still hidden" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );
		assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

		setTimeout( step2, 25 );
	}

	// Left, home, space
	function step2() {
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "true", "third tab has aria-selected=true" );
		assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "false", "first tab has aria-selected=false" );
		assert.ok( panels.eq( 2 ).is( ":visible" ), "third panel is visible" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "true", "third tab has aria-expanded=true" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "false", "third panel has aria-hidden=false" );
		assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel is hidden" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "false", "first tab has aria-expanded=false" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "true", "first panel has aria-hidden=true" );

		tabs.eq( 2 ).simulate( "keydown", { keyCode: keyCode.LEFT } );
		assert.hasClasses( tabs.eq( 1 ), "ui-state-focus", "LEFT moves focus to previous tab" );
		assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "true", "second tab has aria-selected=true" );
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "third tab has aria-selected=false" );
		assert.ok( panels.eq( 1 ).is( ":hidden" ), "second panel is still hidden" );
		assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "false", "second tab has aria-expanded=false" );
		assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "true", "second panel has aria-hidden=true" );
		assert.ok( panels.eq( 2 ).is( ":visible" ), "third panel is still visible" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "true", "third tab has aria-expanded=true" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "false", "third panel has aria-hidden=false" );

		tabs.eq( 1 ).simulate( "keydown", { keyCode: keyCode.HOME } );
		assert.hasClasses( tabs.eq( 0 ), "ui-state-focus", "HOME moves focus to first tab" );
		assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
		assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "false", "second tab has aria-selected=false" );
		assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel is still hidden" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "false", "first tab has aria-expanded=false" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "true", "first panel has aria-hidden=true" );
		assert.ok( panels.eq( 2 ).is( ":visible" ), "third panel is still visible" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "true", "third tab has aria-expanded=true" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "false", "third panel has aria-hidden=false" );

		// SPACE activates, cancels delay
		tabs.eq( 0 ).simulate( "keydown", { keyCode: keyCode.SPACE } );
		setTimeout( step3 );
	}

	// End, enter
	function step3() {
		assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "third tab has aria-selected=false" );
		assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tabs has aria-expanded=true" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );
		assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is hidden" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );

		tabs.eq( 0 ).simulate( "keydown", { keyCode: keyCode.END } );
		assert.hasClasses( tabs.eq( 2 ), "ui-state-focus", "END moves focus to last tab" );
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "true", "third tab has aria-selected=true" );
		assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "false", "first tab has aria-selected=false" );
		assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is still hidden" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );
		assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tabs has aria-expanded=true" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

		// ENTER activates, cancels delay
		tabs.eq( 0 ).simulate( "keydown", { keyCode: keyCode.ENTER } );
		setTimeout( step4 );
	}

	// Enter (collapse)
	function step4() {
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "true", "third tab has aria-selected=true" );
		assert.ok( panels.eq( 2 ).is( ":visible" ), "third panel is visible" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "true", "third tab has aria-expanded=true" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "false", "third panel has aria-hidden=false" );
		assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel is hidden" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "false", "first tab has aria-expanded=false" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "true", "first panel has aria-hidden=true" );

		// ENTER collapses if active
		tabs.eq( 2 ).simulate( "keydown", { keyCode: keyCode.ENTER } );
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "third tab has aria-selected=false" );
		assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is hidden" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );

		setTimeout( ready );
	}

	setTimeout( step1 );
} );

// Navigation with CTRL and COMMAND (both behave the same)
$.each( {
	ctrl: "CTRL",
	meta: "COMMAND"
}, function( modifier, label ) {
	QUnit.test( "keyboard support - " + label + " navigation", function( assert ) {
		var ready = assert.async();
		assert.expect( 115 );
		var element = $( "#tabs1" ).tabs(),
			tabs = element.find( ".ui-tabs-nav li" ),
			panels = element.find( ".ui-tabs-panel" ),
			keyCode = $.ui.keyCode;

		element.tabs( "instance" ).delay = 1;

		assert.equal( tabs.filter( ".ui-state-focus" ).length, 0, "no tabs focused on init" );
		tabs.eq( 0 ).simulate( "focus" );

		// Down
		function step1() {
			var eventProperties = { keyCode: keyCode.DOWN };
			eventProperties[ modifier + "Key" ] = true;

			assert.hasClasses( tabs.eq( 0 ), "ui-state-focus", "first tab has focus" );
			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );

			tabs.eq( 0 ).simulate( "keydown", eventProperties );
			assert.hasClasses( tabs.eq( 1 ), "ui-state-focus", "DOWN moves focus to next tab" );
			assert.lacksClasses( tabs.eq( 0 ), ".ui-state-focus", "first tab is no longer focused" );
			assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "false", "second tab has aria-selected=false" );
			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 1 ).is( ":hidden" ), "second panel is still hidden" );
			assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "false", "second tab has aria-expanded=false" );
			assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "true", "second panel has aria-hidden=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

			setTimeout( step2, 25 );
		}

		// Right
		function step2() {
			var eventProperties = { keyCode: keyCode.RIGHT };
			eventProperties[ modifier + "Key" ] = true;

			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );
			assert.ok( panels.eq( 1 ).is( ":hidden" ), "second panel is hidden" );
			assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "false", "second tab has aria-expanded=false" );
			assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "true", "second panel has aria-hidden=true" );

			tabs.eq( 1 ).simulate( "keydown", eventProperties );
			assert.hasClasses( tabs.eq( 2 ), "ui-state-focus", "RIGHT moves focus to next tab" );
			assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "third tab has aria-selected=false" );
			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is still hidden" );
			assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
			assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

			setTimeout( step3, 25 );
		}

		// Down (wrap)
		function step3() {
			var eventProperties = { keyCode: keyCode.DOWN };
			eventProperties[ modifier + "Key" ] = true;

			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );
			assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is hidden" );
			assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
			assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );

			tabs.eq( 2 ).simulate( "keydown", eventProperties );
			assert.hasClasses( tabs.eq( 0 ), "ui-state-focus", "DOWN wraps focus to first tab" );
			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

			setTimeout( step4, 25 );
		}

		// Up (wrap)
		function step4() {
			var eventProperties = { keyCode: keyCode.UP };
			eventProperties[ modifier + "Key" ] = true;

			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

			tabs.eq( 0 ).simulate( "keydown", eventProperties );
			assert.hasClasses( tabs.eq( 2 ), "ui-state-focus", "UP wraps focus to last tab" );
			assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "third tab has aria-selected=false" );
			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is still hidden" );
			assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
			assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

			setTimeout( step5, 25 );
		}

		// Left
		function step5() {
			var eventProperties = { keyCode: keyCode.LEFT };
			eventProperties[ modifier + "Key" ] = true;

			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );
			assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is hidden" );
			assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
			assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );

			tabs.eq( 2 ).simulate( "keydown", eventProperties );
			assert.hasClasses( tabs.eq( 1 ), "ui-state-focus", "LEFT moves focus to previous tab" );
			assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "false", "second tab has aria-selected=false" );
			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 1 ).is( ":hidden" ), "second panel is still hidden" );
			assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "false", "second tab has aria-expanded=false" );
			assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "true", "second panel has aria-hidden=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

			setTimeout( step6, 25 );
		}

		// Home
		function step6() {
			var eventProperties = { keyCode: keyCode.HOME };
			eventProperties[ modifier + "Key" ] = true;

			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );
			assert.ok( panels.eq( 1 ).is( ":hidden" ), "second panel is hidden" );
			assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "false", "second tab has aria-expanded=false" );
			assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "true", "second panel has aria-hidden=true" );

			tabs.eq( 1 ).simulate( "keydown", eventProperties );
			assert.hasClasses( tabs.eq( 0 ), "ui-state-focus", "HOME moves focus to first tab" );
			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "false", "second tab has aria-selected=false" );
			assert.ok( panels.eq( 1 ).is( ":hidden" ), "second panel is still hidden" );
			assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "false", "second tab has aria-expanded=false" );
			assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "true", "second panel has aria-hidden=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

			setTimeout( step7, 25 );
		}

		// End
		function step7() {
			var eventProperties = { keyCode: keyCode.END };
			eventProperties[ modifier + "Key" ] = true;

			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

			tabs.eq( 0 ).simulate( "keydown", eventProperties );
			assert.hasClasses( tabs.eq( 2 ), "ui-state-focus", "END moves focus to last tab" );
			assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "third tab has aria-selected=false" );
			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is still hidden" );
			assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
			assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is still visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );

			setTimeout( step8, 25 );
		}

		// Space
		function step8() {
			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
			assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );
			assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is hidden" );
			assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
			assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );

			tabs.eq( 2 ).simulate( "keydown", { keyCode: keyCode.SPACE } );
			assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "true", "third tab has aria-selected=true" );
			assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "false", "first tab has aria-selected=false" );
			assert.ok( panels.eq( 2 ).is( ":visible" ), "third panel is visible" );
			assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "true", "third tab has aria-expanded=true" );
			assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "false", "third panel has aria-hidden=false" );
			assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel is hidden" );
			assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "false", "first tab has aria-expanded=false" );
			assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "true", "first panel has aria-hidden=true" );

			setTimeout( ready );
		}

		setTimeout( step1 );
	} );
} );

QUnit.test( "keyboard support - CTRL+UP, ALT+PAGE_DOWN, ALT+PAGE_UP", function( assert ) {
	var ready = assert.async();
	assert.expect( 50 );
	var element = $( "#tabs1" ).tabs(),
		tabs = element.find( ".ui-tabs-nav li" ),
		panels = element.find( ".ui-tabs-panel" ),
		keyCode = $.ui.keyCode;

	assert.equal( tabs.filter( ".ui-state-focus" ).length, 0, "no tabs focused on init" );
	panels.attr( "tabindex", -1 );
	panels.eq( 0 ).simulate( "focus" );

	function step1() {
		assert.strictEqual( document.activeElement, panels[ 0 ], "first panel is activeElement" );

		panels.eq( 0 ).simulate( "keydown", { keyCode: keyCode.PAGE_DOWN, altKey: true } );
		assert.strictEqual( document.activeElement, tabs[ 1 ], "second tab is activeElement" );
		assert.hasClasses( tabs.eq( 1 ), "ui-state-focus", "ALT+PAGE_DOWN moves focus to next tab" );
		assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "true", "second tab has aria-selected=true" );
		assert.ok( panels.eq( 1 ).is( ":visible" ), "second panel is visible" );
		assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "true", "second tab has aria-expanded=true" );
		assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "false", "second panel has aria-hidden=false" );
		assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel is hidden" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "false", "first tab has aria-expanded=false" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "true", "first panel has aria-hidden=true" );

		tabs.eq( 1 ).simulate( "keydown", { keyCode: keyCode.PAGE_DOWN, altKey: true } );
		assert.strictEqual( document.activeElement, tabs[ 2 ], "third tab is activeElement" );
		assert.hasClasses( tabs.eq( 2 ), "ui-state-focus", "ALT+PAGE_DOWN moves focus to next tab" );
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "true", "third tab has aria-selected=true" );
		assert.ok( panels.eq( 2 ).is( ":visible" ), "third panel is visible" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "true", "third tab has aria-expanded=true" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "false", "third panel has aria-hidden=false" );
		assert.ok( panels.eq( 1 ).is( ":hidden" ), "second panel is hidden" );
		assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "false", "second tab has aria-expanded=false" );
		assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "true", "second panel has aria-hidden=true" );

		tabs.eq( 2 ).simulate( "keydown", { keyCode: keyCode.PAGE_DOWN, altKey: true } );
		assert.strictEqual( document.activeElement, tabs[ 0 ], "first tab is activeElement" );
		assert.hasClasses( tabs.eq( 0 ), "ui-state-focus", "ALT+PAGE_DOWN wraps focus to first tab" );
		assert.equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "first tab has aria-selected=true" );
		assert.ok( panels.eq( 0 ).is( ":visible" ), "first panel is visible" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "true", "first tab has aria-expanded=true" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "first panel has aria-hidden=false" );
		assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is hidden" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );

		panels.eq( 0 ).simulate( "focus" );
		setTimeout( step2 );
	}

	function step2() {
		assert.strictEqual( document.activeElement, panels[ 0 ], "first panel is activeElement" );

		panels.eq( 0 ).simulate( "keydown", { keyCode: keyCode.PAGE_UP, altKey: true } );
		assert.strictEqual( document.activeElement, tabs[ 2 ], "third tab is activeElement" );
		assert.hasClasses( tabs.eq( 2 ), "ui-state-focus", "ALT+PAGE_UP wraps focus to last tab" );
		assert.equal( tabs.eq( 2 ).attr( "aria-selected" ), "true", "third tab has aria-selected=true" );
		assert.ok( panels.eq( 2 ).is( ":visible" ), "third panel is visible" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "true", "third tab has aria-expanded=true" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "false", "third panel has aria-hidden=false" );
		assert.ok( panels.eq( 0 ).is( ":hidden" ), "first panel is hidden" );
		assert.equal( tabs.eq( 0 ).attr( "aria-expanded" ), "false", "first tab has aria-expanded=false" );
		assert.equal( panels.eq( 0 ).attr( "aria-hidden" ), "true", "first panel has aria-hidden=true" );

		tabs.eq( 2 ).simulate( "keydown", { keyCode: keyCode.PAGE_UP, altKey: true } );
		assert.strictEqual( document.activeElement, tabs[ 1 ], "second tab is activeElement" );
		assert.hasClasses( tabs.eq( 1 ), "ui-state-focus", "ALT+PAGE_UP moves focus to previous tab" );
		assert.equal( tabs.eq( 1 ).attr( "aria-selected" ), "true", "second tab has aria-selected=true" );
		assert.ok( panels.eq( 1 ).is( ":visible" ), "second panel is visible" );
		assert.equal( tabs.eq( 1 ).attr( "aria-expanded" ), "true", "second tab has aria-expanded=true" );
		assert.equal( panels.eq( 1 ).attr( "aria-hidden" ), "false", "second panel has aria-hidden=false" );
		assert.ok( panels.eq( 2 ).is( ":hidden" ), "third panel is hidden" );
		assert.equal( tabs.eq( 2 ).attr( "aria-expanded" ), "false", "third tab has aria-expanded=false" );
		assert.equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "third panel has aria-hidden=true" );

		panels.eq( 1 ).simulate( "focus" );
		setTimeout( step3 );
	}

	function step3() {
		assert.strictEqual( document.activeElement, panels[ 1 ], "second panel is activeElement" );

		panels.eq( 1 ).simulate( "keydown", { keyCode: keyCode.UP, ctrlKey: true } );
		assert.strictEqual( document.activeElement, tabs[ 1 ], "second tab is activeElement" );

		setTimeout( ready );
	}

	setTimeout( step1 );
} );

QUnit.test( "#4033 - IE expands hash to full url and misinterprets tab as ajax", function( assert ) {
	assert.expect( 2 );

	var element = $( "<div><ul><li><a href='#tab'>Tab</a></li></ul><div id='tab'></div></div>" );
	element.appendTo( "#qunit-fixture" );
	element.tabs( {
		beforeLoad: function() {
			event.preventDefault();
			assert.ok( false, "should not be an ajax tab" );
		}
	} );

	assert.equal( element.find( ".ui-tabs-nav li" ).attr( "aria-controls" ), "tab", "aria-contorls attribute is correct" );
	state( assert, element, 1 );
} );

} );
