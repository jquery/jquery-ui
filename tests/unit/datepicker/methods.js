define( [
	"jquery",
	"ui/widgets/datepicker"
], function( $ ) {

module( "datepicker: methods", {
	setup: function() {
		this.element = $( "#datepicker" ).datepicker( { show: false, hide: false } );
		this.widget = this.element.datepicker( "widget" );
	},
	teardown: function() {
		this.element.datepicker( "destroy" ).val( "" );
	}
} );

test( "destroy", function( assert ) {
	expect( 3 );

	var input = $( "<input>" ).appendTo( "#qunit-fixture" );

	assert.domEqual( input, function() {
		input.datepicker();
		ok( input.attr( "aria-owns" ), "aria-owns attribute added" );
		ok( input.attr( "aria-haspopup" ), "aria-haspopup attribute added" );
		input.datepicker( "destroy" );
	} );
} );

test( "enable / disable", function() {
	expect( 10 );

	this.element.datepicker( "disable" );
	ok( this.element.datepicker( "option", "disabled" ), "disabled option is set" );
	ok( this.widget.hasClass( "ui-datepicker-disabled" ), "has disabled widget class name" );
	ok( this.element.hasClass( "ui-state-disabled" ), "has disabled state class name" );
	equal( this.element.attr( "aria-disabled" ), "true", "has ARIA disabled" );
	equal( this.element.attr( "disabled" ), "disabled", "input disabled" );

	this.element.datepicker( "enable" );
	ok( !this.element.datepicker( "option", "disabled" ), "enabled after enable() call" );
	ok( !this.widget.hasClass( "ui-datepicker-disabled" ), "no longer has disabled widget class name" );
	ok( !this.element.hasClass( "ui-state-disabled" ), "no longer has disabled state class name" );
	equal( this.element.attr( "aria-disabled" ), "false", "no longer has ARIA disabled" );
	equal( this.element.attr( "disabled" ), undefined, "input no longer disabled" );
} );

test( "widget", function() {
	expect( 1 );

	deepEqual( $( "body > .ui-front" )[ 0 ],  this.widget[ 0 ] );
	this.widget.remove();
} );

test( "open / close", function() {
	expect( 7 );

	ok( this.widget.is( ":hidden" ), "calendar hidden on init" );

	this.element.datepicker( "open" );
	ok( this.widget.is( ":visible" ), "open: calendar visible" );
	equal( this.widget.attr( "aria-hidden" ), "false", "open: calendar aria-hidden" );
	equal( this.widget.attr( "aria-expanded" ), "true", "close: calendar aria-expanded" );

	this.element.datepicker( "close" );
	ok( !this.widget.is( ":visible" ), "close: calendar hidden" );
	equal( this.widget.attr( "aria-hidden" ), "true", "close: calendar aria-hidden" );
	equal( this.widget.attr( "aria-expanded" ), "false", "close: calendar aria-expanded" );
} );

test( "value", function() {
	expect( 4 );

	this.element.datepicker( "value", "1/1/14" );
	equal( this.element.val(), "1/1/14", "input's value set" );

	this.element.datepicker( "open" );
	ok(
		this.widget.find( "button[data-timestamp]" ).eq( 0 ).hasClass( "ui-state-active" ),
		"first day marked as selected"
	);
	equal( this.element.datepicker( "value" ), "1/1/14", "getter" );

	this.element.val( "abc" );
	strictEqual( this.element.datepicker( "value" ), null, "Invalid values should return null." );
} );

test( "valueAsDate", function( assert ) {
	expect( 5 );

	strictEqual( this.element.datepicker( "valueAsDate" ), null, "Default" );

	this.element.datepicker( "valueAsDate", new Date( 2014, 0, 1 ) );
	equal( this.element.val(), "1/1/14", "Input's value set" );
	ok(
		this.widget.find( "button[data-timestamp]" ).eq( 0 ).hasClass( "ui-state-active" ),
		"First day marked as selected"
	);
	assert.dateEqual( this.element.datepicker( "valueAsDate" ), new Date( 2014, 0, 1 ), "Getter" );

	this.element.val( "a/b/c" );
	equal( this.element.datepicker( "valueAsDate" ), null, "Invalid dates return null" );
} );

test( "isValid", function() {
	expect( 2 );

	this.element.val( "1/1/14" );
	ok( this.element.datepicker( "isValid" ) );

	this.element.val( "1/1/abc" );
	ok( !this.element.datepicker( "isValid" ) );
} );

} );
