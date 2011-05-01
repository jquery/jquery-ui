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
	return this.queue( function( next ) {
		var elem = $( this ),
			mode = $.effects.setMode( elem, o.mode || "show" ),
			show = mode === "show" || !elem.is( ":visible" ),
			showhide = ( show || mode === "hide" ),

			// showing or hiding leaves of the "last" animation
			anims = ( ( o.times || 5 ) * 2 ) - ( showhide ? 1 : 0 ),
			duration = o.duration / anims,
			animateTo = 0,
			queue = elem.queue(),
			queuelen = queue.length,
			i;

		if ( show ) {
			elem.css( "opacity", 0 ).show();
			animateTo = 1;
		}

		for ( i = 0; i < anims - 1; i++ ) {
			elem.animate({
				opacity: animateTo
			}, duration, o.easing );
			animateTo = 1 - animateTo;
		}

		elem.animate({
			opacity: animateTo
		}, duration, o.easing, function() {
			if ( animateTo === 0 ) {
				elem.hide();
			}
			if ( o.complete ) {
				o.complete.apply( this );
			}
		});

		// We just queued up "anims" animations, we need to put them next in the queue
		if ( queuelen > 1) {
			queue.splice.apply( queue,
				[ 1, 0 ].concat( queue.splice( queuelen, anims ) ) );
		}
		next();
	});
};

})(jQuery);
