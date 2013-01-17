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

test( "clearEmpty", function () {
    expect( 4 );

    var input = $( "#timepicker1" ).val(" 1:30:00 PM").timepicker({
        clearEmpty: true
    });

    equal( input.val(), " 1:30:00 PM", "Sanity Check" );

    input.timepicker( "value", "" );

    equal( input.val(), "", "Deleted value by setting empty string" );

    input.timepicker( "value", "1:30:00" );

    equal( input.val(), " 1:30:00 AM", "Restored value" );

    TestHelpers.downup( input, $.ui.keyCode.BACKSPACE );
    TestHelpers.downup( input, $.ui.keyCode.BACKSPACE );
    TestHelpers.downup( input, $.ui.keyCode.BACKSPACE );
    TestHelpers.downup( input, $.ui.keyCode.BACKSPACE );
    TestHelpers.downup( input, $.ui.keyCode.BACKSPACE );

    equal( input.val(), "__:__:__ __", "Deleted value by using Backspace Key, mask not yet refreshed (will onBlur)" );

});

test( "disabled", function () {
    expect( 3 );

    var input = $("#timepicker1").val(" 1:30:00 PM").timepicker({
        disabled: true
    });

    equal( input.val(), " 1:30:00 PM", "Sanity Check" );

    input.timepicker( "value", "14:20:00" );

    equal( input.val(), " 2:20:00 PM", "Can set value when disabled" );

    TestHelpers.downup( input, $.ui.keyCode.UP );

    equal( input.val(), " 2:20:00 PM", "After up keypress value does not change" );

});

}( jQuery ) );
