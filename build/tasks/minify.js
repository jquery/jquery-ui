"use strict";

const swc = require( "@swc/core" );

module.exports = function( grunt ) {

grunt.registerMultiTask( "minify", async function() {
	const done = this.async();
	const options = this.options();

	for ( const file of this.files ) {
		if ( file.src.length === 0 ) {
			grunt.log.writeln(
				`No source file found, skipping minification to "${ file.dest }".` );
			continue;
		}
		if ( file.src.length !== 1 ) {
			grunt.fail.warn( "Minifying multiple source files into one " +
				"destination file not supported" );
		}

		const contents = grunt.file.read( file.src[ 0 ] );

		const { code } = await swc.minify(
			contents,
			{
				compress: {
					ecma: 5,
					hoist_funs: false,
					loops: false
				},
				format: {
					ecma: 5,
					asciiOnly: true,
					comments: false,
					preamble: options.banner
				},
				inlineSourcesContent: false,
				mangle: true,
				module: false,
				sourceMap: false
			}
		);

		grunt.file.write( file.dest, code );

		grunt.log.writeln( `File ${ file.dest } created.` );
	}

	done();
} );

};
