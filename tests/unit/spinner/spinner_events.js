/*
 * spinner_events.js
 */
(function($) {

module("spinner: events");

test("start", function() {
	var start = 0;
	
	var el = $("#spin").spinner({
		start: function(){
			start++;
		}
	});

	spinner_simulateKeyDownUp(el, $.ui.keyCode.UP);

	equals(start, 1, "Start triggered");
});

test("spin", function() {
	var spin = 0;
	
	var el = $("#spin").spinner({
		spin: function(){
			spin++;
		}
	});

	spinner_simulateKeyDownUp(el, $.ui.keyCode.UP);
	
	equals(spin, 1, "Spin triggered");
});

test("stop", function() {
	var stop = 0;
	
	var el = $("#spin").spinner({
		stop: function(){
			stop++;
		}
	});

	spinner_simulateKeyDownUp(el, $.ui.keyCode.DOWN);
	
	equals(stop, 1, "Stop triggered");
});

test("change", function() {
	var change = 0;
	
	var el = $("#spin").spinner({
		change: function(){
			change++;
		}
	});

	spinner_simulateKeyDownUp(el, $.ui.keyCode.UP);
	el.blur();
	
	equals(change, 1, "Change triggered");
});

})(jQuery);
