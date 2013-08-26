

var PROP_NAME = 'date';


module('date: core');

test('Check Date Setup', 2, function(){
	ok(true,'First Test Always Passes');
	ok($.date(), 'Load JQuery Date');
});
test('Check Sets and Gets', 6, function(){
	var date = $.date();
	equal(date.setYear(2012).year(), 2012, 'Set year and retrieve');
	equal(date.setMonth(9).month(), 9, 'Set month and retrieve');
	equal(date.setDay(15).day(), 15, 'Set day and retrieve');
	equal(date.setFullDate(2012,9,15).year(), 2012, 'Set full date and retrieve year');
	equal(date.month(), 9, 'Set full date and retrieve month');
	equal(date.day(), 15, 'Set full date and retrieve day');
});
test('Date Adjustments - Normal Use Cases', 10, function(){
	var date = $.date();
	//Use October 15, 2012
	date.setFullDate(2012,9,15);
	equal(date.adjust('D',1).day(),16,'Add 1 day');
	equal(date.adjust('D',-1).day(),15,'Subtract 1 day');
	equal(date.adjust('M',1).month(),10,'Add 1 month');
	equal(date.adjust('M',-1).month(),9,'Subtract 1 month');
	equal(date.adjust('Y',1).year(),2013,'Add 1 year');
	equal(date.adjust('Y',-1).year(),2012,'Subtract 1 year');
	//Check changing one value impact another.  Ex: Day impacts month
	//Use April 30th 2012
	date.setFullDate(2012,3,30);
	equal(date.adjust('D',1).month(),4,'Add 1 day to change month from April to May');
	equal(date.adjust('D',-1).month(),3,'Subtract 1 day to change month from May to April');
	//Use December 31st 2012
	date.setFullDate(2012,11,31);
	equal(date.adjust('D',1).year(),2013,'Add 1 day to change year from 2012 to 2013');
	equal(date.adjust('D',-1).year(),2012,'Subtract 1 day to change month from 2013 to 2012');

});

test('Date Adjustments - Month Overflow Edge Cases', 2, function(){
	var date = $.date();
	//Use May 31 2012
	date.setFullDate(2012,4,31);
	equal(date.adjust('M',1).day(),30,'Add 1 month from May to June sets days to 30, last day in June (prevent Overflow)');
	equal(date.adjust('M',-1).day(),30,'Subtract 1 month from June to May sets days to 30 in May');
});

test('Date Adjustments - Leap Year Edge Cases', 1, function(){
	var date = $.date();
	//Use February 29 2012 a Leap year
	date.setFullDate(2012,1,29);
	equal(date.adjust('Y',1).day(),28,'Feb 29 2012, add a year to convert to Feb 28, 2013');
});

test('List days of Week', 2, function(){
	var date = $.date();
	var offset0 = [
		{ 'fullname': 'Sunday', 'shortname': 'Su' },
		{ 'fullname': 'Monday', 'shortname': 'Mo' },
		{ 'fullname': 'Tuesday', 'shortname': 'Tu' },
		{ 'fullname': 'Wednesday', 'shortname': 'We' },
		{ 'fullname': 'Thursday', 'shortname': 'Th' },
		{ 'fullname': 'Friday', 'shortname': 'Fr' },
		{ 'fullname': 'Saturday', 'shortname': 'Sa' } ];
	var offset1 = [
		{ 'fullname': 'Montag', 'shortname': 'Mo' },
		{ 'fullname': 'Dienstag', 'shortname': 'Di' },
		{ 'fullname': 'Mittwoch', 'shortname': 'Mi' },
		{ 'fullname': 'Donnerstag', 'shortname': 'Do' },
		{ 'fullname': 'Freitag', 'shortname': 'Fr' },
		{ 'fullname': 'Samstag', 'shortname': 'Sa' },
		{ 'fullname': 'Sonntag', 'shortname': 'So' } ];
	deepEqual(date.weekdays(), offset0, 'Get weekdays with start of day on 0 (English)');
	Globalize.culture( 'de-DE' );
	date.refresh();
	deepEqual(date.weekdays(), offset1, 'Get weekdays with start of day on 1 (Germany)');
	//Revert Globalize changes back to English
	Globalize.culture('en-EN');
});

test('Leap Year Check', 8, function(){
	var date = $.date();
	ok(date.setYear( 2008 ).isLeapYear(), '2008 is a Leap Year');
	ok(!date.setYear( 2009 ).isLeapYear(), '2009 is not a Leap Year');
	ok(!date.setYear( 2010 ).isLeapYear(), '2010 is not a Leap Year');
	ok(!date.setYear( 2011 ).isLeapYear(), '2011 is not a Leap Year');
	ok(date.isLeapYear( 2012 ), '2012 is a Leap Year');
	ok(!date.isLeapYear( 2013 ), '2013 is not a Leap Year');
	ok(!date.isLeapYear( 2014 ), '2014 is not a Leap year');
	ok(!date.isLeapYear( 2015 ), '2015 is not a Leap year');
});

