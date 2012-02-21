(function ($) {

module("selectmenu: options", {
	setup: function () {
		this.element = $("#speed").selectmenu();
	}
});

test("appendTo another element", function () {
	expect(2);

	ok(this.element.selectmenu("option", "appendTo", "#qunit-fixture"), "appendTo accepts selector");
	ok($("#qunit-fixture").find(".ui-selectmenu-menu").length, "selectmenu appendedTo other element");
});


test("dropdown: CSS styles", function () {
	expect(4);

	var button = this.element.selectmenu("widget").parent(),
		ul = this.element.selectmenu("menuWidget"),
		link = button.find("a");

	this.element.selectmenu("open");
	ok( link.hasClass("ui-corner-top") && !link.hasClass("ui-corner-all"), "button styles dropdown");
	ok( ul.hasClass("ui-corner-bottom") && !ul.hasClass("ui-corner-all"), "menu styles dropdown");

	this.element.selectmenu("close");
	this.element.selectmenu("option", "dropdown", false);
	this.element.selectmenu("open");
	ok( !link.hasClass("ui-corner-top") && link.hasClass("ui-corner-all"), "button styles pop-up");
	ok( !ul.hasClass("ui-corner-bottom") && ul.hasClass("ui-corner-all"), "menu styles pop-up");
});

})(jQuery);
