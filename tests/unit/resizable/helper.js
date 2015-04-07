define( [
	"jquery",
	"lib/helper"
], function( $, helper ) {

return $.extend( helper, {
	drag: function( el, dx, dy ) {
		// this mouseover is to work around a limitation in resizable
		// TODO: fix resizable so handle doesn't require mouseover in order to be used
		$( el ).simulate("mouseover").simulate( "drag", {
			moves: 2,
			dx: dx,
			dy: dy
		});
	}
} );

} );
