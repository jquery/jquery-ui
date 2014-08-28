/*
 * checkboxradio_core.js
 */


(function($) {

module("Checkboxradio: core");
test("Checkbox", function() {
	expect( 4 );
	var input = $("#check"),
		label = $("label[for=check]");
	ok( input.is( ":visible" ) );
	ok( !label.hasClass(".ui-button)") );
	input.checkboxradio();
	strictEqual( input.attr( "class" ), "ui-helper-hidden-accessible ui-checkboxradio" );
	strictEqual( label.attr( "class" ), "ui-button ui-widget ui-corner-all ui-checkbox-label" );
});

test("Radios", function() {
	expect( 4 );
	var inputs = $("#radio0 input"),
		labels = $("#radio0 label");
	ok( inputs.is(":visible") );
	ok( labels.is(":not(.ui-button)") );
	inputs.checkboxradio();
	ok( inputs.is(".ui-helper-hidden-accessible") );
	ok( labels.is(".ui-button") );
});

function assert(noForm, form1, form2) {
	ok( $("#radio0 .ui-button" + noForm).is(".ui-state-active") );
	ok( $("#radio1 .ui-button" + form1).is(".ui-state-active") );
	ok( $("#radio2 .ui-button" + form2).is(".ui-state-active") );
}

test("radio groups", function() {
	expect( 12 );
	$("input[type=radio]").checkboxradio();
	assert(":eq(0)", ":eq(1)", ":eq(2)");

	// click outside of forms
	$("#radio0 .ui-button:eq(1)").simulate("click");
	assert(":eq(1)", ":eq(1)", ":eq(2)");

	// click in first form
	$("#radio1 .ui-button:eq(0)").simulate("click");
	assert(":eq(1)", ":eq(0)", ":eq(2)");

	// click in second form
	$("#radio2 .ui-button:eq(0)").simulate("click");
	assert(":eq(1)", ":eq(0)", ":eq(0)");
});

asyncTest( "Checkbox/Radiobutton do not Show Focused State when using Keyboard Navigation", function() {
	expect( 2 );
	var check = $( "#check" ).checkboxradio(),
		label = $( "label[for='check']" );
	ok( !label.is( ".ui-state-focus" ) );
	check.focus();
	setTimeout(function() {
		ok( label.is( ".ui-state-focus" ) );
		start();
	});
});

// TODO: simulated click events don't behave like real click events in IE
// remove this when simulate properly simulates this
// see http://yuilibrary.com/projects/yui2/ticket/2528826 fore more info
if ( !$.ui.ie || ( document.documentMode && document.documentMode > 8 ) ) {
	asyncTest( "Ensure checked after single click on checkbox label button", function() {
		expect( 2 );

		$( "#check2" ).checkboxradio().change( function() {
			var label = $( this ).checkboxradio( "widget" );
			ok( this.checked, "checked ok" );

			// The following test is commented out for now because with new markup we are trying to avoid aria
			//ok( lbl.attr("aria-pressed") === "true", "aria ok" );
			ok( label.hasClass( "ui-state-active" ), "ui-state-active ok" );
		});

		// Support: Opera
		// Opera doesn't trigger a change event when this is done synchronously.
		// This seems to be a side effect of another test, but until that can be
		// tracked down, this delay will have to do.
		setTimeout(function() {
			$( "#check2" ).checkboxradio( "widget" ).simulate( "click" );
			start();
		}, 1 );
	});
}
test( "Checkbox creation that requires a matching label does not find label in all cases", function() {
	expect( 5 );
	var group = $( "<span><label for='t7092a'></label><input type='checkbox' id='t7092a'></span>" );
	group.find( "input[type=checkbox]" ).checkboxradio();
	ok( group.find( "label" ).is( ".ui-button" ) );

	group = $( "<input type='checkbox' id='t7092b'><label for='t7092b'></label>" );
	group.filter( "input[type=checkbox]" ).checkboxradio();
	ok( group.filter( "label" ).is( ".ui-button" ) );

	group = $( "<span><input type='checkbox' id='t7092c'></span><label for='t7092c'></label>" );
	group.find( "input[type=checkbox]" ).checkboxradio();
	ok( group.filter( "label" ).is( ".ui-button" ) );

	group = $( "<span><input type='checkbox' id='t7092d'></span><span><label for='t7092d'></label></span>" );
	group.find( "input[type=checkbox]" ).checkboxradio();
	ok( group.find( "label" ).is( ".ui-button" ) );

	group = $( "<input type='checkbox' id='t7092e'><span><label for='t7092e'></label></span>" );
	group.filter( "input[type=checkbox]" ).checkboxradio();
	ok( group.find( "label" ).is( ".ui-button" ) );
});

asyncTest( "Resetting a button's form should refresh the visual state of the button widget to match.", function() {
	expect( 2 );
	var form = $( "<form>" +
		"<label for='c1'></label><input id='c1' type='checkbox' checked>" +
		"</form>" ),
		checkbox = form.find( "input[type=checkbox]" ).checkboxradio();

	checkbox.prop( "checked", false ).checkboxradio( "refresh" );
	ok( !checkbox.checkboxradio( "widget" ).hasClass( "ui-state-active" ) );

	form.get( 0 ).reset();

	setTimeout(function() {
		ok( checkbox.checkboxradio( "widget" ).hasClass( "ui-state-active" ));
		start();
	}, 1 );
});
test( "Checkbox label selector works for ids with \":\"", function() {
	expect( 1 );
	var group = $( "<span><input type='checkbox' id='check:7534'><label for='check:7534'>Label</label></span>" );
	group.find( "input" ).checkboxradio();
	ok( group.find( "label" ).is( ".ui-button" ), "Found an id with a :" );
});

})(jQuery);
