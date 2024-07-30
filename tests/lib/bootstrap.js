( function() {
"use strict";

var DEFAULT_JQUERY_VERSION = "3.7.1";

requirejs.config( {
	paths: {
		"globalize": "../../../external/globalize/globalize",
		"globalize/ja-JP": "../../../external/globalize/globalize.culture.ja-JP",
		"jquery": jqueryUrl(),
		"jquery-migrate": migrateUrl(),
		"jquery-simulate": "../../../external/jquery-simulate/jquery.simulate",
		"lib": "../../lib",
		"qunit-assert-classes": "../../lib/vendor/qunit-assert-classes/qunit-assert-classes",
		"qunit-assert-close": "../../lib/vendor/qunit-assert-close/qunit-assert-close",
		"qunit": "../../../external/qunit/qunit",
		"ui": "../../../ui"
	},
	shim: {
		"globalize/ja-JP": [ "globalize" ],
		"jquery-simulate": [ "jquery" ],
		"qunit-assert-close": [ "qunit" ]
	}
} );

// Create a module that enables back compat for UI modules
define( "jquery-back-compat", [ "jquery" ], function( $ ) {
	$.uiBackCompat = true;

	return $;
} );

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
function requireTests( dependencies, options ) {

	var backCompat = !!( options && options.backCompat ),
		preDependencies = [
		"lib/qunit",
		backCompat ? "jquery-back-compat" : "jquery",
		"jquery-simulate"
	];

	// Load migrate before test files
	if ( parseUrl().migrate ) {
		preDependencies.push( "jquery-migrate" );
	}

	dependencies = preDependencies.concat( dependencies );

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
		if ( parts[ i ].match( "=" ) ) {
			current = parts[ i ].split( "=" );
			data[ current[ 0 ] ] = current[ 1 ];
		} else {
			data[ parts[ i ] ] = true;
		}
	}

	return data;
}

function jqueryUrl() {
	var version = parseUrl().jquery || DEFAULT_JQUERY_VERSION;
	var url;

	if ( version === "git" || version === "3.x-git" ) {
		url = "https://releases.jquery.com/git/jquery-" + version;
	} else {
		url = "../../../external/jquery-" + version + "/jquery";
	}

	return url;
}

function migrateUrl() {
	var jqueryVersion = parseUrl().jquery || DEFAULT_JQUERY_VERSION;
	var url;

	if ( jqueryVersion === "git" ) {
		url = "https://releases.jquery.com/git/jquery-migrate-git";
	} else if ( jqueryVersion[ 0 ] === "3" ) {
		url = "../../../external/jquery-migrate-3.x/jquery-migrate";
	} else if ( jqueryVersion[ 0 ] === "1" || jqueryVersion[ 0 ] === "2" ) {
		url = "../../../external/jquery-migrate-1.x/jquery-migrate";
	} else if ( jqueryVersion === "custom" ) {
		if ( parseUrl().migrate ) {
			throw new Error( "Migrate not currently supported for custom build" );
		}
	} else {
		throw new Error( "No migrate version known for jQuery " + jqueryVersion );
	}

	return url;
}

// Load test modules based on data attributes
// - data-modules: list of test modules to load
// - data-widget: A widget to load test modules for
//   - Automatically loads common, core, events, methods, and options
// - data-deprecated: Loads the deprecated test modules for a widget
// - data-back-compat: Set $.uiBackCompat to `true`
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
	var backCompat = !!script.getAttribute( "data-back-compat" );

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

	requireTests( modules, { backCompat: backCompat } );
} )();

} )();
