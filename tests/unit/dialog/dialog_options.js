/*
 * dialog_options.js
 */
(function($) {

module("dialog: options");

test("autoOpen", function() {
	expect(2);

	el = $('<div></div>').dialog({ autoOpen: false });
		isNotOpen('.dialog({ autoOpen: false })');
	el.remove();

	el = $('<div></div>').dialog({ autoOpen: true });
		isOpen('.dialog({ autoOpen: true })');
	el.remove();
});

test("buttons", function() {
	expect(17);

	var buttons = {
		"Ok": function(ev, ui) {
			ok(true, "button click fires callback");
			equals(this, el[0], "context of callback");
			equals(ev.target, btn[0], "event target");
		},
		"Cancel": function(ev, ui) {
			ok(true, "button click fires callback");
			equals(this, el[0], "context of callback");
			equals(ev.target, btn[1], "event target");
		}
	};

	el = $('<div></div>').dialog({ buttons: buttons });
	var btn = $("button", dlg());
	equals(btn.length, 2, "number of buttons");

	var i = 0;
	$.each(buttons, function(key, val) {
		equals(btn.eq(i).text(), key, "text of button " + (i+1));
		i++;
	});

	ok(btn.parent().hasClass('ui-dialog-buttonset'), "buttons in container");
	btn.trigger("click");

	var newButtons = {
		"Close": function(ev, ui) {
			ok(true, "button click fires callback");
			equals(this, el[0], "context of callback");
			equals(ev.target, btn[0], "event target");
		}
	};

	same(el.dialog("option", "buttons"), buttons, '.dialog("option", "buttons") getter');
	el.dialog("option", "buttons", newButtons);
	same(el.dialog("option", "buttons"), newButtons, '.dialog("option", "buttons", ...) setter');

	btn = $("button", dlg());
	equals(btn.length, 1, "number of buttons after setter");
	btn.trigger('click');

	i = 0;
	$.each(newButtons, function(key, val) {
		equals(btn.eq(i).text(), key, "text of button " + (i+1));
		i += 1;
	});

	el.remove();
});

test("buttons - advanced", function() {
	expect(5);

	el = $("<div></div>").dialog({
		buttons: [
			{
				text: "a button",
				"class": "additional-class",
				id: "my-button-id",
				click: function() {
					equals(this, el[0], "correct context");
				}
			}
		]
	});
	var buttons = dlg().find("button");
	equals(buttons.length, 1, "correct number of buttons");
	equals(buttons.attr("id"), "my-button-id", "correct id");
	equals(buttons.text(), "a button", "correct label");
	ok(buttons.hasClass("additional-class"), "additional classes added");
	buttons.click();

	el.remove();
});

test("closeOnEscape", function() {
	el = $('<div></div>').dialog({ closeOnEscape: false });
	ok(true, 'closeOnEscape: false');
	ok(dlg().is(':visible') && !dlg().is(':hidden'), 'dialog is open before ESC');
	el.simulate('keydown', { keyCode: $.ui.keyCode.ESCAPE })
		.simulate('keypress', { keyCode: $.ui.keyCode.ESCAPE })
		.simulate('keyup', { keyCode: $.ui.keyCode.ESCAPE });
	ok(dlg().is(':visible') && !dlg().is(':hidden'), 'dialog is open after ESC');
	
	el.remove();
	
	el = $('<div></div>').dialog({ closeOnEscape: true });
	ok(true, 'closeOnEscape: true');
	ok(dlg().is(':visible') && !dlg().is(':hidden'), 'dialog is open before ESC');
	el.simulate('keydown', { keyCode: $.ui.keyCode.ESCAPE })
		.simulate('keypress', { keyCode: $.ui.keyCode.ESCAPE })
		.simulate('keyup', { keyCode: $.ui.keyCode.ESCAPE });
	ok(dlg().is(':hidden') && !dlg().is(':visible'), 'dialog is closed after ESC');
});

test("closeText", function() {
	expect(3);

	el = $('<div></div>').dialog();
		equals(dlg().find('.ui-dialog-titlebar-close span').text(), 'close',
			'default close text');
	el.remove();

	el = $('<div></div>').dialog({ closeText: "foo" });
		equals(dlg().find('.ui-dialog-titlebar-close span').text(), 'foo',
			'closeText on init');
	el.remove();

	el = $('<div></div>').dialog().dialog('option', 'closeText', 'bar');
		equals(dlg().find('.ui-dialog-titlebar-close span').text(), 'bar',
			'closeText via option method');
	el.remove();
});

test("dialogClass", function() {
	expect(4);

	el = $('<div></div>').dialog();
		equals(dlg().is(".foo"), false, 'dialogClass not specified. foo class added');
	el.remove();

	el = $('<div></div>').dialog({ dialogClass: "foo" });
		equals(dlg().is(".foo"), true, 'dialogClass in init. foo class added');
	el.remove();

	el = $('<div></div>').dialog({ dialogClass: "foo bar" });
		equals(dlg().is(".foo"), true, 'dialogClass in init, two classes. foo class added');
		equals(dlg().is(".bar"), true, 'dialogClass in init, two classes. bar class added');
	el.remove();
});

test("draggable", function() {
	expect(4);

	el = $('<div></div>').dialog({ draggable: false });
		shouldnotmove();
		el.dialog('option', 'draggable', true);
		shouldmove();
	el.remove();

	el = $('<div></div>').dialog({ draggable: true });
		shouldmove();
		el.dialog('option', 'draggable', false);
		shouldnotmove();
	el.remove();
});

test("height", function() {
	expect(3);

	el = $('<div></div>').dialog();
		equals(dlg().height(), dialog_defaults.minHeight, "default height");
	el.remove();

	el = $('<div></div>').dialog({ height: 237 });
		equals(dlg().height(), 237, "explicit height");
	el.remove();

	el = $('<div></div>').dialog();
		el.dialog('option', 'height', 238);
		equals(dlg().height(), 238, "explicit height set after init");
	el.remove();
});

test("maxHeight", function() {
	expect(3);

	el = $('<div></div>').dialog({ maxHeight: 200 });
		drag('.ui-resizable-s', 1000, 1000);
		equals(heightAfter, 200, "maxHeight");
	el.remove();

	el = $('<div></div>').dialog({ maxHeight: 200 });
		drag('.ui-resizable-n', -1000, -1000);
		equals(heightAfter, 200, "maxHeight");
	el.remove();

	el = $('<div></div>').dialog({ maxHeight: 200 }).dialog('option', 'maxHeight', 300);
		drag('.ui-resizable-s', 1000, 1000);
		equals(heightAfter, 300, "maxHeight");
	el.remove();
});

test("maxWidth", function() {
	expect(3);

	el = $('<div></div>').dialog({ maxWidth: 200 });
		drag('.ui-resizable-e', 1000, 1000);
		equals(widthAfter, 200, "maxWidth");
	el.remove();

	el = $('<div></div>').dialog({ maxWidth: 200 });
		drag('.ui-resizable-w', -1000, -1000);
		equals(widthAfter, 200, "maxWidth");
	el.remove();

	el = $('<div></div>').dialog({ maxWidth: 200 }).dialog('option', 'maxWidth', 300);
		drag('.ui-resizable-w', -1000, -1000);
		equals(widthAfter, 300, "maxWidth");
	el.remove();
});

test("minHeight", function() {
	expect(3);

	el = $('<div></div>').dialog({ minHeight: 10 });
		drag('.ui-resizable-s', -1000, -1000);
		equals(heightAfter, 10, "minHeight");
	el.remove();

	el = $('<div></div>').dialog({ minHeight: 10 });
		drag('.ui-resizable-n', 1000, 1000);
		equals(heightAfter, 10, "minHeight");
	el.remove();

	el = $('<div></div>').dialog({ minHeight: 10 }).dialog('option', 'minHeight', 30);
		drag('.ui-resizable-n', 1000, 1000);
		equals(heightAfter, 30, "minHeight");
	el.remove();
});

test("minWidth", function() {
	expect(3);

	el = $('<div></div>').dialog({ minWidth: 10 });
		drag('.ui-resizable-e', -1000, -1000);
		equals(widthAfter, 10, "minWidth");
	el.remove();

	el = $('<div></div>').dialog({ minWidth: 10 });
		drag('.ui-resizable-w', 1000, 1000);
		equals(widthAfter, 10, "minWidth");
	el.remove();

	el = $('<div></div>').dialog({ minWidth: 30 }).dialog('option', 'minWidth', 30);
		drag('.ui-resizable-w', 1000, 1000);
		equals(widthAfter, 30, "minWidth");
	el.remove();
});

test("position, default center on window", function() {
	var el = $('<div></div>').dialog();
	var dialog = el.dialog('widget');
	var offset = dialog.offset();
	same(offset.left, Math.round($(window).width() / 2 - dialog.outerWidth() / 2) + $(window).scrollLeft());
	same(offset.top, Math.round($(window).height() / 2 - dialog.outerHeight() / 2) + $(window).scrollTop());
	el.remove();
});

test("position, top on window", function() {
	var el = $('<div></div>').dialog({ position: "top" });
	var dialog = el.dialog('widget');
	var offset = dialog.offset();
	same(offset.left, Math.round($(window).width() / 2 - dialog.outerWidth() / 2) + $(window).scrollLeft());
	same(offset.top, $(window).scrollTop());
	el.remove();
});

test("position, left on window", function() {
	var el = $('<div></div>').dialog({ position: "left" });
	var dialog = el.dialog('widget');
	var offset = dialog.offset();
	same(offset.left, 0);
	same(offset.top, Math.round($(window).height() / 2 - dialog.outerHeight() / 2) + $(window).scrollTop());
	el.remove();
});

test("position, right bottom on window", function() {
	var el = $('<div></div>').dialog({ position: "right bottom" });
	var dialog = el.dialog('widget');
	var offset = dialog.offset();
	same(offset.left, $(window).width() - dialog.outerWidth() + $(window).scrollLeft());
	same(offset.top, $(window).height() - dialog.outerHeight() + $(window).scrollTop());
	el.remove();
});

test("position, right bottom on window w/array", function() {
	var el = $('<div></div>').dialog({ position: ["right", "bottom"] });
	var dialog = el.dialog('widget');
	var offset = dialog.offset();
	same(offset.left, $(window).width() - dialog.outerWidth() + $(window).scrollLeft());
	same(offset.top, $(window).height() - dialog.outerHeight() + $(window).scrollTop());
	el.remove();
});

test("position, offset from top left w/array", function() {
	var el = $('<div></div>').dialog({ position: [10, 10] });
	var dialog = el.dialog('widget');
	var offset = dialog.offset();
	same(offset.left, 10 + $(window).scrollLeft());
	same(offset.top, 10 + $(window).scrollTop());
	el.remove();
});

test("position, right bottom at right bottom via ui.position args", function() {
	var el = $('<div></div>').dialog({
		position: {
			my: "right bottom",
			at: "right bottom"
		}
	});

	var dialog = el.dialog('widget');
	var offset = dialog.offset();

	same(offset.left, $(window).width() - dialog.outerWidth() + $(window).scrollLeft());
	same(offset.top, $(window).height() - dialog.outerHeight() + $(window).scrollTop());
	el.remove();
});

test("position, at another element", function() {
	var parent = $('<div></div>').css({
		position: 'absolute',
		top: 400,
		left: 600,
		height: 10,
		width: 10
	}).appendTo('body');

	var el = $('<div></div>').dialog({
		position: {
			my: "left top",
			at: "left top",
			of: parent
		}
	});

	var dialog = el.dialog('widget');
	var offset = dialog.offset();

	same(offset.left, 600);
	same(offset.top, 400);

	el.dialog('option', 'position', {
			my: "left top",
			at: "right bottom",
			of: parent
	});

	var offset = dialog.offset();

	same(offset.left, 610);
	same(offset.top, 410);

	el.remove();
	parent.remove();
});

test("resizable", function() {
	expect(4);

	el = $('<div></div>').dialog();
		shouldresize("[default]");
		el.dialog('option', 'resizable', false);
		shouldnotresize('disabled after init');
	el.remove();

	el = $('<div></div>').dialog({ resizable: false });
		shouldnotresize("disabled in init options");
		el.dialog('option', 'resizable', true);
		shouldresize('enabled after init');
	el.remove();
});

test("title", function() {
	expect(9);

	function titleText() {
		return dlg().find(".ui-dialog-title").html();
	}

	el = $('<div></div>').dialog();
		// some browsers return a non-breaking space and some return "&nbsp;"
		// so we get the text to normalize to the actual non-breaking space
		equals(dlg().find(".ui-dialog-title").text(), " ", "[default]");
		equals(el.dialog("option", "title"), "", "option not changed");
	el.remove();

	el = $('<div title="foo"/>').dialog();
		equals(titleText(), "foo", "title in element attribute");
		equals(el.dialog("option", "title"), "foo", "option updated from attribute");
	el.remove();

	el = $('<div></div>').dialog({ title: 'foo' });
		equals(titleText(), "foo", "title in init options");
		equals(el.dialog("option", "title"), "foo", "opiton set from options hash");
	el.remove();

	el = $('<div title="foo"/>').dialog({ title: 'bar' });
		equals(titleText(), "bar", "title in init options should override title in element attribute");
		equals(el.dialog("option", "title"), "bar", "opiton set from options hash");
	el.remove();

	el = $('<div></div>').dialog().dialog('option', 'title', 'foo');
		equals(titleText(), 'foo', 'title after init');
	el.remove();
});

test("width", function() {
	expect(3);

	el = $('<div></div>').dialog();
		equals(dlg().width(), dialog_defaults.width, "default width");
	el.remove();

	el = $('<div></div>').dialog({width: 437 });
		equals(dlg().width(), 437, "explicit width");
		el.dialog('option', 'width', 438);
		equals(dlg().width(), 438, 'explicit width after init');
	el.remove();
});

})(jQuery);
