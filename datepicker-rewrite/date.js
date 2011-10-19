/*
 * Calendar math built on jquery-global
 *
 * Based on Marc Grabanski's jQuery Date Plugin
 * http://marcgrabanski.com/articles/jquery-date-plugin
 */
(function( $, undefined ) {

$.date = function ( datestring, formatstring ) {
	//TODO: Need to refactor $.date to be a constructor, move the methods to a prototype.
	var calendar = Globalize.culture().calendar,
		format = formatstring ? formatstring : calendar.patterns.d,
		date = datestring ? Globalize.parseDate(datestring, format) : new Date();

	if ( !date ) {
		date = new Date()
	}

	return {
		refresh: function() {
			calendar = Globalize.culture().calendar;
			format = formatstring || calendar.patterns.d;
			return this;
		},
		setFormat: function( formatstring ) {
			if ( formatstring ) {
				format = formatstring;
			}
			return this;
		},
		//TODO: same as the underlying Date object's terminology, but still misleading.
		//TODO: We can use .setTime() instead of new Date and rename to setTimestamp.
		setTime: function( time ) {
			date = new Date( time );
			return this;
		},
		setDay: function( day ) {
			date = new Date( date.getFullYear(), date.getMonth(), day );
			return this;
		},
		setMonth: function( month ) {
			//TODO: Should update this to keep the time component (hour, min, sec) intact. Same for setYear and setFullDate.
			//TODO: Do we want to do any special handling when switching to a month that causes the days to overflow?
			date = new Date( date.getFullYear(), month, date.getDate());
			return this;
		},
		setYear: function( year ) {
			//TODO: Same question as setMonth, but I suppose only for leap years.
			date = new Date( year, date.getMonth(), date.getDate() );
			return this;
		},
		setFullDate: function( year, month, day ) {
			date = new Date( year, month, day );
			return this;
		},
		adjust: function( period, offset ) {
			var day = period == "D" ? date.getDate() + offset : date.getDate(),
				month = period == "M" ? date.getMonth() + offset : date.getMonth(),
				year = period == "Y" ? date.getFullYear() + offset : date.getFullYear();

			if ( period != "D" ) {
				day = Math.max(1, Math.min( day, this.daysInMonth( year, month ) ) );
			}
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
		day: function() {
			return date.getDate();
		},
		month: function() {
			return date.getMonth();
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
					fullname: calendar.days.names[ day ]
				});
			}
			return result;
		},
		days: function() {
			var result = [],
				today = $.date(),
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
						timestamp: printDate.getTime(),
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
		// specialzed for multi-month template, could be used in general
		months: function( add ) {
			var result = [],
				current = date.getMonth(),
				self = this;
			for ( var i = 0; i < add + 1; i++ ) {
				result.push( this.clone() );
				this.adjust( "M", 1 );
			}
			result[0].first = true;
			result[result.length - 1].last = true;
			date.setMonth(current);
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
			var result = $.date( this.format(), format );
			result.eachDay = this.eachDay;
			return result;
		},
		// TODO compare year, month, day each for better performance
		equal: function( other ) {
			function format( date ) {
				return Globalize.format( date, "d" );
			}
			return format( date ) == format( other );
		},
		date: function() {
			return date;
		},
		format: function( formatstring ) {
			return Globalize.format( date, formatstring ? formatstring : format );
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

}( jQuery ));
