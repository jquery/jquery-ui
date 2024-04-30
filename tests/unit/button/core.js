define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/button"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "Button: core", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "Disabled button loses focus", function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var element = $( "#button" ).button();

	element.trigger( "focus" );
	setTimeout( function() {

		assert.equal( element[ 0 ], document.activeElement, "Button is focused" );

		element.button( "disable" );
		assert.notEqual( element[ 0 ], document.activeElement, "Button has had focus removed" );
		ready();
	} );
} );

} );
