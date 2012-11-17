module("dialog (deprecated): position opton with array");

if ( !$.ui.ie ) {
	test("position, right bottom on window w/array", function() {
		expect( 2 );
		var el = $('<div></div>').dialog({ position: ["right", "bottom"] }),
			dialog = el.dialog('widget'),
			offset = dialog.offset();
		closeEnough(offset.left, $(window).width() - dialog.outerWidth() + $(window).scrollLeft(), 1);
		closeEnough(offset.top, $(window).height() - dialog.outerHeight() + $(window).scrollTop(), 1);
		el.remove();
	});
}

test("position, offset from top left w/array", function() {
	expect( 2 );
	var el = $('<div></div>').dialog({ position: [10, 10] }),
		dialog = el.dialog('widget'),
		offset = dialog.offset();
	closeEnough(offset.left, 10 + $(window).scrollLeft(), 1);
	closeEnough(offset.top, 10 + $(window).scrollTop(), 1);
	el.remove();
});
