define( [
	"qunit",
	"jquery",
	"ui/safe-active-element",
	"ui/widgets/button"
], function( QUnit, $ ) {

QUnit.module( "Button: core" );

QUnit.test( "Disabled button loses focus", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var element = $( "#button" ).button();

	element.focus();
	setTimeout( function() {

		assert.equal( element[ 0 ], $.ui.safeActiveElement( document ), "Button is focused" );

		element.button( "disable" );
		assert.notEqual( element[ 0 ], $.ui.safeActiveElement( document ), "Button has had focus removed" );
		ready();
	} );
} );

} );
