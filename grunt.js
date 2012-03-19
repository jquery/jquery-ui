function stripBanner( files ) {
	return files.map(function( file ) {
		return "<strip_all_banners:" + file + ">";
	});
}

function stripDirectory( file ) {
	return file.replace( /.+\/(.+)$/, "$1" );
}

function createBanner( files ) {
	// strip folders
	var fileNames = files && files.map( stripDirectory );
	return "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
		"<%= template.today('isoDate') %>\n" +
		"<%= pkg.homepage ? '* ' + pkg.homepage + '\n' : '' %>" +
		"* Includes: " + (files ? fileNames.join(", ") : "<%= stripDirectory(task.current.file.src[1]) %>") + "\n" +
		"* Copyright (c) <%= template.today('yyyy') %> <%= pkg.author.name %>;" +
		" Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */";
}

// allow access from banner template
global.stripDirectory = stripDirectory;
task.registerHelper( "strip_all_banners", function( filepath ) {
	return file.read( filepath ).replace( /^\s*\/\*[\s\S]*?\*\/\s*/g, "" );
});
var inspect = require( "util" ).inspect;

var coreFiles = "jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.effects.core.js".split( ", " );
var uiFiles = coreFiles.map(function( file ) {
	return "ui/" + file;
}).concat( file.expand( "ui/*.js" ).filter(function( file ) {
	return coreFiles.indexOf( file.substring(3) ) === -1;
}));

