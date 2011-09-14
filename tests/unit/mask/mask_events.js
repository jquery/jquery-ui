(function( $ ) {

module( "mask: events" );

/* TODO: Descide behavior of bluring non-valid inputs */

function type( input, key ) {
	var code = key.charCodeAt( 0 );

	input.simulate( "keypress", { charCode: code, which: code });
}

test( "complete: Complete event fires when typing last non-optional character of mask", function() {
	expect( 2 );
	var input = $( "#mask1" ).val("").mask({
			mask: "9?9",
			complete: function( event, ui ) {
				equal( this, input[0], "Complete event fired with correct context" );
			}
		}),
		mask = input.data( "mask" );

	input.focus();
	mask._caret( 0 );
	type( input, "1" );
	equal( input.val(), "1_", "Value with optional character" );
});

test( "complete: Complete event fires when typing last character of mask", function() {
	expect( 3 );
	var input = $( "#mask1" ).val("").mask({
			mask: "99",
			complete: function( event, ui ) {
				equal( this, input[0], "Complete event fired with correct context" );
			}
		}),
		mask = input.data( "mask" );

	input.focus();
	mask._caret( 0 );
	type( input, "1" );
	equal( input.mask( "valid" ), false, "Mask is not yet valid" );
	type( input, "2" );
	equal( input.val(), "12", "Value with optional character" );
});

asyncTest( "focus: Initial Caret Positioning", function() {
	var input = $( "#mask1" ).val("").mask({
			mask: "9",
			clearEmpty: false
		}),
		mask = input.data( "mask" );

	equal( input.val(), "_", "Initial Value Expected" );
	input.focus();
	setTimeout( function() {
		deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct");

		input.mask( "option", "mask", "(9)" );
		equal( input.val(), "(_)", "Initial Value Expected" );
		input.focus();

		setTimeout( function() {
			deepEqual( mask._caret(), { begin: 1, end: 1 }, "Caret position correct");
			start();
		}, 15);

	}, 15);

});

test( "keydown: Backspace pulls values from right", function() {
	expect( 12 );
	var input = $( "#mask1" ).val("123").mask({ mask: "999" }),
		mask = input.data( "mask" );


	input.focus();
	equal( input.val(), "123", "Initial Value Expected" );

	mask._caret( 2 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE });
	equal( input.val(), "13_", "Backspaced the second character");
	deepEqual( mask._caret(), { begin: 1, end: 1 }, "Caret position correct");

	input.val( "1z" ).mask( "option", "mask", "9a" );
	equal( input.val(), "1z", "Initial Value Expected" );

	mask._caret( 1 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE });
	equal( input.val(), "_z", "Backspace did not pull value because it wasn't valid" );
	deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct");

	input.val( "12" ).mask( "option", "mask", "9-9" );
	equal( input.val(), "1-2", "Initial Value Expected" );

	mask._caret( 1 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE });
	equal( input.val(), "2-_", "Backspace pulled value because it was valid" );
	deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct");


	input.val( "1z" ).mask( "option", "mask", "9-a" );
	equal( input.val(), "1-z", "Initial Value Expected" );

	mask._caret( 1 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE });
	equal( input.val(), "_-z", "Backspace did not pull value because it wasn't valid" );
	deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct");
});

test( "keydown: Backspace with the cursor to the right of a mask literal", function() {
	expect( 6 );
	var input = $( "#mask1" ).val("123").mask({ mask: "9-99" }),
		mask = input.data( "mask" );

	input.focus();
	equal( input.val(), "1-23", "Initial Value Expected" );

	mask._caret( 2 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE });
	equal( input.val(), "2-3_", "Backspaced across the literal -, brought values with");
	deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct");

	input.val("z12").mask( "option", "mask", "a-99" );
	equal( input.val(), "z-12", "New Initial Value Expected");

	mask._caret( 2 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE });
	equal( input.val(), "_-12", "Backspaced across the literal -, values held position");
	deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct");
});

test( "keydown: Backspace with multiple values higlighted", function() {
	expect( 3 );
	var input = $( "#mask1" ).val("1234567890").mask({ mask: "(999)999-9999" }),
		mask = input.data( "mask" );

	input.focus();
	equal( input.val(), "(123)456-7890", "Initial Value Expected" );

	mask._caret( 5, 8 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.BACKSPACE });
	equal( input.val(), "(123)789-0___", "Deleted three highlighted values, pulled values from right" );
	deepEqual( mask._caret(), { begin: 5, end: 5 }, "Caret position correct");
});

