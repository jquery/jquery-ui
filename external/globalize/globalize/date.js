/*!
 * Globalize v1.0.0-alpha.6
 *
 * http://github.com/jquery/globalize
 *
 * Copyright 2010, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-09-01T21:32Z
 */
(function( root, factory ) {

	// UMD returnExports
	if ( typeof define === "function" && define.amd ) {

		// AMD
		define([
			"cldr",
			"../globalize",
			"cldr/event",
			"cldr/supplemental"
		], factory );
	} else if ( typeof exports === "object" ) {

		// Node, CommonJS
		module.exports = factory( require( "cldrjs" ), require( "globalize" ) );
	} else {

		// Extend global
		factory( root.Cldr, root.Globalize );
	}
}(this, function( Cldr, Globalize ) {

var alwaysArray = Globalize._alwaysArray,
	createError = Globalize._createError,
	formatMessage = Globalize._formatMessage,
	isPlainObject = Globalize._isPlainObject,
	validateCldr = Globalize._validateCldr,
	validateDefaultLocale = Globalize._validateDefaultLocale,
	validateParameterPresence = Globalize._validateParameterPresence,
	validateParameterType = Globalize._validateParameterType;


var validateParameterTypeDate = function( value, name ) {
	validateParameterType( value, name, value === undefined || value instanceof Date, "Date" );
};




var validateParameterTypeDatePattern = function( value, name ) {
	validateParameterType(
		value,
		name,
		value === undefined || typeof value === "string" || isPlainObject( value ),
		"String or plain Object"
	);
};




var validateParameterTypeString = function( value, name ) {
	validateParameterType(
		value,
		name,
		value === undefined || typeof value === "string",
		"a string"
	);
};




var objectValues = function( object ) {
	var i,
		result = [];

	for ( i in object ) {
		result.push( object[ i ] );
	}

	return result;
};




/**
 * allPreset()
 *
 * @cldr [Cldr instance].
 *
 * Return an Array with all (skeleton, date, time, datetime) presets.
 */
var dateAllPresets = function( cldr ) {
	var result = [];

	// Skeleton
	result = objectValues( cldr.main(
		"dates/calendars/gregorian/dateTimeFormats/availableFormats") );

	// Time
	result = result.concat( objectValues( cldr.main( "dates/calendars/gregorian/timeFormats" ) ) );

	// Date
	result = result.concat( objectValues( cldr.main( "dates/calendars/gregorian/dateFormats" ) ) );

	// Datetime
	result = result.concat(
		objectValues( cldr.main(
			"dates/calendars/gregorian/dateTimeFormats"
		)).map(function( datetimeFormat, key ) {
			if ( typeof datetimeFormat !== "string" ) {
				return datetimeFormat;
			}
			return formatMessage( datetimeFormat, [
				cldr.main([
					"dates/calendars/gregorian/timeFormats",
					key
				]),
				cldr.main([
					"dates/calendars/gregorian/dateFormats",
					key
				])
			]);
		})
	);

	return result.map(function( pattern ) {
		return { pattern: pattern };
	});
};




var createErrorInvalidParameterValue = function( name, value ) {
	return createError( "E_INVALID_PAR_VALUE", "Invalid `{name}` value ({value}).", {
		name: name,
		value: value
	});
};




/**
 * expandPattern( pattern, cldr )
 *
 * @pattern [String or Object] if String, it's considered a skeleton. Object accepts:
 * - skeleton: [String] lookup availableFormat;
 * - date: [String] ( "full" | "long" | "medium" | "short" );
 * - time: [String] ( "full" | "long" | "medium" | "short" );
 * - datetime: [String] ( "full" | "long" | "medium" | "short" );
 * - pattern: [String] For more info see datetime/format.js.
 *
 * @cldr [Cldr instance].
 *
 * Return the corresponding pattern.
 * Eg for "en":
 * - "GyMMMd" returns "MMM d, y G";
 * - { skeleton: "GyMMMd" } returns "MMM d, y G";
 * - { date: "full" } returns "EEEE, MMMM d, y";
 * - { time: "full" } returns "h:mm:ss a zzzz";
 * - { datetime: "full" } returns "EEEE, MMMM d, y 'at' h:mm:ss a zzzz";
 * - { pattern: "dd/mm" } returns "dd/mm";
 */
var dateExpandPattern = function( pattern, cldr ) {
	var result;

	if ( typeof pattern === "string" ) {
		pattern = { skeleton: pattern };
	}

	switch ( true ) {
		case "skeleton" in pattern:
			result = cldr.main([
				"dates/calendars/gregorian/dateTimeFormats/availableFormats",
				pattern.skeleton
			]);
			break;

		case "date" in pattern:
		case "time" in pattern:
			result = cldr.main([
				"dates/calendars/gregorian",
				"date" in pattern ? "dateFormats" : "timeFormats",
				( pattern.date || pattern.time )
			]);
			break;

		case "datetime" in pattern:
			result = cldr.main([
				"dates/calendars/gregorian/dateTimeFormats",
				pattern.datetime
			]);
			if ( result ) {
				result = formatMessage( result, [
					cldr.main([
						"dates/calendars/gregorian/timeFormats",
						pattern.datetime
					]),
					cldr.main([
						"dates/calendars/gregorian/dateFormats",
						pattern.datetime
					])
				]);
			}
			break;

		case "pattern" in pattern:
			result = pattern.pattern;
			break;

		default:
			throw createErrorInvalidParameterValue({
				name: "pattern",
				value: pattern
			});
	}

	return result;
};




var dateWeekDays = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ];




/**
 * firstDayOfWeek
 */
var dateFirstDayOfWeek = function( cldr ) {
	return dateWeekDays.indexOf( cldr.supplemental.weekData.firstDay() );
};




/**
 * dayOfWeek
 *
 * Return the day of the week normalized by the territory's firstDay [0-6].
 * Eg for "mon":
 * - return 0 if territory is GB, or BR, or DE, or FR (week starts on "mon");
 * - return 1 if territory is US (week starts on "sun");
 * - return 2 if territory is EG (week starts on "sat");
 */
var dateDayOfWeek = function( date, cldr ) {
	return ( date.getDay() - dateFirstDayOfWeek( cldr ) + 7 ) % 7;
};




/**
 * distanceInDays( from, to )
 *
 * Return the distance in days between from and to Dates.
 */
var dateDistanceInDays = function( from, to ) {
	var inDays = 864e5;
	return ( to.getTime() - from.getTime() ) / inDays;
};




/**
 * startOf changes the input to the beginning of the given unit.
 *
 * For example, starting at the start of a day, resets hours, minutes
 * seconds and milliseconds to 0. Starting at the month does the same, but
 * also sets the date to 1.
 *
 * Returns the modified date
 */
var dateStartOf = function( date, unit ) {
	date = new Date( date.getTime() );
	switch ( unit ) {
		case "year":
			date.setMonth( 0 );
		/* falls through */
		case "month":
			date.setDate( 1 );
		/* falls through */
		case "day":
			date.setHours( 0 );
		/* falls through */
		case "hour":
			date.setMinutes( 0 );
		/* falls through */
		case "minute":
			date.setSeconds( 0 );
		/* falls through */
		case "second":
			date.setMilliseconds( 0 );
	}
	return date;
};




/**
 * dayOfYear
 *
 * Return the distance in days of the date to the begin of the year [0-d].
 */
var dateDayOfYear = function( date ) {
	return Math.floor( dateDistanceInDays( dateStartOf( date, "year" ), date ) );
};




/**
 * millisecondsInDay
 */
var dateMillisecondsInDay = function( date ) {
	// TODO Handle daylight savings discontinuities
	return date - dateStartOf( date, "day" );
};




var datePatternRe = (/([a-z])\1*|'[^']+'|''|./ig);




var stringPad = function( str, count, right ) {
	var length;
	if ( typeof str !== "string" ) {
		str = String( str );
	}
	for ( length = str.length; length < count; length += 1 ) {
		str = ( right ? ( str + "0" ) : ( "0" + str ) );
	}
	return str;
};




/**
 * format( date, pattern, cldr )
 *
 * @date [Date instance].
 *
 * @pattern [String] raw pattern.
 * ref: http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Format_Patterns
 *
 * @cldr [Cldr instance].
 *
 * TODO Support other calendar types.
 *
 * Disclosure: this function borrows excerpts of dojo/date/locale.
 */
var dateFormat = function( date, pattern, cldr ) {
	var widths = [ "abbreviated", "wide", "narrow" ];
	return pattern.replace( datePatternRe, function( current ) {
		var pad, ret,
			chr = current.charAt( 0 ),
			length = current.length;

		if ( chr === "j" ) {
			// Locale preferred hHKk.
			// http://www.unicode.org/reports/tr35/tr35-dates.html#Time_Data
			chr = cldr.supplemental.timeData.preferred();
		}

		switch ( chr ) {

			// Era
			case "G":
				ret = cldr.main([
					"dates/calendars/gregorian/eras",
					length <= 3 ? "eraAbbr" : ( length === 4 ? "eraNames" : "eraNarrow" ),
					date.getFullYear() < 0 ? 0 : 1
				]);
				break;

			// Year
			case "y":
				// Plain year.
				// The length specifies the padding, but for two letters it also specifies the
				// maximum length.
				ret = String( date.getFullYear() );
				pad = true;
				if ( length === 2 ) {
					ret = ret.substr( ret.length - 2 );
				}
				break;

			case "Y":
				// Year in "Week of Year"
				// The length specifies the padding, but for two letters it also specifies the
				// maximum length.
				// yearInWeekofYear = date + DaysInAWeek - (dayOfWeek - firstDay) - minDays
				ret = new Date( date.getTime() );
				ret.setDate(
					ret.getDate() + 7 -
					dateDayOfWeek( date, cldr ) -
					dateFirstDayOfWeek( cldr ) -
					cldr.supplemental.weekData.minDays()
				);
				ret = String( ret.getFullYear() );
				pad = true;
				if ( length === 2 ) {
					ret = ret.substr( ret.length - 2 );
				}
				break;

			case "u": // Extended year. Need to be implemented.
			case "U": // Cyclic year name. Need to be implemented.
				throw new Error( "Not implemented" );

			// Quarter
			case "Q":
			case "q":
				ret = Math.ceil( ( date.getMonth() + 1 ) / 3 );
				if ( length <= 2 ) {
					pad = true;
				} else {
					// http://unicode.org/cldr/trac/ticket/6788
					ret = cldr.main([
						"dates/calendars/gregorian/quarters",
						chr === "Q" ? "format" : "stand-alone",
						widths[ length - 3 ],
						ret
					]);
				}
				break;

			// Month
			case "M":
			case "L":
				ret = date.getMonth() + 1;
				if ( length <= 2 ) {
					pad = true;
				} else {
					ret = cldr.main([
						"dates/calendars/gregorian/months",
						chr === "M" ? "format" : "stand-alone",
						widths[ length - 3 ],
						ret
					]);
				}
				break;

			// Week
			case "w":
				// Week of Year.
				// woy = ceil( ( doy + dow of 1/1 ) / 7 ) - minDaysStuff ? 1 : 0.
				// TODO should pad on ww? Not documented, but I guess so.
				ret = dateDayOfWeek( dateStartOf( date, "year" ), cldr );
				ret = Math.ceil( ( dateDayOfYear( date ) + ret ) / 7 ) -
					( 7 - ret >= cldr.supplemental.weekData.minDays() ? 0 : 1 );
				pad = true;
				break;

			case "W":
				// Week of Month.
				// wom = ceil( ( dom + dow of `1/month` ) / 7 ) - minDaysStuff ? 1 : 0.
				ret = dateDayOfWeek( dateStartOf( date, "month" ), cldr );
				ret = Math.ceil( ( date.getDate() + ret ) / 7 ) -
					( 7 - ret >= cldr.supplemental.weekData.minDays() ? 0 : 1 );
				break;

			// Day
			case "d":
				ret = date.getDate();
				pad = true;
				break;

			case "D":
				ret = dateDayOfYear( date ) + 1;
				pad = true;
				break;

			case "F":
				// Day of Week in month. eg. 2nd Wed in July.
				ret = Math.floor( date.getDate() / 7 ) + 1;
				break;

			case "g+":
				// Modified Julian day. Need to be implemented.
				throw new Error( "Not implemented" );

			// Week day
			case "e":
			case "c":
				if ( length <= 2 ) {
					// Range is [1-7] (deduced by example provided on documentation)
					// TODO Should pad with zeros (not specified in the docs)?
					ret = dateDayOfWeek( date, cldr ) + 1;
					pad = true;
					break;
				}

			/* falls through */
			case "E":
				ret = dateWeekDays[ date.getDay() ];
				if ( length === 6 ) {
					// If short day names are not explicitly specified, abbreviated day names are
					// used instead.
					// http://www.unicode.org/reports/tr35/tr35-dates.html#months_days_quarters_eras
					// http://unicode.org/cldr/trac/ticket/6790
					ret = cldr.main([
							"dates/calendars/gregorian/days",
							chr === "c" ? "stand-alone" : "format",
							"short",
							ret
						]) || cldr.main([
							"dates/calendars/gregorian/days",
							chr === "c" ? "stand-alone" : "format",
							"abbreviated",
							ret
						]);
				} else {
					ret = cldr.main([
						"dates/calendars/gregorian/days",
						chr === "c" ? "stand-alone" : "format",
						widths[ length < 3 ? 0 : length - 3 ],
						ret
					]);
				}
				break;

			// Period (AM or PM)
			case "a":
				ret = cldr.main([
					"dates/calendars/gregorian/dayPeriods/format/wide",
					date.getHours() < 12 ? "am" : "pm"
				]);
				break;

			// Hour
			case "h": // 1-12
				ret = ( date.getHours() % 12 ) || 12;
				pad = true;
				break;

			case "H": // 0-23
				ret = date.getHours();
				pad = true;
				break;

			case "K": // 0-11
				ret = date.getHours() % 12;
				pad = true;
				break;

			case "k": // 1-24
				ret = date.getHours() || 24;
				pad = true;
				break;

			// Minute
			case "m":
				ret = date.getMinutes();
				pad = true;
				break;

			// Second
			case "s":
				ret = date.getSeconds();
				pad = true;
				break;

			case "S":
				ret = Math.round( date.getMilliseconds() * Math.pow( 10, length - 3 ) );
				pad = true;
				break;

			case "A":
				ret = Math.round( dateMillisecondsInDay( date ) * Math.pow( 10, length - 3 ) );
				pad = true;
				break;

			// Zone
			// see http://www.unicode.org/reports/tr35/tr35-dates.html#Using_Time_Zone_Names ?
			// Need to be implemented.
			case "z":
			case "Z":
			case "O":
			case "v":
			case "V":
			case "X":
			case "x":
				throw new Error( "Not implemented" );

			// Anything else is considered a literal, including [ ,:/.'@#], chinese, japonese, and
			// arabic characters.
			default:
				return current;
		}
		if ( pad ) {
			ret = stringPad( ret, length );
		}
		return ret;
	});
};




/**
 * tokenizer( value, pattern )
 *
 * Returns an Array of tokens, eg. value "5 o'clock PM", pattern "h 'o''clock' a":
 * [{
 *   type: "h",
 *   lexeme: "5"
 * }, {
 *   type: "literal",
 *   lexeme: " "
 * }, {
 *   type: "literal",
 *   lexeme: "o'clock"
 * }, {
 *   type: "literal",
 *   lexeme: " "
 * }, {
 *   type: "a",
 *   lexeme: "PM",
 *   value: "pm"
 * }]
 *
 * OBS: lexeme's are always String and may return invalid ranges depending of the token type.
 * Eg. "99" for month number.
 *
 * Return an empty Array when not successfully parsed.
 */
var dateTokenizer = function( value, pattern, cldr ) {
	var valid,
		tokens = [],
		widths = [ "abbreviated", "wide", "narrow" ];

	valid = pattern.match( datePatternRe ).every(function( current ) {
		var chr, length, tokenRe,
			token = {};

		function oneDigitIfLengthOne() {
			if ( length === 1 ) {
				return tokenRe = /\d/;
			}
		}

		function oneOrTwoDigitsIfLengthOne() {
			if ( length === 1 ) {
				return tokenRe = /\d\d?/;
			}
		}

		function twoDigitsIfLengthTwo() {
			if ( length === 2 ) {
				return tokenRe = /\d\d/;
			}
		}

		// Brute-force test every locale entry in an attempt to match the given value.
		// Return the first found one (and set token accordingly), or null.
		function lookup( path ) {
			var i, re,
				data = cldr.main( path );
			for ( i in data ) {
				re = new RegExp( "^" + data[ i ] );
				if ( re.test( value ) ) {
					token.value = i;
					return tokenRe = new RegExp( data[ i ] );
				}
			}
			return null;
		}

		token.type = current;
		chr = current.charAt( 0 ),
		length = current.length;

		switch ( chr ) {

			// Era
			case "G":
				lookup([
					"dates/calendars/gregorian/eras",
					length <= 3 ? "eraAbbr" : ( length === 4 ? "eraNames" : "eraNarrow" )
				]);
				break;

			// Year
			case "y":
			case "Y":
				// number l=1:+, l=2:{2}, l=3:{3,}, l=4:{4,}, ...
				if ( length === 1 ) {
					tokenRe = /\d+/;
				} else if ( length === 2 ) {
					tokenRe = /\d\d/;
				} else {
					tokenRe = new RegExp( "\\d{" + length + ",}" );
				}
				break;

			case "u": // Extended year. Need to be implemented.
			case "U": // Cyclic year name. Need to be implemented.
				throw new Error( "Not implemented" );

			// Quarter
			case "Q":
			case "q":
				// number l=1:{1}, l=2:{2}.
				// lookup l=3...
				oneDigitIfLengthOne() || twoDigitsIfLengthTwo() || lookup([
					"dates/calendars/gregorian/quarters",
					chr === "Q" ? "format" : "stand-alone",
					widths[ length - 3 ]
				]);
				break;

			// Month
			case "M":
			case "L":
				// number l=1:{1,2}, l=2:{2}.
				// lookup l=3...
				oneOrTwoDigitsIfLengthOne() || twoDigitsIfLengthTwo() || lookup([
					"dates/calendars/gregorian/months",
					chr === "M" ? "format" : "stand-alone",
					widths[ length - 3 ]
				]);
				break;

			// Day (see d below)
			case "D":
				// number {l,3}.
				if ( length <= 3 ) {
					tokenRe = new RegExp( "\\d{" + length + ",3}" );
				}
				break;

			case "W":
			case "F":
				// number l=1:{1}.
				oneDigitIfLengthOne();
				break;

			case "g+":
				// Modified Julian day. Need to be implemented.
				throw new Error( "Not implemented" );

			// Week day
			case "e":
			case "c":
				// number l=1:{1}, l=2:{2}.
				// lookup for length >=3.
				if ( length <= 2 ) {
					oneDigitIfLengthOne() || twoDigitsIfLengthTwo();
					break;
				}

			/* falls through */
			case "E":
				if ( length === 6 ) {
					// Note: if short day names are not explicitly specified, abbreviated day
					// names are used instead http://www.unicode.org/reports/tr35/tr35-dates.html#months_days_quarters_eras
					lookup([
						"dates/calendars/gregorian/days",
						[ chr === "c" ? "stand-alone" : "format" ],
						"short"
					]) || lookup([
						"dates/calendars/gregorian/days",
						[ chr === "c" ? "stand-alone" : "format" ],
						"abbreviated"
					]);
				} else {
					lookup([
						"dates/calendars/gregorian/days",
						[ chr === "c" ? "stand-alone" : "format" ],
						widths[ length < 3 ? 0 : length - 3 ]
					]);
				}
				break;

			// Period (AM or PM)
			case "a":
				lookup([
					"dates/calendars/gregorian/dayPeriods/format/wide"
				]);
				break;

			// Week, Day, Hour, Minute, or Second
			case "w":
			case "d":
			case "h":
			case "H":
			case "K":
			case "k":
			case "j":
			case "m":
			case "s":
				// number l1:{1,2}, l2:{2}.
				oneOrTwoDigitsIfLengthOne() || twoDigitsIfLengthTwo();
				break;

			case "S":
				// number {l}.
					tokenRe = new RegExp( "\\d{" + length + "}" );
				break;

			case "A":
				// number {l+5}.
					tokenRe = new RegExp( "\\d{" + ( length + 5 ) + "}" );
				break;

			// Zone
			// see http://www.unicode.org/reports/tr35/tr35-dates.html#Using_Time_Zone_Names ?
			// Need to be implemented.
			case "z":
			case "Z":
			case "O":
			case "v":
			case "V":
			case "X":
			case "x":
				throw new Error( "Not implemented" );

			case "'":
				token.type = "literal";
				if ( current.charAt( 1 ) === "'" ) {
					tokenRe = /'/;
				} else {
					tokenRe = /'[^']+'/;
				}
				break;

			default:
				token.type = "literal";
				tokenRe = /./;
		}

		if ( !tokenRe ) {
			return false;
		}

		// Get lexeme and consume it.
		value = value.replace( new RegExp( "^" + tokenRe.source ), function( lexeme ) {
			token.lexeme = lexeme;
			return "";
		});

		if ( !token.lexeme ) {
			return false;
		}

		tokens.push( token );
		return true;
	});

	return valid ? tokens : [];
};




/**
 * Differently from native date.setDate(), this function returns a date whose
 * day remains inside the month boundaries. For example:
 *
 * setDate( FebDate, 31 ): a "Feb 28" date.
 * setDate( SepDate, 31 ): a "Sep 30" date.
 */
var dateSetDate = function( date, day ) {
	var lastDay = new Date( date.getFullYear(), date.getMonth() + 1, 0 ).getDate();

	date.setDate( day < 1 ? 1 : day < lastDay ? day : lastDay );
};




/**
 * Differently from native date.setMonth(), this function adjusts date if
 * needed, so final month is always the one set.
 *
 * setMonth( Jan31Date, 1 ): a "Feb 28" date.
 * setDate( Jan31Date, 8 ): a "Sep 30" date.
 */
var dateSetMonth = function( date, month ) {
	var originalDate = date.getDate();

	date.setDate( 1 );
	date.setMonth( month );
	dateSetDate( date, originalDate );
};


var dateParse = (function() {

function outOfRange( value, low, high ) {
	return value < low || value > high;
}

/**
 * parse
 *
 * ref: http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Format_Patterns
 */
return function( value, pattern, cldr ) {
	var amPm, era, hour, hour12, valid,
		YEAR = 0,
		MONTH = 1,
		DAY = 2,
		HOUR = 3,
		MINUTE = 4,
		SECOND = 5,
		MILLISECONDS = 6,
		date = new Date(),
		tokens = dateTokenizer( value, pattern, cldr ),
		truncateAt = [],
		units = [ "year", "month", "day", "hour", "minute", "second", "milliseconds" ];

	if ( !tokens.length ) {
		return null;
	}

	valid = tokens.every(function( token ) {
		var century, chr, value, length;

		if ( token.type === "literal" ) {
			// continue
			return true;
		}

		chr = token.type.charAt( 0 );
		length = token.type.length;

		if ( chr === "j" ) {
			// Locale preferred hHKk.
			// http://www.unicode.org/reports/tr35/tr35-dates.html#Time_Data
			chr = cldr.supplemental.timeData.preferred();
		}

		switch ( chr ) {

			// Era
			case "G":
				truncateAt.push( YEAR );
				era = +token.value;
				break;

			// Year
			case "y":
				value = +token.lexeme;
				if ( length === 2 ) {
					if ( outOfRange( value, 0, 99 ) ) {
						return false;
					}
					// mimic dojo/date/locale: choose century to apply, according to a sliding
					// window of 80 years before and 20 years after present year.
					century = Math.floor( date.getFullYear() / 100 ) * 100;
					value += century;
					if ( value > date.getFullYear() + 20 ) {
						value -= 100;
					}
				}
				date.setFullYear( value );
				truncateAt.push( YEAR );
				break;

			case "Y": // Year in "Week of Year"
			case "u": // Extended year. Need to be implemented.
			case "U": // Cyclic year name. Need to be implemented.
				throw new Error( "Not implemented" );

			// Quarter (skip)
			case "Q":
			case "q":
				break;

			// Month
			case "M":
			case "L":
				if ( length <= 2 ) {
					value = +token.lexeme;
				} else {
					value = +token.value;
				}
				if ( outOfRange( value, 1, 12 ) ) {
					return false;
				}
				dateSetMonth( date, value - 1 );
				truncateAt.push( MONTH );
				break;

			// Week (skip)
			case "w": // Week of Year.
			case "W": // Week of Month.
				break;

			// Day
			case "d":
				value = +token.lexeme;
				if ( outOfRange( value, 1, 31 ) ) {
					return false;
				}
				dateSetDate( date, value );
				truncateAt.push( DAY );
				break;

			case "D":
				value = +token.lexeme;
				if ( outOfRange( value, 1, 366 ) ) {
					return false;
				}
				date.setMonth(0);
				date.setDate( value );
				truncateAt.push( DAY );
				break;

			case "F":
				// Day of Week in month. eg. 2nd Wed in July.
				// Skip
				break;

			case "g+":
				// Modified Julian day. Need to be implemented.
				throw new Error( "Not implemented" );

			// Week day
			case "e":
			case "c":
			case "E":
				// Skip.
				// value = arrayIndexOf( dateWeekDays, token.value );
				break;

			// Period (AM or PM)
			case "a":
				amPm = token.value;
				break;

			// Hour
			case "h": // 1-12
				value = +token.lexeme;
				if ( outOfRange( value, 1, 12 ) ) {
					return false;
				}
				hour = hour12 = true;
				date.setHours( value === 12 ? 0 : value );
				truncateAt.push( HOUR );
				break;

			case "K": // 0-11
				value = +token.lexeme;
				if ( outOfRange( value, 0, 11 ) ) {
					return false;
				}
				hour = hour12 = true;
				date.setHours( value );
				truncateAt.push( HOUR );
				break;

			case "k": // 1-24
				value = +token.lexeme;
				if ( outOfRange( value, 1, 24 ) ) {
					return false;
				}
				hour = true;
				date.setHours( value === 24 ? 0 : value );
				truncateAt.push( HOUR );
				break;

			case "H": // 0-23
				value = +token.lexeme;
				if ( outOfRange( value, 0, 23 ) ) {
					return false;
				}
				hour = true;
				date.setHours( value );
				truncateAt.push( HOUR );
				break;

			// Minute
			case "m":
				value = +token.lexeme;
				if ( outOfRange( value, 0, 59 ) ) {
					return false;
				}
				date.setMinutes( value );
				truncateAt.push( MINUTE );
				break;

			// Second
			case "s":
				value = +token.lexeme;
				if ( outOfRange( value, 0, 59 ) ) {
					return false;
				}
				date.setSeconds( value );
				truncateAt.push( SECOND );
				break;

			case "A":
				date.setHours( 0 );
				date.setMinutes( 0 );
				date.setSeconds( 0 );

			/* falls through */
			case "S":
				value = Math.round( +token.lexeme * Math.pow( 10, 3 - length ) );
				date.setMilliseconds( value );
				truncateAt.push( MILLISECONDS );
				break;

			// Zone
			// see http://www.unicode.org/reports/tr35/tr35-dates.html#Using_Time_Zone_Names ?
			// Need to be implemented.
			case "z":
			case "Z":
			case "O":
			case "v":
			case "V":
			case "X":
			case "x":
				throw new Error( "Not implemented" );
		}

		return true;
	});

	if ( !valid ) {
		return null;
	}

	// 12-hour format needs AM or PM, 24-hour format doesn't, ie. return null
	// if amPm && !hour12 || !amPm && hour12.
	if ( hour && !( !amPm ^ hour12 ) ) {
		return null;
	}

	if ( era === 0 ) {
		// 1 BC = year 0
		date.setFullYear( date.getFullYear() * -1 + 1 );
	}

	if ( hour12 && amPm === "pm" ) {
		date.setHours( date.getHours() + 12 );
	}

	// Truncate date at the most precise unit defined. Eg.
	// If value is "12/31", and pattern is "MM/dd":
	// => new Date( <current Year>, 12, 31, 0, 0, 0, 0 );
	truncateAt = Math.max.apply( null, truncateAt );
	date = dateStartOf( date, units[ truncateAt ] );

	return date;
};

}());


function validateRequiredCldr( path, value ) {
	validateCldr( path, value, {
		skip: [
			/dates\/calendars\/gregorian\/days\/.*\/short/,
			/supplemental\/timeData\/(?!001)/,
			/supplemental\/weekData\/(?!001)/
		]
	});
}

/**
 * .formatDate( value, pattern )
 *
 * @value [Date]
 *
 * @pattern [String or Object] see date/expand_pattern for more info.
 *
 * Formats a date or number according to the given pattern string and the default/instance locale.
 */
Globalize.formatDate =
Globalize.prototype.formatDate = function( value, pattern ) {
	var cldr, ret;

	validateParameterPresence( value, "value" );
	validateParameterPresence( pattern, "pattern" );
	validateParameterTypeDate( value, "value" );
	validateParameterTypeDatePattern( pattern, "pattern" );

	cldr = this.cldr;

	validateDefaultLocale( cldr );

	cldr.on( "get", validateRequiredCldr );
	pattern = dateExpandPattern( pattern, cldr );
	ret = dateFormat( value, pattern, cldr );
	cldr.off( "get", validateRequiredCldr );

	return ret;
};

/**
 * .parseDate( value, patterns )
 *
 * @value [String]
 *
 * @patterns [Array] Optional. See date/expand_pattern for more info about each pattern. Defaults
 * to the list of all presets defined in the locale (see date/all_presets for more info).
 *
 * Return a Date instance or null.
 */
Globalize.parseDate =
Globalize.prototype.parseDate = function( value, patterns ) {
	var cldr, date;

	validateParameterPresence( value, "value" );
	validateParameterTypeString( value, "value" );

	cldr = this.cldr;

	validateDefaultLocale( cldr );

	cldr.on( "get", validateRequiredCldr );

	if ( !patterns ) {
		patterns = dateAllPresets( cldr );
	} else {
		patterns = alwaysArray( patterns );
	}

	patterns.some(function( pattern ) {
		validateParameterTypeDatePattern( pattern, "patterns" );
		pattern = dateExpandPattern( pattern, cldr );
		date = dateParse( value, pattern, cldr );
		return !!date;
	});

	cldr.off( "get", validateRequiredCldr );

	return date || null;
};

return Globalize;




}));
