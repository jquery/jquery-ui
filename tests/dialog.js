/*
 * dialog unit tests
 */
(function($) {
//
// Dialog Test Helper Functions
//

var defaults = {
	autoOpen: true,
	autoResize: true,
	buttons: {},
	closeOnEscape: true,
	closeText: 'close',
	disabled: false,
	dialogClass: undefined,
	draggable: true,
	height: 200,
	maxHeight: undefined,
	maxWidth: undefined,
	minHeight: 100,
	minWidth: 150,
	modal: false,
	overlay: {},
	position: 'center',
	resizable: true,
	stack: true,
	title: '',
	width: 300
};

var el,
	offsetBefore, offsetAfter,
	heightBefore, heightAfter,
	widthBefore, widthAfter,
	dragged;

function dlg() {
	return el.data("dialog").element.parents(".ui-dialog:first");
}

function isOpen(why) {
	ok(dlg().is(":visible"), why);
}

function isNotOpen(why) {
	ok(!dlg().is(":visible"), why);
}

function drag(handle, dx, dy) {
	var d = dlg();
	offsetBefore = d.offset();
	heightBefore = d.height();
	widthBefore = d.width();
	//this mouseover is to work around a limitation in resizable
	//TODO: fix resizable so handle doesn't require mouseover in order to be used
	$(handle, d).simulate("mouseover");
	$(handle, d).simulate("drag", {
		dx: dx || 0,
		dy: dy || 0
	});
	dragged = { dx: dx, dy: dy };
	offsetAfter = d.offset();
	heightAfter = d.height();
	widthAfter = d.width();
}

function moved(dx, dy, msg) {
	msg = msg ? msg + "." : "";
	var actual = { left: offsetAfter.left, top: offsetAfter.top };
	var expected = { left: offsetBefore.left + dx, top: offsetBefore.top + dy };
	same(actual, expected, 'dragged[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
}

function shouldmove(why) {
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	moved(50, 50, why);
}

function shouldnotmove(why) {
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	moved(0, 0, why);
}

function resized(dw, dh, msg) {
	msg = msg ? msg + "." : "";
	var actual = { width: widthAfter, height: heightAfter };
	var expected = { width: widthBefore + dw, height: heightBefore + dh };
	same(actual, expected, 'resized[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
}

function shouldresize(why) {
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	resized(50, 50, why);
}

function shouldnotresize(why) {
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	resized(0, 0, why);
}

function broder(el, side){
	return parseInt(el.css('border-' + side + '-width'), 10);
}

function margin(el, side) {
	return parseInt(el.css('margin-' + side), 10);
}

// Dialog Tests
module("dialog");

test("init", function() {
	expect(6);

	$("<div></div>").appendTo('body').dialog().remove();
	ok(true, '.dialog() called on element');

	$([]).dialog().remove();
	ok(true, '.dialog() called on empty collection');

	$('<div></div>').dialog().remove();
	ok(true, '.dialog() called on disconnected DOMElement');

	$('<div></div>').dialog().dialog("foo").remove();
	ok(true, 'arbitrary method called after init');

	el = $('<div></div>').dialog();
	var foo = el.data("foo.dialog");
	el.remove();
	ok(true, 'arbitrary option getter after init');

	$('<div></div>').dialog().data("foo.dialog", "bar").remove();
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(6);

	$("<div></div>").appendTo('body').dialog().dialog("destroy").remove();
	ok(true, '.dialog("destroy") called on element');

	$([]).dialog().dialog("destroy").remove();
	ok(true, '.dialog("destroy") called on empty collection');

	$('<div></div>').dialog().dialog("destroy").remove();
	ok(true, '.dialog("destroy") called on disconnected DOMElement');

	$('<div></div>').dialog().dialog("destroy").dialog("foo").remove();
	ok(true, 'arbitrary method called after destroy');

	el = $('<div></div>').dialog();
	var foo = el.dialog("destroy").data("foo.dialog");
	el.remove();
	ok(true, 'arbitrary option getter after destroy');

	$('<div></div>').dialog().dialog("destroy").data("foo.dialog", "bar").remove();
	ok(true, 'arbitrary option setter after destroy');
});

/*
//This one takes a while to run

test("element types", function() {
	var typeNames = ('p,h1,h2,h3,h4,h5,h6,blockquote,ol,ul,dl,div,form'
		+ ',table,fieldset,address,ins,del,em,strong,q,cite,dfn,abbr'
		+ ',acronym,code,samp,kbd,var,img,object,hr'
		+ ',input,button,label,select,iframe').split(',');

	$.each(typeNames, function(i) {
		var typeName = typeNames[i];
		el = $(document.createElement(typeName)).appendTo('body');
		(typeName == 'table' && el.append("<tr><td>content</td></tr>"));
		el.dialog();
		ok(true, '$("&lt;' + typeName + '/&gt").dialog()');
		el.dialog("destroy");
		el.remove();
	});
});

*/

test("defaults", function() {
	el = $('<div></div>').dialog();
	$.each(defaults, function(key, val) {
		var actual = el.data(key + ".dialog"), expected = val;
		same(actual, expected, key);
	});
	el.remove();
});

test("title id", function() {
	expect(3);

	var titleId;

	// reset the uuid so we know what values to expect
	$.ui.dialog.uuid = 0;

	el = $('<div></div>').dialog();
	titleId = dlg().find('.ui-dialog-title').attr('id');
	equals(titleId, 'ui-dialog-title-1', 'auto-numbered title id');
	el.remove();

	el = $('<div></div>').dialog();
	titleId = dlg().find('.ui-dialog-title').attr('id');
	equals(titleId, 'ui-dialog-title-2', 'auto-numbered title id');
	el.remove();

	el = $('<div id="foo"/>').dialog();
	titleId = dlg().find('.ui-dialog-title').attr('id');
	equals(titleId, 'ui-dialog-title-foo', 'carried over title id');
	el.remove();
});

test("ARIA", function() {
	expect(4);

	el = $('<div></div>').dialog();

	equals(dlg().attr('role'), 'dialog', 'dialog role');

	var labelledBy = dlg().attr('aria-labelledby');
	ok(labelledBy.length > 0, 'has aria-labelledby attribute');
	equals(dlg().find('.ui-dialog-title').attr('id'), labelledBy,
		'proper aria-labelledby attribute');

	equals(dlg().find('.ui-dialog-titlebar-close').attr('role'), 'button',
		'close link role');

	el.remove();
});

module("dialog: Options");

test("autoOpen", function() {
	expect(2);

	el = $('<div></div>').dialog({ autoOpen: false });
		isNotOpen('.dialog({ autoOpen: false })');
	el.remove();

	el = $('<div></div>').dialog({ autoOpen: true });
		isOpen('.dialog({ autoOpen: true })');
	el.remove();
});

test("autoResize", function() {
	expect(2);

	var actual,
		before,
		expected,
		handle;

	el = $('<div>content<br>content<br>content<br>content<br>content</div>').dialog({ autoResize: false });
		expected = { height: el.height() };
		handle = $(".ui-resizable-se", dlg());
		drag(handle, 50, 50);
		actual = { height: el.height() };
		same(actual, expected, '.dialog({ autoResize: false })');
	el.remove();
	el = $('<div>content<br>content<br>content<br>content<br>content</div>').dialog({ autoResize: true });
		before = { width: el.width(), height: el.height() };
		handle = $(".ui-resizable-se", dlg());
		drag(handle, 50, 50);
		expected = { width: before.width + 50, height: before.height + 50 };
		actual = { width: el.width(), height: el.height() };
		same(actual, expected, '.dialog({ autoResize: true })');
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

	equals(btn.parent().attr('className'), 'ui-dialog-buttonpane', "buttons in container");
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
	ok(false, 'missing test');
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
		equals(dlg().height(), defaults.height, "default height");
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
	ok(false, "missing test");
});

test("overlay", function() {
	ok(false, "missing test");
});

test("position", function() {
	ok(false, "missing test");
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
	ok(false, "missing test");
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
		equals(dlg().width(), defaults.width, "default width");
	el.remove();

	el = $('<div></div>').dialog({width: 437 });
		equals(dlg().width(), 437, "explicit width");
		el.data('width.dialog', 438);
		equals(dlg().width(), 438, 'explicit width after init');
	el.remove();
});

module("dialog: Methods");

test("isOpen", function() {
	expect(4);

	el = $('<div></div>').dialog();
	equals(el.dialog('isOpen'), true, "dialog is open after init");
	el.dialog('close');
	equals(el.dialog('isOpen'), false, "dialog is closed");
	el.remove();

	el = $('<div></div>').dialog({autoOpen: false});
	equals(el.dialog('isOpen'), false, "dialog is closed after init");
	el.dialog('open');
	equals(el.dialog('isOpen'), true, "dialog is open");
	el.remove();
});

module("dialog: Callbacks");

test("open", function() {
	expect(6);

	el = $("<div></div>");
	el.dialog({
		open: function(ev, ui) {
			ok(true, 'autoOpen: true fires open callback');
			equals(this, el[0], "context of callback");
		}
	});
	el.remove();

	el = $("<div></div>");
	el.dialog({
		autoOpen: false,
		open: function(ev, ui) {
			ok(true, '.dialog("open") fires open callback');
			equals(this, el[0], "context of callback");
		}
	});
	el.dialog("open");
	el.remove();

	el = $('<div></div>').dialog({
		autoOpen: false
	});
	el.bind('dialogopen', function(ev, ui) {
		ok(true, 'dialog("open") fires open event');
		equals(this, el[0], 'context of event');
	});
	el.dialog('open');
	el.remove();
});

test("dragStart", function() {
	expect(2);

	el = $("<div></div>");
	el.dialog({
		dragStart: function(ev, ui) {
			ok(true, 'dragging fires dragStart callback');
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("drag", function() {
	var fired = false;

	el = $("<div></div>");
	el.dialog({
		drag: function(ev, ui) {
			fired = true;
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	ok(fired, "drag fired");
	el.remove();
});

test("dragStop", function() {
	expect(2);

	el = $("<div></div>");
	el.dialog({
		dragStop: function(ev, ui) {
			ok(true, 'dragging fires dragStop callback');
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-dialog-titlebar", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("resizeStart", function() {
	expect(2);

	el = $("<div></div>");
	el.dialog({
		resizeStart: function(ev, ui) {
			ok(true, 'resizing fires resizeStart callback');
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("resize", function() {
	var fired = false;

	el = $("<div></div>");
	el.dialog({
		resize: function(ev, ui) {
			fired = true;
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	ok(fired, "resize fired");
	el.remove();
});

test("resizeStop", function() {
	expect(2);

	el = $("<div></div>");
	el.dialog({
		resizeStop: function(ev, ui) {
			ok(true, 'resizing fires resizeStop callback');
			equals(this, el[0], "context of callback");
		}
	});
	var handle = $(".ui-resizable-se", dlg());
	drag(handle, 50, 50);
	el.remove();
});

test("close", function() {
	expect(4);

	el = $('<div></div>').dialog({
		close: function(ev, ui) {
			ok(true, '.dialog("close") fires close callback');
			equals(this, el[0], "context of callback");
		}
	});
	el.dialog("close");
	el.remove();

	el = $('<div></div>').dialog().bind('dialogclose', function(ev, ui) {
		ok(true, '.dialog("close") firse dialogclose event');
		equals(this, el[0], 'context of event');
	});
	el.dialog('close');
	el.remove();
});

test("beforeclose", function() {
	expect(6);

	el = $('<div></div>').dialog({
		beforeclose: function(ev, ui) {
			ok(true, '.dialog("close") fires beforeclose callback');
			equals(this, el[0], "context of callback");
			return false;
		}
	});
	el.dialog('close');
	isOpen('beforeclose callback should prevent dialog from closing');
	el.remove();

	el = $('<div></div>').dialog().bind('dialogbeforeclose', function(ev, ui) {
		ok(true, '.dialog("close") triggers dialogbeforeclose event');
		equals(this, el[0], "context of event");
		return false;
	});
	el.dialog('close');
	isOpen('dialogbeforeclose event should prevent dialog from closing');
	el.remove();
});

module("dialog: Tickets");

})(jQuery);
