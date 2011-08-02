(function( $ ) {

module( "mask: methods" );

test( "refresh", function() {
	expect( 1 );

	var input = $( "#mask1" ).mask({
		mask: "99/99/99"
	});

	input.val( "123456" ).mask( "refresh" );
	equal( input.val(), "12/34/56", "Refresh re-parsed the value of the input" );
});

test( "value: able to get (and set) raw values", function() {
	expect( 3 );
	var input = $( "#mask1" ).mask({
		mask: "99/99/99"
	});

	equal( input.mask( "value" ), "", "Reading empty raw value" );
	input.mask( "value", "123456" );
	equal( input.val(), "12/34/56", "Raw value set properly" );
	equal( input.mask( "value" ), "123456", "Raw value read correctly" );
});

test( "valid: returns true when all required placeholders are filled", function() {
	expect( 2 );
	var input = $( "#mask1" ).mask({
		mask: "99/99/99"
	});

	equal( input.mask( "valid" ), false, "Empty value is invalid" );
	input.mask( "value", "123456" );
	equal( input.mask( "valid" ), true, "All placheholders are full" );
});

}( jQuery ) );
