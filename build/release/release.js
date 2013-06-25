#!/usr/bin/env node
/* global cat:true, cd:true, echo:true, exec:true, exit:true */

// Usage:
// stable release: node release.js
// pre-release: node release.js --pre-release {version}
// test run: node release.js --remote={repo}
// - repo: "/tmp/repo" (filesystem), "user/repo" (github), "http://mydomain/repo.git" (another domain)

"use strict";

var baseDir, downloadBuilder, repoDir, prevVersion, newVersion, nextVersion, tagTime, preRelease, repo,
	fs = require( "fs" ),
	path = require( "path" ),
	rnewline = /\r?\n/,
	branch = "master";

walk([
	bootstrap,

	section( "setting up repo" ),
	cloneRepo,
	checkState,

	section( "calculating versions" ),
	getVersions,
	confirm,

	section( "building release" ),
	buildReleaseBranch,
	buildPackage,

	section( "pushing tag" ),
	confirmReview,
	pushRelease,

	section( "updating branch version" ),
	updateBranchVersion,

	section( "pushing " + branch ),
	confirmReview,
	pushBranch,

	section( "generating changelog" ),
	generateChangelog,

	section( "gathering contributors" ),
	gatherContributors,

	section( "updating trac" ),
	updateTrac,
	confirm
]);





function cloneRepo() {
	echo( "Cloning " + repo.cyan + "..." );
	git( "clone " + repo + " " + repoDir, "Error cloning repo." );
	cd( repoDir );

	echo( "Checking out " + branch.cyan + " branch..." );
	git( "checkout " + branch, "Error checking out branch." );
	echo();

	echo( "Installing dependencies..." );
	if ( exec( "npm install" ).code !== 0 ) {
		abort( "Error installing dependencies." );
	}
	echo();
}

function checkState() {
	echo( "Checking AUTHORS.txt..." );
	var result, lastActualAuthor,
		lastListedAuthor = cat( "AUTHORS.txt" ).trim().split( rnewline ).pop();

	result = exec( "grunt authors", { silent: true });
	if ( result.code !== 0 ) {
		abort( "Error getting list of authors." );
	}
	lastActualAuthor = result.output.split( rnewline ).splice( -4, 1 )[ 0 ];

	if ( lastListedAuthor !== lastActualAuthor ) {
		echo( "Last listed author is " + lastListedAuthor.red + "." );
		echo( "Last actual author is " + lastActualAuthor.green + "." );
		abort( "Please update AUTHORS.txt." );
	}

	echo( "Last listed author (" + lastListedAuthor.cyan + ") is correct." );
}

function getVersions() {
	// prevVersion, newVersion, nextVersion are defined in the parent scope
	var parts, major, minor, patch,
		currentVersion = readPackage().version;

	echo( "Validating current version..." );
	if ( currentVersion.substr( -3, 3 ) !== "pre" ) {
		echo( "The current version is " + currentVersion.red + "." );
		abort( "The version must be a pre version." );
	}

	if ( preRelease ) {
		newVersion = preRelease;
		// Note: prevVersion is not currently used for pre-releases.
		prevVersion = nextVersion = currentVersion;
	} else {
		newVersion = currentVersion.substr( 0, currentVersion.length - 3 );
		parts = newVersion.split( "." );
		major = parseInt( parts[ 0 ], 10 );
		minor = parseInt( parts[ 1 ], 10 );
		patch = parseInt( parts[ 2 ], 10 );

		if ( minor === 0 && patch === 0 ) {
			abort( "This script is not smart enough to handle major release (eg. 2.0.0)." );
		} else if ( patch === 0 ) {
			prevVersion = git( "for-each-ref --count=1 --sort=-authordate --format='%(refname:short)' refs/tags/" + [ major, minor - 1 ].join( "." ) + "*" ).trim();
		} else {
			prevVersion = [ major, minor, patch - 1 ].join( "." );
		}

		nextVersion = [ major, minor, patch + 1 ].join( "." ) + "pre";
	}

	echo( "We are going from " + prevVersion.cyan + " to " + newVersion.cyan + "." );
	echo( "After the release, the version will be " + nextVersion.cyan + "." );
}

function buildReleaseBranch() {
	var pkg;

	echo( "Creating " + "release".cyan + " branch..." );
	git( "checkout -b release", "Error creating release branch." );
	echo();

	echo( "Updating package.json..." );
	pkg = readPackage();
	pkg.version = newVersion;
	pkg.author.url = pkg.author.url.replace( "master", newVersion );
	pkg.licenses.forEach(function( license ) {
		license.url = license.url.replace( "master", newVersion );
	});
	writePackage( pkg );

	echo( "Generating manifest files..." );
	if ( exec( "grunt manifest" ).code !== 0 ) {
		abort( "Error generating manifest files." );
	}
	echo();

	echo( "Committing release artifacts..." );
	git( "add *.jquery.json", "Error adding manifest files to git." );
	git( "commit -am 'Tagging the " + newVersion + " release.'",
		"Error committing release changes." );
	echo();

	echo( "Tagging release..." );
	git( "tag " + newVersion, "Error tagging " + newVersion + "." );
	tagTime = git( "log -1 --format='%ad'", "Error getting tag timestamp." ).trim();
}

