(function( $ ) {

module( "mask: events" );

test( "keydown: delete and backspace behaviors", function() {
	expect( 11 );
	var input = $( "#mask1" ).val( "1234" ).mask({ mask: "99/99/99" }),
		mask = input.data( "mask" );

	equal( input.val(), "12/34/__", "Initial Value" );
	mask._caret( 0 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.DELETE });
	equal( input.val(), "23/4_/__", "Deleted first value" );
	mask._caret( 2 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.DELETE });
	equal( input.val(), "23/__/__", "Deleted value after literal" );

	input.val( "123456" ).mask( "refresh" );
	equal( input.val(), "12/34/56", "New Initial Value" );
	mask._caret( 2, 4 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.DELETE });
	equal( input.val(), "12/56/__", "Deleted 34 out of the middle" );
	deepEqual( mask._caret(), { begin: 2, end: 2 }, "Caret position" );
	
	input.val( "123456" ).mask( "refresh" );
	equal( input.val(), "12/34/56", "New Initial Value" );
	mask._caret( 2, 4 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE });
	equal( input.val(), "12/56/__", "Backspaced 34 out of the middle" );
	deepEqual( mask._caret(), { begin: 2, end: 2 }, "Caret position" );
	
	mask._caret( 6 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE });
	equal( input.val(), "12/5_/__", "Backspaced last value" );

	mask._caret( 2 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE });
	equal( input.val(), "15/__/__", "Backspaced value from middle" );

});

}( jQuery ) );
