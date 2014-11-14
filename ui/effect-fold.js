/*!
 * jQuery UI Effects Fold @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Fold Effect
//>>group: Effects
//>>description: Folds an element first horizontally and then vertically.
//>>docs: http://api.jqueryui.com/fold-effect/
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

return $.effects.define( "fold", "hide", function( o, done ) {

	// Create element
	var el = $( this ),
		mode = o.mode,
		show = mode === "show",
		hide = mode === "hide",
		size = o.size || 15,
		percent = /([0-9]+)%/.exec( size ),
		horizFirst = !!o.horizFirst,
		ref = horizFirst ? [ "right", "bottom" ] : [ "bottom", "right" ],
		duration = o.duration / 2,

		placeholder = $.effects.createPlaceholder( el ),

		start = el.cssClip(),
		animation1 = {
			clip: el.cssClip()
		},
		animation2 = {
			clip: el.cssClip()
		},

		distance = [ start[ref[0]], start[ref[1]] ],

		// we will need to re-assemble the queue to stack our animations in place
		queue = el.queue(),
		queuelen = queue.length;

	// define animations
	if ( percent ) {
		size = parseInt( percent[ 1 ], 10 ) / 100 * distance[ hide ? 0 : 1 ];
	}
	animation1.clip[ ref[ 0 ] ] = size;
	animation2.clip[ ref[ 0 ] ] = size;
	animation2.clip[ ref[ 1 ] ] = 0;

	if ( show ) {
		el.cssClip( animation2.clip );
		if ( placeholder ) {
			placeholder.css( $.effects.clipToBox( animation2 ) );
		}

		animation2.clip = start;
	}

	// Animate
	el
		.queue(function(next) {
			if ( placeholder ) {
				placeholder
					.animate( $.effects.clipToBox( animation1 ), duration, o.easing )
					.animate( $.effects.clipToBox( animation2 ), duration, o.easing );
			}

			next();
		})
		.animate( animation1, duration, o.easing )
		.animate( animation2, duration, o.easing )
		.queue(function() {
			$.effects.cleanUpPlaceholder( placeholder, el );

			if ( hide ) {
				el.hide();
			}

			done();
		});

	// inject all the animations we just queued to be first in line (after "inprogress")
	if ( queuelen > 1) {
		queue.splice.apply( queue,
			[ 1, 0 ].concat( queue.splice( queuelen, 4 ) ) );
	}
	el.dequeue();
});

}));
