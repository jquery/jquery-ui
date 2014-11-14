/*!
 * jQuery UI Effects Blind @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Blind Effect
//>>group: Effects
//>>description: Blinds the element.
//>>docs: http://api.jqueryui.com/blind-effect/
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

return $.effects.define( "blind", "hide", function( o, done ) {
	var start, placeholder,
		animate = {},
		map = {
			up: [ "bottom", "top" ],
			vertical: [ "bottom", "top" ],
			down: [ "top", "bottom" ],
			left: [ "right", "left" ],
			horizontal: [ "right", "left" ],
			right: [ "left", "right" ]
		},
		el = $( this ),
		show = o.mode === "show",
		direction = o.direction || "up";

	start = el.cssClip();
	animate.clip = el.cssClip();
	animate.clip[ map[ direction ][ 0 ] ] = animate.clip[ map[ direction ][ 1 ] ];

	placeholder = $.effects.createPlaceholder( el );

	if ( show ) {
		el.cssClip( animate.clip );
		if ( placeholder ) {
			placeholder.css( $.effects.clipToBox( animate ) );
		}

		animate.clip = start;
	}

	if ( placeholder ) {
		placeholder.animate( $.effects.clipToBox( animate ), o.duration, o.easing );
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
