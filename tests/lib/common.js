define( [
	"qunit",
	"jquery",
	"lib/helper"
], function( QUnit, $, helper ) {

var exports = {};

function testWidgetDefaults( widget, defaults ) {
	var pluginDefaults = $.ui[ widget ].prototype.options;

	// Ensure that all defaults have the correct value
	QUnit.test( "defined defaults", function( assert ) {
		var count = 0;
		$.each( defaults, function( key, val ) {
			assert.expect( ++count );
			if ( typeof val === "function" ) {
				assert.ok( typeof pluginDefaults[ key ] === "function", key );
				return;
			}
			assert.deepEqual( pluginDefaults[ key ], val, key );
		} );
	} );

	// Ensure that all defaults were tested
	QUnit.test( "tested defaults", function( assert ) {
		var count = 0;
		$.each( pluginDefaults, function( key ) {
			assert.expect( ++count );
			assert.ok( key in defaults, key );
		} );
	} );
}

function testWidgetOverrides( widget ) {
	if ( $.uiBackCompat === false ) {
		QUnit.test( "$.widget overrides", function( assert ) {
			assert.expect( 4 );
			$.each( [
				"_createWidget",
				"destroy",
				"option",
				"_trigger"
			], function( i, method ) {
				assert.strictEqual( $.ui[ widget ].prototype[ method ],
					$.Widget.prototype[ method ], "should not override " + method );
			} );
		} );
	}
}

function testBasicUsage( widget ) {
	QUnit.test( "basic usage", function( assert ) {
		assert.expect( 3 );

		var defaultElement = $.ui[ widget ].prototype.defaultElement;
		$( defaultElement ).appendTo( "body" )[ widget ]().remove();
		assert.ok( true, "initialized on element" );

		$( defaultElement )[ widget ]().remove();
		assert.ok( true, "initialized on disconnected DOMElement - never connected" );

		// Ensure manipulating removed elements works (#3664)
		$( defaultElement ).appendTo( "body" ).remove()[ widget ]().remove();
		assert.ok( true, "initialized on disconnected DOMElement - removed" );
	} );
}

exports.testWidget = function( widget, settings ) {
	QUnit.module( widget + ": common widget", { afterEach: helper.moduleAfterEach } );

	exports.testJshint( "/widgets/" + widget );
	testWidgetDefaults( widget, settings.defaults );
	testWidgetOverrides( widget );
	if ( !settings.noDefaultElement ) {
		testBasicUsage( widget );
	}
	QUnit.test( "version", function( assert ) {
		assert.expect( 1 );
		assert.ok( "version" in $.ui[ widget ].prototype, "version property exists" );
	} );
};

exports.testJshint = function( module ) {

	// Function.prototype.bind check is needed because JSHint doesn't work in ES3 browsers anymore
	// https://github.com/jshint/jshint/issues/1384
	if ( QUnit.urlParams.nojshint || !Function.prototype.bind ) {
		return;
	}

	QUnit.test( "JSHint", function( assert ) {
		var ready = assert.async();
		require( [ "jshint" ], function() {
			assert.expect( 1 );

			$.when(
				$.ajax( {
					url: "../../../ui/.jshintrc",
					dataType: "json"
				} ),
				$.ajax( {
					url: "../../../ui/" + module + ".js",
					dataType: "text"
				} )
			)
				.done( function( hintArgs, srcArgs ) {
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
					} ).join( "\n" );
					assert.ok( passed, errors );
					ready();
				} )
				.fail( function( hintError, srcError ) {
					assert.ok( false, "error loading source: " + ( hintError || srcError ).statusText );
					ready();
				} );
		} );
	} );
};

return exports;

} );
