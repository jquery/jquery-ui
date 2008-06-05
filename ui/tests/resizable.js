var drag = function(el, dx, dy, complete) {
	
	// speed = sync -> Drag syncrhonously.
	// speed = fast|slow -> Drag asyncrhonously - animated.
	
	return $(el).simulate("drag", {
		dx: dx||0, dy: dy||0, speed: 'sync', complete: complete 
	});
};

module("Simple Resize");

test("ui-resizable-e resize x", function() {
	
	var handle = '.ui-resizable-e', target = $('#resizable1').resizable({ handles: 'all' });
	
	expect(2);
	
	drag(handle, 50);
	
	equals( target.width(), 150, "compare width");
	
	drag(handle, -50);
	
	equals( target.width(), 100, "compare width" );
	
});

test("ui-resizable-w resize x", function() {
	
	var handle = '.ui-resizable-w', target = $('#resizable1').resizable({ handles: 'all' });
	
	expect(2);
	
	drag(handle, -50);
	
	equals( target.width(), 150, "compare width" );
	
	drag(handle, 50);
	
	equals( target.width(), 100, "compare width" );
	
});

test("ui-resizable-n resize y", function() {
	
	var handle = '.ui-resizable-n', target = $('#resizable1').resizable({ handles: 'all' });
	
	expect(2);
	
	drag(handle, 0, -50);
	
	equals( target.height(), 150, "compare height" );
	
	drag(handle, 0, 50);
	
	equals( target.height(), 100, "compare height" );
	
});

test("ui-resizable-s resize y", function() {
	
	var handle = '.ui-resizable-s', target = $('#resizable1').resizable({ handles: 'all' });
	
	expect(2);
	
	drag(handle, 0, 50);
	
	equals( target.height(), 150, "compare height" );
	
	drag(handle, 0, -50);
	
	equals( target.height(), 100, "compare height" );
	
});

test("ui-resizable-se resize xy", function() {
	
	var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ handles: 'all' });
	
	expect(4);
	
	drag(handle, 50, 50);
	
	equals( target.width(), 150, "compare width" );
	equals( target.height(), 150, "compare height" );
	
	drag(handle, -50, -50);
	
	equals( target.width(), 100, "compare width" );
	equals( target.height(), 100, "compare height" );
	
});

test("ui-resizable-sw resize xy", function() {
	
	var handle = '.ui-resizable-sw', target = $('#resizable1').resizable({ handles: 'all' });
	
	expect(4);
	
	drag(handle, -50, -50);
	
	equals( target.width(), 150, "compare width" );
	equals( target.height(), 50, "compare height" );
	
	drag(handle, 50, 50);
	
	equals( target.width(), 100, "compare width" );
	equals( target.height(), 100, "compare height" );
	
});

test("ui-resizable-ne resize xy", function() {
	
	var handle = '.ui-resizable-ne', target = $('#resizable1').resizable({ handles: 'all' });
	
	expect(4);
	
	drag(handle, -50, -50);
	
	equals( target.width(), 50, "compare width" );
	equals( target.height(), 150, "compare height" );
	
	drag(handle, 50, 50);
	
	equals( target.width(), 100, "compare width" );
	equals( target.height(), 100, "compare height" );
	
});

test("ui-resizable-nw resize xy", function() {
	
	var handle = '.ui-resizable-nw', target = $('#resizable1').resizable({ handles: 'all' });
	
	expect(4);
	
	drag(handle, -50, -50);
	
	equals( target.width(), 150, "compare width" );
	equals( target.height(), 150, "compare height" );
	
	drag(handle, 50, 50);
	
	equals( target.width(), 100, "compare width" );
	equals( target.height(), 100, "compare height" );
	
});

/**
 * Conditional Resize
 * min/max Height/Width
 */

module("Dimensions limit");

test("ui-resizable-se { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	
	var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });
	
	expect(4);
	
	drag(handle, -50, -50);
	
	equals( target.width(), 60, "compare minWidth" );
	equals( target.height(), 60, "compare minHeight" );
	
	drag(handle, 70, 70);
	
	equals( target.width(), 100, "compare maxWidth" );
	equals( target.height(), 100, "compare maxHeight" );
	
});

