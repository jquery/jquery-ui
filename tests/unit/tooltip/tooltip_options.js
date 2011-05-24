/*
 * tooltip_options.js
 */
(function($) {

module("tooltip: options", {
	teardown: function() {
		$(":ui-tooltip").tooltip("destroy");
	}
});


test("option: items", function() {
	var event = $.Event("mouseenter");
	event.target = $("[data-tooltip]");
	$("#qunit-fixture").tooltip({
		items: "[data-tooltip]",
		content: function() {
			return $(this).attr("data-tooltip");
		}
	}).tooltip("open", event);
	same( $( "#" + $("#fixture-span").attr("aria-describedby") ).text(), "text" );
});

test("content: default", function() {
	$("#tooltipped1").tooltip().tooltip("open");
	same( $( "#" + $("#tooltipped1").attr("aria-describedby") ).text(), "anchortitle" );
});

test("content: return string", function() {
	$("#tooltipped1").tooltip({
		content: function() {
			return "customstring";
		}
	}).tooltip("open");
	same( $( "#" + $("#tooltipped1").attr("aria-describedby") ).text(), "customstring" );
});

test("content: return jQuery", function() {
	$("#tooltipped1").tooltip({
		content: function() {
			return $("<div></div>").html("cu<b>s</b>tomstring");
		}
	}).tooltip("open");
	same( $( "#" + $("#tooltipped1").attr("aria-describedby") ).text(), "customstring" );
});

/*
TODO broken, probably related to async content
test("content: callback string", function() {
	stop();
	$("#tooltipped1").tooltip({
		content: function(response) {
			response("customstring2");
			setTimeout(function() {
				//console.log($("#tooltipped1").attr("aria-describedby"))
				same( $( "#" + $("#tooltipped1").attr("aria-describedby") ).text(), "customstring2" );
				start();
			}, 100)
		}
	}).tooltip("open");
	
});
*/

})(jQuery);
