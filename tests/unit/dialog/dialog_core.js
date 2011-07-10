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

function isOpen(why) {
	ok(dlg().is(":visible"), why);
}

function isNotOpen(why) {
	ok(!dlg().is(":visible"), why);
}

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

function moved(dx, dy, msg) {
	msg = msg ? msg + "." : "";
	var actual = { left: Math.round(offsetAfter.left), top: Math.round(offsetAfter.top) };
	var expected = { left: Math.round(offsetBefore.left + dx), top: Math.round(offsetBefore.top + dy) };
	same(actual, expected, 'dragged[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
}

function shouldmove(why) {
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, -50);
	moved(50, -50, why);
}

function shouldnotmove(why) {
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, -50);
	moved(0, 0, why);
}

function resized(dw, dh, msg) {
	msg = msg ? msg + "." : "";
	var actual = { width: widthAfter, height: heightAfter };
	var expected = { width: widthBefore + dw, height: heightBefore + dh };
	same(actual, expected, 'resized[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
}

function shouldresize(why) {
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	resized(50, 50, why);
}

function shouldnotresize(why) {
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	resized(0, 0, why);
}

function broder(el, side){
	return parseInt(el.css('border-' + side + '-width'), 10);
}

function margin(el, side) {
	return parseInt(el.css('margin-' + side), 10);
}

(function($) {

module("dialog: core");

test("title id", function() {
	expect(3);

	var titleId;

	// reset the uuid so we know what values to expect
	$.ui.dialog.uuid = 0;

	el = $('<div></div>').dialog();
	titleId = dlg().find('.ui-dialog-title').attr('id');
	equals(titleId, 'ui-dialog-title-1', 'auto-numbered title id');
	el.remove();

	el = $('<div></div>').dialog();
	titleId = dlg().find('.ui-dialog-title').attr('id');
	equals(titleId, 'ui-dialog-title-2', 'auto-numbered title id');
	el.remove();

	el = $('<div id="foo"/>').dialog();
	titleId = dlg().find('.ui-dialog-title').attr('id');
	equals(titleId, 'ui-dialog-title-foo', 'carried over title id');
	el.remove();
});

test("ARIA", function() {
	expect(4);

	el = $('<div></div>').dialog();

	equals(dlg().attr('role'), 'dialog', 'dialog role');

	var labelledBy = dlg().attr('aria-labelledby');
	ok(labelledBy.length > 0, 'has aria-labelledby attribute');
	equals(dlg().find('.ui-dialog-title').attr('id'), labelledBy,
		'proper aria-labelledby attribute');

	equals(dlg().find('.ui-dialog-titlebar-close').attr('role'), 'button',
		'close link role');

	el.remove();
});

test("widget method", function() {
	var dialog = $("<div/>").appendTo("#main").dialog();
	same(dialog.parent()[0], dialog.dialog("widget")[0]);
});

})(jQuery);
