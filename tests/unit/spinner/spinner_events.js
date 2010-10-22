/*
 * spinner_events.js
 */
(function($) {

module("spinner: events");

test("start", function() {
	expect(1);

	var start = 0;
	
	el = $("#spin").spinner({
		start: function(){
			start++;
		}
	});

	simulateKeyDownUp(el, $.ui.keyCode.UP);

	equals(start, 1, "Start triggered");
});

test("spin", function() {
	expect(1);

	var spin = 0;
	
	el = $("#spin").spinner({
		spin: function(){
			spin++;
		}
	});

	simulateKeyDownUp(el, $.ui.keyCode.UP);
	
	equals(spin, 1, "Spin triggered");
});

test("stop", function() {
	expect(1);

	var stop = 0;
	
	el = $("#spin").spinner({
		stop: function(){
			stop++;
		}
	});

	simulateKeyDownUp(el, $.ui.keyCode.DOWN);
	
	equals(stop, 1, "Stop triggered");
});

test("change", function() {
	expect(1);

	var start = spin = stop = change = 0;
	
	el = $("#spin").spinner({
		change: function(){
			change++;
		}
	});

	simulateKeyDownUp(el, $.ui.keyCode.UP);
	
	equals(change, 1, "Change triggered");
});

})(jQuery);
