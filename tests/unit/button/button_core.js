/*
 * button_core.js
 */


(function($) {

module("button: core");

test("input type submit, don't create child elements", function() {
	expect( 2 );
	var input = $("#submit");
	deepEqual( input.children().length, 0 );
	input.button();
	deepEqual( input.children().length, 0 );
});

asyncTest( "#9169 - Disabled button maintains ui-state-focus", function() {
	expect( 2 );
	var element = $( "#button1" ).button();
	element.simulate( "focus" );
	setTimeout(function() {
		ok( element.is( ":focus" ), "button is focused" );
		element.button( "disable" );
		ok( !element.is( ":focus" ),
			"button has had focus removed" );
		start();
	},100);
});

})(jQuery);
