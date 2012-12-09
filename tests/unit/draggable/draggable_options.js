/*
 * draggable_options.js
 */
(function($) {

module("draggable: options");

test("{ addClasses: true }, default", function() {
	expect( 1 );
	var el = $("<div></div>").draggable({ addClasses: true });
	ok(el.is(".ui-draggable"), "'ui-draggable' class added");

	el.draggable("destroy");
});

test("{ addClasses: false }", function() {
	expect( 1 );
	var el = $("<div></div>").draggable({ addClasses: false });
	ok(!el.is(".ui-draggable"), "'ui-draggable' class not added");

	el.draggable("destroy");
});

test("{ appendTo: 'parent' }, default", function() {
	expect( 2 );
	var el = $("#draggable2").draggable({ appendTo: 'parent' });
	TestHelpers.draggable.shouldMove(el);

	el = $("#draggable1").draggable({ appendTo: 'parent' });
	TestHelpers.draggable.shouldMove(el);

});

test("{ appendTo: Element }", function() {
	expect( 2 );
	var el = $("#draggable2").draggable({ appendTo: $("#draggable2").parent()[0] });
	TestHelpers.draggable.shouldMove(el);

	el = $("#draggable1").draggable({ appendTo: $("#draggable2").parent()[0] });
	TestHelpers.draggable.shouldMove(el);
});

test("{ appendTo: Selector }", function() {
	expect( 2 );
	var el = $("#draggable2").draggable({ appendTo: "#main" });
	TestHelpers.draggable.shouldMove(el);

	el = $("#draggable1").draggable({ appendTo: "#main" });
	TestHelpers.draggable.shouldMove(el);
});

test("{ axis: false }, default", function() {
	expect( 1 );
	var el = $("#draggable2").draggable({ axis: false });
	TestHelpers.draggable.shouldMove(el);
});

test("{ axis: 'x' }", function() {
	expect( 1 );
	var el = $("#draggable2").draggable({ axis: "x" });
	TestHelpers.draggable.testDrag(el, el, 50, 50, 50, 0);
});

test("{ axis: 'y' }", function() {
	expect( 1 );
	var el = $("#draggable2").draggable({ axis: "y" });
	TestHelpers.draggable.testDrag(el, el, 50, 50, 0, 50);
});

test("{ axis: ? }, unexpected", function() {
	var el,
		unexpected = {
			"true": true,
			"{}": {},
			"[]": [],
			"null": null,
			"undefined": undefined,
			"function() {}": function() {}
		};

	expect( 6 );

	$.each(unexpected, function(key, val) {
		el = $("#draggable2").draggable({ axis: val });
		TestHelpers.draggable.testDrag(el, el, 50, 50, 50, 50, "axis: " + key);
		el.draggable("destroy");
	});
});

test("{ cancel: 'input,textarea,button,select,option' }, default", function() {
	expect( 2 );

	$('<div id="draggable-option-cancel-default"><input type="text"></div>').appendTo('#main');

	var el = $("#draggable-option-cancel-default").draggable({ cancel: "input,textarea,button,select,option" });
	TestHelpers.draggable.shouldMove(el);

	el.draggable("destroy");

	el = $("#draggable-option-cancel-default").draggable({ cancel: "input,textarea,button,select,option" });
	TestHelpers.draggable.testDrag(el, "#draggable-option-cancel-default input", 50, 50, 0, 0);
	el.draggable("destroy");
});

test("{ cancel: 'span' }", function() {
	expect( 2 );

	var el = $("#draggable2").draggable();
	TestHelpers.draggable.testDrag(el, "#draggable2 span", 50, 50, 50, 50);

	el.draggable("destroy");

	el = $("#draggable2").draggable({ cancel: 'span' });
	TestHelpers.draggable.testDrag(el, "#draggable2 span", 50, 50, 0, 0);
});

test("{ cancel: ? }, unexpected", function() {
	var el,
		unexpected = {
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

	expect( 9 );

	$.each(unexpected, function(key, val) {
		el = $("#draggable2").draggable({ cancel: val });
		TestHelpers.draggable.shouldMove(el, "cancel: " + key);
		el.draggable("destroy");
	});
});

/*
test("{ containment: false }, default", function() {
	expect( 1 );

	ok(false, 'missing test - untested code is broken code');
});

test("{ containment: Element }", function() {
	expect( 1 );

	ok(false, 'missing test - untested code is broken code');
});
*/

test("{ containment: 'parent' }, relative", function() {
	expect( 1 );

	var offsetAfter,
		el = $("#draggable1").draggable({ containment: 'parent' }),
		p = el.parent(),
		po = p.offset(),
		expected = {
			left: po.left + TestHelpers.draggable.border(p, 'left') + TestHelpers.draggable.margin(el, 'left'),
			top: po.top + TestHelpers.draggable.border(p, 'top') + TestHelpers.draggable.margin(el, 'top')
		};

	el.simulate( "drag", {
		dx: -100,
		dy: -100
	});
	offsetAfter = el.offset();
	deepEqual(offsetAfter, expected, 'compare offset to parent');
});

test("{ containment: 'parent' }, absolute", function() {
	expect( 1 );

	var offsetAfter,
		el = $("#draggable2").draggable({ containment: 'parent' }),
		p = el.parent(),
		po = p.offset(),
		expected = {
			left: po.left + TestHelpers.draggable.border(p, 'left') + TestHelpers.draggable.margin(el, 'left'),
			top: po.top + TestHelpers.draggable.border(p, 'top') + TestHelpers.draggable.margin(el, 'top')
		};

	el.simulate( "drag", {
		dx: -100,
		dy: -100
	});
	offsetAfter = el.offset();
	deepEqual(offsetAfter, expected, 'compare offset to parent');
});

/*
test("{ containment: 'document' }", function() {
	expect( 1 );

	ok(false, 'missing test - untested code is broken code');
});

test("{ containment: 'window' }", function() {
	expect( 1 );

	ok(false, 'missing test - untested code is broken code');
});

test("{ containment: Selector }", function() {
	expect( 1 );

	ok(false, 'missing test - untested code is broken code');
});

test("{ containment: [x1, y1, x2, y2] }", function() {
	expect( 1 );

	ok(false, 'missing test - untested code is broken code');
});
*/

test("{ cursor: 'auto' }, default", function() {
	function getCursor() { return $("#draggable2").css("cursor"); }

	expect(2);

	var actual, before, after,
		expected = "auto",
		el = $("#draggable2").draggable({
			cursor: expected,
			start: function() {
				actual = getCursor();
			}
		});

	before = getCursor();
	el.simulate( "drag", {
		dx: -1,
		dy: -1
	});
	after = getCursor();

	equal(actual, expected, "start callback: cursor '" + expected + "'");
	equal(after, before, "after drag: cursor restored");

});

test("{ cursor: 'move' }", function() {

	function getCursor() { return $("body").css("cursor"); }

	expect(2);

	var actual, before, after,
		expected = "move",
		el = $("#draggable2").draggable({
			cursor: expected,
			start: function() {
				actual = getCursor();
			}
		});

	before = getCursor();
	el.simulate( "drag", {
		dx: -1,
		dy: -1
	});
	after = getCursor();

	equal(actual, expected, "start callback: cursor '" + expected + "'");
	equal(after, before, "after drag: cursor restored");

});

/*
test("{ cursorAt: false}, default", function() {
	expect( 1 );

	ok(false, 'missing test - untested code is broken code');
});
*/

test("{ cursorAt: { left: -5, top: -5 } }", function() {
	expect(4);

	var deltaX = -3, deltaY = -3,
		offsetX = 5, offsetY = 5,
		cursorAtX = -5, cursorAtY = -5;

	$.each(['relative', 'absolute'], function(i, position) {
		var before, pos, expected,
			el = $('#draggable' + (i + 1)).draggable({
					cursorAt: { left: cursorAtX, top: cursorAtY },
					drag: function(event, ui) {
						equal(ui.offset.left, expected.left, position + ' left');
						equal(ui.offset.top, expected.top, position + ' top');
					}
			});

		before = el.offset();
		pos = {
			clientX: before.left + offsetX,
			clientY: before.top + offsetY
		};
		expected = {
			left: before.left + offsetX - cursorAtX + deltaX - TestHelpers.draggable.unreliableOffset,
			top: before.top + offsetY - cursorAtY + deltaY - TestHelpers.draggable.unreliableOffset
		};

		// todo: replace this with simulated drag event
		el.simulate("mousedown", pos);
		pos.clientX += deltaX;
		pos.clientY += deltaY;
		$(document).simulate("mousemove", pos);
		el.simulate("mouseup", pos);
	});
});

test("{ cursorAt: { right: 10, bottom: 20 } }", function() {
	expect(4);

	var deltaX = -3, deltaY = -3,
		offsetX = 5, offsetY = 5,
		cursorAtX = 10, cursorAtY = 20;

	$.each(['relative', 'absolute'], function(i, position) {
		var before, pos, expected,
			el = $('#draggable' + (i + 1)).draggable({
				cursorAt: { right: cursorAtX, bottom: cursorAtY },
				drag: function(event, ui) {
					equal(ui.offset.left, expected.left, position + ' left');
					equal(ui.offset.top, expected.top, position + ' top');
				}
			});
		before = el.offset();
		pos = {
			clientX: before.left + offsetX,
			clientY: before.top + offsetY
		};
		expected = {
			left: before.left + offsetX - el.width() + cursorAtX + deltaX - TestHelpers.draggable.unreliableOffset,
			top: before.top + offsetY - el.height() + cursorAtY + deltaY - TestHelpers.draggable.unreliableOffset
		};

		// todo: replace this with simulated drag event
		el.simulate("mousedown", pos);
		pos.clientX += deltaX;
		pos.clientY += deltaY;
		$(document).simulate("mousemove", pos);
		el.simulate("mouseup", pos);
	});
});

test("{ cursorAt: [10, 20] }", function() {
	expect(4);

	var deltaX = -3, deltaY = -3,
		offsetX = 5, offsetY = 5,
		cursorAtX = 10, cursorAtY = 20;

	$.each(['relative', 'absolute'], function(i, position) {
		var before, pos, expected,
			el = $('#draggable' + (i + 1)).draggable({
				cursorAt: { left: cursorAtX, top: cursorAtY },
				drag: function(event, ui) {
					equal(ui.offset.left, expected.left, position + ' left');
					equal(ui.offset.top, expected.top, position + ' top');
				}
			});

		before = el.offset();
		pos = {
			clientX: before.left + offsetX,
			clientY: before.top + offsetY
		};
		expected = {
			left: before.left + offsetX - cursorAtX + deltaX - TestHelpers.draggable.unreliableOffset,
			top: before.top + offsetY - cursorAtY + deltaY - TestHelpers.draggable.unreliableOffset
		};

		// todo: replace this with simulated drag event
		el.simulate("mousedown", pos);
		pos.clientX += deltaX;
		pos.clientY += deltaY;
		$(document).simulate("mousemove", pos);
		el.simulate("mouseup", pos);
	});
});

test("{ cursorAt: '20, 40' }", function() {
	expect(4);

	var deltaX = -3, deltaY = -3,
		offsetX = 5, offsetY = 5,
		cursorAtX = 20, cursorAtY = 40;

	$.each(['relative', 'absolute'], function(i, position) {
		var before, pos, expected,
			el = $('#draggable' + (i + 1)).draggable({
				cursorAt: { left: cursorAtX, top: cursorAtY },
				drag: function(event, ui) {
					equal(ui.offset.left, expected.left, position + ' left');
					equal(ui.offset.top, expected.top, position + ' top');
				}
			});

		before = el.offset();
		pos = {
			clientX: before.left + offsetX,
			clientY: before.top + offsetY
		};
		expected = {
			left: before.left + offsetX - cursorAtX + deltaX - TestHelpers.draggable.unreliableOffset,
			top: before.top + offsetY - cursorAtY + deltaY - TestHelpers.draggable.unreliableOffset
		};

		// todo: replace this with simulated drag event
		el.simulate("mousedown", pos);
		pos.clientX += deltaX;
		pos.clientY += deltaY;
		$(document).simulate("mousemove", pos);
		el.simulate("mouseup", pos);
	});
});

test("{ distance: 10 }", function() {
	expect( 3 );

	var el = $("#draggable2").draggable({ distance: 10 });
	TestHelpers.draggable.testDrag(el, el, -9, -9, 0, 0, 'distance not met');

	TestHelpers.draggable.testDrag(el, el, -10, -10, -10, -10, 'distance met');

	TestHelpers.draggable.testDrag(el, el, 9, 9, 0, 0, 'distance not met');

});

test("{ grid: [50, 50] }, relative", function() {
	expect( 2 );

	var el = $("#draggable1").draggable({ grid: [50, 50] });
	TestHelpers.draggable.testDrag(el, el, 24, 24, 0, 0);
	TestHelpers.draggable.testDrag(el, el, 26, 25, 50, 50);
});

test("{ grid: [50, 50] }, absolute", function() {
	expect( 2 );

	var el = $("#draggable2").draggable({ grid: [50, 50] });
	TestHelpers.draggable.testDrag(el, el, 24, 24, 0, 0);
	TestHelpers.draggable.testDrag(el, el, 26, 25, 50, 50);
});

test("{ handle: 'span' }", function() {
	expect( 2 );

	var el = $("#draggable2").draggable({ handle: 'span' });

	TestHelpers.draggable.testDrag(el, "#draggable2 span", 50, 50, 50, 50, "drag span");
	TestHelpers.draggable.shouldNotMove(el, "drag element");
});

test("{ helper: 'clone' }, relative", function() {
	expect( 1 );

	var el = $("#draggable1").draggable({ helper: "clone" });
	TestHelpers.draggable.shouldNotMove(el);
});

test("{ helper: 'clone' }, absolute", function() {
	expect( 1 );

	var el = $("#draggable2").draggable({ helper: "clone" });
	TestHelpers.draggable.shouldNotMove(el);
});

test("{ helper: 'original' }, relative, with scroll offset on parent", function() {
	expect( 3 );

	var el = $("#draggable1").draggable({ helper: "original" });

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.testScroll(el, 'relative');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.testScroll(el, 'static');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.testScroll(el, 'absolute');

	TestHelpers.draggable.restoreScroll();

});

test("{ helper: 'original' }, relative, with scroll offset on root", function() {
	expect( 3 );

	var el = $("#draggable1").draggable({ helper: "original" });

	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'relative');

	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'static');

	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'absolute');

	TestHelpers.draggable.restoreScroll('root');

});

