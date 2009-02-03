/*
 * sortable_core.js
 */

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

var border = function(el, side) { return parseInt(el.css('border-' + side + '-width')); }
var margin = function(el, side) { return parseInt(el.css('margin-' + side)); }

(function($) {

module("sortable: core");

})(jQuery);
