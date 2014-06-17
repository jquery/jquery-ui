(function( $ ) {

module( "datepicker: core" );

TestHelpers.testJshint( "datepicker" );

test( "input's value determines starting date", function() {
	expect( 3 );

	var input = $( "#datepicker" ).val( "1/1/14" ).datepicker(),
		picker = input.datepicker( "widget" );

	input.datepicker( "open" );

	equal( picker.find( ".ui-calendar-month" ).html(), "January", "correct month displayed" );
	equal( picker.find( ".ui-calendar-year" ).html(), "2014", "correct year displayed" );
	equal( picker.find( ".ui-state-active" ).html(), "1", "correct day highlighted" );

	input.val( "" ).datepicker( "destroy" );
});

asyncTest( "baseStructure", function() {
	expect( 23 );

	var header, title, table, thead, week, child,
		inp = TestHelpers.datepicker.initNewInput(),
		dp = inp.datepicker( "widget" );

	function step1() {
		inp.focus();

		setTimeout(function() {
			ok( dp.is( ":visible" ), "Structure - datepicker visible" );
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

			inp.datepicker( "close" ).datepicker( "destroy" );
			step2();
		}, 50 );
	}

	function step2() {
		// Multi-month 2
		inp = TestHelpers.datepicker.initNewInput({ numberOfMonths: 2 } );
		dp = inp.datepicker( "widget" );
		inp.focus();
		setTimeout(function() {
			ok( dp.is( ".ui-calendar-multi" ), "Structure multi [2] - multi-month" );
			equal( dp.children().length, 4, "Structure multi [2] - child count" );

			child = dp.children( ":eq(2)" );
			ok( child.is( "div.ui-calendar-row-break" ), "Structure multi [2] - row break" );

			inp.datepicker( "close" ).datepicker( "destroy" );
		});
		start();
	}

	step1();
});

test( "Keyboard handling: input", function() {
	expect( 8 );
	var input = $( "#datepicker" ).datepicker(),
		instance = input.datepicker( "instance" ),
		date = new Date();

	// Enter = Select today's date by default
	input
		.datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), date, "Keystroke enter" );

	// Enter = Select preset date
	input
		.val( "1/1/14" )
		.datepicker( "refresh" )
		.datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ),
		"Keystroke enter - preset" );

	// Control + Home = Change the calendar to the current month
	input
		.val( "1/1/14" ).datepicker( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.HOME } )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), date, "Keystroke ctrl+home" );

	input
		.val( "" )
		.datepicker( "open" );
	ok( instance.isOpen, "datepicker is open before escape" );

	input.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	ok( !instance.isOpen, "escape closes the datepicker" );

	input
		.val( "1/1/14" )
		.datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ),
		"Keystroke esc - preset" );

	input
		.val( "1/1/14" )
		.datepicker( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ),
		"Keystroke esc - abandoned" );

	input
		.val( "1/2/14" )
		.simulate( "keyup" );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), new Date( 2014, 0, 2 ),
		"Picker updated as user types into input" );

	input.datepicker( "destroy" );
});

