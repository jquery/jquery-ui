(function( $ ) {

module( "calendar: core" );

TestHelpers.testJshint( "calendar" );

test( "input's value determines starting date", function() {
	expect( 3 );

	var input = $( "#calendar" ).val( "1/1/14" ).calendar(),
		picker = input.calendar( "widget" );

	input.calendar( "open" );

	equal( picker.find( ".ui-calendar-month" ).html(), "January", "correct month displayed" );
	equal( picker.find( ".ui-calendar-year" ).html(), "2014", "correct year displayed" );
	equal( picker.find( ".ui-state-focus" ).html(), "1", "correct day highlighted" );

	input.val( "" ).calendar( "destroy" );
});

asyncTest( "baseStructure", function() {
	expect( 42 );
	var header, title, table, thead, week, panel, inl, child,
		inp = TestHelpers.calendar.initNewInput(),
		dp = inp.calendar( "widget" ).find( ".ui-calendar" );

	function step1() {
		inp.focus();
		setTimeout(function() {
			ok( dp.is( ":visible" ), "Structure - calendar visible" );
			ok( !dp.is( ".ui-calendar-rtl" ), "Structure - not right-to-left" );
			ok( !dp.is( ".ui-calendar-multi" ), "Structure - not multi-month" );
			equal( dp.children().length, 3, "Structure - child count (header, calendar, buttonpane)" );

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
			// TODO: Preserve these class names or let the user use :first-child and :last-child?
			// ok( week.children( ":first" ).is( "td.ui-calendar-week-end" ), "Structure - month table first day cell" );
			// ok( week.children( ":last" ).is( "td.ui-calendar-week-end" ), "Structure - month table second day cell" );

			inp.calendar( "close" ).calendar( "destroy" );
			step2();
		});
	}

	function step2() {
		// Editable month/year and button panel
		inp = TestHelpers.calendar.initNewInput({
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true
		});
		dp = inp.calendar( "widget" ).find( ".ui-calendar" );
		inp.focus();
		setTimeout(function() {
			title = dp.find( "div.ui-calendar-title" );
			// TODO: Re-add tests when changeMonth and changeYear are re-implemented
			//ok( title.children( ":first" ).is( "select.ui-calendar-month" ), "Structure - month selector" );
			//ok( title.children( ":last" ).is( "select.ui-calendar-year" ), "Structure - year selector" );

			panel = dp.children( ":last" );
			ok( panel.is( "div.ui-calendar-buttonpane" ), "Structure - button panel division" );
			equal( panel.children().length, 2, "Structure - button panel child count" );
			ok( panel.children( ":first" ).is( "button.ui-calendar-current" ), "Structure - today button" );
			ok( panel.children( ":last" ).is( "button.ui-calendar-close" ), "Structure - close button" );

			inp.calendar( "close" ).calendar( "destroy" );
			step3();
		});
	}

	function step3() {
		// Multi-month 2
		inp = TestHelpers.calendar.initNewInput({ numberOfMonths: 2 } );
		dp = inp.calendar( "widget" ).find( ".ui-calendar" );
		inp.focus();
		setTimeout(function() {
			ok( dp.is( ".ui-calendar-multi" ), "Structure multi [2] - multi-month" );
			equal( dp.children().length, 4, "Structure multi [2] - child count" );

			child = dp.children( ":first" );
			// TODO: Implement ui-calendar-group-first class name
			// ok( child.is( "div.ui-calendar-group" ) && child.is( "div.ui-calendar-group-first" ), "Structure multi [2] - first month division" );

			child = dp.children( ":eq(1)" );
			// TODO: Implement ui-calendar-group-last class name
			// ok( child.is( "div.ui-calendar-group" ) && child.is( "div.ui-calendar-group-last" ), "Structure multi [2] - second month division" );

			child = dp.children( ":eq(2)" );
			ok( child.is( "div.ui-calendar-row-break" ), "Structure multi [2] - row break" );
			ok( dp.is( ".ui-calendar-multi-2" ), "Structure multi [2] - multi-2" );

			inp.calendar( "close" ).calendar( "destroy" );
			step4();
		});
	}

	function step4() {
		// Multi-month 3
		inp = TestHelpers.calendar.initNewInput({ numberOfMonths: 3 } );
		dp = inp.calendar( "widget" ).find( ".ui-calendar" );
		inp.focus();
		setTimeout(function() {
			ok( dp.is( ".ui-calendar-multi-3" ), "Structure multi [3] - multi-3" );
			ok( !dp.is( ".ui-calendar-multi-2" ), "Structure multi [3] - Trac #6704" );

			inp.calendar( "close" ).calendar( "destroy" );
			step5();
		});
	}

	function step5() {
		// Multi-month [2, 2]
		inp = TestHelpers.calendar.initNewInput({ numberOfMonths: [ 2, 2 ] } );
		dp = inp.calendar( "widget" ).find( ".ui-calendar" );
		inp.focus();
		setTimeout(function() {
			/*
			TODO: Re-add after array form of the numberOfMonths option is implemented.
			ok( dp.is( ".ui-calendar-multi" ), "Structure multi - multi-month" );
			equal( dp.children().length, 6, "Structure multi [2,2] - child count" );

			child = dp.children( ":first" );
			ok( child.is( "div.ui-calendar-group" ) && child.is( "div.ui-calendar-group-first" ), "Structure multi [2,2] - first month division" );

			child = dp.children( ":eq(1)" );
			ok( child.is( "div.ui-calendar-group" ) && child.is( "div.ui-calendar-group-last" ), "Structure multi [2,2] - second month division" );

			child = dp.children( ":eq(2)" );
			ok( child.is( "div.ui-calendar-row-break" ), "Structure multi [2,2] - row break" );

			child = dp.children( ":eq(3)" );
			ok( child.is( "div.ui-calendar-group" ) && child.is( "div.ui-calendar-group-first" ), "Structure multi [2,2] - third month division" );

			child = dp.children( ":eq(4)" );
			ok( child.is( "div.ui-calendar-group" ) && child.is( "div.ui-calendar-group-last" ), "Structure multi [2,2] - fourth month division" );

			child = dp.children( ":eq(5)" );
			ok( child.is( "div.ui-calendar-row-break" ), "Structure multi [2,2] - row break" );
			*/
			inp.calendar( "close" ).calendar( "destroy" );
			step6();
		});
	}

	function step6() {
		// Inline
		inl = TestHelpers.calendar.init( "#inline" );
		dp = inl.children();

		ok( dp.is( ".ui-calendar-inline" ), "Structure inline - main div" );
		ok( !dp.is( ".ui-calendar-rtl" ), "Structure inline - not right-to-left" );
		ok( !dp.is( ".ui-calendar-multi" ), "Structure inline - not multi-month" );
		equal( dp.children().length, 3, "Structure inline - child count (header, calendar, buttonpane)" );

		header = dp.children( ":first" );
		ok( header.is( "div.ui-calendar-header" ), "Structure inline - header division" );
		equal( header.children().length, 3, "Structure inline - header child count" );

		table = dp.children( ":eq(1)" );
		ok( table.is( "table.ui-calendar-calendar" ), "Structure inline - month table" );
		ok( table.children( ":first" ).is( "thead" ), "Structure inline - month table thead" );
		ok( table.children( ":eq(1)" ).is( "tbody" ), "Structure inline - month table body" );

		inl.calendar( "destroy" );

		step7();
	}

	function step7() {
		// Inline multi-month
		inl = TestHelpers.calendar.init( "#inline", { numberOfMonths: 2 } );
		dp = inl.calendar( "widget" ).find( ".ui-calendar" );

		ok( dp.is( ".ui-calendar-inline" ) && dp.is( ".ui-calendar-multi" ), "Structure inline multi - main div" );
		equal( dp.children().length, 4, "Structure inline multi - child count" );

		child = dp.children( ":first" );
		// TODO: Implement ui-calendar-group-first class name
		// ok( child.is( "div.ui-calendar-group" ) && child.is( "div.ui-calendar-group-first" ), "Structure inline multi - first month division" );

		child = dp.children( ":eq(1)" );
		// TODO: Implement ui-calendar-group-last class name
		// ok( child.is( "div.ui-calendar-group" ) && child.is( "div.ui-calendar-group-last" ), "Structure inline multi - second month division" );

		child = dp.children( ":eq(2)" );
		ok( child.is( "div.ui-calendar-row-break" ), "Structure inline multi - row break" );

		inl.calendar( "destroy" );
		start();
	}

	step1();
});

// Skip these tests for now as none are implemented yet.
/*
asyncTest( "customStructure", function() {
	expect( 0 );

    var header, panel, title,
		inp = TestHelpers.calendar.initNewInput(),
		dp = inp.calendar( "widget" ).find( ".ui-calendar" );

	start();

	function step1() {
		Globalize.culture( "he" );
		inp.focus();

		setTimeout(function() {
			ok( dp.is( ".ui-calendar-rtl" ), "Structure RTL - right-to-left" );

			header = dp.children( ":first" );
			ok( header.is( "div.ui-calendar-header" ), "Structure RTL - header division" );
			equal( header.children().length, 3, "Structure RTL - header child count" );
			ok( header.children( ":first" ).is( "a.ui-calendar-next" ), "Structure RTL - prev link" );
			ok( header.children( ":eq(1)" ).is( "a.ui-calendar-prev" ), "Structure RTL - next link" );

			panel = dp.children( ":last" );
			ok( panel.is( "div.ui-calendar-buttonpane" ), "Structure RTL - button division" );
			equal( panel.children().length, 2, "Structure RTL - button panel child count" );
			ok( panel.children( ":first" ).is( "button.ui-calendar-close" ), "Structure RTL - close button" );
			ok( panel.children( ":last" ).is( "button.ui-calendar-current" ), "Structure RTL - today button" );

			inp.calendar( "close" ).calendar( "destroy" );
			Globalize.culture( "en-US" );
			step2();
		});
	}

	// Hide prev/next
	// TODO: If we decide the hideIfNoPrevNext option is being removed these tests can be as well.
	function stepX() {
		inp = TestHelpers.calendar.initNewInput({
			hideIfNoPrevNext: true,
			minDate: new Date( 2008, 2 - 1, 4 ),
			maxDate: new Date( 2008, 2 - 1, 14 )
		});
		inp.val( "02/10/2008" );

		TestHelpers.calendar.onFocus( inp, function() {
			header = dp.children( ":first" );
			ok( header.is( "div.ui-calendar-header" ), "Structure hide prev/next - header division" );
			equal( header.children().length, 1, "Structure hide prev/next - links child count" );
			ok( header.children( ":first" ).is( "div.ui-calendar-title" ), "Structure hide prev/next - title division" );

			inp.calendar( "hide" ).calendar( "destroy" );
			step3();
		});
	}

	// Changeable Month with read-only year
	function step2() {
		inp = TestHelpers.calendar.initNewInput({ changeMonth: true } );
		dp = inp.calendar( "widget" ).find( ".ui-calendar" );

		inp.focus();
		setTimeout(function() {
			title = dp.children( ":first" ).children( ":last" );

			// TODO: Implement changeMonth option
			// equal( title.children().length, 2, "Structure changeable month - title child count" );
			// ok( title.children( ":first" ).is( "select.ui-calendar-month" ), "Structure changeable month - month selector" );
			// ok( title.children( ":last" ).is( "span.ui-calendar-year" ), "Structure changeable month - read-only year" );

			inp.calendar( "close" ).calendar( "destroy" );
			step3();
		});
	}

	// Changeable year with read-only month
	function step3() {
		inp = TestHelpers.calendar.initNewInput({ changeYear: true } );

		TestHelpers.calendar.onFocus( inp, function() {
			title = dp.children( ":first" ).children( ":last" );

			// TODO: Implement changeYear option
			// equal( title.children().length, 2, "Structure changeable year - title child count" );
			// ok( title.children( ":first" ).is( "span.ui-calendar-month" ), "Structure changeable year - read-only month" );
			// ok( title.children( ":last" ).is( "select.ui-calendar-year" ), "Structure changeable year - year selector" );

			inp.calendar( "close" ).calendar( "destroy" );
			start();
		});
	}

	// TODO: figure out why this setTimeout is needed in IE,
	// it only is necessary when the previous baseStructure tests runs first
	// Support: IE
	setTimeout( step1 );
});
*/

test( "Keyboard handling", function() {
	expect( 9 );
	var input = $( "#calendar" ).calendar(),
		instance = input.calendar( "instance" ),
		date = new Date();

	input.calendar( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date, "Keystroke enter" );

	// Enter = Select today's date by default
	input.val( "1/1/14" ).calendar( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2014, 0, 1 ),
		"Keystroke enter - preset" );

	// Control + Home = Change the calendar to the current month
	input.val( "1/1/14" ).calendar( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.HOME } )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date, "Keystroke ctrl+home" );

	// Control + End = Close the calendar and clear the input
	input.val( "1/1/14" ).calendar( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.END } );
	equal( input.val(), "", "Keystroke ctrl+end" );

	input.val( "" ).calendar( "open" );
	ok( instance.isOpen, "calendar is open before escape" );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	ok( !instance.isOpen, "escape closes the calendar" );

	input.val( "1/1/14" ).calendar( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2014, 0, 1 ),
		"Keystroke esc - preset" );

	input.val( "1/1/14" ).calendar( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2014, 0, 1 ),
		"Keystroke esc - abandoned" );

	input.val( "1/2/14" )
		.simulate( "keyup" );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2014, 0, 2 ),
		"Picker updated as user types into input" );

	input.calendar( "destroy" );
});

