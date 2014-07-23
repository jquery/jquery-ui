/*
 * checkboxradio_methods.js
 */


(function($) {

module( "Checkboxradio: methods" );
	test( "Checkbox: refresh", function() {
		var checkbox = $( "#checkbox-method-refresh" ),
			widget;
		expect( 2 );
		checkbox.checkboxradio({
			icon: true
		});

		widget = checkbox.checkboxradio( "widget" );
		delete $(".ui-icon" )[0];

		checkbox.checkboxradio( "refresh" );
		strictEqual( widget.find( ".ui-icon" ).length, 1, "Icon is recreated on refresh" );
		checkbox.prop( "checked", true );
		checkbox.checkboxradio( "refresh" );
		strictEqual( widget.hasClass( "ui-checkbox-checked" ), true,
			"State updated based on checked property" );
	});

	test( "Checkbox: destroy", function(){
		var checkbox = $( "#checkbox-method-destroy" ),
			checkboxClasses = checkbox.attr( "class" ),
			label = $( "#checkbox-method-destroy-label" ),
			labelClasses = label.attr( "class" );

		expect( 2 );
		checkbox.checkboxradio();
		checkbox.checkboxradio( "destroy" );
		strictEqual( checkbox.attr( "class"), checkboxClasses,
			"checkbox classes match original after destroy" );
		strictEqual( label.attr( "class"), labelClasses,
			"label classes match original after destroy" );
	});

	test( "Checkbox: disable / enable", function() {
		var checkbox = $( "#checkbox-method-disable" );

		expect( 4 );
		checkbox.checkboxradio();
		checkbox.checkboxradio( "disable" );
		strictEqual( checkbox.checkboxradio( "widget" ).hasClass( "ui-state-disabled" ), true,
			"label gets ui-state-disabled when disable is called" );
		strictEqual( checkbox.is( ":disabled" ), true,
			"checkbox is disabled when disable is called" );
		checkbox.checkboxradio( "enable" );
		strictEqual( checkbox.checkboxradio( "widget" ).hasClass( "ui-state-disabled" ), false,
			"label has ui-state-disabled removed when enable is called" );
		strictEqual( checkbox.is( ":disabled" ), false,
			"checkbox has disabled prop removed when enable is called" );
	});
	test( "Checkbox: widget returns the label", function(){
		var checkbox = $( "#checkbox-method-refresh" ),
			label = $( "#checkbox-method-refresh-label" );

		expect( 1 );

		checkbox.checkboxradio();
		strictEqual( checkbox.checkboxradio( "widget" ).attr( "id" ), label.attr( "id" ),
			"widget method returns label" );
	});

	test( "Radio: refresh", function() {
		var radio = $( "#radio-method-refresh" ),
			widget;
		expect( 2 );
		radio.checkboxradio({
			icon: true
		});

		widget = radio.checkboxradio( "widget" );
		delete $(".ui-icon" )[0];

		radio.checkboxradio( "refresh" );
		strictEqual( widget.find( ".ui-icon" ).length, 1, "Icon is recreated on refresh" );
		radio.prop( "checked", true );
		radio.checkboxradio( "refresh" );
		strictEqual( widget.hasClass( "ui-radio-checked" ), true,
			"State updated based on checked property" );
	});

	test( "Radio: destroy", function(){
		var radio = $( "#radio-method-destroy" ),
			radioClasses = radio.attr( "class" ),
			label = $( "#radio-method-destroy-label" ),
			labelClasses = label.attr( "class" );

		expect( 2 );
		radio.checkboxradio();
		radio.checkboxradio( "destroy" );
		strictEqual( radio.attr( "class"), radioClasses,
			"radio classes match original after destroy" );
		strictEqual( label.attr( "class"), labelClasses,
			"label classes match original after destroy" );
	});

	test( "Radio: disable / enable", function() {
		var radio = $( "#checkbox-method-disable" );

		expect( 4 );
		radio.checkboxradio();
		radio.checkboxradio( "disable" );
		strictEqual( radio.checkboxradio( "widget" ).hasClass( "ui-state-disabled" ), true,
			"label gets ui-state-disabled when disable is called" );
		strictEqual( radio.is( ":disabled" ), true,
			"radio is disabled when disable is called" );
		radio.checkboxradio( "enable" );
		strictEqual( radio.checkboxradio( "widget" ).hasClass( "ui-state-disabled" ), false,
			"label has ui-state-disabled removed when enable is called" );
		strictEqual( radio.is( ":disabled" ), false,
			"radio has disabled prop removed when enable is called" );
	});
	test( "Radio: widget returns the label", function(){
		var radio = $( "#radio-method-refresh" ),
			label = $( "#radio-method-refresh-label" );

		expect( 1 );

		radio.checkboxradio();
		strictEqual( radio.checkboxradio( "widget" ).attr( "id" ), label.attr( "id" ),
			"widget method returns label" );
	});
	test( "Input wrapped in a label preserved on refresh", function() {
		var input = $( "#label-with-no-for" ).checkboxradio(),
			element = input.checkboxradio( "widget" );

		expect( 1 );

		input.checkboxradio( "refresh" );
		strictEqual( input.parent().is( element ), true, "Input preserved" );
	});

})(jQuery);
