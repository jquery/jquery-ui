(function( $ ) {

var state = TestHelpers.tabs.state;

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
	equal( element.data( "tabs" ).anchors.length, 2, "should contain 2 tab" );
});

test( "disconnected from DOM", function() {
	expect( 2 );

	var element = $( "#tabs1" ).remove().tabs();
	equal( element.find( ".ui-tabs-nav" ).length, 1, "should initialize nav" );
	equal( element.find( ".ui-tabs-panel" ).length, 3, "should initialize panels" );
});

test( "aria-controls", function() {
	expect( 7 );
	var element = $( "#tabs1" ).tabs(),
		tabs = element.find( ".ui-tabs-nav li" );
	tabs.each(function() {
		var tab = $( this ),
			anchor = tab.find( ".ui-tabs-anchor" );
		equal( anchor.prop( "hash" ).substring( 1 ), tab.attr( "aria-controls" ) );
	});

	element = $( "#tabs2" ).tabs();
	tabs = element.find( ".ui-tabs-nav li" );
	equal( tabs.eq( 0 ).attr( "aria-controls" ), "colon:test" );
	equal( tabs.eq( 1 ).attr( "aria-controls" ), "inline-style" );
	ok( /^ui-tabs-\d+$/.test( tabs.eq( 2 ).attr( "aria-controls" ) ), "generated id" );
	equal( tabs.eq( 3 ).attr( "aria-controls" ), "custom-id" );
});

test( "accessibility", function() {
	expect( 49 );
	var element = $( "#tabs1" ).tabs({
			active: 1,
			disabled: [ 2 ]
		}),
		tabs = element.find( ".ui-tabs-nav li" ),
		anchors = tabs.find( ".ui-tabs-anchor" ),
		panels = element.find( ".ui-tabs-panel" );

	equal( element.find( ".ui-tabs-nav" ).attr( "role" ), "tablist", "tablist role" );
	tabs.each(function( index ) {
		var tab = tabs.eq( index ),
			anchor = anchors.eq( index ),
			anchorId = anchor.attr( "id" ),
			panel = panels.eq( index );
		equal( tab.attr( "role" ), "tab", "tab " + index + " role" );
		equal( tab.attr( "aria-labelledby" ), anchorId, "tab " + index + " aria-labelledby" );
		equal( anchor.attr( "role" ), "presentation", "anchor " + index + " role" );
		equal( anchor.attr( "tabindex" ), -1, "anchor " + index + " tabindex" );
		equal( panel.attr( "role" ), "tabpanel", "panel " + index + " role" );
		equal( panel.attr( "aria-labelledby" ), anchorId, "panel " + index + " aria-labelledby" );
	});

	equal( tabs.eq( 1 ).attr( "aria-selected" ), "true", "active tab has aria-selected=true" );
	equal( tabs.eq( 1 ).attr( "tabindex" ), 0, "active tab has tabindex=0" );
	equal( tabs.eq( 1 ).attr( "aria-disabled" ), null, "enabled tab does not have aria-disabled" );
	equal( panels.eq( 1 ).attr( "aria-expanded" ), "true", "active panel has aria-expanded=true" );
	equal( panels.eq( 1 ).attr( "aria-hidden" ), "false", "active panel has aria-hidden=false" );
	equal( tabs.eq( 0 ).attr( "aria-selected" ), "false", "inactive tab has aria-selected=false" );
	equal( tabs.eq( 0 ).attr( "tabindex" ), -1, "inactive tab has tabindex=-1" );
	equal( tabs.eq( 0 ).attr( "aria-disabled" ), null, "enabled tab does not have aria-disabled" );
	equal( panels.eq( 0 ).attr( "aria-expanded" ), "false", "inactive panel has aria-expanded=false" );
	equal( panels.eq( 0 ).attr( "aria-hidden" ), "true", "inactive panel has aria-hidden=true" );
	equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "inactive tab has aria-selected=false" );
	equal( tabs.eq( 2 ).attr( "tabindex" ), -1, "inactive tab has tabindex=-1" );
	equal( tabs.eq( 2 ).attr( "aria-disabled" ), "true", "disabled tab has aria-disabled=true" );
	equal( panels.eq( 2 ).attr( "aria-expanded" ), "false", "inactive panel has aria-expanded=false" );
	equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "inactive panel has aria-hidden=true" );

	element.tabs( "option", "active", 0 );
	equal( tabs.eq( 0 ).attr( "aria-selected" ), "true", "active tab has aria-selected=true" );
	equal( tabs.eq( 0 ).attr( "tabindex" ), 0, "active tab has tabindex=0" );
	equal( tabs.eq( 0 ).attr( "aria-disabled" ), null, "enabled tab does not have aria-disabled" );
	equal( panels.eq( 0 ).attr( "aria-expanded" ), "true", "active panel has aria-expanded=true" );
	equal( panels.eq( 0 ).attr( "aria-hidden" ), "false", "active panel has aria-hidden=false" );
	equal( tabs.eq( 1 ).attr( "aria-selected" ), "false", "inactive tab has aria-selected=false" );
	equal( tabs.eq( 1 ).attr( "tabindex" ), -1, "inactive tab has tabindex=-1" );
	equal( tabs.eq( 1 ).attr( "aria-disabled" ), null, "enabled tab does not have aria-disabled" );
	equal( panels.eq( 1 ).attr( "aria-expanded" ), "false", "inactive panel has aria-expanded=false" );
	equal( panels.eq( 1 ).attr( "aria-hidden" ), "true", "inactive panel has aria-hidden=true" );
	equal( tabs.eq( 2 ).attr( "aria-selected" ), "false", "inactive tab has aria-selected=false" );
	equal( tabs.eq( 2 ).attr( "tabindex" ), -1, "inactive tab has tabindex=-1" );
	equal( tabs.eq( 2 ).attr( "aria-disabled" ), "true", "disabled tab has aria-disabled=true" );
	equal( panels.eq( 2 ).attr( "aria-expanded" ), "false", "inactive panel has aria-expanded=false" );
	equal( panels.eq( 2 ).attr( "aria-hidden" ), "true", "inactive panel has aria-hidden=true" );

	// TODO: aria-live and aria-busy tests for ajax tabs
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
			ok( false, "should not be an ajax tab" );
		}
	});

	equal( element.find( ".ui-tabs-nav li" ).attr( "aria-controls" ), "tab", "aria-contorls attribute is correct" );
	state( element, 1 );
});

}( jQuery ) );
