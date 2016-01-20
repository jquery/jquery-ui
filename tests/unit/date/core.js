define( [
	"jquery",
	"./helper",
	"ui/date"
], function( $, testHelper ) {

module( "date: core" );

var attributes = testHelper.getAttributes( "en" );

test( "Instantiation", function() {
	expect( 2 );
	ok( new $.ui.date( null, attributes ) instanceof $.ui.date, "constructor function" );
	ok( $.ui.date( null, attributes ) instanceof $.ui.date, "instantiation without new" );
} );

test( "Check Sets and Gets", 4, function() {
	var date = $.ui.date( null, attributes );
	equal( date.setDay( 15 ).day(), 15, "Set day and retrieve" );
	equal( date.setFullDate( 2012, 9, 15 ).year(), 2012, "Set full date and retrieve year" );
	equal( date.month(), 9, "Set full date and retrieve month" );
	equal( date.day(), 15, "Set full date and retrieve day" );

	// TODO Add setTime test
} );

test( "Date Adjustments - Normal Use Cases", 10, function() {
	var date = $.ui.date( null, attributes );

	// Use October 15, 2012
	date.setFullDate( 2012, 9, 15 );
	equal( date.adjust( "D", 1 ).day(), 16, "Add 1 day" );
	equal( date.adjust( "D", -1 ).day(), 15, "Subtract 1 day" );
	equal( date.adjust( "M", 1 ).month(), 10, "Add 1 month" );
	equal( date.adjust( "M", -1 ).month(), 9, "Subtract 1 month" );
	equal( date.adjust( "Y", 1 ).year(), 2013, "Add 1 year" );
	equal( date.adjust( "Y", -1 ).year(), 2012, "Subtract 1 year" );

	// Check changing one value impact another.  Ex: Day impacts month
	// Use April 30th 2012
	date.setFullDate( 2012, 3, 30 );
	equal( date.adjust( "D", 1 ).month(), 4, "Add 1 day to change month from April to May" );
	equal( date.adjust( "D", -1 ).month(), 3, "Subtract 1 day to change month from May to April" );

	// Use December 31st 2012
	date.setFullDate( 2012, 11, 31 );
	equal( date.adjust( "D", 1 ).year(), 2013, "Add 1 day to change year from 2012 to 2013" );
	equal( date.adjust( "D", -1 ).year(), 2012,
		"Subtract 1 day to change month from 2013 to 2012" );
} );

test( "Date Adjustments - Month Overflow Edge Cases", 2, function() {
	var date = $.ui.date( null, attributes );

	// Use May 31 2012
	date.setFullDate( 2012, 4, 31 );
	equal( date.adjust( "M", 1 ).day(), 30,
		"Add 1 month from May to June sets days to 30, last day in June (prevent Overflow)" );
	equal( date.adjust( "M", -1 ).day(), 30,
		"Subtract 1 month from June to May sets days to 30 in May" );
} );

test( "Date Adjustments - Leap Year Edge Cases", 1, function() {
	var date = $.ui.date( null, attributes );

	// Use February 29 2012 a Leap year
	date.setFullDate( 2012, 1, 29 );
	equal( date.adjust( "Y", 1 ).day(), 28,
		"Feb 29 2012, add a year to convert to Feb 28, 2013" );
} );

test( "List days of Week", 2, function() {
	var date = $.ui.date( null, attributes ),
		offset0 = [
			{ "fullname": "Sunday", "shortname": "Su" },
			{ "fullname": "Monday", "shortname": "Mo" },
			{ "fullname": "Tuesday", "shortname": "Tu" },
			{ "fullname": "Wednesday", "shortname": "We" },
			{ "fullname": "Thursday", "shortname": "Th" },
			{ "fullname": "Friday", "shortname": "Fr" },
			{ "fullname": "Saturday", "shortname": "Sa" }
		],
		offset1 = [
			{ "fullname": "Montag", "shortname": "Mo." },
			{ "fullname": "Dienstag", "shortname": "Di." },
			{ "fullname": "Mittwoch", "shortname": "Mi." },
			{ "fullname": "Donnerstag", "shortname": "Do." },
			{ "fullname": "Freitag", "shortname": "Fr." },
			{ "fullname": "Samstag", "shortname": "Sa." },
			{ "fullname": "Sonntag", "shortname": "So." }
		];

	deepEqual( date.weekdays(), offset0, "Get weekdays with start of day on 0 (English)" );
	date = $.ui.date( null, testHelper.getAttributes( "de" ) );
	deepEqual( date.weekdays(), offset1, "Get weekdays with start of day on 1 (Germany)" );
} );

test( "Days in Month", 3, function() {
	var date = $.ui.date( null, attributes );
	date.setFullDate( 2012, 1, 1 );
	equal( date.daysInMonth(), 29, "Leap Year implicit check for 29 days" );
	equal( date.daysInMonth( 2012, 1 ), 29, "Leap Year explicit check for 29 days" );
	equal( date.daysInMonth( 2011, 3 ), 30, "April has 30 days" );
} );

test( "Month Name", 2, function() {
	var date = $.ui.date( null, attributes );
	equal( date.setFullDate( 2012, 3, 1 ).monthName(), "April", "Month name return April (English)" );
	date = $.ui.date( null, testHelper.getAttributes( "de" ) );
	equal( date.setFullDate( 2012, 2, 1 ).monthName(), "März", "Month name return March (German)" );
} );

test( "Clone", 2, function() {
	var date = $.ui.date( null, attributes ),
		date2 = date.clone();
	ok( date2, "Created cloned object" );
	notEqual( date.adjust( "Y", 1 ).year(), date2.year(), "Object manipulated independently" );
} );

test( "Days", 1, function() {

	// TODO Needs work
	var date = $.ui.date( null, attributes );
	date.eachDay = function( day ) {
		if ( day.lead && day.date > 20 ) {
			day.selectable = false;
			day.render = true;
			day.title = "These are the days of last month";
			day.extraClasses = "ui-state-disabled";
		}
		if ( day.lead && day.date < 3 ) {
			day.selectable = true;
			day.render = true;
			day.extraClasses = "ui-state-disabled";
		}
		if ( day.date === 1 ) {
			day.extraClasses = "ui-state-error";
			day.title = "Something bad explaining the error highlight";
		}
		if ( day.today ) {
			day.title = "A good day!";
		}
	};
	ok( date.days(), "Date days() returns" );
} );

test( "Months", 5, function() {
	var date = $.ui.date( new Date( 2015, 11 - 1, 15 ), attributes ),
		currentMonth = date.months( 1 )[ 0 ],
		nextMonth = date.months( 1 )[ 1 ];

	ok( currentMonth.first, "Current month marked as first" );
	ok( !nextMonth.first, "Next month not marked as first" );
	ok( nextMonth.last, "Next month marked as last" );

	equal( currentMonth.month(), 10, "Current month index is November" );
	equal( nextMonth.month(), 11, "Next month index is December" );
} );

test( "Equal", 4, function() {
	var date = $.ui.date( null, attributes );
	date.setFullDate( 2012, 9, 16 );
	ok( date.equal( new Date( 2012, 9, 16 ) ), "Does date equal provide date" );
	ok( !date.equal( new Date( 2011, 9, 16 ) ), "Does date year not equal provide date" );
	ok( !date.equal( new Date( 2012, 8, 16 ) ), "Does date month not equal provide date" );
	ok( !date.equal( new Date( 2012, 9, 15 ) ), "Does date day not equal provide date" );
} );

test( "Date", 1, function() {
	var date = $.ui.date( null, attributes );
	ok( date.date() instanceof Date, "Date returned" );
} );

} );
