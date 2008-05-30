var console = console || {
	log: function(l) {
		$('#log').append(l + '<br/>').get(0).scrollTop = 10000;
	}
};

var animateClick = function(co) {
	var img = $("<img src='images/click.png' width='1'>").appendTo("body")
					.css({ position: "absolute", zIndex: 1000, left: co.x, top: co.y })
					.animate({ width: 80, height: 80, left: co.x-40, top: co.y-40, opacity: 'hide' }, 1000, function() { $(this).remove(); });
	};

var num = function(i) {
	return parseInt(i, 10);
};

$(document).ready(function() {
	
	var drag = function(el, dx, dy, complete) {
		
		// speed = sync -> Drag syncrhonously.
		// speed = fast|slow -> Drag asyncrhonously - animated.
		
		$(el).userAction("drag", {
			dx: dx, dy: dy, speed: 'sync', complete: complete 
		});
	};
	
	$('#resizable1').resizable({
		resize: function() {
			console.log('resize')			
		}
	});
	
	module("Test 1");
	
	test("simple resize tests", function() {
		
		drag('.ui-resizable-se', 100, 50);
		
	});
	
	
	test("simple resize tests 2", function() {
		
		//drag('.ui-resizable-se', 0, 1000);
		
	});
	
	module("Test 2");
	
	test("simple resize tests", function() {
		
		//drag('.ui-resizable-se', 15, 0);
		
	});
	
});