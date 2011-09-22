(function( $ ) {

module( "timepicker: options" );

test( "seconds", function() {
	expect( 3 );

	var input = $( "#timepicker1" ).val("12:30 am").timepicker({
		seconds: false
	});

	equal( input.val(), "12:30 am", "Seconds: false startup option" );

	input.timepicker( "option", "seconds", true );

	equal( input.val(), "12:30:00 am", "Seconds: enabled seconds via option method" );

	input.timepicker( "option", "seconds", false );

	equal( input.val(), "12:30 am", "Seconds: disabled seconds via option method" );

});

test( "ampm", function() {
	expect( 3 );

	var input = $( "#timepicker1" ).val("01:30:00 pm").timepicker({
		ampm: true
	});

	equal( input.val(), "01:30:00 pm", "Sanity Check" );

	input.timepicker( "option", "ampm", false );

	equal( input.val(), "13:30:00", "Disabled ampm option via method" );

	input.timepicker( "option", "ampm", true );

	equal( input.val(), "01:30:00 pm", "Enabled ampm option via method" );

});

}( jQuery ) );
