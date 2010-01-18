/*
 * button_core.js
 */


(function($) {

module("button: core");

test("checkbox", function() {
	var input = $("#check");
		label = $("label[for=check]");
	ok( input.is(":visible") );	
	ok( label.is(":not(.ui-button)") );
	input.button();
	ok( input.is(":hidden") );
	ok( label.is(".ui-button") );
});

test("radios", function() {
	var inputs = $("#radio0 input");
		labels = $("#radio0 label");
	ok( inputs.is(":visible") );	
	ok( labels.is(":not(.ui-button)") );
	inputs.button();
	ok( inputs.is(":hidden") );
	ok( labels.is(".ui-button") );
});

function assert(noForm, form1, form2) {
	ok( $("#radio0 .ui-button" + noForm).is(".ui-state-active") );
	ok( $("#radio1 .ui-button" + form1).is(".ui-state-active") );
	ok( $("#radio2 .ui-button" + form2).is(".ui-state-active") );
}

test("radio groups", function() {
	$(":radio").button();
	assert(":eq(0)", ":eq(1)", ":eq(2)");
	
	// click outside of forms
	$("#radio0 .ui-button:eq(1)").click();
	assert(":eq(1)", ":eq(1)", ":eq(2)");
	
	// click in first form
	$("#radio1 .ui-button:eq(0)").click();
	assert(":eq(1)", ":eq(0)", ":eq(2)");
	
	// click in second form
	$("#radio2 .ui-button:eq(0)").click();
	assert(":eq(1)", ":eq(0)", ":eq(0)");
});

test("input type submit, don't create child elements", function() {
	var input = $("#submit")
	same( input.children().length, 0 );
	input.button();
	same( input.children().length, 0 );
});

test("buttonset", function() {
	var set = $("#radio1").buttonset();
	ok( set.is(".ui-button-set") );
	same( set.children(".ui-button").length, 3 );
	same( set.children("input:radio:hidden").length, 3 );
	ok( set.children("label:eq(0)").is(".ui-button.ui-corner-left:not(.ui-corner-all)") );
	ok( set.children("label:eq(1)").is(".ui-button:not(.ui-corner-all)") );
	ok( set.children("label:eq(2)").is(".ui-button.ui-corner-right:not(.ui-corner-all)") );
});

})(jQuery);
