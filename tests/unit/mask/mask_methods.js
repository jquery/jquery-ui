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

}( jQuery ) );
