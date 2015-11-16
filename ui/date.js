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
			"jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

$.ui.date = function( date, attributes ) {
	if ( !( this instanceof $.ui.date ) ) {
		return new $.ui.date( date, attributes );
	}

	this.setAttributes( attributes );

	if ( typeof date === "string" && date.length ) {
		this.dateObject = attributes.parse( date );
	} else if ( $.type( date ) === "date" ) {
		this.dateObject = date;
	}

	this.dateObject = this.dateObject || new Date();
};

$.extend( $.ui.date.prototype, {

	setAttributes: function( attributes ) {
		this.attributes = attributes;
		this.firstDay = this.attributes.firstDay;
	},

	// TODO: Same as the underlying Date object's terminology, but still misleading.
	// TODO: We can use .setTime() instead of new Date and rename to setTimestamp.
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

	setFullDate: function( year, month, day ) {
		this.dateObject = new Date( year, month, day );
		return this;
	},

	adjust: function( period, offset ) {
		var date = this.dateObject,
			day = period === "D" ? date.getDate() + offset : date.getDate(),
			month = period === "M" ? date.getMonth() + offset : date.getMonth(),
			year = period === "Y" ? date.getFullYear() + offset : date.getFullYear();

		// If not day, update the day to the new month and year
		if ( period !== "D" ) {
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

	weekdays: function() {
		var date, dow,
			firstDay = this.firstDay,
			result = [];

		// date = firstDay
		date = new Date( this.dateObject.getTime() );
		date.setDate( date.getDate() + firstDay - 1 - date.getDay() );

		for ( dow = 0; dow < 7; dow++ ) {
			date.setTime( date.getTime() + 86400000 );
			result.push( {
				shortname: this.attributes.formatWeekdayShort( date ),
				fullname: this.attributes.formatWeekdayFull( date )
			} );
		}

		return result;
	},

	days: function() {
		var row, week, dayx, day,
			result = [],
			today = new $.ui.date( new Date(), this.attributes ),
			date = this.dateObject,
			firstDayOfMonth = new Date( this.year(), date.getMonth(), 1 ).getDay(),
			leadDays = ( firstDayOfMonth - this.firstDay + 7 ) % 7,
			rows = Math.ceil( ( leadDays + this.daysInMonth() ) / 7 ),
			printDate = new Date( this.year(), date.getMonth(), 1 - leadDays );

		for ( row = 0; row < rows; row++ ) {
			week = result[ result.length ] = {
				number: this.attributes.formatWeekOfYear( printDate ),
				days: []
			};
			for ( dayx = 0; dayx < 7; dayx++ ) {
				day = week.days[ week.days.length ] = {
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
		var clone, i,
			result = [ this ];

		for ( i = 0; i < add; i++ ) {
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
		return new $.ui.date( new Date( date.getTime() ), this.attributes );
	},

	equal: function( other ) {
		var format = function( date ) {
			return "" + date.getFullYear() + date.getMonth() + date.getDate();
		};
		return format( this.dateObject ) === format( other );
	},

	date: function() {
		return this.dateObject;
	}
} );

return $.ui.date;

} ) );
