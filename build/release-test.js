"use strict";

var shell = require( "shelljs" );
var Release = {
	define: function( props ) {
		for ( var key in props ) {
			Release[ key ] = props[ key ];
		}
	},
	exec: function( _options, errorMessage ) {
		var result,
			command = _options.command || _options,
			options = {};

		if ( _options.silent ) {
			options.silent = true;
		}

		errorMessage = errorMessage || "Error executing command: " + command;

		result = shell.exec( command, options );
		if ( result.code !== 0 ) {
			Release.abort( errorMessage );
		}

		return result.output;
	},
	abort: function() {
		console.error.apply( console, arguments );
		process.exit( 1 );
	},
	newVersion: require( "../package" ).version
};

var script = require( "./release" );
script( Release );

// Ignores actual version installed, should be good enough for a test
if ( shell.exec( "npm ls --depth 0 | grep download.jqueryui.com" ).code === 1 ) {
	shell.exec( "npm install --no-save " + script.dependencies.join( " " ) );
}

// If AUTHORS.txt is outdated, this will update it
// Very annoying during an actual release
shell.exec( "grunt update-authors" );

Release.generateArtifacts( function() {
	console.log( "Done generating artifacts, verify output, should be in dist/cdn" );
} );
