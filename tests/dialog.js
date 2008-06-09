/*
 * dialog unit tests
 */
(function($) {
//
// Dialog Test Helper Functions
//

var el,
	offsetBefore, offsetAfter,
	heightBefore, heightAfter,
	widthBefore, widthAfter,
	dragged;

var dlg = function() {
	return el.data("dialog").element.parents(".ui-dialog:first");
}

var isOpen = function(why) {
	ok(dlg().is(":visible"), why);
}

var isNotOpen = function(why) {
	ok(!dlg().is(":visible"), why);
}

var drag = function(handle, dx, dy) {
	var d = dlg();
	offsetBefore = d.offset();
	heightBefore = d.height();
	widthBefore = d.width();
	$(handle, d).simulate("drag", {
		dx: dx || 0,
		dy: dy || 0
	});
	dragged = { dx: dx, dy: dy };
	offsetAfter = d.offset();
	heightAfter = d.height();
	widthAfter = d.width();
}

var moved = function (dx, dy, msg) {
	msg = msg ? msg + "." : "";
	var actual = { left: offsetAfter.left, top: offsetAfter.top };
	var expected = { left: offsetBefore.left + dx, top: offsetAfter.top };
	compare2(actual, expected, 'dragged[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
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

var border = function(el, side) { return parseInt(el.css('border-' + side + '-width')); }

var margin = function(el, side) { return parseInt(el.css('margin-' + side)); }

// Dialog Tests
module("dialog");

test("init", function() {
	expect(6);

	$("#dialog1").dialog().remove();
	ok(true, '.dialog() called on element');

	$([]).dialog().remove();
	ok(true, '.dialog() called on empty collection');

	$("<div/>").dialog().remove();
	ok(true, '.dialog() called on disconnected DOMElement');

	$("<div/>").dialog().dialog("foo").remove();
	ok(true, 'arbitrary method called after init');

	el = $("<div/>").dialog()
	var foo = el.data("foo.dialog");
	el.remove();
	ok(true, 'arbitrary option getter after init');

	$("<div/>").dialog().data("foo.dialog", "bar").remove();
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect(6);

	$("#dialog1").dialog().dialog("destroy").remove();
	ok(true, '.dialog("destroy") called on element');

	$([]).dialog().dialog("destroy").remove();
	ok(true, '.dialog("destroy") called on empty collection');

	$("<div/>").dialog().dialog("destroy").remove();
	ok(true, '.dialog("destroy") called on disconnected DOMElement');

	$("<div/>").dialog().dialog("destroy").dialog("foo").remove();
	ok(true, 'arbitrary method called after destroy');

	el = $("<div/>").dialog();
	var foo = el.dialog("destroy").data("foo.dialog");
	el.remove();
	ok(true, 'arbitrary option getter after destroy');

	$("<div/>").dialog().dialog("destroy").data("foo.dialog", "bar").remove();
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
	el = $('<div/>').dialog();
	var defaults = {
		autoOpen: true,
		buttons: {},
		disabled: false,
		draggable: true,
		height: 200,
		maxHeight: null,
		maxWidth: null,
		minHeight: 100,
		minWidth: 150,
		modal: false,
		overlay: {},
		position: 'center',
		resizable: true,
		stack: true,
		title: null,
		width: 300
	};
	$.each(defaults, function(key, val) {
		var actual = el.data(key + ".dialog"), expected = val,
			method = (expected && expected.constructor == Object) ?
				compare2 : equals;
		method(actual, expected, key);
	});
	el.remove();
});

module("dialog: Options");

test("autoOpen", function() {
	expect(2);

	el = $("<div/>").dialog({ autoOpen: false });
	isNotOpen('.dialog({ autoOpen: false })');
	el.remove();

	el = $("<div/>").dialog({ autoOpen: true });
	isOpen('.dialog({ autoOpen: true })');
	el.remove();
});

test("buttons", function() {
	expect(10);
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
	}
	el = $("<div/>").dialog({ buttons: buttons });
	var btn = $("button", dlg());
	equals(btn.length, 2, "number of buttons");
	var i = 0;
	$.each(buttons, function(key, val) {
		equals(btn.eq(i).text(), key, "text of button " + (i+1));
		i += 1;
	});
	equals(btn.parent().attr('className'), 'ui-dialog-buttonpane', "buttons in container");
	btn.trigger("click");
	el.remove();
});

test("draggable", function() {
	el = $("<div/>").dialog({ draggable: false });
	shouldnotmove();
	el.remove();
	el = $("<div/>").dialog({ draggable: true });
	shouldmove();
	el.remove();
});

test("height", function() {
	el = $("<div/>").dialog();
	equals(dlg().height(), 200, "default height");
	el.remove();
	el = $("<div/>").dialog({ height: 437 });
	equals(dlg().height(), 437, "default height");
	el.remove();
});

test("maxHeight", function() {
	el = $("<div/>").dialog({ maxHeight: 400 });
	drag('.ui-resizable-s', 1000, 1000);
	equals(heightAfter, 400, "maxHeight");
	el.remove();
	el = $("<div/>").dialog({ maxHeight: 400 });
	drag('.ui-resizable-n', -1000, -1000);
	equals(heightAfter, 400, "maxHeight");
	el.remove();
});

test("maxWidth", function() {
	el = $("<div/>").dialog({ maxWidth: 400 });
	drag('.ui-resizable-e', 1000, 1000);
	equals(widthAfter, 400, "maxWidth");
	el.remove();
	el = $("<div/>").dialog({ maxWidth: 400 });
	drag('.ui-resizable-w', -1000, -1000);
	equals(widthAfter, 400, "maxWidth");
	el.remove();
});

test("minHeight", function() {
	el = $("<div/>").dialog({ minHeight: 10 });
	drag('.ui-resizable-s', -1000, -1000);
	equals(heightAfter, 10, "minHeight");
	el.remove();
	el = $("<div/>").dialog({ minHeight: 10 });
	drag('.ui-resizable-n', 1000, 1000);
	equals(heightAfter, 10, "minHeight");
	el.remove();
});

test("minWidth", function() {
	el = $("<div/>").dialog({ minWidth: 10 });
	drag('.ui-resizable-e', -1000, -1000);
	equals(widthAfter, 10, "minWidth");
	el.remove();
	el = $("<div/>").dialog({ minWidth: 10 });
	drag('.ui-resizable-w', 1000, 1000);
	equals(widthAfter, 10, "minWidth");
	el.remove();
});

module("dialog: Methods");

module("dialog: Callbacks");

test("open", function() {
	expect(4);
	el = $("<span/>");
	var content = el[0];
	el.dialog({
		open: function(ev, ui) {
			ok(true, 'autoOpen: true fires open callback');
			equals(this, content, "context of callback");
		}
	});
	el.remove();
	el = $("<span/>");
	var content = el[0];
	el.dialog({
		autoOpen: false,
		open: function(ev, ui) {
			ok(true, '.dialog("open") fires open callback');
			equals(this, el[0], "context of callback");
		}
	});
	el.dialog("open");
	el.remove();
});

test("close", function() {
	expect(2);
	el = $("<div/>").dialog({
		close: function(ev, ui) {
			ok(true, '.dialog("close") fires close callback');
			equals(this, el[0], "context of callback");
		}
	});
	el.dialog("close");
	el.remove();
});

module("dialog: Tickets");

})(jQuery);
