(function() {

if( !window.helper ) {
	window.helper = {};
}

window.helper.jqueryUrl = function() {

	var current, length, url, version,
		i = 0,
		parts = document.location.search.slice( 1 ).split( "&" );

	for ( length = parts.length ; i < length; i++ ) {
		current = parts[ i ].split( "=" );
		if ( current[ 0 ] === "jquery" ) {
			version = current[ 1 ];
			break;
		}
	}

	if ( version === "git" ) {
		url = "http://code.jquery.com/jquery-git.js";
	} else {
		url = "../../../external/jquery-" + ( version || "1.10.2" ) + "/jquery";
	}

	return url;
};

}());
