(function( $ ) {

module( "datepicker: options" );

test( "appendTo", function() {
	expect( 6 );
	var container,
		detached = $( "<div>" ),
		input = $( "#datepicker" );

	input.datepicker();
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, document.body, "defaults to body" );
	input.datepicker( "destroy" );

	input.datepicker({ appendTo: "#qunit-fixture" });
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, $( "#qunit-fixture" )[ 0 ], "child of specified element" );
	input.datepicker( "destroy" );

	input.datepicker({ appendTo: "#does-not-exist" });
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, document.body, "set to body if element does not exist" );
	input.datepicker( "destroy" );

	input.datepicker()
		.datepicker( "option", "appendTo", "#qunit-fixture" );
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, $( "#qunit-fixture" )[ 0 ], "modified after init" );
	input.datepicker( "destroy" );

	input.datepicker({ appendTo: detached });
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, detached[ 0 ], "detached jQuery object" );
	input.datepicker( "destroy" );

	input.datepicker({ appendTo: detached[ 0 ] });
	container = input.datepicker( "widget" ).parent()[ 0 ];
	equal( container, detached[ 0 ], "detached DOM element" );
	input.datepicker( "destroy" );
});

test( "dateFormat", function() {
	expect( 2 );
	var input = $( "#datepicker" ).val( "1/1/14" ).datepicker(),
		picker = input.datepicker( "widget" ),
		firstDayLink = picker.find( "td[id]:first a" );

	input.datepicker( "open" );
	firstDayLink.trigger( "mousedown" );
	equal( input.val(), "1/1/14", "default formatting" );

	input.datepicker( "option", "dateFormat", { date: "full" } );
	equal( input.val(), "Wednesday, January 1, 2014", "updated formatting" );

	input.datepicker( "destroy" );
});

test( "eachDay", function() {
	expect( 5 );
	var timestamp,
		input = $( "#datepicker" ).datepicker(),
		picker = input.datepicker( "widget" ),
		firstCell = picker.find( "td[id]:first" );

	equal( firstCell.find( "a" ).length, 1, "days are selectable by default" );
	timestamp = parseInt( firstCell.find( "a" ).attr( "data-timestamp" ), 10 );
	equal( new Date( timestamp ).getDate(), 1, "first available day is the 1st by default" );

	// Do not render the 1st of the month
	input.datepicker( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.render = false;
		}
	});
	firstCell = picker.find( "td[id]:first" );
	timestamp = parseInt( firstCell.find( "a" ).attr( "data-timestamp" ), 10 );
	equal( new Date( timestamp ).getDate(), 2, "first available day is the 2nd" );

	// Display the 1st of the month but make it not selectable.
	input.datepicker( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.selectable = false;
		}
	});
	firstCell = picker.find( "td[id]:first" );
	equal( firstCell.find( "a" ).length, 0, "the 1st is not selectable" );

	input.datepicker( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.extraClasses = "ui-custom";
		}
	});
	ok( picker.find( "td[id]:first a" ).hasClass( "ui-custom" ), "extraClasses applied" );

	input.datepicker( "destroy" );
});

test( "numberOfMonths", function() {
	// TODO implement this
	expect( 0 );
});

asyncTest( "position", function() {
	expect( 3 );
	var input = $( "<input>" ).datepicker().appendTo( "body" ).css({
			position: "absolute",
			top: 0,
			left: 0
		}),
		container = input.datepicker( "widget" );

	input.datepicker( "open" );
	setTimeout(function() {
		closeEnough( input.offset().left, container.offset().left, 1, "left sides line up by default" );
		closeEnough( container.offset().top, input.offset().top + input.outerHeight(), 1,
			"datepicker directly under input by default" );

		// Change the position option using option()
		input.datepicker( "option", "position", {
			my: "left top",
			at: "right bottom"
		});
		closeEnough( container.offset().left, input.offset().left + input.outerWidth(), 1,
			"datepicker on right hand side of input after position change" );

		input.remove();
		start();
	});
});

