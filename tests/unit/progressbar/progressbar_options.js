/*
 * progressbar_options.js
 */
(function($) {

module("progressbar: options");

test("{ value : 0 }, default", function() {
	$("#progressbar").progressbar();
	same( 0, $("#progressbar").progressbar("value") );
});

test("{ value : 5 }", function() {
	$("#progressbar").progressbar({
		value: 5
	});
	same( 5, $("#progressbar").progressbar("value") );
});

})(jQuery);
