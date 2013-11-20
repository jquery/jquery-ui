(function( $ ) {

module( "datepicker: core" );

TestHelpers.testJshint( "datepicker" );

test( "input's value determines starting date", function() {
	expect( 3 );

	var input = $( "#datepicker" ).val( "1/1/2014" ).datepicker(),
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
			ok( title.is( "div.ui-datepicker-title" ) && title.html() !== "","Structure - title division" );
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
		});
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
		inp = TestHelpers.datepicker.initNewInput({ numberOfMonths: 2 });
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
		inp = TestHelpers.datepicker.initNewInput({ numberOfMonths: 3 });
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
		inp = TestHelpers.datepicker.initNewInput({ numberOfMonths: [ 2, 2 ] });
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

		// TODO: Calling destroy() on inline pickers currently does not work.
		inl.empty();

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

test( "Keyboard handling", function() {
	// TODO: These tests all rely on having a method to retrieve a Date object. There
	// is not only implemented yet so bail.
	expect( 0 );
	return;

	expect( 24 );
	var inp = TestHelpers.datepicker.init( "#datepicker" ),
		date = new Date();

	inp.val( "" ).datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.val(), date, "Keystroke enter" );

	inp.val( "02/04/2008" ).datepicker( "open" )
		.simulate("keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Keystroke enter - preset" );

	inp.val( "02/04/2008" ).datepicker( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.HOME })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), date, "Keystroke ctrl+home" );

	inp.val( "02/04/2008" ).datepicker( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.END });
	ok( inp.datepicker( "getDate" ) == null, "Keystroke ctrl+end" );

	inp.val( "" ).datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE });
	ok(inp.datepicker("getDate") == null, "Keystroke esc");

	inp.val( "02/04/2008" ).datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Keystroke esc - preset" );

	inp.val( "02/04/2008" ).datepicker( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date(2008, 2 - 1, 4),
		"Keystroke esc - abandoned" );

	// Moving by day or week
	inp.val( "" ).datepicker( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.LEFT })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	date.setDate( date.getDate() - 1 );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), date, "Keystroke ctrl+left" );

	inp.val( "" ).datepicker( "open" )
		.simulate( "keydown", {keyCode: $.ui.keyCode.LEFT }).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER });
	date.setDate( date.getDate() + 1 );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), date, "Keystroke left") ;
	
	inp.val( "" ).datepicker( "open" )
		.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.RIGHT}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 1);
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), date, "Keystroke ctrl+right" );
	
	inp.val( "" ).datepicker( "open" )
		.simulate( "keydown", {keyCode: $.ui.keyCode.RIGHT}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() - 1);
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), date, "Keystroke right" );
	
	inp.val( "" ).datepicker( "open" )
		.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.UP}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() - 7);
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), date, "Keystroke ctrl+up" );
	
	inp.val( "" ).datepicker( "open" )
		.simulate( "keydown", {keyCode: $.ui.keyCode.UP}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 7);
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), date, "Keystroke up" );
	
	inp.val( "" ).datepicker( "open" )
		.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.DOWN}).
		simulate( "keydown", {keyCode: $.ui.keyCode.ENTER});
	date.setDate(date.getDate() + 7);
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), date, "Keystroke ctrl+down" );
	
	inp.val( "" ).datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.DOWN })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	date.setDate( date.getDate() - 7 );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), date, "Keystroke down" );

	// Moving by month or year
	inp.val( "02/04/2008" ).datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 1 - 1, 4 ),
		"Keystroke pgup" );

	inp.val( "02/04/2008" ).datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 3 - 1, 4 ),
		"Keystroke pgdn" );

	inp.val( "02/04/2008" ).datepicker( "open" )
		.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2007, 2 - 1, 4 ),
		"Keystroke ctrl+pgup" );

	inp.val( "02/04/2008" ).datepicker( "open" )
		.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER});
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2009, 2 - 1, 4 ),
		"Keystroke ctrl+pgdn" );

	// Check for moving to short months
	inp.val( "03/31/2008" ).datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 29 ),
		"Keystroke pgup - Feb" );

	inp.val( "01/30/2008" ).datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 29 ),
		"Keystroke pgdn - Feb" );

	inp.val( "02/29/2008" ).datepicker( "open" )
		.simulate( "keydown", {ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2007, 2 - 1, 28 ),
		"Keystroke ctrl+pgup - Feb" );

	inp.val( "02/29/2008" ).datepicker( "open" )
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2009, 2 - 1, 28 ),
		"Keystroke ctrl+pgdn - Feb" );

	// Goto current
	inp.datepicker( "option", { gotoCurrent: true })
		.datepicker( "close" ).val( "02/04/2008" ).datepicker( "open" )
		.late( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN })
		.simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.HOME })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Keystroke ctrl+home" );

	// Change steps
	inp.datepicker( "option", { stepMonths: 2, gotoCurrent: false })
		.datepicker( "close" ).val( "02/04/2008" ).datepicker( "open" )
		.late( "keydown", { keyCode: $.ui.keyCode.PAGE_UP })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2007, 12 - 1, 4 ),
		"Keystroke pgup step 2" );

	inp.val( "02/04/2008" ).datepicker( "open" )
		.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN })
		.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER });
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 4 - 1, 4 ),
		"Keystroke pgdn step 2" );
});

