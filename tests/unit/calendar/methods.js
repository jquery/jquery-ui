define( [
	"qunit",
	"jquery",
	"ui/widgets/calendar"
], function( QUnit, $ ) {

QUnit.module( "calendar: methods", {
	beforeEach: function() {
		this.element = $( "#calendar" ).calendar();
		this.widget = this.element.calendar( "widget" );
	},
	afterEach: function() {
		this.element.calendar( "destroy" );
	}
} );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 1 );

	var div = $( "<div>" ).appendTo( "#qunit-fixture" );

	assert.domEqual( div, function() {
		div.calendar().calendar( "destroy" );
	} );
} );

QUnit.test( "enable / disable", function( assert ) {
	assert.expect( 8 );

	this.element.calendar( "disable" );
	assert.ok( this.element.calendar( "option", "disabled" ), "disabled option is set" );
	assert.ok( this.element.hasClass( "ui-calendar-disabled" ), "has disabled widget class name" );
	assert.ok( this.element.hasClass( "ui-state-disabled" ), "has disabled state class name" );
	assert.equal( this.element.attr( "aria-disabled" ), "true", "has ARIA disabled" );

	this.element.calendar( "enable" );
	assert.ok( !this.element.calendar( "option", "disabled" ), "enabled after enable() call" );
	assert.ok( !this.element.hasClass( "ui-calendar-disabled" ), "no longer has disabled widget class name" );
	assert.ok( !this.element.hasClass( "ui-state-disabled" ), "no longer has disabled state class name" );
	assert.equal( this.element.attr( "aria-disabled" ), "false", "no longer has ARIA disabled" );
} );

QUnit.test( "widget", function( assert ) {
	assert.expect( 1 );

	assert.strictEqual( this.widget[ 0 ],  this.element[ 0 ] );
} );

QUnit.test( "value", function( assert ) {
	assert.expect( 3 );

	this.element.calendar( "value", "1/1/14" );
	assert.ok( this.element.find( "button[data-ui-calendar-timestamp]:first" )
			.hasClass( "ui-state-active" ),
		"first day marked as selected"
	);
	assert.equal( this.element.calendar( "value" ), "1/1/14", "getter" );

	this.element.calendar( "value", "abc" );
	assert.equal( this.element.calendar( "value" ), null, "Setting invalid values." );
} );

QUnit.test( "valueAsDate", function( assert ) {
	assert.expect( 11 );

	var minDate, maxDate, dateAndTimeToSet, dateAndTimeClone,
		date1 = new Date( 2008, 6 - 1, 4 ),
		date2;

	this.element.calendar( "valueAsDate", new Date( 2014, 0, 1 ) );
	assert.ok( this.element.find( "button[data-ui-calendar-timestamp]:first" )
			.hasClass( "ui-state-active" ),
		"First day marked as selected"
	);
	assert.dateEqual( this.element.calendar( "valueAsDate" ), new Date( 2014, 0, 1 ), "Getter" );

	this.element.calendar( "destroy" );
	this.element.calendar();
	assert.equal( this.element.calendar( "valueAsDate" ), null, "Set date - default" );

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
	assert.equal(
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
	assert.equal(
		this.element.calendar( "valueAsDate" ),
		null,
		"Set date min/max - value > max"
	);

	this.element
		.calendar( "option", { min: minDate } )
		.calendar( "valueAsDate", date1 );
	assert.equal(
		this.element.calendar( "valueAsDate" ),
		null,
		"Set date min/max - value < min"
	);

	this.element.calendar( "valueAsDate", date2 );
	assert.equal(
		this.element.calendar( "valueAsDate" ),
		null, "Set date min/max - value > max"
	);

	dateAndTimeToSet = new Date( 2008, 3 - 1, 28, 1, 11, 0 );
	dateAndTimeClone = new Date( 2008, 3 - 1, 28, 1, 11, 0 );
	this.element.calendar( "valueAsDate", dateAndTimeToSet );
	assert.equal(
		dateAndTimeToSet.getTime(),
		dateAndTimeClone.getTime(),
		"Date object passed should not be changed by valueAsDate"
	);
} );

} );
