( function( factory, global ) {
	if (
		typeof require === "function" &&
		typeof exports === "object" &&
		typeof module === "object" ) {

		// CommonJS or Node
		factory( require( "jquery" ), require( "./version" ) );
	} else if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Globals
		factory( global.jQuery );
	}
}( function( $ ) {

// This file is deprecated
return $.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );
},
	typeof global !== "undefined" ? global :
	typeof self !== "undefined" ? self :
	typeof window !== "undefined" ? window :
	{}
) );
