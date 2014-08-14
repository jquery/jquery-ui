module.exports = function( Release ) {

var shell = require( "shelljs" ),
	path = require( "path" ),
	fs = require( "fs" );

function replaceAtVersion() {
	console.log( "Replacing @VERSION..." );
	var matches = [];

	function recurse( folder ) {
		fs.readdirSync( folder ).forEach(function( fileName ) {
			var content,
				fullPath = folder + "/" + fileName;
			if ( fs.statSync( fullPath ).isDirectory() ) {
				recurse( fullPath );
				return;
			}
			content = fs.readFileSync( fullPath, {
				encoding: "utf-8"
			});
			if ( !/@VERSION/.test( content ) ) {
				return;
			}
			matches.push( fullPath );
			fs.writeFileSync( fullPath, content.replace( /@VERSION/g, Release.newVersion ) );
		});
	}

	[ "ui", "themes" ].forEach( recurse );

	console.log( "Replaced @VERSION in " + matches.length + " files." );

	return matches;
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
		var files;
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
			fn( files );
		}

		Release.exec( "grunt manifest" );
		files = shell.ls( "*.jquery.json" ).concat( replaceAtVersion() );
		buildCDNPackage( copyCdnFiles );
	}
});

};

module.exports.dependencies = [
	"download.jqueryui.com@2.0.15",
	"shelljs@0.2.6"
];