asyncTest( "keyboard handling", function() {
	expect( 14 );
	var picker,
		input = $( "#calendar" ),
		date = new Date();

	function step1() {
		input.calendar();
		picker = input.calendar( "widget" );
		ok( !picker.is( ":visible" ), "calendar closed" );
		input.val( "" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			ok( picker.is( ":visible" ), "Keystroke down opens calendar" );
			input.calendar( "destroy" );
			step2();
		});
	}

	function step2() {
		input.calendar();
		picker = input.calendar( "widget" );
		ok( !picker.is( ":visible" ), "calendar closed" );
		input.val( "" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );

		setTimeout(function() {
			ok( picker.is( ":visible" ), "Keystroke up opens calendar" );
			input.calendar( "destroy" );
			step3();
		});
	}

	function step3() {
		input.calendar()
			.val( "1/1/14" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			date = new Date( 2013, 12 - 1, 31 );
			TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date,
				"Keystroke left to switch to previous day" );

			input.calendar( "destroy" );
			step4();
		}, 100 );
	}

	function step4() {
		input.calendar()
			.val( "1/1/14" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			date = new Date( 2014, 1 - 1, 2 );
			TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date,
				"Keystroke right to switch to next day" );

			input.calendar( "destroy" );
			step5();
		}, 100 );
	}

	function step5() {
		input.calendar()
			.val( "1/1/14" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.UP } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			date = new Date( 2013, 12 - 1, 25 );
			TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date,
				"Keystroke up to move to the previous week" );

			input.calendar( "destroy" );
			step6();
		}, 100 );
	}

	function step6() {
		input.calendar()
			.val( "1/1/14" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			date = new Date( 2014, 1 - 1, 8 );
			TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date,
				"Keystroke down to move to the next week" );

			input.calendar( "destroy" );
			step7();
		}, 100 );
	}

	function step7() {
		input.calendar()
			.val( "1/1/14" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			date = new Date( 2013, 12 - 1, 1 );
			TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date,
				"Keystroke Page Up moves date to previous month" );

			input.calendar( "destroy" );
			step8();
		}, 100 );
	}

	function step8() {
		input.calendar()
			.val( "1/1/14" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP, altKey: true } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			date = new Date( 2013, 1 - 1, 1 );
			TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date,
				"Keystroke Page Up + Ctrl moves date to previous year" );

			input.calendar( "destroy" );
			step9();
		}, 100 );
	}

	function step9() {
		input.calendar()
			.val( "1/1/14" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			date = new Date( 2014, 2 - 1, 1 );
			TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date,
				"Keystroke Page Down moves date to next month" );

			input.calendar( "destroy" );
			step10();
		}, 100 );
	}

	function step10() {
		input.calendar()
			.val( "1/1/14" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN, altKey: true } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			date = new Date( 2015, 1 - 1, 1 );
			TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date,
				"Keystroke Page Down + Ctrl moves date to next year" );

			input.calendar( "destroy" );
			step11();
		}, 100 );
	}

	// Check for moving to short months
	function step11() {
		input.calendar()
			.val( "3/31/14" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			date = new Date( 2014, 2 - 1, 28 );
			TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date,
				"Keystroke Page Up and short months" );

			input.calendar( "destroy" );
			step12();
		}, 100 );
	}

	function step12() {
		input.calendar()
			.val( "1/30/16" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			date = new Date( 2016, 2 - 1, 29 );
			TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date,
				"Keystroke Page Down and leap years" );

			input.calendar( "destroy" );
			start();
		}, 100 );
	}

	step1();
});

