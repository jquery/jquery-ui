define( [
	"jquery",
	"ui/widgets/calendar"
], function( $ ) {

module( "calendar: options", {
	setup: function() {
		this.element = $( "#calendar" ).calendar();
		this.widget = this.element.calendar( "widget" );
	},
	teardown: function() {
		this.element.calendar( "destroy" );
	}
} );

test( "buttons", function( assert ) {
	assert.expect( 21 );

	var button, i, newButtons,
		that = this,
		buttons = {
			"Ok": function( event ) {
				ok( true, "button click fires callback" );
				equal( this, that.element[ 0 ], "context of callback" );
				equal( event.target, button[ 0 ], "event target" );
			},
			"Cancel": function( event ) {
				ok( true, "button click fires callback" );
				equal( this, that.element[ 0 ], "context of callback" );
				equal( event.target, button[ 1 ], "event target" );
			}
		};

	this.element.calendar( { buttons: buttons } );
	button = this.widget.find( ".ui-calendar-buttonpane button" );
	equal( button.length, 2, "number of buttons" );

	i = 0;
	$.each( buttons, function( key ) {
		equal( button.eq( i ).text(), key, "text of button " + ( i + 1 ) );
		i++;
	} );

	ok( button.parent().hasClass( "ui-calendar-buttonset" ), "buttons in container" );
	ok(
		this.element.calendar( "widget" ).hasClass( "ui-calendar-buttons" ),
		"calendar wrapper adds class about having buttons"
	);

	button.trigger( "click" );

	newButtons = {
		"Close": function( event ) {
			ok( true, "button click fires callback" );
			equal( this, that.element[ 0 ], "context of callback" );
			equal( event.target, button[ 0 ], "event target" );
		}
	};

	deepEqual(
		this.element.calendar( "option", "buttons" ),
		buttons,
		".calendar('option', 'buttons') getter"
	);
	this.element.calendar( "option", "buttons", newButtons );
	deepEqual(
		this.element.calendar( "option", "buttons" ),
		newButtons,
		".calendar('option', 'buttons', ...) setter"
	);

	button = this.element.calendar( "widget" ).find( ".ui-calendar-buttonpane button" );
	equal( button.length, 1, "number of buttons after setter" );
	button.trigger( "click" );

	i = 0;
	$.each( newButtons, function( key ) {
		equal( button.eq( i ).text(), key, "text of button " + ( i + 1 ) );
		i += 1;
	} );

	this.element.calendar( "option", "buttons", null );
	button = this.widget.find( ".ui-calendar-buttonpane button" );
	equal( button.length, 0, "all buttons have been removed" );
	equal( this.element.find( ".ui-calendar-buttonset" ).length, 0, "buttonset has been removed" );
	equal( this.element.hasClass( "ui-calendar-buttons" ), false, "calendar element removes class about having buttons" );
} );

test( "buttons - advanced", function( assert ) {
	assert.expect( 7 );

	var that = this,
		buttons;

	this.element.calendar( {
		buttons: [ {
			text: "a button",
			"class": "additional-class",
			id: "my-button-id",
			click: function() {
				equal( this, that.element[ 0 ], "correct context" );
			},
			icon: "ui-icon-cancel",
			showLabel: false
		} ]
	} );

	buttons = this.widget.find( ".ui-calendar-buttonpane button" );
	equal( buttons.length, 1, "correct number of buttons" );
	equal( buttons.attr( "id" ), "my-button-id", "correct id" );
	equal ( $.trim( buttons.text() ), "a button", "correct label" );
	ok( buttons.hasClass( "additional-class" ), "additional classes added" );
	equal( buttons.button( "option", "icon" ), "ui-icon-cancel" );
	equal( buttons.button( "option", "showLabel" ), false );
	buttons.click();
} );

test( "dateFormat", function( assert ) {
	assert.expect( 2 );

	this.element.calendar( "value", "1/1/14" );

	this.widget.find( "td[id]:first button" ).trigger( "mousedown" );
	equal( this.element.calendar( "value" ), "1/1/14", "default formatting" );

	this.element.calendar( "option", "dateFormat", { date: "full" } );
	equal( this.element.calendar( "value" ), "Wednesday, January 1, 2014", "updated formatting" );
} );

test( "eachDay", function( assert ) {
	assert.expect( 5 );

	var timestamp,
		firstCell = this.widget.find( "td[id]:first" );

	equal( firstCell.find( "button" ).length, 1, "days are selectable by default" );
	timestamp = parseInt( firstCell.find( "button" ).attr( "data-ui-calendar-timestamp" ), 10 );
	equal( new Date( timestamp ).getDate(), 1, "first available day is the 1st by default" );

	// Do not render the 1st of the month
	this.element.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.render = false;
		}
	} );
	firstCell = this.widget.find( "td[id]:first" );
	timestamp = parseInt( firstCell.find( "button" ).attr( "data-ui-calendar-timestamp" ), 10 );
	equal( new Date( timestamp ).getDate(), 2, "first available day is the 2nd" );

	// Display the 1st of the month but make it not selectable.
	this.element.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.selectable = false;
		}
	} );
	firstCell = this.widget.find( "td[id]:first" );
	ok( firstCell.find( "button" ).prop( "disabled" ), "the 1st is not selectable" );

	this.element.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.extraClasses = "ui-custom";
		}
	} );
	ok( this.widget.find( "td[id]:first button" ).hasClass( "ui-custom" ), "extraClasses applied" );
} );

