(function( $ ) {

module( "timepicker: events" );

// helper funciton to quick "press" a key - keydown/keyup
function downup( elem, key ) {
	elem.simulate( "keydown", { keyCode: key } );
	elem.simulate( "keyup", { keyCode: key } );
}

test( "keydown: Up/Down/Left/Right behaviors", function() {
	expect( 11 );

	var i,
		input = $( "#timepicker1" ).val( "12:00:00 PM" ).timepicker(),
		timepicker = input.data( "timepicker" ),
		mask = timepicker.mask;

	mask._caret( 0, 0 );
	equal( input.val(), "12:00:00 PM", "Sanity Check" );
	deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct" );

	downup( input, $.ui.keyCode.UP );
	equal( input.val(), " 1:00:00 PM", "After up keypress in hours field, value went to proper value" );

	downup( input, $.ui.keyCode.DOWN );
	equal( input.val(), "12:00:00 PM", "After down keypress in hours field, value went to proper value" );

	downup( input, $.ui.keyCode.DOWN );
	equal( input.val(), "11:00:00 PM", "After down keypress in hours field, value went to proper value" );
	deepEqual( mask._caret(), { begin: 0, end: 2 }, "Caret position selects hours" );

	downup( input, $.ui.keyCode.RIGHT );
	deepEqual( mask._caret(), { begin: 3, end: 5 }, "After Right - Caret position selects minutes" );

	for ( i = 0; i < 10; i++ ) {
		downup( input, $.ui.keyCode.DOWN );
	}
	equal( input.val(), "11:50:00 PM", "After 10 down keypress in minutes field, value went to proper value" );

	downup( input, $.ui.keyCode.RIGHT );
	deepEqual( mask._caret(), { begin: 6, end: 8 }, "After Right - Caret position selects seconds" );

	downup( input, $.ui.keyCode.RIGHT );
	deepEqual( mask._caret(), { begin: 9, end: 11 }, "After Right - Caret position selects am/pm" );

	downup( input, $.ui.keyCode.DOWN );
	equal( input.val(), "11:50:00 AM", "After down keypress in am/pm field, value went to proper value" );


});

}( jQuery ) );
