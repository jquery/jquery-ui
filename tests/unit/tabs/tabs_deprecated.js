(function( $ ) {

var state = TestHelpers.tabs.state;

module( "tabs (deprecated): core" );

test( "panel ids", function() {
	expect( 2 );

	var element = $( "#tabs2" ).tabs();

	element.one( "tabsbeforeload", function( event, ui ) {
		equal( ui.panel.attr( "id" ), "∫ßáö_Սե", "from title attribute" );
		event.preventDefault();
	});
	element.tabs( "option", "active", 4 );

	element.one( "tabsbeforeload", function( event, ui ) {
		ok( /^ui-tabs-\d+$/.test( ui.panel.attr( "id" ) ), "generated id" );
		event.preventDefault();
	});
	element.tabs( "option", "active", 2 );
});

module( "tabs (deprecated): options" );

test( "idPrefix", function() {
	expect( 1 );

	$( "#tabs2" )
		.one( "tabsbeforeload", function( event, ui ) {
			ok( /^testing-\d+$/.test( ui.panel.attr( "id" ) ), "generated id" );
			event.preventDefault();
		})
		.tabs({
			idPrefix: "testing-",
			active: 2
		});
});

test( "tabTemplate + panelTemplate", function() {
	// defaults are tested in the add method test
	expect( 11 );

	var tab, anchor,
		element = $( "#tabs2" ).tabs({
			tabTemplate: "<li class='customTab'><a href='http://example.com/#{href}'>#{label}</a></li>",
			panelTemplate: "<div class='customPanel'></div>"
		});
	element.one( "tabsadd", function( event, ui ) {
		var anchor = $( ui.tab );
		equal( ui.index, 5, "ui.index" );
		equal( anchor.text(), "New", "ui.tab" );
		equal( anchor.attr( "href" ), "http://example.com/#new", "tab href" );
		ok( anchor.parent().hasClass( "customTab" ), "tab custom class" );
		equal( ui.panel.id, "new", "ui.panel" );
		ok( $( ui.panel ).hasClass( "customPanel" ), "panel custom class" );
	});
	element.tabs( "add", "#new", "New" );
	tab = element.find( ".ui-tabs-nav li" ).last();
	anchor = tab.find( ".ui-tabs-anchor" );
	equal( tab.text(), "New", "label" );
	ok( tab.hasClass( "customTab" ), "tab custom class" );
	equal( anchor.attr( "href" ), "http://example.com/#new", "href" );
	equal( tab.attr( "aria-controls" ), "new", "aria-controls" );
	ok( element.find( "#new" ).hasClass( "customPanel" ), "panel custom class" );
});

module( "tabs (deprecated): methods" );

test( "add", function() {
	expect( 28 );

	var tab, anchor,
		element = $( "#tabs1" ).tabs();

	function stripLeadingSlash( str ) {
		return str.substr( str.charAt( 0 ) === "/" ? 1 : 0 );
	}

	state( element, 1, 0, 0 );

	// add without index
	element.one( "tabsadd", function( event, ui ) {
		equal( ui.index, 3, "ui.index" );
		equal( $( ui.tab ).text(), "New", "ui.tab" );
		equal( ui.panel.id, "new", "ui.panel" );
	});
	element.tabs( "add", "#new", "New" );
	state( element, 1, 0, 0, 0 );
	tab = element.find( ".ui-tabs-nav li" ).last();
	anchor = tab.find( ".ui-tabs-anchor" );
	equal( tab.text(), "New", "label" );
	equal( stripLeadingSlash( anchor[0].pathname ), stripLeadingSlash( location.pathname ), "href pathname" );
	equal( anchor[0].hash, "#new", "href hash" );
	equal( tab.attr( "aria-controls" ), "new", "aria-controls" );
	ok( !tab.hasClass( "ui-state-hover" ), "not hovered" );
	anchor.simulate( "mouseover" );
	ok( tab.hasClass( "ui-state-hover" ), "hovered" );
	anchor.simulate( "click" );
	state( element, 0, 0, 0, 1 );

	// add remote tab with index
	element.one( "tabsadd", function( event, ui ) {
		equal( ui.index, 1, "ui.index" );
		equal( $( ui.tab ).text(), "New Remote", "ui.tab" );
		equal( ui.panel.id, $( ui.tab ).closest( "li" ).attr( "aria-controls" ), "ui.panel" );
	});
	element.tabs( "add", "data/test.html", "New Remote", 1 );
	state( element, 0, 0, 0, 0, 1 );
	tab = element.find( ".ui-tabs-nav li" ).eq( 1 );
	anchor = tab.find( ".ui-tabs-anchor" );
	equal( tab.text(), "New Remote", "label" );
	equal( stripLeadingSlash( stripLeadingSlash(
		anchor[0].pathname.replace( stripLeadingSlash( location.pathname ).split( "/" ).slice( 0, -1 ).join( "/" ), "" )
	) ), "data/test.html", "href" );
	ok( /^ui-tabs-\d+$/.test( tab.attr( "aria-controls" ) ), "aria controls" );
	ok( !tab.hasClass( "ui-state-hover" ), "not hovered" );
	anchor.simulate( "mouseover" );
	ok( tab.hasClass( "ui-state-hover" ), "hovered" );
	anchor.simulate( "click" );
	state( element, 0, 1, 0, 0, 0 );

	// add to empty tab set
	element = $( "<div><ul></ul></div>" ).tabs();
	equal( element.tabs( "option", "active" ), false, "active: false on init" );
	element.one( "tabsadd", function( event, ui ) {
		equal( ui.index, 0, "ui.index" );
		equal( $( ui.tab ).text(), "First", "ui.tab" );
		equal( ui.panel.id, "first", "ui.panel" );
	});
	element.tabs( "add", "#first", "First" );
	state( element, 1 );
	equal( element.tabs( "option", "active" ), 0, "active: 0 after add" );
});

test( "#5069 - ui.tabs.add creates two tab panels when using a full URL", function() {
	expect( 2 );

	var element = $( "#tabs2" ).tabs();
	equal( element.children( "div" ).length, element.find( ".ui-tabs-nav li" ).length );
	element.tabs( "add", "/new", "New" );
	equal( element.children( "div" ).length, element.find( ".ui-tabs-nav li" ).length );
});

test( "remove", function() {
	expect( 17 );

	var element = $( "#tabs1" ).tabs({ active: 1 });
	state( element, 0, 1, 0 );

	element.one( "tabsremove", function( event, ui ) {
		equal( ui.index, -1, "ui.index" );
		equal( $( ui.tab ).text(), "2", "ui.tab" );
		equal( ui.panel.id, "fragment-2", "ui.panel" );
	});
	element.tabs( "remove", 1 );
	state( element, 0, 1 );
	equal( element.tabs( "option", "active" ), 1 );
	equal( element.find( ".ui-tabs-nav li a[href$='fragment-2']" ).length, 0,
		"remove correct list item" );
	equal( element.find( "#fragment-2" ).length, 0, "remove correct panel" );

	element.one( "tabsremove", function( event, ui ) {
		equal( ui.index, -1, "ui.index" );
		equal( $( ui.tab ).text(), "3", "ui.tab" );
		equal( ui.panel.id, "fragment-3", "ui.panel" );
	});
	element.tabs( "remove", 1 );
	state( element, 1 );
	equal( element.tabs( "option", "active"), 0 );

	element.one( "tabsremove", function( event, ui ) {
		equal( ui.index, -1, "ui.index" );
		equal( $( ui.tab ).text(), "1", "ui.tab" );
		equal( ui.panel.id, "fragment-1", "ui.panel" );
	});
	element.tabs( "remove", 0 );
	equal( element.tabs( "option", "active" ), false );
});

}( jQuery ) );
