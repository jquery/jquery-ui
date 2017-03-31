define( [
	"qunit",
	"jquery",
	"ui/widgets/calendar"
], function( QUnit, $ ) {

QUnit.module( "calendar: options", {
	beforeEach: function() {
		this.element = $( "#calendar" ).calendar();
		this.widget = this.element.calendar( "widget" );
	},
	afterEach: function() {
		this.element.calendar( "destroy" );
	}
} );

QUnit.test( "buttons", function( assert ) {
	assert.expect( 21 );

	var button, i, newButtons,
		that = this,
		buttons = {
			"Ok": function( event ) {
				assert.ok( true, "button click fires callback" );
				assert.equal( this, that.element[ 0 ], "context of callback" );
				assert.equal( event.target, button[ 0 ], "event target" );
			},
			"Cancel": function( event ) {
				assert.ok( true, "button click fires callback" );
				assert.equal( this, that.element[ 0 ], "context of callback" );
				assert.equal( event.target, button[ 1 ], "event target" );
			}
		};

	this.element.calendar( { buttons: buttons } );
	button = this.widget.find( ".ui-calendar-buttonpane button" );
	assert.equal( button.length, 2, "number of buttons" );

	i = 0;
	$.each( buttons, function( key ) {
		assert.equal( button.eq( i ).text(), key, "text of button " + ( i + 1 ) );
		i++;
	} );

	assert.ok( button.parent().hasClass( "ui-calendar-buttonset" ), "buttons in container" );
	assert.ok(
		this.element.calendar( "widget" ).hasClass( "ui-calendar-buttons" ),
		"calendar wrapper adds class about having buttons"
	);

	button.trigger( "click" );

	newButtons = {
		"Close": function( event ) {
			assert.ok( true, "button click fires callback" );
			assert.equal( this, that.element[ 0 ], "context of callback" );
			assert.equal( event.target, button[ 0 ], "event target" );
		}
	};

	assert.deepEqual(
		this.element.calendar( "option", "buttons" ),
		buttons,
		".calendar('option', 'buttons') getter"
	);
	this.element.calendar( "option", "buttons", newButtons );
	assert.deepEqual(
		this.element.calendar( "option", "buttons" ),
		newButtons,
		".calendar('option', 'buttons', ...) setter"
	);

	button = this.element.calendar( "widget" ).find( ".ui-calendar-buttonpane button" );
	assert.equal( button.length, 1, "number of buttons after setter" );
	button.trigger( "click" );

	i = 0;
	$.each( newButtons, function( key ) {
		assert.equal( button.eq( i ).text(), key, "text of button " + ( i + 1 ) );
		i += 1;
	} );

	this.element.calendar( "option", "buttons", null );
	button = this.widget.find( ".ui-calendar-buttonpane button" );
	assert.equal( button.length, 0, "all buttons have been removed" );
	assert.equal( this.element.find( ".ui-calendar-buttonset" ).length, 0, "buttonset has been removed" );
	assert.equal( this.element.hasClass( "ui-calendar-buttons" ), false, "calendar element removes class about having buttons" );
} );

QUnit.test( "buttons - advanced", function( assert ) {
	assert.expect( 7 );

	var that = this,
		buttons;

	this.element.calendar( {
		buttons: [ {
			text: "a button",
			"class": "additional-class",
			id: "my-button-id",
			click: function() {
				assert.equal( this, that.element[ 0 ], "correct context" );
			},
			icon: "ui-icon-cancel",
			showLabel: false
		} ]
	} );

	buttons = this.widget.find( ".ui-calendar-buttonpane button" );
	assert.equal( buttons.length, 1, "correct number of buttons" );
	assert.equal( buttons.attr( "id" ), "my-button-id", "correct id" );
	assert.equal( $.trim( buttons.text() ), "a button", "correct label" );
	assert.ok( buttons.hasClass( "additional-class" ), "additional classes added" );
	assert.equal( buttons.button( "option", "icon" ), "ui-icon-cancel" );
	assert.equal( buttons.button( "option", "showLabel" ), false );
	buttons.click();
} );

QUnit.test( "dateFormat", function( assert ) {
	assert.expect( 2 );

	this.element.calendar( "value", "1/1/14" );

	this.widget.find( "td[id]:first button" ).trigger( "mousedown" );
	assert.equal( this.element.calendar( "value" ), "1/1/14", "default formatting" );

	this.element.calendar( "option", "dateFormat", { date: "full" } );
	assert.equal( this.element.calendar( "value" ), "Wednesday, January 1, 2014", "updated formatting" );
} );

QUnit.test( "eachDay", function( assert ) {
	assert.expect( 5 );

	var timestamp,
		firstCell = this.widget.find( "td[id]:first" );

	assert.equal( firstCell.find( "button" ).length, 1, "days are selectable by default" );
	timestamp = parseInt( firstCell.find( "button" ).attr( "data-ui-calendar-timestamp" ), 10 );
	assert.equal( new Date( timestamp ).getDate(), 1, "first available day is the 1st by default" );

	// Do not render the 1st of the month
	this.element.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.render = false;
		}
	} );
	firstCell = this.widget.find( "td[id]:first" );
	timestamp = parseInt( firstCell.find( "button" ).attr( "data-ui-calendar-timestamp" ), 10 );
	assert.equal( new Date( timestamp ).getDate(), 2, "first available day is the 2nd" );

	// Display the 1st of the month but make it not selectable.
	this.element.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.selectable = false;
		}
	} );
	firstCell = this.widget.find( "td[id]:first" );
	assert.ok( firstCell.find( "button" ).prop( "disabled" ), "the 1st is not selectable" );

	this.element.calendar( "option", "eachDay", function( day ) {
		if ( day.date === 1 ) {
			day.extraClasses = "ui-custom";
		}
	} );
	assert.ok( this.widget.find( "td[id]:first button" ).hasClass( "ui-custom" ), "extraClasses applied" );
} );

