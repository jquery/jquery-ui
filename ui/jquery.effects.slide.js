/*
 * jQuery UI Effects Slide @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Slide
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.slide = function( o ) {

	return this.queue( function() {

		// Create element
		var el = $( this ),
			props = ['position','top','bottom','left','right'],
			mode = $.effects.setMode( el, o.mode || 'show' ),
			direction = o.direction || 'left',
			ref = (direction == 'up' || direction == 'down') ? 'top' : 'left',
			motion = (direction == 'up' || direction == 'left') ? 'pos' : 'neg',
			distance,
			animation = {}, wrapper; 

		// Adjust
		$.effects.save( el, props ); 
		el.show();
		wrapper = $.effects.createWrapper( el ).css({
			overflow: 'hidden'
		}); 

		// use the wrapper size, since it differs according to the block margin
		distance = o.distance || wrapper[ ref == 'top' ? "outerHeight" : "outerWidth" ]({ 
			margin: true 
		});
		if (mode == 'show') {
			el.css( ref, motion == 'pos' ? (isNaN(distance) ? "-" + distance : -distance) : distance );
		}

		// Animation
		animation[ ref ] = ( mode == 'show' ? 
			(motion == 'pos' ? '+=' : '-=') : 
			(motion == 'pos' ? '-=' : '+=')) 
			+ distance;

		// Animate
		el.animate( animation, { 
			queue: false, 
			duration: o.duration, 
			easing: o.easing, 
			complete: function() {
				if ( mode == 'hide' ) {
					el.hide(); 
				}
				$.effects.restore( el, props );
				$.effects.removeWrapper( el );
				$.isFunction(o.complete) && o.complete.apply( this, arguments ); 
				el.dequeue();
			}
		});

	});

};

})(jQuery);
