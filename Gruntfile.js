var sass = require("node-sass");

module.exports = function (grunt) {

	"use strict";

	var
		glob = require("glob"),

		// files
		coreFiles = [
			"core.js",
			"widget.js",
			"widgets/mouse.js",
			"widgets/draggable.js",
			"widgets/droppable.js",
			"widgets/resizable.js",
			"widgets/selectable.js",
			"widgets/sortable.js",
			"effect.js"
		],

		uiFiles = coreFiles.map(function (file) {
			return "ui/" + file;
		}).concat(expandFiles("ui/**/*.js").filter(function (file) {
			return coreFiles.indexOf(file.substring(3)) === -1;
		})),

		allI18nFiles = expandFiles("ui/i18n/*.js"),

		cssFiles = [
			"base",
			"theme"
		].map(function (component) {
			return "themes/base/" + component + ".css";
		}),

		// minified files
		minify = {
			options: {
				preserveComments: false
			},
			main: {
				options: {
					banner: createBanner(uiFiles)
				},
				files: {
					"dist/jquery-ui.min.js": "dist/jquery-ui.js"
				}
			},
			i18n: {
				options: {
					banner: createBanner(allI18nFiles)
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
		component = grunt.option("component") || "**",

		htmllintBad = [
			"demos/tabs/ajax/content*.html",
			"demos/tooltip/ajax/content*.html",
			"tests/unit/core/core.html",
			"tests/unit/tabs/data/test.html"
		];

	function mapMinFile(file) {
		return "dist/" + file.replace(/ui\//, "minified/");
	}

	function expandFiles(files) {
		return grunt.util._.map(grunt.file.expandMapping(files), "src").map(function (values) {
			return values[0];
		});
	}

	uiFiles.concat(allI18nFiles).forEach(function (file) {
		minify[file] = {
			options: {
				banner: createBanner()
			},
			files: {}
		};
		minify[file].files[mapMinFile(file)] = file;
	});

	uiFiles.forEach(function (file) {

		// TODO this doesn't do anything until https://github.com/rwldrn/grunt-compare-size/issues/13
		compareFiles[file] = [file, mapMinFile(file)];
	});

	// grunt plugins
	require("load-grunt-tasks")(grunt);

	// local testswarm and build tasks
	grunt.loadTasks("build/tasks");

	function stripDirectory(file) {
		return file.replace(/.+\/(.+?)>?$/, "$1");
	}

	function createBanner(files) {

		// strip folders
		var fileNames = files && files.map(stripDirectory);
		return "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
			"<%= grunt.template.today('isoDate') %>\n" +
			"<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
			(files ? "* Includes: " + fileNames.join(", ") + "\n" : "") +
			"* Copyright <%= pkg.author.name %>;" +
			" Licensed <%= _.map(pkg.licenses, 'type').join(', ') %> */\n";
	}

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		files: {
			dist: "<%= pkg.name %>-<%= pkg.version %>"
		},
		compare_size: compareFiles,
		concat: {
			css: {
				options: {
					banner: createBanner(cssFiles),
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
						jquery: "./node_modules/jquery/dist/jquery",
						external: "./node_modules/"
					},
					preserveLicenseComments: false,
					optimize: "none",
					findNestedDependencies: true,
					skipModuleInsertion: true,
					exclude: ["jquery"],
					include: expandFiles(["ui/**/*.js", "!ui/core.js", "!ui/i18n/*"]),
					out: "dist/jquery-ui.js",
					wrap: {
						start: createBanner(uiFiles)
					}
				}
			}
		},
		jscs: {
			ui: {
				options: {
					config: true
				},
				files: {
					src: ["demos/**/*.js", "build/**/*.js", "ui/**/*.js"]
				}
			},
			tests: {
				options: {
					config: true,
					maximumLineLength: null
				},
				files: {
					src: ["tests/**/*.js"]
				}
			}
		},
		uglify: minify,
		htmllint: {
			good: {
				options: {
					ignore: [
						/The text content of element “script” was not in the required format: Expected space, tab, newline, or slash but found “.” instead/
					]
				},
				src: glob.sync("{demos,tests}/**/*.html", {
					ignore: htmllintBad
				})
			},
			bad: {
				options: {
					ignore: [
						/Start tag seen without seeing a doctype first/,
						/Element “head” is missing a required instance of child element “title”/,
						/Element “object” is missing one or more of the following/,
						/The “codebase” attribute on the “object” element is obsolete/,
						/Consider adding a “lang” attribute to the “html” start tag/
					]
				},
				src: htmllintBad
			}
		},
		qunit: {
			files: expandFiles("tests/unit/" + component + "/*.html").filter(function (file) {
				return !(/(all|index|test)\.html$/).test(file);
			}),
			options: {
				puppeteer: {
					ignoreDefaultArgs: true,
					args: [
						"--headless",
						"--disable-web-security",
						"--allow-file-access-from-files"
					]
				},
				inject: [
					require.resolve("grunt-contrib-qunit/chrome/bridge")
				],
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
		sass: {
			options: {
				implementation: sass
			},
			dist: {
				files: {
					"themes/base/all.css": "themes/base/scss/all.scss",
					"themes/base/base.css": "themes/base/scss/base.scss",
					"themes/base/theme.css": "themes/base/scss/theme.scss"
				}
			}
		}
	});

	grunt.registerTask("update-authors", function () {
		var getAuthors = require("grunt-git-authors").getAuthors,
			done = this.async();

		getAuthors({
			priorAuthors: grunt.config("authors.prior")
		}, function (error, authors) {
			if (error) {
				grunt.log.error(error);
				return done(false);
			}

			authors = authors.map(function (author) {
				if (author.match(/^Jacek Jędrzejewski </)) {
					return "Jacek Jędrzejewski (http://jacek.jedrzejewski.name)";
				} else if (author.match(/^Pawel Maruszczyk </)) {
					return "Pawel Maruszczyk (http://hrabstwo.net)";
				} else {
					return author;
				}
			});

			grunt.file.write("AUTHORS.txt",
				"Authors ordered by first contribution\n" +
				"A list of current team members is available at http://jqueryui.com/about\n\n" +
				authors.join("\n") + "\n");
			done();
		});
	});

	grunt.registerTask("default", ["requirejs", "build"]);

	grunt.registerTask("jenkins", ["default"]);
	grunt.registerTask("lint", ["asciilint", "jshint", "jscs", "csslint", "htmllint"]);
	grunt.registerTask("test", ["qunit"]);
	grunt.registerTask("build", ["sass", "concat"]);
	grunt.registerTask("sizer", ["requirejs:js", "uglify:main", "compare_size:all"]);
	grunt.registerTask("sizer_all", ["requirejs:js", "uglify", "compare_size"]);

};
