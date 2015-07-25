define(function () {
	// Parse the URL into key/value pairs
	function parseUrl() {
		var data = {};
		var parts = document.location.search.slice( 1 ).split( "&" );
		var length = parts.length;
		var i = 0;
		var current;

		for ( ; i < length; i++ ) {
			current = parts[ i ].split( "=" );
			data[ current[ 0 ] ] = current[ 1 ];
		}

		return data;
	}

	function jqueryUrl () {
		var version = parseUrl().jquery;
		var url;

		if ( version === "git" || version === "compat-git" ) {
			url = "http://code.jquery.com/jquery-" + version;
		} else {
			url = "external/jquery-" + ( version || "1.11.3" ) + "/jquery";
		}

		return url;
	}

	return {
		jqueryUrl: jqueryUrl
	};
});