QUnit.test( "showWeek", function( assert ) {
	assert.expect( 7 );

	assert.equal( this.widget.find( "thead th" ).length, 7, "just 7 days, no column cell" );
	assert.equal( this.widget.find( ".ui-calendar-week-col" ).length, 0,
		"no week column cells present" );
	this.element.calendar( "destroy" );

	this.element.calendar( { showWeek: true } );
	assert.equal( this.widget.find( "thead th" ).length, 8, "7 days + a column cell" );
	assert.ok( this.widget.find( "thead th:first" ).is( ".ui-calendar-week-col" ),
		"first cell should have ui-datepicker-week-col class name" );
	assert.equal( this.widget.find( ".ui-calendar-week-col" ).length,
		this.widget.find( "tr" ).length, "one week cell for each week" );
	this.element.calendar( "destroy" );

	this.element.calendar();
	assert.equal( this.widget.find( "thead th" ).length, 7, "no week column" );
	this.element.calendar( "option", "showWeek", true );
	assert.equal( this.widget.find( "thead th" ).length, 8, "supports changing option after init" );
} );

QUnit.test( "min / max", function( assert ) {
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
	assert.equal( this.element.calendar( "valueAsDate" ), null, "Min/max - value < min" );

	this.element
		.calendar( "option", { min: null } )
		.calendar( "value", "6/4/08" )
		.calendar( "option", { max: maxDate } );
	assert.dateEqual( this.element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value < max" );

	this.element
		.calendar( "option", { max: maxDate } )
		.calendar( "value", "1/4/09" );
	assert.equal( this.element.calendar( "valueAsDate" ), null, "Min/max - setDate > max" );

	this.element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "1/4/08" );
	assert.equal( this.element.calendar( "valueAsDate" ), null, "Min/max - value < min" );

	this.element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "6/4/08" );
	assert.dateEqual( this.element.calendar( "valueAsDate" ), new Date( 2008, 6 - 1, 4 ), "Min/max - value > min, < max" );

	this.element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "1/4/09" );
	assert.equal( this.element.calendar( "valueAsDate" ), null, "Min/max - value > max" );

	this.element.calendar( "option", { min: minDate } );
	this.element.calendar( "option", { min: "invalid" } );
	assert.equal( this.element.calendar( "option", "min" ), null, "Min/max - invalid" );

	this.element.calendar( "option", { min: maxDate } );
	this.element.calendar( "option", { max: null } );
	assert.equal( this.element.calendar( "option", "max" ), null, "Min/max - null" );

	this.element
		.calendar( "option", { min: minDate, max: maxDate } )
		.calendar( "value", "3/4/08" );
	assert.ok( !prevButton.hasClass( "ui-state-disabled" ), "Prev button enabled" );
	prevButton.simulate( "click" );
	assert.ok( prevButton.hasClass( "ui-state-disabled" ), "Prev button disabled" );

	this.element.calendar( "value", "11/4/08" );
	assert.ok( !nextButton.hasClass( "ui-state-disabled" ), "Next button enabled" );
	nextButton.simulate( "click" );
	assert.ok( nextButton.hasClass( "ui-state-disabled" ), "Next button disabled" );

	this.element
		.calendar( "option", { max: null } )
		.calendar( "value", "1/4/09" )
		.calendar( "option", { min: minDate, max: maxDate } );
	assert.ok( nextButton.hasClass( "ui-state-disabled" ), "Other year above max: Next button disabled" );
	prevButton.simulate( "click" );
	assert.ok( nextButton.hasClass( "ui-state-disabled" ), "Other year above max: Next button disabled after click" );
	prevButton.simulate( "click" );
	assert.ok( !nextButton.hasClass( "ui-state-disabled" ), "Other year above max: Next button enabled after click" );

	this.element
		.calendar( "option", { min: null } )
		.calendar( "value", "1/4/08" )
		.calendar( "option", { min: minDate, max: maxDate } );
	assert.ok( prevButton.hasClass( "ui-state-disabled" ), "Other year below min: Prev button disabled" );
	nextButton.simulate( "click" );
	assert.ok( prevButton.hasClass( "ui-state-disabled" ), "Other year below min: Prev button disabled after click" );
	nextButton.simulate( "click" );
	assert.ok( !prevButton.hasClass( "ui-state-disabled" ), "Other year below min: Prev button enabled after click" );
} );

