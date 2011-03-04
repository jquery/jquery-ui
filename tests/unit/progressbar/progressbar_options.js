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

test("{ value : -5 }", function() {
	$("#progressbar").progressbar({
		value: -5
	});
	same( 0, $("#progressbar").progressbar("value") );
});

test("{ value : 105 }", function() {
	$("#progressbar").progressbar({
		value: 105
	});
	same( 100, $("#progressbar").progressbar("value") );
});

test("{ max : 5, value : 10 }", function() {
	$("#progressbar").progressbar({
		max: 5,
		value: 10
	});
	same( 5, $("#progressbar").progressbar("value") );
});

})(jQuery);
