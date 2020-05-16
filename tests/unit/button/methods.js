define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/button"
], function( QUnit, $, helper ) {

QUnit.module( "Button: methods", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 1 );
	assert.domEqual( "#button", function() {
		$( "#button" ).button().button( "destroy" );
	} );
} );

QUnit.test( "refresh: Ensure disabled state is preserved correctly.", function( assert ) {
	assert.expect( 3 );

	var element = $( "<a href='#'></a>" );
	element.button( { disabled: true } ).button( "refresh" );
	assert.ok( element.button( "option", "disabled" ),
		"Anchor button should remain disabled after refresh" );

	element = $( "<button></button>" );
	element.button( { disabled: true } ).button( "refresh" );
	assert.ok( element.button( "option", "disabled" ), "<button> should remain disabled after refresh" );

	element = $( "<button></button>" );
	element.button( { disabled: true } ).prop( "disabled", false ).button( "refresh" );
	assert.ok( !element.button( "option", "disabled" ),
		"Changing a <button>'s disabled property should update the state after refresh." );

} );

} );
