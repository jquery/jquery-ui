/*
 * jQuery UI Effects Shake @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Shake
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.shake = function( o ) {

	return this.queue( function() {

		var el = $.effect.$( this ),
			props = [ 'position', 'top', 'bottom', 'left', 'right' ],
			mode = el.setMode( o.mode || 'effect' ),
			direction = o.direction || 'left',
			distance = o.distance || 20,
			times = o.times || 3,
			speed = o.duration || 140,
			ref = (direction == 'up' || direction == 'down') ? 'top' : 'left',
			motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg',
			animation = {},
			animation1 = {},
			animation2 = {},
			i; 

		el.save( props ).show().createWrapper(); 

		// Animation
		animation[ ref ] = ( motion == 'pos' ? '-=' : '+=' ) + distance;
		animation1[ ref ] = ( motion == 'pos' ? '+=' : '-=' ) + distance * 2;
		animation2[ ref ] = ( motion == 'pos' ? '-=' : '+=' ) + distance * 2;

		// Animate
		el.animate( animation, speed, o.easing );

		// Shakes
		for ( i = 1; i < times; i++ ) { 
			el.animate( animation1, speed, o.easing ).animate( animation2, speed, o.easing );
		};
		el
			.animate( animation1, speed, o.easing )
			.animate( animation, speed / 2, o.easing, function() { 

				// Last shake
				el.restore( props ).removeWrapper(); 
				$.isFunction( o.complete ) && o.complete.apply( this, arguments ); 
			})
			.dequeue();
	});

};

})(jQuery);
