(function( $ ) {

module( "calendar: options" );

test( "dateFormat", function() {
	expect( 2 );
	var element = $( "#calendar" ).calendar({
			value: "1/1/14"
		}),
		firstDayLink = element.calendar( "widget" ).find( "td[id]:first a" );

	firstDayLink.trigger( "mousedown" );
	equal( element.calendar( "value" ), "1/1/14", "default formatting" );

	element.calendar( "option", "dateFormat", { date: "full" } );
	equal( element.calendar( "value" ), "Wednesday, January 1, 2014", "updated formatting" );
});

test( "eachDay", function() {
	expect( 5 );
	var timestamp,
		input = $( "#calendar" ).calendar(),
		picker = input.calendar( "widget" ),
		firstCell = picker.find( "td[id]:first" );

	equal( firstCell.find( "a" ).length, 1, "days are selectable by default" );
	timestamp = parseInt( firstCell.find( "a" ).attr( "data-timestamp" ), 10 );
	equal( new Date( timestamp ).getDate(), 1, "first available day is the 1st by default" );

	// Do not render the 1st of the month
	input.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.render = false;
		}
	});
	firstCell = picker.find( "td[id]:first" );
	timestamp = parseInt( firstCell.find( "a" ).attr( "data-timestamp" ), 10 );
	equal( new Date( timestamp ).getDate(), 2, "first available day is the 2nd" );

	// Display the 1st of the month but make it not selectable.
	input.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.selectable = false;
		}
	});
	firstCell = picker.find( "td[id]:first" );
	equal( firstCell.find( "a" ).length, 0, "the 1st is not selectable" );

	input.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.extraClasses = "ui-custom";
		}
	});
	ok( picker.find( "td[id]:first a" ).hasClass( "ui-custom" ), "extraClasses applied" );

	input.calendar( "destroy" );
});

test( "showWeek", function() {
	expect( 7 );
	var input = $( "#calendar" ).calendar(),
		container = input.calendar( "widget" );

	equal( container.find( "thead th" ).length, 7, "just 7 days, no column cell" );
	equal( container.find( ".ui-calendar-week-col" ).length, 0,
		"no week column cells present" );
	input.calendar( "destroy" );

	input = $( "#calendar" ).calendar({ showWeek: true });
	container = input.calendar( "widget" );
	equal( container.find( "thead th" ).length, 8, "7 days + a column cell" );
	ok( container.find( "thead th:first" ).is( ".ui-calendar-week-col" ),
		"first cell should have ui-datepicker-week-col class name" );
	equal( container.find( ".ui-calendar-week-col" ).length,
		container.find( "tr" ).length, "one week cell for each week" );
	input.calendar( "destroy" );

	input = $( "#calendar" ).calendar();
	container = input.calendar( "widget" );
	equal( container.find( "thead th" ).length, 7, "no week column" );
	input.calendar( "option", "showWeek", true );
	equal( container.find( "thead th" ).length, 8, "supports changing option after init" );
});

test( "min / max", function() {
	expect( 0 );
});

/*
// TODO: Move this to $.date, Globalize or calendar widget
test( "daylightSaving", function() {
	 expect( 25 );
	 var inp = TestHelpers.calendar.init( "#inp" ),
	 dp = $( "#ui-datepicker-div" );
	 ok(true, "Daylight saving - " + new Date());
	 // Australia, Sydney - AM change, southern hemisphere
	 inp.val( "04/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	 equal(inp.val(), "04/05/2008", "Daylight saving - Australia 04/05/2008" );
	 inp.val( "04/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	 equal(inp.val(), "04/06/2008", "Daylight saving - Australia 04/06/2008" );
	 inp.val( "04/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	 equal(inp.val(), "04/07/2008", "Daylight saving - Australia 04/07/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	 equal(inp.val(), "10/04/2008", "Daylight saving - Australia 10/04/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	 equal(inp.val(), "10/05/2008", "Daylight saving - Australia 10/05/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	 equal(inp.val(), "10/06/2008", "Daylight saving - Australia 10/06/2008" );
	 // Brasil, Brasilia - midnight change, southern hemisphere
	 inp.val( "02/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(20) a", dp).simulate( "click" );
	 equal(inp.val(), "02/16/2008", "Daylight saving - Brasil 02/16/2008" );
	 inp.val( "02/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(21) a", dp).simulate( "click" );
	 equal(inp.val(), "02/17/2008", "Daylight saving - Brasil 02/17/2008" );
	 inp.val( "02/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(22) a", dp).simulate( "click" );
	 equal(inp.val(), "02/18/2008", "Daylight saving - Brasil 02/18/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(13) a", dp).simulate( "click" );
	 equal(inp.val(), "10/11/2008", "Daylight saving - Brasil 10/11/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(14) a", dp).simulate( "click" );
	 equal(inp.val(), "10/12/2008", "Daylight saving - Brasil 10/12/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(15) a", dp).simulate( "click" );
	 equal(inp.val(), "10/13/2008", "Daylight saving - Brasil 10/13/2008" );
	 // Lebanon, Beirut - midnight change, northern hemisphere
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(34) a", dp).simulate( "click" );
	 equal(inp.val(), "03/29/2008", "Daylight saving - Lebanon 03/29/2008" );
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(35) a", dp).simulate( "click" );
	 equal(inp.val(), "03/30/2008", "Daylight saving - Lebanon 03/30/2008" );
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(36) a", dp).simulate( "click" );
	 equal(inp.val(), "03/31/2008", "Daylight saving - Lebanon 03/31/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(27) a", dp).simulate( "click" );
	 equal(inp.val(), "10/25/2008", "Daylight saving - Lebanon 10/25/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(28) a", dp).simulate( "click" );
	 equal(inp.val(), "10/26/2008", "Daylight saving - Lebanon 10/26/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(29) a", dp).simulate( "click" );
	 equal(inp.val(), "10/27/2008", "Daylight saving - Lebanon 10/27/2008" );
	 // US, Eastern - AM change, northern hemisphere
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(13) a", dp).simulate( "click" );
	 equal(inp.val(), "03/08/2008", "Daylight saving - US 03/08/2008" );
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(14) a", dp).simulate( "click" );
	 equal(inp.val(), "03/09/2008", "Daylight saving - US 03/09/2008" );
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(15) a", dp).simulate( "click" );
	 equal(inp.val(), "03/10/2008", "Daylight saving - US 03/10/2008" );
	 inp.val( "11/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	 equal(inp.val(), "11/01/2008", "Daylight saving - US 11/01/2008" );
	 inp.val( "11/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	 equal(inp.val(), "11/02/2008", "Daylight saving - US 11/02/2008" );
	 inp.val( "11/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	 equal(inp.val(), "11/03/2008", "Daylight saving - US 11/03/2008" );
 });
 */

})(jQuery);
