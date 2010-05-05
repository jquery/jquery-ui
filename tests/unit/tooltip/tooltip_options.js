/*
 * tooltip_options.js
 */
(function($) {

module("tooltip: options");

function contentTest(name, expected, impl) {
	test(name, function() {
		$("#tooltipped1").tooltip({
			content: impl
		}).tooltip("open");
		same( $(".ui-tooltip").text(), expected );
		$(":ui-tooltip").tooltip("destroy");
	});
}

contentTest("content: default", "anchortitle");
contentTest("content: return string", "customstring", function() {
	return "customstring";
});
contentTest("content: callback string", "customstring2", function(response) {
	response("customstring2");
});

test("tooltipClass, default", function() {
	$("#tooltipped1").tooltip().tooltip("open");
	same( $(".ui-tooltip").attr("class"), "ui-tooltip ui-widget ui-corner-all ui-widget-content");
	$(":ui-tooltip").tooltip("destroy");
});
test("tooltipClass, custom", function() {
	$("#tooltipped1").tooltip({
		tooltipClass: "pretty fancy"
	}).tooltip("open");
	same( $(".ui-tooltip").attr("class"), "ui-tooltip ui-widget ui-corner-all pretty fancy");
	$(":ui-tooltip").tooltip("destroy");
});

})(jQuery);
