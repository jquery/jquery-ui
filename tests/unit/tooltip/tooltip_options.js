/*
 * tooltip_options.js
 */
(function($) {

module("tooltip: options", {
	teardown: function() {
		$(":ui-tooltip").tooltip("destroy");
	}
});

test("content: default", function() {
	$("#tooltipped1").tooltip().tooltip("open");
	same( $(".ui-tooltip").text(), "anchortitle" );
});

test("content: return string", function() {
	$("#tooltipped1").tooltip({
		content: function() {
			return "customstring";
		}
	}).tooltip("open");
	same( $(".ui-tooltip").text(), "customstring" );
});

test("content: callback string", function() {
	stop();
	$("#tooltipped1").tooltip({
		content: function(response) {
			response("customstring2");
			setTimeout(function() {
				same( $(".ui-tooltip").text(), "customstring2" );
				start();
			}, 100)
		}
	}).tooltip("open");
	
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
