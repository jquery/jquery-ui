/*!
 * Globalize v1.0.0pre
 *
 * http://github.com/jquery/globalize
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-12-01T12:08Z
 */
(function( root, factory ) {

	if ( typeof define === "function" && define.amd ) {
		// AMD.
		define( factory );
	} else if ( typeof module === "object" && typeof module.exports === "object" ) {
		// Node. CommonJS.
		module.exports = factory();
	} else {
		// Global
		root.Globalize = factory();
	}

}( this, function() {

/**
 * CLDR JavaScript Library v0.2.4-pre
 * http://jquery.com/
 *
 * Copyright 2013 Rafael Xavier de Souza
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-11-30T11:30Z
 */
/*!
 * CLDR JavaScript Library v0.2.4-pre 2013-11-30T11:30Z MIT license © Rafael Xavier
 * http://git.io/h4lmVg
 */
	var Cldr = (function() {



	var alwaysArray = function( stringOrArray ) {
		return typeof stringOrArray === "string" ?  [ stringOrArray ] : stringOrArray;
	};




	var common = function( Cldr ) {

		Cldr.prototype.main = function( path ) {
			path = alwaysArray( path );
			return this.get( [ "main/{languageId}" ].concat( path ) );
		};

	};




	var arrayIsArray = Array.isArray || function( obj ) {
		return Object.prototype.toString.call( obj ) === "[object Array]";
	};




	var pathNormalize = function( path, attributes ) {
		if ( arrayIsArray( path ) ) {
			path = path.join( "/" );
		}
		if ( typeof path !== "string" ) {
			throw new Error( "invalid path \"" + path + "\"" );
		}
		// 1: Ignore leading slash `/`
		// 2: Ignore leading `cldr/`
		path = path
			.replace( /^\// , "" ) /* 1 */
			.replace( /^cldr\// , "" ); /* 2 */

		// Replace {attribute}'s
		path = path.replace( /{[a-zA-Z]+}/g, function( name ) {
			name = name.replace( /^{([^}]*)}$/, "$1" );
			return attributes[ name ];
		});

		return path.split( "/" );
	};




	var arraySome = function( array, callback ) {
		var i, length;
		if ( array.some ) {
			return array.some( callback );
		}
		for ( i = 0, length = array.length; i < length; i++ ) {
			if ( callback( array[ i ], i, array ) ) {
				return true;
			}
		}
		return false;
	};




	// Return the maximized language id as defined in
	// http://www.unicode.org/reports/tr35/#Likely_Subtags
	// 1. Canonicalize.
	// 1.1 Make sure the input locale is in canonical form: uses the right separator, and has the right casing.
	// TODO Right casing? What df? It seems languages are lowercase, scripts are Capitalized, territory is uppercase. I am leaving this as an exercise to the user.

	// 1.2 Replace any deprecated subtags with their canonical values using the <alias> data in supplemental metadata. Use the first value in the replacement list, if it exists. Language tag replacements may have multiple parts, such as "sh" ➞ "sr_Latn" or mo" ➞ "ro_MD". In such a case, the original script and/or region are retained if there is one. Thus "sh_Arab_AQ" ➞ "sr_Arab_AQ", not "sr_Latn_AQ".
	// TODO What <alias> data?

	// 1.3 If the tag is grandfathered (see <variable id="$grandfathered" type="choice"> in the supplemental data), then return it.
	// TODO grandfathered?

	// 1.4 Remove the script code 'Zzzz' and the region code 'ZZ' if they occur.
	// 1.5 Get the components of the cleaned-up source tag (languages, scripts, and regions), plus any variants and extensions.
	// 2. Lookup. Lookup each of the following in order, and stop on the first match:
	// 2.1 languages_scripts_regions
	// 2.2 languages_regions
	// 2.3 languages_scripts
	// 2.4 languages
	// 2.5 und_scripts
	// 3. Return
	// 3.1 If there is no match, either return an error value, or the match for "und" (in APIs where a valid language tag is required).
	// 3.2 Otherwise there is a match = languagem_scriptm_regionm
	// 3.3 Let xr = xs if xs is not empty, and xm otherwise.
	// 3.4 Return the language tag composed of languager _ scriptr _ regionr + variants + extensions .

	//
	// @subtags [Array] normalized language id subtags tuple (see init.js).
	var likelySubtags = function( cldr, subtags, options ) {
		var match, matchFound,
			language = subtags[ 0 ],
			script = subtags[ 1 ],
			territory = subtags[ 2 ];
		options = options || {};

		// Skip if (language, script, territory) is not empty [3.3]
		if ( language !== "und" && script !== "Zzzz" && territory !== "ZZ" ) {
			return [ language, script, territory ];
		}

		// Skip if no supplemental likelySubtags data is present
		if ( typeof cldr.get( "supplemental/likelySubtags" ) === "undefined" ) {
			return;
		}

		// [2]
		matchFound = arraySome([
			[ language, script, territory ],
			[ language, territory ],
			[ language, script ],
			[ language ],
			[ "und", script ]
		], function( test ) {
			return match = !(/\b(Zzzz|ZZ)\b/).test( test.join( "_" ) ) /* [1.4] */ && cldr.get( [ "supplemental/likelySubtags", test.join( "_" ) ] );
		});

		// [3]
		if ( matchFound ) {
			// [3.2 .. 3.4]
			match = match.split( "_" );
			return [
				language !== "und" ? language : match[ 0 ],
				script !== "Zzzz" ? script : match[ 1 ],
				territory !== "ZZ" ? territory : match[ 2 ]
			];
		} else if ( options.force ) {
			// [3.1.2]
			return cldr.get( "supplemental/likelySubtags/und" ).split( "_" );
		} else {
			// [3.1.1]
			return;
		}
	};



	// Given a locale, remove any fields that Add Likely Subtags would add.
	// http://www.unicode.org/reports/tr35/#Likely_Subtags
	// 1. First get max = AddLikelySubtags(inputLocale). If an error is signaled, return it.
	// 2. Remove the variants from max.
	// 3. Then for trial in {language, language _ region, language _ script}. If AddLikelySubtags(trial) = max, then return trial + variants.
	// 4. If you do not get a match, return max + variants.
	// 
	// @maxLanguageId [Array] maxLanguageId tuple (see init.js).
	var removeLikelySubtags = function( cldr, maxLanguageId ) {
		var match, matchFound,
			language = maxLanguageId[ 0 ],
			script = maxLanguageId[ 1 ],
			territory = maxLanguageId[ 2 ];

		// [3]
		matchFound = arraySome([
			[ [ language, "Zzzz", "ZZ" ], [ language ] ],
			[ [ language, "Zzzz", territory ], [ language, territory ] ],
			[ [ language, script, "ZZ" ], [ language, script ] ]
		], function( test ) {
			var result = likelySubtags( cldr, test[ 0 ] );
			match = test[ 1 ];
			return result && result[ 0 ] === maxLanguageId[ 0 ] &&
				result[ 1 ] === maxLanguageId[ 1 ] &&
				result[ 2 ] === maxLanguageId[ 2 ];
		});

		// [4]
		return matchFound ?  match : maxLanguageId;
	};




	var supplemental = function( cldr ) {

		var prepend, supplemental;
		
		prepend = function( prepend ) {
			return function( path ) {
				path = alwaysArray( path );
				return cldr.get( [ prepend ].concat( path ) );
			};
		};

		supplemental = prepend( "supplemental" );

		// Week Data
		// http://www.unicode.org/reports/tr35/tr35-dates.html#Week_Data
		supplemental.weekData = prepend( "supplemental/weekData" );

		supplemental.weekData.firstDay = function() {
			return cldr.get( "supplemental/weekData/firstDay/{territory}" ) ||
				cldr.get( "supplemental/weekData/firstDay/001" );
		};

		supplemental.weekData.minDays = function() {
			var minDays = cldr.get( "supplemental/weekData/minDays/{territory}" ) ||
				cldr.get( "supplemental/weekData/minDays/001" );
			return parseInt( minDays, 10 );
		};

		// Time Data
		// http://www.unicode.org/reports/tr35/tr35-dates.html#Time_Data
		supplemental.timeData = prepend( "supplemental/timeData" );

		supplemental.timeData.allowed = function() {
			return cldr.get( "supplemental/timeData/{territory}/_allowed" ) ||
				cldr.get( "supplemental/timeData/001/_allowed" );
		};

		supplemental.timeData.preferred = function() {
			return cldr.get( "supplemental/timeData/{territory}/_preferred" ) ||
				cldr.get( "supplemental/timeData/001/_preferred" );
		};

		return supplemental;

	};




	var init = function( locale ) {
		var language, languageId, maxLanguageId, script, territory, unicodeLanguageId, variant;

		if ( typeof locale !== "string" ) {
			throw new Error( "invalid locale type: \"" + JSON.stringify( locale ) + "\"" );
		}

		// Normalize locale code.
		// Get (or deduce) the "triple subtags": language, territory (also aliased as region), and script subtags.
		// Get the variant subtags (calendar, collation, currency, etc).
		// refs:
		// - http://www.unicode.org/reports/tr35/#Field_Definitions
		// - http://www.unicode.org/reports/tr35/#Language_and_Locale_IDs
		// - http://www.unicode.org/reports/tr35/#Unicode_locale_identifier

		locale = locale.replace( /-/, "_" );

		// TODO normalize unicode locale extensions. Currently, skipped.
		// unicodeLocaleExtensions = locale.split( "_u_" )[ 1 ];
		locale = locale.split( "_u_" )[ 0 ];

		// TODO normalize transformed extensions. Currently, skipped.
		// transformedExtensions = locale.split( "_t_" )[ 1 ];
		locale = locale.split( "_t_" )[ 0 ];

		unicodeLanguageId = locale;

		// unicodeLanguageId = ...
		switch ( true ) {

			// language_script_territory..
			case /^[a-z]{2}_[A-Z][a-z]{3}_[A-Z0-9]{2}(\b|_)/.test( unicodeLanguageId ):
				language = unicodeLanguageId.split( "_" )[ 0 ];
				script = unicodeLanguageId.split( "_" )[ 1 ];
				territory = unicodeLanguageId.split( "_" )[ 2 ];
				variant = unicodeLanguageId.split( "_" )[ 3 ];
				break;

			// language_script..
			case /^[a-z]{2}_[A-Z][a-z]{3}(\b|_)/.test( unicodeLanguageId ):
				language = unicodeLanguageId.split( "_" )[ 0 ];
				script = unicodeLanguageId.split( "_" )[ 1 ];
				territory = "ZZ";
				variant = unicodeLanguageId.split( "_" )[ 2 ];
				break;

			// language_territory..
			case /^[a-z]{2}_[A-Z0-9]{2}(\b|_)/.test( unicodeLanguageId ):
				language = unicodeLanguageId.split( "_" )[ 0 ];
				script = "Zzzz";
				territory = unicodeLanguageId.split( "_" )[ 1 ];
				variant = unicodeLanguageId.split( "_" )[ 2 ];
				break;

			// language.., or root
			case /^([a-z]{2}|root)(\b|_)/.test( unicodeLanguageId ):
				language = unicodeLanguageId.split( "_" )[ 0 ];
				script = "Zzzz";
				territory = "ZZ";
				variant = unicodeLanguageId.split( "_" )[ 1 ];
				break;

			default:
				language = "und";
				break;
		}

		// When a locale id does not specify a language, or territory (region), or script, they are obtained by Likely Subtags.
		maxLanguageId = likelySubtags( this, [ language, script, territory ], { force: true } ) || unicodeLanguageId.split( "_" );
		language = maxLanguageId[ 0 ];
		script = maxLanguageId[ 1 ];
		territory  = maxLanguageId[ 2 ];

		// TODO json content distributed on zip file use languageId with `-` on main.<lang>. Why `-` vs. `_` ?
		languageId = removeLikelySubtags( this, maxLanguageId ).join( "_" );

		// Set attributes
		this.attributes = {

			// Unicode Language Id
			languageId: languageId,
			maxLanguageId: maxLanguageId.join( "_" ),

			// Unicode Language Id Subtabs
			language: language,
			script: script,
			territory: territory,
			region: territory, /* alias */
			variant: variant
		};

		this.locale = variant ? [ languageId, variant ].join( "_" ) : languageId;

		// Inlcude supplemental helper
		this.supplemental = supplemental( this );
	};




	// @path: normalized path
	var resourceGet = function( data, path ) {
		var i,
			node = data,
			length = path.length;

		for ( i = 0; i < length - 1; i++ ) {
			node = node[ path[ i ] ];
			if ( !node ) {
				return undefined;
			}
		}
		return node[ path[ i ] ];
	};




	var bundleParentLookup = function( Cldr, locale ) {
		var parent;

		if ( locale === "root" ) {
			return;
		}

		// First, try to find parent on supplemental data.
		parent = resourceGet( Cldr._resolved, pathNormalize( [ "supplemental/parentLocales/parentLocale", locale ] ) );
		if ( parent ) {
			return parent;
		}

		// Or truncate locale.
		parent = locale.substr( 0, locale.lastIndexOf( "_" ) );
		if ( !parent ) {
			return "root";
		}

		return parent;
	};




	// @path: normalized path
	var resourceSet = function( data, path, value ) {
		var i,
			node = data,
			length = path.length;

		for ( i = 0; i < length - 1; i++ ) {
			if ( !node[ path[ i ] ] ) {
				node[ path[ i ] ] = {};
			}
			node = node[ path[ i ] ];
		}
		node[ path[ i ] ] = value;
	};




	var arrayForEach = function( array, callback ) {
		var i, length;
		if ( array.forEach ) {
			return array.forEach( callback );
		}
		for ( i = 0, length = array.length; i < length; i++ ) {
			callback( array[ i ], i, array );
		}
	};


	var jsonMerge = (function() {

	// Returns new deeply merged JSON.
	//
	// Eg.
	// merge( { a: { b: 1, c: 2 } }, { a: { b: 3, d: 4 } } )
	// -> { a: { b: 3, c: 2, d: 4 } }
	//
	// @arguments JSON's
	// 
	var merge = function() {
		var destination = {},
			sources = [].slice.call( arguments, 0 );
		arrayForEach( sources, function( source ) {
			var prop;
			for ( prop in source ) {
				if ( prop in destination && arrayIsArray( destination[ prop ] ) ) {

					// Concat Arrays
					destination[ prop ] = destination[ prop ].concat( source[ prop ] );

				} else if ( prop in destination && typeof destination[ prop ] === "object" ) {

					// Merge Objects
					destination[ prop ] = merge( destination[ prop ], source[ prop ] );

				} else {

					// Set new values
					destination[ prop ] = source[ prop ];

				}
			}
		});
		return destination;
	};

	return merge;

}());
	var itemLookup = (function() {

	var lookup;

	lookup = function( Cldr, locale, path, attributes, childLocale ) {
		var normalizedPath, parent, value;

		// 1: Finish recursion
		// 2: Avoid infinite loop
		if ( typeof locale === "undefined" /* 1 */ || locale === childLocale /* 2 */ ) {
			return;
		}

		// Resolve path
		normalizedPath = pathNormalize( path, attributes );

		// Check resolved (cached) data first
		value = resourceGet( Cldr._resolved, normalizedPath );
		if ( value ) {
			return value;
		}

		// Check raw data
		value = resourceGet( Cldr._raw, normalizedPath );

		if ( !value ) {
			// Or, lookup at parent locale
			parent = bundleParentLookup( Cldr, locale );
			value = lookup( Cldr, parent, path, jsonMerge( attributes, { languageId: parent }), locale );
		}

		// Set resolved (cached)
		resourceSet( Cldr._resolved, normalizedPath, value );

		return value;
	};

	return lookup;

}());


	var itemGetResolved = function( Cldr, path, attributes ) {
		// Resolve path
		var normalizedPath = pathNormalize( path, attributes );

		return resourceGet( Cldr._resolved, normalizedPath );
	};




	var Cldr = function() {
		init.apply( this, arguments );
	};

	Cldr._resolved = {};
	Cldr._raw = {};

	// Load resolved or unresolved cldr data
	// @json [JSON]
	Cldr.load = function( json ) {
		if ( typeof json !== "object" ) {
			throw new Error( "invalid json" );
		}
		Cldr._raw = jsonMerge( Cldr._raw, json );
	};

	Cldr.prototype.get = function( path ) {
		// Simplify locale using languageId (there are no other resource bundles)
		// 1: during init(), get is called, but languageId is not defined. Use "" as a workaround in this very specific scenario.
		var locale = this.attributes && this.attributes.languageId || "" /* 1 */;

		return itemGetResolved( Cldr, path, this.attributes ) ||
			itemLookup( Cldr, locale, path, this.attributes );
	};

	common( Cldr );

	return Cldr;



}());


	var arrayMap = function( array, callback ) {
		var clone, i, length;
		if ( array.map ) {
			return array.map( callback );
		}
		for ( clone = [], i = 0, length = array.length; i < length; i++ ) {
			clone[ i ] = callback( array[ i ], i, array );
		}
		return clone;
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
	var datetimeAllPresets = function( cldr ) {
		var result = [];

		// Skeleton
		result = objectValues( cldr.main( "dates/calendars/gregorian/dateTimeFormats/availableFormats" ) );

		// Time
		result = result.concat( objectValues( cldr.main( "dates/calendars/gregorian/timeFormats" ) ) );

		// Date
		result = result.concat( objectValues( cldr.main( "dates/calendars/gregorian/dateFormats" ) ) );

		// Datetime
		result = result.concat( arrayMap( objectValues( cldr.main( "dates/calendars/gregorian/dateTimeFormats" ) ), function( datetimeFormat, key ) {
			if ( typeof datetimeFormat !== "string" ) {
				return datetimeFormat;
			}
			return datetimeFormat
				.replace( /\{0\}/, cldr.main([
					"dates/calendars/gregorian/timeFormats",
					key
				]))
				.replace( /\{1\}/, cldr.main([
					"dates/calendars/gregorian/dateFormats",
					key
				]));
		}));

		return arrayMap( result, function( pattern ) {
			return { pattern: pattern };
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
	var datetimeExpandPattern = function( pattern, cldr ) {
		var result;

		if ( typeof pattern === "string" ) {
			pattern = { skeleton: pattern };
		}

		if ( typeof pattern === "object" ) {

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
						result = result
							.replace( /\{0\}/, cldr.main([
								"dates/calendars/gregorian/timeFormats",
								pattern.datetime
							]))
							.replace( /\{1\}/, cldr.main([
								"dates/calendars/gregorian/dateFormats",
								pattern.datetime
							]));
					}
					break;

				case "pattern" in pattern:
					result = pattern.pattern;
					break;

				default:
					throw new Error( "Invalid pattern" );
			}

		} else {
			throw new Error( "Invalid pattern" );
		}

		if ( !result ) {
			throw new Error( "Pattern not found" );
		}

		return result;
	};



	var datetimeWeekDays = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ];



	var arrayIndexOf = function( array, item ) {
		if ( array.indexOf ) {
			return array.indexOf( item );
		}
		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[i] === item ) {
				return i;
			}
		}
		return -1;
	};




	/**
	 * firstDayOfWeek
	 */
	var datetimeFirstDayOfWeek = function( cldr ) {
		return arrayIndexOf( datetimeWeekDays, cldr.supplemental.weekData.firstDay() );
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
	var datetimeDayOfWeek = function( date, cldr ) {
		return ( date.getDay() - datetimeFirstDayOfWeek( cldr ) + 7 ) % 7;
	};




	/**
	 * distanceInDays( from, to )
	 *
	 * Return the distance in days between from and to Dates.
	 */
	var datetimeDistanceInDays = function( from, to ) {
		var inDays = 864e5;
		return ( to.getTime() - from.getTime() ) / inDays;
	};




	/**
	 * startOf
	 *
	 * Return the 
	 */
	var datetimeStartOf = function( date, unit ) {
		date = new Date( date.getTime() );
		switch( unit ) {
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
	var datetimeDayOfYear = function( date ) {
		return Math.floor( datetimeDistanceInDays( datetimeStartOf( date, "year" ), date ) );
	};




	/**
	 * millisecondsInDay
	 */
	var datetimeMillisecondsInDay = function( date ) {
		// TODO Handle daylight savings discontinuities
		return date - datetimeStartOf( date, "day" );
	};



	var datetimePatternRe = (/([a-z])\1*|'[^']+'|''|./ig);



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
	var datetimeFormat = function( date, pattern, cldr ) {
		var widths = [ "abbreviated", "wide", "narrow" ];
		return pattern.replace( datetimePatternRe, function( current ) {
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
					// The length specifies the padding, but for two letters it also specifies the maximum length.
					ret = String( date.getFullYear() );
					pad = true;
					if ( length === 2 ) {
						ret = ret.substr( ret.length - 2 );
					}
					break;

				case "Y":
					// Year in "Week of Year"
					// The length specifies the padding, but for two letters it also specifies the maximum length.
					// yearInWeekofYear = date + DaysInAWeek - (dayOfWeek - firstDay) - minDays
					ret = new Date( date.getTime() );
					ret.setDate( ret.getDate() + 7 - ( datetimeDayOfWeek( date, cldr ) - datetimeFirstDayOfWeek( cldr ) ) - cldr.supplemental.weekData.minDays() );
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
					ret = datetimeDayOfWeek( datetimeStartOf( date, "year" ), cldr );
					ret = Math.ceil( ( datetimeDayOfYear( date ) + ret ) / 7 ) - ( 7 - ret >= cldr.supplemental.weekData.minDays() ? 0 : 1 );
					pad = true;
					break;

				case "W":
					// Week of Month.
					// wom = ceil( ( dom + dow of `1/month` ) / 7 ) - minDaysStuff ? 1 : 0.
					ret = datetimeDayOfWeek( datetimeStartOf( date, "month" ), cldr );
					ret = Math.ceil( ( date.getDate() + ret ) / 7 ) - ( 7 - ret >= cldr.supplemental.weekData.minDays() ? 0 : 1 );
					break;

				// Day
				case "d":
					ret = date.getDate();
					pad = true;
					break;

				case "D":
					ret = datetimeDayOfYear( date ) + 1;
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
						ret = datetimeDayOfWeek( date, cldr ) + 1;
						pad = true;
						break;
					}

				/* falls through */
				case "E":
					ret = datetimeWeekDays[ date.getDay() ];
					if ( length === 6 ) {
						// If short day names are not explicitly specified, abbreviated day names are used instead.
						// http://www.unicode.org/reports/tr35/tr35-dates.html#months_days_quarters_eras
						// http://unicode.org/cldr/trac/ticket/6790
						ret = cldr.main([
								"dates/calendars/gregorian/days",
								[ chr === "c" ? "stand-alone" : "format" ],
								"short",
								ret
							]) || cldr.main([
								"dates/calendars/gregorian/days",
								[ chr === "c" ? "stand-alone" : "format" ],
								"abbreviated",
								ret
							]);
					} else {
						ret = cldr.main([
							"dates/calendars/gregorian/days",
							[ chr === "c" ? "stand-alone" : "format" ],
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
					ret = Math.round( datetimeMillisecondsInDay( date ) * Math.pow( 10, length - 3 ) );
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

				// Anything else is considered a literal, including [ ,:/.'@#], chinese, japonese, and arabic characters.
				default:
					return current;
			}
			if ( pad ) {
				ret = stringPad( ret, length );
			}
			return ret;
		});
	};




	var arrayEvery = function( array, callback ) {
		var i, length;
		if ( array.every ) {
			return array.every( callback );
		}
		for ( i = 0, length = array.length; i < length; i++ ) {
			if ( !callback( array[ i ], i, array ) ) {
				return false;
			}
		}
		return true;
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
	 * OBS: lexeme's are always String and may return invalid ranges depending of the token type. Eg. "99" for month number.
	 *
	 * Return an empty Array when not successfully parsed.
	 */
	var datetimeTokenizer = function( value, pattern, cldr ) {
		var valid,
			tokens = [],
			widths = [ "abbreviated", "wide", "narrow" ];

		valid = arrayEvery( pattern.match( datetimePatternRe ), function( current ) {
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
					if( length <= 2 ) {
						oneDigitIfLengthOne() || twoDigitsIfLengthTwo();
						break;
					}

				/* falls through */
				case "E":
					if ( length === 6 ) {
						// Note: if short day names are not explicitly specified, abbreviated day names are used instead http://www.unicode.org/reports/tr35/tr35-dates.html#months_days_quarters_eras
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


	var datetimeParse = (function() {

	function outOfRange( value, low, high ) {
		return value < low || value > high;
	}

	/**
	 * parse
	 *
	 * ref: http://www.unicode.org/reports/tr35/tr35-dates.html#Date_Format_Patterns
	 */
	return function( value, pattern, cldr ) {
		var amPm, era, hour24, valid,
			YEAR = 0,
			MONTH = 1,
			DAY = 2,
			HOUR = 3,
			MINUTE = 4,
			SECOND = 5,
			MILLISECONDS = 6,
			date = new Date(),
			tokens = datetimeTokenizer( value, pattern, cldr ),
			truncateAt = [],
			units = [ "year", "month", "day", "hour", "minute", "second", "milliseconds" ];

		if ( !tokens.length ) {
			return null;
		}

		valid = arrayEvery( tokens, function( token ) {
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
						// mimic dojo/date/locale: choose century to apply, according to a sliding window of 80 years before and 20 years after present year.
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
					if( outOfRange( value, 1, 12 ) ) {
						return false;
					}
					date.setMonth( value - 1 );
					truncateAt.push( MONTH );
					break;

				// Week (skip)
				case "w": // Week of Year.
				case "W": // Week of Month.
					break;

				// Day
				case "d":
					value = +token.lexeme;
					if( outOfRange( value, 1, 31 ) ) {
						return false;
					}
					date.setDate( value );
					truncateAt.push( DAY );
					break;

				case "D":
					value = +token.lexeme;
					if( outOfRange( value, 1, 366 ) ) {
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
					// value = arrayIndexOf( datetimeWeekDays, token.value );
					break;

				// Period (AM or PM)
				case "a":
					amPm = token.value;
					break;

				// Hour
				case "K": // 0-11
					value = +token.lexeme + 1;

				/* falls through */
				case "h": // 1-12
					value = value || +token.lexeme;
					if( outOfRange( value, 1, 12 ) ) {
						return false;
					}
					date.setHours( value );
					truncateAt.push( HOUR );
					break;

				case "H": // 0-23
					value = +token.lexeme + 1;

				/* falls through */
				case "k": // 1-24
					hour24 = true;
					value = value || +token.lexeme;
					if( outOfRange( value, 1, 24 ) ) {
						return false;
					}
					date.setHours( value );
					truncateAt.push( HOUR );
					break;

				// Minute
				case "m":
					value = +token.lexeme;
					if( outOfRange( value, 0, 59 ) ) {
						return false;
					}
					date.setMinutes( value );
					truncateAt.push( MINUTE );
					break;

				// Second
				case "s":
					value = +token.lexeme;
					if( outOfRange( value, 0, 59 ) ) {
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

		if ( !valid || amPm && hour24 ) {
			return null;
		}

		if ( era === 0 ) {
			// 1 BC = year 0
			date.setFullYear( date.getFullYear() * -1 + 1 );
		}

		if ( amPm === "pm" && date.getHours() !== 12 ) {
			date.setHours( date.getHours() + 12 );
		}

		// Truncate date at the most precise unit defined. Eg.
		// If value is "12/31", and pattern is "MM/dd":
		// => new Date( <current Year>, 12, 31, 0, 0, 0, 0 );
		truncateAt = Math.max.apply( null, truncateAt );
		date = datetimeStartOf( date, units[ truncateAt ] );

		return date;
	};

}());


	var arrayIsArray = Array.isArray || function( obj ) {
		return Object.prototype.toString.call( obj ) === "[object Array]";
	};




	var alwaysArray = function( stringOrArray ) {
		return arrayIsArray( stringOrArray ) ?  stringOrArray : [ stringOrArray ];
	};




	var arraySome = function( array, callback ) {
		var i, length;
		if ( array.some ) {
			return array.some( callback );
		}
		for ( i = 0, length = array.length; i < length; i++ ) {
			if ( callback( array[ i ], i, array ) ) {
				return true;
			}
		}
		return false;
	};




	var defaultLocale;

	function getLocale( locale ) {
		return locale ? new Cldr( locale ) : defaultLocale;
	}

	var Globalize = {};

	/**
	 * Globalize.load( json )
	 *
	 * @json [JSON]
	 *
	 * Load resolved or unresolved cldr data.
	 * Somewhat equivalent to previous Globalize.addCultureInfo(...).
	 */
	Globalize.load = function( json ) {
		Cldr.load( json );
	};

	/**
	 * Globalize.loadTranslations( locale, json )
	 *
	 * @locale [String]
	 *
	 * @json [JSON]
	 *
	 * Load translation data per locale.
	 */
	Globalize.loadTranslations = function( locale, json ) {
		var customData = {
			"globalize-translation": {}
		};
		locale = new Cldr( locale );
		customData[ "globalize-translation" ][ locale.attributes.languageId ] = json;
		Cldr.load( customData );
	};

	/**
	 * Globalize.locale( locale )
	 *
	 * @locale [String]
	 *
	 * Set default locale.
	 * Somewhat equivalent to previous culture( selector ).
	 */
	Globalize.locale = function( locale ) {
		if ( arguments.length ) {
			defaultLocale = new Cldr( locale );
		}
		return defaultLocale;
	};

	/**
	 * Globalize.format( value, pattern, locale )
	 *
	 * @value [Date or Number]
	 *
	 * @pattern [String or Object] see datetime/expand_pattern for more info.
	 *
	 * @locale [String]
	 *
	 * Formats a date or number according to the given pattern string and the given locale (or the default locale if not specified).
	 */
	Globalize.format = function( value, pattern, locale ) {
		locale = getLocale( locale );

		if ( value instanceof Date ) {

			if ( !pattern ) {
				throw new Error( "Missing pattern" );
			}
			pattern = datetimeExpandPattern( pattern, locale );

			value = datetimeFormat( value, pattern, locale );

		} else if ( typeof value === "number" ) {
			// TODO value = numberFormat( value, pattern, locale );
			throw new Error( "Number Format not implemented yet" );
		}

		return value;
	};

	/**
	 * Globalize.parseDate( value, patterns, locale )
	 *
	 * @value [Date]
	 *
	 * @patterns [Array] Optional. See datetime/expand_pattern for more info about each pattern. Defaults to the list of all presets defined in the locale (see datetime/all_presets for more info).
	 *
	 * @locale [String]
	 *
	 * Return a Date instance or null.
	 */
	Globalize.parseDate = function( value, patterns, locale ) {
		var date;
		locale = getLocale( locale );

		if ( typeof value !== "string" ) {
			throw new Error( "invalid value (" + value + "), string expected" );
		}

		if ( !patterns ) {
			patterns = datetimeAllPresets( locale );
		} else {
			patterns = alwaysArray( patterns );
		}

		arraySome( patterns, function( pattern ) {
			pattern = datetimeExpandPattern( pattern, locale );
			date = datetimeParse( value, pattern, locale );
			return !!date;
		});

		return date || null;
	};

	/**
	 * Globalize.translate( path, locale )
	 *
	 * @path [String or Array]
	 *
	 * @locale [String]
	 *
	 * Translate item given its path.
	 */
	Globalize.translate = function( path , locale ) {
		locale = getLocale( locale );
		path = alwaysArray( path );
		return locale.get( [ "globalize-translation/{languageId}" ].concat( path ) );
	};

	return Globalize;



}));
