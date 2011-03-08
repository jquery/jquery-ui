/*
 * jQuery UI Effects Highlight @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Highlight
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.effect.highlight = function( o ) {
	return this.queue( function() {
		var el = $.effects.$( this ),
			props = [ 'backgroundImage', 'backgroundColor', 'opacity' ],
			mode = el.setMode( o.mode || 'show' ),
			animation = {
				backgroundColor: el.css( 'backgroundColor' )
			};

		if (mode == 'hide') {
			animation.opacity = 0;
		}

		el
			.save( props )
			.show()
			.css({
				backgroundImage: 'none',
				backgroundColor: o.color || '#ffff99'
			})
			.animate( animation, {
				queue: false,
				duration: o.duration,
				easing: o.easing,
				complete: function() {
					(mode == 'hide' && el.hide());
					el.restore( props );
					(mode == 'show' && !$.support.opacity && this.style.removeAttribute( 'filter' ));
					jQuery.isFunction(o.complete) && o.complete.apply(this, arguments);
					el.dequeue();
				}
			});
	});
};

})(jQuery);
