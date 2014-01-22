define( [
	"jquery",
	"ui/widgets/button"
], function( $ ) {

module( "Button: methods" );

test( "destroy", function( assert ) {
	expect( 1 );
	assert.domEqual( "#button", function() {
		$( "#button" ).button().button( "destroy" );
	} );
} );

test( "refresh: Ensure disabled state is preserved correctly.", function() {
	expect( 3 );

	var element = $( "<a href='#'></a>" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ),
		"Anchor button should remain disabled after refresh" );

	element = $( "<button></button>" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "<button> should remain disabled after refresh" );

	element = $( "<button></button>" );
	element.button( { disabled: true } ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ),
		"Changing a <button>'s disabled property should update the state after refresh." );

} );

} );
