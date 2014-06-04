/*
 * Calendar math built on jquery-global
 *
 * Based on Marc Grabanski's jQuery Date Plugin
 * http://marcgrabanski.com/articles/jquery-date-plugin
 */
(function( $, undefined ) {

var weekdays = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ],
	weekdaysRev = {
		"sun": 0,
		"mon": 1,
		"tue": 2,
		"wed": 3,
		"thu": 4,
		"fri": 5,
		"sat": 6
	};

Globalize.locale( "en" );

$.date = function( date, globalFormat ) {
	if ( !( this instanceof $.date ) ) {
		return new $.date( date, globalFormat );
	}
	if ( typeof date === "string" && date.length ) {
		this.dateObject = Globalize.parseDate( date, globalFormat );
	}
	if ( date instanceof Date ) {
		this.dateObject = date;
	}

	this.dateObject = this.dateObject || new Date();
	this.globalFormat = globalFormat;
};

$.date.prototype = {
	setFormat: function( format ) {
		if ( format ) {
			this.globalFormat = format;
		}
		return this;
	},
	//TODO: same as the underlying Date object's terminology, but still misleading.
	//TODO: We can use .setTime() instead of new Date and rename to setTimestamp.
	setTime: function( time ) {
		this.dateObject = new Date( time );
		return this;
	},
	setDay: function( day ) {
		var date = this.dateObject;
		this.dateObject = new Date( date.getFullYear(), date.getMonth(), day, date.getHours(),
			date.getMinutes(), date.getSeconds() );
		return this;
	},
	setMonth: function( month ) {
		// Overflow example:  Month is October 31 (yeah Halloween) and month is changed to April with 30 days,
		// the new date will me May 1.  We will honor the month the user wants to set and if and overflow
		// occurs, set to last day of month.
		var date = this.dateObject,
			days = date.getDay(), year = date.getFullYear();
		if ( days > this.daysInMonth( year, month ) ) {

			// Overflow
			days = this.daysInMonth( year, month );
		}
		this.dateObject = new Date( year, month, days, date.getHours(),
			date.getMinutes(), date.getSeconds() );
		return this;
	},
	setYear: function( year ) {
		var date = this.dateObject,
			day = date.getDate(),
			month = date.getMonth();

		// Check if Leap, and February and day is 29th
		if ( this.isLeapYear( year ) && month == 1 && day == 29 ) {

			// set day to last day of February
			day = this.daysInMonth( year, month );
		}
		this.dateObject = new Date( year, month, day, date.getHours(),
			date.getMinutes(), date.getSeconds() );
		return this;
	},
	setFullDate: function( year, month, day ) {
		this.dateObject = new Date( year, month, day );
		return this;
	},
	adjust: function( period, offset ) {
		var date = this.dateObject,
			day = period == "D" ? date.getDate() + offset : date.getDate(),
			month = period == "M" ? date.getMonth() + offset : date.getMonth(),
			year = period == "Y" ? date.getFullYear() + offset : date.getFullYear();

		// If not day, update the day to the new month and year
		if ( period != "D" ) {
			day = Math.max( 1, Math.min( day, this.daysInMonth( year, month ) ) );
		}
		this.dateObject = new Date( year, month, day, date.getHours(),
			date.getMinutes(), date.getSeconds() );
		return this;
	},
	daysInMonth: function( year, month ) {
		var date = this.dateObject;
		year = year || date.getFullYear();
		month = month || date.getMonth();
		return 32 - new Date( year, month, 32 ).getDate();
	},
	monthName: function() {
		return Globalize.format( this.dateObject, { pattern: "MMMM" } );
	},
	day: function() {
		return this.dateObject.getDate();
	},
	month: function() {
		return this.dateObject.getMonth();
	},
	year: function() {
		return this.dateObject.getFullYear();
	},
	isLeapYear: function( year ) {
		year = year || this.dateObject.getFullYear();
		return new Date( year, 1, 29 ).getMonth() == 1;
	},
	weekdays: function() {
		var result = [];
		for ( var dow = 0; dow < 7; dow++ ) {
			var day = ( dow + weekdaysRev[ Globalize.locale().supplemental.weekData.firstDay() ] ) % 7;
			result.push({
				shortname: Globalize.locale().main([ "dates/calendars/gregorian/days/format/short", weekdays[ day ] ]),
				fullname: Globalize.locale().main([ "dates/calendars/gregorian/days/format/wide", weekdays[ day ] ])
			});
		}
		return result;
	},
	days: function() {
		var result = [],
			today = $.date(),
			date = this.dateObject,
			firstDayOfMonth = new Date( this.year(), date.getMonth(), 1 ).getDay(),
			leadDays = ( firstDayOfMonth - weekdaysRev[ Globalize.locale().supplemental.weekData.firstDay() ] + 7 ) % 7,
			rows = Math.ceil( ( leadDays + this.daysInMonth() ) / 7 ),
			printDate = new Date( this.year(), date.getMonth(), 1 - leadDays );
		for ( var row = 0; row < rows; row++ ) {
			var week = result[ result.length ] = {
				number: Globalize.format( printDate, { pattern: "w" } ),
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
				if ( this.eachDay ) {
					this.eachDay( day );
				}
				// TODO use adjust("D", 1)?
				printDate.setDate( printDate.getDate() + 1 );
			}
		}
		return result;
	},
	// specialized for multi-month template, could be used in general
	months: function( add ) {
		var clone,
			result = [ this ];

		for ( var i = 0; i < add; i++ ) {
			clone = this.clone();
			clone.adjust( "M", i + 1 );
			result.push( clone );
		}
		result[ 0 ].first = true;
		result[ result.length - 1 ].last = true;
		return result;
	},
	select: function() {
		this.selected = this.clone();
		return this;
	},
	selectedDate: function() {
		return this.selected.date();
	},
	clone: function() {
		var date = this.dateObject;
		return new $.date( new Date( date.getFullYear(), date.getMonth(),
			date.getDate(), date.getHours(),
			date.getMinutes(), date.getSeconds()), this.globalFormat );
	},
	// TODO compare year, month, day each for better performance
	equal: function( other ) {
		function format( date ) {
			return Globalize.format( date, { pattern: "yyyyMMdd" } );
		}
		return format( this.dateObject ) === format( other );
	},
	date: function() {
		return this.dateObject;
	},
	format: function( format ) {
		return Globalize.format( this.dateObject, format || this.globalFormat );
	}
};

}( jQuery ));
