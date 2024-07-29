"use strict";

module.exports = function( grunt ) {

const { gzipSync } = require( "node:zlib" );

// files
const coreFiles = [
	"widget.js",
	"widgets/mouse.js",
	"widgets/draggable.js",
	"widgets/droppable.js",
	"widgets/resizable.js",
	"widgets/selectable.js",
	"widgets/sortable.js",
	"effect.js"
];

const uiFiles = coreFiles.map( function( file ) {
	return "ui/" + file;
} ).concat( expandFiles( "ui/**/*.js" ).filter( function( file ) {
	return coreFiles.indexOf( file.substring( 3 ) ) === -1;
} ) );

const allI18nFiles = expandFiles( "ui/i18n/*.js" );

const cssFiles = [
	"core",
	"accordion",
	"autocomplete",
	"button",
	"checkboxradio",
	"controlgroup",
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
].map( function( component ) {
	return "themes/base/" + component + ".css";
} );

// minified files
const minify = {
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
};

const compareFiles = {
	all: [
		"dist/jquery-ui.js",
		"dist/jquery-ui.min.js"
	],
	options: {
		compress: {
			gz: function( contents ) {
				return gzipSync( contents ).length;
			}
		},
		cache: "build/.sizecache.json"
	}
};

const htmllintBad = [
	"demos/tabs/ajax/content*.html",
	"demos/tooltip/ajax/content*.html",
	"tests/unit/core/core.html",
	"tests/unit/tabs/data/test.html"
];

function mapMinFile( file ) {
	return "dist/" + file.replace( /ui\//, "minified/" );
}

function expandFiles( files ) {
	return grunt.util._.map( grunt.file.expandMapping( files ), "src" ).map( function( values ) {
		return values[ 0 ];
	} );
}

uiFiles.concat( allI18nFiles ).forEach( function( file ) {
	minify[ file ] = {
		options: {
			banner: createBanner()
		},
		files: {}
	};
	minify[ file ].files[ mapMinFile( file ) ] = file;
} );

uiFiles.forEach( function( file ) {
	compareFiles[ file ] = [ file, mapMinFile( file ) ];
} );

function stripDirectory( file ) {
	return file.replace( /.+\/(.+?)>?$/, "$1" );
}

function createBanner( files ) {

	// strip folders
	const fileNames = files && files.map( stripDirectory );
	return "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
		"<%= grunt.template.today('isoDate') %>\n" +
		"<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
		( files ? "* Includes: " + fileNames.join( ", " ) + "\n" : "" ) +
		"* Copyright <%= pkg.author.name %>;" +
		" Licensed <%= _.map(pkg.licenses, 'type').join(', ') %> */\n";
}

grunt.initConfig( {
	pkg: grunt.file.readJSON( "package.json" ),
	files: {
		dist: "<%= pkg.name %>-<%= pkg.version %>"
	},
	compare_size: compareFiles,
	concat: {
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
	requirejs: {
		js: {
			options: {
				baseUrl: "./",
				paths: {
					jquery: "./external/jquery/jquery",
					external: "./external/"
				},
				preserveLicenseComments: false,
				optimize: "none",
				findNestedDependencies: true,
				skipModuleInsertion: true,
				exclude: [ "jquery" ],
				include: expandFiles( [ "ui/**/*.js", "!ui/i18n/*" ] ),
				out: "dist/jquery-ui.js",
				wrap: {
					start: createBanner( uiFiles )
				}
			}
		}
	},

	uglify: minify,
	htmllint: {
		good: {
			options: {
				ignore: [
					/The text content of element “script” was not in the required format: Expected space, tab, newline, or slash but found “.” instead/,
					/This document appears to be written in .*. Consider using “lang=".*"” \(or variant\) instead/
				]
			},
			src: [
				"{demos,tests}/**/*.html",
				...htmllintBad.map( pattern => `!${ pattern }` )
			]
		},
		bad: {
			options: {
				ignore: [
					/Start tag seen without seeing a doctype first/,
					/Element “head” is missing a required instance of child element “title”/,
					/Element “object” is missing one or more of the following/,
					/The “codebase” attribute on the “object” element is obsolete/,
					/Consider adding a “lang” attribute to the “html” start tag/,
					/This document appears to be written in .*. Consider (?:adding|using) “lang=".*"” \(or variant\)/
				]
			},
			src: htmllintBad
		}
	},
	eslint: {
		all: [
			"ui/**/*.js",
			"!ui/vendor/**/*.js",
			"Gruntfile.js",
			"build/**/*.js",
			"tests/unit/**/*.js",
			"tests/lib/**/*.js",
			"demos/**/*.js"
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

	bowercopy: {
		inlineVendors: {
			options: {
				clean: true,
				destPrefix: "ui/vendor"
			},
			files: {
				"jquery-color/jquery.color.js": "jquery-color/dist/jquery.color.js",
				"jquery-color/LICENSE.txt": "jquery-color/LICENSE.txt"
			}
		},

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

				"requirejs/require.js": "requirejs/require.js",

				"jquery-mousewheel/jquery.mousewheel.js": "jquery-mousewheel/jquery.mousewheel.js",
				"jquery-mousewheel/LICENSE.txt": "jquery-mousewheel/LICENSE.txt",

				"jquery-simulate/jquery.simulate.js": "jquery-simulate/jquery.simulate.js",
				"jquery-simulate/LICENSE.txt": "jquery-simulate/LICENSE.txt",

				"jquery/jquery.js": "jquery-3.x/dist/jquery.js",
				"jquery/LICENSE.txt": "jquery-3.x/LICENSE.txt",

				"jquery-1.12.4/jquery.js": "jquery-1.12.4/dist/jquery.js",
				"jquery-1.12.4/LICENSE.txt": "jquery-1.12.4/LICENSE.txt",

				"jquery-2.2.4/jquery.js": "jquery-2.2.4/dist/jquery.js",
				"jquery-2.2.4/LICENSE.txt": "jquery-2.2.4/LICENSE.txt",

				"jquery-3.0.0/jquery.js": "jquery-3.0.0/dist/jquery.js",
				"jquery-3.0.0/LICENSE.txt": "jquery-3.0.0/LICENSE.txt",

				"jquery-3.1.0/jquery.js": "jquery-3.1.0/dist/jquery.js",
				"jquery-3.1.0/LICENSE.txt": "jquery-3.1.0/LICENSE.txt",

				"jquery-3.1.1/jquery.js": "jquery-3.1.1/dist/jquery.js",
				"jquery-3.1.1/LICENSE.txt": "jquery-3.1.1/LICENSE.txt",

				"jquery-3.2.0/jquery.js": "jquery-3.2.0/dist/jquery.js",
				"jquery-3.2.0/LICENSE.txt": "jquery-3.2.0/LICENSE.txt",

				"jquery-3.2.1/jquery.js": "jquery-3.2.1/dist/jquery.js",
				"jquery-3.2.1/LICENSE.txt": "jquery-3.2.1/LICENSE.txt",

				"jquery-3.3.0/jquery.js": "jquery-3.3.0/dist/jquery.js",
				"jquery-3.3.0/LICENSE.txt": "jquery-3.3.0/LICENSE.txt",

				"jquery-3.3.1/jquery.js": "jquery-3.3.1/dist/jquery.js",
				"jquery-3.3.1/LICENSE.txt": "jquery-3.3.1/LICENSE.txt",

				"jquery-3.4.0/jquery.js": "jquery-3.4.0/dist/jquery.js",
				"jquery-3.4.0/LICENSE.txt": "jquery-3.4.0/LICENSE.txt",

				"jquery-3.4.1/jquery.js": "jquery-3.4.1/dist/jquery.js",
				"jquery-3.4.1/LICENSE.txt": "jquery-3.4.1/LICENSE.txt",

				"jquery-3.5.0/jquery.js": "jquery-3.5.0/dist/jquery.js",
				"jquery-3.5.0/LICENSE.txt": "jquery-3.5.0/LICENSE.txt",

				"jquery-3.5.1/jquery.js": "jquery-3.5.1/dist/jquery.js",
				"jquery-3.5.1/LICENSE.txt": "jquery-3.5.1/LICENSE.txt",

				"jquery-3.6.0/jquery.js": "jquery-3.6.0/dist/jquery.js",
				"jquery-3.6.0/LICENSE.txt": "jquery-3.6.0/LICENSE.txt",

				"jquery-3.6.1/jquery.js": "jquery-3.6.1/dist/jquery.js",
				"jquery-3.6.1/LICENSE.txt": "jquery-3.6.1/LICENSE.txt",

				"jquery-3.6.2/jquery.js": "jquery-3.6.2/dist/jquery.js",
				"jquery-3.6.2/LICENSE.txt": "jquery-3.6.2/LICENSE.txt",

				"jquery-3.6.3/jquery.js": "jquery-3.6.3/dist/jquery.js",
				"jquery-3.6.3/LICENSE.txt": "jquery-3.6.3/LICENSE.txt",

				"jquery-3.6.4/jquery.js": "jquery-3.6.4/dist/jquery.js",
				"jquery-3.6.4/LICENSE.txt": "jquery-3.6.4/LICENSE.txt",

				"jquery-3.7.0/jquery.js": "jquery-3.7.0/dist/jquery.js",
				"jquery-3.7.0/LICENSE.txt": "jquery-3.7.0/LICENSE.txt",

				"jquery-3.7.1/jquery.js": "jquery-3.7.1/dist/jquery.js",
				"jquery-3.7.1/LICENSE.txt": "jquery-3.7.1/LICENSE.txt",

				"jquery-migrate-1.x/jquery-migrate.js":
					"jquery-migrate-1.x/dist/jquery-migrate.js",
				"jquery-migrate-1.x/LICENSE.txt": "jquery-migrate-1.x/LICENSE.txt",

				"jquery-migrate-3.x/jquery-migrate.js":
					"jquery-migrate-3.x/dist/jquery-migrate.js",
				"jquery-migrate-3.x/LICENSE.txt": "jquery-migrate-3.x/LICENSE.txt"
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
} );

// grunt plugins
require( "load-grunt-tasks" )( grunt );

// local tasks
grunt.loadTasks( "build/tasks" );

grunt.registerTask( "update-authors", function() {
	const getAuthors = require( "grunt-git-authors" ).getAuthors;
	const done = this.async();

	getAuthors( {
		priorAuthors: grunt.config( "authors.prior" )
	}, function( error, authors ) {
		if ( error ) {
			grunt.log.error( error );
			return done( false );
		}

		authors = authors.map( function( author ) {
			if ( author.match( /^Jacek Jędrzejewski </ ) ) {
				return "Jacek Jędrzejewski (https://jacek.jedrzejewski.name)";
			} else if ( author.match( /^Pawel Maruszczyk </ ) ) {
				return "Pawel Maruszczyk (http://hrabstwo.net)";
			} else {
				return author;
			}
		} );

		grunt.file.write( "AUTHORS.txt",
			"Authors ordered by first contribution\n" +
			"A list of current team members is available at https://jqueryui.com/about\n\n" +
			authors.join( "\n" ) + "\n" );
		done();
	} );
} );

grunt.registerTask( "print_old_node_message", ( ...args ) => {
	const task = args.join( ":" );
	grunt.log.writeln( "Old Node.js detected, running the task \"" + task + "\" skipped..." );
} );

// Keep this task list in sync with the testing steps in our GitHub action test workflow file!
grunt.registerTask( "lint", [
	"asciilint",
	"eslint",
	"csslint",
	"htmllint"
] );
grunt.registerTask( "build", [ "requirejs", "concat" ] );
grunt.registerTask( "default", [ "lint", "build" ] );
grunt.registerTask( "sizer", [ "requirejs:js", "uglify:main", "compare_size:all" ] );
grunt.registerTask( "sizer_all", [ "requirejs:js", "uglify", "compare_size" ] );

};
