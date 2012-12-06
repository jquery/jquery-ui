module( "progressbar: core" );

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
