(function() {

var current, version, url,
	parts = document.location.search.slice( 1 ).split( "&" ),
	length = parts.length,
	i = 0;

for ( ; i < length; i++ ) {
	current = parts[ i ].split( "=" );
	if ( current[ 0 ] === "jquery" ) {
		version = current[ 1 ];
		break;
	}
}

if ( version === "git" || version === "git1" ) {
	url = "http://code.jquery.com/jquery-" + version + ".js";
} else {
	url = "../../../external/jquery-" + ( version || "1.11.2" ) + "/jquery.js";
}

document.write( "<script src='" + url + "'></script>" );

}() );
