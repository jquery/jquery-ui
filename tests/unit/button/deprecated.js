define( [
	"jquery",
	"ui/widgets/button"
], function( $ ) {

module( "Button (deprecated): core" );

test( "Calling button on a checkbox input calls checkboxradio widget", function() {
	var checkbox = $( "#checkbox01" );

	expect( 2 );
	checkbox.button();

	ok( !!checkbox.checkboxradio( "instance" ),
		"Calling button on a checkbox creates checkboxradio instance" );
	ok( !checkbox.checkboxradio( "option", "icon" ),
		"Calling button on a checkbox sets the checkboxradio icon option to false" );
} );

test( "Calling buttonset calls controlgroup", function() {
	var controlgroup = $( ".buttonset" );

	expect( 1 );
	controlgroup.buttonset();

	ok( controlgroup.is( ":ui-controlgroup" ), "Calling buttonset creates controlgroup instance" );
} );

module( "Button (deprecated): methods" );

test( "destroy", function( assert ) {
	expect( 1 );
	assert.domEqual( "#checkbox02", function() {
		$( "#checkbox02" ).button().button( "destroy" );
	} );
} );

test( "refresh: Ensure disabled state is preserved correctly.", function() {
	expect( 5 );
	var element = null;

	element = $( "#checkbox02" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Checkboxes should remain disabled after refresh" );
	ok( element.prop( "disabled" ), "Input remains disabled after refresh" );

	element = $( "#radio02" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Radio buttons should remain disabled after refresh" );

	element = $( "#checkbox02" );
	element.button( { disabled: true } ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a checkbox's disabled property should update the state after refresh." );

	element = $( "#radio02" );
	element.button( { disabled: true } ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a radio button's disabled property should update the state after refresh." );

} );

module( "button (deprecated): options" );

test( "Setting items option on buttonset sets the button properties on the items option", function() {
	expect( 2 );

	var controlgroup = $( ".buttonset" );

	controlgroup.buttonset( { items: "bar" } );
	equal( controlgroup.controlgroup( "option", "items.button" ), "bar",
		"items.button set when setting items option on init on buttonset" );

	controlgroup.buttonset( "option", "items", "foo" );
	equal( controlgroup.controlgroup( "option", "items.button" ), "foo",
		"items.button set when setting items option on buttonset" );
} );

test( "disabled, null", function() {
	expect( 2 );

	$( "#radio02" ).prop( "disabled", true ).button( { disabled: null } );
	deepEqual( $( "#radio02" ).button( "option", "disabled" ), true,
		"disabled option set to true" );
	deepEqual( true, $( "#radio02" ).prop( "disabled" ), "element is not disabled" );
} );

test( "text / showLabel options proxied", function() {
	expect( 8 );
	var button = $( "#button" );
	button.button( {
		text: false,
		icon: "ui-icon-gear"
	} );
	equal( button.button( "option", "showLabel" ), false,
		"Setting the text option to false sets the showLabel option to false on init" );
	button.button( "option", "showLabel", true );
	equal( button.button( "option", "text" ), true,
		"Setting showLabel true with option method sets text option to true" );
	button.button( "option", "text", false );
	equal( button.button( "option", "showLabel" ), false,
		"Setting text false with option method sets showLabel option to false" );
	button.button( "option", "text", true );
	equal( button.button( "option", "showLabel" ), true,
		"Setting text true with option method sets showLabel option to true" );
	button.button( "option", "showLabel", false );
	equal( button.button( "option", "text" ), false,
		"Setting showLabel false with option method sets text option to false" );
	button.button( "destroy" );
	button.button( {
		text: true,
		icon: "ui-icon-gear"
	} );
	equal( button.button( "option", "showLabel" ), true,
		"Setting the text option to true sets the showLabel option to true on init" );
	button.button( "destroy" );
	button.button( {
		showLabel: true,
		icon: "ui-icon-gear"
	} );
	equal( button.button( "option", "text" ), true,
		"Setting the showLabel option to true sets the text option to true on init" );
	button.button( "destroy" );
	button.button( {
		showLabel: false,
		icon: "ui-icon-gear"
	} );
	equal( button.button( "option", "text" ), false,
		"Setting the showLabel option to false sets the text option to false on init" );
} );

test( "icon / icons options properly proxied", function() {
	expect( 10 );

	var button = $( "#button" );

	button.button( {
		icon: "foo"
	} );

	equal( button.button( "option", "icons.primary" ), "foo",
		"Icon option properly proxied on init" );

	button.button( {
		icon: "bar"
	} );

	equal( button.button( "option", "icons.primary" ), "bar",
		"Icon option properly proxied with option method" );

	button.button( {
		icons: {
			primary: "foo"
		}
	} );

	equal( button.button( "option", "icon" ), "foo",
		"Icons primary option properly proxied with option method" );
	equal( button.button( "option", "iconPosition" ), "beginning",
		"Icons primary option sets iconPosition option to beginning" );

	button.button( {
		icons: {
			secondary: "bar"
		}
	} );

	equal( button.button( "option", "icon" ), "bar",
		"Icons secondary option properly proxied with option method" );
	equal( button.button( "option", "iconPosition" ), "end",
		"Icons secondary option sets iconPosition option to end" );

	button.button( "destroy" );

	button.button( {
		icons: {
			primary: "foo"
		}
	} );

	equal( button.button( "option", "icon" ), "foo",
		"Icons primary option properly proxied on init" );
	equal( button.button( "option", "iconPosition" ), "beginning",
		"Icons primary option sets iconPosition option to beginning on init" );

	button.button( {
		icons: {
			secondary: "bar"
		}
	} );

	equal( button.button( "option", "icon" ), "bar",
		"Icons secondary option properly proxied on init" );
	equal( button.button( "option", "iconPosition" ), "end",
		"Icons secondary option sets iconPosition option to end on init" );
} );

} );
