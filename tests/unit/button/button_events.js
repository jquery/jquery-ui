/*
 * button_events.js
 */
(function($) {

module( "Button: events" );

asyncTest( "When button loses focus, ensure active state is removed", function() {
	expect( 1 );

	var element = $( "#button" ).button();

	element.one( "keypress", function() {
		element.one( "blur", function() {
			ok( !element.is( ".ui-state-active" ), "button loses active state appropriately" );
			start();
		}).blur();
	});

	element.focus();
	setTimeout(function() {
		element
			.simulate( "keydown", { keyCode: $.ui.keyCode.ENTER } )
			.simulate( "keypress", { keyCode: $.ui.keyCode.ENTER } );
	});
});

})(jQuery);
