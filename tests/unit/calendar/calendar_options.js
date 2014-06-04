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

	element.calendar( "destroy" );
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

test( "numberOfMonths", function() {
	// TODO implement this
	expect( 0 );
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

/*
// TODO: Rewrite for value option
test( "defaultDate", function() {
	expect( 16 );
	 var inp = TestHelpers.calendar.init( "#inp" ),
	 date = new Date();
	 inp.val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date null" );

	 // Numeric values
	 inp.calendar( "option", {defaultDate: -2}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date.setDate(date.getDate() - 2);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date -2" );

	 date = new Date();
	 inp.calendar( "option", {defaultDate: 3}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date.setDate(date.getDate() + 3);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date 3" );

	 date = new Date();
	 inp.calendar( "option", {defaultDate: 1 / "a"}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date NaN" );

	 // String offset values
	 inp.calendar( "option", {defaultDate: "-1d"}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date.setDate(date.getDate() - 1);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date -1d" );
	 inp.calendar( "option", {defaultDate: "+3D"}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date.setDate(date.getDate() + 4);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date +3D" );
	 inp.calendar( "option", {defaultDate: " -2 w "}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date = new Date();
	 date.setDate(date.getDate() - 14);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date -2 w" );
	 inp.calendar( "option", {defaultDate: "+1 W"}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date.setDate(date.getDate() + 21);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date +1 W" );
	 inp.calendar( "option", {defaultDate: " -1 m "}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date = TestHelpers.calendar.addMonths(new Date(), -1);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date -1 m" );
	 inp.calendar( "option", {defaultDate: "+2M"}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date = TestHelpers.calendar.addMonths(new Date(), 2);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date +2M" );
	 inp.calendar( "option", {defaultDate: "-2y"}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date = new Date();
	 date.setFullYear(date.getFullYear() - 2);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date -2y" );
	 inp.calendar( "option", {defaultDate: "+1 Y "}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date.setFullYear(date.getFullYear() + 3);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date +1 Y" );
	 inp.calendar( "option", {defaultDate: "+1M +10d"}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date = TestHelpers.calendar.addMonths(new Date(), 1);
	 date.setDate(date.getDate() + 10);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date +1M +10d" );
	 // String date values
	 inp.calendar( "option", {defaultDate: "07/04/2007"}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date = new Date(2007, 7 - 1, 4);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date 07/04/2007" );
	 inp.calendar( "option", {dateFormat: "yy-mm-dd", defaultDate: "2007-04-02"}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 date = new Date(2007, 4 - 1, 2);
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date 2007-04-02" );
	 // Date value
	 date = new Date(2007, 1 - 1, 26);
	 inp.calendar( "option", {dateFormat: "mm/dd/yy", defaultDate: date}).
	 datepicker( "hide" ).val( "" ).calendar( "show" ).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), date, "Default date 01/26/2007" );
 });
 */

test( "min / max", function() {
	expect( 7 );

	/*
	 // TODO CTRL + PgUp / PgDn is not implemented yet, see wiki
	 var date,
	 inp = TestHelpers.calendar.init( "#calendar" ),
	 dp = inp.calendar( "widget" ),
	 lastYear = new Date( 2007, 6 - 1, 4 ),
	 nextYear = new Date( 2009, 6 - 1, 4 ),
	 minDate = new Date( 2008, 2 - 1, 29 ),
	 maxDate = new Date( 2008, 12 - 1, 7 );

	 inp.val( "06/04/2008" ).calendar( "refresh" ).calendar( "open" );
	 inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
	 simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	 TestHelpers.calendar.equalsDate( inp.calendar( "valueAsDate" ), lastYear, "Min/max - null, null - ctrl+pgup" );

	 inp.val( "06/04/2008" ).calendar( "refresh" ).calendar( "open" );
	 inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN } ).
	 simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	 TestHelpers.calendar.equalsDate( inp.calendar( "valueAsDate" ), nextYear, "Min/max - null, null - ctrl+pgdn" );

	 inp.calendar( "option", { min: minDate } ).
	 datepicker( "close" ).val( "06/04/2008" ).calendar( "refresh" ).calendar( "open" );
	 inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
	 simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	 TestHelpers.calendar.equalsDate( inp.calendar( "valueAsDate" ), minDate, "Min/max - 02/29/2008, null - ctrl+pgup" );

	 inp.val( "06/04/2008" ).calendar( "refresh" ).calendar( "open" );
	 inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), nextYear, "Min/max - 02/29/2008, null - ctrl+pgdn" );

	 inp.calendar( "option", { max: maxDate } ).
	 datepicker( "hide" ).val( "06/04/2008" ).calendar( "open" );
	 inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
	 simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	 TestHelpers.calendar.equalsDate(inp.calendar( "getDate" ), minDate, "Min/max - 02/29/2008, 12/07/2008 - ctrl+pgup" );

	 inp.val( "06/04/2008" ).calendar( "open" );
	 inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 TestHelpers.calendar.equalsDate(inp.calendar( "valueAsDate" ), maxDate, "Min/max - 02/29/2008, 12/07/2008 - ctrl+pgdn" );

	 inp.calendar( "option", {minDate: null}).
	 datepicker( "hide" ).val( "06/04/2008" ).calendar( "open" );
	 inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP}).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 TestHelpers.calendar.equalsDate(inp.calendar( "valueAsDate" ), lastYear, "Min/max - null, 12/07/2008 - ctrl+pgup" );

	 inp.val( "06/04/2008" ).calendar( "open" );
	 inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 TestHelpers.calendar.equalsDate(inp.calendar( "valueAsDate" ), maxDate, "Min/max - null, 12/07/2008 - ctrl+pgdn" );

	 // Relative dates
	 date = new Date();
	 date.setDate(date.getDate() - 7);
	 inp.calendar( "option", {minDate: "-1w", maxDate: "+1 M +10 D "}).
	 datepicker( "hide" ).val( "" ).calendar( "open" );
	 inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP}).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 TestHelpers.calendar.equalsDate(inp.calendar( "valueAsDate" ), date, "Min/max - -1w, +1 M +10 D - ctrl+pgup" );

	 date = TestHelpers.calendar.addMonths(new Date(), 1);
	 date.setDate(date.getDate() + 10);
	 inp.val( "" ).calendar( "show" );
	 inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
	 simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	 TestHelpers.calendar.equalsDate(inp.calendar( "valueAsDate" ), date, "Min/max - -1w, +1 M +10 D - ctrl+pgdn" );
	 */

	// With existing date
	var element = $( "#calendar" ).calendar(),
		minDate = new Date( 2008, 2 - 1, 29 ),
		maxDate = new Date( 2008, 12 - 1, 7 );

	element
		.calendar( "option", { min: minDate } )
		.calendar( "value", "6/4/08" );
	TestHelpers.calendar.equalsDate( element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value > min" );

	element
		.calendar( "option", { min: minDate } )
		.calendar( "value", "1/4/08" );
	TestHelpers.calendar.equalsDate( element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value < min" );

	element
		.calendar( "option", { min: null } )
		.calendar( "value", "6/4/08" )
		.calendar( "option", { max: maxDate } );
	TestHelpers.calendar.equalsDate( element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value < max" );

	element
		.calendar( "option", { max: maxDate } )
		.calendar( "value", "1/4/09" );
	TestHelpers.calendar.equalsDate( element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - setDate > max" );

	element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "1/4/08" );
	TestHelpers.calendar.equalsDate( element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value < min" );

	element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "6/4/08" );
	TestHelpers.calendar.equalsDate( element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value > min, < max" );

	element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "1/4/09" );
	TestHelpers.calendar.equalsDate( element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value > max" );});

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
