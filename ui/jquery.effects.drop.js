/*
 * jQuery UI Effects Drop @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Drop
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.drop = function( o ) {

	return this.queue( function() {

		var el = $.effects.$( this ), 
			props = [ 'position', 'top', 'bottom', 'left', 'right', 'opacity' ],
			mode = el.setMode( o.mode || 'hide' ),
			direction = o.direction || 'left',
			ref = ( direction == 'up' || direction == 'down' ) ? 'top' : 'left',
			motion = ( direction == 'up' || direction == 'left' ) ? 'pos' : 'neg',
			animation = {
				opacity: mode == 'show' ? 1 : 0
			},
			distance;

		// Adjust
		el.save( props ).show().createWrapper(); 

		distance = o.distance || el[ ref == 'top' ? 'outerHeight': 'outerWidth' ]({ margin: true }) / 2;

		if ( mode == 'show' ) {
			el.css( 'opacity', 0 )
				.css( ref, motion == 'pos' ? -distance : distance );
		}

		// Animation
		animation[ ref ] = ((mode == 'show') ? (motion == 'pos' ? '+=' : '-=') : (motion == 'pos' ? '-=' : '+=')) + distance;

		// Animate
		el.animate( animation, { 
			queue: false, 
			duration: o.duration, 
			easing: o.easing, 
			complete: function() {
				mode == 'hide' && el.hide();
				el.restore( props ).removeWrapper(); 
				$.isFunction( o.complete ) && o.complete.apply(this, arguments);
				el.dequeue();
			}
		});

	});

};

})(jQuery);
