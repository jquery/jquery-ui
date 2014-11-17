/*!
 * jQuery UI Effects Slide @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Slide Effect
//>>group: Effects
//>>description: Slides an element in and out of the viewport.
//>>docs: http://api.jqueryui.com/slide-effect/
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

return $.effects.define( "slide", "show", function( o, done ) {
	var startClip, startRef,
		el = $( this ),
		map = {
			up: [ "bottom", "top" ],
			down: [ "top", "bottom" ],
			left: [ "right", "left" ],
			right: [ "left", "right" ]
		},
		mode = o.mode,
		direction = o.direction || "left",
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		positiveMotion = ( direction === "up" || direction === "left" ),
		distance = o.distance || el[ ref === "top" ? "outerHeight" : "outerWidth" ]( true ),
		animation = {};

	$.effects.createPlaceholder( el );

	startClip = el.cssClip();
	startRef = el.position()[ ref ];

	// define hide animation
	animation[ ref ] = ( positiveMotion ? -1 : 1 ) * distance + startRef;
	animation.clip = el.cssClip();
	animation.clip[ map[ direction ][ 1 ] ] = animation.clip[ map[ direction ][ 0 ] ];

	// reverse the animation if we're showing
	if ( mode === "show" ) {
		el.cssClip( animation.clip );
		el.css( ref, animation[ ref ] );
		animation.clip = startClip;
		animation[ ref ] = startRef;
	}

	// actually animate
	el.animate( animation, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: done
	});
});

}));