test( "showWeek", function() {
	expect( 7 );
	var input = $( "#datepicker" ).datepicker(),
		container = input.datepicker( "widget" );

	equal( container.find( "thead th" ).length, 7, "just 7 days, no column cell" );
	equal( container.find( ".ui-calendar-week-col" ).length, 0,
		"no week column cells present" );
	input.datepicker( "destroy" );

	input = $( "#datepicker" ).datepicker({ showWeek: true });
	container = input.datepicker( "widget" );
	equal( container.find( "thead th" ).length, 8, "7 days + a column cell" );
	ok( container.find( "thead th:first" ).is( ".ui-calendar-week-col" ),
		"first cell should have ui-datepicker-week-col class name" );
	equal( container.find( ".ui-calendar-week-col" ).length,
		container.find( "tr" ).length, "one week cell for each week" );
	input.datepicker( "destroy" );

	input = $( "#datepicker" ).datepicker();
	container = input.datepicker( "widget" );
	equal( container.find( "thead th" ).length, 7, "no week column" );
	input.datepicker( "option", "showWeek", true );
	equal( container.find( "thead th" ).length, 8, "supports changing option after init" );
});

/*
// TODO: Rewrite for value option
test( "defaultDate", function() {
	expect( 16 );
	var inp = TestHelpers.datepicker.init( "#inp" ),
		date = new Date();
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date null" );

	// Numeric values
	inp.datepicker( "option", {defaultDate: -2}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() - 2);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date -2" );

	date = new Date();
	inp.datepicker( "option", {defaultDate: 3}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 3);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date 3" );

	date = new Date();
	inp.datepicker( "option", {defaultDate: 1 / "a"}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date NaN" );

	// String offset values
	inp.datepicker( "option", {defaultDate: "-1d"}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() - 1);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date -1d" );
	inp.datepicker( "option", {defaultDate: "+3D"}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 4);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date +3D" );
	inp.datepicker( "option", {defaultDate: " -2 w "}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = new Date();
	date.setDate(date.getDate() - 14);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date -2 w" );
	inp.datepicker( "option", {defaultDate: "+1 W"}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 21);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date +1 W" );
	inp.datepicker( "option", {defaultDate: " -1 m "}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = TestHelpers.datepicker.addMonths(new Date(), -1);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date -1 m" );
	inp.datepicker( "option", {defaultDate: "+2M"}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = TestHelpers.datepicker.addMonths(new Date(), 2);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date +2M" );
	inp.datepicker( "option", {defaultDate: "-2y"}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = new Date();
	date.setFullYear(date.getFullYear() - 2);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date -2y" );
	inp.datepicker( "option", {defaultDate: "+1 Y "}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setFullYear(date.getFullYear() + 3);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date +1 Y" );
	inp.datepicker( "option", {defaultDate: "+1M +10d"}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = TestHelpers.datepicker.addMonths(new Date(), 1);
	date.setDate(date.getDate() + 10);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date +1M +10d" );
	// String date values
	inp.datepicker( "option", {defaultDate: "07/04/2007"}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = new Date(2007, 7 - 1, 4);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date 07/04/2007" );
	inp.datepicker( "option", {dateFormat: "yy-mm-dd", defaultDate: "2007-04-02"}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = new Date(2007, 4 - 1, 2);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date 2007-04-02" );
	// Date value
	date = new Date(2007, 1 - 1, 26);
	inp.datepicker( "option", {dateFormat: "mm/dd/yy", defaultDate: date}).
		datepicker( "hide" ).val( "" ).datepicker( "show" ).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Default date 01/26/2007" );
});
*/

