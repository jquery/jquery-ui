/*
 * Calendar math built on jquery-global
 *
 * Based on Marc Grabanski's jQuery Date Plugin
 * http://marcgrabanski.com/articles/jquery-date-plugin
 */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

$.ui = $.ui || {};

var _Date,
	weekdaysRev = {
		"sun": 0,
		"mon": 1,
		"tue": 2,
		"wed": 3,
		"thu": 4,
		"fri": 5,
		"sat": 6
	};

_Date = function( date, attributes ) {
	if ( !( this instanceof _Date ) ) {
		return new _Date( date, attributes );
	}

	this.setAttributes( attributes );

	if ( typeof date === "string" && date.length ) {
		this.dateObject = attributes.parse( date );
	} else if ( $.type( date ) === "date" ) {
		this.dateObject = date;
	}

	this.dateObject = this.dateObject || new Date();
};

$.extend( _Date.prototype, {

	setAttributes: function( attributes ) {
		this.attributes = attributes;
		this.firstDay = weekdaysRev[ this.attributes.firstDay ];
	},

	//TODO: same as the underlying Date object's terminology, but still misleading.
	//TODO: We can use .setTime() instead of new Date and rename to setTimestamp.
	setTime: function( time ) {
		this.dateObject = new Date( time );
		return this;
	},

	setDay: function( day ) {
		var date = this.dateObject;
		// FIXME: Why not to use .setDate?
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
		return this.attributes.formatMonth( this.dateObject );
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
		var date,
			firstDay = this.firstDay,
			result = [];

		// date = firstDay
		date = new Date( this.dateObject.getTime() );
		date.setDate( date.getDate() + firstDay - 1 - date.getDay() );

		for ( var dow = 0; dow < 7; dow++ ) {
			date.setTime( date.getTime() + 86400000 );
			result.push({
				shortname: this.attributes.formatWeekdayShort( date ),
				fullname: this.attributes.formatWeekdayFull( date )
			});
		}

		return result;
	},

	days: function() {
		var result = [],
			today = new _Date( new Date(), this.attributes ),
			date = this.dateObject,
			firstDayOfMonth = new Date( this.year(), date.getMonth(), 1 ).getDay(),
			leadDays = ( firstDayOfMonth - this.firstDay + 7 ) % 7,
			rows = Math.ceil( ( leadDays + this.daysInMonth() ) / 7 ),
			printDate = new Date( this.year(), date.getMonth(), 1 - leadDays );
		for ( var row = 0; row < rows; row++ ) {
			var week = result[ result.length ] = {
				number: this.attributes.formatWeekOfYear( printDate ),
				days: []
			};
			for ( var dayx = 0; dayx < 7; dayx++ ) {
				var day = week.days[ week.days.length ] = {
					lead: printDate.getMonth() !== date.getMonth(),
					date: printDate.getDate(),
					month: printDate.getMonth(),
					year: printDate.getFullYear(),
					timestamp: printDate.getTime(),
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

	clone: function() {
		var date = this.dateObject;
		return new _Date( new Date( date.getTime() ), this.attributes );
	},

	// TODO compare year, month, day each for better performance
	equal: function( other ) {
		var format = function( date ) {
			return "" + date.getFullYear() + date.getMonth() + date.getDate();
		}
		return format( this.dateObject ) === format( other );
	},

	date: function() {
		return this.dateObject;
	}
});

return $.ui.calendarDate = _Date;

} ) );
