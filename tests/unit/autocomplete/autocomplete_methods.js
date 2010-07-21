/*
 * autocomplete_methods.js
 */
(function($) {


module("autocomplete: methods", {
	teardown: function() {
		$( ":ui-autocomplete" ).autocomplete( "destroy" );
	}
});

test("destroy", function() {
	var beforeHtml = $("#autocomplete").parent().html();
	var afterHtml = $("#autocomplete").autocomplete().autocomplete("destroy").parent().html();
	// Opera 9 outputs role="" instead of removing the attribute like everyone else
	if ($.browser.opera) {
		afterHtml = afterHtml.replace(/ role=""/g, "");
	}
	equal( afterHtml, beforeHtml, "before/after html should be the same" );
})

var data = ["c++", "java", "php", "coldfusion", "javascript", "asp", "ruby", "python", "c", "scala", "groovy", "haskell", "perl"];

test("search", function() {
	var ac = $("#autocomplete").autocomplete({
		source: data,
		minLength: 0
	});
	ac.autocomplete("search");
	same( $(".ui-menu .ui-menu-item").length, data.length, "all items for a blank search" );
	
	ac.val("has");
	ac.autocomplete("search")
	same( $(".ui-menu .ui-menu-item").text(), "haskell", "only one item for set input value" );
	
	ac.autocomplete("search", "ja");
	same( $(".ui-menu .ui-menu-item").length, 2, "only java and javascript for 'ja'" );
	
	$("#autocomplete").autocomplete("destroy");
})

})(jQuery);