test("{ helper: 'original' }, relative, with scroll offset on root and parent", function() {

	expect(3);

	var el = $("#draggable1").draggable({ helper: "original" });

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'relative');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'static');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'absolute');

	TestHelpers.draggable.restoreScroll();
	TestHelpers.draggable.restoreScroll('root');

});

test("{ helper: 'original' }, absolute, with scroll offset on parent", function() {

	expect(3);

	var el = $("#draggable1").css({ position: 'absolute', top: 0, left: 0 }).draggable({ helper: "original" });

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.testScroll(el, 'relative');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.testScroll(el, 'static');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.testScroll(el, 'absolute');

	TestHelpers.draggable.restoreScroll();

});

test("{ helper: 'original' }, absolute, with scroll offset on root", function() {

	expect(3);

	var el = $("#draggable1").css({ position: 'absolute', top: 0, left: 0 }).draggable({ helper: "original" });

	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'relative');

	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'static');

	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'absolute');

	TestHelpers.draggable.restoreScroll('root');

});

test("{ helper: 'original' }, absolute, with scroll offset on root and parent", function() {

	expect(3);

	var el = $("#draggable1").css({ position: 'absolute', top: 0, left: 0 }).draggable({ helper: "original" });

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'relative');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'static');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'absolute');

	TestHelpers.draggable.restoreScroll();
	TestHelpers.draggable.restoreScroll('root');

});

