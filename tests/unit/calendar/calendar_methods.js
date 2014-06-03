(function( $ ) {

module( "calendar: methods" );

test( "destroy", function() {
	expect( 10 );
	var input = $( "#calendar" ).calendar(),
		inline = $( "#inline" ).calendar();

	ok( input.calendar( "instance" ), "instance created" );
	ok( input.attr( "aria-owns" ), "aria-owns attribute added" );
	ok( input.attr( "aria-haspopup" ), "aria-haspopup attribute added" );
	input.calendar( "destroy" );
	ok( !input.calendar( "instance" ), "instance removed" );
	ok( !input.attr( "aria-owns" ), "aria-owns attribute removed" );
	ok( !input.attr( "aria-haspopup" ), "aria-haspopup attribute removed" );

	ok( inline.calendar( "instance" ), "instance created" );
	ok( inline.children().length > 0, "inline calendar has children" );
	inline.calendar( "destroy" );
	ok( !inline.calendar( "instance" ), "instance removed" );
	ok( inline.children().length === 0, "inline picker no longer has children" );
});

test( "enable / disable", function() {
	expect( 6 );
	var inl,
		inp = TestHelpers.calendar.init( "#calendar" ),
		dp = inp.calendar( "widget" );

	ok( !inp.calendar( "option", "disabled" ), "initially enabled" );
	ok( !dp.hasClass( "ui-calendar-disabled" ), "does not have disabled class name" );

	inp.calendar( "disable" );
	ok( inp.calendar( "option", "disabled" ), "disabled option is set" );
	ok( dp.hasClass( "ui-calendar-disabled" ), "calendar has disabled class name" );

	inp.calendar( "enable" );
	ok( !inp.calendar( "option", "disabled" ), "enabled after enable() call" );
	ok( !dp.hasClass( "ui-calendar-disabled" ), "no longer has disabled class name" );

	// Inline
	inl = TestHelpers.calendar.init( "#inline" );
	dp = inl.calendar( "instance" );

	// TODO: Disabling inline pickers does not work.
	// TODO: When changeMonth and changeYear options are implemented ensure their dropdowns
	// are properly disabled when in an inline picker.
});

test( "widget", function() {
	expect( 1 );
	var actual = $( "#calendar" ).calendar().calendar( "widget" );
	deepEqual( $( "body > .ui-front" )[ 0 ],  actual[ 0 ] );
	actual.remove();
});

test( "close", function() {
	expect( 0 );
});

test( "open", function() {
	expect( 0 );
});

test( "value", function() {
	expect( 6 );
	var input = $( "#calendar" ).calendar(),
		picker = input.calendar( "widget" ),
		inline = $( "#inline" ).calendar();

	input.calendar( "value", "1/1/14" );
	equal( input.val(), "1/1/14", "input's value set" );
	ok( picker.find( "a[data-timestamp]:first" ).hasClass( "ui-state-focus" ),
		"first day marked as selected" );
	equal( input.calendar( "value" ), "1/1/14", "getter" );

	input.val( "abc" );
	equal( input.calendar( "value" ), "abc",
		"Invalid values should be returned without formatting." );

	inline.calendar( "value", "1/1/14" );
	ok( inline.find( "a[data-timestamp]:first" ).hasClass( "ui-state-focus" ),
		"first day marked as selected" );
	equal( inline.calendar( "value" ), "1/1/14", "getter" );

	input.calendar( "destroy" );
	inline.calendar( "destroy" );
});

test( "valueAsDate", function() {
	expect( 6 );
	var input = $( "#calendar" ).calendar(),
		picker = input.calendar( "widget" ),
		inline = $( "#inline" ).calendar();

	input.calendar( "valueAsDate", new Date( 2014, 0, 1 ) );
	equal( input.val(), "1/1/14", "input's value set" );
	ok( picker.find( "a[data-timestamp]:first" ).hasClass( "ui-state-focus" ),
		"first day marked as selected" );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ),
		new Date( 2014, 0, 1 ), "getter" );

	input.val( "a/b/c" );
	equal( input.calendar( "valueAsDate" ), null, "Invalid dates return null" );

	inline.calendar( "valueAsDate", new Date( 2014, 0, 1 ) );
	ok( inline.find( "a[data-timestamp]:first" ).hasClass( "ui-state-focus" ),
		"first day marked as selected" );
	TestHelpers.calendar.equalsDate( inline.calendar( "valueAsDate" ),
		new Date( 2014, 0, 1 ), "getter" );

	input.calendar( "destroy" );
	inline.calendar( "destroy" );
});

test( "isValid", function() {
	expect( 2 );
	var input = $( "#calendar" ).calendar();

	input.val( "1/1/14" );
	ok( input.calendar( "isValid" ) );

	input.val( "1/1/abc" );
	ok( !input.calendar( "isValid" ) );

	input.calendar( "destroy" );
});

})( jQuery );
