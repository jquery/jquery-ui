#!/usr/bin/env node

var baseDir, repoDir, prevVersion, newVersion, nextVersion, tagTime,
	fs = require( "fs" ),
	rnewline = /\r?\n/,
	repo = "git@github.com:jquery/jquery-ui.git",
	branch = "master";

walk([
	bootstrap,

	section( "setting up repo" ),
	cloneRepo,
	checkState,

	section( "calculating versions" ),
	getVersions,
	confirm,

	section( "tagging release" ),
	tagRelease,
	confirm,
	pushRelease,

	section( "updating branch version" ),
	updateBranchVersion,
	confirm,
	pushBranch,

	section( "generating changelog" ),
	generateChangelog,

	section( "gathering contributors" ),
	gatherContributors,

	section( "updating trac" ),
	updateTrac,
	confirm,

	section( "building release" ),
	buildRelease
]);





function cloneRepo() {
	if ( test( "-d", baseDir ) ) {
		abort( "The directory '" + baseDir + "' already exists." );
	}

	echo( "Cloning " + repo + "..." );
	git( "clone " + repo + " " + repoDir, "Error cloning repo." );
	cd( repoDir );

	echo( "Checking out " + branch + " branch..." );
	git( "checkout " + branch, "Error checking out branch." );

	echo( "Installing dependencies..." );
	if ( exec( "npm install" ).code !== 0 ) {
		abort( "Error installing dependencies." );
	}
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
		echo( "Last listed author is " + lastListedAuthor + "." );
		echo( "Last actual author is " + lastActualAuthor + "." );
		abort( "Please update AUTHORS.txt." );
	}

	echo( "Last listed author (" + lastListedAuthor + ") is correct." );
}

function getVersions() {
	// prevVersion, newVersion, nextVersion are defined in the parent scope
	var parts, major, minor, patch,
		currentVersion = readPackage().version;

	echo( "Validating current version..." );
	if ( currentVersion.substr( -3, 3 ) !== "pre" ) {
		echo( "The current version is " + currentVersion + "." );
		abort( "The version must be a pre version." );
	}

	newVersion = currentVersion.substr( 0, currentVersion.length - 3 );
	parts = newVersion.split( "." );
	major = parseInt( parts[ 0 ], 10 );
	minor = parseInt( parts[ 1 ], 10 );
	patch = parseInt( parts[ 2 ], 10 );
	prevVersion = patch === 0 ?
		[ major, minor - 1, 0 ].join( "." ) :
		[ major, minor, patch - 1 ].join( "." );
	// TODO: Remove version hack after 1.9.0 release
	if ( prevVersion === "1.8.0" ) {
		prevVersion = "1.8";
	}
	nextVersion = [ major, minor, patch + 1 ].join( "." ) + "pre";

	echo( "We are going from " + prevVersion + " to " + newVersion + "." );
	echo( "After the release, the version will be " + nextVersion + "." );
}

function tagRelease() {
	var pkg;

	echo( "Creating release branch..." );
	git( "checkout -b release", "Error creating release branch." );

	echo( "Updating package.json..." );
	pkg = readPackage();
	pkg.version = newVersion;
	pkg.licenses.forEach(function( license ) {
		license.url = license.url.replace( "master", newVersion );
	});
	writePackage( pkg );

	echo( "Generating manifest files..." );
	if ( exec( "grunt manifest" ).code !== 0 ) {
		abort( "Error generating manifest files." );
	}

	echo( "Committing release artifacts..." );
	git( "add *.jquery.json", "Error adding manifest files to git." );
	git( "commit -am 'Tagging the " + newVersion + " release.'",
		"Error committing release changes." );

	echo( "Tagging release..." );
	git( "tag " + newVersion, "Error tagging " + newVersion + "." );
	tagTime = git( "log -1 --format='%ad'", "Error getting tag timestamp." ).trim();

	echo();
	echo( "Please review the output and generated files as a sanity check." );
}

function pushRelease() {
	echo( "Pushing release to GitHub..." );
	git( "push --tags", "Error pushing tags to GitHub." );
}

