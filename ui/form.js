( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {

// Support: IE8 Only
// IE8 does not support the form attribute and when it is supplied. It overwrites the form prop
// with a string, so we need to find the proper form.
// However since we no longer need to support IE8 we can just return the form attribute.
return $.fn._form = function() {
	return $( this[ 0 ].form );
};

} ) );
