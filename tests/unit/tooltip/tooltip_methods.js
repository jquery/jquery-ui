/*
 * tooltip_methods.js
 */
(function($) {


module("tooltip: methods");

test("destroy", function() {
	var beforeHtml = $("#tooltipped1").parent().html();
	var afterHtml = $("#tooltipped1").tooltip().tooltip("destroy").parent().html();
	equal( afterHtml, beforeHtml );
});

test("open", function() {
	var e = $("#tooltipped1").tooltip();
	ok( $(".ui-tooltip").is(":hidden") );
	e.tooltip("open");
	ok( $(".ui-tooltip").is(":visible") );
	$(":ui-tooltip").tooltip("destroy");
});

})(jQuery);
