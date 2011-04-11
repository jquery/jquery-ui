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

test('selected', function() {
	expect(10);

	el = $('#tabs1').tabs();
	equals(el.tabs('option', 'selected'), 0, 'should be 0 by default');

	el.tabs('destroy');
	//set a hash in the url
	location.hash = '#fragment-2';
	//selection of tab with divs ordered differently than list
	el = $('#tabs1').tabs();
	equals(el.tabs('option', 'selected'), 1, 'second tab should be selected');

	el.tabs('destroy');
	//set a hash in the url
	location.hash = '#tabs7-2';
	//selection of tab with divs ordered differently than list
	el = $('#tabs7').tabs();
	equals(el.tabs('option', 'selected'), 1, 'second tab should be selected');

	el.tabs('destroy');
	el = $('#tabs1').tabs({ selected: -1 });
	equals(el.tabs('option', 'selected'), -1, 'should be -1 for all tabs unselected');
	equals( $('li.ui-tabs-active', el).length, 0, 'no tab should be selected' );
	equals( $('div:hidden', '#tabs1').length, 3, 'all panels should be hidden' );

	el.tabs('destroy');
	el.tabs({ selected: 1 });
	equals(el.tabs('option', 'selected'), 1, 'should be specified tab');

	el.tabs('destroy');
	el.tabs({ selected: 99 });
	equals(el.tabs('option', 'selected'), 0, 'selected should default to zero if given value is out of index');

	el.tabs('destroy');
	el.tabs({ collapsible: true });
	el.tabs('option', 'selected', 0);
	equals(el.tabs('option', 'selected'), 0, 'should not collapse tab if value is same as selected');

	el.tabs('destroy');
	el = $('#tabs1').tabs();
	el.tabs('select', 1);
	equals(el.tabs('option', 'selected'), 1, 'should select tab');
});

module("tabs (deprecated): events");

test('enable', function() {
	expect(4);

	var uiObj;
	el = $('#tabs1').tabs({
		disabled: [ 0, 1 ],
		enable: function (event, ui) {
			uiObj = ui;
		}
	});
	el.tabs('enable', 1);
	ok(uiObj !== undefined, 'trigger callback');
	equals(uiObj.tab, $('a', el)[1], 'contain tab as DOM anchor element');
	equals(uiObj.panel, $('div', el)[1], 'contain panel as DOM div element');
	equals(uiObj.index, 1, 'contain index');
});

test('disable', function() {
	expect(4);

	var uiObj;
	el = $('#tabs1').tabs({
		disable: function (event, ui) {
			uiObj = ui;
		}
	});
	el.tabs('disable', 1);
	ok(uiObj !== undefined, 'trigger callback');
	equals(uiObj.tab, $('a', el)[1], 'contain tab as DOM anchor element');
	equals(uiObj.panel, $('div', el)[1], 'contain panel as DOM div element');
	equals(uiObj.index, 1, 'contain index');
});

test('add', function() {

	// TODO move to methods, not at all event related...

	var el = $('<div id="tabs"><ul></ul></div>').tabs();
	equals(el.tabs('option', 'selected'), -1, 'Initially empty, no selected tab');

	el.tabs('add', '#test1', 'Test 1');
	equals(el.tabs('option', 'selected'), 0, 'First tab added should be auto selected');

	el.tabs('add', '#test2', 'Test 2');
	equals(el.tabs('option', 'selected'), 0, 'Second tab added should not be auto selected');

});

test('remove', function() {
	ok(false, "missing test - untested code is broken code.");
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

module("tabs (deprecated): methods");

test('add', function() {
	expect(4);

	el = $('#tabs1').tabs();
	el.tabs('add', '#new', 'New');

	var added = $('li:last', el).simulate('mouseover');
	ok(added.is('.ui-state-hover'), 'should add mouseover handler to added tab');
	added.simulate('mouseout');
	var other = $('li:first', el).simulate('mouseover');
	ok(other.is('.ui-state-hover'), 'should not remove mouseover handler from existing tab');
	other.simulate('mouseout');

	equals($('a', added).attr('href'), '#new', 'should not expand href to full url of current page');

	ok(false, "missing test - untested code is broken code.");
});

test('remove', function() {
	expect(4);

	el = $('#tabs1').tabs();

	el.tabs('remove', 0);
	equals(el.tabs('length'), 2, 'remove tab');
	equals($('li a[href$="fragment-1"]', el).length, 0, 'remove associated list item');
	equals($('#fragment-1').length, 0, 'remove associated panel');

	// TODO delete tab -> focus tab to right
	// TODO delete last tab -> focus tab to left

	el.tabs('select', 1);
	el.tabs('remove', 1);
	equals(el.tabs('option', 'selected'), 0, 'update selected property');
});

test('select', function() {
	expect(6);

	el = $('#tabs1').tabs();

	el.tabs('select', 1);
	equals(el.tabs('option', 'active'), 1, 'should select tab');

	el.tabs('destroy');
	el.tabs({ collapsible: true });
	el.tabs('select', 0);
	equals(el.tabs('option', 'active'), -1, 'should collapse tab passing in the already active tab');

	el.tabs('destroy');
	el.tabs({ collapsible: true });
	el.tabs('select', -1);
	equals(el.tabs('option', 'active'), -1, 'should collapse tab passing in -1');

	el.tabs('destroy');
	el.tabs();
	el.tabs('select', 0);
	equals(el.tabs('option', 'active'), 0, 'should not collapse tab if collapsible is not set to true');
	el.tabs('select', -1);
	equals(el.tabs('option', 'active'), 0, 'should not collapse tab if collapsible is not set to true');

	el.tabs('select', '#fragment-2');
	equals(el.tabs('option', 'active'), 1, 'should select tab by id');
});


test('#5069 - ui.tabs.add creates two tab panels when using a full URL', function() {
	// http://dev.jqueryui.com/ticket/5069
	expect(2);

	el = $('#tabs2').tabs();
	equals(el.children('div').length, el.find('> ul > li').length, 'After creation, number of panels should be equal to number of tabs');
	el.tabs('add', '/ajax_html_echo', 'Test');
	equals(el.children('div').length, el.find('> ul > li').length, 'After add, number of panels should be equal to number of tabs');
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
