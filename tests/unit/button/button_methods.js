/*
 * button_methods.js
 */
(function($) {


module( "Button: methods" );

test( "destroy", function() {
	expect( 1 );
	domEqual( "#button", function() {
		$( "#button" ).button().button( "destroy" );
	});
});

test( "refresh: Ensure disabled state is preserved correctly.", function() {
	expect( 4 );

	var element = $( "<a href='#'></a>" );
	element.button({ disabled: true }).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Anchor button should remain disabled after refresh" ); //See #8237

	element = $( "<div></div>" );
	element.button({ disabled: true }).button( "refresh" );
	ok( element.button( "option", "disabled" ), "<div> buttons should remain disabled after refresh" );

	element = $( "<button></button>" );
	element.button( { disabled: true} ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "<button> should remain disabled after refresh");


	element = $( "<button></button>" );
	element.button( { disabled: true} ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a <button>'s disabled property should update the state after refresh."); //See #8828

});

})(jQuery);