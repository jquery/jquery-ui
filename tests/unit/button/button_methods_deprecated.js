/*
 * button_methods.js
 */
(function($) {

module( "Button: methods deprecated" );

test( "destroy", function() {
	expect( 1 );
	domEqual( "#checkbox02", function() {
		$( "#checkbox02" ).button().button( "destroy" );
	});
});

test( "refresh: Ensure disabled state is preserved correctly.", function() {
	expect( 4 );
	var element = null;

	element = $( "#checkbox02" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Checkboxes should remain disabled after refresh");

	element = $( "#radio02" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Radio buttons should remain disabled after refresh");

	element = $( "#checkbox02" );
	element.button( { disabled: true} ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a checkbox's disabled property should update the state after refresh.");

	element = $( "#radio02" );
	element.button( { disabled: true} ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a radio button's disabled property should update the state after refresh.");

});

})(jQuery);