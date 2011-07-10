/*
 * menu_core.js
 */


(function($) {

module("menu: core");

test("accessibility", function () {
	expect(5);
	var ac = $('#menu1').menu();
	var item0 = $("li:eq(0) a");

	ok( ac.hasClass("ui-menu ui-widget ui-widget-content ui-corner-all"), "menu class");
	equals( ac.attr("role"), "menu", "main role");
	ok( !ac.attr("aria-activedescendant"), "aria attribute not yet active");

	var item = ac.find( "li:first" ).find( "a" ).attr( "id", "xid" ).end();
	ac.menu( "focus", $.Event(), item );
	equals( ac.attr("aria-activedescendant"), "xid", "aria attribute, id from dom");

	var item = ac.find( "li:last" );
	ac.menu( "focus", $.Event(), item );
	equals( ac.attr("aria-activedescendant"), "menu1-4", "aria attribute, generated id");
});

test("items class and role", function () {
	var ac = $('#menu1').menu();
	expect(1 + 5 * $("li",ac).length);
	ok( ($("li",ac).length > 0 ), "number of menu items");
	$("li",ac).each(function(item) {
		ok( $(this).hasClass("ui-menu-item"), "menu item ("+ item + ") class for item");
		equals( $(this).attr("role"), "presentation", "menu item ("+ item + ") role");
		equals( $("a", this).attr("role"), "menuitem", "menu item ("+ item + ") role");
		ok( $("a",this).hasClass("ui-corner-all"), "a element class for menu item ("+ item + ") ");
		equals( $("a",this).attr("tabindex"), "-1", "a element tabindex for menu item ("+ item + ") ");
	});
});

})(jQuery);
