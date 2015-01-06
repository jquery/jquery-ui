/*
 * button_core.js
 */


(function($) {

module( "Button: core deprecated" );

test( "Calling button on a checkbox input calls checkboxradio widget", function(){
	var checkbox = $( "#checkbox01" );

	expect( 2 );
	checkbox.button();

	equal( checkbox.is( ":ui-checkboxradio" ), true,
		"Calling button on a checkbox creats checkboxradio instance" );
	equal( checkbox.checkboxradio( "option", "icon" ), false,
		"Calling button on a checkbox sets the checkboxradio icon option to false" );
});
test( "Calling buttonset calls controlgroup", function(){
	var controlgroup = $( ".buttonset" );

	expect( 1 );
	controlgroup.buttonset();

	equal( controlgroup.is( ":ui-controlgroup" ), true,
		"Calling buttonset creats controlgroup instance" );
});
})(jQuery);
