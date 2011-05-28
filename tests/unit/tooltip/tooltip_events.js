(function( $ ) {

module( "tooltip: events" );

test( "programmatic triggers", function() {
	expect( 2 );
	var element = $( "#tooltipped1" ).tooltip();

	element.one( "tooltipopen", function( event ) {
		ok( !( "originalEvent" in event ), "open" );
	});
	element.tooltip( "open" );

	element.one( "tooltipclose", function( event ) {
		ok( !( "originalEvent" in event ), "close" );
	});
	element.tooltip( "close" );
});

test( "mouse events", function() {
	expect( 2 );
	var element = $( "#tooltipped1" ).tooltip();

	element.one( "tooltipopen", function( event ) {
		same( event.originalEvent.type, "mouseover" );
	});
	element.trigger( "mouseover" );

	element.one( "tooltipclose", function( event ) {
		same( event.originalEvent.type, "mouseleave" );
	});
	element.trigger( "mouseleave" );
});

test( "focus events", function() {
	expect( 2 );
	var element = $( "#tooltipped1" ).tooltip();

	element.one( "tooltipopen", function( event ) {
		same( event.originalEvent.type, "focusin" );
	});
	element.trigger( "focusin" );

	element.one( "tooltipclose", function( event ) {
		same( event.originalEvent.type, "blur" );
	});
	element.trigger( "blur" );
});

}( jQuery ) );
