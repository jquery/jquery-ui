(function( $ ) {

module( "tooltip: events" );

test( "programmatic triggers", function() {
	expect( 2 );
	var element = $( "#tooltipped1" ).tooltip({
		open: function( event, ui ) {
			same( event.type, "tooltipopen" );
		},
		close: function( event, ui ) {
			same( event.type, "tooltipclose" );
		}
	});
	element.tooltip( "open" ).tooltip( "close" );
});

test( "mouse events", function() {
	expect( 4 );
	var element = $( "#tooltipped1" ).tooltip({
		open: function( event, ui ) {
			same( event.type, "tooltipopen" );
			same( event.originalEvent.type, "mouseover" );
		},
		close: function( event, ui ) {
			same( event.type, "tooltipclose" );
			same( event.originalEvent.type, "mouseleave" );
		}
	});
	element.trigger( "mouseover" ).trigger( "mouseleave" );
});

test( "focus events", function() {
	expect( 4 );
	var element = $( "#tooltipped1" ).tooltip({
		open: function( event, ui ) {
			same( event.type, "tooltipopen" );
			same( event.originalEvent.type, "focusin" );
		},
		close: function( event, ui ) {
			same( event.type, "tooltipclose" );
			same( event.originalEvent.type, "blur" );
		}
	});
	element.trigger( "focus" ).trigger( "blur" );
});

}( jQuery ) );
