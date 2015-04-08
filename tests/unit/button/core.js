define( [
	"jquery",
	"ui/button"
], function( $ ) {

module("button: core");

test("checkbox", function( assert ) {
	expect( 4 );
	var input = $("#check"),
		label = $("label[for=check]");
	ok( input.is(":visible") );
	ok( label.is(":not(.ui-button)") );
	input.button();
	assert.hasClasses( input, "ui-helper-hidden-accessible" );
	assert.hasClasses( label, "ui-button" );
});

test("radios", function( assert ) {
	expect( 8 );
	var inputs = $("#radio0 input"),
		labels = $("#radio0 label");
	ok( inputs.is(":visible") );
	ok( labels.is(":not(.ui-button)") );
	inputs.button();
	inputs.each(function() {
		assert.hasClasses( this, "ui-helper-hidden-accessible" );
	});
	labels.each(function() {
		assert.hasClasses( this, "ui-button" );
	});
});

test("radio groups", function( assert ) {
	expect( 12 );

	function assertClasses(noForm, form1, form2) {
		assert.hasClasses( $("#radio0 .ui-button" + noForm ), "ui-state-active" );
		assert.hasClasses( $("#radio1 .ui-button" + form1 ), "ui-state-active" );
		assert.hasClasses( $("#radio2 .ui-button" + form2 ), "ui-state-active" );
	}

	$("input[type=radio]").button();
	assertClasses(":eq(0)", ":eq(1)", ":eq(2)");

	// click outside of forms
	$("#radio0 .ui-button:eq(1)").click();
	assertClasses(":eq(1)", ":eq(1)", ":eq(2)");

	// click in first form
	$("#radio1 .ui-button:eq(0)").click();
	assertClasses(":eq(1)", ":eq(0)", ":eq(2)");

	// click in second form
	$("#radio2 .ui-button:eq(0)").click();
	assertClasses(":eq(1)", ":eq(0)", ":eq(0)");
});

test( "radio groups - ignore elements with same name", function() {
	expect( 1 );
	var form = $( "form:first" ),
		radios = form.find( "[type=radio]" ).button(),
		checkbox = $( "<input>", {
			type: "checkbox",
			name: radios.attr( "name" )
		});

	form.append( checkbox );
	radios.button( "refresh" );
	ok( true, "no exception from accessing button instance of checkbox" );
});

test("input type submit, don't create child elements", function() {
	expect( 2 );
	var input = $("#submit");
	deepEqual( input.children().length, 0 );
	input.button();
	deepEqual( input.children().length, 0 );
});

test("buttonset", function( assert ) {
	expect( 6 );
	var set = $("#radio1").buttonset();
	assert.hasClasses( set, "ui-buttonset" );
	deepEqual( set.children(".ui-button").length, 3 );
	deepEqual( set.children("input[type=radio].ui-helper-hidden-accessible").length, 3 );
	ok( set.children("label:eq(0)").is(".ui-button.ui-corner-left:not(.ui-corner-all)") );
	ok( set.children("label:eq(1)").is(".ui-button:not(.ui-corner-all)") );
	ok( set.children("label:eq(2)").is(".ui-button.ui-corner-right:not(.ui-corner-all)") );
});

test("buttonset (rtl)", function( assert ) {
	expect( 6 );
	var set,
		parent = $("#radio1").parent();
	// Set to rtl
	parent.attr("dir", "rtl");

	set = $("#radio1").buttonset();
	assert.hasClasses( set, "ui-buttonset" );
	deepEqual( set.children(".ui-button").length, 3 );
	deepEqual( set.children("input[type=radio].ui-helper-hidden-accessible").length, 3 );
	ok( set.children("label:eq(0)").is(".ui-button.ui-corner-right:not(.ui-corner-all)") );
	ok( set.children("label:eq(1)").is(".ui-button:not(.ui-corner-all)") );
	ok( set.children("label:eq(2)").is(".ui-button.ui-corner-left:not(.ui-corner-all)") );
});

// TODO: simulated click events don't behave like real click events in IE
// remove this when simulate properly simulates this
// see http://yuilibrary.com/projects/yui2/ticket/2528826 fore more info
if ( !$.ui.ie || ( document.documentMode && document.documentMode > 8 ) ) {
	asyncTest( "ensure checked and aria after single click on checkbox label button, see #5518", function( assert ) {
		expect( 3 );

		$("#check2").button().change( function() {
			var lbl = $( this ).button("widget");
			ok( this.checked, "checked ok" );
			ok( lbl.attr("aria-pressed") === "true", "aria ok" );
			assert.hasClasses( lbl, "ui-state-active" );
		});

		// support: Opera
		// Opera doesn't trigger a change event when this is done synchronously.
		// This seems to be a side effect of another test, but until that can be
		// tracked down, this delay will have to do.
		setTimeout(function() {
			$("#check2").button("widget").simulate("click");
			start();
		}, 1 );
	});
}

test( "#7092 - button creation that requires a matching label does not find label in all cases", function( assert ) {
	expect( 5 );
	var group = $( "<span><label for='t7092a'></label><input type='checkbox' id='t7092a'></span>" );
	group.find( "input[type=checkbox]" ).button();
	assert.hasClasses( group.find( "label" ), "ui-button" );

	group = $( "<input type='checkbox' id='t7092b'><label for='t7092b'></label>" );
	group.filter( "input[type=checkbox]" ).button();
	assert.hasClasses( group.filter( "label" ), "ui-button" );

	group = $( "<span><input type='checkbox' id='t7092c'></span><label for='t7092c'></label>" );
	group.find( "input[type=checkbox]" ).button();
	assert.hasClasses( group.filter( "label" ), "ui-button" );

	group = $( "<span><input type='checkbox' id='t7092d'></span><span><label for='t7092d'></label></span>" );
	group.find( "input[type=checkbox]" ).button();
	assert.hasClasses( group.find( "label" ), "ui-button" );

	group = $( "<input type='checkbox' id='t7092e'><span><label for='t7092e'></label></span>" );
	group.filter( "input[type=checkbox]" ).button();
	assert.hasClasses( group.find( "label" ), "ui-button" );
});

test( "#5946 - buttonset should ignore buttons that are not :visible", function( assert ) {
	expect( 2 );
	$( "#radio01" ).next().addBack().hide();
	var set = $( "#radio0" ).buttonset({ items: "input[type=radio]:visible" });
	ok( set.find( "label:eq(0)" ).is( ":not(.ui-button):not(.ui-corner-left)" ) );
	assert.hasClasses( set.find( "label:eq(1)" ), "ui-button ui-corner-left" );
});

test( "#6262 - buttonset not applying ui-corner to invisible elements", function( assert ) {
	expect( 3 );
	$( "#radio0" ).hide();
	var set = $( "#radio0" ).buttonset();
	assert.hasClasses( set.find( "label:eq(0)" ), "ui-button ui-corner-left" );
	assert.hasClasses( set.find( "label:eq(1)" ), "ui-button" );
	assert.hasClasses( set.find( "label:eq(2)" ), "ui-button ui-corner-right" );

});

asyncTest( "Resetting a button's form should refresh the visual state of the button widget to match.", function( assert ) {
	expect( 2 );
	var form = $( "<form>" +
		"<button></button>" +
		"<label for='c1'></label><input id='c1' type='checkbox' checked>" +
		"</form>" ),
		button = form.find( "button" ).button(),
		checkbox = form.find( "input[type=checkbox]" ).button();

	checkbox.prop( "checked", false ).button( "refresh" );
	assert.lacksClasses( checkbox.button( "widget" ), "ui-state-active" );

	form.get( 0 ).reset();

	// #9213: If a button has been removed, refresh should not be called on it when
	// its corresponding form is reset.
	button.remove();

	setTimeout(function() {
		assert.hasClasses( checkbox.button( "widget" ), "ui-state-active" );
		start();
	}, 1 );
});

asyncTest( "#6711 Checkbox/Radiobutton do not Show Focused State when using Keyboard Navigation", function( assert ) {
	expect( 2 );
	var check = $( "#check" ).button(),
		label = $( "label[for='check']" );
	assert.lacksClasses( label, "ui-state-focus" );
	check.focus();
	setTimeout(function() {
		assert.hasClasses( label, "ui-state-focus" );
		start();
	});
});

test( "#7534 - Button label selector works for ids with \":\"", function( assert ) {
	expect( 1 );
	var group = $( "<span><input type='checkbox' id='check:7534'><label for='check:7534'>Label</label></span>" );
	group.find( "input" ).button();
	assert.hasClasses( group.find( "label" ), "ui-button" , "Found an id with a :" );
});

asyncTest( "#9169 - Disabled button maintains ui-state-focus", function( assert ) {
	expect( 2 );
	var element = $( "#button1" ).button();
	element[ 0 ].focus();
	setTimeout(function() {
		assert.hasClasses( element, "ui-state-focus" );
		element.button( "disable" );
		assert.lacksClasses( element, "ui-state-focus",
			"button does not have ui-state-focus when disabled" );
		start();
	});
});

} );
