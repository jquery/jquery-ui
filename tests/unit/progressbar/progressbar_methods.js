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
	expect(1);

	$("<div></div>").appendTo('body').progressbar().progressbar("destroy").remove();
	ok(true, '.progressbar("destroy") called on element');

});

})(jQuery);
