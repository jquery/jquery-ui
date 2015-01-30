module( "progressbar: core" );

test( "markup structure", function( assert ) {
	expect( 7 );
	var element = $( "#progressbar" ).progressbar(),
		value = element.children().eq( 0 );

	assert.hasClasses( element, "ui-progressbar ui-widget ui-widget-content" );
	assert.lacksClasses( value, "ui-progressbar-complete" );
	element.progressbar( "option", "value", 100 );
	assert.hasClasses( value, "ui-progressbar-complete ui-widget-header" );
	assert.lacksClasses( element, "ui-progressbar-indeterminate" );
	equal( element.children().length, 1, "Main element contains one child" );
	assert.hasClasses( element.children().eq( 0 ), "ui-progressbar-value" );
	equal( element.children().children().length, 0, "no overlay div" );
});

test( "markup structure - indeterminate", function( assert ) {
	expect( 4 );
	var element = $( "#progressbar" ).progressbar({ value: false });
	assert.hasClasses( element, "ui-progressbar ui-progressbar-indeterminate" );
	equal( element.children().length, 1, "Main element contains one child" );
	assert.hasClasses( element.children().eq( 0 ), "ui-progressbar-value" );
	equal( element.children().children( ".ui-progressbar-overlay" ).length, 1,
		"Value has class ui-progressbar-overlay" );
});

test( "accessibility", function() {
	expect( 11 );
	var element = $( "#progressbar" ).progressbar();

	equal( element.attr( "role" ), "progressbar", "aria role" );
	equal( element.attr( "aria-valuemin" ), 0, "aria-valuemin" );
	equal( element.attr( "aria-valuemax" ), 100, "aria-valuemax" );
	equal( element.attr( "aria-valuenow" ), 0, "aria-valuenow initially" );

	element.progressbar( "value", 77 );
	equal( element.attr( "aria-valuenow" ), 77, "aria-valuenow" );

	element.progressbar( "option", "max", 150 );
	equal( element.attr( "aria-valuemax" ), 150, "aria-valuemax" );

	element.progressbar( "disable" );
	equal( element.attr( "aria-disabled" ), "true", "aria-disabled on" );

	element.progressbar( "enable" );
	equal( element.attr( "aria-disabled" ), "false", "aria-disabled off" );

	element.progressbar( "option", "value", false );
	equal( element.attr( "aria-valuemin" ), 0, "aria-valuemin" );
	equal( element.attr( "aria-valuemax" ), 150, "aria-valuemax" );
	strictEqual( element.attr( "aria-valuenow" ), undefined, "aria-valuenow" );
});
