define( [
	"jquery",
	"lib/helper",
	"ui/widgets/datepicker"
], function( $, helper ) {

return $.extend( helper, {
	init: function( id, options ) {
		options = $.extend( { show: false, hide: false }, options || {} );
		return $( id ).datepicker( options );
	},
	initNewInput: function( options ) {
		options = $.extend( { show: false, hide: false }, options || {} );
		return $( "<input>" ).datepicker( options )
			.appendTo( "#qunit-fixture" );
	}
} );

} );
