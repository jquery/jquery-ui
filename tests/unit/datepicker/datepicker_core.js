(function( $ ) {

module( "datepicker: core" );

TestHelpers.testJshint( "datepicker" );

test( "input's value determines starting date", function() {
	expect( 3 );

	var input = $( "#datepicker" ).val( "1/1/14" ).datepicker(),
		picker = input.datepicker( "widget" );

	input.datepicker( "open" );

	equal( picker.find( ".ui-datepicker-month" ).html(), "January", "correct month displayed" );
	equal( picker.find( ".ui-datepicker-year" ).html(), "2014", "correct year displayed" );
	equal( picker.find( ".ui-state-focus" ).html(), "1", "correct day highlighted" );

	input.val( "" ).datepicker( "destroy" );
});

asyncTest( "baseStructure", function() {
	expect( 42 );
	var header, title, table, thead, week, panel, inl, child,
		inp = TestHelpers.datepicker.initNewInput(),
		dp = inp.datepicker( "widget" ).find( ".ui-datepicker" );

	function step1() {
		inp.focus();
		setTimeout(function() {
			ok( dp.is( ":visible" ), "Structure - datepicker visible" );
			ok( !dp.is( ".ui-datepicker-rtl" ), "Structure - not right-to-left" );
			ok( !dp.is( ".ui-datepicker-multi" ), "Structure - not multi-month" );
			equal( dp.children().length, 3, "Structure - child count (header, calendar, buttonpane)" );

			header = dp.children( ":first" );
			ok( header.is( "div.ui-datepicker-header" ), "Structure - header division" );
			equal( header.children().length, 3, "Structure - header child count" );
			ok( header.children( ":first" ).is( ".ui-datepicker-prev" ) && header.children( ":first" ).html() !== "", "Structure - prev link" );
			ok( header.children( ":eq(1)" ).is( ".ui-datepicker-next" ) && header.children( ":eq(1)" ).html() !== "", "Structure - next link" );

			title = header.children( ":last" ).children( ":first" );
			ok( title.is( "div.ui-datepicker-title" ) && title.html() !== "", "Structure - title division" );
			equal( title.children().length, 2, "Structure - title child count" );
			ok( title.children( ":first" ).is( "span.ui-datepicker-month" ) && title.children( ":first" ).text() !== "", "Structure - month text" );
			ok( title.children( ":last" ).is( "span.ui-datepicker-year" ) && title.children( ":last" ).text() !== "", "Structure - year text" );

			table = dp.children( ":eq(1)" );
			ok( table.is( "table.ui-datepicker-calendar" ), "Structure - month table" );
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
			// ok( week.children( ":first" ).is( "td.ui-datepicker-week-end" ), "Structure - month table first day cell" );
			// ok( week.children( ":last" ).is( "td.ui-datepicker-week-end" ), "Structure - month table second day cell" );

			inp.datepicker( "close" ).datepicker( "destroy" );
			step2();
		}, 50 );
	}

	function step2() {
		// Editable month/year and button panel
		inp = TestHelpers.datepicker.initNewInput({
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true
		});
		dp = inp.datepicker( "widget" ).find( ".ui-datepicker" );
		inp.focus();
		setTimeout(function() {
			title = dp.find( "div.ui-datepicker-title" );
			// TODO: Re-add tests when changeMonth and changeYear are re-implemented
			//ok( title.children( ":first" ).is( "select.ui-datepicker-month" ), "Structure - month selector" );
			//ok( title.children( ":last" ).is( "select.ui-datepicker-year" ), "Structure - year selector" );

			panel = dp.children( ":last" );
			ok( panel.is( "div.ui-datepicker-buttonpane" ), "Structure - button panel division" );
			equal( panel.children().length, 2, "Structure - button panel child count" );
			ok( panel.children( ":first" ).is( "button.ui-datepicker-current" ), "Structure - today button" );
			ok( panel.children( ":last" ).is( "button.ui-datepicker-close" ), "Structure - close button" );

			inp.datepicker( "close" ).datepicker( "destroy" );
			step3();
		});
	}

	function step3() {
		// Multi-month 2
		inp = TestHelpers.datepicker.initNewInput({ numberOfMonths: 2 } );
		dp = inp.datepicker( "widget" ).find( ".ui-datepicker" );
		inp.focus();
		setTimeout(function() {
			ok( dp.is( ".ui-datepicker-multi" ), "Structure multi [2] - multi-month" );
			equal( dp.children().length, 4, "Structure multi [2] - child count" );

			child = dp.children( ":first" );
			// TODO: Implement ui-datepicker-group-first class name
			// ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-first" ), "Structure multi [2] - first month division" );

			child = dp.children( ":eq(1)" );
			// TODO: Implement ui-datepicker-group-last class name
			// ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-last" ), "Structure multi [2] - second month division" );

			child = dp.children( ":eq(2)" );
			ok( child.is( "div.ui-datepicker-row-break" ), "Structure multi [2] - row break" );
			ok( dp.is( ".ui-datepicker-multi-2" ), "Structure multi [2] - multi-2" );

			inp.datepicker( "close" ).datepicker( "destroy" );
			step4();
		});
	}

	function step4() {
		// Multi-month 3
		inp = TestHelpers.datepicker.initNewInput({ numberOfMonths: 3 } );
		dp = inp.datepicker( "widget" ).find( ".ui-datepicker" );
		inp.focus();
		setTimeout(function() {
			ok( dp.is( ".ui-datepicker-multi-3" ), "Structure multi [3] - multi-3" );
			ok( !dp.is( ".ui-datepicker-multi-2" ), "Structure multi [3] - Trac #6704" );

			inp.datepicker( "close" ).datepicker( "destroy" );
			step5();
		});
	}

	function step5() {
		// Multi-month [2, 2]
		inp = TestHelpers.datepicker.initNewInput({ numberOfMonths: [ 2, 2 ] } );
		dp = inp.datepicker( "widget" ).find( ".ui-datepicker" );
		inp.focus();
		setTimeout(function() {
			/*
			TODO: Re-add after array form of the numberOfMonths option is implemented.
			ok( dp.is( ".ui-datepicker-multi" ), "Structure multi - multi-month" );
			equal( dp.children().length, 6, "Structure multi [2,2] - child count" );

			child = dp.children( ":first" );
			ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-first" ), "Structure multi [2,2] - first month division" );

			child = dp.children( ":eq(1)" );
			ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-last" ), "Structure multi [2,2] - second month division" );

			child = dp.children( ":eq(2)" );
			ok( child.is( "div.ui-datepicker-row-break" ), "Structure multi [2,2] - row break" );

			child = dp.children( ":eq(3)" );
			ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-first" ), "Structure multi [2,2] - third month division" );

			child = dp.children( ":eq(4)" );
			ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-last" ), "Structure multi [2,2] - fourth month division" );

			child = dp.children( ":eq(5)" );
			ok( child.is( "div.ui-datepicker-row-break" ), "Structure multi [2,2] - row break" );
			*/
			inp.datepicker( "close" ).datepicker( "destroy" );
			step6();
		});
	}

	function step6() {
		// Inline
		inl = TestHelpers.datepicker.init( "#inline" );
		dp = inl.children();

		ok( dp.is( ".ui-datepicker-inline" ), "Structure inline - main div" );
		ok( !dp.is( ".ui-datepicker-rtl" ), "Structure inline - not right-to-left" );
		ok( !dp.is( ".ui-datepicker-multi" ), "Structure inline - not multi-month" );
		equal( dp.children().length, 3, "Structure inline - child count (header, calendar, buttonpane)" );

		header = dp.children( ":first" );
		ok( header.is( "div.ui-datepicker-header" ), "Structure inline - header division" );
		equal( header.children().length, 3, "Structure inline - header child count" );

		table = dp.children( ":eq(1)" );
		ok( table.is( "table.ui-datepicker-calendar" ), "Structure inline - month table" );
		ok( table.children( ":first" ).is( "thead" ), "Structure inline - month table thead" );
		ok( table.children( ":eq(1)" ).is( "tbody" ), "Structure inline - month table body" );

		inl.datepicker( "destroy" );

		step7();
	}

	function step7() {
		// Inline multi-month
		inl = TestHelpers.datepicker.init( "#inline", { numberOfMonths: 2 } );
		dp = inl.datepicker( "widget" ).find( ".ui-datepicker" );

		ok( dp.is( ".ui-datepicker-inline" ) && dp.is( ".ui-datepicker-multi" ), "Structure inline multi - main div" );
		equal( dp.children().length, 4, "Structure inline multi - child count" );

		child = dp.children( ":first" );
		// TODO: Implement ui-datepicker-group-first class name
		// ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-first" ), "Structure inline multi - first month division" );

		child = dp.children( ":eq(1)" );
		// TODO: Implement ui-datepicker-group-last class name
		// ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-last" ), "Structure inline multi - second month division" );

		child = dp.children( ":eq(2)" );
		ok( child.is( "div.ui-datepicker-row-break" ), "Structure inline multi - row break" );

		inl.datepicker( "destroy" );
		start();
	}

	step1();
});

asyncTest( "Keyboard handling: input", function() {
	expect( 9 );
	var input = $( "#datepicker" ).datepicker(),
		picker, instance;

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
		TestHelpers.datepicker.init( input );
		instance = input.datepicker( "instance" );

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
		start();
	}

	step1();
});

asyncTest( "keyboard handling: calendar", function() {
	expect( 7 );

	var input = $( "#datepicker" );

	function step1() {
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
				step2();
			}, 50 );
		}, 100 );
	}

	function step2() {
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
			step3();
		}, 100 );
	}

	function step3() {
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
				step4();
			}, 50 );
		}, 100 );
	}

	function step4() {
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
				step5();
			}, 50 );
		}, 100 );
	}

	function step5() {
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
				step6();
			}, 50 );
		}, 100 );
	}

	function step6() {
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
				step7();
			}, 50 );
		}, 100 );
	}

	// Check for moving to short months
	function step7() {
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

asyncTest( "mouse", function() {
	expect( 3 );

	var input = TestHelpers.datepicker.init( $( "#datepicker" ).val( "" ) ),
		picker = input.datepicker( "widget" );

	input.datepicker( "open" );

	setTimeout(function() {
		input.simulate( "click" );
		ok( input.datepicker( "valueAsDate" ) === null, "Mouse click - close" );

		input.val( "2/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		input.simulate( "click" );
		TestHelpers.datepicker.equalsDate(
			input.datepicker( "valueAsDate" ),
			new Date( 2008, 2 - 1, 4 ),
			"Mouse click - close + preset"
		);

		input.val( "2/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		$( "a.ui-calendar-prev", picker ).simulate( "click", {} );
		input.simulate( "click" );
		TestHelpers.datepicker.equalsDate(
			input.datepicker( "valueAsDate" ),
			new Date( 2008, 2 - 1, 4 ),
			"Mouse click - abandoned"
		);

		start();
	}, 100 );
});

})( jQuery );
