module.exports = function( grunt ) {

"use strict";

var fs = require( "fs" );

function expandFiles( files ) {
	return grunt.util._.pluck( grunt.file.expandMapping( files ), "src" ).filter(function(filepath) {
		// restrict to files, exclude folders
		try {
			return fs.statSync( filepath[ 0 ] ).isFile();
		} catch(e) {
			throw grunt.task.taskError(e.message, e);
		}
	}).map(function( values ) {
		return values[ 0 ];
	});
}

grunt.registerTask( "manifest", "Generate jquery.json manifest files", function() {
	require( "../manifest" )().forEach(function( manifest ) {
		grunt.file.write( manifest.name + ".jquery.json", JSON.stringify( manifest, null, "\t" ) + "\n" );
	});
});

grunt.registerMultiTask( "copy", "Copy files to destination folder and replace @VERSION with pkg.version", function() {
	function replaceVersion( source ) {
		return source.replace( /@VERSION/g, grunt.config( "pkg.version" ) );
	}
	function copyFile( src, dest ) {
		if ( /(js|css)$/.test( src ) ) {
			grunt.file.copy( src, dest, {
				process: replaceVersion
			});
		} else {
			grunt.file.copy( src, dest );
		}
	}
	var files = expandFiles( this.filesSrc ),
		target = this.data.dest + "/",
		strip = this.data.strip,
		renameCount = 0,
		fileName;
	if ( typeof strip === "string" ) {
		strip = new RegExp( "^" + grunt.template.process( strip, grunt.config() ).replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ) );
	}
	files.forEach(function( fileName ) {
		var targetFile = strip ? fileName.replace( strip, "" ) : fileName;
		copyFile( fileName, target + targetFile );
	});
	grunt.log.writeln( "Copied " + files.length + " files." );
	for ( fileName in this.data.renames ) {
		renameCount += 1;
		copyFile( fileName, target + grunt.template.process( this.data.renames[ fileName ], grunt.config() ) );
	}
	if ( renameCount ) {
		grunt.log.writeln( "Renamed " + renameCount + " files." );
	}
});

grunt.registerTask( "clean", function() {
	require( "rimraf" ).sync( "dist" );
});

};
