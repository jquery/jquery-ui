(function( $ ) {

module( "calendar: core" );

TestHelpers.testJshint( "calendar" );

test( "baseStructure", function() {
	expect( 26 );

	var header, title, table, thead, week, child, buttonpane,
		element = $( "#calendar" ).calendar(),
		dp = element.calendar( "widget" );

	function step1() {
		ok( !dp.is( ".ui-calendar-rtl" ), "Structure - not right-to-left" );
		ok( !dp.is( ".ui-calendar-multi" ), "Structure - not multi-month" );
		equal( dp.children().length, 2, "Structure - child count (header, calendar)" );

		header = dp.children( ":first" );
		ok( header.is( "div.ui-calendar-header" ), "Structure - header division" );
		equal( header.children().length, 3, "Structure - header child count" );
		ok( header.children( ":first" ).is( ".ui-calendar-prev" ) && header.children( ":first" ).html() !== "", "Structure - prev link" );
		ok( header.children( ":eq(1)" ).is( ".ui-calendar-next" ) && header.children( ":eq(1)" ).html() !== "", "Structure - next link" );

		title = header.children( ":last" ).children( ":first" );
		ok( title.is( "div.ui-calendar-title" ) && title.html() !== "", "Structure - title division" );
		equal( title.children().length, 2, "Structure - title child count" );
		ok( title.children( ":first" ).is( "span.ui-calendar-month" ) && title.children( ":first" ).text() !== "", "Structure - month text" );
		ok( title.children( ":last" ).is( "span.ui-calendar-year" ) && title.children( ":last" ).text() !== "", "Structure - year text" );

		table = dp.children( ":eq(1)" );
		ok( table.is( "table.ui-calendar-calendar" ), "Structure - month table" );
		ok( table.children( ":first" ).is( "thead" ), "Structure - month table thead" );

		thead = table.children( ":first" ).children( ":first" );
		ok( thead.is( "tr" ), "Structure - month table title row" );
		equal( thead.find( "th" ).length, 7, "Structure - month table title cells" );
		ok( table.children( ":eq(1)" ).is( "tbody" ), "Structure - month table body" );
		ok( table.children( ":eq(1)" ).children( "tr" ).length >= 4, "Structure - month table week count" );

		week = table.children( ":eq(1)" ).children( ":first" );
		ok( week.is( "tr" ), "Structure - month table week row" );
		equal( week.children().length, 7, "Structure - week child count" );

		step2();
	}

	function step2() {
		element.calendar( "option", "buttons", {
			"test": function() {},
			"test button": function() {}
		});

		equal( dp.children().length, 3, "Structure buttons - child count (header, calendar, buttonpane)" );

		buttonpane = dp.children( ".ui-calendar-buttonpane" );
		equal( buttonpane.children( "div.ui-calendar-buttonset" ).length, 1, "Structure buttons - buttonset" );
		equal( buttonpane.find( "button.ui-button:first" ).text(), "test", "Structure buttons - buttonset" );
		equal( buttonpane.find( "button.ui-button:eq(1)" ).text(), "test button", "Structure buttons - buttonset" );

		element.calendar( "destroy" );
		step3();
	}

	function step3() {
		// Multi-month 2
		element = $( "#calendar" ).calendar( { numberOfMonths: 2 } );
		dp = element.calendar( "widget" );

		ok( dp.is( ".ui-calendar-multi" ), "Structure multi [2] - multi-month" );
		equal( dp.children().length, 3, "Structure multi [2] - child count" );

		child = dp.children( ":eq(2)" );
		ok( child.is( "div.ui-calendar-row-break" ), "Structure multi [2] - row break" );

		element.calendar( "destroy" );
	}

	step1();
});

test( "Localization", function() {
	expect( 10 );

	var defaultLocale = Globalize.locale(),
		element = $( "#calendar" ),
		date = new Date( 2014, 0, 1 ),
		initCalendar = function() {
			element
				.calendar()
				.calendar( "valueAsDate", date );
		},
		testLocalization = function( message ) {
			equal( element.find( ".ui-calendar-month" ).text(), "Januar", message + "titlebar year" );
			equal( element.find( "thead th:first" ).text(), "Mo.", message + "teader first day" );
			equal( element.find( "thead th:last" ).text(), "So.", message + "header last day" );
			equal( element.find( ".ui-calendar-prev" ).text(), "<Zurück", message + "header prev" );
			equal( element.find( ".ui-calendar-next" ).text(), "Vor>", message + "header next" );
		};

	Globalize.locale( "de-DE" );
	initCalendar();
	testLocalization( "Init: " );
	element.calendar( "destroy" );

	Globalize.locale( defaultLocale.locale );
	initCalendar();
	Globalize.locale( "de-DE" );
	element.calendar( "refresh" );
	testLocalization( "After init: " );

	Globalize.locale( defaultLocale.locale );
});

asyncTest( "keyboard handling", function() {
	expect( 10 );

	var element = $( "#calendar" );

	function step1() {
		element.calendar({ value: new Date( 2014, 1 - 1, 1 ) });

		TestHelpers.calendar.focusGrid( element ).simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			TestHelpers.calendar.equalsDate(
				element.calendar( "valueAsDate" ),
				new Date( 2013, 12 - 1, 31 ),
				"Keystroke left to switch to previous day"
			);
			element.calendar( "destroy" );
			step2();
		}, 50 );
	}

	function step2() {
		element.calendar({ value: new Date( 2014, 1 - 1, 1 ) });

		TestHelpers.calendar.focusGrid( element )
			.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } )
			.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );

		TestHelpers.calendar.equalsDate(
			element.calendar( "valueAsDate" ),
			new Date( 2014, 1 - 1, 2 ),
			"Keystroke right to switch to next day"
		);
		step3();
	}

	function step3() {
		element.calendar({ value: new Date( 2014, 1 - 1, 1 ) });

		TestHelpers.calendar.focusGrid( element ).simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			TestHelpers.calendar.equalsDate(
				element.calendar( "valueAsDate" ),
				new Date( 2013, 12 - 1, 25 ),
				"Keystroke up to move to the previous week"
			);
			element.calendar( "destroy" );
			step4();
		}, 50 );
	}

	function step4() {
		element.calendar({ value: new Date( 2014, 1 - 1, 1 ) });

		TestHelpers.calendar.focusGrid( element ).simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			TestHelpers.calendar.equalsDate(
				element.calendar( "valueAsDate" ),
				new Date( 2014, 1 - 1, 8 ),
				"Keystroke down to move to the next week"
			);
			element.calendar( "destroy" );
			step5();
		}, 50 );
	}

	function step5() {
		element.calendar({ value: new Date( 2014, 1 - 1, 1 ) });

		TestHelpers.calendar.focusGrid( element ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			TestHelpers.calendar.equalsDate(
				element.calendar( "valueAsDate" ),
				new Date( 2013, 12 - 1, 1 ),
				"Keystroke Page Up moves date to previous month"
			);
			element.calendar( "destroy" );
			step6();
		}, 50 );
	}

	function step6() {
		element.calendar({ value: new Date( 2014, 1 - 1, 1 ) });

		TestHelpers.calendar.focusGrid( element )
			.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP, altKey: true } );
		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			TestHelpers.calendar.equalsDate(
				element.calendar( "valueAsDate" ),
				new Date( 2013, 1 - 1, 1 ),
				"Keystroke Page Up + Ctrl moves date to previous year"
			);
			element.calendar( "destroy" );
			step7();
		}, 50 );
	}

	function step7() {
		element.calendar({ value: new Date( 2014, 1 - 1, 1 ) });

		TestHelpers.calendar.focusGrid( element ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			TestHelpers.calendar.equalsDate(
				element.calendar( "valueAsDate" ),
				new Date( 2014, 2 - 1, 1 ),
				"Keystroke Page Down moves date to next month"
			);
			element.calendar( "destroy" );
			step8();
		}, 50 );
	}

	function step8() {
		element.calendar({ value: new Date( 2014, 1 - 1, 1 ) });

		TestHelpers.calendar.focusGrid( element )
			.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN, altKey: true } );
		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			TestHelpers.calendar.equalsDate(
				element.calendar( "valueAsDate" ),
				new Date( 2015, 1 - 1, 1 ),
				"Keystroke Page Down + Ctrl moves date to next year"
			);
			element.calendar( "destroy" );
			step9();
		}, 50 );
	}

	// Check for moving to short months
	function step9() {
		element.calendar({ value: new Date( 2014, 3 - 1, 31 ) });

		TestHelpers.calendar.focusGrid( element ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			TestHelpers.calendar.equalsDate(
				element.calendar( "valueAsDate" ),
				new Date( 2014, 2 - 1, 28 ),
				"Keystroke Page Up and short months"
			);
			element.calendar( "destroy" );
			step10();
		}, 50 );
	}

	function step10() {
		element.calendar({ value: new Date( 2016, 1 - 1, 30 ) });

		TestHelpers.calendar.focusGrid( element ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			TestHelpers.calendar.equalsDate(
				element.calendar( "valueAsDate" ),
				new Date( 2016, 2 - 1, 29 ),
				"Keystroke Page Down and leap years"
			);
			element.calendar( "destroy" );
			start();
		}, 50 );
	}

	step1();
});