test( "min / max", function() {
	expect( 14 );

	/*
	 // TODO CTRL + PgUp / PgDn is not implemented yet, see wiki
	var date,
		inp = TestHelpers.datepicker.init( "#datepicker" ),
		dp = inp.datepicker( "widget" ),
		lastYear = new Date( 2007, 6 - 1, 4 ),
		nextYear = new Date( 2009, 6 - 1, 4 ),
		minDate = new Date( 2008, 2 - 1, 29 ),
		maxDate = new Date( 2008, 12 - 1, 7 );

	inp.val( "06/04/2008" ).datepicker( "refresh" ).datepicker( "open" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "valueAsDate" ), lastYear, "Min/max - null, null - ctrl+pgup" );

	inp.val( "06/04/2008" ).datepicker( "refresh" ).datepicker( "open" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "valueAsDate" ), nextYear, "Min/max - null, null - ctrl+pgdn" );

	inp.datepicker( "option", { min: minDate } ).
		datepicker( "close" ).val( "06/04/2008" ).datepicker( "refresh" ).datepicker( "open" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "valueAsDate" ), minDate, "Min/max - 02/29/2008, null - ctrl+pgup" );

	inp.val( "06/04/2008" ).datepicker( "refresh" ).datepicker( "open" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), nextYear, "Min/max - 02/29/2008, null - ctrl+pgdn" );

	inp.datepicker( "option", { max: maxDate } ).
		datepicker( "hide" ).val( "06/04/2008" ).datepicker( "open" );
	inp.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), minDate, "Min/max - 02/29/2008, 12/07/2008 - ctrl+pgup" );

	inp.val( "06/04/2008" ).datepicker( "open" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.datepicker.equalsDate(inp.datepicker( "valueAsDate" ), maxDate, "Min/max - 02/29/2008, 12/07/2008 - ctrl+pgdn" );

	inp.datepicker( "option", {minDate: null}).
		datepicker( "hide" ).val( "06/04/2008" ).datepicker( "open" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.datepicker.equalsDate(inp.datepicker( "valueAsDate" ), lastYear, "Min/max - null, 12/07/2008 - ctrl+pgup" );

	inp.val( "06/04/2008" ).datepicker( "open" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.datepicker.equalsDate(inp.datepicker( "valueAsDate" ), maxDate, "Min/max - null, 12/07/2008 - ctrl+pgdn" );

	// Relative dates
	date = new Date();
	date.setDate(date.getDate() - 7);
	inp.datepicker( "option", {minDate: "-1w", maxDate: "+1 M +10 D "}).
		datepicker( "hide" ).val( "" ).datepicker( "open" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.datepicker.equalsDate(inp.datepicker( "valueAsDate" ), date, "Min/max - -1w, +1 M +10 D - ctrl+pgup" );

	date = TestHelpers.datepicker.addMonths(new Date(), 1);
	date.setDate(date.getDate() + 10);
	inp.val( "" ).datepicker( "show" );
	inp.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	TestHelpers.datepicker.equalsDate(inp.datepicker( "valueAsDate" ), date, "Min/max - -1w, +1 M +10 D - ctrl+pgdn" );
	 */

	// With existing date
	var inp = TestHelpers.datepicker.init( "#datepicker" ),
		minDate = new Date( 2008, 2 - 1, 29 ),
		maxDate = new Date( 2008, 12 - 1, 7 );

	inp.val( "6/4/08" ).datepicker( "option", { min: minDate } );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value > min" );
	ok( inp.datepicker( "isValid" ) );

	inp.datepicker( "option", { min: null } ).val( "1/4/08" ).datepicker( "option", { min: minDate } );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "valueAsDate" ), new Date( 2008, 1 - 1, 4 ), "Min/max - value < min" );
	ok( !inp.datepicker( "isValid" ) );

	inp.datepicker( "option", { min: null } ).val( "6/4/08" ).datepicker( "option", { max: maxDate } );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value < max" );
	ok( inp.datepicker( "isValid" ) );

	inp.datepicker( "option", { max: null } ).val( "1/4/09" ).datepicker( "option", { max: maxDate } );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "valueAsDate" ), new Date( 2009, 1 - 1, 4 ), "Min/max - setDate > max" );
	ok( !inp.datepicker( "isValid" ) );

	inp.datepicker( "option", { max: null } ).val( "1/4/08" ).datepicker( "option", { min: minDate, max: maxDate } );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "valueAsDate" ), new Date( 2008, 1 - 1, 4 ), "Min/max - value < min" );
	ok( !inp.datepicker( "isValid" ) );

	inp.datepicker( "option", { max: null } ).val( "6/4/08" ).datepicker( "option", { min: minDate, max: maxDate } );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value > min, < max" );
	ok( inp.datepicker( "isValid" ) );

	inp.datepicker( "option", { max: null } ).val( "1/4/09" ).datepicker( "option", { min: minDate, max: maxDate } );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "valueAsDate" ), new Date( 2009, 1 - 1, 4 ), "Min/max - value > max" );
	ok( !inp.datepicker( "isValid" ) );

	/*
	 // TODO: enable when yearRange option is implemented
	inp.datepicker( "option", {yearRange: "-0:+1"}).val( "01/01/" + new Date().getFullYear());
	ok(dp.find( ".ui-calendar-prev" ).hasClass( "ui-state-disabled" ), "Year Range Test - previous button disabled at 1/1/minYear" );
	inp.datepicker( "setDate", "12/30/" + new Date().getFullYear());
	ok(dp.find( ".ui-calendar-next" ).hasClass( "ui-state-disabled" ), "Year Range Test - next button disabled at 12/30/maxYear" );

	inp.datepicker( "option", {
		min: new Date(1900, 0, 1),
		max: "-6Y",
		yearRange: "1900:-6"
	}).val( "" );
	ok(dp.find( ".ui-calendar-next" ).hasClass( "ui-state-disabled" ), "Year Range Test - next button disabled" );
	ok(!dp.find( ".ui-calendar-prev" ).hasClass( "ui-state-disabled" ), "Year Range Test - prev button enabled" );

	inp.datepicker( "option", {
		min: new Date(1900, 0, 1),
		max: "1/25/2007",
		yearRange: "1900:2007"
	}).val( "" );
	ok(dp.find( ".ui-calendar-next" ).hasClass( "ui-state-disabled" ), "Year Range Test - next button disabled" );
	ok(!dp.find( ".ui-calendar-prev" ).hasClass( "ui-state-disabled" ), "Year Range Test - prev button enabled" );
	*/
});

