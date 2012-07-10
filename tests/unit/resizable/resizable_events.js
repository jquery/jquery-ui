/*
 * resizable_events.js
 */
(function($) {

module("resizable: events");

test("start", function() {

	expect(1);

	var count = 0,
		handle = '.ui-resizable-se';
	el = $("#resizable1").resizable({
		handles: 'all',
		start: function(event, ui) { 
			count++;
		}
	});

	TestHelpers.resizable.drag(handle, 50, 50);

	equal(count, 1, "start callback should happen exactly once");

});

test("resize", function() {

	expect(1);

	var count = 0,
		handle = '.ui-resizable-e';
	el = $("#resizable1").resizable({
		handles: 'all',
		resize: function(event, ui) { 
			count++;
		}
	});

	TestHelpers.resizable.drag(handle, 50, 50);

	equal(count, 2, "resize callback should happen exactly once per size adjustment");

});

test("resize (grid)", function() {

	expect(1);

	var count = 0,
		handle = '.ui-resizable-se';
	el = $("#resizable1").resizable({
		handles: 'all',
		grid: 50,
		resize: function(event, ui) {
			count++;
		},
	});

	TestHelpers.resizable.drag(handle, 50, 50);

	equal(count, 1, "resize callback should happen exactly once per grid-aligned size adjustment");

});

test("stop", function() {

	expect(1);

	var count = 0,
		handle = '.ui-resizable-e';
	el = $("#resizable1").resizable({
		handles: 'all',
		stop: function(event, ui) { 
			count++;
		}
	});

	TestHelpers.resizable.drag(handle, 50, 50);

	equal(count, 1, "stop callback should happen exactly once");

});

})(jQuery);
