(function( $ ) {

module( "calendar: methods" );

test( "destroy", function() {
	expect( 1 );

	domEqual( "#calendar", function() {
		$( "#calendar" ).calendar().calendar( "destroy" );
	});
});

test( "enable / disable", function() {
	expect( 6 );

	var element = $( "#calendar" ).calendar();

	ok( !element.calendar( "option", "disabled" ), "initially enabled" );
	ok( !element.hasClass( "ui-calendar-disabled" ), "does not have disabled class name" );

	element.calendar( "disable" );
	ok( element.calendar( "option", "disabled" ), "disabled option is set" );
	ok( element.hasClass( "ui-calendar-disabled" ), "calendar has disabled class name" );

	element.calendar( "enable" );
	ok( !element.calendar( "option", "disabled" ), "enabled after enable() call" );
	ok( !element.hasClass( "ui-calendar-disabled" ), "no longer has disabled class name" );
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
	expect( 4 );

	var element = $( "#calendar" ).calendar(),
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
});

})( jQuery );
