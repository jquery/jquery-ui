/*!
 * jQuery UI Effects Scale @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Scale Effect
//>>group: Effects
//>>description: Grows or shrinks an element and its content. Restores an element to its original size.
//>>docs: http://api.jqueryui.com/scale-effect/
//>>demos: http://jqueryui.com/effect/

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./effect",
			"./effect-size"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

return $.effects.define( "scale", function( o, done ) {

	// Create element
	var el = $( this ),
		mode = o.mode,
		percent = parseInt( o.percent, 10 ) ||
			( parseInt( o.percent, 10 ) === 0 ? 0 : ( mode !== "effect" ? 0 : 100 ) ),

		options = $.extend( true, {
			from: $.effects.scaledDimensions( el ),
			to: $.effects.scaledDimensions( el, percent, o.direction || "both" ),
			origin: o.origin || [ "middle", "center" ]
		}, o );

	// Fade option to support puff
	if ( o.fade ) {
		options.from.opacity = 1;
		options.to.opacity = 0;
	}

	$.effects.effect.size.call( this, options, done );
});

}));
