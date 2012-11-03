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

})(jQuery);
