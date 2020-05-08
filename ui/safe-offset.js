( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery", "./version" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} ( function( $ ) {
return $.ui.__safeOffset__ = function( element ) {

	// Simulate a jQuery short-circuiting when there are no client rects reported
	// which usually means a disconnected node. This check in jQuery is meant just
	// for IE but UI depends on it.
	if ( arguments.length < 2 && !element[ 0 ].getClientRects().length ) {
		return { top: 0, left: 0 };
	}

	var args = Array.prototype.slice.call( arguments, 1 );
	return element.offset.apply( element, args );
};

} ) );
