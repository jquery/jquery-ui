define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/calendar"
], function( QUnit, $, testHelper ) {

QUnit.module( "calendar: core", {
	beforeEach: function() {
		this.element = $( "#calendar" ).calendar();
		this.widget = this.element.calendar( "widget" );
	},
	afterEach: function() {
		this.element.calendar( "destroy" );
	}
} );

QUnit.test( "base structure", function( assert ) {
	assert.expect( 28 );

	var that = this,
		buttons, header, title, table, thead, week, child, buttonpane;

	function step1() {
		assert.ok( !that.widget.is( ".ui-calendar-rtl" ), "Structure - not right-to-left" );
		assert.ok( !that.widget.is( ".ui-calendar-multi" ), "Structure - not multi-month" );
		assert.equal( that.widget.children().length, 3, "Structure - child count (header, calendar)" );

		buttons = that.widget.children( ":first" );
		assert.ok( buttons.is( "div.ui-calendar-header-buttons" ), "Structure - header button division" );
		assert.equal( buttons.children().length, 2, "Structure - header buttons child count" );
		assert.ok( buttons.children( ":first" ).is( ".ui-calendar-prev" ) && buttons.children( ":first" ).html() !== "", "Structure - prev link" );
		assert.ok( buttons.children( ":last" ).is( ".ui-calendar-next" ) && buttons.children( ":last" ).html() !== "", "Structure - next link" );

		header = that.widget.children( ":eq(1)" );
		assert.ok( header.is( "div.ui-calendar-header" ), "Structure - header division" );
		assert.equal( header.children().length, 1, "Structure - header child count" );

		title = header.children( ":last" ).children( ":first" );
		assert.ok( title.is( "div.ui-calendar-title" ) && title.html() !== "", "Structure - title division" );
		assert.equal( title.children().length, 2, "Structure - title child count" );
		assert.ok( title.children( ":first" ).is( "span.ui-calendar-month" ) && title.children( ":first" ).text() !== "", "Structure - month text" );
		assert.ok( title.children( ":last" ).is( "span.ui-calendar-year" ) && title.children( ":last" ).text() !== "", "Structure - year text" );

		table = that.widget.children( ":eq(2)" );
		assert.ok( table.is( "table.ui-calendar-calendar" ), "Structure - month table" );
		assert.ok( table.children( ":first" ).is( "thead" ), "Structure - month table thead" );

		thead = table.children( ":first" ).children( ":first" );
		assert.ok( thead.is( "tr" ), "Structure - month table title row" );
		assert.equal( thead.find( "th" ).length, 7, "Structure - month table title cells" );
		assert.ok( table.children( ":eq(1)" ).is( "tbody" ), "Structure - month table body" );
		assert.ok( table.children( ":eq(1)" ).children( "tr" ).length >= 4, "Structure - month table week count" );

		week = table.children( ":eq(1)" ).children( ":first" );
		assert.ok( week.is( "tr" ), "Structure - month table week row" );
		assert.equal( week.children().length, 7, "Structure - week child count" );

		step2();
	}

	function step2() {
		that.element.calendar( "option", "buttons", {
			"test": function() {},
			"test button": function() {}
		} );

		assert.equal( that.widget.children().length, 4, "Structure buttons - child count (header buttons, header, calendar, buttonpane)" );

		buttonpane = that.widget.children( ".ui-calendar-buttonpane" );
		assert.equal( buttonpane.children( "div.ui-calendar-buttonset" ).length, 1, "Structure buttons - buttonset" );
		assert.equal( buttonpane.find( "button.ui-button:first" ).text(), "test", "Structure buttons - buttonset" );
		assert.equal( buttonpane.find( "button.ui-button:eq(1)" ).text(), "test button", "Structure buttons - buttonset" );

		that.element.calendar( "destroy" );
		step3();
	}

	function step3() {

		// Multi-month 2
		that.element.calendar( { numberOfMonths: 2 } );

		assert.ok( that.widget.is( ".ui-calendar-multi" ), "Structure multi [2] - multi-month" );
		assert.equal( that.widget.children().length, 4, "Structure multi [2] - child count" );

		child = that.widget.children( ":eq(3)" );
		assert.ok( child.is( "div.ui-calendar-row-break" ), "Structure multi [2] - row break" );
	}

	step1();
} );

QUnit.test( "Localization", function( assert ) {
	assert.expect( 10 );

	var that = this,
		date = testHelper.createDate( 2014, 0, 1 ),
		optionsDe = {
			locale: "de",
			labels: {
				"nextText": "Vor",
				"prevText": "Zurück"
			}
		},
		initCalendar = function( options ) {
			that.element
				.calendar( options )
				.calendar( "valueAsDate", date );
		},
		testLocalization = function( message ) {
			assert.equal(
				that.element.find( ".ui-calendar-month" ).text(),
				"Januar", message + "titlebar year"
			);
			assert.equal(
				that.element.find( "thead th:first" ).text(),
				"Mo.", message + "teader first day"
			);
			assert.equal(
				that.element.find( "thead th:last" ).text(),
				"So.", message + "header last day"
			);
			assert.equal(
				that.element.find( ".ui-calendar-prev" ).text(),
				"Zurück", message + "header prev"
			);
			assert.equal(
				that.element.find( ".ui-calendar-next" ).text(),
				"Vor", message + "header next"
			);
		};

	initCalendar( optionsDe );
	testLocalization( "Init: " );
	that.element.calendar( "destroy" );

	initCalendar( {} );
	that.element
		.calendar( "option", optionsDe )
		.calendar( "refresh" );
	testLocalization( "After init: " );
} );

QUnit.test( "keyboard handling", function( assert ) {
	assert.expect( 10 );

	var ready = assert.async(),
		that = this;

	function step1() {
		that.element.calendar( { value: testHelper.createDate( 2014, 1 - 1, 1 ) } );

		testHelper
			.focusGrid( that.element )
			.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			assert.dateEqual(
				that.element.calendar( "valueAsDate" ),
				testHelper.createDate( 2013, 12 - 1, 31 ),
				"Keystroke left to switch to previous day"
			);
			that.element.calendar( "destroy" );
			step2();
		}, 50 );
	}

	function step2() {
		that.element.calendar( { value: testHelper.createDate( 2014, 1 - 1, 1 ) } );

		testHelper.focusGrid( that.element )
			.simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } )
			.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );

		assert.dateEqual(
			that.element.calendar( "valueAsDate" ),
			testHelper.createDate( 2014, 1 - 1, 2 ),
			"Keystroke right to switch to next day"
		);
		step3();
	}

	function step3() {
		that.element.calendar( { value: testHelper.createDate( 2014, 1 - 1, 1 ) } );

		testHelper.focusGrid( that.element ).simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			assert.dateEqual(
				that.element.calendar( "valueAsDate" ),
				testHelper.createDate( 2013, 12 - 1, 25 ),
				"Keystroke up to move to the previous week"
			);
			that.element.calendar( "destroy" );
			step4();
		}, 50 );
	}

	function step4() {
		that.element.calendar( { value: testHelper.createDate( 2014, 1 - 1, 1 ) } );

		testHelper.focusGrid( that.element ).simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			assert.dateEqual(
				that.element.calendar( "valueAsDate" ),
				testHelper.createDate( 2014, 1 - 1, 8 ),
				"Keystroke down to move to the next week"
			);
			that.element.calendar( "destroy" );
			step5();
		}, 50 );
	}

	function step5() {
		that.element.calendar( { value: testHelper.createDate( 2014, 1 - 1, 1 ) } );

		testHelper.focusGrid( that.element ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			assert.dateEqual(
				that.element.calendar( "valueAsDate" ),
				testHelper.createDate( 2013, 12 - 1, 1 ),
				"Keystroke Page Up moves date to previous month"
			);
			that.element.calendar( "destroy" );
			step6();
		}, 50 );
	}

	function step6() {
		that.element.calendar( { value: testHelper.createDate( 2014, 1 - 1, 1 ) } );

		testHelper.focusGrid( that.element )
			.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP, altKey: true } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			assert.dateEqual(
				that.element.calendar( "valueAsDate" ),
				testHelper.createDate( 2013, 1 - 1, 1 ),
				"Keystroke Page Up + ALT moves date to previous year"
			);
			that.element.calendar( "destroy" );
			step7();
		}, 50 );
	}

	function step7() {
		that.element.calendar( { value: testHelper.createDate( 2014, 1 - 1, 1 ) } );

		testHelper.focusGrid( that.element ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			assert.dateEqual(
				that.element.calendar( "valueAsDate" ),
				testHelper.createDate( 2014, 2 - 1, 1 ),
				"Keystroke Page Down moves date to next month"
			);
			that.element.calendar( "destroy" );
			step8();
		}, 50 );
	}

	function step8() {
		that.element.calendar( { value: testHelper.createDate( 2014, 1 - 1, 1 ) } );

		testHelper.focusGrid( that.element )
			.simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN, altKey: true } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			assert.dateEqual(
				that.element.calendar( "valueAsDate" ),
				testHelper.createDate( 2015, 1 - 1, 1 ),
				"Keystroke Page Down + ALT moves date to next year"
			);
			that.element.calendar( "destroy" );
			step9();
		}, 50 );
	}

	// Check for moving to short months
	function step9() {
		that.element.calendar( { value: testHelper.createDate( 2014, 3 - 1, 31 ) } );

		testHelper.focusGrid( that.element ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			assert.dateEqual(
				that.element.calendar( "valueAsDate" ),
				testHelper.createDate( 2014, 2 - 1, 28 ),
				"Keystroke Page Up and short months"
			);
			that.element.calendar( "destroy" );
			step10();
		}, 50 );
	}

	function step10() {
		that.element.calendar( { value: testHelper.createDate( 2016, 1 - 1, 30 ) } );

		testHelper.focusGrid( that.element ).simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		setTimeout( function() {
			$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } );
			assert.dateEqual(
				that.element.calendar( "valueAsDate" ),
				testHelper.createDate( 2016, 2 - 1, 29 ),
				"Keystroke Page Down and leap years"
			);
			ready();
		}, 50 );
	}

	step1();
} );

