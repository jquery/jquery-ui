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

	ok(btn.parent().hasClass('ui-dialog-buttonpane'), "buttons in container");
	btn.trigger("click");

	var newButtons = {
		"Close": function(ev, ui) {
			ok(true, "button click fires callback");
			equals(this, el[0], "context of callback");
			equals(ev.target, btn[0], "event target");
		}
	};

	equals(el.data("buttons.dialog"), buttons, '.data("buttons.dialog") getter');
	el.data("buttons.dialog", newButtons);
	equals(el.data("buttons.dialog"), newButtons, '.data("buttons.dialog", ...) setter');

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

test("closeOnEscape", function() {
	ok(false, 'missing test - untested code is broken code');
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
		el.data('draggable.dialog', true);
		shouldmove();
	el.remove();

	el = $('<div></div>').dialog({ draggable: true });
		shouldmove();
		el.data('draggable.dialog', false);
		shouldnotmove();
	el.remove();
});

test("height", function() {
	expect(3);

	el = $('<div></div>').dialog();
		equals(dlg().height(), dialog_defaults.minHeight, "default height");
	el.remove();

	el = $('<div></div>').dialog({ height: 437 });
		equals(dlg().height(), 437, "explicit height");
	el.remove();

	el = $('<div></div>').dialog();
		el.data('height.dialog', 438);
		equals(dlg().height(), 438, "explicit height set after init");
	el.remove();
});

test("maxHeight", function() {
	expect(3);

	el = $('<div></div>').dialog({ maxHeight: 400 });
		drag('.ui-resizable-s', 1000, 1000);
		equals(heightAfter, 400, "maxHeight");
	el.remove();

	el = $('<div></div>').dialog({ maxHeight: 400 });
		drag('.ui-resizable-n', -1000, -1000);
		equals(heightAfter, 400, "maxHeight");
	el.remove();

	el = $('<div></div>').dialog({ maxHeight: 400 }).data('maxHeight.dialog', 600);
		drag('.ui-resizable-n', -1000, -1000);
		equals(heightAfter, 600, "maxHeight");
	el.remove();
});

test("maxWidth", function() {
	expect(3);

	el = $('<div></div>').dialog({ maxWidth: 400 });
		drag('.ui-resizable-e', 1000, 1000);
		equals(widthAfter, 400, "maxWidth");
	el.remove();

	el = $('<div></div>').dialog({ maxWidth: 400 });
		drag('.ui-resizable-w', -1000, -1000);
		equals(widthAfter, 400, "maxWidth");
	el.remove();

	el = $('<div></div>').dialog({ maxWidth: 400 }).data('maxWidth.dialog', 600);
		drag('.ui-resizable-w', -1000, -1000);
		equals(widthAfter, 600, "maxWidth");
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

	el = $('<div></div>').dialog({ minHeight: 10 }).data('minHeight.dialog', 30);
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

	el = $('<div></div>').dialog({ minWidth: 30 }).data('minWidth.dialog', 30);
		drag('.ui-resizable-w', 1000, 1000);
		equals(widthAfter, 30, "minWidth");
	el.remove();
});

test("modal", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("position", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("resizable", function() {
	expect(4);

	el = $('<div></div>').dialog();
		shouldresize("[default]");
		el.data('resizable.dialog', false);
		shouldnotresize('disabled after init');
	el.remove();

	el = $('<div></div>').dialog({ resizable: false });
		shouldnotresize("disabled in init options");
		el.data('resizable.dialog', true);
		shouldresize('enabled after init');
	el.remove();
});

test("stack", function() {
	ok(false, 'missing test - untested code is broken code');
});

test("title", function() {
	expect(5);

	function titleText() {
		return dlg().find(".ui-dialog-title").html();
	}

	el = $('<div></div>').dialog();
		equals(titleText(), "&nbsp;", "[default]");
	el.remove();

	el = $('<div title="foo"/>').dialog();
		equals(titleText(), "foo", "title in element attribute");
	el.remove();

	el = $('<div></div>').dialog({ title: 'foo' });
		equals(titleText(), "foo", "title in init options");
	el.remove();

	el = $('<div title="foo"/>').dialog({ title: 'bar' });
		equals(titleText(), "bar", "title in init options should override title in element attribute");
	el.remove();

	el = $('<div></div>').dialog().data('title.dialog', 'foo');
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
		el.data('width.dialog', 438);
		equals(dlg().width(), 438, 'explicit width after init');
	el.remove();
});

})(jQuery);
