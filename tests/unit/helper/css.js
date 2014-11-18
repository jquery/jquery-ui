(function() {

if( !window.helper ) {
	window.helper = {};
}

function includeStyle( url ) {
	document.write( "<link rel='stylesheet' href='../../../" + url + "'>" );
}

window.helper.loadCss = function( styles ) {
	var i;
	for( i = 0; i < styles.length; i++ ) {
		includeStyle( "themes/base/" + styles[ i ] + ".css" );
	}
};

}());
