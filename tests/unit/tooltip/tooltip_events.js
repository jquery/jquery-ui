(function( $ ) {

module( "tooltip: events" );

test( "programmatic triggers", function() {
	expect( 4 );
	var tooltip,
		element = $( "#tooltipped1" ).tooltip();

	element.one( "tooltipopen", function( event, ui ) {
		tooltip = ui.tooltip;
		ok( !( "originalEvent" in event ), "open" );
		strictEqual( ui.tooltip[0],
			$( "#" + element.data( "ui-tooltip-id" ) )[0], "ui.tooltip" );
	});
	element.tooltip( "open" );

	element.one( "tooltipclose", function( event, ui ) {
		ok( !( "originalEvent" in event ), "close" );
		strictEqual( ui.tooltip[0], tooltip[0], "ui.tooltip" );
	});
	element.tooltip( "close" );
});

test( "mouse events", function() {
	expect( 2 );
	var element = $( "#tooltipped1" ).tooltip();

	element.bind( "tooltipopen", function( event ) {
		deepEqual( event.originalEvent.type, "mouseover" );
	});
	element.trigger( "mouseover" );

	element.bind( "tooltipclose", function( event ) {
		deepEqual( event.originalEvent.type, "mouseleave" );
	});
	element.trigger( "focusout" );
	element.trigger( "mouseleave" );
});

test( "focus events", function() {
	expect( 2 );
	var element = $( "#tooltipped1" ).tooltip();

	element.bind( "tooltipopen", function( event ) {
		deepEqual( event.originalEvent.type, "focusin" );
	});
	element.trigger( "focusin" );

	element.bind( "tooltipclose", function( event ) {
		deepEqual( event.originalEvent.type, "focusout" );
	});
	element.trigger( "mouseleave" );
	element.trigger( "focusout" );
});

// http://bugs.jqueryui.com/ticket/8740
asyncTest( "content: async callback loses focus before load", function() {
	expect( 1 );
	var element = $( "#tooltipped1" ).tooltip({
		content: function( response ) {
			element.trigger( "mouseleave" );
			setTimeout(function () {
				response( "sometext" );
				setTimeout(function () {
					ok(!$( "#" + element.data( "ui-tooltip-id" ) ).is( ":visible" ), "Tooltip should not display" );
					start();
				});
			});
		}
	});
	element.trigger( "mouseover" );
	element.tooltip( "destroy" );
});

// https://github.com/jquery/jquery-ui/pull/992/files#r5667799
asyncTest( "content: close should only be called once, even if content is set multiple times", function() {
	expect( 1 );
	var element = $( "#tooltipped1" ).tooltip();
	var closecount = 0;
	element.bind( "tooltipopen", function( event ) {
		element.tooltip( "option", "content", "one" );
		element.tooltip( "option", "content", "two" );
		element.trigger( "mouseleave" );
	});
	element.bind( "tooltipclose", function( event ) {
		closecount++;
		if (closecount === 1) {
			setTimeout(function () {
				equal( closecount, 1, "Close event handler should be called once" );
				element.tooltip( "destroy" );
				start();
			});
		}
	});
	element.trigger( "mouseover" );
});

}( jQuery ) );
