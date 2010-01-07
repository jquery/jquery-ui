/*
 * button_events.js
 */
(function($) {

module("button: events");

test("click-through", function() {
	expect(2);
	var set = $("#radio1").buttonset();
	set.find("input:first").click(function() {
		ok( true );
	});
	ok( set.find("label:first").click().is(".ui-button") );
});

})(jQuery);
