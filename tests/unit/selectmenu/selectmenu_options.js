(function ($) {

    module("selectmenu: options", {
        setup: function () {
            this.element = $("#speed");
            this.element.selectmenu();
        }
    });

    test("appendTo another element", function () {
        expect(2);

        ok(this.element.selectmenu("option", "appendTo", "#qunit-fixture"), "appendTo accepts selector");
        ok($("#qunit-fixture").find(".ui-selectmenu-menu").length, "selectmenu appendedTo other element");
    });

    test("dropdown", function () {
        expect(2);

        var button = $("#speed-button"),
            widget = this.element.selectmenu("widget"),
            buttonPos = {
                l: button.offset().top,
                t: button.offset().left
            },
            menuPos = {
                l: widget.offset().top,
                t: widget.offset().left
            };

        equals(menuPos.t, buttonPos.t, "menu positioned below button in dropdown mode"); //button has no height

        ok(this.element.selectmenu("option", "dropdown", false), "accepts false");
    });

    test("value option", function () {
        expect(1);

        var value = this.element.find("option").eq(0).text();

        this.element.selectmenu("option", "value", value);

        equals(this.element.selectmenu("option", "value"), value, "should be set to " + value);
    });

})(jQuery);