asyncTest( "keyboard handling: calendar", function() {
	expect( 14 );

	var picker,
		input = $( "#datepicker" );

	function step1() {
		TestHelpers.datepicker.init( input );
		picker = input.datepicker( "widget" );

		ok( !picker.is( ":visible" ), "datepicker closed" );

		input.val( "" ).simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout(function() {
			ok( picker.is( ":visible" ), "Keystroke down opens datepicker" );
			input.datepicker( "destroy" );
			step2();
		}, 100 );
	}

	function step2() {
		TestHelpers.datepicker.init( input );
		picker = input.datepicker( "widget" );

		ok( !picker.is( ":visible" ), "datepicker closed" );

		input.val( "" ).simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		setTimeout(function() {
			ok( picker.is( ":visible" ), "Keystroke up opens datepicker" );
			input.datepicker( "destroy" );
			step3();
		}, 100 );
	}

	function step3() {
		input.val( "1/1/14" );
		TestHelpers.datepicker.init( input );
		input.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
			setTimeout(function() {
				$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				TestHelpers.datepicker.equalsDate(
					input.datepicker( "valueAsDate" ),
					new Date( 2013, 12 - 1, 31 ),
					"Keystroke left to switch to previous day"
				);
				input.datepicker( "destroy" );
				step4();
			}, 50 );
		}, 100 );
	}

	function step4() {
		input.val( "1/1/14" );
		TestHelpers.datepicker.init( input );
		input.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" )
				.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } )
				.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );

			TestHelpers.datepicker.equalsDate(
				input.datepicker( "valueAsDate" ),
				new Date( 2014, 1 - 1, 2 ),
				"Keystroke right to switch to next day"
			);
			input.datepicker( "destroy" );
			step5();
		}, 100 );
	}

	function step5() {
		input.val( "1/1/14" );
		TestHelpers.datepicker.init( input );
		input.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
			setTimeout(function() {
				$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				TestHelpers.datepicker.equalsDate(
					input.datepicker( "valueAsDate" ),
					new Date( 2013, 12 - 1, 25 ),
					"Keystroke up to move to the previous week"
				);
				input.datepicker( "destroy" );
				step6();
			}, 50 );
		}, 100 );
	}

	function step6() {
		input.val( "1/1/14" );
		TestHelpers.datepicker.init( input );
		input.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
			setTimeout(function() {
				$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );

				TestHelpers.datepicker.equalsDate(
					input.datepicker( "valueAsDate" ),
					new Date( 2014, 1 - 1, 8 ),
					"Keystroke down to move to the next week"
				);
				input.datepicker( "destroy" );
				step7();
			}, 50 );
		}, 100 );
	}

	function step7() {
		input.val( "1/1/14" );
		TestHelpers.datepicker.init( input );
		input.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
			setTimeout(function() {
				$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				TestHelpers.datepicker.equalsDate(
					input.datepicker( "valueAsDate" ),
					new Date( 2013, 12 - 1, 1 ),
					"Keystroke Page Up moves date to previous month"
				);
				input.datepicker( "destroy" );
				step8();
			}, 50 );
		}, 100 );
	}

	function step8() {
		input.val( "1/1/14" );
		TestHelpers.datepicker.init( input );
		input.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP, altKey: true } );
			setTimeout(function() {
				$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				TestHelpers.datepicker.equalsDate(
					input.datepicker( "valueAsDate" ),
					new Date( 2013, 1 - 1, 1 ),
					"Keystroke Page Up + Ctrl moves date to previous year"
				);
				input.datepicker( "destroy" );
				step9();
			}, 50 );
		}, 100 );
	}

	function step9() {
		input.val( "1/1/14" );
		TestHelpers.datepicker.init( input );
		input.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
			setTimeout(function() {
				$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				TestHelpers.datepicker.equalsDate(
					input.datepicker( "valueAsDate" ),
					new Date( 2014, 2 - 1, 1 ),
					"Keystroke Page Down moves date to next month"
				);
				input.datepicker( "destroy" );
				step10();
			}, 50 );
		}, 100 );
	}

	function step10() {
		input.val( "1/1/14" );
		TestHelpers.datepicker.init( input );
		input.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN, altKey: true } );
			setTimeout(function() {
				$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				TestHelpers.datepicker.equalsDate(
					input.datepicker( "valueAsDate" ),
					new Date( 2015, 1 - 1, 1 ),
					"Keystroke Page Down + Ctrl moves date to next year"
				);
				input.datepicker( "destroy" );
				step11();
			}, 50 );
		}, 100 );
	}

	// Check for moving to short months
	function step11() {
		input.val( "3/31/14" );
		TestHelpers.datepicker.init( input );
		input.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
			setTimeout(function() {
				$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				TestHelpers.datepicker.equalsDate(
					input.datepicker( "valueAsDate" ),
					new Date( 2014, 2 - 1, 28 ),
					"Keystroke Page Up and short months"
				);
				input.datepicker( "destroy" );
				step12();
			}, 50 );
		}, 100 );
	}

	function step12() {
		input.val( "1/30/16" );
		TestHelpers.datepicker.init( input );
		input.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );

		setTimeout(function() {
			$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
			setTimeout(function() {
				$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
				TestHelpers.datepicker.equalsDate(
					input.datepicker( "valueAsDate" ),
					new Date( 2016, 2 - 1, 29 ),
					"Keystroke Page Down and leap years"
				);
				input.datepicker( "destroy" );
				start();
			}, 50 );
		}, 100 );
	}

	step1();
});

/*
	// TODO: Re-add tests if we implement a stepMonths option
	input.datepicker( "option", { stepMonths: 2, gotoCurrent: false } )
		.datepicker( "close" ).val( "02/04/2008" ).datepicker( "open" )
		.late( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), new Date( 2007, 12 - 1, 4 ),
		"Keystroke pgup step 2" );

	input.val( "02/04/2008" ).datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), new Date( 2008, 4 - 1, 4 ),
		"Keystroke pgdn step 2" );
*/

// TODO: implement
test( "ARIA", function() {
	expect( 0 );
});

