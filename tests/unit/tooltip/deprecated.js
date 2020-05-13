define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/tooltip"
], function( QUnit, $, helper ) {

QUnit.module( "tooltip: (deprecated) options", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "tooltipClass", function( assert ) {
	assert.expect( 1 );
	var element = $( "#tooltipped1" ).tooltip( {
		tooltipClass: "custom"
	} ).tooltip( "open" );
	assert.hasClasses( $( "#" + element.data( "ui-tooltip-id" ) ), "custom" );
} );

} );
