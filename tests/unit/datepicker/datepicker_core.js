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

asyncTest( "base structure", function() {
	expect( 5 );

	var input = TestHelpers.datepicker.initNewInput(),
		widget = input.datepicker( "widget" );

	input.focus();

	setTimeout(function() {
		ok( widget.is( ":visible" ), "Datepicker visible" );
		equal( widget.children().length, 2, "Child count" );
		ok( widget.is( ".ui-calendar" ), "Class ui-calendar" );
		ok( widget.is( ".ui-datepicker" ), "Class ui-datepicker" );
		ok( widget.is( ".ui-front" ), "Class ui-front" );

		input.datepicker( "close" );
		start();
	}, 50 );
});

asyncTest( "Keyboard handling: input", function() {
	expect( 10 );
	var picker, instance,
		input = $( "#datepicker" ).datepicker();

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
		input.val( "4/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		$( ".ui-calendar-calendar tbody a:contains(12)", picker ).simulate( "mousedown", {} );
		TestHelpers.datepicker.equalsDate(
			input.datepicker( "valueAsDate" ),
			new Date( 2008, 4 - 1, 12 ),
			"Mouse click - preset"
		);

		input.val( "" ).datepicker( "refresh" );
		input.simulate( "click" );
		strictEqual( input.datepicker( "valueAsDate" ), null, "Mouse click - close" );

		input.val( "4/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		input.simulate( "click" );
		TestHelpers.datepicker.equalsDate(
			input.datepicker( "valueAsDate" ),
			new Date( 2008, 4 - 1, 4 ),
			"Mouse click - close + preset"
		);

		input.val( "4/4/08" ).datepicker( "refresh" ).datepicker( "open" );
		picker.find( "a.ui-calendar-prev" ).simulate( "click" );
		input.simulate( "click" );
		TestHelpers.datepicker.equalsDate(
			input.datepicker( "valueAsDate" ),
			new Date( 2008, 4 - 1, 4 ),
			"Mouse click - abandoned"
		);

		start();
	}, 100 );
});

})( jQuery );

