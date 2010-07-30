/*
 * button_methods.js
 */
(function($) {


module("button: methods");

test("destroy", function() {
	var beforeHtml = $("#button").parent().html();
	var afterHtml = $("#button").button().button("destroy").parent().html();
	// Opera 9 outputs role="" instead of removing the attribute like everyone else
	if ($.browser.opera) {
		afterHtml = afterHtml.replace(/ role=""/g, "");
	}
	equal( afterHtml, beforeHtml );
});

test("widget", function() {
	var submit = $("#submit").button();
	same(submit.button("widget")[0], submit[0]);
	same(submit.button("widget").end()[0], submit[0]);
	
	var check = $("#check").button();
	same(check.button("widget")[0], check.next("label")[0]);
	same(check.button("widget").end()[0], check[0]);
	
	var radio = $("#radio01").button();
	same(radio.button("widget")[0], radio.next("label")[0]);
	same(radio.button("widget").end()[0], radio[0]);
});

})(jQuery);
