/*
 * dialog_tickets.js
 */
(function($) {

module( "dialog: tickets" );

asyncTest( "#3123: Prevent tabbing out of modal dialogs", function() {
	expect( 3 );

	var el = $( "<div><input id='t3123-first'><input id='t3123-last'></div>" ).dialog({ modal: true }),
		inputs = el.find( "input" ),
		widget = el.dialog( "widget" )[ 0 ];

	function checkTab() {
		ok( $.contains( widget, document.activeElement ), "Tab key event moved focus within the modal" );

		// check shift tab
		$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB, shiftKey: true });
		setTimeout( checkShiftTab, 2 );
	}

	function checkShiftTab() {
		ok( $.contains( widget, document.activeElement ), "Shift-Tab key event moved focus within the modal" );

		el.remove();
		start();
	}

	inputs.eq( 1 ).focus();
	equal( document.activeElement, inputs[1], "Focus set on second input" );
	inputs.eq( 1 ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB });

	setTimeout( checkTab, 2 );
});

test("#4826: setting resizable false toggles resizable on dialog", function() {
	expect(6);
	var i,
		el = $('<div></div>').dialog({ resizable: false });

	TestHelpers.dialog.shouldResize(el, 0, 0, "[default]");
	for (i=0; i<2; i++) {
		el.dialog('close').dialog('open');
		TestHelpers.dialog.shouldResize(el, 0, 0, 'initialized with resizable false toggle ('+ (i+1) +')');
	}
	el.remove();

	el = $('<div></div>').dialog({ resizable: true });
	TestHelpers.dialog.shouldResize(el, 50, 50, "[default]");
	for (i=0; i<2; i++) {
		el.dialog('close').dialog('option', 'resizable', false).dialog('open');
		TestHelpers.dialog.shouldResize(el, 0, 0, 'set option resizable false toggle ('+ (i+1) +')');
	}
	el.remove();

});

test("#5184: isOpen in dialogclose event is true", function() {
	expect( 3 );

	var el = $( "<div></div>" ).dialog({
			close: function() {
				ok( !el.dialog("isOpen"), "dialog is not open during close" );
			}
		});
	ok( el.dialog("isOpen"), "dialog is open after init" );
	el.dialog( "close" );
	ok( !el.dialog("isOpen"), "dialog is not open after close" );
	el.remove();
});

test("#5531: dialog width should be at least minWidth on creation", function () {
	expect( 4 );
	var el = $('<div></div>').dialog({
			width: 200,
			minWidth: 300
		});

	equal(el.dialog('option', 'width'), 300, "width is minWidth");
	el.dialog('option', 'width', 200);
	equal(el.dialog('option', 'width'), 300, "width unchanged when set to < minWidth");
	el.dialog('option', 'width', 320);
	equal(el.dialog('option', 'width'), 320, "width changed if set to > minWidth");
	el.remove();

	el = $('<div></div>').dialog({
			minWidth: 300
		});
	ok(el.dialog('option', 'width') >=  300, "width is at least 300");
	el.remove();

});

test("#6137: dialog('open') causes form elements to reset on IE7", function() {
	expect(2);

	var d1 = $('<form><input type="radio" name="radio" id="a" value="a" checked="checked"></input>' +
				'<input type="radio" name="radio" id="b" value="b">b</input></form>').appendTo( "body" ).dialog({autoOpen: false});

	d1.find('#b').prop( "checked", true );
	equal(d1.find('input:checked').val(), 'b', "checkbox b is checked");

	d1.dialog('open');
	equal(d1.find('input:checked').val(), 'b', "checkbox b is checked");

	d1.remove();
});

// TODO merge this with the main destroy test
test("#4980: Destroy should place element back in original DOM position", function(){
	expect( 2 );
	var container = $('<div id="container"><div id="modal">Content</div></div>'),
		modal = container.find('#modal');
	modal.dialog();
	ok(!$.contains(container[0], modal[0]), 'dialog should move modal element to outside container element');
	modal.dialog('destroy');
	ok($.contains(container[0], modal[0]), 'dialog(destroy) should place element back in original DOM position');
});

})(jQuery);
