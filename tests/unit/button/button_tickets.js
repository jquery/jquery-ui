/*
 * button_tickets.js
 */
(function($) {

module("button: tickets");

test("#5946 - buttonset should ignore buttons that are not :visible", function() {
	$( "#radio01" ).next().wrap( "<div></div>" ).parent().hide();
	var set = $( "#radio0" ).buttonset();
	ok( set.find( "label:eq(0)" ).is( ".ui-button:not(.ui-corner-left)" ) );
	ok( set.find( "label:eq(1)" ).is( ".ui-button.ui-corner-left" ) );
});

})(jQuery);