test( "mouse", function() {
	// TODO: These tests use the old getDate() and setDate() methods. Re-activate these
	// tests when those methods are available.
	expect( 0 );
	return;

	expect( 15 );
	var inl,
		inp = TestHelpers.datepicker.init( "#datepicker" ),
		dp = inp.datepicker( "widget" ).find( ".ui-datepicker" ),
		date = new Date();

	inp.val(  "" ).datepicker( "open"  );
	$( ".ui-datepicker-calendar tbody a:contains(10)", dp ).simulate( "click", {} );
	date.setDate( 10 );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), date, "Mouse click" );

	inp.val(  "02/04/2008"  ).datepicker( "open" );
	$( ".ui-datepicker-calendar tbody a:contains(12)", dp ).simulate( "click", {} );
	TestHelpers.datepicker.equalsDate( inp.datepicker("getDate"), new Date( 2008, 2 - 1, 12 ),
		"Mouse click - preset") ;

	inp.val( "02/04/2008" ).datepicker( "open" );
	inp.val( "").datepicker( "open" );
	$( "button.ui-datepicker-close", dp ).simulate( "click", {} );
	ok( inp.datepicker( "getDate" ) == null, "Mouse click - close" );
	inp.val( "02/04/2008" ).datepicker( "open" );
	$( "button.ui-datepicker-close", dp ).simulate( "click", {} );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Mouse click - close + preset" );

	inp.val( "02/04/2008" ).datepicker( "open" );
	$( "a.ui-datepicker-prev", dp ).simulate( "click", {} );
	$( "button.ui-datepicker-close", dp ).simulate( "click", {} );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Mouse click - abandoned" );

	// Current/previous/next
	inp.val( "02/04/2008" ).datepicker( "option", { showButtonPanel: true }).datepicker( "open" );
	$( ".ui-datepicker-current", dp ).simulate( "click", {} );
	$( ".ui-datepicker-calendar tbody a:contains(14)", dp ).simulate( "click", {} );
	date.setDate( 14 );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), date, "Mouse click - current" );

	inp.val( "02/04/2008" ).datepicker( "open" );
	$( ".ui-datepicker-prev", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(16)", dp ).simulate( "click" );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 1 - 1, 16 ),
		"Mouse click - previous" );

	inp.val( "02/04/2008" ).datepicker( "open" );
	$(".ui-datepicker-next", dp ).simulate( "click" );
	$(".ui-datepicker-calendar tbody a:contains(18)", dp ).simulate( "click" );
	TestHelpers.datepicker.equalsDate( inp.datepicker("getDate"), new Date( 2008, 3 - 1, 18 ),
		"Mouse click - next" );

	// Previous/next with minimum/maximum
	inp.datepicker("option", {
		minDate: new Date( 2008, 2 - 1, 2 ),
		maxDate: new Date( 2008, 2 - 1, 26 )
	}).val( "02/04/2008" ).datepicker( "open" );
	$( ".ui-datepicker-prev", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(16)", dp ).simulate( "click" );
	TestHelpers.datepicker.equalsDate( inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 16 ),
		"Mouse click - previous + min/max" );

	inp.val( "02/04/2008" ).datepicker( "open" );
	$( ".ui-datepicker-next", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(18)", dp ).simulate( "click" );
	TestHelpers.datepicker.equalsDate(inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 18 ),
		"Mouse click - next + min/max" );

	// Inline
	inl = TestHelpers.datepicker.init( "#inline" );
	dp = $( ".ui-datepicker-inline", inl );
	date = new Date();
	inl.datepicker( "setDate", date );
	$( ".ui-datepicker-calendar tbody a:contains(10)", dp ).simulate( "click", {} );
	date.setDate( 10 );
	TestHelpers.datepicker.equalsDate( inl.datepicker( "getDate" ), date, "Mouse click inline" );

	inl.datepicker( "option", { showButtonPanel: true })
		.datepicker( "setDate", new Date( 2008, 2 - 1, 4 ));
	$( ".ui-datepicker-calendar tbody a:contains(12)", dp ).simulate( "click", {} );
	TestHelpers.datepicker.equalsDate( inl.datepicker( "getDate" ), new Date( 2008, 2 - 1, 12 ),
		"Mouse click inline - preset" );

	inl.datepicker("option", { showButtonPanel: true });
	$( ".ui-datepicker-current", dp ).simulate( "click", {} );
	$( ".ui-datepicker-calendar tbody a:contains(14)", dp ).simulate( "click", {} );
	date.setDate( 14 );
	TestHelpers.datepicker.equalsDate( inl.datepicker( "getDate" ), date, "Mouse click inline - current" );

	inl.datepicker( "setDate", new Date( 2008, 2 - 1, 4) );
	$( ".ui-datepicker-prev", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(16)", dp ).simulate( "click" );
	TestHelpers.datepicker.equalsDate( inl.datepicker( "getDate" ), new Date( 2008, 1 - 1, 16 ),
		"Mouse click inline - previous" );

	inl.datepicker( "setDate", new Date( 2008, 2 - 1, 4) );
	$( ".ui-datepicker-next", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(18)", dp ).simulate( "click" );
	TestHelpers.datepicker.equalsDate( inl.datepicker( "getDate" ), new Date( 2008, 3 - 1, 18 ),
		"Mouse click inline - next" );
});

})( jQuery );
