define( [
	"qunit",
	"jquery",
	"ui/widgets/button"
], function( QUnit, $ ) {

QUnit.module( "Button: events" );

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
