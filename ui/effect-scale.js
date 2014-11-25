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

		// This copies the "scale" option, which is normalized in $.effects.effect.size
		// and the "fade" option, which isn't documented, but supports $.effects.effect.puff
		options = $.extend( true, {}, o ),

		percent = parseInt( o.percent, 10 ) ||
			( parseInt( o.percent, 10 ) === 0 ? 0 : ( mode !== "effect" ? 0 : 100 ) ),
		direction = o.direction || "both",
		factor = {
			y: direction !== "horizontal" ? ( percent / 100 ) : 1,
			x: direction !== "vertical" ? ( percent / 100 ) : 1
		};

	options.from = {
		height: el.height(),
		width: el.width(),
		outerHeight: el.outerHeight(),
		outerWidth: el.outerWidth()
	};
	options.to = {
		height: options.from.height * factor.y,
		width: options.from.width * factor.x,
		outerHeight: options.from.outerHeight * factor.y,
		outerWidth: options.from.outerWidth * factor.x
	};

	// Set default origin and restore for show/hide
	if ( mode !== "effect" ) {
		options.origin = o.origin || [ "middle", "center" ];
		options.restore = true;

		// Fade option to support puff
		if ( options.fade ) {
			options.from.opacity = 1;
			options.to.opacity = 0;
		}
	}

	$.effects.effect.size.call( this, options, done );
});

}));
