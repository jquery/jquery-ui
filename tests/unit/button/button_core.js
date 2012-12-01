/*
 * button_core.js
 */


(function($) {

module("button: core");

test("checkbox", function() {
	expect( 4 );
	var input = $("#check"),
		label = $("label[for=check]");
	ok( input.is(":visible") );
	ok( label.is(":not(.ui-button)") );
	input.button();
	ok( input.is(".ui-helper-hidden-accessible") );
	ok( label.is(".ui-button") );
});

test("radios", function() {
	expect( 4 );
	var inputs = $("#radio0 input"),
		labels = $("#radio0 label");
	ok( inputs.is(":visible") );
	ok( labels.is(":not(.ui-button)") );
	inputs.button();
	ok( inputs.is(".ui-helper-hidden-accessible") );
	ok( labels.is(".ui-button") );
});

function assert(noForm, form1, form2) {
	ok( $("#radio0 input" + noForm).is(":checked") );
	ok( $("#radio1 input" + form1).is(":checked") );
	ok( $("#radio2 input" + form2).is(":checked") );
	var buttons0 = $("#radio0 .ui-button"),
		buttons1 = $("#radio1 .ui-button"),
		buttons2 = $("#radio2 .ui-button");
	//active class
	ok( buttons0.filter(noForm).is(".ui-state-active") );
	ok( buttons1.filter(form1).is(".ui-state-active") );
	ok( buttons2.filter(form2).is(".ui-state-active") );
	//aria-pressed
	ok( buttons0.filter(noForm).attr("aria-pressed") === "true" );
	ok( buttons1.filter(form1).attr("aria-pressed") === "true" );
	ok( buttons2.filter(form2).attr("aria-pressed") === "true" );
	//check if ui-state-active class was removed from previously checked radios
	ok( buttons0.not(noForm + ", .ui-state-active").length === 2 );
	ok( buttons1.not(form1 + ", .ui-state-active").length === 2 );
	ok( buttons2.not(form2 + ", .ui-state-active").length === 2 );
	//check if aria-pressed is set to false for previously checked radios
	ok( buttons0.not(noForm).filter('[aria-pressed=false]').length === 2 );
	ok( buttons1.not(form1).filter('[aria-pressed=false]').length === 2 );
	ok( buttons2.not(form2).filter('[aria-pressed=false]').length === 2 );
}

test("radio groups", function() {
	expect( 60 );
	$("input[type=radio]").button();
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
	expect( 2 );
	var input = $("#submit");
	deepEqual( input.children().length, 0 );
	input.button();
	deepEqual( input.children().length, 0 );
});

test("buttonset", function() {
	expect( 6 );
	var set = $("#radio1").buttonset();
	ok( set.is(".ui-buttonset") );
	deepEqual( set.children(".ui-button").length, 3 );
	deepEqual( set.children("input[type=radio].ui-helper-hidden-accessible").length, 3 );
	ok( set.children("label:eq(0)").is(".ui-button.ui-corner-left:not(.ui-corner-all)") );
	ok( set.children("label:eq(1)").is(".ui-button:not(.ui-corner-all)") );
	ok( set.children("label:eq(2)").is(".ui-button.ui-corner-right:not(.ui-corner-all)") );
});

test("buttonset (rtl)", function() {
	expect( 6 );
	var set,
		parent = $("#radio1").parent();
	// Set to rtl
	parent.attr("dir", "rtl");

	set = $("#radio1").buttonset();
	ok( set.is(".ui-buttonset") );
	deepEqual( set.children(".ui-button").length, 3 );
	deepEqual( set.children("input[type=radio].ui-helper-hidden-accessible").length, 3 );
	ok( set.children("label:eq(0)").is(".ui-button.ui-corner-right:not(.ui-corner-all)") );
	ok( set.children("label:eq(1)").is(".ui-button:not(.ui-corner-all)") );
	ok( set.children("label:eq(2)").is(".ui-button.ui-corner-left:not(.ui-corner-all)") );
});

// TODO: simulated click events don't behave like real click events in IE
// remove this when simulate properly simulates this
// see http://yuilibrary.com/projects/yui2/ticket/2528826 fore more info
//if ( !$.ui.ie || ( document.documentMode && document.documentMode > 8 ) ) {
	test( "ensure checked and aria after single click on checkbox label button, see #5518", function() {
		expect( 3 );

		$("#check2").button().change( function() {
			var lbl = $( this ).button("widget");
			ok( this.checked, "checked ok" );
			ok( lbl.attr("aria-pressed") === "true", "aria ok" );
			ok( lbl.hasClass("ui-state-active"), "ui-state-active ok" );
		}).button("widget").click();

		// support: Opera
		// Opera doesn't trigger a change event when this is done synchronously.
		// This seems to be a side effect of another test, but until that can be
		// tracked down, this delay will have to do.
		//setTimeout(function() {
		//	$("#check2").button("widget").mousedown().mouseup()/*.simulate("click")*/;
		//	start();
		//}, 1 );
	});
//}

})(jQuery);
