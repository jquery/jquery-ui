var drag = function(el, dx, dy, complete) {
	
	// speed = sync -> Drag syncrhonously.
	// speed = fast|slow -> Drag asyncrhonously - animated.
	
	return $(el).userAction("drag", {
		dx: dx||0, dy: dy||0, speed: 'sync', complete: complete 
	});
};

	
module("Draggable");

test("create and destroy", function() {

	expect(2);

	$("#draggable1").draggable();
	ok($("#draggable1").data("draggable"), "Accessing draggable instance after creation");
	
	$("#draggable1").draggable("destroy");
	ok(!$("#draggable1").data("draggable"), "Accessing draggable instance after destroy");
	
});

test("No options, relative", function() {

	expect(4);

	$("#draggable1").draggable();
	
	var offset = $("#draggable1").data("draggable").element.offset();
	equals(offset.left, -979, "Checking initial left position");
	equals(offset.top, -979, "Checking initial top position");
	
	drag("#draggable1", 50, 50);

	var offset = $("#draggable1").data("draggable").element.offset();	
	equals(offset.left, -929, "Checking new left position");
	equals(offset.top, -929, "Checking new top position");
	
	
});

test("No options, absolute", function() {

	expect(4);

	$("#draggable2").draggable();
	
	var offset = $("#draggable2").data("draggable").element.offset();
	equals(offset.left, -979, "Checking initial left position");
	equals(offset.top, -979, "Checking initial top position");
	
	drag("#draggable2", 50, 50);

	var offset = $("#draggable2").data("draggable").element.offset();	
	equals(offset.left, -929, "Checking new left position");
	equals(offset.top, -929, "Checking new top position");
	
	
});

test("{ helper: 'clone' }", function() {

	expect(4);

	$("#draggable1, #draggable2").draggable({ helper: "clone" });
	
	drag("#draggable1, #draggable2", 50, 50);

	var offset = $("#draggable1").data("draggable").element.offset();	
	equals(offset.left, -979, "Relative: Original position should be untouched");
	equals(offset.top, -979, "Relative: Original position should be untouched");

	var offset = $("#draggable2").data("draggable").element.offset();	
	equals(offset.left, -979, "Absolute: Original position should be untouched");
	equals(offset.top, -979, "Absolute: Original position should be untouched");
	
	
});

test("{ grid: [50,50] }", function() {

	expect(4);

	$("#draggable1, #draggable2").draggable({ grid: [50,50] });
	
	drag("#draggable1, #draggable2", 30, 30);

	var offset = $("#draggable1").data("draggable").element.offset();	
	equals(offset.left, -929, "Relative: 50px move in grid");
	equals(offset.top, -929, "Relative: 50px move in grid");

	var offset = $("#draggable2").data("draggable").element.offset();	
	equals(offset.left, -929, "Absolute: 50px move in grid");
	equals(offset.top, -929, "Absolute: 50px move in grid");
	
	
});

test("{ axis: 'y' }", function() {

	expect(4);

	$("#draggable1, #draggable2").draggable({ axis: "y" });
	
	drag("#draggable1, #draggable2", 50, 50);

	var offset = $("#draggable1").data("draggable").element.offset();	
	equals(offset.left, -979, "Relative: 0px move");
	equals(offset.top, -929, "Relative: 50px move");

	var offset = $("#draggable2").data("draggable").element.offset();	
	equals(offset.left, -979, "Absolute: 0px move");
	equals(offset.top, -929, "Absolute: 50px move");
	
	
});

test("{ axis: 'x' }", function() {

	expect(4);

	$("#draggable1, #draggable2").draggable({ axis: "x" });
	
	drag("#draggable1, #draggable2", 50, 50);

	var offset = $("#draggable1").data("draggable").element.offset();	
	equals(offset.left, -929, "Relative: 50px move");
	equals(offset.top, -979, "Relative: 0px move");

	var offset = $("#draggable2").data("draggable").element.offset();	
	equals(offset.left, -929, "Absolute: 50px move");
	equals(offset.top, -979, "Absolute: 0px move");
	
	
});

test("{ cancel: 'span' }", function() {

	expect(2);

	$("#draggable2").draggable({ cancel: 'span' });
	
	drag("#draggable2 span", 50, 50);

	var offset = $("#draggable2").data("draggable").element.offset();	
	equals(offset.left, -979, "Trigger on span: 0px move");
	equals(offset.top, -979, "Trigger on span: 0px move");
	
	
});

test("{ handle: 'span' }", function() {

	expect(4);

	$("#draggable2").draggable({ handle: 'span' });
	
	drag("#draggable2 span", 50, 50);

	var offset = $("#draggable2").data("draggable").element.offset();	
	equals(offset.left, -929, "Trigger on span: 50px move");
	equals(offset.top, -929, "Trigger on span: 50px move");
	
	drag("#draggable2", 50, 50);
	
	var offset = $("#draggable2").data("draggable").element.offset();	
	equals(offset.left, -929, "Trigger on element: 0px move");
	equals(offset.top, -929, "Trigger on element: 0px move");
	
	
});

test("{ containment: 'parent' }", function() {

	expect(4);

	$("#draggable2, #draggable1").draggable({ containment: 'parent' });
	
	drag("#draggable2, #draggable1", -100, -100);

	var offset = $("#draggable2").data("draggable").element.offset();	
	equals(offset.left, -989, "Absolute: 10px move (to parent's margin end)");
	equals(offset.top, -989, "Absolute: 10px move (to parent's margin end)");
	
	var offset = $("#draggable1").data("draggable").element.offset();	
	equals(offset.left, -989, "Relative: 10px move (to parent's margin end)");
	equals(offset.top, -989, "Relative: 10px move (to parent's margin end)");
	
	
});

test("{ cursorAt: { left: -5, top: -5 } }", function() {

	expect(4);

	var position = null;
	$("#draggable2").draggable({
		cursorAt: { left: -5, top: -5 },
		drag: function(e, ui) {
			position = ui.absolutePosition;
		}
	});
	
	drag("#draggable2", -1, -1);

	equals(position.left, -875, "Absolute: -1px move");
	equals(position.top, -925, "Absolute: -1px move");
	
	var position = null;
	$("#draggable1").draggable({
		cursorAt: { left: -5, top: -5 },
		drag: function(e, ui) {
			position = ui.absolutePosition;
		}
	});
	
	drag("#draggable1", -1, -1);

	equals(position.left, -875, "Relative: -1px move");
	equals(position.top, -925, "Relative: -1px move");

});

test("{ cursor: 'move' }", function() {

	expect(2);

	var cursor = null;
	$("#draggable2").draggable({
		cursor: "move",
		start: function(e, ui) {
			cursor = $("body").css("cursor");
		}
	});
	
	drag("#draggable2", -1, -1);

	equals(cursor, "move", "start callback: cursor 'move'");
	equals($("body").css("cursor"), "auto", "after drag: cursor restored");

});



