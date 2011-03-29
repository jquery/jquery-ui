/*
 * tabs_events.js
 */
(function($) {

module("tabs: events");

test('beforeActivate', function() {
	expect(7);

	el = $('#tabs1').tabs({
		beforeActivate: function(event, ui) {
			ok(true, 'beforeActivate triggered after initialization');
			equals(this, el[0], "context of callback");
			equals(event.type, 'tabsbeforeactivate', 'event type in callback');
			equals(ui.tab, el.find('a')[1], 'contain tab as DOM anchor element');
			equals(ui.panel, el.find('div')[1], 'contain panel as DOM div element');
			equals(ui.index, 1, 'contain index');
		}
	});
	el.tabs('option', 'active', 1);

	el.tabs('destroy');
	el.tabs({
		beforeActivate: function(event, ui) {
			equals( event.originalEvent.type, "click", "beforeActivate triggered by click" );
		}
	});
	el.find( "li:eq(1) a" ).simulate( "click" );
});

test('beforeload', function() {
	expect( 5 );

	el = $('#tabs2');

	el.tabs({
		active: 2,
		beforeload: function( event, ui ) {
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

test('activate', function() {
	expect(5);

	var uiObj, eventObj;
	el = $('#tabs1').tabs({
		activate: function(event, ui) {
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

})(jQuery);
