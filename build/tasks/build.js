module.exports = function( grunt ) {

"use strict";

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
				homepage: "http://jqueryui.com/effect/",
				demo: "http://jqueryui.com/effect/",
				docs: "http://api.jqueryui.com/{plugin}-effect/",
				dependencies: [ "effect" ]
			}
		};

	Object.keys( base ).forEach(function( type ) {
		var baseManifest = base[ type ],
			plugins = grunt.file.readJSON( "build/" + type + ".json" ),
			bower = grunt.file.readJSON( "bower.json" );

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
				dependencies: bower.dependencies,
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

grunt.registerTask( "clean", function() {
	require( "rimraf" ).sync( "dist" );
});

grunt.registerTask( "asciilint", function() {
	var valid = true,
		files = grunt.file.expand({ filter: "isFile" }, "ui/*.js" );
	files.forEach(function( filename ) {
		var i, c,
			text = grunt.file.read( filename );

		// Ensure files use only \n for line endings, not \r\n
		if ( /\x0d\x0a/.test( text ) ) {
			grunt.log.error( filename + ": Incorrect line endings (\\r\\n)" );
			valid = false;
		}

		// Ensure only ASCII chars so script tags don't need a charset attribute
		if ( text.length !== Buffer.byteLength( text, "utf8" ) ) {
			grunt.log.error( filename + ": Non-ASCII characters detected:" );
			for ( i = 0; i < text.length; i++ ) {
				c = text.charCodeAt( i );
				if ( c > 127 ) {
					grunt.log.error( "- position " + i + ": " + c );
					grunt.log.error( "-- " + text.substring( i - 20, i + 20 ) );
					break;
				}
			}
			valid = false;
		}
	});
	if ( valid ) {
		grunt.log.ok( files.length + " files lint free." );
	}
	return valid;
});

};
