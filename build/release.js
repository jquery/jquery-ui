module.exports = function( Release ) {

var shell = require( "shelljs" ),
	path = require( "path" );

function buildPreReleasePackage( callback ) {
	var builder, files, jqueryUi, packer, target,
		downloadBuilder = require( "download.jqueryui.com" );
	jqueryUi = new downloadBuilder.JqueryUi( path.resolve( "." ) );
	builder = new downloadBuilder.Builder( jqueryUi, ":all:" );
	packer = new downloadBuilder.Packer( builder, null, {
		addTests: true,
		bundleSuffix: "",
		skipDocs: true,
		skipTheme: true
	});
	target = "../" + jqueryUi.pkg.name + "-" + jqueryUi.pkg.version + "-cdn.zip";

	console.log( "Building release files" );
	packer.pack(function( error, _files ) {
		if ( error ) {
			Release.abort( "Failed packing pre-release package", error );
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

		downloadBuilder.util.createZip( files, target, function( error ) {
			if ( error ) {
				Release.abort( "Failed create pre-release zip", error );
			}
			console.log( "Built zip package at " + path.relative( "../..", target ).cyan );
			return callback();
		});
	});
}

function buildCDNPackage( callback ) {
	console.log( "Building CDN package" );
	var downloadBuilder = require( "download.jqueryui.com" ),
		jqueryUi = new downloadBuilder.JqueryUi( path.resolve( "." ) ),
		builder = new downloadBuilder.Builder( jqueryUi, ":all:" ),
		packer = new downloadBuilder.ThemesPacker( builder, {
			includeJs: true
		}),
		target = "../" + jqueryUi.pkg.name + "-" + jqueryUi.pkg.version + "-cdn.zip";

	// Zip dir structure must be flat, override default base folder
	packer.basedir = "";
	packer.zipTo( target, function( error ) {
		if ( error ) {
			Release.abort( "Failed to zip CDN package", error );
		}
		callback();
	});
}

Release.define({
	issueTracker: "trac",
	contributorReportId: 22,
	changelogShell: function() {
		var monthNames = [ "January", "February", "March", "April", "May", "June", "July",
			"August", "September", "October", "November", "December" ],
			now = new Date();
		return "<script>{\n\t\"title\": \"jQuery UI " + Release.newVersion + " Changelog\"\n" +
			"}</script>\n\nReleased on " + monthNames[ now.getMonth() ] + " " + now.getDate() + ", " + now.getFullYear() + "\n\n";
	},
	generateArtifacts: function( fn ) {
		var manifestFiles;
		function copyCdnFiles() {
			var zipFile = shell.ls( "../jquery*-cdn.zip" )[ 0 ],
				tmpFolder = "../tmp-zip-output",
				unzipCommand = "unzip -o " + zipFile + " -d " + tmpFolder;

			console.log( "Unzipping for dist/cdn copies" );
			shell.mkdir( "-p", tmpFolder );
			Release.exec({
				command: unzipCommand,
				silent: true
			}, "Failed to unzip cdn files" );

			shell.mkdir( "-p", "dist/cdn" );
			shell.cp( tmpFolder + "/jquery-ui*.js", "dist/cdn" );
			shell.cp( "-r", tmpFolder + "/themes", "dist/cdn" );
			fn( manifestFiles );
		}

		Release.exec( "grunt manifest" );
		manifestFiles = shell.ls( "*.jquery.json" );
		if ( Release.preRelease ) {

			// TODO no need to create a zip file here, just copy the needed files to dist/cdn
			buildPreReleasePackage( copyCdnFiles );
		} else {
			buildCDNPackage( copyCdnFiles );
		}
	}
});

};

module.exports.dependencies = [
	"download.jqueryui.com@2.0.1",
	"shelljs@0.2.6"
];
