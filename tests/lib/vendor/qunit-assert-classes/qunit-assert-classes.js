//  With custom modifications - all are marked with
//  a "Custom modification" comment.
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"qunit"
		], factory );
	} else {

		// Browser globals
		factory( QUnit );
	}
}( function( QUnit ) {

	function inArray( haystack, needle ) {
		for ( var i = 0; i < haystack.length; i++ ) {
			if (
					( needle instanceof RegExp && needle.test( haystack[ i ] ) )||
					( typeof needle === "string" && haystack[ i ] === needle )
			) {
				return true;
			}
		}
		return false;
	}

	function check( element, search ) {
		var i, classAttribute, elementClassArray,
			missing = [],
			found = [];

		if ( element.jquery && element.length !== 1 ) {
			throw new Error( "Class checks can only be performed on a single element on a collection" );
		}

		element = element.jquery ? element[ 0 ] : element;
		classAttribute = element.getAttribute( "class" );

		if ( classAttribute ) {
			elementClassArray = splitClasses( classAttribute );
			if ( search instanceof RegExp ) {
				if ( inArray( elementClassArray, search ) ) {
					found.push( search );
				} else {
					missing.push( search );
				}
			} else {
				for( i = 0; i < search.length; i++ ) {
					if ( !inArray( elementClassArray, search[ i ] ) ) {
						missing.push( search[ i ] );
					} else {
						found.push( search[ i ] );
					}
				}
			}
		} else {
			missing = search;
		}

		return {
			missing: missing,
			found: found,
			element: element,
			classAttribute: classAttribute
		};
	}

	function splitClasses( classes ) {
		return classes.match( /\S+/g ) || [];
	}

	function pluralize( message, classes ) {
		return message + ( classes.length > 1 ? "es" : "" );
	}

	// Custom modification: removing QUnit.extend
	var key;
	var qunitAssertExtensions = {
		hasClasses: function( element, classes, message ) {
			var classArray = splitClasses( classes ),
				results = check( element, classArray );

			message = message || pluralize( "Element must have class", classArray );

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: !results.missing.length,
				actual: results.found.join( " " ),
				expected: classes,
				message: message
			} );
		},
		lacksClasses: function( element, classes, message ) {
			var classArray = splitClasses( classes ),
				results = check( element, classArray );

			message = message || pluralize( "Element must not have class", classArray );

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: !results.found.length,
				actual: results.found.join( " " ),
				expected: classes,
				message: message
			} );
		},
		hasClassesStrict: function( element, classes, message ) {
			var result,
				classArray = splitClasses( classes ),
				results = check( element, classArray );

			message = message || pluralize( "Element must only have class", classArray );

			result =  !results.missing.length && results.element.getAttribute( "class" ) &&
				splitClasses( results.element.getAttribute( "class" ) ).length ===
				results.found.length;

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: result,
				actual: results.found.join( " " ),
				expected: classes,
				message: message
			} );
		},
		hasClassRegex: function( element, regex, message ) {
			var results = check( element, regex );

			message = message || "Element must have class matching " + regex;

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: !!results.found.length,
				actual: results.found.join( " " ),
				expected: regex,
				message: message
			} );
		},
		lacksClassRegex: function( element, regex, message ) {
			var results = check( element, regex );

			message = message || "Element must not have class matching " + regex;

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: results.missing.length,
				actual: results.missing.join( " " ),
				expected: regex,
				message: message
			} );
		},
		hasClassStart: function( element, partialClass, message ) {
			var results = check( element, new RegExp( "^" + partialClass ) );

			message = message || "Element must have class starting with " + partialClass;

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: results.found.length,
				actual: results.found.join( " " ),
				expected: partialClass,
				message: message
			} );
		},
		lacksClassStart: function( element, partialClass, message ) {
			var results = check( element, new RegExp( "^" + partialClass ) );

			message = message || "Element must not have class starting with " + partialClass;

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: results.missing.length,
				actual: results.missing.join( " " ),
				expected: partialClass,
				message: message
			} );
		},
		hasClassPartial: function( element, partialClass, message ) {
			var results = check( element, new RegExp( partialClass ) );

			message = message || "Element must have class containing '" + partialClass + "'";

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: results.found.length,
				actual: results.found.join( " " ),
				expected: partialClass,
				message: message
			} );
		},
		lacksClassPartial: function( element, partialClass, message ) {
			var results = check( element, new RegExp( partialClass ) );

			message = message || "Element must not have class containing '" + partialClass + "'";

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: results.missing.length,
				actual: results.missing.join( " " ),
				expected: partialClass,
				message: message
			} );
		},
		lacksAllClasses: function( element, message ) {
			element = element.jquery ? element[ 0 ] : element;

			var classAttribute = element.getAttribute( "class" ) || "",
				classes = splitClasses( classAttribute );

			message = message || "Element must not have any classes";

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: !classes.length,
				actual: !classes.length,
				expected: true,
				message: message
			} );
		},
		hasSomeClass: function( element, message ) {
			element = element.jquery ? element[ 0 ] : element;

			var classAttribute = element.getAttribute( "class" ) || "",
				classes = splitClasses( classAttribute );

			message = message || "Element must have a class";

			// Custom modification: push -> pushResult
			this.pushResult( {
				result: classes.length,
				actual: classes.length,
				expected: true,
				message: message
			} );
		}
	};

	// Custom modification: removing QUnit.extend
	for ( key in qunitAssertExtensions ) {
		QUnit.assert[ key ] = qunitAssertExtensions[ key ];
	}

} ) );
