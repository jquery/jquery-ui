/*
 * jQuery UI Effects Bounce @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Bounce
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

var rshowhide = /show|hide/;

$.effects.effect.bounce = function(o) {

	return this.queue(function() {

		// Create element
		var el = $( this ), 
			props = [ 'position', 'top', 'bottom', 'left', 'right' ],
			// defaults:
			mode = $.effects.setMode( el, o.mode || 'effect' ),
			showhide = rshowhide.test( mode ),
			direction = o.direction || 'up', 
			distance = o.distance || 20,
			times = o.times || 5,

			// number of internal animations
			anims = times * 2 + showhide,
			speed = (o.duration || 250) / anims,
			easing = o.easing,

			// utility:
			ref = ( direction == 'up' || direction == 'down' ) ? 'top' : 'left',
			motion = ( direction == 'up' || direction == 'left' ), // true is positive
			i,
			upAnim,
			downAnim,

			// we will need to re-assemble the queue to stack our animations in place
			queue = el.queue(),
			queuelen = queue.length;

		// Avoid touching opacity to prevent clearType and PNG issues in IE	
		if ( showhide ) {
			props.push( 'opacity' );
		} 

		$.effects.save( el, props ); 
		el.show(); 
		$.effects.createWrapper( el ); // Create Wrapper

		// default distance for the BIGGEST bounce is the outer Distance / 3
		if ( !distance ) {
			distance = el[ ref == 'top' ? 'outerHeight' : 'outerWidth' ]({ margin:true }) / 3;
		}

		if ( mode == 'show' ) {
			upAnim = { opacity: 1 };
			upAnim[ ref ] = 0;

			// fade and set the initial position if we are showing
			el.css( 'opacity', 0 )
				.css( ref, motion ? -distance*2 : distance*2 )
				.animate( upAnim, speed, easing );
		}

		// start at the smallest distance if we are hiding
		if ( mode == 'hide' ) {
			distance = distance / ( ( times - 1 ) * 2 );
		}

		// Bounces up then down (or reversed if motion) -- times * 2 animations happen here
		for ( i = 0; i < times; i++ ) {
			upAnim = {};
			downAnim = {};
			upAnim[ ref ] = ( motion ? '-=' : '+=' ) + distance;
			downAnim[ ref ] = ( motion ? '+=' : '-=' ) + distance;
			el.animate( upAnim, speed, easing )
				.animate( downAnim, speed, easing,
					( i == times - 1 ) && ( mode != "hide" ) ? finish : undefined );

			distance = mode == 'hide' ? distance * 2 : distance / 2;
		}

		// Last Bounce
		if ( mode == 'hide' ) {
			upAnim = { opacity: 0 };
			upAnim[ ref ] = ( motion ? '-=' : '+=' ) + distance;

			el.animate( upAnim, speed, easing, function(){
				el.hide();
				finish();
			});
		}

		// inject all the animations we just queued to be first in line (after "inprogress")
		if ( queuelen > 1) {
			queue.splice.apply( queue,
				[ 1, 0 ].concat( queue.splice( queuelen, anims ) ) );
		}
		el.dequeue();

		function finish() {
			$.effects.restore( el, props );
			$.effects.removeWrapper( el );
			$.isFunction( o.complete ) && o.complete.apply( el[ 0 ], arguments );
		}
	});

};

})(jQuery);