function buildPackage( callback ) {
	if( preRelease ) {
		return buildPreReleasePackage( callback );
	} else {
		return buildCDNPackage( callback );
	}
}

function buildPreReleasePackage( callback ) {
	var build, files, jqueryUi, packer, target, targetZip;

	echo( "Build pre-release Package" );

	jqueryUi = new downloadBuilder.JqueryUi( path.resolve( "." ) );
	build = new downloadBuilder.Builder( jqueryUi, ":all:" );
	packer = new downloadBuilder.Packer( build, null, {
		addTests: true,
		bundleSuffix: "",
		skipDocs: true,
		skipTheme: true
	});
	target = "../" + jqueryUi.pkg.name + "-" + jqueryUi.pkg.version;
	targetZip = target + ".zip";

	return walk([
		function( callback ) {
			echo( "Building release files" );
			packer.pack(function( error, _files ) {
				if( error ) {
					abort( error.stack );
				}
				files = _files.map(function( file ) {

					// Strip first path
					file.path = file.path.replace( /^[^\/]*\//, "" );
					return file;

				}).filter(function( file ) {

					// Filter development-bundle content only
					return (/^development-bundle/).test( file.path );
				}).map(function( file ) {

					// Strip development-bundle
					file.path = file.path.replace( /^development-bundle\//, "" );
					return file;

				});
				return callback();
			});
		},
		function() {
			downloadBuilder.util.createZip( files, targetZip, function( error ) {
				if ( error ) {
					abort( error.stack );
				}
				echo( "Built zip package at " + path.relative( "../..", targetZip ).cyan );
				return callback();
			});
		}
	]);
}

function buildCDNPackage( callback ) {
	var build, output, target, targetZip,
		add = function( file ) {
			output.push( file );
		},
		jqueryUi = new downloadBuilder.JqueryUi( path.resolve( "." ) ),
		themeGallery = downloadBuilder.themeGallery( jqueryUi );

	echo( "Build CDN Package" );

	build = new downloadBuilder.Builder( jqueryUi, ":all:" );
	output = [];
	target = "../" + jqueryUi.pkg.name + "-" + jqueryUi.pkg.version + "-cdn";
	targetZip = target + ".zip";

	[ "AUTHORS.txt", "MIT-LICENSE.txt", "package.json" ].map(function( name ) {
		return build.get( name );
	}).forEach( add );

	// "ui/*.js"
	build.componentFiles.filter(function( file ) {
		return (/^ui\//).test( file.path );
	}).forEach( add );

	// "ui/*.min.js"
	build.componentMinFiles.filter(function( file ) {
		return (/^ui\//).test( file.path );
	}).forEach( add );

	// "i18n/*.js"
	build.i18nFiles.rename( /^ui\//, "" ).forEach( add );
	build.i18nMinFiles.rename( /^ui\//, "" ).forEach( add );
	build.bundleI18n.into( "i18n/" ).forEach( add );
	build.bundleI18nMin.into( "i18n/" ).forEach( add );

	build.bundleJs.forEach( add );
	build.bundleJsMin.forEach( add );

	walk( themeGallery.map(function( theme ) {
		return function( callback ) {
			var themeCssOnlyRe, themeDirRe,
				folderName = theme.folderName(),
				packer = new downloadBuilder.Packer( build, theme, {
					skipDocs: true
				});
			// TODO improve code by using custom packer instead of download packer (Packer)
			themeCssOnlyRe = new RegExp( "development-bundle/themes/" + folderName + "/jquery.ui.theme.css" );
			themeDirRe = new RegExp( "css/" + folderName );
			packer.pack(function( error, files ) {
				if ( error ) {
					abort( error.stack );
				}
				// Add theme files.
				files
					// Pick only theme files we need on the bundle.
					.filter(function( file ) {
						if ( themeCssOnlyRe.test( file.path ) || themeDirRe.test( file.path ) ) {
							return true;
						}
						return false;
					})
					// Convert paths the way bundle needs
					.map(function( file ) {
						file.path = file.path

							// Remove initial package name eg. "jquery-ui-1.10.0.custom"
							.split( "/" ).slice( 1 ).join( "/" )

							.replace( /development-bundle\/themes/, "css" )
							.replace( /css/, "themes" )

							// Make jquery-ui-1.10.0.custom.css into jquery-ui.css, or jquery-ui-1.10.0.custom.min.css into jquery-ui.min.css
							.replace( /jquery-ui-.*?(\.min)*\.css/, "jquery-ui$1.css" );

						return file;
					}).forEach( add );
				return callback();
			});
		};
	}).concat([function() {
		var crypto = require( "crypto" );

		// Create MD5 manifest
		output.push({
			path: "MANIFEST",
			data: output.sort(function( a, b ) {
				return a.path.localeCompare( b.path );
			}).map(function( file ) {
				var md5 = crypto.createHash( "md5" );
				md5.update( file.data );
				return file.path + " " + md5.digest( "hex" );
			}).join( "\n" )
		});

		downloadBuilder.util.createZip( output, targetZip, function( error ) {
			if ( error ) {
				abort( error.stack );
			}
			echo( "Built zip CDN package at " + path.relative( "../..", targetZip ).cyan );
			return callback();
		});
	}]));
}

function pushRelease() {
	echo( "Pushing release to GitHub..." );
	git( "push --tags", "Error pushing tags to GitHub." );
}

function updateBranchVersion() {
	// Pre-releases don't change the master version
	if ( preRelease ) {
		return;
	}

	var pkg;

	echo( "Checking out " + branch.cyan + " branch..." );
	git( "checkout " + branch, "Error checking out " + branch + " branch." );

	echo( "Updating package.json..." );
	pkg = readPackage();
	pkg.version = nextVersion;
	writePackage( pkg );

	echo( "Committing version update..." );
	git( "commit -am 'Updating the " + branch + " version to " + nextVersion + ".'",
		"Error committing package.json." );
}

function pushBranch() {
	// Pre-releases don't change the master version
	if ( preRelease ) {
		return;
	}

	echo( "Pushing " + branch.cyan + " to GitHub..." );
	git( "push", "Error pushing to GitHub." );
}

function generateChangelog() {
	if ( preRelease ) {
		return;
	}

	var commits,
		changelogPath = baseDir + "/changelog",
		changelog = cat( "build/release/changelog-shell" ) + "\n",
		fullFormat = "* %s (TICKETREF, [%h](http://github.com/jquery/jquery-ui/commit/%H))";

	changelog = changelog.replace( "{title}", "jQuery UI " + newVersion + " Changelog" );

	echo ( "Adding commits..." );
	commits = gitLog( fullFormat );

	echo( "Adding links to tickets..." );
	changelog += commits
		// Add ticket references
		.map(function( commit ) {
			var tickets = [];
			commit.replace( /Fixe[sd] #(\d+)/g, function( match, ticket ) {
				tickets.push( ticket );
			});
			return tickets.length ?
				commit.replace( "TICKETREF", tickets.map(function( ticket ) {
					return "[#" + ticket + "](http://bugs.jqueryui.com/ticket/" + ticket + ")";
				}).join( ", " ) ) :
				// Leave TICKETREF token in place so it's easy to find commits without tickets
				commit;
		})
		// Sort commits so that they're grouped by component
		.sort()
		.join( "\n" ) + "\n";

	echo( "Adding Trac tickets..." );
	changelog += trac( "/query?milestone=" + newVersion + "&resolution=fixed" +
		"&col=id&col=component&col=summary&order=component" ) + "\n";

	fs.writeFileSync( changelogPath, changelog );
	echo( "Stored changelog in " + changelogPath.cyan + "." );
}

function gatherContributors() {
	if ( preRelease ) {
		return;
	}

	var contributors,
		contributorsPath = baseDir + "/contributors";

	echo( "Adding committers and authors..." );
	contributors = gitLog( "%aN%n%cN" );

	echo( "Adding reporters and commenters from Trac..." );
	contributors = contributors.concat(
		trac( "/report/22?V=" + newVersion + "&max=-1" )
			.split( rnewline )
			// Remove header and trailing newline
			.slice( 1, -1 ) );

	echo( "Sorting contributors..." );
	contributors = unique( contributors ).sort(function( a, b ) {
		return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
	});

	echo ( "Adding people thanked in commits..." );
	contributors = contributors.concat(
		gitLog( "%b%n%s" ).filter(function( line ) {
			return (/thank/i).test( line );
		}));

	fs.writeFileSync( contributorsPath, contributors.join( "\n" ) );
	echo( "Stored contributors in " + contributorsPath.cyan + "." );
}

function updateTrac() {
	echo( newVersion.cyan + " was tagged at " + tagTime.cyan + "." );
	if ( !preRelease ) {
		echo( "Close the " + newVersion.cyan + " Milestone." );
	}
	echo( "Create the " + newVersion.cyan + " Version." );
	echo( "When Trac asks for date and time, match the above. Should only change minutes and seconds." );
	echo( "Create a Milestone for the next minor release." );
}





// ===== HELPER FUNCTIONS ======================================================

function git( command, errorMessage ) {
	var result = exec( "git " + command );
	if ( result.code !== 0 ) {
		abort( errorMessage );
	}

	return result.output;
}

function gitLog( format ) {
	var result = exec( "git log " + prevVersion + ".." + newVersion + " " +
		"--format='" + format + "'",
		{ silent: true });

	if ( result.code !== 0 ) {
		abort( "Error getting git log." );
	}

	result = result.output.split( rnewline );
	if ( result[ result.length - 1 ] === "" ) {
		result.pop();
	}

	return result;
}

function trac( path ) {
	var result = exec( "curl -s 'http://bugs.jqueryui.com" + path + "&format=tab'",
		{ silent: true });

	if ( result.code !== 0 ) {
		abort( "Error getting Trac data." );
	}

	return result.output;
}

function unique( arr ) {
	var obj = {};
	arr.forEach(function( item ) {
		obj[ item ] = 1;
	});
	return Object.keys( obj );
}

function readPackage() {
	return JSON.parse( fs.readFileSync( repoDir + "/package.json" ) );
}

function writePackage( pkg ) {
	fs.writeFileSync( repoDir + "/package.json",
		JSON.stringify( pkg, null, "\t" ) + "\n" );
}

function bootstrap( fn ) {
	getRemote(function( remote ) {
		if ( (/:/).test( remote ) || fs.existsSync( remote ) ) {
			repo = remote;
		} else {
			repo = "git@github.com:" + remote + ".git";
		}
		_bootstrap( fn );
	});
}

function getRemote( fn ) {
	var matches, remote;

	console.log( "Determining remote repo..." );
	process.argv.forEach(function( arg ) {
		matches = /--remote=(.+)/.exec( arg );
		if ( matches ) {
			remote = matches[ 1 ];
		}
	});

	if ( remote ) {
		fn( remote );
		return;
	}

	console.log();
	console.log( "     !!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
	console.log( "     !!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
	console.log( "     !!                        !!" );
	console.log( "     !! Using jquery/jquery-ui !!" );
	console.log( "     !!                        !!" );
	console.log( "     !!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
	console.log( "     !!!!!!!!!!!!!!!!!!!!!!!!!!!!" );
	console.log();
	console.log( "Press enter to continue, or ctrl+c to cancel." );
	prompt(function() {
		fn( "jquery/jquery-ui" );
	});
}

function _bootstrap( fn ) {
	console.log( "Determining release type..." );
	preRelease = process.argv.indexOf( "--pre-release" );
	if ( preRelease !== -1 ) {
		preRelease = process.argv[ preRelease + 1 ];
		console.log( "pre-release" );
	} else {
		preRelease = null;
		console.log( "stable release" );
	}

	console.log( "Determining directories..." );
	baseDir = process.cwd() + "/__release";
	repoDir = baseDir + "/repo";

	if ( fs.existsSync( baseDir ) ) {
		console.log( "The directory '" + baseDir + "' already exists." );
		console.log( "Aborting." );
		process.exit( 1 );
	}

	console.log( "Creating directory..." );
	fs.mkdirSync( baseDir );

	console.log( "Installing dependencies..." );
	require( "child_process" ).exec( "npm install shelljs colors download.jqueryui.com@1.10.3-4", function( error ) {
		if ( error ) {
			console.log( error );
			return process.exit( 1 );
		}

		require( "shelljs/global" );
		require( "colors" );
		downloadBuilder = require( "download.jqueryui.com" );

		fn();
	});
}

function section( name ) {
	return function() {
		echo();
		echo( "##" );
		echo( "## " + name.toUpperCase().magenta );
		echo( "##" );
		echo();
	};
}

function prompt( fn ) {
	process.stdin.once( "data", function( chunk ) {
		process.stdin.pause();
		fn( chunk.toString().trim() );
	});
	process.stdin.resume();
}

function confirm( fn ) {
	echo( "Press enter to continue, or ctrl+c to cancel.".yellow );
	prompt( fn );
}

function confirmReview( fn ) {
	echo( "Please review the output and generated files as a sanity check.".yellow );
	confirm( fn );
}

function abort( msg ) {
	echo( msg.red );
	echo( "Aborting.".red );
	exit( 1 );
}

function walk( methods ) {
	var method = methods.shift();

	function next() {
		if ( methods.length ) {
			walk( methods );
		}
	}

	if ( !method.length ) {
		method();
		next();
	} else {
		method( next );
	}
}
