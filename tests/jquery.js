(function() {

var parts = document.location.search.slice( 1 ).split( "&" ),
	length = parts.length,
	i = 0,
	current,
	version,
	url;

for ( ; i < length; i++ ) {
	current = parts[ i ].split( "=" );
	if ( current[ 0 ] === "jquery" ) {
		version = current[ 1 ];
		break;
	}
}

if ( version === "git" ) {
	url = "http://code.jquery.com/jquery-git.js";
} else {
<<<<<<< HEAD
	url = "../../../jquery-" + ( version || "1.7.2" ) + ".js";
=======
	url = "../../jquery-" + ( version || "1.8.2" ) + ".js";
>>>>>>> 1.8.24
}

document.write( "<script src='" + url + "'></script>" );

}() );
