(function( $ ) {

module( "timepicker: options" );

test( "seconds", function() {
	expect( 3 );

	var input = $( "#timepicker1" ).val("12:30 AM").timepicker({
		seconds: false
	});

	equal( input.val(), "12:30 AM", "Seconds: false startup option" );

	input.timepicker( "option", "seconds", true );

	equal( input.val(), "12:30:00 AM", "Seconds: enabled seconds via option method" );

	input.timepicker( "option", "seconds", false );

	equal( input.val(), "12:30 AM", "Seconds: disabled seconds via option method" );

});

test( "ampm", function() {
	expect( 3 );

	var input = $( "#timepicker1" ).val(" 1:30:00 PM").timepicker({
		ampm: true
	});

	equal( input.val(), " 1:30:00 PM", "Sanity Check" );

	input.timepicker( "option", "ampm", false );

	equal( input.val(), "13:30:00", "Disabled ampm option via method" );

	input.timepicker( "option", "ampm", true );

	equal( input.val(), " 1:30:00 PM", "Enabled ampm option via method" );

});

}( jQuery ) );
