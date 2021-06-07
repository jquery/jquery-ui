define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/button"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "Button: events", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "Anchor recieves click event when spacebar is pressed", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	var element = $( "#anchor-button" ).button();

	element.on( "click", function( event ) {
		event.preventDefault();
		assert.ok( true, "click occcured as a result of spacebar" );
		ready();
	} );

	element.trigger( $.Event( "keyup", { keyCode: $.ui.keyCode.SPACE } ) );
} );

} );
