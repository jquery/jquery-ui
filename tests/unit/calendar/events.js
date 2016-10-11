define( [
	"jquery",
	"./helper",
	"ui/widgets/calendar"
], function( $, testHelper ) {

module( "calendar: events", {
	setup: function() {
		this.element = $( "#calendar" ).calendar();
	}
} );

test( "change", function() {
	expect( 6 );

	var shouldFire, eventType;

	this.element.calendar( {
		change: function( event ) {
			ok( shouldFire, "change event fired" );
			equal(
				event.type,
				"calendarchange",
				"change event"
			);
			equal(
				event.originalEvent.type,
				eventType,
				"change originalEvent on calendar button " + eventType
			);
		}
	} );

	shouldFire = true;
	eventType = "mousedown";
	this.element.find( "tbody button" ).last().simulate( eventType );

	shouldFire = true;
	eventType = "keydown";
	testHelper.focusGrid( this.element )
		.simulate( eventType, { keyCode: $.ui.keyCode.HOME } )
		.simulate( eventType, { keyCode: $.ui.keyCode.ENTER } );

	shouldFire = false;
	eventType = "mousedown";
	this.element.find( "tbody button" ).first().simulate( eventType );
} );

asyncTest( "select", function() {
	expect( 6 );

	var that = this,
		message, eventType;

	this.element.calendar( {
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
		eventType = "mousedown";
		message = "on calendar button " + eventType;
		that.element.find( "table button:eq(1)" ).simulate( eventType );
		setTimeout( step2, 50 );
	}

	function step2() {
		eventType = "keydown";
		message = "on calendar button " + eventType;
		testHelper.focusGrid( that.element )
			.simulate( eventType, { keyCode: $.ui.keyCode.END } )
			.simulate( eventType, { keyCode: $.ui.keyCode.ENTER } );
		setTimeout( step3, 50 );
	}

	// This should not trigger another event
	function step3() {
		that.element.calendar( "disable" );
		that.element.find( "table button:eq(10)" ).simulate( "mousedown" );
		setTimeout( start, 50 );
	}

	step1();
} );

} );