test('Days in Month', 3, function(){
	var date = $.date();
	date.setFullDate( 2012, 1, 1 );
	equal(date.daysInMonth(), 29, 'Leap Year implicit check for 29 days');
	equal(date.daysInMonth( 2012, 1 ), 29, 'Leap Year explicit check for 29 days');
	equal(date.daysInMonth( 2011, 3 ), 30, 'April has 30 days');
});

test('Month Name', 2, function(){
	var date = $.date();
	equal(date.setMonth(3).monthName(), 'April', 'Month name return April (English)');
	Globalize.culture( 'de-DE' );
	date.refresh();
	equal(date.setMonth(2).monthName(), 'März', 'Month name return March (German)');
	Globalize.culture('en-EN');

});

test('Clone', 2, function(){
	var date = $.date();
	var date2 = date.clone();
	ok(date2, 'Created cloned object');
	notEqual(date.adjust('Y',1).year(), date2.year(), 'Object manipulated independently');
});

test('Days', 1, function(){
	//TODO needs work
	var date = $.date();
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
		if ( day.date == 1 ) {
			day.extraClasses = "ui-state-error";
			day.title = "Something bad explaining the error highlight";
		}
		if ( day.today ) {
			day.title = "A good day!";
		}
	};
	ok(date.days(), 'Date days() returns');
});

test( "Months", 5, function(){
	var date = $.date(),
		firstMonth = date.months( 1 )[ 0 ],
		lastMonth = date.months( 1 )[ 1 ];

	ok( firstMonth.first );
	ok( !lastMonth.first );
	ok( lastMonth.last );
	ok( !lastMonth.first );

	ok( firstMonth.month() == ( lastMonth.month() - 1 ) );
});

test('iso8601Week', 2, function(){
	var date = $.date();
	//date.setFullDate(2012, 0, 8);
	equal(date.iso8601Week(new Date(2012, 0, 8)), 1, 'Test first week is 1');
	equal(date.iso8601Week(new Date(2012, 11, 31)), 1, 'Test last week is 1 in next year');
});

test('Equal', 4, function(){
	var date = $.date();
	date.setFullDate(2012, 9, 16);
	ok(date.equal(new Date(2012, 9, 16)), 'Does date equal provide date');
	ok(!date.equal(new Date(2011, 9, 16)), 'Does date year not equal provide date');
	ok(!date.equal(new Date(2012, 8, 16)), 'Does date month not equal provide date');
	ok(!date.equal(new Date(2012, 9, 15)), 'Does date day not equal provide date');
});

test('Date', 1, function(){
	var date = $.date();
	ok(date.date() instanceof Date, 'Date returned');
});

test('Format', 4, function(){
	var date = $.date();
	date.setFullDate(2012, 9, 16);
	equal(date.format(), '10/16/2012', 'Checking default US format');
	equal(date.format('yyyy/MM/dd'), '2012/10/16', 'Checking yyyy/MM/dd format');
	equal(date.format('yy/dd/MM'), '12/16/10', 'Checking yy/dd/MM format');
	equal(date.format('MMMM dd, yyyy'), 'October 16, 2012', 'Checking MMMM dd, yyyy format');
});

test('Calendar', 3, function(){
	var date = $.date();
	ok(date.calendar(), 'Calendar type returned')
	var de_cal = {calendars: {
		standard: {
			"/": ".",
			firstDay: 1,
			days: {
				names: ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
				namesAbbr: ["So","Mo","Di","Mi","Do","Fr","Sa"],
				namesShort: ["So","Mo","Di","Mi","Do","Fr","Sa"]
			},
			months: {
				names: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember",""],
				namesAbbr: ["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez",""]
			},
			AM: null,
			PM: null,
			eras: [{"name":"n. Chr.","start":null,"offset":0}],
			patterns: {
				d: "dd.MM.yyyy",
				D: "dddd, d. MMMM yyyy",
				t: "HH:mm",
				T: "HH:mm:ss",
				f: "dddd, d. MMMM yyyy HH:mm",
				F: "dddd, d. MMMM yyyy HH:mm:ss",
				M: "dd MMMM",
				Y: "MMMM yyyy"
			}
		}
	}};
	ok(date.calendar(de_cal), 'Calendar type changed');
	deepEqual(date.calendar(), de_cal, 'Calendar change verified');
});