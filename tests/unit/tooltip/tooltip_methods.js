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
	e.tooltip("open");
	ok( $(".ui-tooltip").is(":visible") );
	$(":ui-tooltip").tooltip("destroy");
});

/*
TODO currently tooltip doesn't override widget
can't return anything useful if no element is kept around and there's no useful reference
test("widget", function() {
	var tooltip = $("#tooltipped1").tooltip();
	same(tooltip.tooltip("widget")[0], $(".ui-tooltip")[0]);
	same(tooltip.tooltip("widget").end()[0], tooltip[0]);
});
*/


})(jQuery);
