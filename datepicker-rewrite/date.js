/*
 * Calendar math built on jquery-global
 * 
 * Based on Marc Grabanski's jQuery Date Plugin
 * http://marcgrabanski.com/articles/jquery-date-plugin
 */
(function( $, undefined ) {
	
if ( typeof( $.global.culture ) == "undefined" ) {
	$.global.culture = $.global.cultures[ "default" ];
}

$.date = function ( datestring, formatstring ) {
	var calendar = $.global.culture.calendar,
		format = formatstring ? formatstring : calendar.patterns.d,
		date = datestring ? $.global.parseDate(datestring, format) : new Date();
	return {
		refresh: function() {
			calendar = $.global.culture.calendar;
			format = formatstring || calendar.patterns.d;
			return this;
		},
		setFormat: function( formatstring ) {
			if ( formatstring ) {
				format = formatstring;
			}	
			return this;
		},
		setDay: function( day ) {
			date = new Date( date.getFullYear(), date.getMonth(), day );
			return this;
		},
		adjust: function( period, offset ) {
			var day = period == "D" ? date.getDate() + offset : date.getDate(), 
				month = period == "M" ? date.getMonth() + offset : date.getMonth(), 
				year = period == "Y" ? date.getFullYear() + offset : date.getFullYear();
			date = new Date( year, month, day );
			return this;
		},
		daysInMonth: function( year, month ) {
			year = year || date.getFullYear();
			month = month || date.getMonth();
			return 32 - new Date( year, month, 32 ).getDate();
		},
		monthname: function() {
			return calendar.months.names[ date.getMonth() ];
		},
		year: function() {
			return date.getFullYear();
		},
		weekdays: function() {
			// TODO take firstDay into account
			var result = [];
			for ( var dow = 0; dow < 7; dow++ ) {
				var day = ( dow + calendar.firstDay ) % 7;
				result.push( {
					shortname: calendar.days.namesShort[ day ],
					fullname: calendar.days.names[ day ],
				});
			}
			return result;
		},
		days: function() {
			var result = [],
				firstDayOfMonth = new Date( this.year(), date.getMonth(), 1 ).getDay(),
				leadDays = ( firstDayOfMonth - calendar.firstDay + 7 ) % 7,
				rows = Math.ceil( ( leadDays + this.daysInMonth() ) / 7),
				printDate = new Date( this.year(), date.getMonth(), 1 - leadDays );
			for ( var row = 0; row < rows; row++ ) {
				var week = result[ result.length ] = {
					number: this.iso8601Week( printDate ),
					days: []
				};
				for ( var dayx = 0; dayx < 7; dayx++ ) {
					var day = week.days[ week.days.length ] = {
						lead: printDate.getMonth() != date.getMonth(),
						date: printDate.getDate(),
						current: this.selected && this.selected.equal( printDate ),
						today: today.equal( printDate )
					};
					day.render = day.selectable = !day.lead;
					this.eachDay( day );
					// TODO use adjust("D", 1)?
					printDate.setDate( printDate.getDate() + 1 );
				}
			}
			return result;
		},
		iso8601Week: function( date ) {
			var checkDate = new Date( date.getTime() );
			// Find Thursday of this week starting on Monday
			checkDate.setDate( checkDate.getDate() + 4 - ( checkDate.getDay() || 7 ) );
			var time = checkDate.getTime();
			checkDate.setMonth( 0 ); // Compare with Jan 1
			checkDate.setDate( 1 );
			return Math.floor( Math.round( ( time - checkDate ) / 86400000) / 7 ) + 1;
		},
		select: function() {
			this.selected = this.clone();
			return this;
		},
		// TODO create new Date with year, month, day instead
		clone: function() {
			return $.date( this.format(), format );
		},
		// TODO compare year, month, day each for better performance
		equal: function( other ) {
			function format( date ) {
				return $.global.format( date, "d" );
			}
			return format( date ) == format( other );
		},
		date: function() {
			return date;
		},
		format: function( formatstring ) {
			return $.global.format( date, formatstring ? formatstring : format );
		},
		calendar: function( newcalendar ) {
			if ( newcalendar ) {
				calendar = newcalendar;
				return this;
			}
			return calendar;
		}
	}
}

var today = $.date();

}( jQuery ));