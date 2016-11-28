define( [
	"qunit",
	"jquery",
	"ui/widgets/pinpad"
], function( QUnit, $ ) {

	QUnit.module( "pinpad: methods" );

	QUnit.test( "destroy", function( assert ) {
		assert.expect( 1 );
		assert.domEqual( "#pinpad1", function() {
			$( "#pinpad1" ).pinpad().pinpad( "destroy" );
		} );
	} );

	QUnit.test( "output", function( assert ) {
		assert.expect( 2 );
		var element = $( "#pinpad1" ).pinpad(),
			output = element.pinpad( "output" );
		assert.hasClasses( output, "ui-pinpad-output" );
		assert.equal( output.attr( "id" ), element.attr( "id" ) + "_output" );
	} );

	QUnit.test( "value", function( assert ) {
		assert.expect( 3 );
		var element = $( "#pinpad1" ).val( "20" ).pinpad();
		assert.equal( element.pinpad( "value" ), "20", "correct value as getter" );
		assert.strictEqual( element.pinpad( "value", "30" ), element, "chainable as setter" );
		assert.equal( element.val(), "30", "correct value after setter" );
	} );

	QUnit.test( "widget", function( assert ) {
		assert.expect( 2 );
		var element = $( "#pinpad1" ).pinpad(),
			widget = element.pinpad( "widget" );
		assert.equal( widget.length, 1, "one element" );
		assert.hasClasses( widget, "ui-pinpad" );
	} );

} );
