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

})(jQuery);
