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
				styles[ $.camelCase( key ) ] = style[ key ];
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
