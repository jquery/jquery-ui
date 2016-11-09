define( [
	"jquery",
	"lib/helper"
], function( $, helper ) {

return $.extend( helper, {
	sort: function( assert, handle, dx, dy, index, msg ) {
		$( handle ).simulate( "drag", {
			dx: dx,
			dy: dy
		} );
		assert.equal( $( handle ).parent().children().index( handle ), index, msg );
	}
} );

} );
