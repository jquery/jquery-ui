/*
 * draggable unit tests
 */

var el, offsetBefore, offsetAfter, dragged;

var drag = function(handle, dx, dy) {
	var element = el.data("draggable").element;
	offsetBefore = el.offset();
	$(handle).simulate("drag", {
		dx: dx || 0,
		dy: dy || 0
	});
	dragged = { dx: dx, dy: dy };
	offsetAfter = el.offset();
}

var moved = function (dx, dy, msg) {
	msg = msg ? msg + "." : "";
	var actual = { left: offsetAfter.left, top: offsetAfter.top };
	var expected = { left: offsetBefore.left + dx, top: offsetAfter.top };
	compare2(actual, expected, 'dragged[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
}

var border = function(el, side) { return parseInt(el.css('border-' + side + '-width')); }

var margin = function(el, side) { return parseInt(el.css('margin-' + side)); }

module("Draggable");

test("create and destroy", function() {
	
	expect(3);
	
	el = $("#draggable1").draggable();
	ok(el.data("draggable"), "Accessing draggable instance after creation");
	
	el.draggable("destroy");
	ok(!el.data("draggable"), "Accessing draggable instance after destroy");

	$("<div/>").draggable().draggable("destroy");
	ok(true, "Create and destroy of disconnected DOMElement");
	
});

test("element types", function() {
	var typeNames = ('p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form'
		+ ',table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr'
		+ ',acronym,code,samp,kbd,var,img,object,hr'
		+ ',input,button,label,select,iframe').split(',');

	$.each(typeNames, function(i) {
		var typeName = typeNames[i];
		el = $(document.createElement(typeName)).appendTo('body');
		(typeName == 'table' && el.append("<tr><td>content</td></tr>"));
		el.draggable({ cancel: '' });
		drag(el, 50, 50);
		moved(50, 50, "&lt;" + typeName + "&gt;");
		el.draggable("destroy");
		el.remove();
	});
});

test("enable and disable", function() {
	el = $("#draggable2").draggable();
	drag(el, 50, 50);
	moved(50, 50, "default is enabled");
	el.draggable("disable");
	drag(el, 50, 50);
	moved(0, 0, "disabled by .draggable('disabled')");
	el.draggable("enable");
	drag(el, 50, 50);
	moved(50, 50, "enabled by .draggable('enable')");
	el.data("disabled.draggable", true);
	ok(el.data("disabled.draggable"), ".data('disabled.draggable') getter");
	drag(el, 50, 50, "disabled by .data('disabled.draggable', true)");
	moved(0, 0);
	el.data("disabled.draggable", false);
	ok(!el.data("disabled.draggable"), ".data('disabled.draggable') getter");
	drag(el, 50, 50, "enabled by .data('disabled.draggable', false)");
	moved(50, 50);	
});

test("defaults", function() {
	el = $("#draggable1").draggable();
	equals(el.data("appendTo.draggable"), "parent", "appendTo");
	equals(el.data("axis.draggable"), false, "axis");
	equals(el.data("cancel.draggable"), ":input,button", "cancel");
	equals(el.data("delay.draggable"), 0, "delay");
	equals(el.data("distance.draggable"), 0, "distance");
	equals(el.data("helper.draggable"), "original", "helper");
});

test("No options, relative", function() {
	el = $("#draggable1").draggable();
	drag(el, 50, 50);
	moved(50, 50);
});

test("No options, absolute", function() {
	el = $("#draggable2").draggable();
	drag(el, 50, 50);
	moved(50, 50);	
});

module("Draggable Options");

test("{ axis: false }, default", function() {
	el = $("#draggable2").draggable({ axis: false });
	drag(el, 50, 50);
	moved(50, 50);
});

test("{ axis: 'x' }", function() {
	el = $("#draggable2").draggable({ axis: "x" });
	drag(el, 50, 50);
	moved(50, 0);
});

test("{ axis: 'y' }", function() {
	el = $("#draggable2").draggable({ axis: "y" });
	drag(el, 50, 50);
	moved(0, 50);
});

test("{ axis: ? }, unexpected", function() {
	var unexpected = {
		"true": true,
		"{}": {},
		"[]": [],
		"null": null,
		"undefined": undefined,
		"function() {}": function() {}
	};
	$.each(unexpected, function(key, val) {
		el = $("#draggable2").draggable({ axis: val });
		drag(el, 50, 50);
		moved(50, 50, "axis: " + key);
		el.draggable("destroy");
	})
});

test("{ cancel: 'span' }", function() {
	el = $("#draggable2").draggable();
	drag("#draggable2 span", 50, 50);
	moved(50, 50);
	
	el.draggable("destroy");

	el = $("#draggable2").draggable({ cancel: 'span' });
	drag("#draggable2 span", 50, 50);
	moved(0, 0);
});

test("{ cancel: ? }, unexpected", function() {
	var unexpected = {
		"true": true,
		"false": false,
		"{}": {},
		"[]": [],
		"null": null,
		"undefined": undefined,
		"function() {return '';}": function() {return '';},
		"function() {return true;}": function() {return true;},
		"function() {return false;}": function() {return false;}
	};
	$.each(unexpected, function(key, val) {
		el = $("#draggable2").draggable({ cancel: val });
		drag(el, 50, 50);
		var expected = [50, 50];
		switch(key) {
			case "true":
				expected = [0, 0]
				break; 
		}
		moved(expected[0], expected[1], "cancel: " + key);
		el.draggable("destroy");
	})
});

test("{ containment: 'parent' }, relative", function() {
	el = $("#draggable1").draggable({ containment: 'parent' });
	var p = el.parent(), po = p.offset();
	drag(el, -100, -100);
	var expected = {
		left: po.left + border(p, 'left') + margin(el, 'left'),
		top: po.top + border(p, 'top') + margin(el, 'top')
	}
	compare2(offsetAfter, expected, 'compare offset to parent');
});

test("{ containment: 'parent' }, absolute", function() {
	el = $("#draggable2").draggable({ containment: 'parent' });
	var p = el.parent(), po = p.offset();
	drag(el, -100, -100);
	var expected = {
		left: po.left + border(p, 'left') + margin(el, 'left'),
		top: po.top + border(p, 'top') + margin(el, 'top')
	}
	compare2(offsetAfter, expected, 'compare offset to parent');
});

test("{ cursor: 'move' }", function() {
	
	function getCursor() { return $("body").css("cursor"); }
	
	expect(2);
	
	var expected = "move", actual, before, after;
	
	el = $("#draggable2").draggable({
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

test("{ cursorAt: { left: -5, top: -5 } }", function() {
	
	expect(4);
	
	var dx = -3, dy = -3;
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
	pos = { clientX: pos.clientX + dx, clientY: pos.clientY + dy };
	$(document).simulate("mousemove", pos);
	$(document).simulate("mousemove", pos);
	$("#draggable2").simulate("mouseup", pos);
	var expected = {
		left: before.left + ox - cax + dx,
		top: before.top + oy - cay + dy
	};
	
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
	pos = { clientX: pos.clientX + dx, clientY: pos.clientY + dy };
	$(document).simulate("mousemove", pos);
	$(document).simulate("mousemove", pos);
	$("#draggable2").simulate("mouseup", pos);
	var expected = {
		left: before.left + ox - cax + dx,
		top: before.top + oy - cay + dy
	};
	
	equals(actual.left, expected.left, "Relative: -1px left");
	equals(actual.top, expected.top, "Relative: -1px top");
	
});

test("{ distance: 10 }", function() {

	el = $("#draggable2").draggable({ distance: 10 });
	drag(el, -9, -9);
	moved(0, 0, 'distance not met');

	drag(el, -10, -10);
	moved(-10, -10, 'distance met');

	drag(el, 9, 9);
	moved(0, 0, 'distance not met');
	
});

test("{ grid: [50, 50] }, relative", function() {
	el = $("#draggable1").draggable({ grid: [50, 50] });
	drag(el, 24, 24);
	moved(0, 0);
	drag(el, 26, 25);
	moved(50, 50);
});

test("{ grid: [50, 50] }, absolute", function() {
	el = $("#draggable2").draggable({ grid: [50, 50] });
	drag(el, 24, 24);
	moved(0, 0);
	drag(el, 26, 25);
	moved(50, 50);
});

test("{ handle: 'span' }", function() {
	el = $("#draggable2").draggable({ handle: 'span' });

	drag("#draggable2 span", 50, 50);
	moved(50, 50, "drag span");

	drag("#draggable2", 50, 50);
	moved(0, 0, "drag element");
});

test("{ helper: 'clone' }, relative", function() {
	el = $("#draggable1").draggable({ helper: "clone" });
	drag(el, 50, 50);
	moved(0, 0);
});

test("{ helper: 'clone' }, absolute", function() {
	el = $("#draggable2").draggable({ helper: "clone" });
	drag(el, 50, 50);
	moved(0, 0);	
});

test("{ opacity: 0.5 }", function() {
	
	expect(1);
	
	var opacity = null;
	el = $("#draggable2").draggable({
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
	el = $("#draggable2").draggable({
		zIndex: expected,
		start: function(e, ui) {
			actual = $(this).css("zIndex");
		}
	});
	
	drag("#draggable2", -1, -1);
	
	equals(actual, expected, "start callback: zIndex is");
	
});

module("Draggable Callbacks");

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
	equals(dragc, 2 + 1, "drag callback should happen exactly once per mousemove + 1");
	equals(stop, 1, "stop callback should happen exactly once");
	
});

module("Tickets");

test("#2965 cursorAt with margin", function() {
	
	expect(2);
	
	var ox = 0, oy = 0;

	var actual, expected;
	$("#draggable2").draggable({
		cursorAt: { left: ox, top: oy },
		drag: function(e, ui) {
			actual = ui.absolutePosition;
		}
	});
	var el = $("#draggable2").data("draggable").element;
	
	$("#draggable2").css('margin', '0px !important');

	var before = el.offset();
	var pos = { clientX: before.left + ox, clientY: before.top + oy };
	$("#draggable2").simulate("mousedown", pos);
	$(document).simulate("mousemove", pos);
	$(document).simulate("mousemove", pos);
	$("#draggable2").simulate("mouseup", pos);
	var expected = actual;
	actual = undefined;

	var marg = 13;

	$("#draggable2").css('margin', marg + 'px !important');
	var before = el.offset();
	var pos = { clientX: before.left + ox - marg, clientY: before.top + oy - marg };
	$("#draggable2").simulate("mousedown", pos);
	$(document).simulate("mousemove", pos);
	$(document).simulate("mousemove", pos);
	$("#draggable2").simulate("mouseup", pos);
	
	equals(actual.left, expected.left, "10px margin. left");
	equals(actual.top, expected.top, "10px margin. top");
	
});
