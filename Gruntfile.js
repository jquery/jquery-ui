module.exports = function( grunt ) {

"use strict";

var
	// files
	coreFiles = [
		"core.js",
		"widget.js",
		"mouse.js",
		"draggable.js",
		"droppable.js",
		"resizable.js",
		"selectable.js",
		"sortable.js",
		"effect.js"
	],

	uiFiles = coreFiles.map(function( file ) {
		return "ui/" + file;
	}).concat( expandFiles( "ui/*.js" ).filter(function( file ) {
		return coreFiles.indexOf( file.substring( 3 ) ) === -1;
	}) ),

	allI18nFiles = expandFiles( "ui/i18n/*.js" ),

	cssFiles = [
		"core",
		"accordion",
		"autocomplete",
		"button",
		"datepicker",
		"dialog",
		"draggable",
		"menu",
		"progressbar",
		"resizable",
		"selectable",
		"selectmenu",
		"sortable",
		"slider",
		"spinner",
		"tabs",
		"tooltip",
		"theme"
	].map(function( component ) {
		return "themes/base/" + component + ".css";
	}),

	// minified files
	minify = {
		options: {
			preserveComments: false
		},
		main: {
			options: {
				banner: createBanner( uiFiles )
			},
			files: {
				"dist/jquery-ui.min.js": "dist/jquery-ui.js"
			}
		},
		i18n: {
			options: {
				banner: createBanner( allI18nFiles )
			},
			files: {
				"dist/i18n/jquery-ui-i18n.min.js": "dist/i18n/jquery-ui-i18n.js"
			}
		}
	},

	compareFiles = {
		all: [
			"dist/jquery-ui.js",
			"dist/jquery-ui.min.js"
		]
	},
	component = grunt.option( "component" ) || "**";

function mapMinFile( file ) {
	return "dist/" + file.replace( /\.js$/, ".min.js" ).replace( /ui\//, "minified/" );
}

function expandFiles( files ) {
	return grunt.util._.pluck( grunt.file.expandMapping( files ), "src" ).map(function( values ) {
		return values[ 0 ];
	});
}

uiFiles.concat( allI18nFiles ).forEach(function( file ) {
	minify[ file ] = {
		options: {
			banner: createBanner()
		},
		files: {}
	};
	minify[ file ].files[ mapMinFile( file ) ] = file;
});

uiFiles.forEach(function( file ) {
	// TODO this doesn't do anything until https://github.com/rwldrn/grunt-compare-size/issues/13
	compareFiles[ file ] = [ file, mapMinFile( file ) ];
});

// grunt plugins
require( "load-grunt-tasks" )( grunt );
// local testswarm and build tasks
grunt.loadTasks( "build/tasks" );

function stripDirectory( file ) {
	return file.replace( /.+\/(.+?)>?$/, "$1" );
}

function createBanner( files ) {
	// strip folders
	var fileNames = files && files.map( stripDirectory );
	return "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
		"<%= grunt.template.today('isoDate') %>\n" +
		"<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
		(files ? "* Includes: " + fileNames.join(", ") + "\n" : "") +
		"* Copyright <%= pkg.author.name %>;" +
		" Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */\n";
}

grunt.initConfig({
	pkg: grunt.file.readJSON( "package.json" ),
	files: {
		dist: "<%= pkg.name %>-<%= pkg.version %>"
	},
	compare_size: compareFiles,
	concat: {
		ui: {
			options: {
				banner: createBanner( uiFiles ),
				stripBanners: {
					block: true
				}
			},
			src: uiFiles,
			dest: "dist/jquery-ui.js"
		},
		i18n: {
			options: {
				banner: createBanner( allI18nFiles )
			},
			src: allI18nFiles,
			dest: "dist/i18n/jquery-ui-i18n.js"
		},
		css: {
			options: {
				banner: createBanner( cssFiles ),
				stripBanners: {
					block: true
				}
			},
			src: cssFiles,
			dest: "dist/jquery-ui.css"
		}
	},
	jscs: {
		// datepicker and sortable are getting rewritten, ignore until that's done
		ui: [ "ui/*.js", "!ui/datepicker.js", "!ui/sortable.js" ],
		// TODO enable this once we have a tool that can auto format files
		// tests: "tests/unit/**/*.js",
		grunt: [ "Gruntfile.js", "build/tasks/*.js" ]
	},
	uglify: minify,
	htmllint: {
		// ignore files that contain invalid html, used only for ajax content testing
		all: grunt.file.expand( [ "demos/**/*.html", "tests/**/*.html" ] ).filter(function( file ) {
			return !/(?:ajax\/content\d\.html|tabs\/data\/test\.html|tests\/unit\/core\/core.*\.html)/.test( file );
		})
	},
	qunit: {
		files: expandFiles( "tests/unit/" + component + "/*.html" ).filter(function( file ) {
			return !( /(all|index|test)\.html$/ ).test( file );
		}),
		options: {
			page: {
				viewportSize: { width: 700, height: 500 }
			}
		}
	},
	jshint: {
		options: {
			jshintrc: true
		},
		all: [
			"ui/*.js",
			"Gruntfile.js",
			"build/**/*.js",
			"tests/unit/**/*.js"
		]
	},
	csslint: {
		base_theme: {
			src: "themes/base/*.css",
			options: {
				csslintrc: ".csslintrc"
			}
		}
	},

	esformatter: {
		options: {
			preset: "jquery"
		},
		ui: "ui/*.js",
		tests: "tests/unit/**/*.js",
		build: {
			options: {
				skipHashbang: true
			},
			src: "build/**/*.js"
		},
		grunt: "Gruntfile.js"
	},

	bowercopy: {
		all: {
			options: {
				clean: true,
				ignore: [ "jquery" ],
				destPrefix: "external"
			},
			files: {
				"qunit/qunit.js": "qunit/qunit/qunit.js",
				"qunit/qunit.css": "qunit/qunit/qunit.css",
				"qunit/MIT-LICENSE.txt": "qunit/MIT-LICENSE.txt",

				"jquery-mousewheel/jquery.mousewheel.js": "jquery-mousewheel/jquery.mousewheel.js",
				"jquery-mousewheel/LICENSE.txt": "jquery-mousewheel/LICENSE.txt",

				"jquery-simulate/jquery.simulate.js": "jquery-simulate/jquery.simulate.js",
				"jquery-simulate/LICENSE.txt": "jquery-simulate/LICENSE.txt",

				"jshint/jshint.js": "jshint/dist/jshint.js",
				"jshint/LICENSE": "jshint/LICENSE",

				"jquery/jquery.js": "jquery-1.x/jquery.js",
				"jquery/MIT-LICENSE.txt": "jquery-1.x/MIT-LICENSE.txt",

				"jquery-1.6.0/jquery.js": "jquery-1.6.0/jquery.js",
				"jquery-1.6.0/MIT-LICENSE.txt": "jquery-1.6.0/MIT-LICENSE.txt",

				"jquery-1.6.1/jquery.js": "jquery-1.6.1/jquery.js",
				"jquery-1.6.1/MIT-LICENSE.txt": "jquery-1.6.1/MIT-LICENSE.txt",

				"jquery-1.6.2/jquery.js": "jquery-1.6.2/jquery.js",
				"jquery-1.6.2/MIT-LICENSE.txt": "jquery-1.6.2/MIT-LICENSE.txt",

				"jquery-1.6.3/jquery.js": "jquery-1.6.3/jquery.js",
				"jquery-1.6.3/MIT-LICENSE.txt": "jquery-1.6.3/MIT-LICENSE.txt",

				"jquery-1.6.4/jquery.js": "jquery-1.6.4/jquery.js",
				"jquery-1.6.4/MIT-LICENSE.txt": "jquery-1.6.4/MIT-LICENSE.txt",

				"jquery-1.7.0/jquery.js": "jquery-1.7.0/jquery.js",
				"jquery-1.7.0/MIT-LICENSE.txt": "jquery-1.7.0/MIT-LICENSE.txt",

				"jquery-1.7.1/jquery.js": "jquery-1.7.1/jquery.js",
				"jquery-1.7.1/MIT-LICENSE.txt": "jquery-1.7.1/MIT-LICENSE.txt",

				"jquery-1.7.2/jquery.js": "jquery-1.7.2/jquery.js",
				"jquery-1.7.2/MIT-LICENSE.txt": "jquery-1.7.2/MIT-LICENSE.txt",

				"jquery-1.8.0/jquery.js": "jquery-1.8.0/jquery.js",
				"jquery-1.8.0/MIT-LICENSE.txt": "jquery-1.8.0/MIT-LICENSE.txt",

				"jquery-1.8.1/jquery.js": "jquery-1.8.1/jquery.js",
				"jquery-1.8.1/MIT-LICENSE.txt": "jquery-1.8.1/MIT-LICENSE.txt",

				"jquery-1.8.2/jquery.js": "jquery-1.8.2/jquery.js",
				"jquery-1.8.2/MIT-LICENSE.txt": "jquery-1.8.2/MIT-LICENSE.txt",

				"jquery-1.8.3/jquery.js": "jquery-1.8.3/jquery.js",
				"jquery-1.8.3/MIT-LICENSE.txt": "jquery-1.8.3/MIT-LICENSE.txt",

				"jquery-1.9.0/jquery.js": "jquery-1.9.0/jquery.js",
				"jquery-1.9.0/MIT-LICENSE.txt": "jquery-1.9.0/MIT-LICENSE.txt",

				"jquery-1.9.1/jquery.js": "jquery-1.9.1/jquery.js",
				"jquery-1.9.1/MIT-LICENSE.txt": "jquery-1.9.1/MIT-LICENSE.txt",

				"jquery-1.10.0/jquery.js": "jquery-1.10.0/jquery.js",
				"jquery-1.10.0/MIT-LICENSE.txt": "jquery-1.10.0/MIT-LICENSE.txt",

				"jquery-1.10.1/jquery.js": "jquery-1.10.1/jquery.js",
				"jquery-1.10.1/MIT-LICENSE.txt": "jquery-1.10.1/MIT-LICENSE.txt",

				"jquery-1.10.2/jquery.js": "jquery-1.10.2/jquery.js",
				"jquery-1.10.2/MIT-LICENSE.txt": "jquery-1.10.2/MIT-LICENSE.txt",

				"jquery-2.0.0/jquery.js": "jquery-2.0.0/jquery.js",
				"jquery-2.0.0/MIT-LICENSE.txt": "jquery-2.0.0/MIT-LICENSE.txt",

				"jquery-2.0.1/jquery.js": "jquery-2.0.1/jquery.js",
				"jquery-2.0.1/MIT-LICENSE.txt": "jquery-2.0.1/MIT-LICENSE.txt",

				"jquery-2.0.2/jquery.js": "jquery-2.0.2/jquery.js",
				"jquery-2.0.2/MIT-LICENSE.txt": "jquery-2.0.2/MIT-LICENSE.txt",

				"jquery-2.0.3/jquery.js": "jquery-2.0.3/jquery.js",
				"jquery-2.0.3/MIT-LICENSE.txt": "jquery-2.0.3/MIT-LICENSE.txt",

				"jquery-3.0.0/jquery.js": "jquery-3.0.0/dist/jquery.js",
				"jquery-3.0.0/LICENSE.txt": "jquery-3.0.0/LICENSE.txt"
			}
		}
	}
});

grunt.registerTask( "default", [ "lint", "test" ]);
grunt.registerTask( "lint", [ "asciilint", "jshint", "jscs", "csslint", "htmllint" ]);
grunt.registerTask( "test", [ "qunit" ]);
grunt.registerTask( "sizer", [ "concat:ui", "uglify:main", "compare_size:all" ]);
grunt.registerTask( "sizer_all", [ "concat:ui", "uglify", "compare_size" ]);

};
