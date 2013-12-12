define([
	"jquery",
	"ui/core"
], function( $ ) {

var exports = {};

function testWidgetDefaults( widget, defaults ) {
	var pluginDefaults = $.ui[ widget ].prototype.options;

	// ensure that all defaults have the correct value
	test( "defined defaults", function() {
		var count = 0;
		$.each( defaults, function( key, val ) {
			expect( ++count );
			if ( $.isFunction( val ) ) {
				ok( $.isFunction( pluginDefaults[ key ] ), key );
				return;
			}
			deepEqual( pluginDefaults[ key ], val, key );
		});
	});

	// ensure that all defaults were tested
	test( "tested defaults", function() {
		var count = 0;
		$.each( pluginDefaults, function( key ) {
			expect( ++count );
			ok( key in defaults, key );
		});
	});
}

function testWidgetOverrides( widget ) {
	if ( $.uiBackCompat === false ) {
		test( "$.widget overrides", function() {
			expect( 4 );
			$.each([
				"_createWidget",
				"destroy",
				"option",
				"_trigger"
			], function( i, method ) {
				strictEqual( $.ui[ widget ].prototype[ method ],
					$.Widget.prototype[ method ], "should not override " + method );
			});
		});
	}
}

function testBasicUsage( widget ) {
	test( "basic usage", function() {
		expect( 3 );

		var defaultElement = $.ui[ widget ].prototype.defaultElement;
		$( defaultElement ).appendTo( "body" )[ widget ]().remove();
		ok( true, "initialized on element" );

		$( defaultElement )[ widget ]().remove();
		ok( true, "initialized on disconnected DOMElement - never connected" );

		$( defaultElement ).appendTo( "body" ).remove()[ widget ]().remove();
		ok( true, "initialized on disconnected DOMElement - removed" );
	});
}

// Asset revisioning through time and random hashing
function revStamp( value ) {
	return value + (/\?/.test(value) ? "&" : "?") + new Date().getTime() + "" + parseInt(Math.random() * 100000, 10);
}

/**
 * Exports
 */

exports.commonWidgetTests = function( widget, settings ) {
	module( widget + ": common widget" );

	exports.testJshint( widget );
	testWidgetDefaults( widget, settings.defaults );
	testWidgetOverrides( widget );
	testBasicUsage( widget );
	test( "version", function() {
		expect( 1 );
		ok( "version" in $.ui[ widget ].prototype, "version property exists" );
	});
};

/**
 * Experimental assertion for comparing DOM objects.
 *
 * Serializes an element and some properties and attributes and it's children if any, otherwise the text.
 * Then compares the result using deepEqual.
 */
exports.domEqual = function( selector, modifier, message ) {
	var expected, actual,
		properties = [
			"disabled",
			"readOnly"
		],
		attributes = [
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
		var key, len,
			style = elem.ownerDocument.defaultView ?
				elem.ownerDocument.defaultView.getComputedStyle( elem, null ) :
				elem.currentStyle,
			styles = {};

		if ( style && style.length && style[ 0 ] && style[ style[ 0 ] ] ) {
			len = style.length;
			while ( len-- ) {
				key = style[ len ];
				if ( typeof style[ key ] === "string" ) {
					styles[ $.camelCase( key ) ] = style[ key ];
				}
			}
		// support: Opera, IE <9
		} else {
			for ( key in style ) {
				if ( typeof style[ key ] === "string" ) {
					styles[ key ] = style[ key ];
				}
			}
		}

		return styles;
	}

	function extract( elem ) {
		if ( !elem || !elem.length ) {
			QUnit.push( false, actual, expected,
				"domEqual failed, can't extract " + selector + ", message was: " + message );
			return;
		}

		var children,
			result = {};
		$.each( properties, function( index, attr ) {
			var value = elem.prop( attr );
			result[ attr ] = value !== undefined ? value : "";
		});
		$.each( attributes, function( index, attr ) {
			var value = elem.attr( attr );
			result[ attr ] = value !== undefined ? value : "";
		});
		result.style = getElementStyles( elem[ 0 ] );
		result.events = $._data( elem[ 0 ], "events" );
		result.data = $.extend( {}, elem.data() );
		delete result.data[ $.expando ];
		children = elem.children();
		if ( children.length ) {
			result.children = elem.children().map(function() {
				return extract( $( this ) );
			}).get();
		} else {
			result.text = elem.text();
		}
		return result;
	}

	function done() {
		actual = extract( $( selector ) );
		QUnit.push( QUnit.equiv(actual, expected), actual, expected, message );
	}

	// Get current state prior to modifier
	expected = extract( $( selector ) );

	// Run modifier (async or sync), then compare state via done()
	if ( modifier.length ) {
		modifier( done );
	} else {
		modifier();
		done();
	}
};

exports.testJshint = function( module ) {
	// Function.prototype.bind check is needed because JSHint doesn't work in ES3 browsers anymore
	// https://github.com/jshint/jshint/issues/1384
	if ( QUnit.urlParams.nojshint || !Function.prototype.bind ) {
		return;
	}

	require([ "jshint" ], function() {
		asyncTest( "JSHint", function() {
			expect( 1 );

			$.when(
				$.ajax({
					url: revStamp( "../../../ui/.jshintrc" ),
					dataType: "json"
				}),
				$.ajax({
					url: revStamp( "../../../ui/" + module + ".js" ),
					dataType: "text"
				})
			).done(function( hintArgs, srcArgs ) {
				var globals, passed, errors,
					jshintrc = hintArgs[ 0 ],
					source = srcArgs[ 0 ];

				globals = jshintrc.globals || {};
				delete jshintrc.globals;
				passed = JSHINT( source, jshintrc, globals );
				errors = $.map( JSHINT.errors, function( error ) {
					// JSHINT may report null if there are too many errors
					if ( !error ) {
						return;
					}

					return "[L" + error.line + ":C" + error.character + "] " +
						error.reason + "\n" + error.evidence + "\n";
				}).join( "\n" );
				ok( passed, errors );
				start();
			})
			.fail(function( hintError, srcError ) {
				ok( false, "error loading source: " + ( hintError || srcError ).statusText );
				start();
			});
		});
	});
};

return exports;

});
