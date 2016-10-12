define( [
	"jquery",
	"ui/widgets/calendar"
], function( $ ) {

module( "calendar: methods", {
	setup: function() {
		this.element = $( "#calendar" ).calendar();
		this.widget = this.element.calendar( "widget" );
	},
	teardown: function() {
		this.element.calendar( "destroy" );
	}
} );

test( "destroy", function( assert ) {
	assert.expect( 1 );

	var div = $( "<div>" ).appendTo( "#qunit-fixture" );

	assert.domEqual( div, function() {
		div.calendar().calendar( "destroy" );
	} );
} );

test( "enable / disable", function( assert ) {
	assert.expect( 8 );

	this.element.calendar( "disable" );
	ok( this.element.calendar( "option", "disabled" ), "disabled option is set" );
	ok( this.element.hasClass( "ui-calendar-disabled" ), "has disabled widget class name" );
	ok( this.element.hasClass( "ui-state-disabled" ), "has disabled state class name" );
	equal( this.element.attr( "aria-disabled" ), "true", "has ARIA disabled" );

	this.element.calendar( "enable" );
	ok( !this.element.calendar( "option", "disabled" ), "enabled after enable() call" );
	ok( !this.element.hasClass( "ui-calendar-disabled" ), "no longer has disabled widget class name" );
	ok( !this.element.hasClass( "ui-state-disabled" ), "no longer has disabled state class name" );
	equal( this.element.attr( "aria-disabled" ), "false", "no longer has ARIA disabled" );
} );

test( "widget", function( assert ) {
	assert.expect( 1 );

	strictEqual( this.widget[ 0 ],  this.element[ 0 ] );
} );

test( "value", function( assert ) {
	assert.expect( 3 );

	this.element.calendar( "value", "1/1/14" );
	ok( this.element.find( "button[data-ui-calendar-timestamp]:first" )
			.hasClass( "ui-state-active" ),
		"first day marked as selected"
	);
	equal( this.element.calendar( "value" ), "1/1/14", "getter" );

	this.element.calendar( "value", "abc" );
	equal( this.element.calendar( "value" ), null, "Setting invalid values." );
} );

test( "valueAsDate", function( assert ) {
	assert.expect( 11 );

	var minDate, maxDate, dateAndTimeToSet, dateAndTimeClone,
		date1 = new Date( 2008, 6 - 1, 4 ),
		date2;

	this.element.calendar( "valueAsDate", new Date( 2014, 0, 1 ) );
	ok( this.element.find( "button[data-ui-calendar-timestamp]:first" )
			.hasClass( "ui-state-active" ),
		"First day marked as selected"
	);
	assert.dateEqual( this.element.calendar( "valueAsDate" ), new Date( 2014, 0, 1 ), "Getter" );

	this.element.calendar( "destroy" );
	this.element.calendar();
	equal( this.element.calendar( "valueAsDate" ), null, "Set date - default" );

	this.element.calendar( "valueAsDate", date1 );
	assert.dateEqual( this.element.calendar( "valueAsDate" ), date1, "Set date - 2008-06-04" );

	// With minimum / maximum
	date1 = new Date( 2008, 1 - 1, 4 );
	date2 = new Date( 2008, 6 - 1, 4 );
	minDate = new Date( 2008, 2 - 1, 29 );
	maxDate = new Date( 2008, 3 - 1, 28 );

	this.element
		.calendar( "option", { min: minDate } )
		.calendar( "valueAsDate", date2 );
	assert.dateEqual(
		this.element.calendar( "valueAsDate" ),
		date2, "Set date min/max - value > min"
	);

	this.element.calendar( "valueAsDate", date1 );
	equal(
		this.element.calendar( "valueAsDate" ),
		null,
		"Set date min/max - value < min"
	);

	this.element
		.calendar( "option", { max: maxDate, min: null } )
		.calendar( "valueAsDate", date1 );
	assert.dateEqual(
		this.element.calendar( "valueAsDate" ),
		date1,
		"Set date min/max - value < max"
	);

	this.element.calendar( "valueAsDate", date2 );
	equal(
		this.element.calendar( "valueAsDate" ),
		null,
		"Set date min/max - value > max"
	);

	this.element
		.calendar( "option", { min: minDate } )
		.calendar( "valueAsDate", date1 );
	equal(
		this.element.calendar( "valueAsDate" ),
		null,
		"Set date min/max - value < min"
	);

	this.element.calendar( "valueAsDate", date2 );
	equal(
		this.element.calendar( "valueAsDate" ),
		null, "Set date min/max - value > max"
	);

	dateAndTimeToSet = new Date( 2008, 3 - 1, 28, 1, 11, 0 );
	dateAndTimeClone = new Date( 2008, 3 - 1, 28, 1, 11, 0 );
	this.element.calendar( "valueAsDate", dateAndTimeToSet );
	equal(
		dateAndTimeToSet.getTime(),
		dateAndTimeClone.getTime(),
		"Date object passed should not be changed by valueAsDate"
	);
} );

} );
