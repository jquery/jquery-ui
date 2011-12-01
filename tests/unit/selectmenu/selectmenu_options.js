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

    test("dropdown false", function () {
        expect(1);

        ok(this.element.selectmenu("option", "dropdown", false), "accepts false");
    });

    test("value option", function () {
        expect(1);

        this.element.selectmenu("option", "value", "jQuery UI");

        equals(this.element.selectmenu("option", "value"), "jQuery UI", "should be set to 'jQuery UI'");
    });

})(jQuery);
