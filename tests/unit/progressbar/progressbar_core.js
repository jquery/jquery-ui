module( "progressbar: core" );

test( "markup structure", function() {
	expect( 7 );
	var element = $( "#progressbar" ).progressbar(),
		value = element.children().eq( 0 );
	ok( element.is( ".ui-progressbar.ui-widget.ui-widget-content.ui-corner-all" ),
		"main element has proper classes" );
	ok( !value.is( ".ui-progressbar-complete.ui-corner-right" ),
		"value does not have ui-corner-right or ui-progressbar-complete" );
	element.progressbar( "option", "value", 100 );
	ok( value.is( ".ui-progressbar-complete.ui-corner-right.ui-corner-left.ui-widget-header" ),
		"value has proper classes" );

	ok( !element.hasClass( "ui-progressbar-indeterminate" ),
		"main element is not .ui-progressbar-indeterminate" );
	equal( element.children().length, 1, "main element contains one child" );
	ok( element.children().eq( 0 ).is( ".ui-progressbar-value" ),
		"child is .ui-progressbar-value" );
	equal( element.children().children().length, 0, "no overlay div" );
});

test( "markup structure - indeterminate", function() {
	expect( 4 );
	var element = $( "#progressbar" ).progressbar({ value: false });
	ok( element.is( ".ui-progressbar.ui-progressbar-indeterminate" ),
		"main element has proper classes" );
	equal( element.children().length, 1, "main element contains one child" );
	ok( element.children().eq( 0 ).hasClass( "ui-progressbar-value" ),
		"child is .ui-progressbar-value" );
	equal( element.children().children( ".ui-progressbar-overlay" ).length, 1,
		".ui-progressbar-value has .ui-progressbar-overlay" );
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
