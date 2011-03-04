/*
 * tabs_events.js
 */
(function($) {

module("tabs: events");

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

test('load', function() {
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

})(jQuery);
