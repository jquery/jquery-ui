/*
 * dialog_methods.js
 */
(function($) {

module("dialog: methods");

test("init", function() {
	expect(7);

	$("<div></div>").appendTo('body').dialog().remove();
	ok(true, '.dialog() called on element');

	$([]).dialog().remove();
	ok(true, '.dialog() called on empty collection');

	$('<div></div>').dialog().remove();
	ok(true, '.dialog() called on disconnected DOMElement - never connected');

	$('<div></div>').appendTo('body').remove().dialog().remove();
	ok(true, '.dialog() called on disconnected DOMElement - removed');

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

})(jQuery);
