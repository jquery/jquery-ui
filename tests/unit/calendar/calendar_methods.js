(function( $ ) {

module( "calendar: methods" );

test( "destroy", function() {
	expect( 1 );

	domEqual( "#calendar", function() {
		$( "#calendar" ).calendar().calendar( "destroy" );
	});
});

test( "enable / disable", function() {
	expect( 8 );

	var element = $( "#calendar" ).calendar();

	element.calendar( "disable" );
	ok( element.calendar( "option", "disabled" ), "disabled option is set" );
	ok( element.hasClass( "ui-calendar-disabled" ), "has disabled widget class name" );
	ok( element.hasClass( "ui-state-disabled" ), "has disabled state class name" );
	equal( element.attr( "aria-disabled" ), "true", "has ARIA disabled" );

	element.calendar( "enable" );
	ok( !element.calendar( "option", "disabled" ), "enabled after enable() call" );
	ok( !element.hasClass( "ui-calendar-disabled" ), "no longer has disabled widget class name" );
	ok( !element.hasClass( "ui-state-disabled" ), "no longer has disabled state class name" );
	equal( element.attr( "aria-disabled" ), "false", "no longer has ARIA disabled" );
});

test( "widget", function() {
	expect( 1 );

	var element = $( "#calendar" ).calendar(),
		widget = element.calendar( "widget" );

	strictEqual( widget[ 0 ],  element[ 0 ] );
});

test( "value", function() {
	expect( 3 );
	var element = $( "#calendar" ).calendar();

	element.calendar( "value", "1/1/14" );
	ok( element.find( "a[data-timestamp]:first" ).hasClass( "ui-state-active" ), "first day marked as selected" );
	equal( element.calendar( "value" ), "1/1/14", "getter" );

	element.calendar( "value", "abc" );
	equal( element.calendar( "value" ), "1/1/14", "Setting invalid values should be ignored." );
});

test( "valueAsDate", function() {
	expect( 11 );

	var minDate, maxDate, dateAndTimeToSet, dateAndTimeClone,
		element = $( "#calendar" ).calendar(),
		date1 = new Date( 2008, 6 - 1, 4 ),
		date2 = new Date();

	element.calendar( "valueAsDate", new Date( 2014, 0, 1 ) );
	ok( element.find( "a[data-timestamp]:first" ).hasClass( "ui-state-active" ), "First day marked as selected" );
	TestHelpers.calendar.equalsDate( element.calendar( "valueAsDate" ), new Date( 2014, 0, 1 ), "Getter" );

	element.calendar( "destroy" );

	element.calendar();
	TestHelpers.calendar.equalsDate( element.calendar( "valueAsDate" ), date2, "Set date - default" );

	element.calendar( "valueAsDate", date1 );
	TestHelpers.calendar.equalsDate(element.calendar( "valueAsDate" ), date1, "Set date - 2008-06-04" );

	// With minimum/maximum
	element = $( "#calendar" ).calendar();
	date1 = new Date( 2008, 1 - 1, 4 );
	date2 = new Date( 2008, 6 - 1, 4 );
	minDate = new Date( 2008, 2 - 1, 29 );
	maxDate = new Date( 2008, 3 - 1, 28 );

	element
		.calendar( "option", { min: minDate } )
		.calendar( "valueAsDate", date2 );
	TestHelpers.calendar.equalsDate(
		element.calendar( "valueAsDate" ),
		date2, "Set date min/max - value > min"
	);

	element.calendar( "valueAsDate", date1 );
	TestHelpers.calendar.equalsDate(
		element.calendar( "valueAsDate" ),
		date2,
		"Set date min/max - value < min"
	);

	element
		.calendar( "option", { max: maxDate, min: null } )
		.calendar( "valueAsDate", date1 );
	TestHelpers.calendar.equalsDate(
		element.calendar( "valueAsDate" ),
		date1,
		"Set date min/max - value < max"
	);

	element.calendar( "valueAsDate", date2 );
	TestHelpers.calendar.equalsDate(
		element.calendar( "valueAsDate" ),
		date1,
		"Set date min/max - value > max"
	);

	element
		.calendar( "option", { min: minDate } )
		.calendar( "valueAsDate", date1 );
	TestHelpers.calendar.equalsDate(
		element.calendar( "valueAsDate" ),
		date1,
		"Set date min/max - value < min"
	);

	element.calendar( "valueAsDate", date2 );
	TestHelpers.calendar.equalsDate(
		element.calendar( "valueAsDate" ),
		date1, "Set date min/max - value > max"
	);

	dateAndTimeToSet = new Date( 2008, 3 - 1, 28, 1, 11, 0 );
	dateAndTimeClone = new Date( 2008, 3 - 1, 28, 1, 11, 0 );
	element.calendar( "valueAsDate", dateAndTimeToSet );
	equal(
		dateAndTimeToSet.getTime(),
		dateAndTimeClone.getTime(),
		"Date object passed should not be changed by valueAsDate"
	);
});

})( jQuery );
