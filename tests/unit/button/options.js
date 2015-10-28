define( [
	"jquery",
	"ui/widgets/button"
], function( $ ) {

module( "button: options" );

test( "disabled, explicit value", function( assert ) {
	expect( 8 );

	var element = $( "#button" ).button( { disabled: false } );

	strictEqual( element.button( "option", "disabled" ), false, "disabled option set to false" );
	strictEqual( element.prop( "disabled" ), false, "Disabled property is false" );

	assert.lacksClasses( element.button( "widget" ), "ui-state-disabled ui-button-disabled" );

	element = $( "#button" ).button( { disabled: true } );

	assert.hasClasses( element.button( "widget" ), "ui-state-disabled" );
	strictEqual( element.button( "widget" ).attr( "aria-disabled" ), undefined,
		"element does not get aria-disabled" );
	assert.hasClasses( element.button( "widget" ), "ui-button-disabled" );

	strictEqual( element.button( "option", "disabled" ), true, "disabled option set to true" );
	strictEqual( element.prop( "disabled" ), true, "Disabled property is set" );
} );

// We are testing the default here because the default null is a special value which means to check
// the DOM. We need to make sure this happens correctly. Checking the options should never return
// null, it should always be true or false.
test( "disabled, null", function() {
	expect( 4 );
	var element = $( "#button" ),
		elementDisabled = $( "#button-disabled" );

	element.add( elementDisabled ).button( { disabled: null } );
	strictEqual( element.button( "option", "disabled" ), false, "disabled option set to false" );
	strictEqual( element.prop( "disabled" ), false, "element is disabled" );
	strictEqual( elementDisabled.button( "option", "disabled" ), true,
		"disabled option set to true" );
	strictEqual( elementDisabled.prop( "disabled" ), true, "element is disabled" );
} );

test( "showLabel, false, without icon", function( assert ) {
	expect( 4 );

	var button = $( "#button" ).button( {
		showLabel: false
	} );

	assert.lacksClasses( button, "ui-button-icon-only" );
	strictEqual( button.button( "option", "showLabel" ), true,
		"showLabel false only allowed if icon true" );

	button.button( "option", "showLabel", false );
	assert.lacksClasses( button, "ui-button-icon-only" );
	strictEqual( button.button( "option", "showLabel" ), true,
		"showLabel false only allowed if icon true" );
} );

test( "showLabel, false, with icon", function( assert ) {
	expect( 1 );
	var button = $( "#button" ).button( {
		showLabel: false,
		icon: "iconclass"
	} );
	assert.hasClasses( button, "ui-button ui-corner-all ui-widget ui-button-icon-only" );
} );

test( "label, default", function() {
	expect( 2 );
	var button = $( "#button" ).button();

	deepEqual( button.text(), "Label" );
	deepEqual( button.button( "option", "label" ), "Label" );
} );

test( "label, with html markup", function() {
	expect( 3 );
	var button = $( "#button2" ).button();

	deepEqual( button.text(), "label with span" );
	deepEqual( button.html().toLowerCase(), "label <span>with span</span>" );
	deepEqual( button.button( "option", "label" ).toLowerCase(), "label <span>with span</span>" );
} );

test( "label, explicit value", function() {
	expect( 2 );
	var button = $( "#button" ).button( {
		label: "xxx"
	} );

	deepEqual( button.text(), "xxx" );
	deepEqual( button.button( "option", "label" ), "xxx" );
} );

test( "label, default, with input type submit", function() {
	expect( 2 );
	var button = $( "#submit" ).button();

	deepEqual( button.val(), "Label" );
	deepEqual( button.button( "option", "label" ), "Label" );
} );

test( "label, explicit value, with input type submit", function() {
	expect( 2 );
	var button = $( "#submit" ).button( {
		label: "xxx"
	} );

	deepEqual( button.val(), "xxx" );
	deepEqual( button.button( "option", "label" ), "xxx" );
} );

test( "icon", function( assert ) {
	expect( 4 );
	var button = $( "#button" ).button( {
			showLabel: false,
			icon: "iconclass"
		} ),
		icon = button.find( ".ui-icon" );

	assert.hasClasses( icon, "iconclass" );
	equal( icon.length, 1, "button with icon option set has icon" );

	button.button( "option", "icon", false );
	equal( button.find( ".ui-icon" ).length, 0, "setting icon to false removes the icon" );

	button.button( "option", "icon", "iconclass" );
	ok( button.find( ".ui-icon" ).length, "setting icon to a value adds the icon" );

} );

test( "icon position", function( assert ) {
	expect( 22 );

	var button = $( "#button" ).button( {
			icon: "ui-icon-gear"
		} ),
		icon = button.find( ".ui-icon" ),
		space = button.find( ".ui-button-icon-space" );

	equal( icon.length, 1, "button with icon option set has icon" );
	equal( button.button( "option", "iconPosition" ), "beginning",
		"Button has iconPosition beginning by default" );
	equal( button.contents()[ 0 ], icon[ 0 ], "icon is prepended when position is begining" );
	equal( icon.next()[ 0 ], space[ 0 ], "icon is followed by a space when position is begining" );
	equal( space.length, 1,
		"ui-button-icon-space contains a breaking space iconPosition:beginning" );
	assert.lacksClasses( icon, "ui-widget-icon-block" );

	button.button( "option", "iconPosition", "end" );
	icon = button.find( ".ui-icon" );
	space = button.find( ".ui-button-icon-space" );
	equal( icon.length, 1, "Changing position to end does not re-create or duplicate icon" );
	equal( button.button( "option", "iconPosition" ), "end", "Button has iconPosition end" );
	equal( button.contents().last()[ 0 ], icon[ 0 ], "icon is appended when position is end" );
	equal( icon.prev()[ 0 ], space[ 0 ], "icon is preceeded by a space when position is end" );
	equal( space.length, 1,
		"ui-button-icon-space contains a breaking space iconPosition:beginning" );
	assert.lacksClasses( icon, "ui-widget-icon-block" );

	button.button( "option", "iconPosition", "top" );
	icon = button.find( ".ui-icon" );
	equal( icon.length, 1, "Changing position to top does not re-create or duplicate icon" );
	equal( button.button( "option", "iconPosition" ), "top", "Button has iconPosition top" );
	equal( button.contents()[ 0 ], icon[ 0 ], "icon is prepended when position is top" );
	ok( !button.find( "ui-button-icon-space" ).length,
		"Button should not have an iconSpace with position: top" );
	assert.hasClasses( icon, "ui-widget-icon-block" );

	button.button( "option", "iconPosition", "bottom" );
	icon = button.find( ".ui-icon" );
	equal( icon.length, 1, "Changing position to bottom does not re-create or duplicate icon" );
	equal( button.button( "option", "iconPosition" ), "bottom", "Button has iconPosition top" );
	equal( button.contents().last()[ 0 ], icon[ 0 ], "icon is prepended when position is bottom" );
	ok( !button.find( "ui-button-icon-space" ).length,
		"Button should not have an iconSpace with position: bottom" );
	assert.hasClasses( icon, "ui-widget-icon-block" );

} );

} );