test("{ helper: 'original' }, fixed, with scroll offset on parent", function() {

	expect(3);

	var el = $("#draggable1").css({ position: 'fixed', top: 0, left: 0 }).draggable({ helper: "original" });

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.testScroll(el, 'relative');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.testScroll(el, 'static');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.testScroll(el, 'absolute');

	TestHelpers.draggable.restoreScroll();

});

test("{ helper: 'original' }, fixed, with scroll offset on root", function() {

	expect(3);

	var el = $("#draggable1").css({ position: 'fixed', top: 0, left: 0 }).draggable({ helper: "original" });

	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'relative');

	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'static');

	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'absolute');

	TestHelpers.draggable.restoreScroll('root');
});

test("{ helper: 'original' }, fixed, with scroll offset on root and parent", function() {

	expect(3);

	var el = $("#draggable1").css({ position: 'fixed', top: 0, left: 0 }).draggable({ helper: "original" });

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'relative');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'static');

	TestHelpers.draggable.setScroll();
	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.testScroll(el, 'absolute');

	TestHelpers.draggable.restoreScroll();
	TestHelpers.draggable.restoreScroll('root');

});

test("{ helper: 'clone' }, absolute", function() {

	expect(1);

	var helperOffset = null,
		origOffset = $("#draggable1").offset(),
		el = $("#draggable1").draggable({ helper: "clone", drag: function(event, ui) {
			helperOffset = ui.helper.offset();
		} });

	el.simulate( "drag", {
		dx: 1,
		dy: 1
	});
	deepEqual({ top: helperOffset.top-1, left: helperOffset.left-1 }, origOffset, 'dragged[1, 1] ');

});