asyncTest( "mouse", function() {
	expect( 10 );

	var input = TestHelpers.datepicker.init( $( "#datepicker" ).val( "" ) ),
		picker = input.datepicker( "widget" ),
		date = new Date();

	function step1() {
		input.datepicker( "open" );

		setTimeout(function() {
			$( "tbody a:contains(10)", picker ).simulate( "mousedown", {} );
			date.setDate( 10 );
			TestHelpers.datepicker.equalsDate(
				input.datepicker( "valueAsDate" ),
				date,
				"Mouse click"
			);

			input.val( "2/4/08" ).datepicker( "refresh" ).datepicker( "open" );
			$( ".ui-calendar-calendar tbody a:contains(12)", picker ).simulate( "mousedown", {} );
			TestHelpers.datepicker.equalsDate(
				input.datepicker( "valueAsDate" ),
				new Date( 2008, 2 - 1, 12 ),
				"Mouse click - preset"
			);

			input.val( "" ).datepicker( "refresh" ).datepicker( "open" );
			$( "button.ui-calendar-close", picker ).simulate( "click", {} );
			ok( input.datepicker( "valueAsDate" ) == null, "Mouse click - close" );

			input.val( "2/4/08" ).datepicker( "refresh" ).datepicker( "open" );
			$( "button.ui-calendar-close", picker ).simulate( "click", {} );
			TestHelpers.datepicker.equalsDate(
				input.datepicker( "valueAsDate" ),
				new Date( 2008, 2 - 1, 4 ),
				"Mouse click - close + preset"
			);

			input.val( "2/4/08" ).datepicker( "refresh" ).datepicker( "open" );
			$( "a.ui-calendar-prev", picker ).simulate( "click", {} );
			$( "button.ui-calendar-close", picker ).simulate( "click", {} );
			TestHelpers.datepicker.equalsDate(
				input.datepicker( "valueAsDate" ),
				new Date( 2008, 2 - 1, 4 ),
				"Mouse click - abandoned"
			);

			// Current/previous/next
			input.val( "" ).datepicker( "refresh" ).datepicker( "open" );
			$( ".ui-calendar-current", picker ).simulate( "click", {} );
			date.setDate( new Date().getDate() );
			TestHelpers.datepicker.equalsDate(
				input.datepicker( "valueAsDate" ),
				date,
				"Mouse click - current"
			);

			input.val( "2/4/08" ).datepicker( "refresh" ).datepicker( "open" );
			$( ".ui-calendar-prev", picker ).simulate( "click" );
			$( ".ui-calendar-calendar tbody a:contains(16)", picker ).simulate( "mousedown" );
			TestHelpers.datepicker.equalsDate(
				input.datepicker( "valueAsDate" ),
				new Date( 2008, 1 - 1, 16 ),
				"Mouse click - previous"
			);

			input.val( "2/4/08" ).datepicker( "refresh" ).datepicker( "open" );
			$( ".ui-calendar-next", picker ).simulate( "click" );
			$( ".ui-calendar-calendar tbody a:contains(18)", picker ).simulate( "mousedown" );
			TestHelpers.datepicker.equalsDate(
				input.datepicker( "valueAsDate" ),
				new Date( 2008, 3 - 1, 18 ),
				"Mouse click - next"
			);

			step2();
		}, 100 );
	}

	// Previous/next with minimum/maximum
	function step2() {
		input
			.datepicker( "destroy" )
			.val( "3/4/08" );
		input = TestHelpers.datepicker.init( "#datepicker", {
			min: new Date( 2008, 2 - 1, 2 ),
			max: new Date( 2008, 2 - 1, 26 )
		});
		picker = input.datepicker( "widget" );
		input.datepicker( "open" );
		setTimeout(function() {
			$( ".ui-calendar-prev", picker ).simulate( "click" );
			$( "tbody a:contains(16)", picker ).simulate( "mousedown" );
			TestHelpers.datepicker.equalsDate(
				input.datepicker( "valueAsDate" ),
				new Date( 2008, 2 - 1, 16 ),
				"Mouse click - previous + min/max"
			);
			step3();
		}, 100 );
	}

	function step3() {
		input
			.datepicker( "destroy" )
			.val( "1/4/08" );
		input = TestHelpers.datepicker.init( "#datepicker", {
			min: new Date( 2008, 2 - 1, 2 ),
			max: new Date( 2008, 2 - 1, 26 )
		});
		picker = input.datepicker( "widget" );
		input.datepicker( "open" );
		setTimeout(function() {
			$( ".ui-calendar-next", picker ).simulate( "click" );
			$( "tbody a:contains(18)", picker ).simulate( "mousedown" );
			TestHelpers.datepicker.equalsDate(
				input.datepicker( "valueAsDate" ),
				new Date( 2008, 2 - 1, 18 ),
				"Mouse click - next + min/max"
			);
			start();
		}, 100 );
	}

	step1();
});

})( jQuery );
