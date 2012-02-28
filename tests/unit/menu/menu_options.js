/*
 * menu_options.js
 */
(function($) {

module("menu: options");

test( "{ disabled: true }", function() {
	expect( 2 );
	var menu = $( "#menu1" ).menu({
		disabled: true,
		select: function(event, ui) {
			menu_log();
		}
	});
	ok(menu.is(".ui-state-disabled"),"Missing ui-state-disabled class");
	menu_log("click",true);
	menu_click(menu,"1");
	menu_log("afterclick");
	equal( $("#log").html(), "afterclick,click,", "Click order not valid.");
});

test( "{ disabled: false }", function() {
	expect( 2 );
	var menu = $( "#menu1" ).menu({
		disabled: false,
		select: function(event, ui) {
			menu_log();
		}
	});
	ok(menu.not(".ui-state-disabled"),"Has ui-state-disabled class");
	menu_log("click",true);
	menu_click(menu,"1");
	menu_log("afterclick");
	equal( $("#log").html(), "afterclick,1,click,", "Click order not valid.");
});

})(jQuery);
