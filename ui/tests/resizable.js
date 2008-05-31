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
		
		return $(el).userAction("drag", {
			dx: dx||0, dy: dy||0, speed: 'sync', complete: complete 
		});
	};
	
	module("simple resize");
	
	test("ui-resizable-e resize x", function() {
		
		var handle = '.ui-resizable-e', target = $('#resizable1').resizable({ handles: 'all' });
		
		expect(2);
		
		drag(handle, 50);
		
		equals( 149, target.width(), "compare width");
		
		drag(handle, -50);
		
		equals( 100, target.width(), "compare width" );
		
	});
	
	test("ui-resizable-w resize x", function() {
		
		var handle = '.ui-resizable-w', target = $('#resizable1').resizable({ handles: 'all' });
		
		expect(2);
		
		drag(handle, -50);
		
		equals( 149, target.width(), "compare width" );
		
		drag(handle, 50);
		
		equals( 100, target.width(), "compare width" );
		
	});
	
	test("ui-resizable-n resize y", function() {
		
		var handle = '.ui-resizable-n', target = $('#resizable1').resizable({ handles: 'all' });
		
		expect(2);
		
		drag(handle, 0, -50);
		
		equals( 149, target.height(), "compare height" );
		
		drag(handle, 0, 50);
		
		equals( 100, target.height(), "compare height" );
		
	});
	
	test("ui-resizable-s resize y", function() {
		
		var handle = '.ui-resizable-s', target = $('#resizable1').resizable({ handles: 'all' });
		
		expect(2);
		
		drag(handle, 0, 50);
		
		equals( 149, target.height(), "compare height" );
		
		drag(handle, 0, -50);
		
		equals( 100, target.height(), "compare height" );
		
	});
	
	test("ui-resizable-se resize xy", function() {
		
		var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ handles: 'all' });
		
		expect(4);
		
		drag(handle, 50, 50);
		
		equals( 149, target.width(), "compare width" );
		equals( 149, target.height(), "compare height" );
		
		drag(handle, -50, -50);
		
		equals( 100, target.width(), "compare width" );
		equals( 100, target.height(), "compare height" );
		
	});
	
	test("ui-resizable-sw resize xy", function() {
		
		var handle = '.ui-resizable-sw', target = $('#resizable1').resizable({ handles: 'all' });
		
		expect(4);
		
		drag(handle, -50, -50);
		
		equals( 149, target.width(), "compare width" );
		equals( 51, target.height(), "compare height" );
		
		drag(handle, 50, 50);
		
		equals( 100, target.width(), "compare width" );
		equals( 100, target.height(), "compare height" );
		
	});
	
	test("ui-resizable-ne resize xy", function() {
		
		var handle = '.ui-resizable-ne', target = $('#resizable1').resizable({ handles: 'all' });
		
		expect(4);
		
		drag(handle, -50, -50);
		
		equals( 51, target.width(), "compare width" );
		equals( 149, target.height(), "compare height" );
		
		drag(handle, 50, 50);
		
		equals( 100, target.width(), "compare width" );
		equals( 100, target.height(), "compare height" );
		
	});
	
	test("ui-resizable-nw resize xy", function() {
		
		var handle = '.ui-resizable-nw', target = $('#resizable1').resizable({ handles: 'all' });
		
		expect(4);
		
		drag(handle, -50, -50);
		
		equals( 149, target.width(), "compare width" );
		equals( 149, target.height(), "compare height" );
		
		drag(handle, 50, 50);
		
		equals( 100, target.width(), "compare width" );
		equals( 100, target.height(), "compare height" );
		
	});
	
	
});