/*

// TODO: Rewrite for valueAsDate / value
test( "setDate", function() {
	expect( 24 );
	var inl, alt, minDate, maxDate, dateAndTimeToSet, dateAndTimeClone,
		inp = TestHelpers.datepicker.init( "#inp" ),
		date1 = new Date(2008, 6 - 1, 4),
		date2 = new Date();
	ok(inp.datepicker( "getDate" ) == null, "Set date - default" );
	inp.datepicker( "setDate", date1);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date1, "Set date - 2008-06-04" );
	date1 = new Date();
	date1.setDate(date1.getDate() + 7);
	inp.datepicker( "setDate", +7);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date1, "Set date - +7" );
	date2.setFullYear(date2.getFullYear() + 2);
	inp.datepicker( "setDate", "+2y" );
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date2, "Set date - +2y" );
	inp.datepicker( "setDate", date1, date2);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date1, "Set date - two dates" );
	inp.datepicker( "setDate" );
	ok(inp.datepicker( "getDate" ) == null, "Set date - null" );
	// Relative to current date
	date1 = new Date();
	date1.setDate(date1.getDate() + 7);
	inp.datepicker( "setDate", "c +7" );
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date1, "Set date - c +7" );
	date1.setDate(date1.getDate() + 7);
	inp.datepicker( "setDate", "c+7" );
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date1, "Set date - c+7" );
	date1.setDate(date1.getDate() - 21);
	inp.datepicker( "setDate", "c -3 w" );
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date1, "Set date - c -3 w" );
	// Alternate field
	alt = $( "#alt" );
	inp.datepicker( "option", {altField: "#alt", altFormat: "yy-mm-dd"});
	date1 = new Date(2008, 6 - 1, 4);
	inp.datepicker( "setDate", date1);
	equal(inp.val(), "06/04/2008", "Set date alternate - 06/04/2008" );
	equal(alt.val(), "2008-06-04", "Set date alternate - 2008-06-04" );
	// With minimum/maximum
	inp = TestHelpers.datepicker.init( "#inp" );
	date1 = new Date(2008, 1 - 1, 4);
	date2 = new Date(2008, 6 - 1, 4);
	minDate = new Date(2008, 2 - 1, 29);
	maxDate = new Date(2008, 3 - 1, 28);
	inp.val( "" ).datepicker( "option", {minDate: minDate}).datepicker( "setDate", date2);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date2, "Set date min/max - setDate > min" );
	inp.datepicker( "setDate", date1);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), minDate, "Set date min/max - setDate < min" );
	inp.val( "" ).datepicker( "option", {maxDate: maxDate, minDate: null}).datepicker( "setDate", date1);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date1, "Set date min/max - setDate < max" );
	inp.datepicker( "setDate", date2);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), maxDate, "Set date min/max - setDate > max" );
	inp.val( "" ).datepicker( "option", {minDate: minDate}).datepicker( "setDate", date1);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), minDate, "Set date min/max - setDate < min" );
	inp.datepicker( "setDate", date2);
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), maxDate, "Set date min/max - setDate > max" );
	dateAndTimeToSet = new Date(2008, 3 - 1, 28, 1, 11, 0);
	dateAndTimeClone = new Date(2008, 3 - 1, 28, 1, 11, 0);
	inp.datepicker( "setDate", dateAndTimeToSet);
	equal(dateAndTimeToSet.getTime(), dateAndTimeClone.getTime(), "Date object passed should not be changed by setDate" );
});

// TODO: Move this to $.date, Globalize or calendar widget
test( "daylightSaving", function() {
	expect( 25 );
	var inp = TestHelpers.datepicker.init( "#inp" ),
		dp = $( "#ui-datepicker-div" );
	ok(true, "Daylight saving - " + new Date());
	// Australia, Sydney - AM change, southern hemisphere
	inp.val( "04/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	equal(inp.val(), "04/05/2008", "Daylight saving - Australia 04/05/2008" );
	inp.val( "04/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	equal(inp.val(), "04/06/2008", "Daylight saving - Australia 04/06/2008" );
	inp.val( "04/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	equal(inp.val(), "04/07/2008", "Daylight saving - Australia 04/07/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	equal(inp.val(), "10/04/2008", "Daylight saving - Australia 10/04/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	equal(inp.val(), "10/05/2008", "Daylight saving - Australia 10/05/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	equal(inp.val(), "10/06/2008", "Daylight saving - Australia 10/06/2008" );
	// Brasil, Brasilia - midnight change, southern hemisphere
	inp.val( "02/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(20) a", dp).simulate( "click" );
	equal(inp.val(), "02/16/2008", "Daylight saving - Brasil 02/16/2008" );
	inp.val( "02/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(21) a", dp).simulate( "click" );
	equal(inp.val(), "02/17/2008", "Daylight saving - Brasil 02/17/2008" );
	inp.val( "02/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(22) a", dp).simulate( "click" );
	equal(inp.val(), "02/18/2008", "Daylight saving - Brasil 02/18/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(13) a", dp).simulate( "click" );
	equal(inp.val(), "10/11/2008", "Daylight saving - Brasil 10/11/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(14) a", dp).simulate( "click" );
	equal(inp.val(), "10/12/2008", "Daylight saving - Brasil 10/12/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(15) a", dp).simulate( "click" );
	equal(inp.val(), "10/13/2008", "Daylight saving - Brasil 10/13/2008" );
	// Lebanon, Beirut - midnight change, northern hemisphere
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(34) a", dp).simulate( "click" );
	equal(inp.val(), "03/29/2008", "Daylight saving - Lebanon 03/29/2008" );
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(35) a", dp).simulate( "click" );
	equal(inp.val(), "03/30/2008", "Daylight saving - Lebanon 03/30/2008" );
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(36) a", dp).simulate( "click" );
	equal(inp.val(), "03/31/2008", "Daylight saving - Lebanon 03/31/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(27) a", dp).simulate( "click" );
	equal(inp.val(), "10/25/2008", "Daylight saving - Lebanon 10/25/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(28) a", dp).simulate( "click" );
	equal(inp.val(), "10/26/2008", "Daylight saving - Lebanon 10/26/2008" );
	inp.val( "10/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(29) a", dp).simulate( "click" );
	equal(inp.val(), "10/27/2008", "Daylight saving - Lebanon 10/27/2008" );
	// US, Eastern - AM change, northern hemisphere
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(13) a", dp).simulate( "click" );
	equal(inp.val(), "03/08/2008", "Daylight saving - US 03/08/2008" );
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(14) a", dp).simulate( "click" );
	equal(inp.val(), "03/09/2008", "Daylight saving - US 03/09/2008" );
	inp.val( "03/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(15) a", dp).simulate( "click" );
	equal(inp.val(), "03/10/2008", "Daylight saving - US 03/10/2008" );
	inp.val( "11/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	equal(inp.val(), "11/01/2008", "Daylight saving - US 11/01/2008" );
	inp.val( "11/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	equal(inp.val(), "11/02/2008", "Daylight saving - US 11/02/2008" );
	inp.val( "11/01/2008" ).datepicker( "show" );
	$( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	equal(inp.val(), "11/03/2008", "Daylight saving - US 11/03/2008" );
});

// TODO: Move to calendar. Perhaps adda calendar_external test file?
test( "localisation", function() {
	expect( 24 );
	var dp, month, day, date,
		inp = TestHelpers.datepicker.init( "#inp", $.datepicker.regional.fr);
	inp.datepicker( "option", {dateFormat: "DD, d MM yy", showButtonPanel:true, changeMonth:true, changeYear:true}).val( "" ).datepicker( "show" );
	dp = $( "#ui-datepicker-div" );
	equal($( ".ui-calendar-close", dp).text(), "Fermer", "Localisation - close" );
	$( ".ui-calendar-close", dp).simulate( "mouseover" );
	equal($( ".ui-calendar-prev", dp).text(), "Précédent", "Localisation - previous" );
	equal($( ".ui-calendar-current", dp).text(), "Aujourd'hui", "Localisation - current" );
	equal($( ".ui-calendar-next", dp).text(), "Suivant", "Localisation - next" );
	month = 0;
	$( ".ui-calendar-month option", dp).each(function() {
		equal($(this).text(), $.datepicker.regional.fr.monthNamesShort[month],
			"Localisation - month " + month);
		month++;
	});
	day = 1;
	$( ".ui-calendar-calendar th", dp).each(function() {
		equal($(this).text(), $.datepicker.regional.fr.dayNamesMin[day],
			"Localisation - day " + day);
		day = (day + 1) % 7;
	});
	inp.simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date = new Date();
	equal(inp.val(), $.datepicker.regional.fr.dayNames[date.getDay()] + ", " +
		date.getDate() + " " + $.datepicker.regional.fr.monthNames[date.getMonth()] +
		" " + date.getFullYear(), "Localisation - formatting" );
});

 */

test( "Ticket 7602: Stop datepicker from appearing with beforeOpen event handler", function() {
	expect( 3 );

	var input;

	input = TestHelpers.datepicker.init( "#datepicker", {
		beforeOpen: function() {
		}
	});
	input.datepicker( "open" );
	equal( input.datepicker( "widget" ).css( "display" ), "block", "beforeOpen returns nothing" );
	input.datepicker( "close" ).datepicker( "destroy" );

	input = TestHelpers.datepicker.init( "#datepicker", {
		beforeOpen: function() {
			return true;
		}
	});
	input.datepicker( "open" );
	equal( input.datepicker( "widget" ).css( "display" ), "block", "beforeOpen returns true" );
	input.datepicker( "close" ).datepicker( "destroy" );

	input = TestHelpers.datepicker.init( "#datepicker", {
		beforeOpen: function() {
			return false;
		}
	});
	input.datepicker( "open" );
	equal( input.datepicker( "widget" ).css( "display" ), "none", "beforeOpen returns false" );
	input.datepicker( "destroy" );
});

})(jQuery);
