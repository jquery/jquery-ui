define( [
	"jquery",
	"lib/helper",
	"ui/widgets/pinpad"
], function( $, helper ) {

	return $.extend( helper, {

		getRandomDigit: function() {
			return Math.floor( Math.random() * 10 );
		},

		getRandomNumber: function( min, max ) {
			return Math.floor( Math.random() * ( max - min ) ) + min;
		},

		insert: function( number, element ) {
			if ( number ) {
				var i,
					value = number.toString(),
					widget = element.pinpad( "widget" );
				for ( i = 0; i < value.length; i++ ) {
					widget.find( ".ui-pinpad-key-num-pad-" + value[ i ] ).simulate( "click" );
				}
			}
		}

	} );

} );