test( "showWeek", function() {
	expect( 7 );

	equal( this.widget.find( "thead th" ).length, 7, "just 7 days, no column cell" );
	equal( this.widget.find( ".ui-calendar-week-col" ).length, 0,
		"no week column cells present" );
	this.element.calendar( "destroy" );

	this.element.calendar( { showWeek: true } );
	equal( this.widget.find( "thead th" ).length, 8, "7 days + a column cell" );
	ok( this.widget.find( "thead th:first" ).is( ".ui-calendar-week-col" ),
		"first cell should have ui-datepicker-week-col class name" );
	equal( this.widget.find( ".ui-calendar-week-col" ).length,
		this.widget.find( "tr" ).length, "one week cell for each week" );
	this.element.calendar( "destroy" );

	this.element.calendar();
	equal( this.widget.find( "thead th" ).length, 7, "no week column" );
	this.element.calendar( "option", "showWeek", true );
	equal( this.widget.find( "thead th" ).length, 8, "supports changing option after init" );
} );

test( "min / max", function( assert ) {
	assert.expect( 19 );

	// With existing date
	var prevButton = this.widget.find( ".ui-calendar-prev" ),
		nextButton = this.widget.find( ".ui-calendar-next" ),
		minDate = new Date( 2008, 2 - 1, 29 ),
		maxDate = new Date( 2008, 12 - 1, 7 );

	this.element
		.calendar( "option", { min: minDate } )
		.calendar( "value", "6/4/08" );
	assert.dateEqual( this.element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value > min" );

	this.element
		.calendar( "option", { min: minDate } )
		.calendar( "value", "1/4/08" );
	equal( this.element.calendar( "valueAsDate" ), null, "Min/max - value < min" );

	this.element
		.calendar( "option", { min: null } )
		.calendar( "value", "6/4/08" )
		.calendar( "option", { max: maxDate } );
	assert.dateEqual( this.element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value < max" );

	this.element
		.calendar( "option", { max: maxDate } )
		.calendar( "value", "1/4/09" );
	equal( this.element.calendar( "valueAsDate" ), null, "Min/max - setDate > max" );

	this.element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "1/4/08" );
	equal( this.element.calendar( "valueAsDate" ), null, "Min/max - value < min" );

	this.element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "6/4/08" );
	assert.dateEqual( this.element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value > min, < max" );

	this.element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "1/4/09" );
	equal( this.element.calendar( "valueAsDate" ), null, "Min/max - value > max" );

	this.element.calendar( "option", { min: minDate } );
	this.element.calendar( "option", { min: "invalid" } );
	equal( this.element.calendar( "option", "min" ), null, "Min/max - invalid" );

	this.element.calendar( "option", { min: maxDate } );
	this.element.calendar( "option", { max: null } );
	equal( this.element.calendar( "option", "max" ), null, "Min/max - null" );

	this.element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "3/4/08" );
	ok( !prevButton.hasClass( "ui-state-disabled" ), "Prev button enabled" );
	prevButton.simulate( "click" );
	ok( prevButton.hasClass( "ui-state-disabled" ), "Prev button disabled" );

	this.element.calendar( "value", "11/4/08" );
	ok( !nextButton.hasClass( "ui-state-disabled" ), "Next button enabled" );
	nextButton.simulate( "click" );
	ok( nextButton.hasClass( "ui-state-disabled" ), "Next button disabled" );

	this.element
		.calendar( "option", { max: null } )
		.calendar( "value", "1/4/09" )
		.calendar( "option", { min: minDate, max: maxDate } );
	ok( nextButton.hasClass( "ui-state-disabled" ), "Other year above max: Next button disabled" );
	prevButton.simulate( "click" );
	ok( nextButton.hasClass( "ui-state-disabled" ), "Other year above max: Next button disabled after click" );
	prevButton.simulate( "click" );
	ok( !nextButton.hasClass( "ui-state-disabled" ), "Other year above max: Next button enabled after click" );

	this.element
		.calendar( "option", { min: null } )
		.calendar( "value", "1/4/08" )
		.calendar( "option", { min: minDate, max: maxDate } );
	ok( prevButton.hasClass( "ui-state-disabled" ), "Other year below min: Prev button disabled" );
	nextButton.simulate( "click" );
	ok( prevButton.hasClass( "ui-state-disabled" ), "Other year below min: Prev button disabled after click" );
	nextButton.simulate( "click" );
	ok( !prevButton.hasClass( "ui-state-disabled" ), "Other year below min: Prev button enabled after click" );
} );

