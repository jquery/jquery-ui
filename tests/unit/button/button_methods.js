/*
 * button_methods.js
 */
(function($) {


module("button: methods");

test("destroy", function() {
	expect( 1 );
	domEqual( "#button", function() {
		$( "#button" ).button().button( "destroy" );
	});
});

test( "refresh: Ensure disabled state is preserved correctly.", function() {
	expect( 8 );

	var element = $( "<a href='#'></a>" );
	element.button({ disabled: true }).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Anchor button should remain disabled after refresh" ); //See #8237

	element = $( "<div></div>" );
	element.button({ disabled: true }).button( "refresh" );
	ok( element.button( "option", "disabled" ), "<div> buttons should remain disabled after refresh" );

	element = $( "<button></button>" );
	element.button( { disabled: true} ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "<button> should remain disabled after refresh");

	element = $( "<input type='checkbox'>" );
	element.button( { disabled: true} ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Checkboxes should remain disabled after refresh");

	element = $( "<input type='radio'>" );
	element.button( { disabled: true} ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Radio buttons should remain disabled after refresh");

	element = $( "<button></button>" );
	element.button( { disabled: true} ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a <button>'s disabled property should update the state after refresh."); //See #8828

	element = $( "<input type='checkbox'>" );
	element.button( { disabled: true} ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a checkbox's disabled property should update the state after refresh.");

	element = $( "<input type='radio'>" );
	element.button( { disabled: true} ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a radio button's disabled property should update the state after refresh.");
});

test( "ui-state-active should always be removed when setting disabled true", function() {
	expect( 8 );
	var elements = [
		$( "<input type='button'>" ).button(),
		$( "<button></button>" ).button(),
		$( "<label for='radio'></label><input type='radio' id='radio'>" ).button(),
		$( "<label for='checkbox'></label><input type='checkbox' id='checkbox'>" ).button()
	];

	$.each( elements, function( index, element ) {

		element.trigger( "mousedown" );
		ok( element.hasClass( "ui-state-active" ), "On mousedown, element has ui-state-active class" );

		element.button( "option", "disabled", true );
		if ( element.is( "input:button, button" ) ) {
			ok( !element.hasClass( "ui-state-active" ), "Disabled button does not have ui-state-active class" );
		} else {
			ok( element.hasClass( "ui-state-active" ), "Disabled radio, or checkbox has ui-state-active class" );
		}
	});
});

})(jQuery);
