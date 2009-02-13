/*
 * datepicker_tickets.js
 */
(function($) {

module("datepicker: tickets");

test('#4055: onclick events contain references to "jQuery"', function() {
	// no assertions, if the test fails, there will be an error
	
	var _jQuery = jQuery;
	jQuery = null;
	
	$('<div/>').appendTo('body').datepicker()
	// the third weekend day always exists
	.find('tbody .ui-datepicker-week-end:eq(3)').click().end()
	.datepicker('destroy');
	
	jQuery = _jQuery;
});

})(jQuery);
