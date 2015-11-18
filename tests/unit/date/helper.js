define( [
	"jquery",
	"globalize",
	"lib/helper",
	"globalize/date"
], function( $, Globalize, helper ) {

return $.extend( helper, {
	getAttributes: function( locale ) {
		var globalize = new Globalize( locale ),
			weekdayShortFormatter = globalize.dateFormatter( { raw: "EEEEEE" } ),
			firstDayRaw = globalize.dateFormatter( { raw: "c" } )( new Date( 1970, 0, 3 ) );

		return {
			firstDay: ( 7 - globalize.parseNumber( firstDayRaw ) ),
			formatWeekdayShort: function( date ) {

				// Return the short weekday if its length is < 3. Otherwise, its narrow form.
				var shortWeekday = weekdayShortFormatter( date );

				return shortWeekday.length > 3 ? weekdayNarrowFormatter( date ) : shortWeekday;
			},
			formatWeekdayFull: globalize.dateFormatter( { raw: "EEEE" } ),
			formatMonth: globalize.dateFormatter( { raw: "MMMM" } ),
			formatWeekOfYear: globalize.dateFormatter( { raw: "w" } )
		};
	}
} );

} );
