/*
 * jQuery UI Effects Fade @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Fade
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.fade = function( o ) {
	return this.queue( function( next ) {
		var el = $( this ),
			mode = $.effects.setMode( el, o.mode || 'toggle' ),
			hide = mode === "hide";

		el.show();
		el.animate({ 
			opacity: hide ? 0 : 1
		}, {
			queue: false,
			duration: o.duration,
			easing: o.easing,
			complete: function() {
				if ( hide ) {
					el.hide();
				}
				if ( o.complete ) {
					o.complete.call( this );
				}
				next();
			}
		});
	});
};

})(jQuery);
