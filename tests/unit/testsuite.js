(function( $ ) {

var reset, jshintLoaded;

window.TestHelpers = {};

function includeStyle( url ) {
	document.write( "<link rel='stylesheet' href='../../../" + url + "'>" );
}

function includeScript( url ) {
	document.write( "<script src='../../../" + url + "'></script>" );
}

function url( value ) {
	return value + (/\?/.test(value) ? "&" : "?") + new Date().getTime() + "" + parseInt(Math.random() * 100000, 10);
}

reset = QUnit.reset;
QUnit.reset = function() {
	// Ensure jQuery events and data on the fixture are properly removed
	jQuery("#qunit-fixture").empty();
	// Let QUnit reset the fixture
	reset.apply( this, arguments );
};


QUnit.config.requireExpects = true;

/*
// TODO: Add back the ability to test against minified files
// see QUnit.urlParams.min usage below
QUnit.config.urlConfig.push({
	id: "min",
	label: "Minified source",
	tooltip: "Load minified source files instead of the regular unminified ones."
});
*/

TestHelpers.loadResources = QUnit.urlParams.min ?
	function() {
		includeStyle( "dist/jquery-ui.min.css" );
		includeScript( "dist/jquery-ui.min.js" );
	} :
	function( resources ) {
		$.each( resources.css || [], function( i, resource ) {
			includeStyle( "themes/base/" + resource + ".css" );
		});
		$.each( resources.js || [], function( i, resource ) {
			includeScript( resource );
		});
	};

QUnit.config.urlConfig.push({
	id: "nojshint",
	label: "Skip JSHint",
	tooltip: "Skip running JSHint, e.g. within TestSwarm, where Jenkins runs it already"
});

QUnit.config.urlConfig.push({
	id: "jquery",
	label: "jQuery version",
	value: [
		"1.6", "1.6.1", "1.6.2", "1.6.3", "1.6.4", "1.7", "1.7.1", "1.7.2",
		"1.8.0", "1.8.1", "1.8.2", "1.8.3", "1.9.0", "1.9.1", "1.10.0",
		"1.10.1", "1.10.2", "2.0.0", "2.0.1", "2.0.2", "2.0.3", "git"
	],
	tooltip: "Which jQuery Core version to test against"
});

jshintLoaded = false;
TestHelpers.testJshint = function( module ) {
	// Function.prototype.bind check is needed because JSHint doesn't work in ES3 browsers anymore
	// https://github.com/jshint/jshint/issues/1384
	if ( QUnit.urlParams.nojshint || !Function.prototype.bind ) {
		return;
	}

	if ( !jshintLoaded ) {
		includeScript( "external/jshint.js" );
		jshintLoaded = true;
	}

	asyncTest( "JSHint", function() {
		expect( 1 );

		$.when(
			$.ajax({
				url: url("../../../ui/.jshintrc"),
				dataType: "json"
			}),
			$.ajax({
				url: url("../../../ui/" + module + ".js"),
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
		.fail(function() {
			ok( false, "error loading source" );
			start();
		});
	});
};

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

TestHelpers.commonWidgetTests = function( widget, settings ) {
	module( widget + ": common widget" );

	TestHelpers.testJshint( widget );
	testWidgetDefaults( widget, settings.defaults );
	testWidgetOverrides( widget );
	testBasicUsage( widget );
	test( "version", function() {
		expect( 1 );
		ok( "version" in $.ui[ widget ].prototype, "version property exists" );
	});
};

TestHelpers.onFocus= function( element, onFocus ) {
	var fn = function( event ){
		if( !event.originalEvent ) {
			return;
		}
		element.unbind( "focus", fn );
		onFocus();
	};

	element.bind( "focus", fn )[ 0 ].focus();
};

TestHelpers.forceScrollableWindow = function( appendTo ) {
	return $( "<div>" ).css({
		height: "10000px",
		width: "10000px"
	}).appendTo( appendTo || "#qunit-fixture" );
};

/*
 * Taken from https://github.com/jquery/qunit/tree/master/addons/close-enough
 */
window.closeEnough = function( actual, expected, maxDifference, message ) {
	var passes = (actual === expected) || Math.abs(actual - expected) <= maxDifference;
	QUnit.push(passes, actual, expected, message);
};

/*
 * Experimental assertion for comparing DOM objects.
 *
 * Serializes an element and some properties and attributes and its children if any, otherwise the text.
 * Then compares the result using deepEqual.
 */
window.domEqual = function( selector, modifier, message ) {
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

}( jQuery ));