QUnit.test( "mouse", function( assert ) {
	assert.expect( 6 );

	var ready = assert.async(),
		that = this,
		date = testHelper.createDate();

	function step1() {
		$( "tbody button:contains(10)", that.element ).simulate( "mousedown" );
		date.setDate( 10 );
		assert.dateEqual(
			that.element.calendar( "valueAsDate" ),
			date,
			"Mouse click"
		);

		that.element.calendar( "option", "value", testHelper.createDate( 2008, 2 - 1, 4 ) );
		$( ".ui-calendar-calendar tbody button:contains(12)", that.element ).simulate( "mousedown" );
		assert.dateEqual(
			that.element.calendar( "valueAsDate" ),
			testHelper.createDate( 2008, 2 - 1, 12 ),
			"Mouse click - preset"
		);

		// Previous/next
		that.element.calendar( "option", "value", testHelper.createDate( 2008, 2 - 1, 4 ) );
		$( ".ui-calendar-prev", that.element ).simulate( "click" );
		$( ".ui-calendar-calendar tbody button:contains(16)", that.element ).simulate( "mousedown" );
		assert.dateEqual(
			that.element.calendar( "valueAsDate" ),
			testHelper.createDate( 2008, 1 - 1, 16 ),
			"Mouse click - previous"
		);

		that.element.calendar( "option", "value", testHelper.createDate( 2008, 2 - 1, 4 ) );
		$( ".ui-calendar-next", that.element ).simulate( "click" );
		$( ".ui-calendar-calendar tbody button:contains(18)", that.element ).simulate( "mousedown" );
		assert.dateEqual(
			that.element.calendar( "valueAsDate" ),
			testHelper.createDate( 2008, 3 - 1, 18 ),
			"Mouse click - next"
		);

		step2();
	}

	// Previous/next with minimum/maximum
	function step2() {
		that.element.calendar( "destroy" );
		that.element.calendar( {
			value: testHelper.createDate( 2008, 3 - 1, 4 ),
			min: testHelper.createDate( 2008, 2 - 1, 2 ),
			max: testHelper.createDate( 2008, 2 - 1, 26 )
		} );

		$( ".ui-calendar-prev", that.element ).simulate( "click" );
		$( "tbody button:contains(16)", that.element ).simulate( "mousedown" );
		assert.dateEqual(
			that.element.calendar( "valueAsDate" ),
			testHelper.createDate( 2008, 2 - 1, 16 ),
			"Mouse click - previous + min/max"
		);
		step3();
	}

	function step3() {
		that.element.calendar( "destroy" );
		that.element.calendar( {
			value: testHelper.createDate( 2008, 1 - 1, 4 ),
			min: testHelper.createDate( 2008, 2 - 1, 2 ),
			max: testHelper.createDate( 2008, 2 - 1, 26 )
		} );

		$( ".ui-calendar-next", that.element ).simulate( "click" );
		$( "tbody button:contains(18)", that.element ).simulate( "mousedown" );
		assert.dateEqual(
			that.element.calendar( "valueAsDate" ),
			testHelper.createDate( 2008, 2 - 1, 18 ),
			"Mouse click - next + min/max"
		);
		ready();
	}

	step1();
} );