function updateBranchVersion() {
	var pkg;

	echo( "Checking out " + branch + " branch..." );
	git( "checkout " + branch, "Error checking out " + branch + " branch." );

	echo( "Updating package.json..." );
	pkg = readPackage();
	pkg.version = nextVersion;
	writePackage( pkg );

	echo( "Committing version update..." );
	git( "commit -am 'Updating the " + branch + " version to " + nextVersion + ".'",
		"Error committing package.json." );

	echo();
	echo( "Please review the output and generated files as a sanity check." );
}

function pushBranch() {
	echo( "Pushing " + branch + " to GitHub..." );
	git( "push", "Error pushing to GitHub." );
}

function generateChangelog() {
	var commits,
		changelogPath = baseDir + "/changelog",
		changelog = cat( "build/release/changelog-shell" ) + "\n",
		fullFormat = "* %s (TICKETREF, [http://github.com/jquery/jquery-ui/commit/%H %h])";

	echo ( "Adding commits..." );
	commits = gitLog( fullFormat );

	echo( "Adding links to tickets..." );
	changelog += commits
		// Add ticket references
		.map(function( commit ) {
			var tickets = [];
			// TODO: Don't use .replace() since we're not actually replacing
			commit.replace( /Fixe[sd] #(\d+)/g, function( match, ticket ) {
				tickets.push( ticket );
			});
			return tickets.length ?
				commit.replace( "TICKETREF", tickets.map(function( ticket ) {
					return "[http://bugs.jqueryui.com/ticket/" + ticket + " #" + ticket + "]";
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
	echo( "Stored changelog in " + changelogPath + "." );
}

function gatherContributors() {
	var contributors,
		contributorsPath = baseDir + "/contributors";

	echo( "Adding committers and authors..." );
	contributors = gitLog( "%aN%n%cN" );

	echo( "Adding reporters and commenters from Trac..." );
	contributors = contributors.concat(
		trac( "/report/22?V=" + newVersion + "&max=-1" )
			.split( rnewline )
			.slice( 1, -1 ) );

	echo( "Sorting contributors..." );
	contributors = unique( contributors ).sort(function( a, b ) {
		return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
	});

	echo ( "Adding people thanked in commits..." );
	contributors = contributors.concat(
		gitLog( "%b%n%s" ).filter(function( line ) {
			return /thank/i.test( line );
		}));

	fs.writeFileSync( contributorsPath, contributors.join( "\n" ) );
	echo( "Stored contributors in " + contributorsPath + "." );
}

function updateTrac() {
	echo( newVersion + " was tagged at " + tagTime + "." );
	echo( "Close the " + newVersion + " Milestone with the above date and time." );
	echo( "Create the " + newVersion + " Version with the above date and time." );
	echo( "Create a Milestone for the next minor release." );
}

function buildRelease() {
	echo( "Checking out " + newVersion + "..." );
	git( "checkout " + newVersion, "Error checking out " + newVersion + "." );

	echo( "Building release..." );
	if ( exec( "grunt release" ).code !== 0 ) {
		abort( "Error building release." );
	}
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
	require( "child_process" ).exec( "npm root -g", function( error, stdout ) {
		if ( error ) {
			console.log( error );
			return process.exit( 1 );
		}

		var rootDir = stdout.trim();
		require( rootDir + "/shelljs/global" );

		baseDir = pwd() + "/__release";
		repoDir = baseDir + "/repo";

		fn();
	});
}

function section( name ) {
	var line = new Array( name.length + 5 ).join( "-" );
	return function() {
		echo();
		// https://github.com/arturadib/shelljs/issues/20
		console.log( line );
		echo( "| " + name.toUpperCase() + " |" );
		console.log( line );
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
	echo( "Press enter to continue, or ctrl+c to cancel." );
	prompt( fn );
}

function abort( msg ) {
	echo( msg );
	echo( "Aborting." );
	exit( 1 );
}

function walk( methods ) {
	var method = methods.shift();

	function next( error ) {
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