/*
	// TODO: Re-add tests if we implement a stepMonths option
	input.calendar( "option", { stepMonths: 2, gotoCurrent: false } )
		.calendar( "close" ).val( "02/04/2008" ).calendar( "open" )
		.late( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2007, 12 - 1, 4 ),
		"Keystroke pgup step 2" );

	input.val( "02/04/2008" ).calendar( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2008, 4 - 1, 4 ),
		"Keystroke pgdn step 2" );
*/

test( "mouse", function() {
	expect( 13 );
	var input = $( "#calendar" ).calendar(),
		picker = input.calendar( "widget" ),
		inline = $( "#inline" ).calendar,
		date = new Date();

	input.val( "" ).calendar( "open" );
	$( ".ui-calendar-calendar tbody a:contains(10)", picker ).simulate( "mousedown", {} );
	date.setDate( 10 );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date, "Mouse click" );

	input.val( "2/4/08" ).calendar( "open" );
	$( ".ui-calendar-calendar tbody a:contains(12)", picker ).simulate( "mousedown", {} );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2008, 2 - 1, 12 ),
		"Mouse click - preset" ) ;

	input.val( "" ).calendar( "open" );
	$( "button.ui-calendar-close", picker ).simulate( "click", {} );
	ok( input.calendar( "valueAsDate" ) == null, "Mouse click - close" );

	input.val( "2/4/08" ).calendar( "open" );
	$( "button.ui-calendar-close", picker ).simulate( "click", {} );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2008, 2 - 1, 4 ),
		"Mouse click - close + preset" );

	input.val( "2/4/08" ).calendar( "open" );
	$( "a.ui-calendar-prev", picker ).simulate( "click", {} );
	$( "button.ui-calendar-close", picker ).simulate( "click", {} );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2008, 2 - 1, 4 ),
		"Mouse click - abandoned" );

	// Current/previous/next
	input.val( "" ).calendar( "open" );
	$( ".ui-calendar-current", picker ).simulate( "click", {} );
	date.setDate( new Date().getDate() );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), date, "Mouse click - current" );

	input.val( "2/4/08" ).calendar( "open" );
	$( ".ui-calendar-prev", picker ).simulate( "click" );
	$( ".ui-calendar-calendar tbody a:contains(16)", picker ).simulate( "mousedown" );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2008, 1 - 1, 16 ),
		"Mouse click - previous" );

	input.val( "2/4/08" ).calendar( "open" );
	$( ".ui-calendar-next", picker ).simulate( "click" );
	$( ".ui-calendar-calendar tbody a:contains(18)", picker ).simulate( "mousedown" );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2008, 3 - 1, 18 ),
		"Mouse click - next" );

	/*
	// TODO: Re-add when min and max options are introduced.
	// Previous/next with minimum/maximum
	input.calendar( "option", {
		minDate: new Date( 2008, 2 - 1, 2 ),
		maxDate: new Date( 2008, 2 - 1, 26 )
	}).val( "2/4/08" ).calendar( "open" );
	$( ".ui-calendar-prev", picker ).simulate( "click" );
	$( ".ui-calendar-calendar tbody a:contains(16)", picker ).simulate( "mousedown" );
	TestHelpers.calendar.equalsDate( input.calendar( "valueAsDate" ), new Date( 2008, 2 - 1, 16 ),
		"Mouse click - previous + min/max" );

	input.val( "2/4/08" ).calendar( "open" );
	$( ".ui-calendar-next", picker ).simulate( "click" );
	$( ".ui-calendar-calendar tbody a:contains(18)", picker ).simulate( "mousedown" );
	TestHelpers.calendar.equalsDate(input.calendar( "valueAsDate" ), new Date( 2008, 2 - 1, 18 ),
		"Mouse click - next + min/max" );
	*/

	// Inline
	inline = TestHelpers.calendar.init( "#inline" );
	picker = $( ".ui-calendar-inline", inline );
	date = new Date();
	inline.calendar( "valueAsDate", date );
	$( ".ui-calendar-calendar tbody a:contains(10)", picker ).simulate( "mousedown", {} );
	date.setDate( 10 );
	TestHelpers.calendar.equalsDate( inline.calendar( "valueAsDate" ), date, "Mouse click inline" );

	inline.calendar( "option", { showButtonPanel: true } )
		.calendar( "valueAsDate", new Date( 2008, 2 - 1, 4 ));
	$( ".ui-calendar-calendar tbody a:contains(12)", picker ).simulate( "mousedown", {} );
	TestHelpers.calendar.equalsDate( inline.calendar( "valueAsDate" ), new Date( 2008, 2 - 1, 12 ),
		"Mouse click inline - preset" );

	inline.calendar( "option", { showButtonPanel: true } );
	$( ".ui-calendar-current", picker ).simulate( "click", {} );
	$( ".ui-calendar-calendar tbody a:contains(14)", picker ).simulate( "mousedown", {} );
	date.setDate( 14 );
	TestHelpers.calendar.equalsDate( inline.calendar( "valueAsDate" ), date, "Mouse click inline - current" );

	inline.calendar( "valueAsDate", new Date( 2008, 2 - 1, 4) );
	$( ".ui-calendar-prev", picker ).simulate( "click" );
	$( ".ui-calendar-calendar tbody a:contains(16)", picker ).simulate( "mousedown" );
	TestHelpers.calendar.equalsDate( inline.calendar( "valueAsDate" ), new Date( 2008, 1 - 1, 16 ),
		"Mouse click inline - previous" );

	inline.calendar( "valueAsDate", new Date( 2008, 2 - 1, 4) );
	$( ".ui-calendar-next", picker ).simulate( "click" );
	$( ".ui-calendar-calendar tbody a:contains(18)", picker ).simulate( "mousedown" );
	TestHelpers.calendar.equalsDate( inline.calendar( "valueAsDate" ), new Date( 2008, 3 - 1, 18 ),
		"Mouse click inline - next" );

	input.calendar( "destroy" );
	inline.calendar( "destroy" );
});

})( jQuery );
