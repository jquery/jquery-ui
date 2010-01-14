/*
 * autocomplete_core.js
 */


(function($) {

module("autocomplete: core");

test("close-on-blur is properly delayed", function() {
	var ac = $("#autocomplete").autocomplete({
		source: ["java", "javascript"]
	}).val("ja").autocomplete("search");
	same( $(".ui-menu:visible").length, 1 );
	ac.blur();
	same( $(".ui-menu:visible").length, 1 );
	stop();
	setTimeout(function() {
		same( $(".ui-menu:visible").length, 0 );
		start();
	}, 200);
})

test("close-on-blur is cancelled when starting a search", function() {
	var ac = $("#autocomplete").autocomplete({
		source: ["java", "javascript"]
	}).val("ja").autocomplete("search");
	same( $(".ui-menu:visible").length, 1 );
	ac.blur();
	same( $(".ui-menu:visible").length, 1 );
	ac.autocomplete("search");
	stop();
	setTimeout(function() {
		same( $(".ui-menu:visible").length, 1 );
		start();
	}, 200);
})

})(jQuery);
