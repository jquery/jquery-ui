define( [
	"qunit",
	"jquery",
	"./helper",
	"ui/widgets/tooltip"
], function( QUnit, $, testHelper ) {

var beforeAfterEach = testHelper.beforeAfterEach;

QUnit.module( "tooltip: (deprecated) options", beforeAfterEach() );

QUnit.test( "tooltipClass", function( assert ) {
	assert.expect( 1 );
	var element = $( "#tooltipped1" ).tooltip( {
		tooltipClass: "custom"
	} ).tooltip( "open" );
	assert.hasClasses( $( "#" + element.data( "ui-tooltip-id" ) ), "custom" );
} );

} );