test("ui-resizable-sw { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	
	var handle = '.ui-resizable-sw', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });
	
	expect(4);
	
	drag(handle, 50, -50);
	
	equals( target.width(), 60, "compare minWidth" );
	equals( target.height(), 60, "compare minHeight" );
	
	drag(handle, -70, 70);
	
	equals( target.width(), 100, "compare maxWidth" );
	equals( target.height(), 100, "compare maxHeight" );
	
});

test("ui-resizable-ne { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	
	var handle = '.ui-resizable-ne', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });
	
	expect(4);
	
	drag(handle, -50, 50);
	
	equals( target.width(), 60, "compare minWidth" );
	equals( target.height(), 60, "compare minHeight" );
	
	drag(handle, 70, -70);
	
	equals( target.width(), 100, "compare maxWidth" );
	equals( target.height(), 100, "compare maxHeight" );
	
});

test("ui-resizable-nw { handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 }", function() {
	
	var handle = '.ui-resizable-nw', target = $('#resizable1').resizable({ handles: 'all', minWidth: 60, minHeight: 60, maxWidth: 100, maxHeight: 100 });
	
	expect(4);
	
	drag(handle, 70, 70);
	
	equals( target.width(), 60, "compare minWidth" );
	equals( target.height(), 60, "compare minHeight" );
	
	drag(handle, -70, -70);
	
	equals( target.width(), 100, "compare maxWidth" );
	equals( target.height(), 100, "compare maxHeight" );
	
});

/**
 * Respecting ratio resize with dimensions limit
 */

module("Respecting ratio resize with dimensions limits");

test("ui-resizable-e { aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 }", function() {
	
	var handle = '.ui-resizable-e', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
	
	expect(4);
	
	drag(handle, 80);
	
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");
	
	drag(handle, -130);
	
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
	
});

test("ui-resizable-w { aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 }", function() {
	
	var handle = '.ui-resizable-w', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
	
	expect(4);
	
	drag(handle, -80);
	
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");
	
	drag(handle, 130);
	
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
	
});

test("ui-resizable-n { aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 }", function() {
	
	var handle = '.ui-resizable-n', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
	
	expect(4);
	
	drag(handle, 0, -80);
	
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");
	
	drag(handle, 0, 80);
	
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");

});

test("ui-resizable-s { aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 }", function() {
	
	var handle = '.ui-resizable-s', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
	
	expect(4);
	
	drag(handle, 0, 80);
	
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");
	
	drag(handle, 0, -80);
	
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
	
});

test("ui-resizable-se { aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 }", function() {
	
	var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
	
	expect(4);
	
	drag(handle, 80, 80);
	
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");
	
	drag(handle, -80, -80);
	
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
	
});

test("ui-resizable-sw { aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 }", function() {
	
	var handle = '.ui-resizable-sw', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
	
	expect(4);
	
	drag(handle, -80, 80);
	
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");
	
	drag(handle, 80, -80);
	
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
	
});

test("ui-resizable-ne { aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 }", function() {
	
	var handle = '.ui-resizable-ne', target = $('#resizable1').resizable({ aspectRatio: 'preserve', handles: 'all', minWidth: 70, minHeight: 50, maxWidth: 150, maxHeight: 130 });
	
	expect(4);
	
	drag(handle, 80, -80);
	
	equals( target.width(), 130, "compare maxWidth");
	equals( target.height(), 130, "compare maxHeight");
	
	drag(handle, -80, 80);
	
	equals( target.width(), 70, "compare minWidth");
	equals( target.height(), 70, "compare minHeight");
	
});

module("Options");

test("ui-resizable-se { handles: 'all', grid: [0, 20] }", function() {
	
	var handle = '.ui-resizable-se', target = $('#resizable1').resizable({ handles: 'all', grid: [0, 20] });
	
	expect(4);
	
	drag(handle, 3, 9);
	
	equals( target.width(), 103, "compare width");
	equals( target.height(), 100, "compare height");
	
	drag(handle, 15, 11);
	
	equals( target.width(), 118, "compare width");
	equals( target.height(), 120, "compare height");
	
	
});
