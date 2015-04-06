define( [
	"jquery",
	"ui/button"
], function( $ ) {

module( "button: options" );

test( "disabled, explicit value", function( assert ) {
	expect( 7 );

	var element = $( "#radio01" ).button({ disabled: false });
	deepEqual( element.button( "option", "disabled" ), false, "disabled option set to false" );
	deepEqual( element.prop( "disabled" ), false, "element is disabled" );

	assert.lacksClasses( element.button( "widget" ), "ui-state-disabled ui-button-disabled" );

	element = $( "#radio02" ).button({ disabled: true });

	ok( !element.button( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.button( "widget" ), "ui-button-disabled ui-state-disabled" );

	deepEqual( element.button( "option", "disabled" ), true, "disabled option set to true" );
	deepEqual( element.prop( "disabled" ), true, "element is not disabled" );
});

test("disabled, null", function() {
	expect( 4 );
	$("#radio01").button({ disabled: null });
	deepEqual(false, $("#radio01").button("option", "disabled"),
		"disabled option set to false");
	deepEqual(false, $("#radio01").prop("disabled"), "element is disabled");

	$("#radio02").prop("disabled", true).button({ disabled: null });
	deepEqual(true, $("#radio02").button("option", "disabled"),
		"disabled option set to true");
	deepEqual(true, $("#radio02").prop("disabled"), "element is not disabled");
});

test( "disabled, ui-state-active is removed unless checkbox or radio", function( assert ) {
	expect( 12 );
	var elements = [
		$( "<input type='button'>" ),
		$( "<button></button>" ),
		$( "<a></a>" ),
		$( "<div></div>" ),
		$( "<input type='checkbox' id='checkbox' checked><label for='checkbox'></label>" ),
		$( "<input type='radio' id='radio' checked><label for='radio'></label>" )
	];

	$.each( elements, function() {
		var element = $( this ).first().button(),
			buttonElement = element.button( "widget" ),
			elementType = element.prop( "nodeName" ).toLowerCase();

		if ( element.is( "input" ) ) {
			elementType += ":" + element.attr( "type" );
		}

		element.trigger( "mousedown" );
		assert.hasClasses( buttonElement, "ui-state-active",
			"[" + elementType + "] has ui-state-active class after mousedown." );

		element.button( "disable" );
		if ( element.is( "[type=checkbox], [type=radio]" ) ) {
		assert.hasClasses( buttonElement, "ui-state-active",
				"Disabled [" + elementType + "] has ui-state-active class." );
		} else {
			assert.lacksClasses( buttonElement, "ui-state-active",
				"Disabled [" + elementType + "] does not have ui-state-active class." );
		}
	});
});

test("text false without icon", function() {
	expect( 1 );
	$("#button").button({
		text: false
	});
	ok( $("#button").is(".ui-button-text-only:not(.ui-button-icon-only)") );

	$("#button").button("destroy");
});

test("text false with icon", function() {
	expect( 1 );
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
	expect( 2 );
	$("#button").button();
	deepEqual( $("#button").text(), "Label" );
	deepEqual( $( "#button").button( "option", "label" ), "Label" );

	$("#button").button("destroy");
});

test("label", function() {
	expect( 2 );
	$("#button").button({
		label: "xxx"
	});
	deepEqual( $("#button").text(), "xxx" );
	deepEqual( $("#button").button( "option", "label" ), "xxx" );

	$("#button").button("destroy");
});

test("label default with input type submit", function() {
	expect( 2 );
	deepEqual( $("#submit").button().val(), "Label" );
	deepEqual( $("#submit").button( "option", "label" ), "Label" );
});

test("label with input type submit", function() {
	expect( 2 );
	var label = $("#submit").button({
		label: "xxx"
	}).val();
	deepEqual( label, "xxx" );
	deepEqual( $("#submit").button( "option", "label" ), "xxx" );
});

test("icons", function() {
	expect( 1 );
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

test( "#5295 - button does not remove hoverstate if disabled" , function( assert ) {
	expect( 1 );
	var btn = $("#button").button();
	btn.hover( function() {
		btn.button( "disable" );
	});
	btn.trigger( "mouseenter" );
	btn.trigger( "mouseleave" );
	assert.lacksClasses( btn, "ui-state-hover" );
});

} );
