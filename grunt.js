/*jshint node: true */
module.exports = function( grunt ) {

var // modules
	fs = require( "fs" ),
	path = require( "path" ),
	request = require( "request" ),

	// files
	coreFiles = [
		"jquery.ui.core.js",
		"jquery.ui.widget.js",
		"jquery.ui.mouse.js",
		"jquery.ui.draggable.js",
		"jquery.ui.droppable.js",
		"jquery.ui.resizable.js",
		"jquery.ui.selectable.js",
		"jquery.ui.sortable.js",
		"jquery.effects.core.js"
	],

	uiFiles = coreFiles.map(function( file ) {
		return "ui/" + file;
	}).concat( grunt.file.expandFiles( "ui/*.js" ).filter(function( file ) {
		return coreFiles.indexOf( file.substring(3) ) === -1;
	})),

	allI18nFiles = grunt.file.expandFiles( "ui/i18n/*.js" ),

	cssFiles = [
		"core",
		"accordion",
		"autocomplete",
		"button",
		"datepicker",
		"dialog",
		"menu",
		"progressbar",
		"resizable",
		"selectable",
		"slider",
		"spinner",
		"tabs",
		"tooltip",
		"theme"
	].map(function( component ) {
		return "themes/base/jquery.ui." + component + ".css";
	}),

	// minified files
	minify = {
		"dist/jquery-ui.min.js": [ "<banner:meta.bannerAll>", "dist/jquery-ui.js" ],
		"dist/i18n/jquery-ui-i18n.min.js": [ "<banner:meta.bannerI18n>", "dist/i18n/jquery-ui-i18n.js" ]
	},

	minifyCSS = {
		"dist/jquery-ui.min.css": "dist/jquery-ui.css"
	},

	compareFiles = {
		all: [
			"dist/jquery-ui.js",
			"dist/jquery-ui.min.js"
		]
	};

function mapMinFile( file ) {
	return "dist/" + file.replace( /\.js$/, ".min.js" ).replace( /ui\//, "minified/" );
}

uiFiles.concat( allI18nFiles ).forEach(function( file ) {
	minify[ mapMinFile( file ) ] = [ "<banner>", file ];
});

cssFiles.forEach(function( file ) {
	minifyCSS[ "dist/" + file.replace( /\.css$/, ".min.css" ).replace( /themes\/base\//, "themes/base/minified/" ) ] = [ "<banner>", "<strip_all_banners:" + file + ">" ];
});

uiFiles.forEach(function( file ) {
	compareFiles[ file ] = [ file,  mapMinFile( file ) ];
});

// csslint and cssmin tasks
grunt.loadNpmTasks( "grunt-css" );
// file size comparison tasks
grunt.loadNpmTasks( "grunt-compare-size" );
// html validation task
grunt.loadNpmTasks( "grunt-html" );

grunt.registerHelper( "strip_all_banners", function( filepath ) {
	return grunt.file.read( filepath ).replace( /^\s*\/\*[\s\S]*?\*\/\s*/g, "" );
});

function stripBanner( files ) {
	return files.map(function( file ) {
		return "<strip_all_banners:" + file + ">";
	});
}

function stripDirectory( file ) {
	// TODO: we're receiving the directive, so we need to strip the trailing >
	// we should be receving a clean path without the directive
	return file.replace( /.+\/(.+?)>?$/, "$1" );
}
// allow access from banner template
global.stripDirectory = stripDirectory;

function createBanner( files ) {
	// strip folders
	var fileNames = files && files.map( stripDirectory );
	return "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
		"<%= grunt.template.today('isoDate') %>\n" +
		"<%= pkg.homepage ? '* ' + pkg.homepage + '\n' : '' %>" +
		"* Includes: " + (files ? fileNames.join(", ") : "<%= stripDirectory(grunt.task.current.file.src[1]) %>") + "\n" +
		"* Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
		" Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */";
}

grunt.initConfig({
	pkg: "<json:package.json>",
	files: {
		dist: "<%= pkg.name %>-<%= pkg.version %>",
		cdn: "<%= pkg.name %>-<%= pkg.version %>-cdn",
		themes: "<%= pkg.name %>-themes-<%= pkg.version %>"
	},
	meta: {
		banner: createBanner(),
		bannerAll: createBanner( uiFiles ),
		bannerI18n: createBanner( allI18nFiles ),
		bannerCSS: createBanner( cssFiles )
	},
	compare_size: compareFiles,
	concat: {
		ui: {
			src: [ "<banner:meta.bannerAll>", stripBanner( uiFiles ) ],
			dest: "dist/jquery-ui.js"
		},
		i18n: {
			src: [ "<banner:meta.bannerI18n>", allI18nFiles ],
			dest: "dist/i18n/jquery-ui-i18n.js"
		},
		css: {
			src: [ "<banner:meta.bannerCSS>", stripBanner( cssFiles ) ],
			dest: "dist/jquery-ui.css"
		}
	},
	min: minify,
	cssmin: minifyCSS,
	htmllint: {
		// ignore files that contain invalid html, used only for ajax content testing
		all: grunt.file.expand( [ "demos/**/*.html", "tests/**/*.html" ] ).filter(function( file ) {
			return !/(?:ajax\/content\d\.html|tabs\/data\/test\.html|tests\/unit\/core\/core\.html)/.test( file );
		})
	},
	copy: {
		dist: {
			src: [
				"AUTHORS.txt",
				"GPL-LICENSE.txt",
				"jquery-*.js",
				"MIT-LICENSE.txt",
				"README.md",
				"grunt.js",
				"package.json",
				"ui/**/*",
				"demos/**/*",
				"themes/**/*",
				"external/**/*",
				"tests/**/*"
			],
			renames: {
				"dist/jquery-ui.js": "ui/jquery-ui.js",
				"dist/jquery-ui.min.js": "ui/minified/jquery-ui.min.js",
				"dist/i18n/jquery-ui-i18n.js": "ui/i18n/jquery-ui-i18n.js",
				"dist/i18n/jquery-ui-i18n.min.js": "ui/minified/i18n/jquery-ui-i18n.min.js",
				"dist/jquery-ui.css": "themes/base/jquery-ui.css",
				"dist/jquery-ui.min.css": "themes/base/minified/jquery-ui.min.css"
			},
			dest: "dist/<%= files.dist %>"
		},
		dist_min: {
			src: "dist/minified/**/*",
			strip: /^dist/,
			dest: "dist/<%= files.dist %>/ui"
		},
		dist_css_min: {
			src: "dist/themes/base/minified/*.css",
			strip: /^dist/,
			dest: "dist/<%= files.dist %>"
		},
		dist_units_images: {
			src: "themes/base/images/*",
			strip: /^themes\/base\//,
			dest: "dist/"
		},
		dist_min_images: {
			src: "themes/base/images/*",
			strip: /^themes\/base\//,
			dest: "dist/<%= files.dist %>/themes/base/minified"
		},
		cdn: {
			src: [
				"AUTHORS.txt",
				"GPL-LICENSE.txt",
				"MIT-LICENSE.txt",
				"ui/*.js",
				"package.json"
			],
			renames: {
				"dist/jquery-ui.js": "jquery-ui.js",
				"dist/jquery-ui.min.js": "jquery-ui.min.js",
				"dist/i18n/jquery-ui-i18n.js": "i18n/jquery-ui-i18n.js",
				"dist/i18n/jquery-ui-i18n.min.js": "i18n/jquery-ui-i18n.min.js",
				"dist/jquery-ui.css": "themes/base/jquery-ui.css",
				"dist/jquery-ui.min.css": "themes/base/minified/jquery-ui.min.css"
			},
			dest: "dist/<%= files.cdn %>"
		},
		cdn_i18n: {
			src: "ui/i18n/jquery.ui.datepicker-*.js",
			strip: "ui/",
			dest: "dist/<%= files.cdn %>"
		},
		cdn_i18n_min: {
			src: "dist/minified/i18n/jquery.ui.datepicker-*.js",
			strip: "dist/minified",
			dest: "dist/<%= files.cdn %>"
		},
		cdn_min: {
			src: "dist/minified/*.js",
			strip: /^dist\/minified/,
			dest: "dist/<%= files.cdn %>/ui"
		},
		cdn_min_images: {
			src: "themes/base/images/*",
			strip: /^themes\/base\//,
			dest: "dist/<%= files.cdn %>/themes/base/minified"
		},
		cdn_themes: {
			src: "dist/<%= files.themes %>/themes/**/*",
			strip: "dist/<%= files.themes %>",
			dest: "dist/<%= files.cdn %>"
		},
		themes: {
			src: [
				"AUTHORS.txt",
				"GPL-LICENSE.txt",
				"MIT-LICENSE.txt",
				"package.json"
			],
			dest: "dist/<%= files.themes %>"
		}
	},
	zip: {
		dist: {
			src: "<%= files.dist %>",
			dest: "<%= files.dist %>.zip"
		},
		cdn: {
			src: "<%= files.cdn %>",
			dest: "<%= files.cdn %>.zip"
		},
		themes: {
			src: "<%= files.themes %>",
			dest: "<%= files.themes %>.zip"
		}
	},
	md5: {
		dist: {
			src: "dist/<%= files.dist %>",
			dest: "dist/<%= files.dist %>/MANIFEST"
		},
		cdn: {
			src: "dist/<%= files.cdn %>",
			dest: "dist/<%= files.cdn %>/MANIFEST"
		},
		themes: {
			src: "dist/<%= files.themes %>",
			dest: "dist/<%= files.themes %>/MANIFEST"
		}
	},
	qunit: {
		files: grunt.file.expandFiles( "tests/unit/**/*.html" ).filter(function( file ) {
			// disabling everything that doesn't (quite) work with PhantomJS for now
			// TODO except for all|index|test, try to include more as we go
			return !( /(all|all-active|index|test|draggable|droppable|selectable|resizable|sortable|dialog|slider|datepicker|tabs|tabs_deprecated)\.html$/ ).test( file );
		})
	},
	lint: {
		ui: grunt.file.expandFiles( "ui/*.js" ).filter(function( file ) {
			// TODO remove items from this list once rewritten
			return !( /(mouse|datepicker|draggable|droppable|resizable|selectable|sortable)\.js$/ ).test( file );
		}),
		grunt: "grunt.js",
		tests: "tests/unit/**/*.js"
	},
	csslint: {
		// nothing: []
		// TODO figure out what to check for, then fix and enable
		base_theme: {
			src: grunt.file.expandFiles( "themes/base/*.css" ).filter(function( file ) {
				// TODO remove items from this list once rewritten
				return !( /(button|datepicker|core|dialog|theme)\.css$/ ).test( file );
			}),
			// TODO consider reenabling some of these rules
			rules: {
				"import": false,
				"important": false,
				"outline-none": false,
				// especially this one
				"overqualified-elements": false
			}
		}
	},
	jshint: (function() {
		function parserc( path ) {
			var rc = grunt.file.readJSON( (path || "") + ".jshintrc" ),
				settings = {
					options: rc,
					globals: {}
				};

			(rc.predef || []).forEach(function( prop ) {
				settings.globals[ prop ] = true;
			});
			delete rc.predef;

			return settings;
		}

		return {
			// TODO: use "faux strict mode" https://github.com/jshint/jshint/issues/504
			// TODO: limit `smarttabs` to multi-line comments https://github.com/jshint/jshint/issues/503
			options: parserc(),
			ui: parserc( "ui/" ),
			// TODO: `evil: true` is only for document.write() https://github.com/jshint/jshint/issues/519
			// TODO: don't create so many globals in tests
			tests: parserc( "tests/" )
		};
	})()
});

grunt.registerTask( "testswarm", function( commit, configFile ) {
	var test,
		testswarm = require( "testswarm" ),
		testBase = "http://swarm.jquery.org/git/jquery-ui/" + commit + "/tests/unit/",
		testUrls = [],
		tests = {
			"Accordion": "accordion/accordion.html",
			"Accordion_deprecated": "accordion/accordion_deprecated.html",
			"Autocomplete": "autocomplete/autocomplete.html",
			"Button": "button/button.html",
			"Core": "core/core.html",
			//"datepicker/datepicker.html",
			//"dialog/dialog.html",
			//"draggable/draggable.html",
			//"droppable/droppable.html",
			"Effects": "effects/effects.html",
			"Menu": "menu/menu.html",
			"Position": "position/position.html",
			"Position_deprecated": "position/position_deprecated.html",
			"Progressbar": "progressbar/progressbar.html",
			//"resizable/resizable.html",
			//"selectable/selectable.html",
			//"slider/slider.html",
			//"sortable/sortable.html",
			"Spinner": "spinner/spinner.html",
			"Tabs": "tabs/tabs.html",
			"Tabs_deprecated": "tabs/tabs_deprecated.html",
			"Tooltip": "tooltip/tooltip.html",
			"Widget": "widget/widget.html"
		};
	for ( test in tests ) {
		testUrls.push( testBase + tests[ test ] + "?nojshint=true" );
	}
	testswarm({
		url: "http://swarm.jquery.org/",
		pollInterval: 10000,
		timeout: 1000 * 60 * 30,
		done: this.async()
	}, {
		authUsername: "jqueryui",
		authToken: grunt.file.readJSON( configFile ).jqueryui.authToken,
		jobName: 'jQuery UI commit #<a href="https://github.com/jquery/jquery-ui/commit/' + commit + '">' + commit.substr( 0, 10 ) + '</a>',
		runMax: 3,
		"runNames[]": Object.keys(tests),
		"runUrls[]": testUrls,
		"browserSets[]": ["popular"]
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
	}, function( err, result ) {
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

// only needed for 1.8
grunt.registerTask( "download_docs", function() {
	function capitalize(value) {
		return value[0].toUpperCase() + value.slice(1);
	}
	// should be grunt.config("pkg.version")?
	var version = "1.8",
		docsDir = "dist/docs",
		files = "draggable droppable resizable selectable sortable accordion autocomplete button datepicker dialog progressbar slider tabs position"
		.split(" ").map(function(widget) {
			return {
				url: "http://docs.jquery.com/action/render/UI/API/" + version + "/" + capitalize(widget),
				dest: docsDir + '/' + widget + '.html'
			};
		});
	files = files.concat("animate addClass effect hide removeClass show switchClass toggle toggleClass".split(" ").map(function(widget) {
		return {
			url: "http://docs.jquery.com/action/render/UI/Effects/" + widget,
			dest: docsDir + '/' + widget + '.html'
		};
	}));
	files = files.concat("Blind Clip Drop Explode Fade Fold Puff Slide Scale Bounce Highlight Pulsate Shake Size Transfer".split(" ").map(function(widget) {
		return {
			url: "http://docs.jquery.com/action/render/UI/Effects/" + widget,
			dest: docsDir + '/effect-' + widget.toLowerCase() + '.html'
		};
	}));
	grunt.file.mkdir( "dist/docs" );
	grunt.utils.async.forEach( files, function( file, done ) {
		var out = fs.createWriteStream( file.dest );
		out.on( "close", done );
		request( file.url ).pipe( out );
	}, this.async() );
});

grunt.registerTask( "download_themes", function() {
	// var AdmZip = require('adm-zip');
	var done = this.async(),
		themes = grunt.file.read( "build/themes" ).split(","),
		requests = 0;
	grunt.file.mkdir( "dist/tmp" );
	themes.forEach(function( theme, index ) {
		requests += 1;
		grunt.file.mkdir( "dist/tmp/" + index );
		var zipFileName = "dist/tmp/" + index + ".zip",
			out = fs.createWriteStream( zipFileName );
		out.on( "close", function() {
			grunt.log.writeln( "done downloading " + zipFileName );
			// TODO AdmZip produces "crc32 checksum failed", need to figure out why
			// var zip = new AdmZip(zipFileName);
			// zip.extractAllTo('dist/tmp/' + index + '/');
			// until then, using cli unzip...
			grunt.utils.spawn({
				cmd: "unzip",
				args: [ "-d", "dist/tmp/" + index, zipFileName ]
			}, function( err, result ) {
				grunt.log.writeln( "Unzipped " + zipFileName + ", deleting it now" );
				fs.unlinkSync( zipFileName );
				requests -= 1;
				if (requests === 0) {
					done();
				}
			});
		});
		request( "http://ui-dev.jquery.com/download/?" + theme ).pipe( out );
	});
});

grunt.registerTask( "copy_themes", function() {
	// each package includes the base theme, ignore that
	var filter = /themes\/base/,
		files = grunt.file.expandFiles( "dist/tmp/*/development-bundle/themes/**/*" ).filter(function( file ) {
			return !filter.test( file );
		}),
		// TODO the grunt.template.process call shouldn't be necessary
		target = "dist/" + grunt.template.process( grunt.config( "files.themes" ), grunt.config() ) + "/",
		distFolder = "dist/" + grunt.template.process( grunt.config( "files.dist" ), grunt.config() );
	files.forEach(function( fileName ) {
		var targetFile = fileName.replace( /dist\/tmp\/\d+\/development-bundle\//, "" ).replace( "jquery-ui-.custom", "jquery-ui" );
		grunt.file.copy( fileName, target + targetFile );
	});

	// copy minified base theme from regular release
	files = grunt.file.expandFiles( distFolder + "/themes/base/**/*" );
	files.forEach(function( fileName ) {
		grunt.file.copy( fileName, target + fileName.replace( distFolder, "" ) );
	});
});

grunt.registerTask( "clean", function() {
	require( "rimraf" ).sync( "dist" );
});

grunt.registerTask( "authors", function() {
	var done = this.async();

	grunt.utils.spawn({
		cmd: "git",
		args: [ "log", "--pretty=%an <%ae>" ]
	}, function( err, result ) {
		if ( err ) {
			grunt.log.error( err );
			return done( false );
		}

		var authors,
			tracked = {};
		authors = result.split( "\n" ).reverse().filter(function( author ) {
			var first = !tracked[ author ];
			tracked[ author ] = true;
			return first;
		}).join( "\n" );
		grunt.log.writeln( authors );
		done();
	});
});

grunt.registerTask( "default", "lint csslint htmllint qunit" );
grunt.registerTask( "sizer", "concat:ui min:dist/jquery-ui.min.js compare_size:all" );
grunt.registerTask( "sizer_all", "concat:ui min compare_size" );
grunt.registerTask( "build", "concat min cssmin copy:dist_units_images" );
grunt.registerTask( "release", "clean build copy:dist copy:dist_min copy:dist_min_images copy:dist_css_min md5:dist zip:dist" );
grunt.registerTask( "release_themes", "release download_themes copy_themes copy:themes md5:themes zip:themes" );
grunt.registerTask( "release_cdn", "release_themes copy:cdn copy:cdn_min copy:cdn_i18n copy:cdn_i18n_min copy:cdn_min_images copy:cdn_themes md5:cdn zip:cdn" );

};
