define( [
	"qunit",
	"jquery",
	"lib/common",
	"lib/helper",
	"./helper",
	"ui/widgets/datepicker",
	"ui/i18n/datepicker-he"
], function( QUnit, $, common, helper, testHelper ) {
"use strict";

QUnit.module( "datepicker: core", {
	beforeEach: function() {
		$( "body" ).trigger( "focus" );
	},
	afterEach: helper.moduleAfterEach
} );

QUnit.test( "initialization - Reinitialization after body had been emptied.", function( assert ) {
	assert.expect( 1 );
	var bodyContent = $( "body" ).children(), inp = $( "#inp" );
	$( "#inp" ).datepicker();
	$( "body" ).empty().append( inp );
	$( "#inp" ).datepicker();
	assert.ok( $( "#" + $.datepicker._mainDivId ).length === 1, "Datepicker container added" );
	$( "body" ).empty().append( bodyContent ); // Returning to initial state for later tests
} );

QUnit.test( "widget method - empty collection", function( assert ) {
	assert.expect( 1 );
	$( "#nonExist" ).datepicker(); // Should create nothing
	assert.ok( !$( "#ui-datepicker-div" ).length, "Non init on empty collection" );
} );

QUnit.test( "widget method", function( assert ) {
	assert.expect( 1 );
	var actual = $( "#inp" ).datepicker().datepicker( "widget" )[ 0 ];
	assert.deepEqual( $( "body > #ui-datepicker-div:last-child" )[ 0 ], actual );
} );

QUnit.test( "baseStructure", function( assert ) {
	var ready = assert.async();
	assert.expect( 58 );
	var header, title, table, thead, week, panel, inl, child,
		inp = testHelper.initNewInput(),
		dp = $( "#ui-datepicker-div" );

	function step1() {
		testHelper.onFocus( inp, function() {
			assert.ok( dp.is( ":visible" ), "Structure - datepicker visible" );
			assert.ok( !dp.is( ".ui-datepicker-rtl" ), "Structure - not right-to-left" );
			assert.ok( !dp.is( ".ui-datepicker-multi" ), "Structure - not multi-month" );
			assert.equal( dp.children().length, 2, "Structure - child count" );

			header = dp.children().first();
			assert.ok( header.is( "div.ui-datepicker-header" ), "Structure - header division" );
			assert.equal( header.children().length, 3, "Structure - header child count" );
			assert.ok( header.children().first().is( "a.ui-datepicker-prev" ) && header.children().first().html() !== "", "Structure - prev link" );
			assert.ok( header.children().eq( 1 ).is( "a.ui-datepicker-next" ) && header.children().eq( 1 ).html() !== "", "Structure - next link" );

			title = header.children().last();
			assert.ok( title.is( "div.ui-datepicker-title" ) && title.html() !== "", "Structure - title division" );
			assert.equal( title.children().length, 2, "Structure - title child count" );
			assert.ok( title.children().first().is( "span.ui-datepicker-month" ) && title.children().first().text() !== "", "Structure - month text" );
			assert.ok( title.children().last().is( "span.ui-datepicker-year" ) && title.children().last().text() !== "", "Structure - year text" );

			table = dp.children().eq( 1 );
			assert.ok( table.is( "table.ui-datepicker-calendar" ), "Structure - month table" );
			assert.ok( table.children().first().is( "thead" ), "Structure - month table thead" );

			thead = table.children().first().children().first();
			assert.ok( thead.is( "tr" ), "Structure - month table title row" );
			assert.equal( thead.find( "th" ).length, 7, "Structure - month table title cells" );
			assert.ok( table.children().eq( 1 ).is( "tbody" ), "Structure - month table body" );
			assert.ok( table.children().eq( 1 ).children( "tr" ).length >= 4, "Structure - month table week count" );

			week = table.children().eq( 1 ).children().first();
			assert.ok( week.is( "tr" ), "Structure - month table week row" );
			assert.equal( week.children().length, 7, "Structure - week child count" );
			assert.ok( week.children().first().is( "td.ui-datepicker-week-end" ), "Structure - month table first day cell" );
			assert.ok( week.children().last().is( "td.ui-datepicker-week-end" ), "Structure - month table second day cell" );

			inp.datepicker( "hide" ).datepicker( "destroy" );
			step2();
		} );
	}

	function step2() {

		// Editable month/year and button panel
		inp = testHelper.initNewInput( {
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true
		} );
		testHelper.onFocus( inp, function() {
			title = dp.find( "div.ui-datepicker-title" );
			assert.ok( title.children().first().is( "select.ui-datepicker-month" ), "Structure - month selector" );
			assert.ok( title.children().last().is( "select.ui-datepicker-year" ), "Structure - year selector" );

			panel = dp.children().last();
			assert.ok( panel.is( "div.ui-datepicker-buttonpane" ), "Structure - button panel division" );
			assert.equal( panel.children().length, 2, "Structure - button panel child count" );
			assert.ok( panel.children().first().is( "button.ui-datepicker-current" ), "Structure - today button" );
			assert.ok( panel.children().last().is( "button.ui-datepicker-close" ), "Structure - close button" );

			inp.datepicker( "hide" ).datepicker( "destroy" );
			step3();
		} );
	}

	function step3() {

		// Multi-month 2
		inp = testHelper.initNewInput( { numberOfMonths: 2 } );
		testHelper.onFocus( inp, function() {
			assert.ok( dp.is( ".ui-datepicker-multi" ), "Structure multi [2] - multi-month" );
			assert.equal( dp.children().length, 3, "Structure multi [2] - child count" );

			child = dp.children().first();
			assert.ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-first" ), "Structure multi [2] - first month division" );

			child = dp.children().eq( 1 );
			assert.ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-last" ), "Structure multi [2] - second month division" );

			child = dp.children().eq( 2 );
			assert.ok( child.is( "div.ui-datepicker-row-break" ), "Structure multi [2] - row break" );
			assert.ok( dp.is( ".ui-datepicker-multi-2" ), "Structure multi [2] - multi-2" );

			inp.datepicker( "hide" ).datepicker( "destroy" );
			step4();
		} );
	}

	function step4() {

		// Multi-month 3
		inp = testHelper.initNewInput( { numberOfMonths: 3 } );
		testHelper.onFocus( inp, function() {
			assert.ok( dp.is( ".ui-datepicker-multi-3" ), "Structure multi [3] - multi-3" );
			assert.ok( !dp.is( ".ui-datepicker-multi-2" ), "Structure multi [3] - Trac #6704" );

			inp.datepicker( "hide" ).datepicker( "destroy" );
			step5();
		} );
	}

	function step5() {

		// Multi-month [2, 2]
		inp = testHelper.initNewInput( { numberOfMonths: [ 2, 2 ] } );
		testHelper.onFocus( inp, function() {
			assert.ok( dp.is( ".ui-datepicker-multi" ), "Structure multi - multi-month" );
			assert.equal( dp.children().length, 6, "Structure multi [2,2] - child count" );

			child = dp.children().first();
			assert.ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-first" ), "Structure multi [2,2] - first month division" );

			child = dp.children().eq( 1 );
			assert.ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-last" ), "Structure multi [2,2] - second month division" );

			child = dp.children().eq( 2 );
			assert.ok( child.is( "div.ui-datepicker-row-break" ), "Structure multi [2,2] - row break" );

			child = dp.children().eq( 3 );
			assert.ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-first" ), "Structure multi [2,2] - third month division" );

			child = dp.children().eq( 4 );
			assert.ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-last" ), "Structure multi [2,2] - fourth month division" );

			child = dp.children().eq( 5 );
			assert.ok( child.is( "div.ui-datepicker-row-break" ), "Structure multi [2,2] - row break" );

			inp.datepicker( "hide" ).datepicker( "destroy" );

			// Inline
			inl = testHelper.init( "#inl" );
			dp = inl.children();

			assert.ok( dp.is( ".ui-datepicker-inline" ), "Structure inline - main div" );
			assert.ok( !dp.is( ".ui-datepicker-rtl" ), "Structure inline - not right-to-left" );
			assert.ok( !dp.is( ".ui-datepicker-multi" ), "Structure inline - not multi-month" );
			assert.equal( dp.children().length, 2, "Structure inline - child count" );

			header = dp.children().first();
			assert.ok( header.is( "div.ui-datepicker-header" ), "Structure inline - header division" );
			assert.equal( header.children().length, 3, "Structure inline - header child count" );

			table = dp.children().eq( 1 );
			assert.ok( table.is( "table.ui-datepicker-calendar" ), "Structure inline - month table" );
			assert.ok( table.children().first().is( "thead" ), "Structure inline - month table thead" );
			assert.ok( table.children().eq( 1 ).is( "tbody" ), "Structure inline - month table body" );

			inl.datepicker( "destroy" );

			// Inline multi-month
			inl = testHelper.init( "#inl", { numberOfMonths: 2 } );
			dp = inl.children();

			assert.ok( dp.is( ".ui-datepicker-inline" ) && dp.is( ".ui-datepicker-multi" ), "Structure inline multi - main div" );
			assert.equal( dp.children().length, 3, "Structure inline multi - child count" );

			child = dp.children().first();
			assert.ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-first" ), "Structure inline multi - first month division" );

			child = dp.children().eq( 1 );
			assert.ok( child.is( "div.ui-datepicker-group" ) && child.is( "div.ui-datepicker-group-last" ), "Structure inline multi - second month division" );

			child = dp.children().eq( 2 );
			assert.ok( child.is( "div.ui-datepicker-row-break" ), "Structure inline multi - row break" );

			inl.datepicker( "destroy" );
			ready();
		} );
	}

	step1();
} );

QUnit.test( "customStructure", function( assert ) {
	var ready = assert.async();
	assert.expect( 20 );
	var header, panel, title, thead,
		inp = testHelper.initNewInput( $.datepicker.regional.he ),
		dp = $( "#ui-datepicker-div" );

	function step1() {
		inp.datepicker( "option", "showButtonPanel", true );

		testHelper.onFocus( inp, function() {
			assert.ok( dp.is( ".ui-datepicker-rtl" ), "Structure RTL - right-to-left" );

			header = dp.children().first();
			assert.ok( header.is( "div.ui-datepicker-header" ), "Structure RTL - header division" );
			assert.equal( header.children().length, 3, "Structure RTL - header child count" );
			assert.ok( header.children().first().is( "a.ui-datepicker-next" ), "Structure RTL - prev link" );
			assert.ok( header.children().eq( 1 ).is( "a.ui-datepicker-prev" ), "Structure RTL - next link" );

			panel = dp.children().last();
			assert.ok( panel.is( "div.ui-datepicker-buttonpane" ), "Structure RTL - button division" );
			assert.equal( panel.children().length, 2, "Structure RTL - button panel child count" );
			assert.ok( panel.children().first().is( "button.ui-datepicker-close" ), "Structure RTL - close button" );
			assert.ok( panel.children().last().is( "button.ui-datepicker-current" ), "Structure RTL - today button" );

			inp.datepicker( "hide" ).datepicker( "destroy" );
			step2();
		} );
	}

	// Hide prev/next
	function step2() {
		inp = testHelper.initNewInput( {
			hideIfNoPrevNext: true,
			minDate: new Date( 2008, 2 - 1, 4 ),
			maxDate: new Date( 2008, 2 - 1, 14 )
		} );
		inp.val( "02/10/2008" );

		testHelper.onFocus( inp, function() {
			header = dp.children().first();
			assert.ok( header.is( "div.ui-datepicker-header" ), "Structure hide prev/next - header division" );
			assert.equal( header.children().length, 1, "Structure hide prev/next - links child count" );
			assert.ok( header.children().first().is( "div.ui-datepicker-title" ), "Structure hide prev/next - title division" );

			inp.datepicker( "hide" ).datepicker( "destroy" );
			step3();
		} );
	}

	// Changeable Month with read-only year
	function step3() {
		inp = testHelper.initNewInput( { changeMonth: true } );

		testHelper.onFocus( inp, function() {
			title = dp.children().first().children().last();
			assert.equal( title.children().length, 2, "Structure changeable month - title child count" );
			assert.ok( title.children().first().is( "select.ui-datepicker-month" ), "Structure changeable month - month selector" );
			assert.ok( title.children().last().is( "span.ui-datepicker-year" ), "Structure changeable month - read-only year" );

			inp.datepicker( "hide" ).datepicker( "destroy" );
			step4();
		} );
	}

	// Changeable year with read-only month
	function step4() {
		inp = testHelper.initNewInput( { changeYear: true } );

		testHelper.onFocus( inp, function() {
			title = dp.children().first().children().last();
			assert.equal( title.children().length, 2, "Structure changeable year - title child count" );
			assert.ok( title.children().first().is( "span.ui-datepicker-month" ), "Structure changeable year - read-only month" );
			assert.ok( title.children().last().is( "select.ui-datepicker-year" ), "Structure changeable year - year selector" );

			inp.datepicker( "hide" ).datepicker( "destroy" );
			step5();
		} );
	}

	// Read-only first day of week
	function step5() {
		inp = testHelper.initNewInput( { changeFirstDay: false } );

		testHelper.onFocus( inp, function() {
			thead = dp.find( ".ui-datepicker-calendar thead tr" );
			assert.equal( thead.children().length, 7, "Structure read-only first day - thead child count" );
			assert.equal( thead.find( "a" ).length, 0, "Structure read-only first day - thead links count" );

			inp.datepicker( "hide" ).datepicker( "destroy" );
			ready();
		} );
	}

	// TODO: figure out why this setTimeout is needed in IE,
	// it only is necessary when the previous baseStructure tests runs first
	// Support: IE
	setTimeout( step1 );
} );

QUnit.test( "keystrokes", function( assert ) {
	assert.expect( 26 );
	var inp = testHelper.init( "#inp" ),
		date = new Date();
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Keystroke enter" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Keystroke enter - preset" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.HOME } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Keystroke ctrl+home" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.END } );
	assert.ok( inp.datepicker( "getDate" ) == null, "Keystroke ctrl+end" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	assert.ok( inp.datepicker( "getDate" ) == null, "Keystroke esc" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Keystroke esc - preset" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Keystroke esc - abandoned" );

	// Moving by day or week
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.LEFT } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() - 1 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Keystroke ctrl+left" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() + 1 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Keystroke left" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.RIGHT } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() + 1 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Keystroke ctrl+right" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() - 1 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Keystroke right" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() - 7 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Keystroke ctrl+up" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() + 7 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Keystroke up" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() + 7 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Keystroke ctrl+down" );
	inp.val( "" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	date.setDate( date.getDate() - 7 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Keystroke down" );

	// Moving by month or year
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 1 - 1, 4 ),
		"Keystroke pgup" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 3 - 1, 4 ),
		"Keystroke pgdn" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2007, 2 - 1, 4 ),
		"Keystroke ctrl+pgup" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2009, 2 - 1, 4 ),
		"Keystroke ctrl+pgdn" );

	// Check for moving to short months
	inp.val( "03/31/2008" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 29 ),
		"Keystroke pgup - Feb" );
	inp.val( "01/30/2008" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 29 ),
		"Keystroke pgdn - Feb" );
	inp.val( "02/29/2008" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2007, 2 - 1, 28 ),
		"Keystroke ctrl+pgup - Feb" );
	inp.val( "02/29/2008" ).datepicker( "show" ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2009, 2 - 1, 28 ),
		"Keystroke ctrl+pgdn - Feb" );

	// Goto current
	inp.datepicker( "option", { gotoCurrent: true } ).
		datepicker( "hide" ).val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { ctrlKey: true, keyCode: $.ui.keyCode.HOME } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Keystroke ctrl+home" );

	// Change steps
	inp.datepicker( "option", { stepMonths: 2, gotoCurrent: false } ).
		datepicker( "hide" ).val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2007, 12 - 1, 4 ),
		"Keystroke pgup step 2" );
	inp.val( "02/04/2008" ).datepicker( "show" ).
		simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } ).
		simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 4 - 1, 4 ),
		"Keystroke pgdn step 2" );
} );

