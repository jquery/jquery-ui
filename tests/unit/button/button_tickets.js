/*
 * button_tickets.js
 */
(function( $ ) {

module( "button: tickets" );

test( "#5946 - buttonset should ignore buttons that are not :visible", function() {
	$( "#radio01" ).next().andSelf().hide();
	var set = $( "#radio0" ).buttonset({ items: ":radio:visible" });
	ok( set.find( "label:eq(0)" ).is( ":not(.ui-button):not(.ui-corner-left)" ) );
	ok( set.find( "label:eq(1)" ).is( ".ui-button.ui-corner-left" ) );
});

test( "#6262 - buttonset not applying ui-corner to invisible elements", function() {
	$( "#radio0" ).hide();
	var set = $( "#radio0" ).buttonset();
	ok( set.find( "label:eq(0)" ).is( ".ui-button.ui-corner-left" ) );
	ok( set.find( "label:eq(1)" ).is( ".ui-button" ) );
	ok( set.find( "label:eq(2)" ).is( ".ui-button.ui-corner-right" ) );
});

})( jQuery );
