/*!
 * jQuery UI Effects Clip @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Clip Effect
//>>group: Effects
//>>description: Clips the element on and off like an old TV.
//>>docs: http://api.jqueryui.com/clip-effect/
//>>demos: http://jqueryui.com/effect/

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./effect"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

return $.effects.define( "clip", "hide", function( o, done ) {
	var start, placeholder,
		animate = {},
		el = $( this ),
		show = o.mode === "show",
		direction = o.direction || "vertical",
		both = direction === "both",
		horizontal = both || direction === "horizontal",
		vertical = both || direction === "vertical";

	start = el.cssClip();
	animate.clip = {
		top: vertical ? ( start.bottom - start.top ) / 2 : start.top,
		right: horizontal ? ( start.right - start.left ) / 2 : start.right,
		bottom: vertical ? ( start.bottom - start.top ) / 2 : start.bottom,
		left: horizontal ? ( start.right - start.left ) / 2 : start.left
	};

	placeholder = $.effects.createPlaceholder( el );

	if ( show ) {
		el.cssClip( animate.clip );
		animate.clip = start;
	}

	el.animate( animate, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: function() {

			$.effects.cleanUpPlaceholder( placeholder, el );

			if ( !show ) {
				el.hide();
			}

			done();
		}
	});

});

}));
