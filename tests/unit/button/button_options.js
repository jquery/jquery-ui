/*
 * button_options.js
 */
(function($) {

module("button: options");

test("disabled, explicity value", function() {
	$("#radio01").button({ disabled: false });
	same(false, $("#radio01").button("option", "disabled"),
		"disabled option set to false");
	same(false, $("#radio01").attr("disabled"), "element is disabled");
	
	$("#radio02").button({ disabled: true });
	same(true, $("#radio02").button("option", "disabled"),
		"disabled option set to true");
	same(true, $("#radio02").attr("disabled"), "element is not disabled");
});

test("disabled, null", function() {
	$("#radio01").button({ disabled: null });
	same(false, $("#radio01").button("option", "disabled"),
		"disabled option set to false");
	same(false, $("#radio01").attr("disabled"), "element is disabled");
	
	$("#radio02").attr("disabled", "disabled").button({ disabled: null });
	same(true, $("#radio02").button("option", "disabled"),
		"disabled option set to true");
	same(true, $("#radio02").attr("disabled"), "element is not disabled");
});

test("text false without icon", function() {
	$("#button").button({
		text: false
	});
	ok( $("#button").is(".ui-button-text-only:not(.ui-button-icon-only)") );
	
	$("#button").button("destroy");
});

test("text false with icon", function() {
	$("#button").button({
		text: false,
		icons: {
			primary: "iconclass"
		}
	});
	ok( $("#button").is(".ui-button-icon-only:not(.ui-button-text):has(span.ui-icon.iconclass)") );
	
	$("#button").button("destroy");
});

test("label, default", function() {
	$("#button").button();
	same( $("#button").text(), "Label" );
	
	$("#button").button("destroy");
});

test("label", function() {
	$("#button").button({
		label: "xxx"
	});
	same( $("#button").text(), "xxx" );
	
	$("#button").button("destroy");
});

test("label default with input type submit", function() {
	same( $("#submit").button().val(), "Label" );
});

test("label with input type submit", function() {
	var label = $("#submit").button({
		label: "xxx"
	}).val();
	same( label, "xxx" );
});

test("icons", function() {
	$("#button").button({
		text: false,
		icons: {
			primary: "iconclass",
			secondary: "iconclass2"
		}
	});
	ok( $("#button").is(":has(span.ui-icon.ui-button-icon-primary.iconclass):has(span.ui-icon.ui-button-icon-secondary.iconclass2)") );
	
	$("#button").button("destroy");
});

})(jQuery);
