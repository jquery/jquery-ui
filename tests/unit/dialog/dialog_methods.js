/*
 * dialog_methods.js
 */
(function($) {

module("dialog: methods", {
	teardown: function() {
		$("body>.ui-dialog").remove();
	}
});

test("init", function() {
	expect(6);

	$("<div></div>").appendTo('body').dialog().remove();
	ok(true, '.dialog() called on element');

	$([]).dialog().remove();
	ok(true, '.dialog() called on empty collection');

	$('<div></div>').dialog().remove();
	ok(true, '.dialog() called on disconnected DOMElement - never connected');

	$('<div></div>').appendTo('body').remove().dialog().remove();
	ok(true, '.dialog() called on disconnected DOMElement - removed');

	var el = $('<div></div>').dialog();
	el.dialog("option", "foo");
	el.remove();
	ok(true, 'arbitrary option getter after init');

	$('<div></div>').dialog().dialog("option", "foo", "bar").remove();
	ok(true, 'arbitrary option setter after init');
});

test("destroy", function() {
	expect( 4 );

	$("<div></div>").appendTo('body').dialog().dialog("destroy").remove();
	ok(true, '.dialog("destroy") called on element');

	$([]).dialog().dialog("destroy").remove();
	ok(true, '.dialog("destroy") called on empty collection');

	$('<div></div>').dialog().dialog("destroy").remove();
	ok(true, '.dialog("destroy") called on disconnected DOMElement');

	var expected = $('<div></div>').dialog(),
		actual = expected.dialog('destroy');
	equal(actual, expected, 'destroy is chainable');
});

test("enable", function() {
	expect( 3 );

	var el,
		expected = $('<div></div>').dialog(),
		actual = expected.dialog('enable');
	equal(actual, expected, 'enable is chainable');

	el = $('<div></div>').dialog({ disabled: true });
	el.dialog('enable');
	equal(el.dialog('option', 'disabled'), false, 'enable method sets disabled option to false');
	ok(!el.dialog('widget').hasClass('ui-dialog-disabled'), 'enable method removes ui-dialog-disabled class from ui-dialog element');
});

test("disable", function() {
	expect( 3 );

	var el,
		expected = $('<div></div>').dialog(),
		actual = expected.dialog('disable');
	equal(actual, expected, 'disable is chainable');

	el = $('<div></div>').dialog({ disabled: false });
	el.dialog('disable');
	equal(el.dialog('option', 'disabled'), true, 'disable method sets disabled option to true');
	ok(el.dialog('widget').hasClass('ui-dialog-disabled'), 'disable method adds ui-dialog-disabled class to ui-dialog element');
});

test("close", function() {
	expect( 3 );

	var el,
		expected = $('<div></div>').dialog(),
		actual = expected.dialog('close');
	equal(actual, expected, 'close is chainable');

	el = $('<div></div>').dialog();
	ok(el.dialog('widget').is(':visible') && !el.dialog('widget').is(':hidden'), 'dialog visible before close method called');
	el.dialog('close');
	ok(el.dialog('widget').is(':hidden') && !el.dialog('widget').is(':visible'), 'dialog hidden after close method called');
});

test("isOpen", function() {
	expect(4);

	var el = $('<div></div>').dialog();
	equal(el.dialog('isOpen'), true, "dialog is open after init");
	el.dialog('close');
	equal(el.dialog('isOpen'), false, "dialog is closed");
	el.remove();

	el = $('<div></div>').dialog({autoOpen: false});
	equal(el.dialog('isOpen'), false, "dialog is closed after init");
	el.dialog('open');
	equal(el.dialog('isOpen'), true, "dialog is open");
	el.remove();
});

test("moveToTop", function() {
	expect( 5 );
	function order() {
		var actual = $( ".ui-dialog" ).map(function() {
			return +$( this ).find( ".ui-dialog-content" ).attr( "id" ).replace( /\D+/, "" );
		}).get().reverse();
		deepEqual( actual, $.makeArray( arguments ) );
	}
	var dialog1, dialog2,
		focusOn = "dialog1";
	dialog1 = $( "#dialog1" ).dialog({
		focus: function() {
			equal( focusOn, "dialog1" );
		}
	});
	focusOn = "dialog2";
	dialog2 = $( "#dialog2" ).dialog({
		focus: function() {
			equal( focusOn, "dialog2" );
		}
	});
	order( 2, 1 );
	focusOn = "dialog1";
	dialog1.dialog( "moveToTop" );
	order( 1, 2 );
});

test("open", function() {
	expect( 3 );
	var el,
		expected = $('<div></div>').dialog(),
		actual = expected.dialog('open');
	equal(actual, expected, 'open is chainable');

	el = $('<div></div>').dialog({ autoOpen: false });
	ok(el.dialog('widget').is(':hidden') && !el.dialog('widget').is(':visible'), 'dialog hidden before open method called');
	el.dialog('open');
	ok(el.dialog('widget').is(':visible') && !el.dialog('widget').is(':hidden'), 'dialog visible after open method called');
});

})(jQuery);
