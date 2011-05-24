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

test( "#7092 - button creation that requires a matching label does not find label in all cases", function() {
	var group = $( "<span><label for='t7092a'/><input type='checkbox' id='t7092a'/></span>" );
	group.find( "input:checkbox" ).button();
	ok( group.find( "label" ).is( ".ui-button" ) );

	group = $( "<input type='checkbox' id='t7092b'/><label for='t7092b'/>" );
	group.filter( "input:checkbox" ).button();
	ok( group.filter( "label" ).is( ".ui-button" ) );

	group = $( "<span><input type='checkbox' id='t7092c'/></span><label for='t7092c'/>" );
	group.find( "input:checkbox" ).button();
	ok( group.filter( "label" ).is( ".ui-button" ) );

	group = $( "<span><input type='checkbox' id='t7092d'/></span><span><label for='t7092d'/></span>" );
	group.find( "input:checkbox" ).button();
	ok( group.find( "label" ).is( ".ui-button" ) );

	group = $( "<input type='checkbox' id='t7092e'/><span><label for='t7092e'/></span>" );
	group.filter( "input:checkbox" ).button();
	ok( group.find( "label" ).is( ".ui-button" ) );
});

})( jQuery );
