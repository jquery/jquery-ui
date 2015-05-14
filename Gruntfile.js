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
	component = grunt.option( "component" ) || "**",

	jscsBad = [
		"ui/button.js",
		"ui/datepicker.js",
		"ui/draggable.js",
		"ui/droppable.js",
		"ui/effect.js",
		"ui/mouse.js",
		"ui/resizable.js",
		"ui/selectable.js",
		"ui/slider.js",
		"ui/sortable.js"
	],

	htmllintBad = [
		"demos/tabs/ajax/content*.html",
		"demos/tooltip/ajax/content*.html",
		"tests/unit/core/core.html",
		"tests/unit/tabs/data/test.html"
	];

function mapMinFile( file ) {
	return "dist/" + file.replace( /ui\//, "minified/" );
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

	// Remove the requireSpacesInsideParentheses override once everything is fixed
	jscs: {
		"ui-good": [ "ui/*.js" ].concat( jscsBad.map( function( file ) {
			return "!" + file;
		} ) ),
		"ui-bad": {
			options: {
				requireSpacesInsideParentheses: null
			},
			src: jscsBad
		},
		tests: {
			options: {
				requireSpacesInsideParentheses: null
			},
			src: "tests/unit/**/*.js"
		},
		grunt: {
			options: {
				requireSpacesInsideParentheses: null
			},
			src: [ "Gruntfile.js", "build/tasks/*.js" ]
		}
	},
	uglify: minify,
	htmllint: {
		good: [ "demos/**/*.html", "tests/**/*.html" ].concat( htmllintBad.map( function( file ) {
			return "!" + file;
		} ) ),
		bad: {
			options: {
				ignore: [
					/Start tag seen without seeing a doctype first/,
					/Element “head” is missing a required instance of child element “title”/,
					/Element “object” is missing one or more of the following/,
					/The “codebase” attribute on the “object” element is obsolete/
				]
			},
			src: htmllintBad
		}
	},
	qunit: {
		files: expandFiles( "tests/unit/" + component + "/*.html" ).filter(function( file ) {
			return !( /(all|index|test)\.html$/ ).test( file );
		}),
		options: {
			inject: false,
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
			"tests/unit/**/*.js",
			"tests/lib/**/*.js"
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
				"qunit/LICENSE.txt": "qunit/LICENSE.txt",

				"qunit-assert-classes/qunit-assert-classes.js": "qunit-assert-classes/qunit-assert-classes.js",
				"qunit-assert-classes/LICENSE.txt": "qunit-assert-classes/LICENSE",

				"qunit-assert-close/qunit-assert-close.js": "qunit-assert-close/qunit-assert-close.js",
				"qunit-assert-close/MIT-LICENSE.txt": "qunit-assert-close/MIT-LICENSE.txt",

				"qunit-composite/qunit-composite.js": "qunit-composite/qunit-composite.js",
				"qunit-composite/qunit-composite.css": "qunit-composite/qunit-composite.css",
				"qunit-composite/LICENSE.txt": "qunit-composite/LICENSE.txt",

				"requirejs/require.js": "requirejs/require.js",

				"jquery-mousewheel/jquery.mousewheel.js": "jquery-mousewheel/jquery.mousewheel.js",
				"jquery-mousewheel/LICENSE.txt": "jquery-mousewheel/LICENSE.txt",

				"jquery-simulate/jquery.simulate.js": "jquery-simulate/jquery.simulate.js",
				"jquery-simulate/LICENSE.txt": "jquery-simulate/LICENSE.txt",

				"jshint/jshint.js": "jshint/dist/jshint.js",
				"jshint/LICENSE": "jshint/LICENSE",

				"jquery/jquery.js": "jquery-1.x/dist/jquery.js",
				"jquery/MIT-LICENSE.txt": "jquery-1.x/MIT-LICENSE.txt",

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

				"jquery-1.11.0/jquery.js": "jquery-1.11.0/dist/jquery.js",
				"jquery-1.11.0/MIT-LICENSE.txt": "jquery-1.11.0/MIT-LICENSE.txt",

				"jquery-1.11.1/jquery.js": "jquery-1.11.1/dist/jquery.js",
				"jquery-1.11.1/MIT-LICENSE.txt": "jquery-1.11.1/MIT-LICENSE.txt",

				"jquery-1.11.2/jquery.js": "jquery-1.11.2/dist/jquery.js",
				"jquery-1.11.2/MIT-LICENSE.txt": "jquery-1.11.2/MIT-LICENSE.txt",

				"jquery-1.11.3/jquery.js": "jquery-1.11.3/dist/jquery.js",
				"jquery-1.11.3/MIT-LICENSE.txt": "jquery-1.11.3/MIT-LICENSE.txt",

				"jquery-2.0.0/jquery.js": "jquery-2.0.0/jquery.js",
				"jquery-2.0.0/MIT-LICENSE.txt": "jquery-2.0.0/MIT-LICENSE.txt",

				"jquery-2.0.1/jquery.js": "jquery-2.0.1/jquery.js",
				"jquery-2.0.1/MIT-LICENSE.txt": "jquery-2.0.1/MIT-LICENSE.txt",

				"jquery-2.0.2/jquery.js": "jquery-2.0.2/jquery.js",
				"jquery-2.0.2/MIT-LICENSE.txt": "jquery-2.0.2/MIT-LICENSE.txt",

				"jquery-2.0.3/jquery.js": "jquery-2.0.3/jquery.js",
				"jquery-2.0.3/MIT-LICENSE.txt": "jquery-2.0.3/MIT-LICENSE.txt",

				"jquery-2.1.0/jquery.js": "jquery-2.1.0/dist/jquery.js",
				"jquery-2.1.0/MIT-LICENSE.txt": "jquery-2.1.0/MIT-LICENSE.txt",

				"jquery-2.1.1/jquery.js": "jquery-2.1.1/dist/jquery.js",
				"jquery-2.1.1/MIT-LICENSE.txt": "jquery-2.1.1/MIT-LICENSE.txt",

				"jquery-2.1.2/jquery.js": "jquery-2.1.2/dist/jquery.js",
				"jquery-2.1.2/MIT-LICENSE.txt": "jquery-2.1.2/MIT-LICENSE.txt",

				"jquery-2.1.3/jquery.js": "jquery-2.1.3/dist/jquery.js",
				"jquery-2.1.3/MIT-LICENSE.txt": "jquery-2.1.3/MIT-LICENSE.txt"
			}
		}
	},

	authors: {
		prior: [
			"Paul Bakaus <paul.bakaus@gmail.com>",
			"Richard Worth <rdworth@gmail.com>",
			"Yehuda Katz <wycats@gmail.com>",
			"Sean Catchpole <sean@sunsean.com>",
			"John Resig <jeresig@gmail.com>",
			"Tane Piper <piper.tane@gmail.com>",
			"Dmitri Gaskin <dmitrig01@gmail.com>",
			"Klaus Hartl <klaus.hartl@gmail.com>",
			"Stefan Petre <stefan.petre@gmail.com>",
			"Gilles van den Hoven <gilles@webunity.nl>",
			"Micheil Bryan Smith <micheil@brandedcode.com>",
			"Jörn Zaefferer <joern.zaefferer@gmail.com>",
			"Marc Grabanski <m@marcgrabanski.com>",
			"Keith Wood <kbwood@iinet.com.au>",
			"Brandon Aaron <brandon.aaron@gmail.com>",
			"Scott González <scott.gonzalez@gmail.com>",
			"Eduardo Lundgren <eduardolundgren@gmail.com>",
			"Aaron Eisenberger <aaronchi@gmail.com>",
			"Joan Piedra <theneojp@gmail.com>",
			"Bruno Basto <b.basto@gmail.com>",
			"Remy Sharp <remy@leftlogic.com>",
			"Bohdan Ganicky <bohdan.ganicky@gmail.com>"
		]
	}
});

