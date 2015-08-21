define( [
	"jquery",
	"ui/widgets/button"
], function( $ ) {

module( "button: methods" );

test( "destroy", function( assert ) {
	expect( 1 );
	assert.domEqual( "#button", function() {
		$( "#button" ).button().button( "destroy" );
	} );
} );

test( "refresh: Ensure disabled state is preserved correctly.", function() {
	expect( 8 );

	var element = $( "<a href='#'></a>" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Anchor button should remain disabled after refresh" ); //See #8237

	element = $( "<div></div>" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "<div> buttons should remain disabled after refresh" );

	element = $( "<button></button>" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "<button> should remain disabled after refresh" );

	element = $( "<input type='checkbox'>" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Checkboxes should remain disabled after refresh" );

	element = $( "<input type='radio'>" );
	element.button( { disabled: true } ).button( "refresh" );
	ok( element.button( "option", "disabled" ), "Radio buttons should remain disabled after refresh" );

	element = $( "<button></button>" );
	element.button( { disabled: true } ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a <button>'s disabled property should update the state after refresh." ); //See #8828

	element = $( "<input type='checkbox'>" );
	element.button( { disabled: true } ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a checkbox's disabled property should update the state after refresh." );

	element = $( "<input type='radio'>" );
	element.button( { disabled: true } ).prop( "disabled", false ).button( "refresh" );
	ok( !element.button( "option", "disabled" ), "Changing a radio button's disabled property should update the state after refresh." );
} );

// #8975
test( "refresh: buttonset should turn added elements into button widgets", function() {
	expect( 2 );
	var radioButtonset = $( "#radio0" ).buttonset(),
		checkboxButtonset = $( "#checkbox0" ).buttonset();

	radioButtonset.append(
		"<input type='radio' name='radio' id='radio04'>" +
		"<label for='radio04'>Choice 4</label>"
	);
	checkboxButtonset.append(
		"<input type='checkbox' name='checkbox' id='checkbox04'>" +
		"<label for='checkbox04'>Choice 4</label>"
	);

	radioButtonset.buttonset( "refresh" );
	checkboxButtonset.buttonset( "refresh" );

	equal( radioButtonset.find( ":ui-button" ).length, 4, "radio" );
	equal( checkboxButtonset.find( ":ui-button" ).length, 4, "checkbox" );
} );

} );
