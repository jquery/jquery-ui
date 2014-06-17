TestHelpers.datepicker = {
	addMonths: function( date, offset ) {
		var maxDay = 32 - new Date( date.getFullYear(), date.getMonth() + offset, 32 ).getDate();
		date.setDate( Math.min( date.getDate(), maxDay ) );
		date.setMonth( date.getMonth() + offset );
		return date;
	},
	equalsDate: function( d1, d2, message ) {
		if ( !d1 || !d2 ) {
			ok( false, message + " - missing date" );
			return;
		}
		d1 = new Date( d1.getFullYear(), d1.getMonth(), d1.getDate() );
		d2 = new Date( d2.getFullYear(), d2.getMonth(), d2.getDate() );
		equal( d1.toString(), d2.toString(), message );
	},
	init: function( id, options ) {
		options = $.extend( { show: false, hide: false }, options || {} );
		return $( id ).datepicker( options );
	},
	initNewInput: function( options ) {
		options = $.extend( { show: false, hide: false }, options || {} );
		return $( "<input>" ).datepicker( options )
			.appendTo( "#qunit-fixture" );
	}
};
