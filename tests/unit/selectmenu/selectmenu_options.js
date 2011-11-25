(function ($) {

    module("selectmenu: options", {
        setup: function () {
            this.element = $("#speed");
            this.element.selectmenu();
        }
    });

    test("{ appendTo: default }", function () {
        expect(1);

        equals(this.element.selectmenu("option", "appendTo"), "body", "should be appended to <body> by default");
    });

    test("appendTo another element", function () {
        expect(1);

        ok(this.element.selectmenu("option", "appendTo", "#qunit-fixture"), "appendTo accepts selector");
    });

    test("{ dropdown: default }", function () {
        expect(1);

        equals(this.element.selectmenu("option", "dropdown"), true, "should be true by default");
    });

    test("dropdown false", function () {
        expect(1);

        ok(this.element.selectmenu("option", "dropdown", false), "accepts false");
    });

    test("{ position: default }", function () {
        expect(4);

        var pos = this.element.selectmenu("option", "position");

        ok(typeof (pos) === "object", "position should be of type 'object'");
        equals(pos.my, "left top", "my should be 'left top' by default");
        equals(pos.at, "left bottom", "at should be 'left bottom' by default");
        equals(pos.collision, "none", "collision should be 'none' by default")
    });

    test("{ value: default }", function () {
        expect(1);

        equals(this.element.selectmenu("option", "value"), "Medium", "should reflect selected value of underlying select");
    });

    test("value in sync with selected item", function () {
        expect(1);

        var widget = this.element.selectmenu("widget"),
            menu = widget.filter(".ui-selectmenu-menu");

        menu.find(".ui-menu-item").eq(0).simulate("click");

        equals(this.element.selectmenu("option", "value"), "Slower", "should be set to first option");
    });

})(jQuery);