test( "numberOfMonths", function( assert ) {
	assert.expect( 6 );

	var date = new Date( 2015, 8 - 1, 1 );

	// Number of month option does not work after init
	this.element
		.calendar( "destroy" )
		.calendar( {
			numberOfMonths: 3,
			value: date
		} );

	equal( this.widget.find( ".ui-calendar-group" ).length, 3, "3 calendar grids" );
	equal(
		this.widget.find( "tbody:first td[id]:first" ).attr( "id" ),
		"calendar-2015-7-1",
		"Correct id set for first day of first grid"
	);
	equal(
		this.widget.find( "tbody:last td[id]:last" ).attr( "id" ),
		"calendar-2015-9-31",
		"Correct id set for last day of third grid"
	);

	// Test for jumping in weekday rendering after click on last day of last grid
	this.widget.find( "tbody:last td[id]:last button" ).trigger( "mousedown" );
	equal( this.widget.find( "thead:last th:last" ).text(), "Sa",
		"After mousedown last month: Last day is Saturday"
	);

	// Test if using cursor to go to the next / prev month advances three month
	// Focus doesn't work here so we use an additional mouse down event
	this.widget.find( "tbody:first td[id]:first button" ).trigger( "mousedown" );
	$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equal( this.widget.find( ".ui-calendar-month:first" ).text(), "May",
		"After move to previous month: First month is May"
	);

	this.widget.find( "tbody:last td[id]:last button" ).trigger( "mousedown" );
	$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equal( this.widget.find( ".ui-calendar-month:last" ).text(), "October",
		"After move to next month: Last month is October"
	);
} );

test( "value", function( assert ) {
	assert.expect( 4 );

	var date = new Date( 2016, 5 - 1, 23 );

	assert.equal( this.element.calendar( "option", "value" ), null, "Initial value" );

	this.element.calendar( "option", "value", date );
	assert.dateEqual( this.element.calendar( "option", "value" ), date, "Value set" );
	assert.dateEqual(
		new Date( this.widget.find( "table button.ui-state-active" ).data( "ui-calendar-timestamp" ) ),
		new Date( 1463972400000 ),
		"Active button timestamp"
	);

	this.element.calendar( "option", "value", "invalid" );
	equal( this.element.calendar( "option", "value" ), null, "Value after invalid parameter" );
} );

