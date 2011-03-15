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
		var elem = $( this ),
			mode = $.effects.setMode( elem, o.mode || 'show' ),
			times = ( ( o.times || 5 ) * 2 ) - 1,
			duration = o.duration / 2,
			isVisible = elem.is( ':visible' ),
			animateTo = 0,
			i;

		if ( !isVisible ) {
			elem.css('opacity', 0).show();
			animateTo = 1;
		}

		if ( ( mode == 'hide' && isVisible ) || ( mode == 'show' && !isVisible ) ) {
			times--;
		}

		for ( i = 0; i < times; i++ ) {
			elem.animate({ 
				opacity: animateTo 
			}, duration, o.easing );
			animateTo = ( animateTo + 1 ) % 2;
		}

		elem.animate({ 
			opacity: animateTo 
		}, duration, o.easing, function() {
			if (animateTo == 0) {
				elem.hide();
			}
			(o.complete && o.complete.apply(this, arguments));
		}).dequeue();
	});
};

})(jQuery);
