/*
 * dialog_core.js
 */

var el,
	offsetBefore, offsetAfter,
	heightBefore, heightAfter,
	widthBefore, widthAfter,
	dragged;

function dlg() {
	return el.dialog('widget');
}

TestHelpers.isOpen = function(why) {
	ok(dlg().is(":visible"), why);
};

TestHelpers.isNotOpen = function(why) {
	ok(!dlg().is(":visible"), why);
};

function drag(handle, dx, dy) {
	var d = dlg();
	offsetBefore = d.offset();
	heightBefore = d.height();
	widthBefore = d.width();
	//this mouseover is to work around a limitation in resizable
	//TODO: fix resizable so handle doesn't require mouseover in order to be used
	$(handle, d).simulate("mouseover");
	$(handle, d).simulate("drag", {
		dx: dx || 0,
		dy: dy || 0
	});
	dragged = { dx: dx, dy: dy };
	offsetAfter = d.offset();
	heightAfter = d.height();
	widthAfter = d.width();
}

TestHelpers.dialogMoved = function(dx, dy, msg) {
	msg = msg ? msg + "." : "";
	var actual = { left: Math.round(offsetAfter.left), top: Math.round(offsetAfter.top) },
		expected = { left: Math.round(offsetBefore.left + dx), top: Math.round(offsetBefore.top + dy) };
	deepEqual(actual, expected, 'dragged[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
};

TestHelpers.shouldmove = function(why) {
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, -50);
	TestHelpers.dialogMoved(50, -50, why);
};

TestHelpers.shouldnotmove = function(why) {
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, -50);
	TestHelpers.dialogMoved(0, 0, why);
};

TestHelpers.resized = function(dw, dh, msg) {
	msg = msg ? msg + "." : "";
	var actual = { width: widthAfter, height: heightAfter },
		expected = { width: widthBefore + dw, height: heightBefore + dh };
	deepEqual(actual, expected, 'resized[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
};

TestHelpers.shouldresize = function(why) {
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	TestHelpers.resized(50, 50, why);
};

TestHelpers.shouldnotresize = function(why) {
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	TestHelpers.resized(0, 0, why);
};

(function($) {

module("dialog: core");

test("title id", function() {
	expect(1);

	el = $('<div></div>').dialog();
	var titleId = dlg().find('.ui-dialog-title').attr('id');
	ok( /ui-id-\d+$/.test( titleId ), 'auto-numbered title id');
	el.remove();
});

test("ARIA", function() {
	expect(4);

	el = $('<div></div>').dialog();

	equal(dlg().attr('role'), 'dialog', 'dialog role');

	var labelledBy = dlg().attr('aria-labelledby');
	ok(labelledBy.length > 0, 'has aria-labelledby attribute');
	equal(dlg().find('.ui-dialog-title').attr('id'), labelledBy,
		'proper aria-labelledby attribute');

	equal(dlg().find('.ui-dialog-titlebar-close').attr('role'), 'button',
		'close link role');

	el.remove();
});

test("widget method", function() {
	expect( 1 );
	var dialog = $("<div>").appendTo("#main").dialog();
	deepEqual(dialog.parent()[0], dialog.dialog("widget")[0]);
});

})(jQuery);
