define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/checkboxradio"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "Checkboxradio: methods", { afterEach: helper.moduleAfterEach }  );

$.each( [ "checkbox", "radio" ], function( index, value ) {
	QUnit.test( value + ": refresh", function( assert ) {
		var widget, icon,
			checkbox = value === "checkbox",
			input = $( "#" + value + "-method-refresh" );

		assert.expect( checkbox ? 11 : 8 );

		input.checkboxradio();

		widget = input.checkboxradio( "widget" );
		icon = widget.find( ".ui-icon" );
		assert.strictEqual( icon.length, 1,
			"There is initally one icon" );

		icon.remove();
		input.checkboxradio( "refresh" );
		icon = widget.find( ".ui-icon" );
		assert.strictEqual( icon.length, 1,
			"Icon is recreated on refresh if absent" );
		assert.hasClasses( icon, "ui-icon-blank" );
		if ( checkbox ) {
			assert.lacksClasses( icon, "ui-icon-check" );
		}
		assert.lacksClasses( widget, "ui-checkboxradio-checked" );

		input.prop( "checked", true );
		input.checkboxradio( "refresh" );
		if ( checkbox ) {
			assert.hasClasses( icon, "ui-icon-check" );
		}
		assert[ !checkbox ? "hasClasses" : "lacksClasses" ]( icon, "ui-icon-blank" );
		assert.hasClasses( widget, "ui-checkboxradio-checked" );

		input.prop( "checked", false );
		input.checkboxradio( "refresh" );
		assert.hasClasses( icon, "ui-icon-blank" );
		if ( checkbox ) {
			assert.lacksClasses( icon, "ui-icon-check" );
		}
		assert.lacksClasses( widget, "ui-checkboxradio-checked" );
	} );

	QUnit.test( value + ": destroy", function( assert ) {
		assert.expect( 1 );
		assert.domEqual( "#" + value + "-method-destroy", function() {
			$( "#" + value + "-method-destroy" ).checkboxradio().checkboxradio( "destroy" );
		} );
	} );

	QUnit.test( value + ": disable / enable", function( assert ) {
		assert.expect( 4 );
		var input = $( "#" + value + "-method-disable" ),
			widget = input.checkboxradio().checkboxradio( "widget" );

		input.checkboxradio( "disable" );
		assert.hasClasses( widget, "ui-state-disabled" );
		assert.strictEqual( input.is( ":disabled" ), true,
			value + " is disabled when disable is called" );

		input.checkboxradio( "enable" );
		assert.lacksClasses( widget, "ui-state-disabled" );
		assert.strictEqual( input.is( ":disabled" ), false,
			value + " has disabled prop removed when enable is called" );
	} );

	QUnit.test(  value + ": widget returns the label", function( assert ) {
		assert.expect( 1 );

		var input = $( "#" + value + "-method-refresh" ),
			label = $( "#" + value + "-method-refresh-label" );

		input.checkboxradio();
		assert.strictEqual( input.checkboxradio( "widget" )[ 0 ], label[ 0 ],
			"widget method returns label" );
	} );
} );

QUnit.test( "Input wrapped in a label preserved on refresh", function( assert ) {
	var input = $( "#label-with-no-for" ).checkboxradio(),
		element = input.checkboxradio( "widget" );

	assert.expect( 1 );

	input.checkboxradio( "refresh" );
	assert.strictEqual( input.parent()[ 0 ], element[ 0 ], "Input preserved" );
} );

QUnit.test( "Initial text label not turned to HTML on refresh", function( assert ) {
	var tests = [
		{
			id: "label-with-no-for-with-html",
			expectedLabel: "<strong>Hi</strong>, <em>I'm a label</em>"
		},
		{
			id: "label-with-no-for-with-text",
			expectedLabel: "Hi, I'm a label"
		},
		{
			id: "label-with-no-for-with-html-like-text",
			expectedLabel: "&lt;em&gt;Hi, I'm a label&lt;/em&gt;"
		}
	];

	assert.expect( tests.length );

	tests.forEach( function( testData ) {
		var id = testData.id;
		var expectedLabel = testData.expectedLabel;
		var inputElem = $( "#" + id );
		var labelElem = inputElem.parent();

		inputElem.checkboxradio( { icon: false } );
		inputElem.checkboxradio( "refresh" );

		var labelWithoutInput = labelElem.clone();
		labelWithoutInput.find( "input" ).remove();

		assert.strictEqual(
			labelWithoutInput.html().trim(),
			expectedLabel.trim(),
			"Label correct [" + id + "]"
		);
	} );
} );

} );
