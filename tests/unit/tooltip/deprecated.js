define( [
	"qunit",
	"jquery",
	"ui/widgets/tooltip"
], function( QUnit, $ ) {

QUnit.module( "tooltip: (deprecated) options" );

QUnit.test( "tooltipClass", function( assert ) {
	assert.expect( 1 );
	var element = $( "#tooltipped1" ).tooltip( {
		tooltipClass: "custom"
	} ).tooltip( "open" );
	assert.hasClasses( $( "#" + element.data( "ui-tooltip-id" ) ), "custom" );
} );

} );
