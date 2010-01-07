/*
 * button_methods.js
 */
(function($) {


module("button: methods");

test("destroy", function() {
	var beforeHtml = $("#button").parent().html();
	var afterHtml = $("#button").button().button("destroy").parent().html();
	same( beforeHtml, afterHtml );
});

})(jQuery);