QUnit.test( "numberOfMonths", function( assert ) {
	assert.expect( 6 );

	var date = new Date( 2015, 8 - 1, 1 );

	this.element.calendar( "option", {
		numberOfMonths: 3,
		value: date
	} );

	assert.equal( this.widget.find( ".ui-calendar-group" ).length, 3, "3 calendar grids" );
	assert.equal(
		this.widget.find( "tbody:first td[id]:first" ).attr( "id" ),
		"calendar-2015-7-1",
		"Correct id set for first day of first grid"
	);
	assert.equal(
		this.widget.find( "tbody:last td[id]:last" ).attr( "id" ),
		"calendar-2015-9-31",
		"Correct id set for last day of third grid"
	);

	// Test for jumping in weekday rendering after click on last day of last grid
	this.widget.find( "tbody:last td[id]:last button" ).trigger( "mousedown" );
	assert.equal( this.widget.find( "thead:last th:last" ).text(), "Sa",
		"After mousedown last month: Last day is Saturday"
	);

	this.widget.find( "button.ui-calendar-prev" ).simulate( "click" );
	assert.equal( this.widget.find( ".ui-calendar-month:first" ).text(), "May",
		"After move to previous month: First month is May"
	);

	this.widget.find( "tbody:last td[id]:last button" ).trigger( "mousedown" );
	$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	assert.equal( this.widget.find( ".ui-calendar-month:last" ).text(), "October",
		"After move to next month: Last month is October"
	);
} );

QUnit.test( "value", function( assert ) {
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
	assert.equal( this.element.calendar( "option", "value" ), null, "Value after invalid parameter" );
} );

} );
