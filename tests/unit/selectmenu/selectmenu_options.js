(function ($) {

module("selectmenu: options");

test("appendTo another element", function () {
	expect(2);
	
	element = $("#speed").selectmenu();
	
	ok(element.selectmenu("option", "appendTo", "#qunit-fixture"), "appendTo accepts selector");
	ok($("#qunit-fixture").find(".ui-selectmenu-menu").length, "selectmenu appendedTo other element");
});


test("dropdown: CSS styles", function () {
	expect(2);

	var element = $("#speed").selectmenu(),
		button = element.selectmenu("widget"),
		menu = element.selectmenu("menuWidget");

	element.selectmenu("open");
	ok( button.hasClass("ui-corner-top") && !button.hasClass("ui-corner-all") && button.find("span.ui-icon").hasClass("ui-icon-triangle-1-s"), "button styles dropdown");
	ok( menu.hasClass("ui-corner-bottom") && !menu.hasClass("ui-corner-all"), "menu styles dropdown");
});

test("pop-up: CSS styles", function () {
	expect(2);

	var element = $("#speed").selectmenu({
			dropdown: false
		}),
		button = element.selectmenu("widget"),
		menu = element.selectmenu("menuWidget");

	element.selectmenu("close");
	ok( !button.hasClass("ui-corner-top") && button.hasClass("ui-corner-all") && button.find("span.ui-icon").hasClass("ui-icon-triangle-2-n-s"), "button styles pop-up");
	ok( !menu.hasClass("ui-corner-bottom") && menu.hasClass("ui-corner-all"), "menu styles pop-up");
});

})(jQuery);
