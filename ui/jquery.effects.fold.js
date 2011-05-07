/*
 * jQuery UI Effects Fold @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Fold
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.fold = function( o ) {

	return this.queue( function() {

		// Create element
		var el = $( this ),
			props = ['position','top','bottom','left','right'],
			mode = $.effects.setMode(el, o.mode || 'hide'),
			size = o.size || 15,
			percent = /([0-9]+)%/.exec(size),
			horizFirst = !!o.horizFirst,
			widthFirst = ((mode == 'show') != horizFirst),
			ref = widthFirst ? ['width', 'height'] : ['height', 'width'],
			duration = o.duration / 2,
			wrapper, distance;

		$.effects.save( el, props ); 
		el.show();

		// Create Wrapper
		wrapper = $.effects.createWrapper( el ).css({ 
			overflow: 'hidden' 
		}); 
		distance = widthFirst ? 
			[ wrapper.width(), wrapper.height() ] : 
			[ wrapper.height(), wrapper.width() ];

		if ( percent ) { 
			size = parseInt( percent[ 1 ], 10 ) / 100 * distance[ ( mode == 'hide') ? 0 : 1 ];
		}
		mode == 'show' && wrapper.css( horizFirst ? {
				height: 0, 
				width: size
			} : {
				height: size, 
				width: 0
			}); 

		// Animation
		var animation1 = {}, animation2 = {};
		animation1[ ref[ 0 ] ] = mode == 'show' ? distance[ 0 ] : size;
		animation2[ ref[ 1 ] ] = mode == 'show' ? distance[ 1 ] : 0;

		// Animate
		wrapper
			.animate( animation1, duration, o.easing )
			.animate( animation2, duration, o.easing, function() {
				(mode == 'hide') && el.hide();
				$.effects.restore( el, props ); 
				$.effects.removeWrapper( el ); 
				jQuery.isFunction(o.complete) && o.complete.apply( el[ 0 ], arguments ); 
				el.dequeue();
			});

	});

};

})(jQuery);
