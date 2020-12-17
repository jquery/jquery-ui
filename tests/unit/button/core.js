define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/safe-active-element",
	"ui/widgets/button"
], function( QUnit, $, helper ) {

QUnit.module( "Button: core", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "Disabled button loses focus", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var element = $( "#button" ).button();

	element.trigger( "focus" );
	setTimeout( function() {

		assert.equal( element[ 0 ], $.ui.safeActiveElement( document ), "Button is focused" );

		element.button( "disable" );
		assert.notEqual( element[ 0 ], $.ui.safeActiveElement( document ), "Button has had focus removed" );
		ready();
	} );
} );

} );
