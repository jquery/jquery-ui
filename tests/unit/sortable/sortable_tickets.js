/*
 * sortable_tickets.js
 */
(function($) {

var el, offsetBefore, offsetAfter, dragged;

var drag = function(handle, dx, dy) {
	offsetBefore = $(handle).offset();
	$(handle).simulate("drag", {
		dx: dx || 0,
		dy: dy || 0
	});
	dragged = { dx: dx, dy: dy };
	offsetAfter = $(handle).offset();
}

var sort = function(handle, dx, dy, index, msg) {
	drag(handle, dx, dy);
	equals($(handle).parent().children().index(handle), index, msg);
}

module("sortable: tickets");

test("#3019: Stop fires too early", function() {

	var helper = null;
	el = $("#sortable").sortable({
		stop: function(event, ui) {
			helper = ui.helper;
		}
	});

	sort($("li", el)[0], 0, 40, 2, 'Dragging the sortable');
	equals(helper, null, "helper should be false");

});

})(jQuery);
