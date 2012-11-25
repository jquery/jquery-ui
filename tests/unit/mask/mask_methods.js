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

test( "value: able to get (and set) raw values with optional section", function() {
	expect( 5 );
	var input = $( "#mask1" ).val("1234").mask({
		mask: "(999) 999-9999?x9999"
	});

	equal( input.mask('value'), "1234", "Reading initial value" );

	input.mask( "value", "123456" );

	equal( input.val(), "(123) 456-____", "Raw value set properly" );
	equal( input.mask( "value" ), "123456", "Raw value read correctly" );

	input.mask( "value", "12345678901234" );

	equal( input.val(), "(123) 456-7890x1234", "Raw value with optional set properly" );
	equal( input.mask( "value" ), "12345678901234", "Raw value read correctly" );
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
