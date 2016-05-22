define( [
	"jquery",
	"lib/helper"
], function( $, helper ) {

return $.extend( helper, {
	focusGrid: function( element ) {
		element.find( ":tabbable" ).last().simulate( "focus" );
		$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB } );
		$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB } );

		return $( document.activeElement );
	}
} );

} );
