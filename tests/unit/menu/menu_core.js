/*
 * menu_core.js
 */


(function($) {

module("menu: core");

test("accessibility", function () {
	expect(3);
	var ac = $('#menu1').menu();
	var item0 = $("li:eq(0) a");

	ok( ac.hasClass("ui-menu ui-widget ui-widget-content ui-corner-all"), "menu class");
	equals( ac.attr("role"), "listbox", "main role");
	equals( ac.attr("aria-activedescendant"), "ui-active-menuitem", "aria attribute");
});

test("items class and role", function () {
	var ac = $('#menu1').menu();
	expect(1 + 4 * $("li",ac).length);
	ok( ($("li",ac).length > 0 ), "number of menu items");
	$("li",ac).each(function(item) {
		ok( $(this).hasClass("ui-menu-item"), "menu item ("+ item + ") class for item");
		equals( $(this).attr("role"), "menuitem", "menu item ("+ item + ") role");
		ok( $("a",this).hasClass("ui-corner-all"), "a element class for menu item ("+ item + ") ");
		equals( $("a",this).attr("tabindex"), "-1", "a element tabindex for menu item ("+ item + ") ");
	});
});

})(jQuery);