test("{ helper: 'clone' }, absolute with scroll offset on parent", function() {

	expect(3);

	TestHelpers.draggable.setScroll();
	var helperOffset = null,
		origOffset = null,
		el = $("#draggable1").draggable({ helper: "clone", drag: function(event, ui) {
			helperOffset = ui.helper.offset();
		} });

	$("#main").css('position', 'relative');
	origOffset = $("#draggable1").offset();
	el.simulate( "drag", {
		dx: 1,
		dy: 1
	});
	deepEqual({ top: helperOffset.top-1, left: helperOffset.left-1 }, origOffset, 'dragged[1, 1] ');

	$("#main").css('position', 'static');
	origOffset = $("#draggable1").offset();
	el.simulate( "drag", {
		dx: 1,
		dy: 1
	});
	deepEqual({ top: helperOffset.top-1, left: helperOffset.left-1 }, origOffset, 'dragged[1, 1] ');

	$("#main").css('position', 'absolute');
	origOffset = $("#draggable1").offset();
	el.simulate( "drag", {
		dx: 1,
		dy: 1
	});
	deepEqual({ top: helperOffset.top-1, left: helperOffset.left-1 }, origOffset, 'dragged[1, 1] ');

	TestHelpers.draggable.restoreScroll();

});

test("{ helper: 'clone' }, absolute with scroll offset on root", function() {

	expect(3);

	TestHelpers.draggable.setScroll('root');
	var helperOffset = null,
		origOffset = null,
		el = $("#draggable1").draggable({ helper: "clone", drag: function(event, ui) {
			helperOffset = ui.helper.offset();
		} });

	$("#main").css('position', 'relative');
	origOffset = $("#draggable1").offset();
	el.simulate( "drag", {
		dx: 1,
		dy: 1
	});
	deepEqual({ top: helperOffset.top-1, left: helperOffset.left-1 }, origOffset, 'dragged[1, 1] ');

	$("#main").css('position', 'static');
	origOffset = $("#draggable1").offset();
	el.simulate( "drag", {
		dx: 1,
		dy: 1
	});
	deepEqual({ top: helperOffset.top-1, left: helperOffset.left-1 }, origOffset, 'dragged[1, 1] ');

	$("#main").css('position', 'absolute');
	origOffset = $("#draggable1").offset();
	el.simulate( "drag", {
		dx: 1,
		dy: 1
	});
	deepEqual({ top: helperOffset.top-1, left: helperOffset.left-1 }, origOffset, 'dragged[1, 1] ');

	TestHelpers.draggable.restoreScroll('root');

});

