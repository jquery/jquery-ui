/*
 * menu_methods.js
 */
(function($) {

module("menu: methods");

test("destroy", function() {
	domEqual("#menu1", function() {
		$("#menu1").menu().menu("destroy");
	});
});


})(jQuery);
