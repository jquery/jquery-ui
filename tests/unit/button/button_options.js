/*
 * button_options.js
 */
(function($) {

module( "button: options" );

test( "disabled, explicit value", function( assert ) {
	expect( 9 );

	var element = $( "#button" ).button({ disabled: false });
	deepEqual( element.button( "option", "disabled" ), false, "disabled option set to false" );
	deepEqual( element.prop( "disabled" ), false, "Disabled property is false" );

	assert.lacksClasses( element.button( "widget" ), "ui-state-disabled" );
	assert.lacksClasses( element.button( "widget" ), "ui-button-disabled" );

	element = $( "#button" ).button({ disabled: true });

	assert.hasClasses( element.button( "widget" ), "ui-state-disabled" );
	ok( !element.button( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	assert.hasClasses( element.button( "widget" ), "ui-button-disabled" );

	deepEqual( element.button( "option", "disabled" ), true, "disabled option set to true" );
	deepEqual( element.prop( "disabled" ), true, "Disabled property is set" );
});

// We are testing the default here because the default null is a special value which means to check
// the DOM, so we need to make sure this happens correctly checking the options should never return
// null. It should always be true or false
test( "disabled, null", function() {
	expect( 4 );
	var element = $( "#button" ),
		elementDisabled = $( "#button-disabled" );
	element.add( elementDisabled ).button({ disabled: null });
	strictEqual( element.button("option", "disabled"), false,
		"disabled option set to false");
	strictEqual( element.prop("disabled"), false, "element is disabled");
	strictEqual( elementDisabled.button("option", "disabled"), true,
		"disabled option set to false");
	strictEqual( elementDisabled.prop("disabled"), true, "element is disabled");
});

test( "showLabel, false, without icon", function( assert ) {
	expect( 1 );

	var button = $( "#button" );
	button.button({
		showLabel: false
	});
	assert.hasClasses( button, "ui-corner-all ui-widget" );

	button.button( "destroy" );
});

test( "showLabel, false, with icon", function( assert ) {
	expect( 1 );
	$("#button").button({
		showLabel: false,
		icon: "iconclass"
	});
	assert.hasClasses( $( "#button" ), "ui-button ui-corner-all ui-widget ui-button-icon-only",
		true, "Button has correct classes" );
});

test( "label, default", function() {
	expect( 2 );
	$( "#button" ).button();
	deepEqual( $( "#button" ).text(), "Label" );
	deepEqual( $( "#button" ).button( "option", "label" ), "Label" );
});

test( "label, explicit value", function() {
	expect( 2 );
	$( "#button" ).button({
		label: "xxx"
	});
	deepEqual( $( "#button" ).text(), "xxx" );
	deepEqual( $( "#button" ).button( "option", "label" ), "xxx" );
});

test( "label, default, with input type submit", function() {
	expect( 2 );
	deepEqual( $( "#submit" ).button().val(), "Label" );
	deepEqual( $( "#submit" ).button( "option", "label" ), "Label" );
});

test( "label, explicit value, with input type submit", function() {
	expect( 2 );
	var label = $( "#submit" ).button({
		label: "xxx"
	}).val();
	deepEqual( label, "xxx" );
	deepEqual( $( "#submit" ).button( "option", "label" ), "xxx" );
});

test( "icon", function() {
	expect( 1 );
	$("#button").button({
		showLabel: false,
		icon: "iconclass"
	});
	strictEqual( $( "#button" ).find( "span.ui-icon.iconclass" ).length, 1 );
});

})(jQuery);