/*
 * checkboxradio_methods.js
 */


(function($) {

module( "Checkboxradio: checkbox: options" );
	test( "options: disabled", function() {
		var checkbox = $( "#checkbox-option-disabled" ),
			widget;
		expect( 10 );
		checkbox.checkboxradio({
			disabled: true
		});

		widget = checkbox.checkboxradio( "widget" );

		strictEqual( widget.hasClass( "ui-state-disabled" ), true,
			"label gets ui-state-disabled when initial option set to true" );
		strictEqual( checkbox.is( ":disabled" ), true,
			"checkbox is disabled when inital option is set to true" );

		checkbox.checkboxradio( "option", "disabled", false );

		strictEqual( widget.hasClass( "ui-state-disabled" ), false,
			"label has ui-state-disabled removed when disabled set to false" );
		strictEqual( checkbox.is( ":disabled" ), false,
			"checkbox has disabled prop removed when disabled set to false" );

		checkbox.checkboxradio( "option", "disabled", true );

		strictEqual( widget.hasClass( "ui-state-disabled" ), true,
			"label gets ui-state-disabled when option set to true" );
		strictEqual( checkbox.is( ":disabled" ), true,
			"checkbox is disabled when option is set to true" );

		checkbox.checkboxradio( "destroy" );
		checkbox.prop( "disabled", true );
		checkbox.checkboxradio();

		strictEqual( widget.hasClass( "ui-state-disabled" ), true,
			"label gets ui-state-disabled when checkbox is disabled in dom on startup" );
		strictEqual( checkbox.is( ":disabled" ), true,
			"checkbox is disabled when checkbox is disabled in dom on startup" );

		checkbox.checkboxradio( "destroy" );
		checkbox.checkboxradio({
			disabled: null
		});

		strictEqual( widget.hasClass( "ui-state-disabled" ), true,
			"passing null to disabled on startup checks the dom" );
		strictEqual( checkbox.is( ":disabled" ), true,
			"passing null to disabled on startup checks the dom" );
	});
	test( "options: icon", function() {
		var checkbox = $( "#checkbox-option-icon" ),
			widget;

		expect( 9 );

		checkbox.checkboxradio();

		widget = checkbox.checkboxradio( "widget" );

		strictEqual( widget.find( "span" ).length, 0,
			"Label does not contain a span when created with icon:false" );

		checkbox.checkboxradio( "destroy" );

		checkbox.checkboxradio({
			icon: true
		});

		strictEqual( widget.find( "span" ).length, 1,
			"Label contains a span when created with icon:true" );
		strictEqual( widget.find( "span" ).attr( "class" ),
			"ui-checkboxradio-icon ui-corner-all ui-icon ui-icon-background ui-icon-blank",
			"Icon span has proper classes when created not checked" );

		checkbox.checkboxradio( "destroy" ).prop( "checked", true );

		checkbox.checkboxradio({
			icon: true
		});

		strictEqual( widget.find( "span" ).attr( "class" ),
			"ui-checkboxradio-icon ui-corner-all ui-icon ui-icon-background ui-icon-check",
			"Icon span has proper classes when created checked" );

		checkbox.checkboxradio( "option", "icon", false );

		strictEqual( widget.find( "span" ).length, 0,
			"Label does not contain a span when option set to icon:false and checked" );

		checkbox.checkboxradio( "option", "icon", true );

		strictEqual( widget.find( "span" ).attr( "class" ),
			"ui-checkboxradio-icon ui-corner-all ui-icon ui-icon-background ui-icon-check",
			"Icon span has proper classes when option set to true and :is( checked )" );

		checkbox.prop( "checked", false ).checkboxradio( "refresh" );
		checkbox.checkboxradio( "option", "icon", false );

		strictEqual( widget.find( "span" ).length, 0,
			"Label does not contain a span when option set to icon:false and not checked" );

		checkbox.checkboxradio( "option", "icon", true );

		strictEqual( widget.find( "span" ).attr( "class" ),
			"ui-checkboxradio-icon ui-corner-all ui-icon ui-icon-background ui-icon-blank",
			"Icon span has proper classes when option set to true and not checked" );

		checkbox.checkboxradio( "destroy" );

		strictEqual( widget.find( "span" ).length, 0,
			"Label does not contain a span after destroy when icon true" );

	});
	test( "options: label", function() {
		var checkbox = $( "#checkbox-option-label" ),
			widget;

		expect( 10 );

		checkbox.checkboxradio();

		widget = checkbox.checkboxradio( "widget" );

		strictEqual( checkbox.checkboxradio( "option", "label" ),
			"checkbox label", "When no value passed on create text from dom is used for option" );
		strictEqual( widget.text(),
			"checkbox label", "When no value passed on create text from dom is used in dom" );

		checkbox.checkboxradio( "destroy" );

		checkbox.checkboxradio({
			label: "foo"
		});

		strictEqual( checkbox.checkboxradio( "option", "label" ),
			"foo", "When value is passed on create value is used for option" );
		strictEqual( widget.text(),
			"foo", "When value is passed on create value is used in dom" );

		checkbox.checkboxradio( "destroy" );
		checkbox.checkboxradio({
			label: null
		});

		strictEqual( checkbox.checkboxradio( "option", "label" ),
			"foo", "When null is passed on create text from dom is used for option" );
		strictEqual( widget.text(),
			"foo", "When null is passed on create text from dom is used in dom" );

		checkbox.checkboxradio( "option", "label", "bar" );

		strictEqual( checkbox.checkboxradio( "option", "label" ),
			"bar", "When value is passed value is used for option" );
		strictEqual( widget.text(),
			"bar", "When value is passed value is used in dom" );

		checkbox.checkboxradio( "option", "label", null );

		strictEqual( checkbox.checkboxradio( "option", "label" ),
			"bar", "When null is passed text from dom is used for option" );
		strictEqual( widget.text(),
			"bar", "When null is passed text from dom is used in dom" );

	});

})(jQuery);
