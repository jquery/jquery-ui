/*
 * Experimental assertion for comparing DOM objects.
 *
 * Serializes an element and some properties and attributes and its children if any,
 * otherwise the text. Then compares the result using deepEqual().
 */
define( [
	"qunit",
	"jquery"
], function( QUnit, $ ) {
"use strict";

var domEqual = QUnit.assert.domEqual = function( selector, modifier, message ) {

	var assert = this;

	// Get current state prior to modifier
	var expected = extract( selector, message );

	function done() {
		var actual = extract( selector, message );
		assert.push( QUnit.equiv( actual, expected ), actual, expected, message );
	}

	// Run modifier (async or sync), then compare state via done()
	if ( modifier.length ) {
		modifier( done );
	} else {
		modifier();
		done();
	}
};

domEqual.properties = [
	"disabled",
	"readOnly"
];

domEqual.attributes = [
	"autocomplete",
	"aria-activedescendant",
	"aria-controls",
	"aria-describedby",
	"aria-disabled",
	"aria-expanded",
	"aria-haspopup",
	"aria-hidden",
	"aria-labelledby",
	"aria-pressed",
	"aria-selected",
	"aria-valuemax",
	"aria-valuemin",
	"aria-valuenow",
	"class",
	"href",
	"id",
	"nodeName",
	"role",
	"tabIndex",
	"title"
];

function camelCase( string ) {
	return string.replace( /-([\da-z])/gi, function( all, letter ) {
		return letter.toUpperCase();
	} );
}

function getElementStyles( elem ) {
	var styles = {};
	var style = elem.ownerDocument.defaultView ?
		elem.ownerDocument.defaultView.getComputedStyle( elem, null ) :
		elem.currentStyle;
	var key, len;

	if ( style && style.length && style[ 0 ] && style[ style[ 0 ] ] ) {
		len = style.length;
		while ( len-- ) {
			key = style[ len ];
			if ( typeof style[ key ] === "string" ) {
				styles[ camelCase( key ) ] = style[ key ];
			}
		}

	// Support: Opera, IE <9
	} else {
		for ( key in style ) {
			if ( typeof style[ key ] === "string" ) {
				styles[ key ] = style[ key ];
			}
		}
	}

	return styles;
}

// Returns 0 if v1 == v2, -1 if v1 < v2, 1 if v1 > v2
function compareVersions( v1, v2 ) {
	var i,
		rVersionParts = /^(\d+)\.(\d+)\.(\d+)/,
		v1p = rVersionParts.exec( v1 ) || [ ],
		v2p = rVersionParts.exec( v2 ) || [ ];

	for ( i = 1; i <= 3; i++ ) {
		if ( +v1p[ i ] > +v2p[ i ] ) {
			return 1;
		}
		if ( +v1p[ i ] < +v2p[ i ] ) {
			return -1;
		}
	}
	return 0;
}

function jQueryVersionSince( version ) {
	return compareVersions( $.fn.jquery, version ) >= 0;
}

function extract( selector, message ) {
	var elem = $( selector );
	if ( !elem.length ) {
		QUnit.push( false, null, null,
			"domEqual failed, can't extract " + selector + ", message was: " + message );
		return;
	}

	var result = {};
	var children;
	$.each( domEqual.properties, function( index, attr ) {
		var value = elem.prop( attr );
		result[ attr ] = value != null ? value : "";
	} );
	$.each( domEqual.attributes, function( index, attr ) {
		var value = elem.attr( attr );
		result[ attr ] = value != null ? value : "";
	} );
	result.style = getElementStyles( elem[ 0 ] );
	result.events = $._data( elem[ 0 ], "events" );

	// jQuery >=3.4.0 uses a special focus/blur handler pair
	// needed to fix various issues with checkboxes/radio buttons
	// as well as being able to pass data in focus triggers.
	// However, this leaves dummy focus & blur events if any of these
	// events were ever listened to at a particular element. There's not
	// a lot UI can do to fix this so just skip these handlers for
	// data comparisons in tests.
	// See https://github.com/jquery/jquery/issues/4496
	if ( result.events && jQueryVersionSince( "3.4.0" ) ) {
		$.each( [ "focus", "blur" ], function( index, eventType ) {
			if ( !result.events[ eventType ] ) {
				return;
			}

			// Filter special jQuery focus-related handlers out.
			result.events[ eventType ] = result.events[ eventType ]
				.filter( function( eventData ) {
					var handlerBody = eventData.handler.toString().replace(
						/^[^{]+\{[\s\n]*((?:.|\n)*?)\s*;?\s*\}[^}]*$/,
						"$1"
					);

					// Only these special jQuery internal handlers
					// have the `namespace` field set to `false`;
					// all other events use a string value, possibly
					// an empty string if no namespace was set.
					return eventData.namespace !== false &&

						// If a focus event was triggered without adding a handler first,
						// jQuery attaches an empty handler at the beginning of a trigger
						// call. Ignore this handler as well; it's a function with just
						// `return true;` in the body.
						// Handle the minified version as well.
						handlerBody !== "return true" && handlerBody !== "return!0";
				} );

			// Remove empty eventData collections to follow jQuery behavior.
			if ( !result.events[ eventType ].length ) {
				delete result.events[ eventType ];
			}
		} );

		// Simulate empty events collections removal to follow jQuery behavior.
		if ( !Object.keys( result.events ).length ) {
			result.events = undefined;
		}
	}

	result.data = $.extend( {}, elem.data() );
	delete result.data[ $.expando ];
	children = elem.children();
	if ( children.length ) {
		result.children = elem.children().map( function() {
			return extract( $( this ) );
		} ).get();
	} else {
		result.text = elem.text();
	}
	return result;
}

} );
