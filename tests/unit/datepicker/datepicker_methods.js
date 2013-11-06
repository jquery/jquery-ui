(function( $ ) {

module( "datepicker: methods" );

test( "destroy", function() {
	expect( 9 );
	var inl,
		inp = TestHelpers.datepicker.init( "#inp" );

	ok( inp.datepicker( "instance" ), "instance created" );
	ok( inp.attr( "aria-owns" ), "aria-owns attribute added" );
	ok( inp.attr( "aria-haspopup" ), "aria-haspopup attribute added" );
	inp.datepicker( "destroy" );
	ok( !inp.datepicker( "instance" ), "instance removed" );
	ok( !inp.attr( "aria-owns" ), "aria-owns attribute removed" );
	ok( !inp.attr( "aria-haspopup" ), "aria-haspopup attribute removed" );

	inl = TestHelpers.datepicker.init( "#inl" );
	ok( inl.datepicker( "instance" ), "instance created" );
	ok( inl.children().length > 0, "inline datepicker has children" );
	inl.datepicker( "destroy" );
	ok( !inl.datepicker( "instance" ), "instance removed" );
	// TODO: Destroying inline datepickers currently does not work.
	// ok( inl.children().length === 0, "inline picker no longer has children" );
});

test( "enable / disable", function() {
	expect( 6 );
	var inl,
		inp = TestHelpers.datepicker.init( "#inp" ),
		dp = inp.datepicker( "widget" );

	ok( !inp.datepicker( "option", "disabled" ), "initially enabled" );
	ok( !dp.hasClass( "ui-datepicker-disabled" ), "does not have disabled class name" );

	inp.datepicker( "disable" );
	ok( inp.datepicker( "option", "disabled" ), "disabled option is set" );
	ok( dp.hasClass( "ui-datepicker-disabled" ), "datepicker has disabled class name" );

	inp.datepicker( "enable" );
	ok( !inp.datepicker( "option", "disabled" ), "enabled after enable() call" );
	ok( !dp.hasClass( "ui-datepicker-disabled" ), "no longer has disabled class name" );

	// Inline
	inl = TestHelpers.datepicker.init( "#inl" );
	dp = inl.datepicker( "instance" );

	// TODO: Disabling inline pickers does not work.
	// TODO: When changeMonth and changeYear options are implemented ensure their dropdowns
	// are properly disabled when in an inline picker.
});

test( "widget", function() {
	expect( 1 );
	var actual = $( "#inp" ).datepicker().datepicker( "widget" );
	deepEqual( $("body > .ui-front" )[ 0 ],  actual[ 0 ] );
	actual.remove();
});

test( "close", function() {
	expect( 0 );
});

test( "open", function() {
	expect( 0 );
});

test( "value", function() {
	expect( 0 );
});

})( jQuery );