/*
// TODO: Move this to $.date, Globalize or calendar widget
test( "daylightSaving", function() {
	 expect( 25 );
	 var inp = testHelper.init( "#inp" ),
	 dp = $( "#ui-datepicker-div" );
	 ok(true, "Daylight saving - " + new Date());
	 // Australia, Sydney - AM change, southern hemisphere
	 inp.val( "04/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	 equal(inp.val(), "04/05/2008", "Daylight saving - Australia 04/05/2008" );
	 inp.val( "04/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	 equal(inp.val(), "04/06/2008", "Daylight saving - Australia 04/06/2008" );
	 inp.val( "04/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	 equal(inp.val(), "04/07/2008", "Daylight saving - Australia 04/07/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	 equal(inp.val(), "10/04/2008", "Daylight saving - Australia 10/04/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	 equal(inp.val(), "10/05/2008", "Daylight saving - Australia 10/05/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	 equal(inp.val(), "10/06/2008", "Daylight saving - Australia 10/06/2008" );
	 // Brasil, Brasilia - midnight change, southern hemisphere
	 inp.val( "02/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(20) a", dp).simulate( "click" );
	 equal(inp.val(), "02/16/2008", "Daylight saving - Brasil 02/16/2008" );
	 inp.val( "02/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(21) a", dp).simulate( "click" );
	 equal(inp.val(), "02/17/2008", "Daylight saving - Brasil 02/17/2008" );
	 inp.val( "02/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(22) a", dp).simulate( "click" );
	 equal(inp.val(), "02/18/2008", "Daylight saving - Brasil 02/18/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(13) a", dp).simulate( "click" );
	 equal(inp.val(), "10/11/2008", "Daylight saving - Brasil 10/11/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(14) a", dp).simulate( "click" );
	 equal(inp.val(), "10/12/2008", "Daylight saving - Brasil 10/12/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(15) a", dp).simulate( "click" );
	 equal(inp.val(), "10/13/2008", "Daylight saving - Brasil 10/13/2008" );
	 // Lebanon, Beirut - midnight change, northern hemisphere
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(34) a", dp).simulate( "click" );
	 equal(inp.val(), "03/29/2008", "Daylight saving - Lebanon 03/29/2008" );
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(35) a", dp).simulate( "click" );
	 equal(inp.val(), "03/30/2008", "Daylight saving - Lebanon 03/30/2008" );
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(36) a", dp).simulate( "click" );
	 equal(inp.val(), "03/31/2008", "Daylight saving - Lebanon 03/31/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(27) a", dp).simulate( "click" );
	 equal(inp.val(), "10/25/2008", "Daylight saving - Lebanon 10/25/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(28) a", dp).simulate( "click" );
	 equal(inp.val(), "10/26/2008", "Daylight saving - Lebanon 10/26/2008" );
	 inp.val( "10/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(29) a", dp).simulate( "click" );
	 equal(inp.val(), "10/27/2008", "Daylight saving - Lebanon 10/27/2008" );
	 // US, Eastern - AM change, northern hemisphere
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(13) a", dp).simulate( "click" );
	 equal(inp.val(), "03/08/2008", "Daylight saving - US 03/08/2008" );
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(14) a", dp).simulate( "click" );
	 equal(inp.val(), "03/09/2008", "Daylight saving - US 03/09/2008" );
	 inp.val( "03/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(15) a", dp).simulate( "click" );
	 equal(inp.val(), "03/10/2008", "Daylight saving - US 03/10/2008" );
	 inp.val( "11/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(6) a", dp).simulate( "click" );
	 equal(inp.val(), "11/01/2008", "Daylight saving - US 11/01/2008" );
	 inp.val( "11/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(7) a", dp).simulate( "click" );
	 equal(inp.val(), "11/02/2008", "Daylight saving - US 11/02/2008" );
	 inp.val( "11/01/2008" ).calendar( "show" );
	 $( ".ui-calendar-calendar td:eq(8) a", dp).simulate( "click" );
	 equal(inp.val(), "11/03/2008", "Daylight saving - US 11/03/2008" );
 });
 */

} );
