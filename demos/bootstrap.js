/* globals window:true, document:true */
( function() {

// Find the script element
var scripts = document.getElementsByTagName( "script" );
var script = scripts[ scripts.length - 1 ];

// Read the modules
var modules = script.getAttribute( "data-modules" );
var pathParts = window.location.pathname.split( "/" );
var effectsAll = [
	"effects/effect-blind",
	"effects/effect-bounce",
	"effects/effect-clip",
	"effects/effect-drop",
	"effects/effect-explode",
	"effects/effect-fade",
	"effects/effect-fold",
	"effects/effect-highlight",
	"effects/effect-puff",
	"effects/effect-pulsate",
	"effects/effect-scale",
	"effects/effect-shake",
	"effects/effect-size",
	"effects/effect-slide"
];
var widgets = [
	"accordion",
	"autocomplete",
	"button",
	"datepicker",
	"dialog",
	"draggable",
	"droppable",
	"menu",
	"mouse",
	"progressbar",
	"resizable",
	"selectable",
	"selectmenu",
	"slider",
	"sortable",
	"spinner",
	"tabs",
	"tooltip"
];

function getPath( module ) {
	for ( var i = 0; i < widgets.length; i++ ) {
		if ( widgets[ i ] === module ) {
			return "widgets/" + module;
		}
	}
	for ( var j = 0; j < effectsAll.length; j++ ) {
		if ( module !== "effect" && effectsAll[ j ].indexOf( module ) !== -1 ) {
			return "effects/" + module;
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
