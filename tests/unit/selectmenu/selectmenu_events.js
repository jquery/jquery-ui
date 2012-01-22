(function ($) {

module("selectmenu: events", {
	setup: function () {
		this.element = $("#speed");
	}
});

test("change", function () {
	expect(5);

	this.element.selectmenu({
		change: function (event, ui) {
			ok(event, "change event fired on change");
			equals(event.type, "selectmenuchange", "event type set to selectmenuchange");
			ok(ui, "ui object is passed as second argument to event handler");
			equals(ui.item.element[0].nodeName, "OPTION", "ui.item.element[0] points to original option element");
			equals(ui.item.value, value, "ui.item.value property updated correctly");                
		}
	});

	var widget = this.element.selectmenu("widget"),
		menu = widget.filter(".ui-selectmenu-menu"),
		button = widget.filter(".ui-selectmenu-button"),
		link = button.find("a"),
		value = this.element.find("option").first().text();
		
	link.simulate( "focus" );
	link.simulate( "click" );
	menu.find("a").first().simulate( "mouseover" ).simulate( "click" );
});


test("close", function () {
	expect(3);

	this.element.selectmenu({
		close: function (event, ui) {
			ok(event, "close event fired on close");
			equals(event.type, "selectmenuclose", "event type set to selectmenuclose");
			ok(ui, "ui object is passed as second argument to event handler");
		}
	});

	var widget = this.element.selectmenu("widget"),
		button = widget.filter(".ui-selectmenu-button"),
		link = button.find("a");
		
	link.simulate( "focus" );
	this.element.selectmenu("open").selectmenu("close");
});


test("focus", function () {
	expect(4);

	var counter = 0;

	this.element.selectmenu({
		focus: function (event, ui) {
			counter++;
			if (counter === 1) {
				ok(event, "focus event fired on mouseover");
				equals(event.type, "selectmenufocus", "event type set to selectmenufocus");
				ok(ui, "ui object is passed as second argument to event handler");
				equals(ui.item.element[0].nodeName, "OPTION", "ui points to original option element");
			}
		}
	});

	var widget = this.element.selectmenu("widget"),
		button = widget.filter(".ui-selectmenu-button"),
		link = button.find("a"),
		menu = widget.filter(".ui-selectmenu-menu");

	link.simulate( "focus" );
	link.simulate( "click" );
	menu.find(".ui-menu-item").simulate("mouseover");
});


test("open", function () {
	expect(3);

	this.element.selectmenu({
		open: function (event, ui) {
			ok(event, "open event fired on open");
			equals(event.type, "selectmenuopen", "event type set to selectmenuopen");
			ok(ui, "ui object is passed as second argument to event handler");
		}
	});

	var widget = this.element.selectmenu("widget"),
		button = widget.filter(".ui-selectmenu-button"),
		link = button.find("a");
		
	link.simulate( "focus" );
	this.element.selectmenu("open");
});


test("select", function () {
	expect(4);

	this.element.selectmenu({
		select: function (event, ui) {
			ok(event, "select event fired on item select");
			equals(event.type, "selectmenuselect", "event type set to selectmenuselect");
			ok(ui, "ui object is passed as second argument to event handler");
			equals(ui.item.element[0].nodeName, "OPTION", "ui points to original option element");
		}
	});

	var widget = this.element.selectmenu("widget"),
		button = widget.filter(".ui-selectmenu-button"),
		link = button.find("a"),
		menu = widget.filter(".ui-selectmenu-menu");

	link.simulate( "focus" );
	link.simulate( "click" );
	menu.find("a").first().simulate( "mouseover" ).simulate("click");
});

})(jQuery);
