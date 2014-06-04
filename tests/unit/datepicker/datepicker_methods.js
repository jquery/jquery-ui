(function( $ ) {

module( "datepicker: methods" );

test( "destroy", function() {
	expect( 3 );

	var input = $( "#datepicker" );
	domEqual( input, function() {
		input.datepicker();
		ok( input.attr( "aria-owns" ), "aria-owns attribute added" );
		ok( input.attr( "aria-haspopup" ), "aria-haspopup attribute added" );
		input.datepicker( "destroy" );
	});
});

test( "enable / disable", function() {
	expect( 6 );

	var input = TestHelpers.datepicker.init( "#datepicker" ),
		widget = input.datepicker( "widget" );

	ok( !input.datepicker( "option", "disabled" ), "initially enabled" );
	ok( !widget.hasClass( "ui-datepicker-disabled" ), "does not have disabled class name" );

	input.datepicker( "disable" );
	ok( input.datepicker( "option", "disabled" ), "disabled option is set" );
	ok( widget.hasClass( "ui-datepicker-disabled" ), "datepicker has disabled class name" );

	input.datepicker( "enable" );
	ok( !input.datepicker( "option", "disabled" ), "enabled after enable() call" );
	ok( !widget.hasClass( "ui-datepicker-disabled" ), "no longer has disabled class name" );
});

test( "widget", function() {
	expect( 1 );

	var actual = $( "#datepicker" ).datepicker().datepicker( "widget" );
	deepEqual( $( "body > .ui-front" )[ 0 ],  actual[ 0 ] );
	actual.remove();
});

test( "value", function() {
	expect( 4 );

	var input = $( "#datepicker" ).datepicker(),
		picker = input.datepicker( "widget" );

	input.datepicker( "value", "1/1/14" );
	equal( input.val(), "1/1/14", "input's value set" );

	input.datepicker( "open" );
	ok( picker.find( "a[data-timestamp]" ).eq( 0 ).hasClass( "ui-state-active" ), "first day marked as selected" );
	equal( input.datepicker( "value" ), "1/1/14", "getter" );

	input.val( "abc" );
	strictEqual( input.datepicker( "value" ), null, "Invalid values should return null." );
});

test( "valueAsDate", function() {
	expect( 13 );

	var minDate, maxDate, dateAndTimeToSet, dateAndTimeClone,
		input = TestHelpers.datepicker.init( "#datepicker" ),
		picker = input.datepicker( "widget" ),
		date1 = new Date( 2008, 6 - 1, 4 ),
		date2 = new Date();

	input.datepicker( "valueAsDate", new Date( 2014, 0, 1 ) );
	equal( input.val(), "1/1/14", "Input's value set" );
	ok( picker.find( "a[data-timestamp]" ).eq( 0 ).hasClass( "ui-state-active" ), "First day marked as selected" );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ), "Getter" );

	input.val( "a/b/c" );
	equal( input.datepicker( "valueAsDate" ), null, "Invalid dates return null" );

	input.val( "" ).datepicker( "destroy" );
	input = TestHelpers.datepicker.init( "#datepicker" );

	strictEqual( input.datepicker( "valueAsDate" ), null, "Set date - default" );
	input.datepicker( "valueAsDate", date1 );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), date1, "Set date - 2008-06-04" );

	// With minimum/maximum
	input = TestHelpers.datepicker.init( "#datepicker" );
	date1 = new Date( 2008, 1 - 1, 4 );
	date2 = new Date( 2008, 6 - 1, 4 );
	minDate = new Date( 2008, 2 - 1, 29 );
	maxDate = new Date( 2008, 3 - 1, 28 );

	input.val( "" ).datepicker( "option", { min: minDate } ).datepicker( "valueAsDate", date2 );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), date2, "Set date min/max - value > min" );

	input.datepicker( "valueAsDate", date1 );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), date2, "Set date min/max - value < min" );

	input.val( "" ).datepicker( "option", { max: maxDate, min: null } ).datepicker( "valueAsDate", date1 );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), date1, "Set date min/max - value < max" );

	input.datepicker( "valueAsDate", date2 );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), date1, "Set date min/max - value > max" );

	input.val( "" ).datepicker( "option", { min: minDate } ).datepicker( "valueAsDate", date1 );
	ok( input.datepicker( "valueAsDate" ) === null, "Set date min/max - value < min" );

	input.datepicker( "valueAsDate", date2 );
	ok( input.datepicker( "valueAsDate" ) === null, "Set date min/max - value > max" );

	dateAndTimeToSet = new Date( 2008, 3 - 1, 28, 1, 11, 0 );
	dateAndTimeClone = new Date( 2008, 3 - 1, 28, 1, 11, 0 );
	input.datepicker( "valueAsDate", dateAndTimeToSet );
	equal( dateAndTimeToSet.getTime(), dateAndTimeClone.getTime(), "Date object passed should not be changed by valueAsDate" );
});

test( "isValid", function() {
	expect( 2 );
	var input = $( "#datepicker" ).datepicker();

	input.val( "1/1/14" );
	ok( input.datepicker( "isValid" ) );

	input.val( "1/1/abc" );
	ok( !input.datepicker( "isValid" ) );

	input.datepicker( "destroy" );
});

})( jQuery );
