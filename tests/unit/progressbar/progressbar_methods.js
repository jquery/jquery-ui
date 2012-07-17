/*
 * progressbar_methods.js
 */
(function($) {

module("progressbar: methods");

test("init", function() {
	expect(1);

	$("<div></div>").appendTo('body').progressbar().remove();
	ok(true, '.progressbar() called on element');

});

test("destroy", function() {
	expect(2);

	$("<div></div>").appendTo('body').progressbar().progressbar("destroy").remove();
	ok(true, '.progressbar("destroy") called on element');

	var expected = $('<div></div>').progressbar(),
		actual = expected.progressbar('destroy');
	equal(actual, expected, 'destroy is chainable');
});

test('value', function() {
	expect(3);

	var el = $('<div></div>').progressbar({ value: 20 });
	equal(el.progressbar('value'), 20, 'correct value as getter');
	equal(el.progressbar('value', 30), el, 'chainable as setter');
	equal(el.progressbar('option', 'value'), 30, 'correct value after setter');
});

})(jQuery);
