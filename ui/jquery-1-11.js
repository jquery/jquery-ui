/*!
 * jQuery UI Support for jQuery core 1.11.x (or older) @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */

//>>label: jQuery 1.11.x Support
//>>group: Core
//>>description: Support version 1.11.x of jQuery core (or older)

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

// Support: jQuery 1.11.x or older
var versions = $.fn.jquery.split( "." );
if ( parseInt( versions[ 0 ], 10 ) === 1 && parseInt( versions[ 1 ], 10 ) <= 11 ) {

	// $.unique has been renamed to uniqueSort
	$.uniqueSort = $.unique;
}

} ) );
