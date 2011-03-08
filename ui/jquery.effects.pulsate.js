/*
 * jQuery UI Effects Pulsate @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Pulsate
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.pulsate = function( o ) {
	return this.queue( function() {
		var el = $.effects.$( this ),
			mode = el.setMode( o.mode || 'show' ),
			times = ( ( o.times || 5 ) * 2 ) - 1,
			duration = o.duration / 2,
			isVisible = el.is( ':visible' ),
			animateTo = 0,
			i;

		if ( !isVisible ) {
			el.css('opacity', 0).show();
			animateTo = 1;
		}

		if ( ( mode == 'hide' && isVisible ) || ( mode == 'show' && !isVisible ) ) {
			times--;
		}

		for ( i = 0; i < times; i++ ) {
			el.animate({ 
				opacity: animateTo 
			}, duration, o.easing );
			animateTo = ( animateTo + 1 ) % 2;
		}

		el.animate({ 
			opacity: animateTo 
		}, duration, o.easing, function() {
			if (animateTo == 0) {
				el.hide();
			}
			(o.complete && o.complete.apply(this, arguments));
		}).dequeue();
	});
};

})(jQuery);
