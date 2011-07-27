(function( $ ) {

module( "mask: core" );

test( "_caret() can move and read the text cursor", function() {
	expect( 3 );

	var input = $( "#mask1" ).val("This string is 33 characters long").mask(),
		instance = input.data( "mask" );
	input.focus();

	instance._caret( 0 );
	deepEqual( instance._caret(), {
		begin: 0,
		end: 0
	}, "Caret position set to 0 results in 0, 0" );

	instance._caret( 34 );
	deepEqual( instance._caret(), {
		begin: 33,
		end: 33
	}, "Caret position set beyond bounds (34) results in 33, 33" );

	instance._caret( 0, 2 );
	deepEqual( instance._caret(), {
		begin: 0,
		end: 2
	}, "Caret position set to 0, 2 results in 0, 2" );
});

}( jQuery ) );
