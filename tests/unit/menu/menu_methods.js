/*
 * menu_methods.js
 */
(function($) {

module("menu: methods");

test("destroy", function() {
	var beforeHtml = $("#menu1").find("div").css("font-style", "normal").end().parent().html();
	var afterHtml = $("#menu1").menu().menu("destroy").parent().html();
	// Opera 9 outputs role="" instead of removing the attribute like everyone else
	if ($.browser.opera) {
		afterHtml = afterHtml.replace(/ role=""/g, "");
	}
	equal( afterHtml, beforeHtml );
});


})(jQuery);
