define([
	"jquery"
], function( $ ) {

var exports = {};

function testWidgetDefaults( widget, defaults ) {
	var pluginDefaults = $.ui[ widget ].prototype.options;

	// Ensure that all defaults have the correct value
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

	// Ensure that all defaults were tested
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

		// Ensure manipulating removed elements works (#3664)
		$( defaultElement ).appendTo( "body" ).remove()[ widget ]().remove();
		ok( true, "initialized on disconnected DOMElement - removed" );
	});
}

exports.testWidget = function( widget, settings ) {
	module( widget + ": common widget" );

	exports.testJshint( "/widgets/" + widget );
	testWidgetDefaults( widget, settings.defaults );
	testWidgetOverrides( widget );
	testBasicUsage( widget );
	test( "version", function() {
		expect( 1 );
		ok( "version" in $.ui[ widget ].prototype, "version property exists" );
	});
};

exports.testJshint = function( module ) {

	// Function.prototype.bind check is needed because JSHint doesn't work in ES3 browsers anymore
	// https://github.com/jshint/jshint/issues/1384
	if ( QUnit.urlParams.nojshint || !Function.prototype.bind ) {
		return;
	}

	asyncTest( "JSHint", function() {
		require( [ "jshint" ], function() {
			expect( 1 );

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
					ok( passed, errors );
					start();
				} )
				.fail(function( hintError, srcError ) {
					ok( false, "error loading source: " + ( hintError || srcError ).statusText );
					start();
				} );
		});
	});
};

return exports;

});
