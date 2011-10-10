/*
 * tabs_events.js
 */
(function($) {

module("tabs: events");

test('select', function() {
	expect(6);
	el = $('#tabs1').tabs({
		select: function(event, ui) {
			ok(true, 'select triggered after initialization');
			equals(this, el[0], "context of callback");
			equals(event.type, 'tabsselect', 'event type in callback');
			equals(ui.tab, el.find('a')[1], 'contain tab as DOM anchor element');
			equals(ui.panel, el.find('div')[1], 'contain panel as DOM div element');
			equals(ui.index, 1, 'contain index');
		}
	});
	el.tabs('select', 1);
});

test('show', function() {
	expect(4);

	var uiObj;
	el = $('#tabs1').tabs({
		show: function(event, ui) {
			uiObj = ui;
		}
	});
	ok(uiObj !== undefined, 'trigger callback after initialization');
	equals(uiObj.tab, $('a', el)[0], 'contain tab as DOM anchor element');
	equals(uiObj.panel, $('div', el)[0], 'contain panel as DOM div element');
	equals(uiObj.index, 0, 'contain index');

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
