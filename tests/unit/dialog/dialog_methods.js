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
	expect( 6 );

	// Dialogs are expected to be hidden on destroy, so make sure they're hidden
	// before the test
	$( "#dialog1, #form-dialog" ).hide();

	domEqual( "#dialog1", function() {
		var dialog = $( "#dialog1" ).dialog().dialog( "destroy" );
		equal( dialog.parent()[ 0 ], $( "#qunit-fixture" )[ 0 ] );
		equal( dialog.index(), 0 );
	});
	domEqual( "#form-dialog", function() {
		var dialog = $( "#form-dialog" ).dialog().dialog( "destroy" );
		equal( dialog.parent()[ 0 ], $( "#qunit-fixture" )[ 0 ] );
		equal( dialog.index(), 2 );
	});
});

test( "enable/disable disabled", function() {
	expect( 2 );
	var el = $( "<div></div>" ).dialog();
	el.dialog( "disable" );
	equal(el.dialog( "option", "disabled" ), false, "disable method doesn't do anything" );
	ok( !el.dialog( "widget" ).hasClass( "ui-dialog-disabled" ), "disable method doesn't add ui-dialog-disabled class" );
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
