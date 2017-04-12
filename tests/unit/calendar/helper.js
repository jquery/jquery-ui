define( [
	"jquery",
	"lib/helper"
], function( $, helper ) {

return $.extend( helper, {
	createDate: function( year, month, day ) {
		if ( arguments.length === 1 ) {
			return new Date( year );
		}

		if ( arguments.length === 3 ) {
			return new Date( year, month, day );
		}

		return new Date();
	},
	focusGrid: function( element ) {
		element.find( ":tabbable" ).last().simulate( "focus" );
		$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB } );
		$( document.activeElement ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB } );

		return $( document.activeElement );
	}
} );

} );
