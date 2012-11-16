/*
 * dialog_core.js
 */

(function($) {

module("dialog: core");

test("title id", function() {
	expect(1);

	var titleId,
		el = $('<div></div>').dialog();

	titleId = el.dialog('widget').find('.ui-dialog-title').attr('id');
	ok( /ui-id-\d+$/.test( titleId ), 'auto-numbered title id');
	el.remove();
});

// TODO test for aria-describedby
// add only when the attribute isn't anywhere yet
test("ARIA", function() {
	expect(4);

	var labelledBy,
		el = $('<div></div>').dialog();

	equal(el.dialog('widget').attr('role'), 'dialog', 'dialog role');

	labelledBy = el.dialog('widget').attr('aria-labelledby');
	ok(labelledBy.length > 0, 'has aria-labelledby attribute');
	equal(el.dialog('widget').find('.ui-dialog-title').attr('id'), labelledBy,
		'proper aria-labelledby attribute');

	equal(el.dialog('widget').find('.ui-dialog-titlebar-close').attr('role'), 'button',
		'close link role');

	el.remove();
});

test("widget method", function() {
	expect( 1 );
	var dialog = $("<div>").appendTo("#main").dialog();
	deepEqual(dialog.parent()[0], dialog.dialog("widget")[0]);
});

test( "focus tabbable", function() {
	expect( 5 );
	var el,
		options = {
			buttons: [{
				text: "Ok",
				click: $.noop
			}]
		};

	// 1. first element inside the dialog matching [autofocus]
	el = $( "<div><input><input autofocus></div>" ).dialog( options );
	equal( document.activeElement, el.find( "input" )[ 1 ] );
	el.remove();

	// 2. tabbable element inside the content element
	el = $( "<div><input><input></div>" ).dialog( options );
	equal( document.activeElement, el.find( "input" )[ 0 ] );
	el.remove();

	// 3. tabbable element inside the buttonpane
	el = $( "<div>text</div>" ).dialog( options );
	equal( document.activeElement, el.dialog( "widget" ).find( ".ui-dialog-buttonpane button" )[ 0 ] );
	el.remove();

	// 4. the close button
	el = $( "<div>text</div>" ).dialog();
	equal( document.activeElement, el.dialog( "widget" ).find( ".ui-dialog-titlebar .ui-dialog-titlebar-close" )[ 0 ] );
	el.remove();

	// 5. the dialog itself
	el = $( "<div>text</div>" ).dialog({
		autoOpen: false
	});
	el.dialog( "widget" ).find( ".ui-dialog-titlebar-close" ).hide();
	el.dialog( "open" );
	equal( document.activeElement, el.parent()[ 0 ] );
	el.remove();
});

})(jQuery);