/*
 // TODO: Re-add tests if we implement a stepMonths option
 input.calendar( "option", { stepMonths: 2, gotoCurrent: false } )
 .calendar( "close" ).val( "02/04/2008" ).calendar( "open" )
 .late( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } )
 .simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
 TestHelpers.datepicker.equalsDate( input.calendar( "valueAsDate" ), new Date( 2007, 12 - 1, 4 ),
 "Keystroke pgup step 2" );

 input.val( "02/04/2008" ).calendar( "open" )
 .simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } )
 .simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
 TestHelpers.datepicker.equalsDate( input.calendar( "valueAsDate" ), new Date( 2008, 4 - 1, 4 ),
 "Keystroke pgdn step 2" );
 */

// TODO: implement
test( "ARIA", function() {
	expect( 0 );
});

asyncTest( "mouse", function() {
	expect( 6 );

	var element = $( "#calendar" ).calendar(),
		date = new Date();

	function step1() {
		$( "tbody a:contains(10)", element ).simulate( "mousedown", {} );
		date.setDate( 10 );
		TestHelpers.calendar.equalsDate(
			element.calendar( "valueAsDate" ),
			date,
			"Mouse click"
		);

		element.calendar( "option", "value", new Date( 2008, 2 - 1, 4) );
		$( ".ui-calendar-calendar tbody a:contains(12)", element ).simulate( "mousedown" );
		TestHelpers.calendar.equalsDate(
			element.calendar( "valueAsDate" ),
			new Date( 2008, 2 - 1, 12 ),
			"Mouse click - preset"
		);

		// Previous/next
		element.calendar( "option", "value", new Date( 2008, 2 - 1, 4) );
		$( ".ui-calendar-prev", element ).simulate( "click" );
		$( ".ui-calendar-calendar tbody a:contains(16)", element ).simulate( "mousedown" );
		TestHelpers.calendar.equalsDate(
			element.calendar( "valueAsDate" ),
			new Date( 2008, 1 - 1, 16 ),
			"Mouse click - previous"
		);

		element.calendar( "option", "value", new Date( 2008, 2 - 1, 4) );
		$( ".ui-calendar-next", element ).simulate( "click" );
		$( ".ui-calendar-calendar tbody a:contains(18)", element ).simulate( "mousedown" );
		TestHelpers.calendar.equalsDate(
			element.calendar( "valueAsDate" ),
			new Date( 2008, 3 - 1, 18 ),
			"Mouse click - next"
		);

		step2();
	}

	// Previous/next with minimum/maximum
	function step2() {
		element.calendar( "destroy" );
		element.calendar({
			value: new Date( 2008, 3 - 1, 4),
			min: new Date( 2008, 2 - 1, 2 ),
			max: new Date( 2008, 2 - 1, 26 )
		});

		$( ".ui-calendar-prev", element ).simulate( "click" );
		$( "tbody a:contains(16)", element ).simulate( "mousedown" );
		TestHelpers.calendar.equalsDate(
			element.calendar( "valueAsDate" ),
			new Date( 2008, 2 - 1, 16 ),
			"Mouse click - previous + min/max"
		);
		step3();
	}

	function step3() {
		element.calendar( "destroy" );
		element.calendar({
			value: new Date( 2008, 1 - 1, 4),
			min: new Date( 2008, 2 - 1, 2 ),
			max: new Date( 2008, 2 - 1, 26 )
		});

		$( ".ui-calendar-next", element ).simulate( "click" );
		$( "tbody a:contains(18)", element ).simulate( "mousedown" );
		TestHelpers.calendar.equalsDate(
			element.calendar( "valueAsDate" ),
			new Date( 2008, 2 - 1, 18 ),
			"Mouse click - next + min/max"
		);
		start();
	}

	step1();
});

})( jQuery );
