define( [
	"jquery",
	"./helper",
	"ui/widgets/calendar"
], function( $, testHelper ) {

module( "calendar: events" );

asyncTest( "select", function() {
	expect( 6 );

	var message, eventType,
		element = $( "#calendar" ).calendar( {
			select: function( event ) {
				ok( true, "select event fired " + message );
				equal(
					event.type,
					"calendarselect",
					"select event " + message
				);
				equal(
					event.originalEvent.type,
					eventType,
					"select originalEvent " + message
				);
			}
		} );

	function step1() {
		setTimeout( function() {
			eventType = "mousedown";
			message = "on calendar button " + eventType;
			element.find( "table button:eq(1)" ).simulate( eventType );
			step2();
		}, 50 );
	}

	function step2() {
		setTimeout( function() {
			eventType = "keydown";
			message = "on calendar button " + eventType;
			testHelper.focusGrid( element )
				.simulate( eventType, { keyCode: $.ui.keyCode.END } )
				.simulate( eventType, { keyCode: $.ui.keyCode.ENTER } );
			step3();
		}, 50 );
	}

	// This should not trigger another event
	function step3() {
		setTimeout( function() {
			element.calendar( "disable" );
			element.find( "table button:eq(10)" ).simulate( "mousedown" );
			start();
		}, 50 );
	}

	step1();
} );

} );
