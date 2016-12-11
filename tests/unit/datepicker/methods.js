define( [
	"qunit",
	"jquery",
	"ui/widgets/datepicker"
], function( QUnit, $ ) {

QUnit.module( "datepicker: methods", {
	beforeEach: function() {
		this.element = $( "#datepicker" ).datepicker( { show: false, hide: false } );
		this.widget = this.element.datepicker( "widget" );
	},
	afterEach: function() {
		this.element.datepicker( "destroy" ).val( "" );
	}
} );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 3 );

	var input = $( "<input>" ).appendTo( "#qunit-fixture" );

	assert.domEqual( input, function() {
		input.datepicker();
		assert.ok( input.attr( "aria-owns" ), "aria-owns attribute added" );
		assert.ok( input.attr( "aria-haspopup" ), "aria-haspopup attribute added" );
		input.datepicker( "destroy" );
	} );
} );

QUnit.test( "enable / disable", function( assert ) {
	assert.expect( 10 );

	this.element.datepicker( "disable" );
	assert.ok( this.element.datepicker( "option", "disabled" ), "disabled option is set" );
	assert.ok( this.widget.hasClass( "ui-datepicker-disabled" ), "has disabled widget class name" );
	assert.ok( this.element.hasClass( "ui-state-disabled" ), "has disabled state class name" );
	assert.equal( this.element.attr( "aria-disabled" ), "true", "has ARIA disabled" );
	assert.equal( this.element.attr( "disabled" ), "disabled", "input disabled" );

	this.element.datepicker( "enable" );
	assert.ok( !this.element.datepicker( "option", "disabled" ), "enabled after enable() call" );
	assert.ok( !this.widget.hasClass( "ui-datepicker-disabled" ), "no longer has disabled widget class name" );
	assert.ok( !this.element.hasClass( "ui-state-disabled" ), "no longer has disabled state class name" );
	assert.equal( this.element.attr( "aria-disabled" ), "false", "no longer has ARIA disabled" );
	assert.equal( this.element.attr( "disabled" ), undefined, "input no longer disabled" );
} );

QUnit.test( "widget", function( assert ) {
	assert.expect( 1 );

	assert.deepEqual( $( "body > .ui-front" )[ 0 ],  this.widget[ 0 ] );
	this.widget.remove();
} );

QUnit.test( "open / close", function( assert ) {
	assert.expect( 7 );

	assert.ok( this.widget.is( ":hidden" ), "calendar hidden on init" );

	this.element.datepicker( "open" );
	assert.ok( this.widget.is( ":visible" ), "open: calendar visible" );
	assert.equal( this.widget.attr( "aria-hidden" ), "false", "open: calendar aria-hidden" );
	assert.equal( this.widget.attr( "aria-expanded" ), "true", "close: calendar aria-expanded" );

	this.element.datepicker( "close" );
	assert.ok( !this.widget.is( ":visible" ), "close: calendar hidden" );
	assert.equal( this.widget.attr( "aria-hidden" ), "true", "close: calendar aria-hidden" );
	assert.equal( this.widget.attr( "aria-expanded" ), "false", "close: calendar aria-expanded" );
} );

QUnit.test( "value", function( assert ) {
	assert.expect( 4 );

	this.element.datepicker( "value", "1/1/14" );
	assert.equal( this.element.val(), "1/1/14", "input's value set" );

	this.element.datepicker( "open" );
	assert.ok(
		this.widget.find( "button[data-ui-calendar-timestamp]" ).eq( 0 ).hasClass( "ui-state-active" ),
		"first day marked as selected"
	);
	assert.equal( this.element.datepicker( "value" ), "1/1/14", "getter" );

	this.element.val( "abc" );
	assert.strictEqual( this.element.datepicker( "value" ), null, "Invalid values should return null." );
} );

QUnit.test( "valueAsDate", function( assert ) {
	assert.expect( 5 );

	assert.strictEqual( this.element.datepicker( "valueAsDate" ), null, "Default" );

	this.element.datepicker( "valueAsDate", new Date( 2014, 0, 1 ) );
	assert.equal( this.element.val(), "1/1/14", "Input's value set" );
	assert.ok(
		this.widget.find( "button[data-ui-calendar-timestamp]" ).eq( 0 ).hasClass( "ui-state-active" ),
		"First day marked as selected"
	);
	assert.dateEqual( this.element.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ), "Getter" );

	this.element.val( "a/b/c" );
	assert.equal( this.element.datepicker( "valueAsDate" ), null, "Invalid dates return null" );
} );

QUnit.test( "isValid", function( assert ) {
	assert.expect( 2 );

	this.element.val( "1/1/14" );
	assert.ok( this.element.datepicker( "isValid" ) );

	this.element.val( "1/1/abc" );
	assert.ok( !this.element.datepicker( "isValid" ) );
} );

} );
