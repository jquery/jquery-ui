(function ($) {

    module("selectmenu: options", {
        setup: function () {
            this.element = $("#speed");
            this.element.selectmenu();
        }
    });

    test("appendTo another element", function () {
        expect(1);

        ok(this.element.selectmenu("option", "appendTo", "#qunit-fixture"), "appendTo accepts selector");
    });

    test("dropdown false", function () {
        expect(1);

        ok(this.element.selectmenu("option", "dropdown", false), "accepts false");
    });

    test("value in sync with selected item", function () {
        expect(1);

        var widget = this.element.selectmenu("widget"),
            menu = widget.filter(".ui-selectmenu-menu");

        menu.find(".ui-menu-item").eq(0).simulate("click");

        equals(this.element.selectmenu("option", "value"), "Slower", "should be set to first option");
    });

})(jQuery);
