define( [
	"qunit",
	"jquery",
	"ui/widgets/button"
], function( QUnit, $ ) {

QUnit.module( "Button (deprecated): core" );

QUnit.test( "Calling button on a checkbox input calls checkboxradio widget", function( assert ) {
	var checkbox = $( "#checkbox01" );

	assert.expect( 2 );
	checkbox.button();

	assert.ok( !!checkbox.checkboxradio( "instance" ),
		"Calling button on a checkbox creates checkboxradio instance" );
	assert.ok( !checkbox.checkboxradio( "option", "icon" ),
		"Calling button on a checkbox sets the checkboxradio icon option to false" );
} );

QUnit.test( "Calling buttonset calls controlgroup", function( assert ) {
	var controlgroup = $( ".buttonset" );

	assert.expect( 1 );
	controlgroup.buttonset();

	assert.ok( controlgroup.is( ":ui-controlgroup" ), "Calling buttonset creates controlgroup instance" );
} );

QUnit.module( "Button (deprecated): methods" );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 1 );
	assert.domEqual( "#checkbox02", function() {
		$( "#checkbox02" ).button().button( "destroy" );
	} );
} );

QUnit.test( "refresh: Ensure disabled state is preserved correctly.", function( assert ) {
	assert.expect( 5 );
	var element = null;

	element = $( "#checkbox02" );
	element.button( { disabled: true } ).button( "refresh" );
	assert.ok( element.button( "option", "disabled" ), "Checkboxes should remain disabled after refresh" );
	assert.ok( element.prop( "disabled" ), "Input remains disabled after refresh" );

	element = $( "#radio02" );
	element.button( { disabled: true } ).button( "refresh" );
	assert.ok( element.button( "option", "disabled" ), "Radio buttons should remain disabled after refresh" );

	element = $( "#checkbox02" );
	element.button( { disabled: true } ).prop( "disabled", false ).button( "refresh" );
	assert.ok( !element.button( "option", "disabled" ), "Changing a checkbox's disabled property should update the state after refresh." );

	element = $( "#radio02" );
	element.button( { disabled: true } ).prop( "disabled", false ).button( "refresh" );
	assert.ok( !element.button( "option", "disabled" ), "Changing a radio button's disabled property should update the state after refresh." );

} );

QUnit.module( "button (deprecated): options" );

QUnit.test( "Setting items option on buttonset sets the button properties on the items option", function( assert ) {
	assert.expect( 2 );

	var controlgroup = $( ".buttonset" );

	controlgroup.buttonset( { items: "bar" } );
	assert.equal( controlgroup.controlgroup( "option", "items.button" ), "bar",
		"items.button set when setting items option on init on buttonset" );

	controlgroup.buttonset( "option", "items", "foo" );
	assert.equal( controlgroup.controlgroup( "option", "items.button" ), "foo",
		"items.button set when setting items option on buttonset" );
} );

QUnit.test( "disabled, null", function( assert ) {
	assert.expect( 2 );

	$( "#radio02" ).prop( "disabled", true ).button( { disabled: null } );
	assert.deepEqual( $( "#radio02" ).button( "option", "disabled" ), true,
		"disabled option set to true" );
	assert.deepEqual( true, $( "#radio02" ).prop( "disabled" ), "element is not disabled" );
} );

QUnit.test( "text / showLabel options proxied", function( assert ) {
	assert.expect( 8 );
	var button = $( "#button" );
	button.button( {
		text: false,
		icon: "ui-icon-gear"
	} );
	assert.equal( button.button( "option", "showLabel" ), false,
		"Setting the text option to false sets the showLabel option to false on init" );
	button.button( "option", "showLabel", true );
	assert.equal( button.button( "option", "text" ), true,
		"Setting showLabel true with option method sets text option to true" );
	button.button( "option", "text", false );
	assert.equal( button.button( "option", "showLabel" ), false,
		"Setting text false with option method sets showLabel option to false" );
	button.button( "option", "text", true );
	assert.equal( button.button( "option", "showLabel" ), true,
		"Setting text true with option method sets showLabel option to true" );
	button.button( "option", "showLabel", false );
	assert.equal( button.button( "option", "text" ), false,
		"Setting showLabel false with option method sets text option to false" );
	button.button( "destroy" );
	button.button( {
		text: true,
		icon: "ui-icon-gear"
	} );
	assert.equal( button.button( "option", "showLabel" ), true,
		"Setting the text option to true sets the showLabel option to true on init" );
	button.button( "destroy" );
	button.button( {
		showLabel: true,
		icon: "ui-icon-gear"
	} );
	assert.equal( button.button( "option", "text" ), true,
		"Setting the showLabel option to true sets the text option to true on init" );
	button.button( "destroy" );
	button.button( {
		showLabel: false,
		icon: "ui-icon-gear"
	} );
	assert.equal( button.button( "option", "text" ), false,
		"Setting the showLabel option to false sets the text option to false on init" );
} );

QUnit.test( "icon / icons options properly proxied", function( assert ) {
	assert.expect( 10 );

	var button = $( "#button" );

	button.button( {
		icon: "foo"
	} );

	assert.equal( button.button( "option", "icons.primary" ), "foo",
		"Icon option properly proxied on init" );

	button.button( {
		icon: "bar"
	} );

	assert.equal( button.button( "option", "icons.primary" ), "bar",
		"Icon option properly proxied with option method" );

	button.button( {
		icons: {
			primary: "foo"
		}
	} );

	assert.equal( button.button( "option", "icon" ), "foo",
		"Icons primary option properly proxied with option method" );
	assert.equal( button.button( "option", "iconPosition" ), "beginning",
		"Icons primary option sets iconPosition option to beginning" );

	button.button( {
		icons: {
			secondary: "bar"
		}
	} );

	assert.equal( button.button( "option", "icon" ), "bar",
		"Icons secondary option properly proxied with option method" );
	assert.equal( button.button( "option", "iconPosition" ), "end",
		"Icons secondary option sets iconPosition option to end" );

	button.button( "destroy" );

	button.button( {
		icons: {
			primary: "foo"
		}
	} );

	assert.equal( button.button( "option", "icon" ), "foo",
		"Icons primary option properly proxied on init" );
	assert.equal( button.button( "option", "iconPosition" ), "beginning",
		"Icons primary option sets iconPosition option to beginning on init" );

	button.button( {
		icons: {
			secondary: "bar"
		}
	} );

	assert.equal( button.button( "option", "icon" ), "bar",
		"Icons secondary option properly proxied on init" );
	assert.equal( button.button( "option", "iconPosition" ), "end",
		"Icons secondary option sets iconPosition option to end on init" );
} );

} );
