define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/selectable"
], function( QUnit, $, testHelpers ) {

QUnit.module( "selectable: events" );

QUnit.test( "start", function( assert ) {
	assert.expect( 2 );
	var el = $( "#selectable1" );
	el.selectable( {
		start: function() {
			assert.ok( true, "drag fired start callback" );
			assert.equal( this, el[ 0 ], "context of callback" );
		}
	} );
	el.simulate( "drag", {
		dx: 20,
		dy: 20
	} );
} );

QUnit.test( "stop", function( assert ) {
	assert.expect( 2 );
	var el = $( "#selectable1" );
	el.selectable( {
		start: function() {
			assert.ok( true, "drag fired stop callback" );
			assert.equal( this, el[ 0 ], "context of callback" );
		}
	} );
	el.simulate( "drag", {
		dx: 20,
		dy: 20
	} );
} );

QUnit.test( "mousedown: initial position of helper", function( assert ) {
	assert.expect( 2 );

	var helperOffset,
		element = $( "#selectable1" ).selectable(),
		contentToForceScroll = testHelpers.forceScrollableWindow( "body" );

	$( window ).scrollTop( 100 ).scrollLeft( 100 );

	element.simulate( "mousedown", {
		clientX: 10,
		clientY: 10
	} );

	helperOffset = $( ".ui-selectable-helper" ).offset();
	assert.ok( helperOffset.top, 110, "Scroll top should be accounted for." );
	assert.ok( helperOffset.left, 110, "Scroll left should be accounted for." );

	// Cleanup
	element.simulate( "mouseup" );
	contentToForceScroll.remove();
	$( window ).scrollTop( 0 ).scrollLeft( 0 );
} );

} );
