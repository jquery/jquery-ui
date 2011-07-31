(function( $ ) {

module( "mask: core" );

test( "_caret() can move and read the text cursor", function() {
	expect( 3 );

	var input = $( "#mask1" ).val("1234").mask({
		mask: "9999"
	}),
		instance = input.data( "mask" );
	input.focus();

	instance._caret( 0 );
	deepEqual( instance._caret(), {
		begin: 0,
		end: 0
	}, "Caret position set to 0 results in 0, 0" );

	instance._caret( 5 );
	deepEqual( instance._caret(), {
		begin: 4,
		end: 4
	}, "Caret position set beyond bounds (5) results in 4, 4" );

	instance._caret( 0, 2 );
	deepEqual( instance._caret(), {
		begin: 0,
		end: 2
	}, "Caret position set to 0, 2 results in 0, 2" );
});

test( "Mask Parsed Properly", function() {
	var defs = {
			hh: function( value ) {
				value = parseInt( value, 10 );
				if ( value >= 1 || value <= 12 ) {
					return ( value < 10 ? "0" : "" ) + value;
				}
			},
			ss: function( value ) {
				value = parseInt( value, 10 );
				if ( value >= 0 || value <= 59 ) {
					return ( value < 10 ? "0" : "" ) + value;
				}
			}
		},
		input = $( "#mask1" ).mask({
			mask: "hh:ss:ss.999",
			definitions: defs
		}),
		instance = input.data( "mask" );
	deepEqual( instance.buffer, [
		{
			valid: defs.hh,
			start: 0,
			length: 2
		},
		{
			valid: defs.hh,
			start: 0,
			length: 2
		},
		{
			literal: ":",
			start: 2,
			length: 1
		},
		{
			valid: defs.ss,
			start: 3,
			length: 2
		},
		{
			valid: defs.ss,
			start: 3,
			length: 2
		},
		{
			literal: ":",
			start: 5,
			length: 1
		},
		{
			valid: defs.ss,
			start: 6,
			length: 2
		},
		{
			valid: defs.ss,
			start: 6,
			length: 2
		},
		{
			literal: ".",
			start: 8,
			length: 1
		},
		{
			valid: instance.options.definitions[ 9 ],
			start: 9,
			length: 1
		},
		{
			valid: instance.options.definitions[ 9 ],
			start: 10,
			length: 1
		},
		{
			valid: instance.options.definitions[ 9 ],
			start: 11,
			length: 1
		}
	], "Buffer Calculated correctly" );
});

test( "Parsing initial value skips literals", function() {
	expect( 2 );
	var input = $( "#mask1" );
	input.val("123456").mask({
		mask: "99/99/99"
	});
	
	equal( input.val(), "12/34/56", "Literals were inserted into val");
	input.mask( "option", "mask", "99-99-99" );
	equal( input.val(), "12-34-56", "Old literals were ignored, and new ones inserted into val");
	
});

}( jQuery ) );
