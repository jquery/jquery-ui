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
		var elem = $( this ),
			props = [ 'backgroundImage', 'backgroundColor', 'opacity' ],
			mode = $.effects.setMode( elem, o.mode || 'show' ),
			animation = {
				backgroundColor: elem.css( 'backgroundColor' )
			};

		if (mode == 'hide') {
			animation.opacity = 0;
		}

		$.effects.save( elem, props );
		
		elem
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
					(mode == 'hide' && elem.hide());
					$.effects.restore( elem, props );
					(mode == 'show' && !$.support.opacity && this.style.removeAttribute( 'filter' ));
					jQuery.isFunction(o.complete) && o.complete.apply(this, arguments);
					elem.dequeue();
				}
			});
	});
};

})(jQuery);
