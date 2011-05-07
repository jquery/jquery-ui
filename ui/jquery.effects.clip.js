/*
 * jQuery UI Effects Clip @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Clip
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.clip = function( o ) {

	return this.queue( function() {

		// Create element
		var el = $( this ), 
			props = ['position','top','bottom','left','right','height','width'], 
			mode = $.effects.setMode( el, o.mode || 'hide' ),
			direction = o.direction || 'vertical',
			ref = {
				size: (direction == 'vertical') ? 'height' : 'width',
				position: (direction == 'vertical') ? 'top' : 'left'
			},
			animation = {},
			wrapper, animate, distance;

		// Save & Show
		$.effects.save( el, props ); el.show(); 

		// Create Wrapper
		wrapper = $.effects.createWrapper( el ).css({ 
			overflow: 'hidden' 
		});
		animate = ( el[0].tagName == 'IMG' ) ? wrapper : el;
		distance = animate[ ref.size ]();

		// Shift
		if ( mode == 'show' ) {
			animate.css( ref.size, 0 );
			animate.css( ref.position, distance / 2 );
		}

		// Create Animation Object:
		animation[ ref.size ] = mode == 'show' ? distance : 0;
		animation[ ref.position ] = mode == 'show' ? 0 : distance / 2;

		// Animate
		animate.animate( animation, { 
			queue: false, 
			duration: o.duration, 
			easing: o.easing, 
			complete: function() {
				mode == 'hide' && el.hide(); 
				$.effects.restore( el, props ); 
				$.effects.removeWrapper( el ); 
				$.isFunction( o.complete ) && o.complete.apply( el[ 0 ], arguments );
				el.dequeue();
			}
		});

	});

};

})(jQuery);
