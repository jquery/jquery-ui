(function( $ ) {

module("tabs (deprecated): core");

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

module("tabs (deprecated): options");

test('ajaxOptions', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('cache', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('idPrefix', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('tabTemplate', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('panelTemplate', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('cookie', function() {
	expect(6);

	el = $('#tabs1');
	var cookieName = 'tabs_test', cookieObj = { name: cookieName };
	$.cookie(cookieName, null); // blank state
	var cookie = function() {
		return parseInt($.cookie(cookieName), 10);
	};

	el.tabs({ cookie: cookieObj });
	equals(cookie(), 0, 'initial cookie value');

	el.tabs('destroy');
	el.tabs({ active: 1, cookie: cookieObj });
	equals(cookie(), 1, 'initial cookie value, from active property');

	el.tabs('option', 'active', 2);
	equals(cookie(), 2, 'cookie value updated after activating');

	el.tabs('destroy');
	$.cookie(cookieName, 1);
	el.tabs({ cookie: cookieObj });
	equals(cookie(), 1, 'initial cookie value, from existing cookie');

	el.tabs('destroy');
	el.tabs({ cookie: cookieObj, collapsible: true });
	el.tabs('option', 'active', false);
	equals(cookie(), -1, 'cookie value for all tabs unselected');

	el.tabs('destroy');
	ok($.cookie(cookieName) === null, 'erase cookie after destroy');

});


test('spinner', function() {
	expect(4);
	stop();

	el = $('#tabs2');

	el.tabs({
		selected: 2,
		load: function() {
			// spinner: default spinner
			setTimeout(function() {
				equals($('li:eq(2) > a > span', el).length, 1, "should restore tab markup after spinner is removed");
				equals($('li:eq(2) > a > span', el).html(), '3', "should restore tab label after spinner is removed");
				el.tabs('destroy');
				el.tabs({
					selected: 2,
					spinner: '<img src="spinner.gif" alt="">',
					load: function() {
						// spinner: image
						equals($('li:eq(2) > a > span', el).length, 1, "should restore tab markup after spinner is removed");
						equals($('li:eq(2) > a > span', el).html(), '3', "should restore tab label after spinner is removed");
						start();
					}
				});
			}, 1);
		}
	});
});

test( "selected", function() {
	expect( 19 );

	var element = $( "#tabs1" ).tabs();
	equals( element.tabs( "option", "selected" ), 0, "should be 0 by default" );
	tabs_state( element, 1, 0, 0 );
	element.tabs( "destroy" );

	location.hash = "#fragment-3";
	element = $( "#tabs1" ).tabs();
	equals( element.tabs( "option", "selected" ), 2, "should be 2 based on URL" );
	tabs_state( element, 0, 0, 1 );
	element.tabs( "destroy" );

	el = $('#tabs1').tabs({
		selected: -1,
		collapsible: true
	});
	tabs_state( element, 0, 0, 0 );
	equal( element.find( ".ui-tabs-nav .ui-state-active" ).size(), 0, "no tabs selected" );
	strictEqual( element.tabs( "option", "selected" ), -1 );

	element.tabs( "option", "collapsible", false );
	tabs_state( element, 1, 0, 0 );
	equal( element.tabs( "option", "selected" ), 0 );
	element.tabs( "destroy" );

	element.tabs({
		selected: -1
	});
	tabs_state( element, 1, 0, 0 );
	strictEqual( element.tabs( "option", "selected" ), 0 );
	element.tabs( "destroy" );

	element.tabs({ selected: 2 });
	equals( element.tabs( "option", "selected" ), 2 );
	tabs_state( element, 0, 0, 1 );

	element.tabs( "option", "selected", 0 );
	equals( element.tabs( "option", "selected" ), 0 );
	tabs_state( element, 1, 0, 0 );

	element.find( ".ui-tabs-nav a" ).eq( 1 ).click();
	equals( element.tabs( "option", "selected" ), 1 );
	tabs_state( element, 0, 1, 0 );

	element.tabs( "option", "selected", 10 );
	equals( element.tabs( "option", "selected" ), 1 );
	tabs_state( element, 0, 1, 0 );

	location.hash = "#";
});

module( "tabs (deprecated): events" );

test( "enable", function() {
	expect( 3 );

	var element = $( "#tabs1" ).tabs({
		disabled: [ 0, 1 ],
		enable: function ( event, ui ) {
			equals( ui.tab, element.find( ".ui-tabs-nav a" )[ 1 ], "ui.tab" );
			equals( ui.panel, element.find( ".ui-tabs-panel" )[ 1 ], "ui.panel" );
			equals( ui.index, 1, "ui.index" );
		}
	});
	element.tabs( "enable", 1 );
	// shouldn't trigger event
	element.tabs( "enable", 2 );
});

test( "disable", function() {
	expect( 3 );

	var element = $( "#tabs1" ).tabs({
		disable: function ( event, ui ) {
		equals( ui.tab, element.find( ".ui-tabs-nav a" )[ 1 ], "ui.tab" );
		equals( ui.panel, element.find( ".ui-tabs-panel" )[ 1 ], "ui.panel" );
		equals( ui.index, 1, "ui.index" );
		}
	});
	element.tabs( "disable", 1 );
	// shouldn't trigger event
	element.tabs( "disable", 1 );
});

test('show', function() {
	expect(5);

	var uiObj, eventObj;
	el = $('#tabs1').tabs({
		show: function(event, ui) {
			uiObj = ui;
			eventObj = event;
		}
	});
	ok(uiObj !== undefined, 'trigger callback after initialization');
	equals(uiObj.tab, $('a', el)[0], 'contain tab as DOM anchor element');
	equals(uiObj.panel, $('div', el)[0], 'contain panel as DOM div element');
	equals(uiObj.index, 0, 'contain index');

	el.find( "li:eq(1) a" ).simulate( "click" );
	equals( eventObj.originalEvent.type, "click", "show triggered by click" );

});

test('select', function() {
	expect(7);

	var eventObj;
	el = $('#tabs1').tabs({
		select: function(event, ui) {
			ok(true, 'select triggered after initialization');
			equals(this, el[0], "context of callback");
			equals(event.type, 'tabsselect', 'event type in callback');
			equals(ui.tab, el.find('a')[1], 'contain tab as DOM anchor element');
			equals(ui.panel, el.find('div')[1], 'contain panel as DOM div element');
			equals(ui.index, 1, 'contain index');
			evenObj = event;
		}
	});
	el.tabs('select', 1);

	el.find( "li:eq(1) a" ).simulate( "click" );
	equals( evenObj.originalEvent.type, "click", "select triggered by click" );
});

module( "tabs (deprecated): methods" );

test( "add", function() {
	expect( 27 );

	var element = $( "#tabs1" ).tabs();
	tabs_state( element, 1, 0, 0 );

	// add without index
	element.one( "tabsadd", function( event, ui ) {
		equal( ui.index, 3, "ui.index" );
		equal( $( ui.tab ).text(), "New", "ui.tab" );
		equal( ui.panel.id, "new", "ui.panel" );
	});
	element.tabs( "add", "#new", "New" );
	tabs_state( element, 1, 0, 0, 0 );
	var tab = element.find( ".ui-tabs-nav li" ).last(),
		anchor = tab.find( "a" );
	equals( tab.text(), "New", "label" );
	equals( anchor.attr( "href" ), "#new", "href" );
	equals( anchor.attr( "aria-controls" ), "new", "aria-controls" );
	ok( !tab.hasClass( "ui-state-hover" ), "not hovered" );
	anchor.simulate( "mouseover" );
	ok( tab.hasClass( "ui-state-hover" ), "hovered" );
	anchor.simulate( "click" );
	tabs_state( element, 0, 0, 0, 1 );

	// add remote tab with index
	element.one( "tabsadd", function( event, ui ) {
		equal( ui.index, 1, "ui.index" );
		equal( $( ui.tab ).text(), "New Remote", "ui.tab" );
		equal( ui.panel.id, $( ui.tab ).attr( "aria-controls" ), "ui.panel" );
	});
	element.tabs( "add", "data/test.html", "New Remote", 1 );
	tabs_state( element, 0, 0, 0, 0, 1 );
	tab = element.find( ".ui-tabs-nav li" ).eq( 1 );
	anchor = tab.find( "a" );
	equals( tab.text(), "New Remote", "label" );
	equals( anchor.attr( "href" ), "data/test.html", "href" );
	ok( /^ui-tabs-\d+$/.test( anchor.attr( "aria-controls" ) ), "aria controls" );
	ok( !tab.hasClass( "ui-state-hover" ), "not hovered" );
	anchor.simulate( "mouseover" );
	ok( tab.hasClass( "ui-state-hover" ), "hovered" );
	anchor.simulate( "click" );
	tabs_state( element, 0, 1, 0, 0, 0 );

	// add to empty tab set
	element = $( "<div><ul></ul></div>" ).tabs();
	equals( element.tabs( "option", "active" ), false, "active: false on init" );
	element.one( "tabsadd", function( event, ui ) {
		equal( ui.index, 0, "ui.index" );
		equal( $( ui.tab ).text(), "First", "ui.tab" );
		equal( ui.panel.id, "first", "ui.panel" );
	});
	element.tabs( "add", "#first", "First" );
	tabs_state( element, 1 );
	equals( element.tabs( "option", "active" ), 0, "active: 0 after add" );
});

test( "#5069 - ui.tabs.add creates two tab panels when using a full URL", function() {
	expect( 2 );

	var element = $( "#tabs2" ).tabs();
	equals( element.children( "div" ).length, element.find( ".ui-tabs-nav li" ).length );
	element.tabs( "add", "/new", "New" );
	equals( element.children( "div" ).length, element.find( ".ui-tabs-nav li" ).length );
});

test( "remove", function() {
	expect( 17 );

	var element = $( "#tabs1" ).tabs({ active: 1 });
	tabs_state( element, 0, 1, 0 );

	element.one( "tabsremove", function( event, ui ) {
		equal( ui.index, -1, "ui.index" );
		equal( $( ui.tab ).text(), "2", "ui.tab" );
		equal( ui.panel.id, "fragment-2", "ui.panel" );
	});
	element.tabs( "remove", 1 );
	tabs_state( element, 0, 1 );
	equals( element.tabs( "option", "active" ), 1 );
	equals( element.find( ".ui-tabs-nav li a[href$='fragment-2']" ).length, 0,
		"remove correct list item" );
	equals( element.find( "#fragment-2" ).length, 0, "remove correct panel" );

	element.one( "tabsremove", function( event, ui ) {
		equal( ui.index, -1, "ui.index" );
		equal( $( ui.tab ).text(), "3", "ui.tab" );
		equal( ui.panel.id, "fragment-3", "ui.panel" );
	});
	element.tabs( "remove", 1 );
	tabs_state( element, 1 );
	equals( element.tabs( "option", "active"), 0 );

	element.one( "tabsremove", function( event, ui ) {
		equal( ui.index, -1, "ui.index" );
		equal( $( ui.tab ).text(), "1", "ui.tab" );
		equal( ui.panel.id, "fragment-1", "ui.panel" );
	});
	element.tabs( "remove", 0 );
	equals( element.tabs( "option", "active" ), false );
});

test( "select", function() {
	expect( 23 );

	var element = $( "#tabs1" ).tabs();
	tabs_state( element, 1, 0, 0 );
	element.tabs( "select", 1 );
	tabs_state( element, 0, 1, 0 );
	equals( element.tabs( "option", "active" ), 1, "active" );
	equals( element.tabs( "option", "selected" ), 1, "selected" );
	element.tabs( "destroy" );

	element.tabs({ collapsible: true });
	tabs_state( element, 1, 0, 0 );
	element.tabs( "select", 0 );
	tabs_state( element, 0, 0, 0 );
	equals( element.tabs( "option", "active" ), false, "active" );
	equals( element.tabs( "option", "selected" ), -1, "selected" );
	element.tabs( "destroy" );

	element.tabs({ collapsible: true });
	element.tabs( "select", -1 );
	tabs_state( element, 0, 0, 0 );
	equals( element.tabs( "option", "active" ), false, "active" );
	equals( element.tabs( "option", "selected" ), -1, "selected" );
	element.tabs( "destroy" );

	element.tabs();
	tabs_state( element, 1, 0, 0 );
	equals( element.tabs( "option", "active" ), 0, "active" );
	equals( element.tabs( "option", "selected" ), 0, "selected" );
	element.tabs( "select", 0 );
	tabs_state( element, 1, 0, 0 );
	equals( element.tabs( "option", "active" ), 0, "active" );
	equals( element.tabs( "option", "selected" ), 0, "selected" );
	element.tabs( "select", -1 );
	tabs_state( element, 1, 0, 0 );
	equals( element.tabs( "option", "active" ), 0, "active" );
	equals( element.tabs( "option", "selected" ), 0, "selected" );

	element.tabs( "select", "#fragment-2" );
	tabs_state( element, 0, 1, 0 );
	equals( element.tabs( "option", "active" ), 1, "active" );
	equals( element.tabs( "option", "selected" ), 1, "selected" );
});

test( "length", function() {
	expect( 2 );

	equals( $( "#tabs1" ).tabs().tabs( "length" ), 3, "basic tabs" );
	equals( $( "#tabs2" ).tabs().tabs( "length" ), 5, "ajax tabs with missing panels" );
});

test( "url", function() {
	expect( 2 );

	var element = $( "#tabs2" ).tabs(),
		tab = element.find( "a" ).eq( 3 );

	element.tabs( "url", 3, "data/test2.html" );
	equals( tab.attr( "href" ), "data/test2.html", "href was updated" );
	element.one( "tabsbeforeload", function( event, ui ) {
		equals( ui.ajaxSettings.url, "data/test2.html", "ajaxSettings.url" );
		event.preventDefault();
	});
	element.tabs( "option", "active", 3 );
});

}( jQuery ) );
