/*
 * button_options_deprecated.js
 */
(function($) {

module( "button: options deprecated" );

test( "Setting items option on button set sets the button properties on the items option", function() {
	expect( 2 );

	var controlgroup = $( ".buttonset" );

	controlgroup.buttonset({ items: "bar" });
	equal( controlgroup.controlgroup( "option", "items.button" ), "bar",
		"items.button set when setting items option on init on buttonset" );

	controlgroup.buttonset( "option", "items", "foo" );
	equal( controlgroup.controlgroup( "option", "items.button" ), "foo",
		"items.button set when setting items option on buttonset" );
});

test( "disabled, null", function() {
	expect( 2 );

	$( "#radio02" ).prop( "disabled", true ).button({ disabled: null });
	deepEqual( true, $( "#radio02" ).button( "option", "disabled" ),
		"disabled option set to true" );
	deepEqual( true, $( "#radio02" ).prop( "disabled" ), "element is not disabled" );
});

test( "text and showLabel options proxied", function(){
	expect( 8 );
	var button = $( "#button" );
	button.button({
		"text": false,
		"icon": "ui-icon-gear"
	});
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
	button.button({
		"text": true,
		"icon": "ui-icon-gear"
	});
	equal( button.button( "option", "showLabel" ), true,
		"Setting the text option to false sets the showLabel option to true on init" );
	button.button( "destroy" );
	button.button({
		"showLabel": true,
		"icon": "ui-icon-gear"
	});
	equal( button.button( "option", "text" ), true,
		"Setting the showLabel option to true sets the text option to true on init" );
	button.button( "destroy" );
	button.button({
		"showLabel": false,
		"icon": "ui-icon-gear"
	});
	equal( button.button( "option", "text" ), false,
		"Setting the showLabel option to false sets the text option to false on init" );
});

test( "icon and icons options properly proxied", function(){
	expect( 10 );

	var button = $( "#button" );

	button.button({
		"icon": "foo"
	});

	equal( button.button( "option", "icons.primary" ), "foo",
		"Icon option properly proxied on init" );

	button.button({
		"icon": "bar"
	});

	equal( button.button( "option", "icons.primary" ), "bar",
		"Icon option properly proxied with option method" );

	button.button({
		"icons": {
			primary: "foo"
		}
	});

	equal( button.button( "option", "icon" ), "foo",
		"Icons primary option properly proxied with option method" );
	equal( button.button( "option", "iconPosition" ), "beginning",
		"Icons primary option sets iconPosition option to beginning" );

	button.button({
		"icons": {
			secondary: "bar"
		}
	});

	equal( button.button( "option", "icon" ), "bar",
		"Icons secondary option properly proxied with option method" );
	equal( button.button( "option", "iconPosition" ), "end",
		"Icons secondary option sets iconPosition option to end" );

	button.button( "destroy" );

	button.button({
		"icons": {
			primary: "foo"
		}
	});

	equal( button.button( "option", "icon" ), "foo",
		"Icons primary option properly proxied on init" );
	equal( button.button( "option", "iconPosition" ), "beginning",
		"Icons primary option sets iconPosition option to beginning on init" );

	button.button({
		"icons": {
			secondary: "bar"
		}
	});

	equal( button.button( "option", "icon" ), "bar",
		"Icons secondary option properly proxied on init" );
	equal( button.button( "option", "iconPosition" ), "end",
		"Icons secondary option sets iconPosition option to end on init" );
});

})(jQuery);