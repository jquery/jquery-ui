(function( $ ) {

module( "mask: options" );

test( "placeholder", function() {
	expect( 2 );
	var input = $( "#mask1" ).mask({
		mask: "99/99/99",
		placeholder: "_"
	});

	equal( input.val(), "__/__/__", "Initial value" );
	input.mask( "option", "placeholder", " " );
	equal( input.val(), "  /  /  ", "Placeholder changed" );
	
});

test( "mask", function() {
	expect( 2 );
	var input = $( "#mask1" ).val("1234").mask({
		mask: "99/99/99",
		placeholder: "_"
	});

	equal( input.val(), "12/34/__", "Initial value" );
	input.mask( "option", "mask", "(999)999-9999" );
	equal( input.val(), "(123)4__-____", "Mask changed" );
	
});


}( jQuery ) );
