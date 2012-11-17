(function( $ ) {

module( "mask: options" );

test( "clearEmpty", function() {
	expect( 4 );
	var input = $( "#mask1" ).val( "" ).mask({
		mask: "99/99/99",
		placeholder: "_",
		clearEmpty: true
	});

	equal( input.val(), "", "Empty value with clearEmpty displays no mask" );
	TestHelpers.focus( input );
	equal( input.val(), "__/__/__", "Empty value with clearEmpty & element focus displays mask" );
	TestHelpers.blur( input );
	equal( input.val(), "", "Empty value with clearEmpty displays no mask after blur" );
	input.mask( "option", "clearEmpty", false );
	equal( input.val(), "__/__/__", "Disabling clearEmpty displays mask" );
});

test( "placeholder", function() {
	expect( 2 );
	var input = $( "#mask1" ).mask({
		mask: "99/99/99",
		placeholder: "_",
		clearEmpty: false
	});

	equal( input.val(), "__/__/__", "Initial value" );
	input.mask( "option", "placeholder", " " );
	equal( input.val(), "  /  /  ", "Placeholder changed" );
});

test( "mask", function() {
	expect( 2 );
	var input = $( "#mask1" ).val( "1234" ).mask({
		mask: "99/99/99",
		placeholder: "_"
	});

	equal( input.val(), "12/34/__", "Initial value" );
	input.mask( "option", "mask", "(999)999-9999" );
	equal( input.val(), "(123)4__-____", "Mask changed" );
});

test( "mask with optional input", function() {
	expect( 1 );
	var input = $( "#mask1" ).val( "1234" ).mask({
		mask: "(999) 999-9999?x9999"
	});

	equal( input.val(), "(123) 4__-____", "Initial value" );
});

test( "mask with multiple optional inputs", function() {
	expect( 1 );
	var input = $( "#mask1" ).val( "1234" ).mask({
		mask: "(999) 999-9999?x9?9?9?9"
	});

	equal( input.val(), "(123) 4__-____", "Initial value" );
});

test( "mask with escaped characters", function() {
	expect( 1 );
	var input = $( "#mask1" ).val( "1234" ).mask({
		mask: "(\\9\\9\\9)\\\\ 999-99\\a\\*\\?x9999"
	});

	equal( input.val(), "(999)\\ 123-4_a*?x____", "Initial value" );
});

test( "escaped use of custom mask with wrapper ", function() {
	expect( 1 );
	var input = $( "#mask1" ).val( "1" ).mask({
		mask: "9\\<xyz\\>"
	});

	equal( input.val(), "1<xyz>", "Initial value" );
});

test( "custom mask with wrapper and escape", function() {
	expect( 1 );
	var input = $( "#mask1" ).val( "monA0" ).mask({
		mask: "<day>:a\\?:<d>?x",
		definitions: {
			day: function ( value ) {
				if ( $.inArray(value, [ "mon", "tue", "wed", "thu", "fri", "sat", "sun" ]) ) {
					return value;
				} else if ( $.inArray(value, [ "m", "mo" ])) {
					return "mon";
				} else if ( value === "t" ) {
					return "t";
				} else if ( value === "tu" ) {
					return "tue";
				} else if ( value === "thu" ) {
					return "thu";
				} else if ( $.inArray(value, [ "w", "we" ]) ) {
					return "wed";
				} else if ( $.inArray(value, [ "f", "fr" ]) ) {
					return "fri";
				} else if ( value === "s" ) {
					return "s";
				} else if ( value === "sa" ) {
					return "sat";
				} else if ( value === "su" ) {
					return "sun";
				}
			},
			d: /[0-9]/
		}
	});

	equal( input.val(), "mon:A?:0", "Initial value" );
});

test( "mask option parser", 1, function() {
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
	], "Buffer correctly parsed" );
});

}( jQuery ) );