grunt.registerTask( "update-authors", function() {
	var getAuthors = require( "grunt-git-authors" ),
		done = this.async();

	getAuthors({
		priorAuthors: grunt.config( "authors.prior" )
	}, function( error, authors ) {
		if ( error ) {
			grunt.log.error( error );
			return done( false );
		}

		authors = authors.map(function( author ) {
			if ( author.match( /^Jacek Jędrzejewski </ ) ) {
				return "Jacek Jędrzejewski (http://jacek.jedrzejewski.name)";
			} else if ( author.match( /^Pawel Maruszczyk </ ) ) {
				return "Pawel Maruszczyk (http://hrabstwo.net)";
			} else {
				return author;
			}
		});

		grunt.file.write( "AUTHORS.txt",
			"Authors ordered by first contribution\n" +
			"A list of current team members is available at http://jqueryui.com/about\n\n" +
			authors.join( "\n" ) + "\n" );
		done();
	});
});

grunt.registerTask( "default", [ "lint", "test" ]);
grunt.registerTask( "lint", [ "asciilint", "jshint", "jscs", "csslint", "htmllint" ]);
grunt.registerTask( "test", [ "qunit" ]);
grunt.registerTask( "sizer", [ "concat:ui", "uglify:main", "compare_size:all" ]);
grunt.registerTask( "sizer_all", [ "concat:ui", "uglify", "compare_size" ]);

};
