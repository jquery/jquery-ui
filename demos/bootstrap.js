(function() {

	// Find the script element
	var scripts = document.getElementsByTagName( "script" );
	var script = scripts[ scripts.length - 1 ];

	// Read the modules
	var modules = script.getAttribute( "data-modules" );
	var pathParts = window.location.pathname.split( "/" );

	require.config( {
		baseUrl: "../../ui",
		paths: {
			jquery: "../../external/jquery/jquery"
		}
	} );

	modules = modules ? modules.replace( /^\s+|\s+$/g, "" ).split( /\s+/ ) : [];
	modules.push( pathParts[ pathParts.length - 2 ] );

	require( modules, function() {
		$( "body" ).css( "visibility", "visible" );
		eval( $( script ).html() );
	} );
})();
