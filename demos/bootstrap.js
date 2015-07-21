/* globals window:true, document:true */
( function() {

// Find the script element
var scripts = document.getElementsByTagName( "script" );
var script = scripts[ scripts.length - 1 ];

// Read the modules
var modules = script.getAttribute( "data-modules" );
var pathParts = window.location.pathname.split( "/" );
var effectsAll = [
	"effect-blind",
	"effect-bounce",
	"effect-clip",
	"effect-drop",
	"effect-explode",
	"effect-fade",
	"effect-fold",
	"effect-highlight",
	"effect-puff",
	"effect-pulsate",
	"effect-scale",
	"effect-shake",
	"effect-size",
	"effect-slide"
];
var widgets = [];

function getPath( module ) {
	for ( var i = 0; i < widgets.length; i++ ) {
		if ( widgets[ i ] === module ) {
			return "widgets/" + module;
		}
	}
	return module;
}
function fixPaths( modules ) {
	for ( var i = 0; i < modules.length; i++ ) {
		modules[ i ] = getPath( modules[ i ] );
	}
	return modules;
}

// Hide the page while things are loading to prevent a FOUC
document.documentElement.className = "demo-loading";

require.config( {
	baseUrl: "../../ui",
	paths: {
		jquery: "../external/jquery/jquery",
		external: "../external/"
	},
	shim: {
		"external/globalize/globalize.culture.de-DE": [ "external/globalize/globalize" ],
		"external/globalize/globalize.culture.ja-JP": [ "external/globalize/globalize" ]
	}
} );


// Replace effects all shortcut modules with all the effects modules
if ( modules && modules.indexOf( "effects-all" ) !== -1 ) {
	modules = modules.replace( /effects-all/, effectsAll.join( " " ) );
}

modules = modules ? modules.replace( /^\s+|\s+$/g, "" ).split( /\s+/ ) : [];
modules.push( pathParts[ pathParts.length - 2 ] );
modules = fixPaths( modules );

require( modules, function() {
	var newScript = document.createElement( "script" );

	document.documentElement.className = "";

	newScript.text = "( function() { " + script.innerHTML + " } )();";
	document.head.appendChild( newScript ).parentNode.removeChild( newScript );
} );

} )();
