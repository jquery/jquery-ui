TestHelpers.calendar = {
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
	focusGrid: function( element ) {
		element.find( ":tabbable" ).last().simulate( "focus" );
		$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB } );
		$( ":focus" ).simulate( "keydown", { keyCode: $.ui.keyCode.TAB } );

		return $( ":focus" );
	}
};
