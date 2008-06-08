/*
 * dialog unit tests
 */

//
// Dialog Test Helper Functions
//
var el, offsetBefore, offsetAfter, dragged;

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
	var element = el.data("dialog").element;
	offsetBefore = el.offset();
	$(handle).simulate("drag", {
		dx: dx || 0,
		dy: dy || 0
	});
	dragged = { dx: dx, dy: dy };
	offsetAfter = el.offset();
}

var moved = function (dx, dy, msg) {
	msg = msg ? msg + "." : "";
	var actual = { left: offsetAfter.left, top: offsetAfter.top };
	var expected = { left: offsetBefore.left + dx, top: offsetAfter.top };
	compare2(actual, expected, 'dragged[' + dragged.dx + ', ' + dragged.dy + '] ' + msg);
}

function shouldmove(why) {
	var handle = $(".ui-dialog-titlebar", el.data("dialog").element);
	drag(handle, 50, 50);
	moved(50, 50, why);
}

function shouldnotmove(why) {
	var handle = $(".ui-dialog-titlebar", el.data("dialog").element);
	drag(handle, 50, 50);
	moved(0, 0, why);
}

var border = function(el, side) { return parseInt(el.css('border-' + side + '-width')); }

var margin = function(el, side) { return parseInt(el.css('margin-' + side)); }

// Dialog Tests
module("dialog");

test("init", function() {
	expect(6);

	el = $("#dialog1").dialog();
	ok(true, '.dialog() called on element');

	$([]).dialog();
	ok(true, '.dialog() called on empty collection');

	$("<div/>").dialog();
	ok(true, '.dialog() called on disconnected DOMElement');

	$("<div/>").dialog().dialog("foo");
	ok(true, 'arbitrary method called after init');

	$("<div/>").dialog().data("foo.dialog");
	ok(true, 'arbitrary option getter after init');

	$("<div/>").dialog().data("foo.dialog", "bar");
	ok(true, 'arbitrary option setter after init');

});

test("destroy", function() {
	expect(6);

	$("#dialog1").dialog().dialog("destroy");	
	ok(true, '.dialog("destroy") called on element');

	$([]).dialog().dialog("destroy");
	ok(true, '.dialog("destroy") called on empty collection');

	$("<div/>").dialog().dialog("destroy");
	ok(true, '.dialog("destroy") called on disconnected DOMElement');

	$("<div/>").dialog().dialog("destroy").dialog("foo");
	ok(true, 'arbitrary method called after destroy');

	$("<div/>").dialog().dialog("destroy").data("foo.dialog");
	ok(true, 'arbitrary option getter after destroy');

	$("<div/>").dialog().dialog("destroy").data("foo.dialog", "bar");
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
	expect(6);
	var buttons = {
		"Ok": function() {
			ok(true, "button 1 click fires callback");
		},
		"Cancel": function() {
			ok(true, "button 2 click fires callback");
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
	btn.simulate("click");
	equals(btn.parent().attr('className'), 'ui-dialog-buttonpane', "buttons in container");
});

module("dialog: Methods");

module("dialog: Callbacks");

module("dialog: Tickets");

test("#XXXX title", function() {
	
	
	
});

module("dialog: Cleanup");

test("cleanup", function() {

	$(".ui-dialog").remove();

});
