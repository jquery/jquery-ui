define( [
	"jquery",
	"ui/widgets/progressbar"
], function( $ ) {

module( "progressbar: methods" );

test( "destroy", function( assert ) {
	expect( 1 );
	assert.domEqual( "#progressbar", function() {
		$( "#progressbar" ).progressbar().progressbar( "destroy" );
	} );
} );

test( "disable", function( assert ) {
	expect( 3 );

	var element = $( "#progressbar" ).progressbar().progressbar( "disable" );

	assert.hasClasses( element.progressbar( "widget" ), "ui-state-disabled" );
	ok( element.progressbar( "widget" ).attr( "aria-disabled" ), "element gets aria-disabled" );
	assert.hasClasses( element.progressbar( "widget" ), "ui-progressbar-disabled" );
} );

test( "value", function() {
	expect( 3 );

	var element = $( "<div>" ).progressbar( { value: 20 } );
	equal( element.progressbar( "value" ), 20, "correct value as getter" );
	strictEqual( element.progressbar( "value", 30 ), element, "chainable as setter" );
	equal( element.progressbar( "option", "value" ), 30, "correct value after setter" );
} );

test( "widget", function() {
	expect( 2 );
	var element = $( "#progressbar" ).progressbar(),
		widgetElement = element.progressbar( "widget" );
	equal( widgetElement.length, 1, "one element" );
	strictEqual( widgetElement[ 0 ], element[ 0 ], "same element" );
} );

} );
