/*
 * draggable_events.js
 */
(function($) {

module("draggable: events");

test("callbacks occurance count", function() {

	expect(3);

	var start = 0, stop = 0, dragc = 0;
	el = $("#draggable2").draggable({
		start: function() { start++; },
		drag: function() { dragc++; },
		stop: function() { stop++; }
	});

	drag(el, 10, 10);

	equals(start, 1, "start callback should happen exactly once");
	equals(dragc, 3, "drag callback should happen exactly once per mousemove");
	equals(stop, 1, "stop callback should happen exactly once");

});

})(jQuery);
