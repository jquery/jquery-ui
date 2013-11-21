(function( $ ) {

module( "datepicker: methods" );

test( "destroy", function() {
	expect( 10 );
	var input = $( "#datepicker" ).datepicker(),
		inline = $( "#inline" ).datepicker();

	ok( input.datepicker( "instance" ), "instance created" );
	ok( input.attr( "aria-owns" ), "aria-owns attribute added" );
	ok( input.attr( "aria-haspopup" ), "aria-haspopup attribute added" );
	input.datepicker( "destroy" );
	ok( !input.datepicker( "instance" ), "instance removed" );
	ok( !input.attr( "aria-owns" ), "aria-owns attribute removed" );
	ok( !input.attr( "aria-haspopup" ), "aria-haspopup attribute removed" );

	ok( inline.datepicker( "instance" ), "instance created" );
	ok( inline.children().length > 0, "inline datepicker has children" );
	inline.datepicker( "destroy" );
	ok( !inline.datepicker( "instance" ), "instance removed" );
	ok( inline.children().length === 0, "inline picker no longer has children" );
});

test( "enable / disable", function() {
	expect( 6 );
	var inl,
		inp = TestHelpers.datepicker.init( "#datepicker" ),
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
	inl = TestHelpers.datepicker.init( "#inline" );
	dp = inl.datepicker( "instance" );

	// TODO: Disabling inline pickers does not work.
	// TODO: When changeMonth and changeYear options are implemented ensure their dropdowns
	// are properly disabled when in an inline picker.
});

test( "widget", function() {
	expect( 1 );
	var actual = $( "#datepicker" ).datepicker().datepicker( "widget" );
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
	expect( 5 );
	var input = $( "#datepicker" ).datepicker(),
		picker = input.datepicker( "widget" ),
		inline = $( "#inline" ).datepicker();

	input.datepicker( "value", "1/1/2014" );
	equal( input.val(), "1/1/2014", "input's value set" );
	ok( picker.find( "a[data-timestamp]:first" ).hasClass( "ui-state-focus" ),
		"first day marked as selected" );
	equal( input.datepicker( "value" ), "1/1/2014", "getter" );

	inline.datepicker( "value", "1/1/2014" );
	ok( inline.find( "a[data-timestamp]:first" ).hasClass( "ui-state-focus" ),
		"first day marked as selected" );
	equal( inline.datepicker( "value" ), "1/1/2014", "getter" );

	// TODO: Handle for invalid values.

	input.datepicker( "destroy" );
	inline.datepicker( "destroy" );
});

test( "valueAsDate", function() {
	expect( 5 );
	var input = $( "#datepicker" ).datepicker(),
		picker = input.datepicker( "widget" ),
		inline = $( "#inline" ).datepicker();

	input.datepicker( "valueAsDate", new Date( 2014, 0, 1 ) );
	equal( input.val(), "1/1/2014", "input's value set" );
	ok( picker.find( "a[data-timestamp]:first" ).hasClass( "ui-state-focus" ),
		"first day marked as selected" );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ),
		new Date( 2014, 0, 1 ), "getter" );

	inline.datepicker( "valueAsDate", new Date( 2014, 0, 1 ) );
	ok( inline.find( "a[data-timestamp]:first" ).hasClass( "ui-state-focus" ),
		"first day marked as selected" );
	TestHelpers.datepicker.equalsDate( inline.datepicker( "valueAsDate" ),
		new Date( 2014, 0, 1 ), "getter" );

	// TODO: Handle for invalid values.

	input.datepicker( "destroy" );
	inline.datepicker( "destroy" );
});

})( jQuery );
