define( [
	"qunit",
	"jquery",
	"ui/widgets/progressbar"
], function( QUnit, $ ) {

QUnit.module( "progressbar: options" );

QUnit.test( "{ value: 0 }, default", function( assert ) {
	assert.expect( 1 );
	$( "#progressbar" ).progressbar();
	assert.equal( $( "#progressbar" ).progressbar( "value" ), 0 );
} );

// Ticket #7231 - valueDiv should be hidden when value is at 0%
QUnit.test( "value: visibility of valueDiv", function( assert ) {
	assert.expect( 4 );
	var element = $( "#progressbar" ).progressbar( {
		value: 0
	} );
	assert.ok( element.children( ".ui-progressbar-value" ).is( ":hidden" ),
		"valueDiv hidden when value is initialized at 0" );
	element.progressbar( "value", 1 );
	assert.ok( element.children( ".ui-progressbar-value" ).is( ":visible" ),
		"valueDiv visible when value is set to 1" );
	element.progressbar( "value", 100 );
	assert.ok( element.children( ".ui-progressbar-value" ).is( ":visible" ),
		"valueDiv visible when value is set to 100" );
	element.progressbar( "value", 0 );
	assert.ok( element.children( ".ui-progressbar-value" ).is( ":hidden" ),
		"valueDiv hidden when value is set to 0" );
} );

QUnit.test( "{ value: 5 }", function( assert ) {
	assert.expect( 1 );
	$( "#progressbar" ).progressbar( {
		value: 5
	} );
	assert.equal( $( "#progressbar" ).progressbar( "value" ), 5 );
} );

QUnit.test( "{ value: -5 }", function( assert ) {
	assert.expect( 1 );
	$( "#progressbar" ).progressbar( {
		value: -5
	} );
	assert.equal( $( "#progressbar" ).progressbar( "value" ), 0,
		"value constrained at min" );
} );

QUnit.test( "{ value: 105 }", function( assert ) {
	assert.expect( 1 );
	$( "#progressbar" ).progressbar( {
		value: 105
	} );
	assert.equal( $( "#progressbar" ).progressbar( "value" ), 100,
		"value constrained at max" );
} );

QUnit.test( "{ value: 10, max: 5 }", function( assert ) {
	assert.expect( 1 );
	$( "#progressbar" ).progressbar( {
		max: 5,
		value: 10
	} );
	assert.equal( $( "#progressbar" ).progressbar( "value" ), 5,
		"value constrained at max" );
} );

QUnit.test( "change max below value", function( assert ) {
	assert.expect( 1 );
	$( "#progressbar" ).progressbar( {
		max: 10,
		value: 10
	} ).progressbar( "option", "max", 5 );
	assert.equal( $( "#progressbar" ).progressbar( "value" ), 5,
		"value constrained at max" );
} );

} );
