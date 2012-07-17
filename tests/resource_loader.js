(function( $ ) {

var parts = document.location.search.slice( 1 ).split( "&" ),
	length = parts.length,
	i = 0,
	current,
	min;

for ( ; i < length; i++ ) {
	current = parts[ i ].split( "=" );
	if ( current[ 0 ] === "min" ) {
		min = current[ 1 ];
		break;
	}
}

function includeStyle( url ) {
	document.write( "<link rel='stylesheet' href='../../../" + url + "'>" );
}

function includeScript( url ) {
	document.write( "<script src='../../../" + url + "'></script>" );
}

window.loadResources = min ?
	function() {
		includeStyle( "build/dist/theme/jquery-ui.min.css" );
		includeScript( "build/dist/jquery-ui.min.js" );
	} :
	function( resources ) {
		$.each( resources.css || [], function( i, resource ) {
			includeStyle( "themes/base/jquery." + resource + ".css" );
		});
		$.each( resources.js || [], function( i, resource ) {
			includeScript( resource );
		});
	};

})( jQuery );
