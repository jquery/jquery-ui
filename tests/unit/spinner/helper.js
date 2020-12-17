define( [
	"jquery",
	"lib/helper"
], function( $, helper ) {

return $.extend( helper, {
	simulateKeyDownUp: function( element, keyCode, shift ) {
		element
			.simulate( "keydown", { keyCode: keyCode, shiftKey: shift || false } )
			.simulate( "keyup", { keyCode: keyCode, shiftKey: shift || false } );
	}
} );

} );
