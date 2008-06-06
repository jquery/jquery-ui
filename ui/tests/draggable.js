/*
 * draggable tests
 */

var drag = function(el, dx, dy, complete) {
	
	// speed = sync -> Drag syncrhonously.
	// speed = fast|slow -> Drag asyncrhonously - animated.
	
	return $(el).simulate("drag", {
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
	
	expect(2);
	
	var dx = 50, dy = 50;
	
	$("#draggable1").draggable();
	var el = $("#draggable1").data("draggable").element;
	
	var before = el.offset();
	drag("#draggable1", dx, dy);
	var after = el.offset();	
	
	equals(after.left, before.left + dx, "Checking new left position");
	equals(after.top, before.top + dy, "Checking new top position");
	
});

test("No options, absolute", function() {
	
	expect(2);
	
	var dx = 50, dy = 50;
	
	$("#draggable2").draggable();
	var el = $("#draggable2").data("draggable").element;
	
	var before = el.offset();
	drag("#draggable2", dx, dy);
	var after = el.offset();	
	
	equals(after.left, before.left + dx, "Checking new left position");
	equals(after.top, before.top + dy, "Checking new top position");
	
});

test("{ helper: 'clone' }", function() {
	
	expect(4);
	
	var dx = 50, dy = 50;
	
	$("#draggable1, #draggable2").draggable({ helper: "clone" });
	var el1 = $("#draggable1").data("draggable").element;
	var el2 = $("#draggable2").data("draggable").element;
	
	var before1 = el1.offset();
	var before2 = el2.offset();
	drag("#draggable1, #draggable2", dx, dy);
	var after1 = el1.offset();
	var after2 = el2.offset();
	
	equals(after1.left, before1.left, "Relative: Original position should be untouched");
	equals(after1.top, before1.top, "Relative: Original position should be untouched");
	
	equals(after2.left, before2.left, "Absolute: Original position should be untouched");
	equals(after2.top, before2.top, "Absolute: Original position should be untouched");
	
});

test("{ grid: [50,50] }", function() {
	
	expect(4);
	
	var gx = 50, gy = 50;
	var dx = gx / 2 + 1, dy = gy / 2 + 1;
	
	$("#draggable1, #draggable2").draggable({ grid: [gx, gy] });
	var el1 = $("#draggable1").data("draggable").element;
	var el2 = $("#draggable2").data("draggable").element;
	
	var before1 = el1.offset();
	var before2 = el2.offset();
	drag("#draggable1, #draggable2", dx, dy);
	var after1 = el1.offset();
	var after2 = el2.offset();
	
	equals(after1.left, before1.left + gx, "Relative: 50px move in grid");
	equals(after1.top, before1.top + gy, "Relative: 50px move in grid");
	
	equals(after2.left, before2.left + gx, "Absolute: 50px move in grid");
	equals(after2.top, before2.top + gy, "Absolute: 50px move in grid");
	
});

test("{ grid: [50,50] }", function() {
	
	expect(4);
	
	var gx = 50, gy = 50;
	var dx = gx / 2 - 1, dy = gy / 2 - 1;
	
	$("#draggable1, #draggable2").draggable({ grid: [gx, gy] });
	var el1 = $("#draggable1").data("draggable").element;
	var el2 = $("#draggable2").data("draggable").element;
	
	var before1 = el1.offset();
	var before2 = el2.offset();
	drag("#draggable1, #draggable2", dx, dy);
	var after1 = el1.offset();
	var after2 = el2.offset();
	
	equals(after1.left, before1.left, "Relative: 50px move in grid");
	equals(after1.top, before1.top, "Relative: 50px move in grid");
	
	equals(after2.left, before2.left, "Absolute: 50px move in grid");
	equals(after2.top, before2.top, "Absolute: 50px move in grid");
	
});

test("{ axis: 'y' }", function() {
	
	expect(4);
	
	var dx = 50, dy = 50;
	
	$("#draggable1, #draggable2").draggable({ axis: "y" });
	var el1 = $("#draggable1").data("draggable").element;
	var el2 = $("#draggable2").data("draggable").element;
	
	var before1 = el1.offset();
	var before2 = el2.offset();
	drag("#draggable1, #draggable2", dx, dy);
	var after1 = el1.offset();
	var after2 = el2.offset();
	
	equals(after1.left, before1.left, "Relative: 0px move");
	equals(after1.top, before1.top + dy, "Relative: 50px move");
	
	equals(after2.left, before2.left, "Absolute: 0px move");
	equals(after2.top, before2.top + dy, "Absolute: 50px move");
	
});

test("{ axis: 'x' }", function() {
	
	expect(4);
	
	var dx = 50, dy = 50;
	
	$("#draggable1, #draggable2").draggable({ axis: "x" });
	var el1 = $("#draggable1").data("draggable").element;
	var el2 = $("#draggable2").data("draggable").element;
	
	var before1 = el1.offset();
	var before2 = el2.offset();
	drag("#draggable1, #draggable2", dx, dy);
	var after1 = el1.offset();
	var after2 = el2.offset();
	
	equals(after1.left, before1.left + dx, "Relative: 0px move");
	equals(after1.top, before1.top, "Relative: 50px move");
	
	equals(after2.left, before2.left + dy, "Absolute: 0px move");
	equals(after2.top, before2.top, "Absolute: 50px move");
	
});

test("{ cancel: 'span' }", function() {
	
	expect(4);
	
	var dx = 50, dy = 50;
	
	$("#draggable2").draggable({ cancel: 'span' });
	var el = $("#draggable2").data("draggable").element;
	
	var before = el.offset();
	drag("#draggable2 span", dx, dy);
	var after = el.offset();	
	
	equals(after.left, before.left, "Trigger on span: 0px move");
	equals(after.top, before.top, "Trigger on span: 0px move");
	
	var before = el.offset();
	drag("#draggable2", dx, dy);
	var after = el.offset();	
	
	equals(after.left, before.left + dx, "Trigger on element: 50px move");
	equals(after.top, before.top + dy, "Trigger on element: 50px move");
	
});

test("{ handle: 'span' }", function() {
	
	expect(4);
	
	var dx = 50, dy = 50;
	
	$("#draggable2").draggable({ handle: 'span' });
	var el = $("#draggable2").data("draggable").element;
	
	var before = el.offset();
	drag("#draggable2 span", dx, dy);
	var after = el.offset();	
	
	equals(after.left, before.left + dx, "Trigger on span: 50px move");
	equals(after.top, before.top + dy, "Trigger on span: 50px move");
	
	var before = el.offset();
	drag("#draggable2", dx, dy);
	var after = el.offset();	
	
	equals(after.left, before.left, "Trigger on element: 0px move");
	equals(after.top, before.top, "Trigger on element: 0px move");
	
});

test("{ containment: 'parent' }", function() {
	
	function border(el, side) { return parseInt(el.css('border-' + side + '-width')); }

	expect(4);

	var dx = -100, dy = -100;
	
	$("#draggable1, #draggable2").draggable({ containment: 'parent' });
	var el1 = $("#draggable1").data("draggable").element;
	var el2 = $("#draggable2").data("draggable").element;
	
	var before1 = el1.offset();
	var before2 = el2.offset();
	drag("#draggable1, #draggable2", dx, dy);
	var after1 = el1.offset();
	var after2 = el2.offset();

	var p1 = $("#draggable1").parent(), po1 = p1.offset();
	var p2 = $("#draggable2").parent(), po2 = p2.offset();
	var b1 = { left: border(p1, 'left'), top: border(p1, 'top') };
	var b2 = { left: border(p2, 'left'), top: border(p2, 'top') };
	
	equals(after1.left, po1.left + b1.left, "Absolute: " + (before1.left - po1.left + b1.left) + "px move (to parent's margin end)");
	equals(after1.top, po1.top + b1.top, "Absolute: " + (before1.top - po1.top + b1.top) + "px move (to parent's margin end)");
	
	equals(after2.left, po2.left + b2.left, "Relative: " + (before2.left - po2.left + b2.left) + "move (to parent's margin end)");
	equals(after2.top, po2.top + b2.top, "Relative: " + (before2.top - po2.top + b2.top) + "px move (to parent's margin end)");
	
});

test("{ cursorAt: { left: -5, top: -5 } }", function() {
	
	expect(4);
	
	var dx = -1, dy = -1;
	var ox = 5, oy = 5;
	var cax = -5, cay = -5;
	
	var actual = null;
	$("#draggable2").draggable({
		cursorAt: { left: cax, top: cay },
		drag: function(e, ui) {
			actual = ui.absolutePosition;
		}
	});
	var el = $("#draggable2").data("draggable").element;
	
	var before = el.offset();
	var pos = { clientX: before.left + ox, clientY: before.top + oy };
	$("#draggable2").simulate("mousedown", pos);
	pos = { clientX: pos.clientX + dx, clientY: pos.clienY + dy };
	$(document).simulate("mousedown", pos);
	$(document).simulate("mousedown", pos);
	$("#draggable2").simulate("mouseup", pos);
	var expected = { left: before.left + ox - cax, top: before.top + oy - cay };
	
	equals(actual.left, expected.left, "Absolute: -1px left");
	equals(actual.top, expected.top, "Absolute: -1px top");
	
	var actual = null;
	$("#draggable1").draggable({
		cursorAt: { left: cax, top: cay },
		drag: function(e, ui) {
			actual = ui.absolutePosition;
		}
	});
	var el = $("#draggable2").data("draggable").element;
	
	var before = el.offset();
	var pos = { clientX: before.left + ox, clientY: before.top + oy };
	$("#draggable2").simulate("mousedown", pos);
	pos = { clientX: pos.clientX + dx, clientY: pos.clienY + dy };
	$(document).simulate("mousedown", pos);
	$(document).simulate("mousedown", pos);
	$("#draggable2").simulate("mouseup", pos);
	var expected = { left: before.left + ox - cax, top: before.top + oy - cay };
	
	equals(actual.left, expected.left, "Relative: -1px left");
	equals(actual.top, expected.top, "Relative: -1px top");
	
});

test("{ cursor: 'move' }", function() {
	
	function getCursor() { return $("body").css("cursor"); }
	
	expect(2);
	
	var expected = "move", actual, before, after;
	
	$("#draggable2").draggable({
		cursor: expected,
		start: function(e, ui) {
			actual = getCursor();
		}
	});
	
	before = getCursor();
	drag("#draggable2", -1, -1);
	after = getCursor();
	
	equals(actual, expected, "start callback: cursor '" + expected + "'");
	equals(after, before, "after drag: cursor restored");
	
});

test("{ distance: 10 }", function() {
	
	expect(3);
	
	var dragged;
	$("#draggable2").draggable({
		distance: 10,
		start: function(e, ui) {
			dragged = true;
		}
	});
	
	dragged = false;
	drag("#draggable2", -9, -9);
	equals(dragged, false, "The draggable should not have moved when moving -9px");
	
	dragged = false;
	drag("#draggable2", -10, -10);
	equals(dragged, true, "The draggable should have moved when moving -10px");
	
	dragged = false;
	drag("#draggable2", 9, 9);
	equals(dragged, false, "The draggable should not have moved when moving 9px");
	
});

test("{ opacity: 0.5 }", function() {
	
	expect(1);
	
	var opacity = null;
	$("#draggable2").draggable({
		opacity: 0.5,
		start: function(e, ui) {
			opacity = $(this).css("opacity");
		}
	});
	
	drag("#draggable2", -1, -1);
	
	equals(opacity, 0.5, "start callback: opacity is");
	
});

test("{ zIndex: 10 }", function() {
	
	expect(1);

	var expected = 10, actual;
	
	var zIndex = null;
	$("#draggable2").draggable({
		zIndex: expected,
		start: function(e, ui) {
			actual = $(this).css("zIndex");
		}
	});
	
	drag("#draggable2", -1, -1);
	
	equals(actual, expected, "start callback: zIndex is");
	
});

test("callbacks occurance count", function() {
	
	expect(3);
	
	var start = 0, stop = 0, dragc = 0;
	$("#draggable2").draggable({
		start: function() { start++; },
		drag: function() { dragc++; },
		stop: function() { stop++; }
	});
	
	drag("#draggable2", 10, 10);
	
	equals(start, 1, "start callback should happen exactly once");
	equals(dragc, 11, "drag callback should happen exactly 1+10 times (first simultaneously with start)");
	equals(stop, 1, "stop callback should happen exactly once");
	
});
