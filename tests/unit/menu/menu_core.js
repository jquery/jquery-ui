/*
 * menu_core.js
 */


(function($) {

module("menu: core");

test("accessibility", function () {
	expect(5);
	var menu = $('#menu1').menu();
	var item0 = $("li:eq(0) a");

	ok( menu.hasClass("ui-menu ui-widget ui-widget-content ui-corner-all"), "menu class");
	equal( menu.attr("role"), "menu", "main role");
	ok( !menu.attr("aria-activedescendant"), "aria attribute not yet active");

	var item = menu.find( "li:first" ).find( "a" ).attr( "id", "xid" ).end();
	menu.menu( "focus", $.Event(), item );
	equal( menu.attr("aria-activedescendant"), "xid", "aria attribute, id from dom");

	var item = menu.find( "li:last" );
	menu.menu( "focus", $.Event(), item );
	equal( menu.attr("aria-activedescendant"), "menu1-4", "aria attribute, generated id");
});

test("items class and role", function () {
	var menu = $('#menu1').menu();
	expect(1 + 5 * $("li",menu).length);
	ok( ($("li",menu).length > 0 ), "number of menu items");
	$("li",menu).each(function(item) {
		ok( $(this).hasClass("ui-menu-item"), "menu item ("+ item + ") class for item");
		equal( $(this).attr("role"), "presentation", "menu item ("+ item + ") role");
		equal( $("a", this).attr("role"), "menuitem", "menu item ("+ item + ") role");
		ok( $("a",this).hasClass("ui-corner-all"), "a element class for menu item ("+ item + ") ");
		equal( $("a",this).attr("tabindex"), "-1", "a element tabindex for menu item ("+ item + ") ");
	});
});

})(jQuery);
