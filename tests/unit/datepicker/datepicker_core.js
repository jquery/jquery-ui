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
	expect( 15 );

	var header, title, table, child, buttonpane,
		inp = TestHelpers.datepicker.initNewInput(),
		dp = inp.datepicker( "widget" );

	function step1() {
		inp.focus();

		setTimeout(function() {
			ok( dp.is( ":visible" ), "Structure - datepicker visible" );
			equal( dp.children().length, 2, "Structure - child count (header, calendar)" );

			header = dp.children( ":first" );
			ok( header.is( "div.ui-calendar-header" ), "Structure - header division" );
			equal( header.children().length, 3, "Structure - header child count" );

			title = header.children( ":last" ).children( ":first" );
			equal( title.children().length, 2, "Structure - title child count" );

			table = dp.children( ":eq(1)" );
			ok( table.is( "table.ui-calendar-calendar" ), "Structure - month table" );
			ok( table.children( ":first" ).is( "thead" ), "Structure - month table thead" );
			ok( table.children( ":eq(1)" ).is( "tbody" ), "Structure - month table body" );

			inp.datepicker( "close" );
			step2();
		}, 50 );
	}

	function step2() {
		inp.datepicker( "option", "buttons", {
			"test": function() {},
			"test button": function() {}
		});
		inp.focus();

		setTimeout(function() {
			equal( dp.children().length, 3, "Structure buttons - child count (header, calendar, buttonpane)" );

			buttonpane = dp.children( ".ui-calendar-buttonpane" );
			equal( buttonpane.children( "div.ui-calendar-buttonset" ).length, 1, "Structure buttons - buttonset" );
			equal( buttonpane.find( "button.ui-button:first" ).text(), "test", "Structure buttons - buttonset" );
			equal( buttonpane.find( "button.ui-button:eq(1)" ).text(), "test button", "Structure buttons - buttonset" );

			inp.datepicker( "close" ).datepicker( "destroy" );
			step3();
		}, 50 );
	}

	function step3() {
		// Multi-month 2
		inp = TestHelpers.datepicker.initNewInput({ numberOfMonths: 2 } );
		dp = inp.datepicker( "widget" );
		inp.focus();
		setTimeout(function() {
			ok( dp.is( ".ui-calendar-multi" ), "Structure multi [2] - multi-month" );
			equal( dp.children().length, 3, "Structure multi [2] - child count" );

			child = dp.children( ":eq(2)" );
			ok( child.is( "div.ui-calendar-row-break" ), "Structure multi [2] - row break" );

			inp.datepicker( "close" ).datepicker( "destroy" );
		});
		start();
	}

	step1();
});

asyncTest( "Keyboard handling: input", function() {
	expect( 10 );
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

		// Enter = Select preset date
		input
			.val( "1/1/14" )
			.datepicker( "refresh" )
			.datepicker( "open" )
			.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
		TestHelpers.datepicker.equalsDate( input.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ),
			"Keystroke enter - preset" );

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

// TODO: implement
test( "ARIA", function() {
	expect( 0 );
});

asyncTest( "mouse", function() {
	expect( 4 );

	var input = TestHelpers.datepicker.init( $( "#datepicker" ).val( "" ) ),
		picker = input.datepicker( "widget" );

	input.datepicker( "open" );

	setTimeout(function() {
		input.val( "2/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		$( ".ui-calendar-calendar tbody a:contains(12)", picker ).simulate( "mousedown", {} );
		TestHelpers.datepicker.equalsDate(
			input.datepicker( "valueAsDate" ),
			new Date( 2008, 2 - 1, 12 ),
			"Mouse click - preset"
		);

		input.val( "" ).datepicker( "refresh" );
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
