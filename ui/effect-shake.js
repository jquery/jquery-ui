/*!
 * jQuery UI Effects Shake @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Shake Effect
//>>group: Effects
//>>description: Shakes an element horizontally or vertically n times.
//>>docs: http://api.jqueryui.com/shake-effect/
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

return $.effects.define( "shake", function( o, done ) {

	var i = 1,
		el = $( this ),
		direction = o.direction || "left",
		distance = o.distance || 20,
		times = o.times || 3,
		anims = times * 2 + 1,
		speed = Math.round( o.duration / anims ),
		ref = (direction === "up" || direction === "down") ? "top" : "left",
		positiveMotion = (direction === "up" || direction === "left"),
		animation = {},
		animation1 = {},
		animation2 = {},

		queuelen = el.queue().length,

		placeholder = $.effects.createPlaceholder( el );

	// Animation
	animation[ ref ] = ( positiveMotion ? "-=" : "+=" ) + distance;
	animation1[ ref ] = ( positiveMotion ? "+=" : "-=" ) + distance * 2;
	animation2[ ref ] = ( positiveMotion ? "-=" : "+=" ) + distance * 2;

	// Animate
	el.animate( animation, speed, o.easing );

	// Shakes
	for ( ; i < times; i++ ) {
		el.animate( animation1, speed, o.easing ).animate( animation2, speed, o.easing );
	}

	el
		.animate( animation1, speed, o.easing )
		.animate( animation, speed / 2, o.easing )
		.queue(function() {

			$.effects.cleanUpPlaceholder( placeholder, el );

			if ( o.mode === "hide" ) {
				el.hide();
			}

			done();
		});

	$.effects.unshift( el, queuelen, anims + 1 );
});

}));
