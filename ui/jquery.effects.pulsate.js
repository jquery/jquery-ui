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

			// showing or hiding leave of the "last" time
			times = ( ( o.times || 5 ) * 2 ) - ( mode == "show" || mode == "hide" ),
			duration = o.duration / times,
			show = !elem.is( ":visible" ),
			animateTo = 0,
			i,
			queue = elem.queue(),
			queuelen = queue.length;

		if ( show ) {
			elem.css('opacity', 0).show();
			animateTo = 1;
		}

		for ( i = 0; i < times - 1; i++ ) {
			elem.animate({ 
				opacity: animateTo 
			}, duration, o.easing );
			animateTo = 1 - animateTo;
		}

		elem.animate({ 
			opacity: animateTo 
		}, duration, o.easing, function() {
			if (animateTo == 0) {
				elem.hide();
			}
			(o.complete && o.complete.apply(this, arguments));
		});

		if ( queuelen > 1) {
			queue.splice.apply( queue,
				[ 1, 0 ].concat( queue.splice( queuelen, times ) ) );
		}
		elem.dequeue();
	});
};

})(jQuery);