QUnit.test( "ARIA", function( assert ) {
	assert.expect( 12 );

	var id = this.element.attr( "id" ),
		headerId = id + "-title",
		monthLabelId = id + "-month-label",
		table = this.element.find( "table" );

	assert.equal( this.element.attr( "role" ), "region", "Role attribute" );
	assert.equal( this.element.attr( "aria-labelledby" ), headerId,
		"ARIA label attribute" );

	assert.equal( this.element.find( "#" + headerId ).attr( "role" ), "header",
		"Header role attribute" );
	assert.equal( this.element.find( "#" + monthLabelId ).attr( "role" ), "alert",
		"Header month label role attribute" );

	assert.equal( table.attr( "role" ), "grid", "Table role attribute" );
	assert.equal( table.attr( "aria-readonly" ), "true",
		"Table ARIA readonly attribute" );
	assert.equal( table.attr( "aria-labelledby" ), monthLabelId,
		"Table ARIA labelledby attribute" );
	assert.equal( table.attr( "tabindex" ), 0, "Table tabindex attribute" );

	assert.equal( table.children( "thead" ).attr( "role" ), "presentation",
		"Table head role attribute" );
	assert.equal( table.find( "thead th" ).first().attr( "role" ), "columnheader",
		"Table head cell role attribute" );

	assert.equal( table.children( "tbody" ).attr( "role" ), "presentation",
		"Table body role attribute" );
	assert.equal( table.find( "tbody td" ).first().attr( "aria-describedby" ),
		monthLabelId, "Table body cell ARIA describedby attribute" );
} );

} );
