$(document).ready(function() {
	
	var drag = function(el, dx, dy, complete) {
		
		// speed = sync -> Drag syncrhonously.
		// speed = fast|slow -> Drag asyncrhonously - animated.
		
		return $(el).userAction("drag", {
			dx: dx||0, dy: dy||0, speed: 'sync', complete: complete 
		});
	};

	module("Simple Resize");
	
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
	
	/**
	 * Conditional Resize
	 * min/max Height/Width
	 */
	
	module("Dimensions limit");
	
	test("ui-resizable-se resize xy", function() {
		
		var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });
		
		expect(4);
		
		drag(handle, -50, -50);
		
		equals( 60, target.width(), "compare minWidth" );
		equals( 60, target.height(), "compare minHeight" );
		
		drag(handle, 70, 70);
		
		equals( 100, target.width(), "compare maxWidth" );
		equals( 100, target.height(), "compare maxHeight" );
		
	});
	
	test("ui-resizable-sw resize xy", function() {
		
		var handle = '.ui-resizable-sw', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });
		
		expect(4);
		
		drag(handle, 50, -50);
		
		equals( 60, target.width(), "compare minWidth" );
		equals( 60, target.height(), "compare minHeight" );
		
		drag(handle, -70, 70);
		
		equals( 100, target.width(), "compare maxWidth" );
		equals( 100, target.height(), "compare maxHeight" );
		
	});
	
	test("ui-resizable-ne resize xy", function() {
		
		var handle = '.ui-resizable-ne', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });
		
		expect(4);
		
		drag(handle, -50, 50);
		
		equals( 60, target.width(), "compare minWidth" );
		equals( 60, target.height(), "compare minHeight" );
		
		drag(handle, 70, -70);
		
		equals( 100, target.width(), "compare maxWidth" );
		equals( 100, target.height(), "compare maxHeight" );
		
	});
	
	test("ui-resizable-nw resize xy", function() {
		
		var handle = '.ui-resizable-nw', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });
		
		expect(4);
		
		drag(handle, 70, 70);
		
		equals( 60, target.width(), "compare minWidth" );
		equals( 60, target.height(), "compare minHeight" );
		
		drag(handle, -70, -70);
		
		equals( 100, target.width(), "compare maxWidth" );
		equals( 100, target.height(), "compare maxHeight" );
		
	});
	
	/**
	 * Respecting ratio resize with dimensions limit
	 */
	
	module("Respecting ratio resize with dimensions limits");
	
	test("ui-resizable-e resize x", function() {
		
		var handle = '.ui-resizable-e', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
		
		expect(4);
		
		drag(handle, 80);
		
		equals( 150, target.width(), "compare maxWidth");
		equals( 130, target.height(), "compare maxHeight");
		
		drag(handle, -130);
		
		equals( 70, target.width(), "compare minWidth");
		equals( 70, target.height(), "compare minHeight");
		
	});
	
	test("ui-resizable-w resize x", function() {
		
		var handle = '.ui-resizable-w', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
		
		expect(4);
		
		drag(handle, -80);
		
		equals( 150, target.width(), "compare maxWidth");
		equals( 130, target.height(), "compare maxHeight");
		
		drag(handle, 130);
		
		equals( 70, target.width(), "compare minWidth");
		equals( 70, target.height(), "compare minHeight");
		
	});
	
	test("ui-resizable-n resize y", function() {
		
		var handle = '.ui-resizable-n', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
		
		expect(4);
		
		drag(handle, 0, -80);
		
		equals( 130, target.width(), "compare maxWidth");
		equals( 130, target.height(), "compare maxHeight");
		
		drag(handle, 0, 130);
		
		equals( 70, target.width(), "compare minWidth");
		equals( 50, target.height(), "compare minHeight");
		
	});
	
	test("ui-resizable-n resize s", function() {
		
		var handle = '.ui-resizable-s', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
		
		expect(4);
		
		drag(handle, 0, 80);
		
		equals( 130, target.width(), "compare maxWidth");
		equals( 130, target.height(), "compare maxHeight");
		
		drag(handle, 0, -130);
		
		equals( 70, target.width(), "compare minWidth");
		equals( 50, target.height(), "compare minHeight");
		
	});
	
	test("ui-resizable-n resize se", function() {
		
		var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
		
		expect(4);
		
		drag(handle, 80, 80);
		
		equals( 130, target.width(), "compare maxWidth");
		equals( 130, target.height(), "compare maxHeight");
		
		drag(handle, -130, -130);
		
		equals( 70, target.width(), "compare minWidth");
		equals( 50, target.height(), "compare minHeight");
		
	});
	
	test("ui-resizable-n resize sw", function() {
		
		var handle = '.ui-resizable-sw', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
		
		expect(4);
		
		drag(handle, -80, 80);
		
		equals( 130, target.width(), "compare maxWidth");
		equals( 130, target.height(), "compare maxHeight");
		
		drag(handle, 130, -130);
		
		equals( 70, target.width(), "compare minWidth");
		equals( 50, target.height(), "compare minHeight");
		
	});
	
	test("ui-resizable-n resize ne", function() {
		
		var handle = '.ui-resizable-ne', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
		
		expect(4);
		
		drag(handle, 80, -80);
		
		equals( 130, target.width(), "compare maxWidth");
		equals( 130, target.height(), "compare maxHeight");
		
		drag(handle, -130, 130);
		
		equals( 70, target.width(), "compare minWidth");
		equals( 50, target.height(), "compare minHeight");
		
	});
	
	test("ui-resizable-n resize nw", function() {
		
		var handle = '.ui-resizable-nw', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
		
		expect(4);
		
		drag(handle, -80, -80);
		
		equals( 130, target.width(), "compare maxWidth");
		equals( 130, target.height(), "compare maxHeight");
		
		drag(handle, 130, 130);
		
		equals( 70, target.width(), "compare minWidth");
		equals( 50, target.height(), "compare minHeight");
		
	});
	
	
});