test( "keypress: Typing with multiple values higlighted", function() {
	expect( 3 );
	var input = $( "#mask1" ).val("1234567890").mask({ mask: "(999)999-9999" }),
		mask = input.data( "mask" );

	input.focus();
	equal( input.val(), "(123)456-7890", "Initial Value Expected" );

	mask._caret( 5, 8 );
	type( input, "0" );
	equal( input.val(), "(123)078-90__", "Deleted three highlighted values, pulled values from right" );
	deepEqual( mask._caret(), { begin: 6, end: 6 }, "Caret position correct");
});

test( "keypress: Typing with multi-byte fields", function() {
	expect( 5 );
	var input = $( "#mask1" ).val("").mask({
			mask: "aa-aa-aa",
			definitions: {
				aa: function( value ) {
					return value;
				}
			}
		}),
		mask = input.data( "mask" );

	input.focus();
	equal( input.val(), "__-__-__", "Initial Value Expected" );

	mask._caret( 0 );
	type( input, "0" );
	equal( input.val(), "0_-__-__", "typed a 0" );
	deepEqual( mask._caret(), { begin: 1, end: 1 }, "Caret position correct");
	type( input, "z" );
	equal( input.val(), "0z-__-__", "typed a z" );
	deepEqual( mask._caret(), { begin: 3, end: 3 }, "Caret position correct");
});

test( "keydown: Delete pulling values", function() {
	expect( 18 );
	var input = $( "#mask1" ).val("123").mask({ mask: "9-99" }),
		mask = input.data( "mask" );

	input.focus();
	equal( input.val(), "1-23", "Initial value expected" );

	mask._caret( 1 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.DELETE });
	equal( input.val(), "1-3_", "Delete across the literal -, brought values with");
	deepEqual( mask._caret(), { begin: 2, end: 2 }, "Caret position correct");

	input.val("12z").mask( "option", "mask", "9-9a" );
	equal( input.val(), "1-2z", "Initial value expected" );

	mask._caret( 1 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.DELETE });
	equal( input.val(), "1-_z", "Deleted across the literal -, z was not pulled");
	deepEqual( mask._caret(), { begin: 2, end: 2 }, "Caret position correct");

	input.val("12").mask( "option", "mask", "99" );
	equal( input.val(), "12", "Initial value expected" );

	mask._caret( 0 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.DELETE });
	equal( input.val(), "2_", "Deleted value, pulled values from the right");
	deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct");

	input.val("1z").mask( "option", "mask", "9a" );
	equal( input.val(), "1z", "Initial value expected" );

	mask._caret( 0 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.DELETE });
	equal( input.val(), "_z", "Deleted value, couldn't pull values from the right");
	deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct");

	input.val("12").mask( "option", "mask", "9-9" );
	equal( input.val(), "1-2", "Initial value expected" );

	mask._caret( 0 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.DELETE });
	equal( input.val(), "2-_", "Deleted value, pulled values from the right across the literal");
	deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct");


	input.val("1z").mask( "option", "mask", "9-a" );
	equal( input.val(), "1-z", "Initial value expected" );

	mask._caret( 0 );
	input.simulate( "keydown", { keyCode: $.ui.keyCode.DELETE });
	equal( input.val(), "_-z", "Deleted value, couldn't pull values from the right");
	deepEqual( mask._caret(), { begin: 0, end: 0 }, "Caret position correct");
});

test( "keydown: escape returns to original value", function() {
	expect( 3 );
	var input = $( "#mask1" ).val("6").mask({ mask: "9" }),
		mask = input.data( "mask" );

	equal( input.val(), "6", "Initial value expected" );
	input.focus();

	mask._caret( 0 );
	type( input, "1" );
	equal( input.val(), "1", "Typed over" );

	input.simulate( "keydown", { keyCode: $.ui.keyCode.ESCAPE });
	equal( input.val(), "6", "Reverted value after pressing escape" );

});

test( "keypress: typing behaviors", function() {
	expect( 8 );
	var input = $( "#mask1" ).mask({
			mask: "9-9",
			clearEmpty: false
		}),
		mask = input.data( "mask" );

	input.focus();
	equal( input.val(), "_-_", "Initial value expected" );

	mask._caret( 0 );
	type( input, "1" );
	equal( input.val(), "1-_", "Typed a 1" );

	mask._caret( 0 );
	type( input, "2" );
	equal( input.val(), "2-1", "Typed a 2 before the 1" );
	deepEqual( mask._caret(), { begin: 2, end: 2 }, "Caret position correct");

	input.val("").mask( "option", "mask", "9-a" );
	equal( input.val(), "_-_", "Initial value expected" );

	mask._caret( 0 );
	type( input, "1" );
	equal( input.val(), "1-_", "Typed a 1" );

	mask._caret( 0 );
	type( input, "2" );
	equal( input.val(), "2-_", "Typed a 2 before the 1 - 1 is lost because not valid" );
	deepEqual( mask._caret(), { begin: 2, end: 2 }, "Caret position correct");
});

}( jQuery ) );