QUnit.test( "mouse", function( assert ) {
	assert.expect( 15 );
	var inl,
		inp = testHelper.init( "#inp" ),
		dp = $( "#ui-datepicker-div" ),
		date = new Date();
	inp.val( "" ).datepicker( "show" );
	$( ".ui-datepicker-calendar tbody a:contains(10)", dp ).simulate( "click", {} );
	date.setDate( 10 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Mouse click" );
	inp.val( "02/04/2008" ).datepicker( "show" );
	$( ".ui-datepicker-calendar tbody a:contains(12)", dp ).simulate( "click", {} );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 12 ),
		"Mouse click - preset" );
	inp.val( "02/04/2008" ).datepicker( "show" );
	inp.val( "" ).datepicker( "show" );
	$( "button.ui-datepicker-close", dp ).simulate( "click", {} );
	assert.ok( inp.datepicker( "getDate" ) == null, "Mouse click - close" );
	inp.val( "02/04/2008" ).datepicker( "show" );
	$( "button.ui-datepicker-close", dp ).simulate( "click", {} );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Mouse click - close + preset" );
	inp.val( "02/04/2008" ).datepicker( "show" );
	$( "a.ui-datepicker-prev", dp ).simulate( "click", {} );
	$( "button.ui-datepicker-close", dp ).simulate( "click", {} );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 4 ),
		"Mouse click - abandoned" );

	// Current/previous/next
	inp.val( "02/04/2008" ).datepicker( "option", { showButtonPanel: true } ).datepicker( "show" );
	$( ".ui-datepicker-current", dp ).simulate( "click", {} );
	$( ".ui-datepicker-calendar tbody a:contains(14)", dp ).simulate( "click", {} );
	date.setDate( 14 );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), date, "Mouse click - current" );
	inp.val( "02/04/2008" ).datepicker( "show" );
	$( ".ui-datepicker-prev", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(16)", dp ).simulate( "click" );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 1 - 1, 16 ),
		"Mouse click - previous" );
	inp.val( "02/04/2008" ).datepicker( "show" );
	$( ".ui-datepicker-next", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(18)", dp ).simulate( "click" );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 3 - 1, 18 ),
		"Mouse click - next" );

	// Previous/next with minimum/maximum
	inp.datepicker( "option", { minDate: new Date( 2008, 2 - 1, 2 ),
		maxDate: new Date( 2008, 2 - 1, 26 ) } ).val( "02/04/2008" ).datepicker( "show" );
	$( ".ui-datepicker-prev", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(16)", dp ).simulate( "click" );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 16 ),
		"Mouse click - previous + min/max" );
	inp.val( "02/04/2008" ).datepicker( "show" );
	$( ".ui-datepicker-next", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(18)", dp ).simulate( "click" );
	testHelper.equalsDate( assert, inp.datepicker( "getDate" ), new Date( 2008, 2 - 1, 18 ),
		"Mouse click - next + min/max" );

	// Inline
	inl = testHelper.init( "#inl" );
	dp = $( ".ui-datepicker-inline", inl );
	date = new Date();
	inl.datepicker( "setDate", date );
	$( ".ui-datepicker-calendar tbody a:contains(10)", dp ).simulate( "click", {} );
	date.setDate( 10 );
	testHelper.equalsDate( assert, inl.datepicker( "getDate" ), date, "Mouse click inline" );
	inl.datepicker( "option", { showButtonPanel: true } ).datepicker( "setDate", new Date( 2008, 2 - 1, 4 ) );
	$( ".ui-datepicker-calendar tbody a:contains(12)", dp ).simulate( "click", {} );
	testHelper.equalsDate( assert, inl.datepicker( "getDate" ), new Date( 2008, 2 - 1, 12 ), "Mouse click inline - preset" );
	inl.datepicker( "option", { showButtonPanel: true } );
	$( ".ui-datepicker-current", dp ).simulate( "click", {} );
	$( ".ui-datepicker-calendar tbody a:contains(14)", dp ).simulate( "click", {} );
	date.setDate( 14 );
	testHelper.equalsDate( assert, inl.datepicker( "getDate" ), date, "Mouse click inline - current" );
	inl.datepicker( "setDate", new Date( 2008, 2 - 1, 4 ) );
	$( ".ui-datepicker-prev", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(16)", dp ).simulate( "click" );
	testHelper.equalsDate( assert, inl.datepicker( "getDate" ), new Date( 2008, 1 - 1, 16 ),
		"Mouse click inline - previous" );
	inl.datepicker( "setDate", new Date( 2008, 2 - 1, 4 ) );
	$( ".ui-datepicker-next", dp ).simulate( "click" );
	$( ".ui-datepicker-calendar tbody a:contains(18)", dp ).simulate( "click" );
	testHelper.equalsDate( assert, inl.datepicker( "getDate" ), new Date( 2008, 3 - 1, 18 ),
		"Mouse click inline - next" );
} );

} );
