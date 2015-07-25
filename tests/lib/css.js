define( [], function () {
	return function( options ) {

		function includeStyle( url ) {
			var link = document.createElement( "link" );
			link.rel = "stylesheet"
			link.href = "../../" + url;
			document.head.appendChild( link );
		}

		// Find the script element
		var scripts = document.getElementsByTagName( "script" );
		var script = scripts[ scripts.length - 1 ];

		// Load the modules
		var modules = options[ "data-modules" ];
		if ( modules ) {
			modules = modules.split( /\s+/ );
			for ( var i = 0; i < modules.length; i++ ) {
				includeStyle( "themes/base/" + modules[ i ] + ".css" );
			}
		}

		// Load the QUnit stylesheet
		includeStyle( "external/qunit/qunit.css" );
	}
});
