/*
 * tabs unit tests
 */
(function($) {
//
// Tabs Test Helper Functions
//


// Tabs Tests
module("tabs");

test("init", function() {
	expect(1);

	el = $("#tabs1").tabs();
	ok(true, '.tabs() called on element');
});


})(jQuery);
