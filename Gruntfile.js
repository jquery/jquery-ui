module.exports = function( grunt ) {

"use strict";

var
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
		"jquery.ui.effect.js"
	],

	uiFiles = coreFiles.map(function( file ) {
		return "ui/" + file;
	}).concat( expandFiles( "ui/*.js" ).filter(function( file ) {
		return coreFiles.indexOf( file.substring(3) ) === -1;
	})),

	allI18nFiles = expandFiles( "ui/i18n/*.js" ),

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
	};

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
	compareFiles[ file ] = [ file,  mapMinFile( file ) ];
});

// grunt plugins
grunt.loadNpmTasks( "grunt-contrib-jshint" );
grunt.loadNpmTasks( "grunt-contrib-uglify" );
grunt.loadNpmTasks( "grunt-contrib-concat" );
grunt.loadNpmTasks( "grunt-contrib-qunit" );
grunt.loadNpmTasks( "grunt-contrib-csslint" );
grunt.loadNpmTasks( "grunt-html" );
grunt.loadNpmTasks( "grunt-compare-size" );
grunt.loadNpmTasks( "grunt-git-authors" );
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
		(files ? "* Includes: " + fileNames.join(", ") + "\n" : "")+
		"* Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
		" Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */\n";
}

grunt.initConfig({
	pkg: grunt.file.readJSON("package.json"),
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
	uglify: minify,
	htmllint: {
		// ignore files that contain invalid html, used only for ajax content testing
		all: grunt.file.expand( [ "demos/**/*.html", "tests/**/*.html" ] ).filter(function( file ) {
			return !/(?:ajax\/content\d\.html|tabs\/data\/test\.html|tests\/unit\/core\/core.*\.html)/.test( file );
		})
	},
	qunit: {
		files: expandFiles( "tests/unit/**/*.html" ).filter(function( file ) {
			// disabling everything that doesn't (quite) work with PhantomJS for now
			// TODO except for all|index|test, try to include more as we go
			return !( /(all|index|test|dialog|tooltip)\.html$/ ).test( file );
		})
	},
	jshint: {
		ui: {
			options: {
				jshintrc: "ui/.jshintrc"
			},
			files: {
				src: "ui/*.js"
			}
		},
		grunt: {
			options: {
				jshintrc: ".jshintrc"
			},
			files: {
				src: [ "Gruntfile.js", "build/**/*.js" ]
			}
		},
		tests: {
			options: {
				jshintrc: "tests/.jshintrc"
			},
			files: {
				src: "tests/unit/**/*.js"
			}
		}
	},
	csslint: {
		base_theme: {
			src: "themes/base/*.css",
			options: {
				csslintrc: ".csslintrc"
			}
		}
	}
});

grunt.registerTask( "default", [ "lint", "test" ] );
grunt.registerTask( "lint", [ "asciilint", "jshint", "csslint", "htmllint" ] );
grunt.registerTask( "test", [ "qunit" ] );
grunt.registerTask( "sizer", [ "concat:ui", "uglify:main", "compare_size:all" ] );
grunt.registerTask( "sizer_all", [ "concat:ui", "uglify", "compare_size" ] );

};
