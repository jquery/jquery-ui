define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/button"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "button: options", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "disabled, explicit value", function( assert ) {
	assert.expect( 8 );

	var element = $( "#button" ).button( { disabled: false } );

	assert.strictEqual( element.button( "option", "disabled" ), false, "disabled option set to false" );
	assert.strictEqual( element.prop( "disabled" ), false, "Disabled property is false" );

	assert.lacksClasses( element.button( "widget" ), "ui-state-disabled ui-button-disabled" );

	element = $( "#button" ).button( { disabled: true } );

	assert.hasClasses( element.button( "widget" ), "ui-state-disabled" );
	assert.strictEqual( element.button( "widget" ).attr( "aria-disabled" ), undefined,
		"element does not get aria-disabled" );
	assert.hasClasses( element.button( "widget" ), "ui-button-disabled" );

	assert.strictEqual( element.button( "option", "disabled" ), true, "disabled option set to true" );
	assert.strictEqual( element.prop( "disabled" ), true, "Disabled property is set" );
} );

// We are testing the default here because the default null is a special value which means to check
// the DOM. We need to make sure this happens correctly. Checking the options should never return
// null, it should always be true or false.
QUnit.test( "disabled, null", function( assert ) {
	assert.expect( 4 );
	var element = $( "#button" ),
		elementDisabled = $( "#button-disabled" );

	element.add( elementDisabled ).button( { disabled: null } );
	assert.strictEqual( element.button( "option", "disabled" ), false, "disabled option set to false" );
	assert.strictEqual( element.prop( "disabled" ), false, "element is disabled" );
	assert.strictEqual( elementDisabled.button( "option", "disabled" ), true,
		"disabled option set to true" );
	assert.strictEqual( elementDisabled.prop( "disabled" ), true, "element is disabled" );
} );

QUnit.test( "showLabel, false, without icon", function( assert ) {
	assert.expect( 4 );

	var button = $( "#button" ).button( {
		showLabel: false
	} );

	assert.lacksClasses( button, "ui-button-icon-only" );
	assert.strictEqual( button.button( "option", "showLabel" ), true,
		"showLabel false only allowed if icon true" );

	button.button( "option", "showLabel", false );
	assert.lacksClasses( button, "ui-button-icon-only" );
	assert.strictEqual( button.button( "option", "showLabel" ), true,
		"showLabel false only allowed if icon true" );
} );

QUnit.test( "showLabel, false, with icon", function( assert ) {
	assert.expect( 1 );
	var button = $( "#button" ).button( {
		showLabel: false,
		icon: "iconclass"
	} );
	assert.hasClasses( button, "ui-button ui-corner-all ui-widget ui-button-icon-only" );
} );

QUnit.test( "label, default", function( assert ) {
	assert.expect( 2 );
	var button = $( "#button" ).button();

	assert.deepEqual( button.text(), "Label" );
	assert.deepEqual( button.button( "option", "label" ), "Label" );
} );

QUnit.test( "label, with html markup", function( assert ) {
	assert.expect( 3 );
	var button = $( "#button2" ).button();

	assert.deepEqual( button.text(), "label with span" );
	assert.deepEqual( button.html().toLowerCase(), "label <span>with span</span>" );
	assert.deepEqual( button.button( "option", "label" ).toLowerCase(), "label <span>with span</span>" );
} );

QUnit.test( "label, explicit value", function( assert ) {
	assert.expect( 2 );
	var button = $( "#button" ).button( {
		label: "xxx"
	} );

	assert.deepEqual( button.text(), "xxx" );
	assert.deepEqual( button.button( "option", "label" ), "xxx" );
} );

QUnit.test( "label, default, with input type submit", function( assert ) {
	assert.expect( 2 );
	var button = $( "#submit" ).button();

	assert.deepEqual( button.val(), "Label" );
	assert.deepEqual( button.button( "option", "label" ), "Label" );
} );

QUnit.test( "label, explicit value, with input type submit", function( assert ) {
	assert.expect( 2 );
	var button = $( "#submit" ).button( {
		label: "xxx"
	} );

	assert.deepEqual( button.val(), "xxx" );
	assert.deepEqual( button.button( "option", "label" ), "xxx" );
} );

QUnit.test( "icon", function( assert ) {
	assert.expect( 4 );
	var button = $( "#button" ).button( {
			showLabel: false,
			icon: "iconclass"
		} ),
		icon = button.find( ".ui-icon" );

	assert.hasClasses( icon, "iconclass" );
	assert.equal( icon.length, 1, "button with icon option set has icon" );

	button.button( "option", "icon", false );
	assert.equal( button.find( ".ui-icon" ).length, 0, "setting icon to false removes the icon" );

	button.button( "option", "icon", "iconclass" );
	assert.ok( button.find( ".ui-icon" ).length, "setting icon to a value adds the icon" );

} );

QUnit.test( "icon position", function( assert ) {
	assert.expect( 22 );

	var button = $( "#button" ).button( {
			icon: "ui-icon-gear"
		} ),
		icon = button.find( ".ui-icon" ),
		space = button.find( ".ui-button-icon-space" );

	assert.equal( icon.length, 1, "button with icon option set has icon" );
	assert.equal( button.button( "option", "iconPosition" ), "beginning",
		"Button has iconPosition beginning by default" );
	assert.equal( button.contents()[ 0 ], icon[ 0 ], "icon is prepended when position is begining" );
	assert.equal( icon.next()[ 0 ], space[ 0 ], "icon is followed by a space when position is begining" );
	assert.equal( space.length, 1,
		"ui-button-icon-space contains a breaking space iconPosition:beginning" );
	assert.lacksClasses( icon, "ui-widget-icon-block" );

	button.button( "option", "iconPosition", "end" );
	icon = button.find( ".ui-icon" );
	space = button.find( ".ui-button-icon-space" );
	assert.equal( icon.length, 1, "Changing position to end does not re-create or duplicate icon" );
	assert.equal( button.button( "option", "iconPosition" ), "end", "Button has iconPosition end" );
	assert.equal( button.contents().last()[ 0 ], icon[ 0 ], "icon is appended when position is end" );
	assert.equal( icon.prev()[ 0 ], space[ 0 ], "icon is preceeded by a space when position is end" );
	assert.equal( space.length, 1,
		"ui-button-icon-space contains a breaking space iconPosition:beginning" );
	assert.lacksClasses( icon, "ui-widget-icon-block" );

	button.button( "option", "iconPosition", "top" );
	icon = button.find( ".ui-icon" );
	assert.equal( icon.length, 1, "Changing position to top does not re-create or duplicate icon" );
	assert.equal( button.button( "option", "iconPosition" ), "top", "Button has iconPosition top" );
	assert.equal( button.contents()[ 0 ], icon[ 0 ], "icon is prepended when position is top" );
	assert.ok( !button.find( "ui-button-icon-space" ).length,
		"Button should not have an iconSpace with position: top" );
	assert.hasClasses( icon, "ui-widget-icon-block" );

	button.button( "option", "iconPosition", "bottom" );
	icon = button.find( ".ui-icon" );
	assert.equal( icon.length, 1, "Changing position to bottom does not re-create or duplicate icon" );
	assert.equal( button.button( "option", "iconPosition" ), "bottom", "Button has iconPosition top" );
	assert.equal( button.contents().last()[ 0 ], icon[ 0 ], "icon is prepended when position is bottom" );
	assert.ok( !button.find( "ui-button-icon-space" ).length,
		"Button should not have an iconSpace with position: bottom" );
	assert.hasClasses( icon, "ui-widget-icon-block" );

} );

} );
