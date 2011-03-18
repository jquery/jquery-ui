/*
 * jQuery UI Effects Blind @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Blind
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.blind = function( o ) {

	return this.queue( function() {

		// Create element
		var el = $( this ),
			props = [ 'position', 'top', 'bottom', 'left', 'right' ],
			mode = $.effects.setMode( el, o.mode || 'hide' ),
			direction = o.direction || 'vertical',
			ref = ( direction == 'vertical' ) ? 'height' : 'width',
			animation = {},
			wrapper, distance;

		$.effects.save( el, props ); 
		el.show(); 
		wrapper = $.effects.createWrapper( el ).css({ 
			overflow: 'hidden'
		});

		animation[ ref ] = ( mode == 'show' ? wrapper[ ref ]() : 0 );

		// start at 0 if we are showing
		( mode == 'show' && wrapper.css( ref, 0 ) );

		// Animate
		wrapper.animate( animation, o.duration, o.easing, function() {
			( mode == 'hide' && el.hide() ); 
			$.effects.restore( el, props ); 
			$.effects.removeWrapper( el );
			$.isFunction( o.complete ) && o.complete.apply( el[ 0 ], arguments );
			el.dequeue();
		});

	});

};

})(jQuery);
