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
			equal(event.type, "selectmenuchange", "event type set to selectmenuchange");
			ok(ui, "ui object is passed as second argument to event handler");
			equal(ui.item.element[0].nodeName, "OPTION", "ui.item.element[0] points to original option element");
			equal(ui.item.value, value, "ui.item.value property updated correctly");
		}
	});

	var button = this.element.selectmenu("widget").parent(),
		menu = this.element.selectmenu("menuWidget").parent(),
		value = this.element.find("option").first().text();

	button.find("a").simulate( "focus" ).simulate( "click" );
	menu.find("a").first().simulate( "mouseover" ).trigger( "click" );
});


test("close", function () {
	expect(3);

	this.element.selectmenu({
		close: function (event, ui) {
			ok(event, "close event fired on close");
			equal(event.type, "selectmenuclose", "event type set to selectmenuclose");
			ok(ui, "ui object is passed as second argument to event handler");
		}
	});

	this.element.selectmenu("open").selectmenu("close");
});


test("focus", function () {
	expect(4);

	var button,
		menu,
		links;

	this.element.selectmenu({
		focus: function (event, ui) {
			ok(event, "focus event fired on mouseover");
			equal(event.type, "selectmenufocus", "event type set to selectmenufocus");
			ok(ui, "ui object is passed as second argument to event handler");
			equal(ui.item.element[0].nodeName, "OPTION", "ui points to original option element");
		}
	});
	
	button = this.element.selectmenu("widget"),
	menu = this.element.selectmenu("menuWidget");

	button.simulate( "focus" );
	links = menu.find("li.ui-menu-item a");
	
	button.simulate( "click" );
	
	menu.find("a").last().simulate( "mouseover" );
	
	this.element.selectmenu("close");
});


test("open", function () {
	expect(3);

	this.element.selectmenu({
		open: function (event, ui) {
			ok(event, "open event fired on open");
			equal(event.type, "selectmenuopen", "event type set to selectmenuopen");
			ok(ui, "ui object is passed as second argument to event handler");
		}
	});

	this.element.selectmenu("open");
});


test("select", function () {
	expect(4);

	this.element.selectmenu({
		select: function (event, ui) {
			ok(event, "select event fired on item select");
			equal(event.type, "selectmenuselect", "event type set to selectmenuselect");
			ok(ui, "ui object is passed as second argument to event handler");
			equal(ui.item.element[0].nodeName, "OPTION", "ui points to original option element");
		}
	});

	var button = this.element.selectmenu("widget").parent(),
		menu = this.element.selectmenu("menuWidget").parent();

	button.find("a").simulate( "focus" ).simulate( "click" );
	menu.find("a").first().simulate( "mouseover" ).trigger("click");
});

})(jQuery);
