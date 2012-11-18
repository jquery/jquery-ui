(function( $ ) {

module( "mask: core" );

test( "masked inputs get the '.ui-mask' class", function() {
	expect( 3 );
	var input = $( "#mask1" );
	ok( !input.is( ".ui-mask" ), "Input is not masked" );
	input.mask({ mask: "999" });
	ok( input.is( ".ui-mask" ), "Input is now masked" );
	input.mask( "destroy" );
	ok( !input.is( ".ui-mask" ), "destroy clears masked class" );
});

test( "_caret() can move and read the text cursor", 4, function() {

	var input = $( "#mask1" ).val("1234").mask({
			mask: "9999"
		}),
		instance = input.data( "ui-mask" );

	input.focus();
	instance._caret( 0 );
	deepEqual( instance._caret(), {
		begin: 0,
		end: 0
	}, "Caret position set to 0 results in 0, 0" );

	instance._caret( 1 );
	deepEqual( instance._caret(), {
		begin: 1,
		end: 1
	}, "Caret position set 1 results in 1, 1" );

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

test( "Parsing initial value with multi-character fields", function() {
	expect( 2 );
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
		input = $( "#mask1" );

	input.val("123456").mask({
		mask: "hh:ss:ss",
		definitions: defs
	});

	equal( input.val(), "12:34:56", "Literals were inserted into val");
	input.mask( "option", "mask", "99-99-99" );
	equal( input.val(), "12-34-56", "Old literals were ignored, and new ones inserted into val");
});

test( "Default values provided by function", function() {
	expect( 1 );
	var defs = {
			hh: function( value ) {
				if ( value === "" ) {
					return "11";
				}
			}
		},
		input = $( "#mask1" );

	input.val("").mask({
		mask: "hh",
		definitions: defs
	});
	equal( input.val(), "11", "No value was accepted, so the 'default' from the mask was provided" );

});

}( jQuery ) );
