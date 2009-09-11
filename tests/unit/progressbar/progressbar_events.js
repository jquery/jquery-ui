/*
 * progressbar_events.js
 */
(function($) {

module("progressbar: events");

test("change", function() {
	expect(1);
	$("#progressbar").progressbar({
		change: function() {
			same( 5, $(this).progressbar("value") );
		}
	}).progressbar("value", 5);
});

})(jQuery);