test("{ helper: 'clone' }, absolute with scroll offset on root and parent", function() {

	expect(3);

	TestHelpers.draggable.setScroll('root');
	TestHelpers.draggable.setScroll();

	var helperOffset = null,
		origOffset = null,
		el = $("#draggable1").draggable({ helper: "clone", drag: function(event, ui) {
			helperOffset = ui.helper.offset();
		} });

	$("#main").css('position', 'relative');
	origOffset = $("#draggable1").offset();
	el.simulate( "drag", {
		dx: 1,
		dy: 1
	});
	deepEqual({ top: helperOffset.top-1, left: helperOffset.left-1 }, origOffset, 'dragged[1, 1] ');

	$("#main").css('position', 'static');
	origOffset = $("#draggable1").offset();
	el.simulate( "drag", {
		dx: 1,
		dy: 1
	});
	deepEqual({ top: helperOffset.top-1, left: helperOffset.left-1 }, origOffset, 'dragged[1, 1] ');

	$("#main").css('position', 'absolute');
	origOffset = $("#draggable1").offset();
	el.simulate( "drag", {
		dx: 1,
		dy: 1
	});
	deepEqual({ top: helperOffset.top-1, left: helperOffset.left-1 }, origOffset, 'dragged[1, 1] ');

	TestHelpers.draggable.restoreScroll('root');
	TestHelpers.draggable.restoreScroll();

});

test("{ opacity: 0.5 }", function() {

	expect(1);

	var opacity = null,
		el = $("#draggable2").draggable({
			opacity: 0.5,
			start: function() {
				opacity = $(this).css("opacity");
			}
		});

	el.simulate( "drag", {
		dx: -1,
		dy: -1
	});

	equal(opacity, 0.5, "start callback: opacity is");

});

test("{ zIndex: 10 }", function() {

	expect(1);

	var actual,
		expected = 10,
		el = $("#draggable2").draggable({
			zIndex: expected,
			start: function() {
				actual = $(this).css("zIndex");
			}
		});

	el.simulate( "drag", {
		dx: -1,
		dy: -1
	});

	equal(actual, expected, "start callback: zIndex is");

});

})(jQuery);