var minify = {
	"dist/jquery-ui.min.js": [ "<banner:meta.bannerAll>", "dist/jquery-ui.js" ],
	"dist/i18n/jquery-ui-i18n.min.js": [ "<banner:meta.bannerI18n>", "dist/i18n/jquery-ui-i18n.js" ]
};
function minFile( file ) {
	minify[ "dist/" + file.replace( /\.js$/, ".min.js" ).replace( /ui\//, "minified/" ) ] = [ "<banner>", file ];
}
uiFiles.forEach( minFile );

var allI18nFiles = file.expand( "ui/i18n/*.js" );
allI18nFiles.forEach( minFile );

var cssFiles = "core accordion autocomplete button datepicker dialog menu progressbar resizable selectable slider spinner tabs tooltip theme".split( " " ).map(function( component ) {
	return "themes/base/jquery.ui." + component + ".css";
});
var minifyCSS = {
		"dist/jquery-ui.min.css": "dist/jquery-ui.css"
};
cssFiles.forEach(function( file ) {
	minifyCSS[ "dist/" + file.replace( /\.css$/, ".min.css" ).replace( /themes\/base\//, "themes/base/minified/" ) ] = [ "<banner>", file ];
});

config.init({
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
	compare_size: {
		files: [
			"dist/jquery-ui.js",
			"dist/jquery-ui.min.js"
		]
	},
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
	css_min: minifyCSS,
	copy: {
		dist: {
			src: [
				"AUTHORS.txt",
				"GPL-LICENSE.txt",
				"jquery-1.7.1.js",
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
		files: file.expand( "tests/unit/**/*.html" ).filter(function( file ) {
			// disabling everything that doesn't (quite) work with PhantomJS for now
			// except for all|index|test, try to include more as we go
			return !( /(all|index|test|draggable|droppable|selectable|resizable|sortable|dialog|slider|datepicker|tabs|tabs_deprecated)\.html/ ).test( file );
		})
	},
	lint: {
		ui: "ui/*",
		grunt: "grunt.js",
		tests: "tests/unit/**/*.js"
	},
	csslint: {
		base_theme: {
			src: "themes/base/*.css",
			rules: {
				"import": false,
				"overqualified-elements": 2
			}
		}
	},
	jshint: {
		options: {
			curly: true,
			eqeqeq: true,
			immed: true,
			latedef: true,
			newcap: true,
			noarg: true,
			sub: true,
			undef: true,
			eqnull: true
		},
		grunt: {
			options: {
				node: true
			},
			globals: {
				task: true,
				config: true,
				file: true,
				log: true,
				template: true
			}
		},
		ui: {
			options: {
				browser: true
			},
			globals: {
				jQuery: true
			}
		},
		tests: {
			options: {
				jquery: true
			},
			globals: {
				module: true,
				test: true,
				ok: true,
				equal: true,
				deepEqual: true,
				QUnit: true
			}
		}
	}
});

task.registerMultiTask( "copy", "Copy files to destination folder and replace @VERSION with pkg.version", function() {
	function replaceVersion( source ) {
		return source.replace( "@VERSION", config( "pkg.version" ) );
	}
	var files = file.expand( this.file.src );
	var target = this.file.dest + "/";
	var strip = this.data.strip;
	if ( typeof strip === "string" ) {
		strip = new RegExp( "^" + template.process( strip, config() ).replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" ) );
	}
	files.forEach(function( fileName ) {
		var targetFile = strip ? fileName.replace( strip, "" ) : fileName;
		file.copy( fileName, target + targetFile, replaceVersion );
	});
	log.writeln( "Copied " + files.length + " files." );
	var renameCount = 0;
	for ( var fileName in this.data.renames ) {
		renameCount += 1;
		file.copy( fileName, target + template.process( this.data.renames[ fileName ], config() ) );
	}
	if ( renameCount ) {
		log.writeln( "Renamed " + renameCount + " files." );
	}
});


task.registerMultiTask( "zip", "Create a zip file for release", function() {
	var done = this.async();
	// TODO switch back to adm-zip for better cross-platform compability once it actually works
	// 0.1.2 doesn't compress properly (or at all)

	// var files = file.expand(this.file.src);
	// log.writeln("Creating zip file " + this.file.dest);

	// var fs = require('fs');
	// var AdmZip = require('adm-zip');
	// var zip = new AdmZip();
	// files.forEach(function(file) {
	//   log.verbose.writeln('Zipping ' + file);
	//   // rewrite file names from dist folder (created by build), drop the /dist part
	//   zip.addFile(file.replace(/^dist/, ''), fs.readFileSync(file));
	// });
	// zip.writeZip(this.file.dest);
	// log.writeln("Wrote " + files.length + " files to " + this.file.dest);

	var dest = this.file.dest;
	var src = template.process( this.file.src, config() );
	utils.spawn({
		cmd: "zip",
		args: [ "-r", dest, src ],
		opts: {
			cwd: 'dist'
		}
	}, function( err, result ) {
		if ( err ) {
			log.error( err );
			done();
			return;
		}
		log.writeln( "Zipped " + dest );
		done();
	});
});

task.registerMultiTask( "csslint", "Lint CSS files with csslint", function() {
	var csslint = require( "csslint" ).CSSLint;
	var files = file.expand( this.file.src );
	var ruleset = {};
	csslint.getRules().forEach(function( rule ) {
		ruleset[ rule.id ] = 1;
	});
	for ( var rule in this.data.rules ) {
		if ( !this.data.rules[ rule ] ) {
			delete ruleset[rule];
		} else {
			ruleset[ rule ] = this.data.rules[ rule ];
		}
	}
	var hadErrors = 0;
	files.forEach(function( filepath ) {
		log.writeln( "Linting " + filepath );
		var result = csslint.verify( file.read( filepath ), ruleset );
		result.messages.forEach(function( message ) {
			log.writeln( "[".red + ( "L" + message.line ).yellow + ":".red + ( "C" + message.col ).yellow + "]".red );
			log[ message.type === "error" ? "error" : "writeln" ]( message.message + " " + message.rule.desc + " (" + message.rule.id + ")" );
		});
		if ( result.messages.length ) {
			hadErrors += 1;
		}
	});
	if (hadErrors) {
		return false;
	}
	log.writeln( "Lint free" );
});

task.registerMultiTask( "css_min", "Minify CSS files with Sqwish.", function() {
	var max = task.helper( "concat", file.expand( this.file.src ) );
	var min = require( "sqwish" ).minify( max, false );
	file.write( this.file.dest, min );
	log.writeln( "File '" + this.file.dest + "' created." );
	task.helper( "min_max_info", min, max );
});

task.registerMultiTask( "md5", "Create list of md5 hashes for CDN uploads", function() {
	// remove dest file before creating it, to make sure itself is not included
	if ( require( "path" ).existsSync( this.file.dest ) ) {
		require( "fs" ).unlinkSync( this.file.dest );
	}
	var crypto = require( "crypto" );
	var dir = this.file.src + "/";
	var hashes = [];
	file.expand( dir + "**/*" ).forEach(function( fileName ) {
		var hash = crypto.createHash( "md5" );
		hash.update( file.read( fileName ) );
		hashes.push( fileName.replace( dir, "" ) + " " + hash.digest( "hex" ) );
	});
	file.write( this.file.dest, hashes.join( "\n" ) + "\n" );
	log.writeln( "Wrote " + this.file.dest + " with " + hashes.length + " hashes" );
});

task.registerTask( "download_themes", function() {
	// var AdmZip = require('adm-zip');
	var fs = require( "fs" );
	var request = require( "request" );
	var done = this.async();
	var themes = file.read( "build/themes" ).split(",");
	var requests = 0;
	file.mkdir( "dist/tmp" );
	themes.forEach(function( theme, index ) {
		requests += 1;
		file.mkdir( "dist/tmp/" + index );
		var zipFileName = "dist/tmp/" + index + ".zip";
		var out = fs.createWriteStream( zipFileName );
		out.on( "close", function() {
			log.writeln( "done downloading " + zipFileName );
			// TODO AdmZip produces "crc32 checksum failed", need to figure out why
			// var zip = new AdmZip(zipFileName);
			// zip.extractAllTo('dist/tmp/' + index + '/');
			// until then, using cli unzip...
			utils.spawn({
				cmd: "unzip",
				args: [ "-d", "dist/tmp/" + index, zipFileName ]
			}, function( err, result ) {
				log.writeln( "Unzipped " + zipFileName + ", deleting it now" );
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

task.registerTask( "copy_themes", function() {
	// each package includes the base theme, ignore that
	var filter = /themes\/base/;
	var files = file.expand( "dist/tmp/*/development-bundle/themes/**/*" ).filter(function( file ) {
		return !filter.test( file );
	});
	// TODO the template.process call shouldn't be necessary
	var target = "dist/" + template.process( config( "files.themes" ), config() ) + "/";
	files.forEach(function( fileName ) {
		var targetFile = fileName.replace( /dist\/tmp\/\d+\/development-bundle\//, "" ).replace( "jquery-ui-.custom", "jquery-ui.css" );
		file.copy( fileName, target + targetFile );
	});

	// copy minified base theme from regular release
	// TODO same as the one above
	var distFolder = "dist/" + template.process( config( "files.dist" ), config() );
	files = file.expand( distFolder + "/themes/base/**/*" );
	files.forEach(function( fileName ) {
		file.copy( fileName, target + fileName.replace( distFolder, "" ) );
	});
});

task.registerTask( "clean", function() {
	// TODO use node methods and keep the dir, only delete its content
	utils.spawn({
		cmd: "rm",
		args: [ "-rf", "dist" ]
	}, this.async());
});

// TODO merge with code in jQuery Core, share as grunt plugin/npm
// this here actually uses the provided filenames in the output
// the helpers should just be regular functions, no need to share those with the world
task.registerMultiTask( "compare_size", "Compare size of this branch to master", function() {
	var files = file.expand( this.file.src ),
		done = this.async(),
		sizecache = __dirname + "/dist/.sizecache.json",
		sources = {
			min: file.read( files[1] ),
			max: file.read( files[0] )
		},
		oldsizes = {},
		sizes = {};

	try {
		oldsizes = JSON.parse( file.read( sizecache ) );
	} catch( e ) {
		oldsizes = {};
	}

	// Obtain the current branch and continue...
	task.helper( "git_current_branch", function( err, branch ) {
		var key, diff;

		// Derived and adapted from Corey Frang's original `sizer`
		log.writeln( "sizes - compared to master" );

		sizes[ files[0] ] = sources.max.length;
		sizes[ files[1] ] = sources.min.length;
		sizes[ files[1] + ".gz" ] = task.helper( "gzip", sources.min ).length;

		for ( key in sizes ) {
			diff = oldsizes[ key ] && ( sizes[ key ] - oldsizes[ key ] );
			if ( diff > 0 ) {
				diff = "+" + diff;
			}
			console.log( "%s %s %s",
				task.helper("lpad",  sizes[ key ], 8 ),
				task.helper("lpad",  diff ? "(" + diff + ")" : "(-)", 8 ),
				key
			);
		}

		if ( branch === "master" ) {
			// If master, write to file - this makes it easier to compare
			// the size of your current code state to the master branch,
			// without returning to the master to reset the cache
			file.write( sizecache, JSON.stringify(sizes) );
		}
		done();
	});
});
task.registerHelper( "git_current_branch", function( done ) {
	utils.spawn({
		cmd: "git",
		args: [ "branch", "--no-color" ]
	}, function( err, result ) {
		var branch;

		result.split( "\n" ).forEach(function( branch ) {
			var matches = /^\* (.*)/.exec( branch );
			if ( matches !== null && matches.length && matches[ 1 ] ) {
				done( null, matches[ 1 ] );
			}
		});
	});
});
task.registerHelper( "lpad", function( str, len, chr ) {
	return ( Array( len + 1 ).join( chr || " " ) + str ).substr( -len );
});

task.registerTask("default", "lint csslint qunit build compare_size" );
task.registerTask("sizer", "concat:ui min:dist/jquery-ui.min.js compare_size" );
task.registerTask("build", "concat min css_min" );
task.registerTask("release", "build copy:dist copy:dist_min copy:dist_min_images copy:dist_css_min md5:dist zip:dist" );
task.registerTask("release_themes", "release download_themes copy_themes copy:themes md5:themes zip:themes" );
task.registerTask("release_cdn", "release_themes copy:cdn copy:cdn_min copy:cdn_i18n copy:cdn_i18n_min copy:cdn_min_images copy:cdn_themes md5:cdn zip:cdn" );
