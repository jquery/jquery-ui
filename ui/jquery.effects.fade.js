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
	return this.queue( function() {
		var el = $( this ),
			mode = $.effects.setMode( el, o.mode || 'hide' );

		el.animate({ 
			opacity: mode 
		}, {
			queue: false,
			duration: o.duration,
			easing: o.easing,
			complete: function() {
				$.isFunction( o.complete ) && o.complete.apply( this, arguments );
				el.dequeue();
			}
		});
	});
};

})(jQuery);
