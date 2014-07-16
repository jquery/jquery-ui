/*
 * button_options.js
 */
(function($) {

module( "button: options" );

test( "disabled, explicit value", function() {
	expect( 9 );

	var element = $( "#radio01" ).button({ disabled: false });
	deepEqual( element.button( "option", "disabled" ), false, "disabled option set to false" );
	deepEqual( element.prop( "disabled" ), false, "element is disabled" );

	ok( !element.button( "widget" ).hasClass( "ui-state-disabled" ), "element gets ui-state-disabled" );
	ok( !element.button( "widget" ).hasClass( "ui-button-disabled" ), "element gets ui-button-disabled" );

	element = $( "#radio02" ).button({ disabled: true });

	ok( element.button( "widget" ).hasClass( "ui-state-disabled" ), "element gets ui-state-disabled" );
	ok( !element.button( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	ok( element.button( "widget" ).hasClass( "ui-button-disabled" ), "element gets ui-button-disabled" );

	deepEqual( element.button( "option", "disabled" ), true, "disabled option set to true" );
	deepEqual( element.prop( "disabled" ), true, "element is not disabled" );
});

test( "disabled, null", function() {
	expect( 4 );
	$( "#radio01" ).button({ disabled: null });
	strictEqual( $("#radio01").button("option", "disabled"), false,
		"disabled option set to false");
	strictEqual( $("#radio01").prop("disabled"), false, "element is disabled");

	$( "#radio02" ).prop( "disabled", true ).button({ disabled: null });
	deepEqual( true, $( "#radio02" ).button( "option", "disabled" ),
		"disabled option set to true" );
	deepEqual( true, $( "#radio02" ).prop( "disabled" ), "element is not disabled" );
});

test( "showLabel false without icon", function() {
	expect( 1 );
	$( "#button" ).button({
		showLabel: false
	});
	strictEqual( $( "#button" ).attr( "class" ), "ui-button ui-widget ui-corner-all" );

	$( "#button" ).button( "destroy" );
});

test("showLabel false with icon", function() {
	expect( 1 );
	$("#button").button({
		showLabel: false,
		icon: "iconclass"
	});
	strictEqual( $( "#button" ).attr( "class" ), "ui-button ui-widget ui-corner-all ui-icon-beginning ui-button-icon-only" );

	$( "#button" ).button( "destroy" );
});

test( "label, default", function() {
	expect( 2 );
	$( "#button" ).button();
	deepEqual( $( "#button" ).text(), "Label" );
	deepEqual( $( "#button" ).button( "option", "label" ), "Label" );

	$( "#button" ).button( "destroy" );
});

test( "label", function() {
	expect( 2 );
	$( "#button" ).button({
		label: "xxx"
	});
	deepEqual( $( "#button" ).text(), "xxx" );
	deepEqual( $( "#button" ).button( "option", "label" ), "xxx" );

	$( "#button" ).button( "destroy" );
});

test( "label default with input type submit", function() {
	expect( 2 );
	deepEqual( $( "#submit" ).button().val(), "Label" );
	deepEqual( $( "#submit" ).button( "option", "label" ), "Label" );
});

test( "label with input type submit", function() {
	expect( 2 );
	var label = $( "#submit" ).button({
		label: "xxx"
	}).val();
	deepEqual( label, "xxx" );
	deepEqual( $( "#submit" ).button( "option", "label" ), "xxx" );
});

test( "icons", function() {
	expect( 1 );
	$("#button").button({
		showLabel: false,
		icon: "iconclass"
	});
	strictEqual( $( "#button" ).find( "span.ui-icon.iconclass" ).length, 1 );

	$( "#button" ).button( "destroy" );
});

})(jQuery);
