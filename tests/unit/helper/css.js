(function() {

function includeStyle( url ) {
	document.write( "<link rel='stylesheet' href='../../../" + url + "'>" );
}

var scripts = document.getElementsByTagName( "script" );
var script = scripts[ scripts.length - 1 ];
var modules = script.getAttribute( "data-modules" ).split( /\s+/ );
var i = 0;

for ( ; i < modules.length; i++ ) {
	document.write( "<link rel='stylesheet' href='../../../themes/base/" + modules[ i ] + ".css'>" );
}

} )();
