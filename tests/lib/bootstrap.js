( function() {

requirejs.config( {
	paths: {
		"globalize": "../../../external/globalize/globalize",
		"globalize/ja-JP": "../../../external/globalize/globalize.culture.ja-JP",
		"jquery": jqueryUrl(),
		"jquery-simulate": "../../../external/jquery-simulate/jquery.simulate",
		"jshint": "../../../external/jshint/jshint",
		"lib": "../../lib",
		"phantom-bridge": "../../../node_modules/grunt-contrib-qunit/phantomjs/bridge",
		"qunit-assert-classes": "../../../external/qunit-assert-classes/qunit-assert-classes",
		"qunit-assert-close": "../../../external/qunit-assert-close/qunit-assert-close",
		"qunit": "../../../external/qunit/qunit",
		"testswarm": "http://swarm.jquery.org/js/inject.js?" + ( new Date() ).getTime(),
		"ui": "../../../ui"
	},
	shim: {
		"globalize/ja-JP": [ "globalize" ],
		"jquery-simulate": [ "jquery" ],
		"qunit-assert-close": [ "qunit" ],
		"testswarm": [ "qunit" ]
	}
} );

// Create a module that disables back compat for UI modules
define( "jquery-no-back-compat", [ "jquery" ], function( $ ) {
	$.uiBackCompat = false;

	return $;
} );

// Create a dummy bridge if we're not actually testing in PhantomJS
if ( !/PhantomJS/.test( navigator.userAgent ) ) {
	define( "phantom-bridge", function() {} );
}

// Load all modules in series
function requireModules( dependencies, callback, modules ) {
	if ( !dependencies.length ) {
		if ( callback ) {
			callback.apply( null, modules );
		}
		return;
	}

	if ( !modules ) {
		modules = [];
	}

	var dependency = dependencies.shift();
	require( [ dependency ], function( module ) {
		modules.push( module );
		requireModules( dependencies, callback, modules );
	} );
}

// Load a set of test file along with the required test infrastructure
function requireTests( dependencies, noBackCompat ) {
	dependencies = [
		"lib/qunit",
		noBackCompat ? "jquery-no-back-compat" : "jquery",
		"jquery-simulate"
	].concat( dependencies );

	// Load the TestSwarm injector, if necessary
	if ( parseUrl().swarmURL ) {
		dependencies.push( "testswarm" );
	}

	requireModules( dependencies, function( QUnit ) {
		QUnit.start();
	} );
}

// Parse the URL into key/value pairs
function parseUrl() {
	var data = {};
	var parts = document.location.search.slice( 1 ).split( "&" );
	var length = parts.length;
	var i = 0;
	var current;

	for ( ; i < length; i++ ) {
		current = parts[ i ].split( "=" );
		data[ current[ 0 ] ] = current[ 1 ];
	}

	return data;
}

function jqueryUrl() {
	var version = parseUrl().jquery;
	var url;

	if ( version === "git" ) {
		url = "http://code.jquery.com/jquery-" + version;
	} else {
		url = "../../../external/jquery-" + ( version || "1.12.4" ) + "/jquery";
	}

	return url;
}

// Load test modules based on data attributes
// - data-modules: list of test modules to load
// - data-widget: A widget to load test modules for
//   - Automatically loads common, core, events, methods, and options
// - data-deprecated: Loads the deprecated test modules for a widget
// - data-no-back-compat: Set $.uiBackCompat to false
( function() {

	// Find the script element
	var scripts = document.getElementsByTagName( "script" );
	var script = scripts[ scripts.length - 1 ];

	// Read the modules
	var modules = script.getAttribute( "data-modules" );
	if ( modules ) {
		modules = modules
			.replace( /^\s+|\s+$/g, "" )
			.split( /\s+/ );
	} else {
		modules = [];
	}
	var widget = script.getAttribute( "data-widget" );
	var deprecated = !!script.getAttribute( "data-deprecated" );
	var noBackCompat = !!script.getAttribute( "data-no-back-compat" );

	if ( widget ) {
		modules = modules.concat( [
			( deprecated ? "common-deprecated" : "common" ),
			"core",
			"events",
			"methods",
			"options"
		] );
		if ( deprecated ) {
			modules = modules.concat( "deprecated" );
		}
	}

	// Load the jQuery 1.7 fixes, if necessary
	if ( parseFloat( parseUrl().jquery ) === 1.7 ) {
		modules.push( "ui/jquery-1-7" );
	}

	requireTests( modules, noBackCompat );
} )();

} )();
