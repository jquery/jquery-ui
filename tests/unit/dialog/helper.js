define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/dialog"
], function( QUnit, $, helper ) {

return $.extend( helper, {
	drag: function( element, handle, dx, dy ) {
		var d = element.dialog( "widget" );

		//This mouseover is to work around a limitation in resizable
		//TODO: fix resizable so handle doesn't require mouseover in order to be used
		$( handle, d ).simulate( "mouseover" ).simulate( "drag", {
			dx: dx,
			dy: dy
		} );
	},
	testDrag: function( assert, element, dx, dy, expectedDX, expectedDY, msg ) {
		var actualDX, actualDY, offsetAfter,
			d = element.dialog( "widget" ),
			handle = $( ".ui-dialog-titlebar", d ),
			offsetBefore = d.offset();

		this.drag( element, handle, dx, dy );

		offsetAfter = d.offset();

		msg = msg ? msg + "." : "";

		actualDX = offsetAfter.left - offsetBefore.left;
		actualDY = offsetAfter.top - offsetBefore.top;
		assert.ok( expectedDX - actualDX <= 1 && expectedDY - actualDY <= 1, "dragged[" + expectedDX + ", " + expectedDY + "] " + msg );
	},

	shouldResize: function( assert, element, dw, dh, msg ) {
		var actualDH, actualDW, heightAfter, widthAfter,
			d = element.dialog( "widget" ),
			handle = $( ".ui-resizable-se", d ),
			heightBefore = element.height(),
			widthBefore = element.width();

		this.drag( element, handle, 50, 50 );

		heightAfter = element.height();
		widthAfter = element.width();

		msg = msg ? msg + "." : "";

		actualDH = heightAfter - heightBefore;
		actualDW = widthAfter - widthBefore;

		// TODO: Switch to assert.close().
		// Also change the testDrag() helper.
		assert.ok( Math.abs( actualDH - dh ) <= 1 && Math.abs( actualDW - dw ) <= 1, "resized[50, 50] " + msg );
	}
} );

} );
