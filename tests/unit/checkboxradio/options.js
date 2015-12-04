define( [
	"jquery",
	"ui/widgets/checkboxradio"
], function( $ ) {

module( "Checkboxradio: options" );

function assertDisabled( checkbox, assert ) {
	assert.hasClasses( checkbox.checkboxradio( "widget" ), "ui-state-disabled",
		"label gets ui-state-disabled" );
	strictEqual( checkbox.is( ":disabled" ), true, "checkbox is disabled" );
}

function assertEnabled( checkbox, assert ) {
	assert.lacksClasses(  checkbox.checkboxradio( "widget" ), "ui-state-disabled",
		"label has ui-state-disabled removed when disabled set to false" );
	strictEqual( checkbox.is( ":disabled" ), false,
		"checkbox has disabled prop removed when disabled set to false" );
}

test( "disabled", function( assert ) {
	expect( 6 );

	var checkbox = $( "#checkbox-option-disabled" );
	checkbox.checkboxradio( {
		disabled: true
	} );

	assertDisabled( checkbox, assert );

	checkbox.checkboxradio( "option", "disabled", false );
	assertEnabled( checkbox, assert  );

	checkbox.checkboxradio( "option", "disabled", true );
	assertDisabled( checkbox, assert );
} );

test( "disabled - prop true on init", function( assert ) {
	expect( 2 );
	var checkbox = $( "#checkbox-option-disabled" );

	checkbox.prop( "disabled", true );
	checkbox.checkboxradio();

	assertDisabled( checkbox, assert );
} );

test( "disabled - explicit null value, checks the DOM", function( assert ) {
	expect( 2 );
	var checkbox = $( "#checkbox-option-disabled" );

	checkbox.prop( "disabled", true );
	checkbox.checkboxradio( {
		disabled: null
	} );
	assertDisabled( checkbox, assert );
} );

function assertNoIcon( checkbox ) {
	strictEqual( checkbox.checkboxradio( "widget" ).find( "span.ui-icon" ).length, 0,
		"Label does not contain an icon" );
}

function assertIcon( checkbox, icon, assert ) {
	var iconElement = checkbox.checkboxradio( "widget" ).find( ".ui-icon" );

	icon = icon || "blank";
	strictEqual( iconElement.length, 1,
		"Label contains icon" );
	assert.hasClasses( iconElement, "ui-checkboxradio-icon ui-corner-all ui-icon " +
		"ui-icon-background ui-icon-" + icon,
		"Icon has proper classes" );
	if ( icon === "blank" ) {
		assert.lacksClasses( iconElement, "ui-icon-check ui-state-highlight" );
	}
}

test( "icon - false on init", function() {
	var checkbox = $( "#checkbox-option-icon" );

	expect( 1 );

	checkbox.checkboxradio( { icon: false } );
	assertNoIcon( checkbox );
} );

test( "icon - default unchecked", function( assert ) {
	var checkbox = $( "#checkbox-option-icon" );

	expect( 3 );

	checkbox.checkboxradio();
	assertIcon( checkbox, false, assert );
} );

test( "icon - default checked", function( assert ) {
	var checkbox = $( "#checkbox-option-icon" ).attr( "checked", true );

	expect( 2 );

	checkbox.checkboxradio();
	assertIcon( checkbox, "check ui-state-highlight", assert );
} );

test( "icon", function( assert ) {
	var checkbox = $( "#checkbox-option-icon" );

	expect( 9 );

	checkbox.prop( "checked", true );

	checkbox.checkboxradio();
	assertIcon( checkbox, "check ui-state-highlight", assert );

	checkbox.checkboxradio( "option", "icon", false );
	assertNoIcon( checkbox );

	checkbox.checkboxradio( "option", "icon", true );
	assertIcon( checkbox, "check ui-state-highlight", assert );

	checkbox.checkboxradio( "option", "icon", false );
	assertNoIcon( checkbox );

	checkbox.checkboxradio( "option", "icon", true );
	checkbox.prop( "checked", false ).checkboxradio( "refresh" );
	assertIcon( checkbox, false, assert );
} );

test( "label - default", function() {
	var checkbox = $( "#checkbox-option-label" ),
		widget;

	expect( 2 );

	checkbox.checkboxradio();
	widget = checkbox.checkboxradio( "widget" );
	strictEqual( checkbox.checkboxradio( "option", "label" ),
		"checkbox label", "When no value passed on create text from dom is used for option" );
	strictEqual( $.trim( widget.text() ),
		"checkbox label", "When no value passed on create text from dom is used in dom" );
} );

test( "label - explicit value", function() {
	expect( 5 );
	var checkbox = $( "#checkbox-option-label" ).checkboxradio( {
			label: "foo"
		} ),
		widget = checkbox.checkboxradio( "widget" ),
		icon = widget.find( ".ui-icon" ),
		iconSpace = widget.find( ".ui-checkboxradio-icon-space" );

	strictEqual( checkbox.checkboxradio( "option", "label" ),
		"foo", "When value is passed on create value is used for option" );
	strictEqual( $.trim( widget.text() ),
		"foo", "When value is passed on create value is used in dom" );
	strictEqual( icon.length, 1,
		"Icon is preserved when label is set on init when wrapped in label" );
	strictEqual( iconSpace.length, 1,
		"Icon space is preserved when label is set on init when wrapped in label" );
	strictEqual( $( "#checkbox-option-label" ).length, 1,
		"Element is preserved when label is set on init when wrapped in label" );
} );

test( "label - explicit null value", function() {
	var checkbox = $( "#checkbox-option-label" ),
		widget;

	expect( 2 );

	// The default null is a special value which means to check the DOM.
	// We need to make sure that the option never return null.
	// It should always be true or false after initialization.
	checkbox.checkboxradio( {
		label: null
	} );
	widget = checkbox.checkboxradio( "widget" );
	strictEqual( checkbox.checkboxradio( "option", "label" ),
		"checkbox label", "When null is passed on create text from dom is used for option" );
	strictEqual( $.trim( widget.text() ),
		"checkbox label", "When null is passed on create text from dom is used in dom" );

} );

test( "label", function() {
	expect( 4 );

	var checkbox = $( "#checkbox-option-label" ),
		widget;

	checkbox.checkboxradio();
	widget = checkbox.checkboxradio( "widget" );
	checkbox.checkboxradio( "option", "label", "bar" );
	strictEqual( checkbox.checkboxradio( "option", "label" ),
		"bar", "When value is passed value is used for option" );
	strictEqual( $.trim( widget.text() ),
		"bar", "When value is passed value is used in dom" );

	checkbox.checkboxradio( "option", "label", null );
	strictEqual( checkbox.checkboxradio( "option", "label" ),
		"bar", "When null is passed text from dom is used for option" );
	strictEqual( $.trim( widget.text() ),
		"bar", "When null is passed text from dom is used in dom" );
} );

} );
