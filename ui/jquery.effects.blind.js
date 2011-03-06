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

$.effects.blind = function(o) {

	return this.queue(function() {
		// Create element
		var el = $( this ), 
			props = ['position','top','bottom','left','right'],
			mode = $.effects.setMode( el, o.mode || 'hide' ),
			direction = o.direction || 'vertical',
			ref = ( direction == 'vertical' ) ? 'height' : 'width',
			animation = {},
			wrapper, distance;

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		
		wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper

		animation[ref] = ( mode == 'show' ? wrapper[ ref ]() : 0 );
		(mode == 'show' && wrapper.css(ref, 0)); // start at 0 if we are showing

		// Animate
		wrapper.animate( animation, o.duration, o.easing, function() {
			(mode == 'hide' && el.hide()); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			(o.complete && o.complete.apply(el[0], arguments)); // Callback
			el.dequeue();
		});

	});

};

})(jQuery);
