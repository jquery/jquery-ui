(function( $ ) {

module( "timepicker: methods" );

test( "value - get and set value", function() {
	expect( 3 );

	var i,
		input = $( "#timepicker1" ).val( "12:00:00 AM" ).timepicker();

	equal( input.timepicker( "value" ), "00:00:00", "Expected value for 12am" );


	input.timepicker( "value", "02:34:56" );
	equal( input.val(), " 2:34:56 AM", "Expected val() for 02:34:56" );


	input.timepicker( "value", "12:34:56" );
	equal( input.val(), "12:34:56 PM", "Expected val() for 12:34:56" );
	
});

}( jQuery ) );
