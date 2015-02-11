/*
* checkboxradio_methods.js
*/


(function($) {

module( "Checkboxradio: methods" );
test( "Checkbox: refresh", function( assert ) {
	var widget, icon,
		checkbox = $( "#checkbox-method-refresh" );
	expect( 11 );
	checkbox.checkboxradio();

	widget = checkbox.checkboxradio( "widget" );
	strictEqual( widget.find( ".ui-icon" ).length, 1,
		"There is initally one icon" );
	widget.find( ".ui-icon" ).eq( 0 ).remove();
	checkbox.checkboxradio( "refresh" );
	icon = widget.find( ".ui-icon" );
	strictEqual( icon.length, 1,
		"Icon is recreated on refresh if absent" );

	assert.hasClasses( icon, "ui-icon-blank" );
	assert.lacksClasses( icon, "ui-icon-check" );
	assert.lacksClasses( widget, "ui-checkboxradio-checked" );

	checkbox.prop( "checked", true );
	checkbox.checkboxradio( "refresh" );
	assert.hasClasses( icon, "ui-icon-check" );
	assert.lacksClasses( icon, "ui-icon-blank" );
	assert.hasClasses( widget, "ui-checkboxradio-checked" );

	checkbox.prop( "checked", false );
	checkbox.checkboxradio( "refresh" );
	assert.hasClasses( icon, "ui-icon-blank" );
	assert.lacksClasses( icon, "ui-icon-check" );
	assert.lacksClasses( widget, "ui-checkboxradio-checked" );
});

test( "Checkbox: destroy", function(){
	expect( 1 );
	domEqual( "#checkbox-method-destroy", function() {
		$( "#checkbox-method-destroy" ).checkboxradio().checkboxradio( "destroy" );
	});
});

test( "Checkbox: disable / enable", function( assert ) {
	var checkbox = $( "#checkbox-method-disable" ),
		widget = checkbox.checkboxradio().checkboxradio( "widget" );

	expect( 4 );
	checkbox.checkboxradio( "disable" );
	assert.hasClasses( widget, "ui-state-disabled",
		"label gets ui-state-disabled when disable is called" );
	strictEqual( checkbox.is( ":disabled" ), true,
		"checkbox is disabled when disable is called" );
	checkbox.checkboxradio( "enable" );
	assert.lacksClasses( widget, "ui-state-disabled",
		"label has ui-state-disabled removed when enable is called" );
	strictEqual( checkbox.is( ":disabled" ), false,
		"checkbox has disabled prop removed when enable is called" );
});
test( "Checkbox: widget returns the label", function(){
	var checkbox = $( "#checkbox-method-refresh" ),
		label = $( "#checkbox-method-refresh-label" );

	expect( 1 );

	checkbox.checkboxradio();
	strictEqual( checkbox.checkboxradio( "widget" )[ 0 ], label[ 0 ],
		"widget method returns label" );
});

test( "Radio: refresh", function( assert ) {
	var radio = $( "#radio-method-refresh" ),
		widget, icon;
	expect( 8 );
	radio.checkboxradio();

	widget = radio.checkboxradio( "widget" );
	strictEqual( widget.find( ".ui-icon" ).length, 1,
		"There is initally one icon" );
	widget.find( ".ui-icon" ).eq( 0 ).remove();
	radio.checkboxradio( "refresh" );
	icon = widget.find( ".ui-icon" );
	strictEqual( icon.length, 1,
		"Icon is recreated on refresh if absent" );

	assert.hasClasses( icon, "ui-icon-blank" );
	assert.lacksClasses( widget, "ui-checkboxradio-checked" );

	radio.prop( "checked", true );
	radio.checkboxradio( "refresh" );
	assert.hasClasses( icon, "ui-icon-blank" );
	assert.hasClasses( widget, "ui-checkboxradio-checked" );

	radio.prop( "checked", false );
	radio.checkboxradio( "refresh" );
	assert.hasClasses( icon, "ui-icon-blank" );
	assert.lacksClasses( widget, "ui-checkboxradio-checked" );
});

test( "Radio: destroy", function(){
	expect( 1 );
	domEqual( "#radio-method-destroy", function() {
		$( "#radio-method-destroy" ).checkboxradio().checkboxradio( "destroy" );
	});
});

test( "Radio: disable / enable", function( assert ) {
	var radio = $( "#radio-method-disable" ),
		widget = radio.checkboxradio().checkboxradio( "widget" );

	expect( 4 );
	radio.checkboxradio( "disable" );
	assert.hasClasses( widget, "ui-state-disabled",
		"label gets ui-state-disabled when disable is called" );
	strictEqual( radio.is( ":disabled" ), true,
		"checkbox is disabled when disable is called" );
	radio.checkboxradio( "enable" );
	assert.lacksClasses( widget, "ui-state-disabled",
		"label has ui-state-disabled removed when enable is called" );
	strictEqual( radio.is( ":disabled" ), false,
		"checkbox has disabled prop removed when enable is called" );
});
test( "Radio: widget returns the label", function(){
	var radio = $( "#radio-method-refresh" ),
		label = $( "#radio-method-refresh-label" );

	expect( 1 );

	radio.checkboxradio();
	strictEqual( radio.checkboxradio( "widget" )[ 0 ], label[ 0 ],
		"widget method returns label" );
});
test( "Input wrapped in a label preserved on refresh", function() {
	var input = $( "#label-with-no-for" ).checkboxradio(),
		element = input.checkboxradio( "widget" );

	expect( 1 );

	input.checkboxradio( "refresh" );
	strictEqual( input.parent()[ 0 ], element[ 0 ], "Input preserved" );
});

})(jQuery);
