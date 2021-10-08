"use strict";

module.exports = function( Release ) {

var crypto = require( "crypto" );
var shell = require( "shelljs" ),
	path = require( "path" ),
	fs = require( "fs" );

function replaceAtVersion() {
	console.log( "Replacing @VERSION..." );
	var matches = [];

	function recurse( folder ) {
		fs.readdirSync( folder ).forEach( function( fileName ) {
			var content,
				fullPath = folder + "/" + fileName;
			if ( fs.statSync( fullPath ).isDirectory() ) {
				recurse( fullPath );
				return;
			}
			content = fs.readFileSync( fullPath, {
				encoding: "utf-8"
			} );
			if ( !/@VERSION/.test( content ) ) {
				return;
			}
			matches.push( fullPath );
			fs.writeFileSync( fullPath, content.replace( /@VERSION/g, Release.newVersion ) );
		} );
	}

	[ "ui", "themes" ].forEach( recurse );

	console.log( "Replaced @VERSION in " + matches.length + " files." );

	return matches;
}

function removeExternals( packager ) {
	Object.keys( packager.builtFiles ).forEach( function( filepath ) {
		if ( /^external\//.test( filepath ) ) {
			delete packager.builtFiles[ filepath ];
		}
	} );
}

function addManifest( packager ) {
	var output = packager.builtFiles;
	output.MANIFEST = Object.keys( output ).sort( function( a, b ) {
		return a.localeCompare( b );
	} ).map( function( filepath ) {
		var md5 = crypto.createHash( "md5" );
		md5.update( output[ filepath ] );
		return filepath + " " + md5.digest( "hex" );
	} ).join( "\n" );
}

function buildCDNPackage( callback ) {
	console.log( "Building CDN package" );
	var JqueryUi = require( "download.jqueryui.com/lib/jquery-ui" );
	var PackageWithoutThemes = require( "download.jqueryui.com/lib/package-1-13" );
	var PackageOfThemes = require( "download.jqueryui.com/lib/package-1-13-themes" );
	var Packager = require( "node-packager" );

	// PackageOfThemes doesn't contain JS files, PackageWithoutThemes doesn't contain themes;
	// we need both.
	function Package() {

		// PackageOfThemes invokes PackageWithoutThemes's constructor in its own so we don't
		// need to do it by ourselves; we just need to handle prototypes that way.
		PackageOfThemes.apply( this, arguments );
	}

	Object.assign( Package.prototype, PackageWithoutThemes.prototype, PackageOfThemes.prototype );

	var jqueryUi = new JqueryUi( path.resolve( "." ) );
	var target = fs.createWriteStream( "../" + jqueryUi.pkg.name + "-" + jqueryUi.pkg.version +
		"-cdn.zip" );
	var packager = new Packager( jqueryUi.files().cache, Package, {
		components: jqueryUi.components().map( function( component ) {
			return component.name;
		} ),
		jqueryUi: jqueryUi,
		themeVars: null
	} );
	packager.ready
		.then( function() {
			removeExternals( packager );
			addManifest( packager );
			packager.toZip( target, {
				basedir: ""
			}, function( error ) {
				if ( error ) {
					Release.abort( "Failed to zip the CDN package", error );
				}
				callback();
			} );
		} )
		.catch( function( error ) {
			Release.abort( "Failed to create the CDN package", error );
		} );
}

Release.define( {
	npmPublish: true,
	issueTracker: "github",
	changelogShell: function() {
		var monthNames = [ "January", "February", "March", "April", "May", "June", "July",
				"August", "September", "October", "November", "December" ],
			now = new Date();
		return "<script>{\n\t\"title\": \"jQuery UI " + Release.newVersion + " Changelog\"\n" +
			"}</script>\n\nReleased on " + monthNames[ now.getMonth() ] + " " + now.getDate() +
			", " + now.getFullYear() + "\n\n";
	},
	generateArtifacts: function( fn ) {
		var files = replaceAtVersion();

		buildCDNPackage( function copyCdnFiles() {
			var zipFile = shell.ls( "../jquery*-cdn.zip" )[ 0 ],
				tmpFolder = "../tmp-zip-output",
				unzipCommand = "unzip -o " + zipFile + " -d " + tmpFolder;

			console.log( "Unzipping for dist/cdn copies" );
			shell.mkdir( "-p", tmpFolder );
			Release.exec( {
				command: unzipCommand,
				silent: true
			}, "Failed to unzip cdn files" );

			shell.mkdir( "-p", "dist/cdn" );
			shell.cp( tmpFolder + "/jquery-ui*.js", "dist/cdn" );
			shell.cp( "-r", tmpFolder + "/themes", "dist/cdn" );
			fn( files );
		} );
	}
} );

};

module.exports.dependencies = [
	"download.jqueryui.com@2.2.7",
	"node-packager@0.0.6",
	"shelljs@0.8.4"
];
