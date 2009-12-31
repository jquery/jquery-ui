/*
 * tabs_events.js
 */
(function($) {

module("tabs: events");

test('select', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('load', function() {
	ok(false, "missing test - untested code is broken code.");
});

test('show', function() {
	expect(4);

	var uiObj;
	el = $('#tabs1').tabs({
		show: function(event, ui) {
			uiObj = ui;
		}
	});
	ok(uiObj !== undefined, 'should fire show after init');
	equals(uiObj.tab, $('#tabs1 a')[0], 'should have tab as DOM anchor element');
	equals(uiObj.panel, $('#tabs1 div')[0], 'should have panel as DOM div element');
	equals(uiObj.index, 0, 'should have index');
	
});

test('add', function() {

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
	ok(false, "missing test - untested code is broken code.");
});

test('disable', function() {
	ok(false, "missing test - untested code is broken code.");
});

})(jQuery);
