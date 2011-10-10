/*
 * draggable_core.js
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
	var expected = { left: offsetBefore.left + dx, top: offsetBefore.top + dy };
	same(actual, expected, 'dragged[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
}

function restoreScroll(what) {
	if(what) {
		$(document).scrollTop(0); $(document).scrollLeft(0);
	} else {
		$("#main")[0].scrollTop = 0; $("#main")[0].scrollLeft = 0;
	}
}

(function($) {

module("draggable");

})(jQuery);
