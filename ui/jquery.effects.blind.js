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
		var el = $(this), 
			props = ['position','top','bottom','left','right'],
			mode = $.effects.setMode( el, o.mode || 'hide' ),
			direction = o.direction || 'vertical',
			ref = (direction == 'vertical') ? 'height' : 'width',
			wrapper, distance; // Default direction

		// Adjust
		$.effects.save(el, props); el.show(); // Save & Show
		wrapper = $.effects.createWrapper(el).css({overflow:'hidden'}); // Create Wrapper
		distance = wrapper[ direction == 'vertical' ? "height" : "width" ]();
		if(mode == 'show') wrapper.css(ref, 0); // Shift

		// Animation
		var animation = {};
		animation[ref] = mode == 'show' ? distance : 0;

		// Animate
		wrapper.animate(animation, o.duration, o.easing, function() {
			if(mode == 'hide') el.hide(); // Hide
			$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
			if(o.complete) o.complete.apply(el[0], arguments); // Callback
			el.dequeue();
		});

	});

};

})(jQuery);
