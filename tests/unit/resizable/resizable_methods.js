/*
 * resizable_methods.js
 */
(function($) {

module( "resizable: methods" );

test( "disable", function() {
	expect( 5 );

	var element = $( "#resizable1" ).resizable({ disabled: false }),
		chainable = element.resizable( "disable" );

	ok( !element.resizable( "widget" ).hasClass( "ui-state-disabled" ), "element does not get ui-state-disabled" );
	ok( !element.resizable( "widget" ).attr( "aria-disabled" ), "element does not get aria-disabled" );
	ok( element.resizable( "widget" ).hasClass( "ui-resizable-disabled" ), "element gets ui-resizable-disabled" );
	equal( element.resizable( "option", "disabled" ), true, "disabled option setter" );
	equal( chainable, element, "disable is chainable" );
});

})(jQuery);
