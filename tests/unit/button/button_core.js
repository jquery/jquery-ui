/*
 * button_core.js
 */


(function($) {

module( "Button: core" );

test( "Input type submit, don't create child elements", function() {
	expect( 2 );
	var input = $("#submit");
	deepEqual( input.children().length, 0 );
	input.button();
	deepEqual( input.children().length, 0 );
});

asyncTest( "Disabled button maintains ui-state-focus", function() {
	expect( 1 );
	var element = $( "#button1" ).button();
	element.simulate( "focus" );
	setTimeout(function() {

		// Todo: figure out why this fails in phantom put passes in browser
		// ok( element.is( ":focus" ), "Button is focused" );
		element.button( "disable" );
		ok( !element.is( ":focus" ),
			"Button has had focus removed" );
		start();
	});
});

})(jQuery);
