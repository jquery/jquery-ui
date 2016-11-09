define( [
	"qunit",
	"jquery",
	"ui/widgets/tooltip"
], function( QUnit, $ ) {

QUnit.module( "tooltip: events" );

QUnit.test( "programmatic triggers", function( assert ) {
	assert.expect( 4 );
	var tooltip,
		element = $( "#tooltipped1" ).tooltip();

	element.one( "tooltipopen", function( event, ui ) {
		tooltip = ui.tooltip;
		assert.ok( !( "originalEvent" in event ), "open" );
		assert.strictEqual( ui.tooltip[ 0 ],
			$( "#" + element.data( "ui-tooltip-id" ) )[ 0 ], "ui.tooltip" );
	} );
	element.tooltip( "open" );

	element.one( "tooltipclose", function( event, ui ) {
		assert.ok( !( "originalEvent" in event ), "close" );
		assert.strictEqual( ui.tooltip[ 0 ], tooltip[ 0 ], "ui.tooltip" );
	} );
	element.tooltip( "close" );
} );

QUnit.test( "mouse events", function( assert ) {
	assert.expect( 2 );
	var element = $( "#tooltipped1" ).tooltip();

	element.on( "tooltipopen", function( event ) {
		assert.deepEqual( event.originalEvent.type, "mouseover" );
	} );
	element.trigger( "mouseover" );

	element.on( "tooltipclose", function( event ) {
		assert.deepEqual( event.originalEvent.type, "mouseleave" );
	} );
	element.trigger( "focusout" );
	element.trigger( "mouseleave" );
} );

QUnit.test( "focus events", function( assert ) {
	assert.expect( 2 );
	var element = $( "#tooltipped1" ).tooltip();

	element.on( "tooltipopen", function( event ) {
		assert.deepEqual( event.originalEvent.type, "focusin" );
	} );
	element.trigger( "focusin" );

	element.on( "tooltipclose", function( event ) {
		assert.deepEqual( event.originalEvent.type, "focusout" );
	} );
	element.trigger( "mouseleave" );
	element.trigger( "focusout" );
} );

} );
