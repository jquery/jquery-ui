/*
 * sortable_tickets.js
 */
(function($) {

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
