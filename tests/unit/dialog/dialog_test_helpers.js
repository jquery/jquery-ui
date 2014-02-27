TestHelpers.dialog = {
	drag: function(element, handle, dx, dy) {
		var d = element.dialog("widget");
		//this mouseover is to work around a limitation in resizable
		//TODO: fix resizable so handle doesn't require mouseover in order to be used
		$( handle, d ).simulate("mouseover").simulate( "drag", {
			dx: dx,
			dy: dy
		});
	},
	testDrag: function(element, dx, dy, expectedDX, expectedDY, msg) {
		var actualDX, actualDY, offsetAfter,
			d = element.dialog("widget"),
			handle = $(".ui-dialog-titlebar", d),
			offsetBefore = d.offset();

		TestHelpers.dialog.drag(element, handle, dx, dy);

		offsetAfter = d.offset();

		msg = msg ? msg + "." : "";

		actualDX = offsetAfter.left - offsetBefore.left;
		actualDY = offsetAfter.top - offsetBefore.top;
		ok( expectedDX - actualDX <= 1 && expectedDY - actualDY <= 1, "dragged[" + expectedDX + ", " + expectedDY + "] " + msg);
	},
	// TODO switch back to checking the size of the .ui-dialog element (var d)
	// once we switch to using box-sizing: border-box (#9845) that should work fine
	// using the element's dimensions to avoid subpixel errors
	shouldResize: function(element, dw, dh, msg) {
		var heightAfter, widthAfter, actual, expected,
			d = element.dialog("widget"),
			handle = $(".ui-resizable-se", d),
			heightBefore = element.height(),
			widthBefore = element.width();

		TestHelpers.dialog.drag(element, handle, 50, 50);

		heightAfter = element.height();
		widthAfter = element.width();

		msg = msg ? msg + "." : "";
		actual = { width: widthAfter, height: heightAfter },
		expected = { width: widthBefore + dw, height: heightBefore + dh };
		deepEqual(actual, expected, "resized[" + 50 + ", " + 50 + "] " + msg);
	}
};
