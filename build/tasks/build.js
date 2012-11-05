module.exports = function( grunt ) {

"use strict";

var path = require( "path" ),
	fs = require( "fs" );

grunt.registerTask( "manifest", "Generate jquery.json manifest files", function() {
	var pkg = grunt.config( "pkg" ),
		base = {
			core: {
				name: "ui.{plugin}",
				title: "jQuery UI {Plugin}"
			},
			widget: {
				name: "ui.{plugin}",
				title: "jQuery UI {Plugin}",
				dependencies: [ "core", "widget" ]
			},
			interaction: {
				name: "ui.{plugin}",
				title: "jQuery UI {Plugin}",
				dependencies: [ "core", "widget", "mouse" ]
			},
			effect: {
				name: "ui.effect-{plugin}",
				title: "jQuery UI {Plugin} Effect",
				keywords: [ "effect", "show", "hide" ],
				homepage: "http://jqueryui.com/{plugin}-effect/",
				demo: "http://jqueryui.com/{plugin}-effect/",
				docs: "http://api.jqueryui.com/{plugin}-effect/",
				dependencies: [ "effect" ]
			}
		};

	Object.keys( base ).forEach(function( type ) {
		var baseManifest = base[ type ],
			plugins = grunt.file.readJSON( "build/" + type + ".json" );

		Object.keys( plugins ).forEach(function( plugin ) {
			var manifest,
				data = plugins[ plugin ],
				name = plugin.charAt( 0 ).toUpperCase() + plugin.substr( 1 );

			function replace( str ) {
				return str.replace( "{plugin}", plugin ).replace( "{Plugin}", name );
			}

			manifest = {
				name: data.name || replace( baseManifest.name ),
				title: data.title || replace( baseManifest.title ),
				description: data.description,
				keywords: [ "ui", plugin ]
					.concat( baseManifest.keywords || [] )
					.concat( data.keywords || [] ),
				version: pkg.version,
				author: pkg.author,
				maintainers: pkg.maintainers,
				licenses: pkg.licenses,
				bugs: pkg.bugs,
				homepage: data.homepage || replace( baseManifest.homepage ||
					"http://jqueryui.com/{plugin}/" ),
				demo: data.demo || replace( baseManifest.demo ||
					"http://jqueryui.com/{plugin}/" ),
				docs: data.docs || replace( baseManifest.docs ||
					"http://api.jqueryui.com/{plugin}/" ),
				download: "http://jqueryui.com/download/",
				dependencies: {
					jquery: ">=1.6"
				},
				// custom
				category: data.category || type
			};

			(baseManifest.dependencies || [])
				.concat(data.dependencies || [])
				.forEach(function( dependency ) {
					manifest.dependencies[ "ui." + dependency ] = pkg.version;
				});

			grunt.file.write( manifest.name + ".jquery.json",
				JSON.stringify( manifest, null, "\t" ) + "\n" );
		});
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
	var files = grunt.file.expandFiles( this.file.src ),
		target = this.file.dest + "/",
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


grunt.registerMultiTask( "zip", "Create a zip file for release", function() {
	// TODO switch back to adm-zip for better cross-platform compability once it actually works
	// 0.1.3 works, but result can't be unzipped
	// its also a lot slower then zip program, probably due to how its used...
	// var files = grunt.file.expandFiles( "dist/" + this.file.src + "/**/*" );
	// grunt.log.writeln( "Creating zip file " + this.file.dest );

	//var AdmZip = require( "adm-zip" );
	//var zip = new AdmZip();
	//files.forEach(function( file ) {
	//	grunt.verbose.writeln( "Zipping " + file );
	//	// rewrite file names from dist folder (created by build), drop the /dist part
	//	zip.addFile(file.replace(/^dist/, "" ), fs.readFileSync( file ) );
	//});
	//zip.writeZip( "dist/" + this.file.dest );
	//grunt.log.writeln( "Wrote " + files.length + " files to " + this.file.dest );

	var done = this.async(),
		dest = this.file.dest,
		src = grunt.template.process( this.file.src, grunt.config() );
	grunt.utils.spawn({
		cmd: "zip",
		args: [ "-r", dest, src ],
		opts: {
			cwd: 'dist'
		}
	}, function( err ) {
		if ( err ) {
			grunt.log.error( err );
			done();
			return;
		}
		grunt.log.writeln( "Zipped " + dest );
		done();
	});
});

grunt.registerMultiTask( "md5", "Create list of md5 hashes for CDN uploads", function() {
	// remove dest file before creating it, to make sure itself is not included
	if ( path.existsSync( this.file.dest ) ) {
		fs.unlinkSync( this.file.dest );
	}
	var crypto = require( "crypto" ),
		dir = this.file.src + "/",
		hashes = [];
	grunt.file.expandFiles( dir + "**/*" ).forEach(function( fileName ) {
		var hash = crypto.createHash( "md5" );
		hash.update( grunt.file.read( fileName, "ascii" ) );
		hashes.push( fileName.replace( dir, "" ) + " " + hash.digest( "hex" ) );
	});
	grunt.file.write( this.file.dest, hashes.join( "\n" ) + "\n" );
	grunt.log.writeln( "Wrote " + this.file.dest + " with " + hashes.length + " hashes" );
});

grunt.registerTask( "generate_themes", function() {
	var download, files, done,
		target = "dist/" + grunt.template.process( grunt.config( "files.themes" ), grunt.config() ) + "/",
		distFolder = "dist/" + grunt.template.process( grunt.config( "files.dist" ), grunt.config() );
	try {
		require.resolve( "download.jqueryui.com" );
	} catch( error ) {
		throw new Error( "You need to manually install download.jqueryui.com for this task to work" );
	}

	// copy release files into download builder to avoid cloning again
	grunt.file.expandFiles( distFolder + "/**" ).forEach(function( file ) {
		grunt.file.copy( file, "node_modules/download.jqueryui.com/release/" + file.replace(/^dist/, "") );
	});

	download = new ( require( "download.jqueryui.com" ) )();

	files = grunt.file.expandFiles( distFolder + "/themes/base/**/*" );
	files.forEach(function( fileName ) {
		grunt.file.copy( fileName, target + fileName.replace( distFolder, "" ) );
	});

	done = this.async();
	grunt.utils.async.forEach( download.themeroller.gallery(), function( theme, done ) {
		var folderName = theme.folderName(),
			concatTarget = "css-" + folderName,
			cssContent = theme.css(),
			cssFolderName = target + "themes/" + folderName + "/",
			cssFileName = cssFolderName + "jquery.ui.theme.css",
			cssFiles = grunt.config.get( "concat.css.src" )[ 1 ].slice();

		grunt.file.write( cssFileName, cssContent );

		// get css components, replace the last file with the current theme
		cssFiles.splice(-1);
		cssFiles.push( "<strip_all_banners:" + cssFileName + ">" );
		grunt.config.get( "concat" )[ concatTarget ] = {
			src: [ "<banner:meta.bannerCSS>", cssFiles ],
			dest: cssFolderName + "jquery-ui.css"
		};
		grunt.task.run( "concat:" + concatTarget );

		theme.fetchImages(function( err, files ) {
			if ( err ) {
				done( err );
				return;
			}
			files.forEach(function( file ) {
				grunt.file.write( cssFolderName + "images/" + file.path, file.data );
			});
			done();
		});
	}, function( err ) {
		if ( err ) {
			grunt.log.error( err );
		}
		done( !err );
	});
});

grunt.registerTask( "clean", function() {
	require( "rimraf" ).sync( "dist" );
});

};
