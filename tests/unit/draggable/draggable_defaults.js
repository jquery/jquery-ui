/*
 * draggable_defaults.js
 */
(function($) {

module("draggable: defaults");

test("defaults", function() {
	el = $('<div></div>').draggable();
	$.each(draggable_defaults, function(key, val) {
		var actual = el.data(key + ".draggable"), expected = val;
		same(actual, expected, key);
	});
	el.remove();
});

})(jQuery);
