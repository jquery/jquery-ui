(function() {

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

require.config( {
	baseUrl: "../../ui",
	paths: {
		jquery: "../../external/jquery/jquery",
		globalize: "../../external/globalize/",
		mousewheel: "../../external/jquery-mousewheel/jquery.mousewheel"
	},
	shim: {
		"globalize/globalize.culture*": [ "globalize/globalize" ]
	}
} );

// Replace effects all shortcut modules with all the effects modules
if ( modules && modules.indexOf( "effects-all" ) !== -1 ) {
	modules = modules.replace( /effects-all/, effectsAll.join( " " ) );
}

modules = modules ? modules.replace( /^\s+|\s+$/g, "" ).split( /\s+/ ) : [];
modules.push( pathParts[ pathParts.length - 2 ] );

require( modules, function() {
	$( "body" ).css( "visibility", "visible" );

	// We wrap the code in an IIFE so that return statements work and we
	// dont polute the global scope with variables
	$.globalEval( "(function(){ " + $( script ).html() + "})();" );
} );
})();
