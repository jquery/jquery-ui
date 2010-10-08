/*
 * dialog_tickets.js
 */
(function($) {

module("dialog: tickets");

test("#4826: setting resizable false toggles resizable on dialog", function() {
	expect(6);

	el = $('<div></div>').dialog({ resizable: false });
	shouldnotresize("[default]");
	for (var i=0; i<2; i++) {
		el.dialog('close').dialog('open');
		shouldnotresize('initialized with resizable false toggle ('+ (i+1) +')');		
	}
	el.remove();

	el = $('<div></div>').dialog({ resizable: true });
	shouldresize("[default]");
	for (var i=0; i<2; i++) {
		el.dialog('close').dialog('option', 'resizable', false).dialog('open');
		shouldnotresize('set option resizable false toggle ('+ (i+1) +')');		
	}
	el.remove();
	
});

test("#5184: isOpen in dialogclose event is true", function() {
	expect( 3 );

	el = $( "<div></div>" ).dialog({
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
    el = $('<div></div>').dialog({
            width: 200,
            minWidth: 300
        });

    equals(el.dialog('option', 'width'), 300, "width is minWidth");
    el.dialog('option', 'width', 200);
    equals(el.dialog('option', 'width'), 300, "width unchanged when set to < minWidth");
    el.dialog('option', 'width', 320);
    equals(el.dialog('option', 'width'), 320, "width changed if set to > minWidth");
    el.remove();

    el = $('<div></div>').dialog({
            minWidth: 300
        });
    ok(el.dialog('option', 'width') >=  300, "width is at least 300");
    el.remove();

});

test("#6137: dialog('open') causes form elements to reset on IE7", function() {
	expect(2);

	d1 = $('<form><input type="radio" name="radio" id="a" value="a" checked="checked"></input>' +
				'<input type="radio" name="radio" id="b" value="b">b</input></form>').dialog({autoOpen: false});

	d1.find('#b')[0].checked = true;
	equal($('input:checked').val(), 'b', "checkbox b is checked");

	d2 = $('<div></div>').dialog({autoOpen: false});

	d1.dialog('open');
	equal($('input:checked').val(), 'b', "checkbox b is checked");

	d1.add(d2).remove();
})

})(jQuery);
