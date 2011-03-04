/*
 * jQuery UI Effects Bounce @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Bounce
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

var rshowhide = /show|hide/;

$.effects.bounce = function(o) {

	return this.queue(function() {

		// Create element
		var el = $( this ), 
			props = [ 'position', 'top', 'bottom', 'left', 'right' ],
			// defaults:
			mode = $.effects.setMode( el, o.mode || 'effect' ),
			direction = o.direction || 'up', 
			distance = o.distance || 20,
			times = o.times || 5, 
			speed = (o.duration || 250),
			// utility:
			ref = ( direction == 'up' || direction == 'down' ) ? 'top' : 'left',
			motion = ( direction == 'up' || direction == 'left' ), // true is positive
			distance = o.distance || false;
		
		// Avoid touching opacity to prevent clearType and PNG issues in IE	
		if ( rshowhide.test(mode) ) props.push('opacity'); 

		$.effects.save(el, props); el.show(); // Save & Show
		$.effects.createWrapper(el); // Create Wrapper

		if ( !distance ) {
			distance = el[ref == 'top' ? 'outerHeight' : 'outerWidth' ]( { margin:true } ) / 3;
		}
		if (mode == 'show') el.css('opacity', 0).css(ref, motion ? -distance : distance ); // Shift
		if (mode == 'hide') distance = distance / (times * 2);
		if (mode != 'hide') times--;

		// Animate
		if (mode == 'show') { // Show Bounce
			var animation = { opacity: 1 };
			animation[ref] = (motion ? '+=' : '-=') + distance;
			el.animate( animation, speed / 2, o.easing);
			distance = distance / 2;
			times--;
		};
		for (var i = 0; i < times; i++) { // Bounces
			var animation1 = {}, animation2 = {};
			animation1[ref] = (motion ? '-=' : '+=') + distance;
			animation2[ref] = (motion ? '+=' : '-=') + distance;
			el.animate( animation1, speed / 2, o.easing ).animate( animation2, speed / 2, o.easing );
			distance = (mode == 'hide') ? distance * 2 : distance / 2;
		};
		if (mode == 'hide') { // Last Bounce
			var animation = { opacity: 0 };
			animation[ref] = (motion ? '-=' : '+=') + distance;
			el.animate( animation, speed / 2, o.easing, function(){
				el.hide(); // Hide
				$.effects.restore( el, props ); $.effects.removeWrapper( el ); // Restore
				if ( o.complete ) o.complete.apply( this, arguments ); // Callback
			});
		} else {
			var animation1 = {}, animation2 = {};
			animation1[ref] = (motion ? '-=' : '+=') + distance;
			animation2[ref] = (motion ? '+=' : '-=') + distance;
			el.animate(animation1, speed / 2, o.easing).animate(animation2, speed / 2, o.easing, function(){
				$.effects.restore(el, props); $.effects.removeWrapper(el); // Restore
				if(o.complete) o.complete.apply(this, arguments); // Callback
			});
		};
		el.queue('fx', function(next) { next(); });
		el.dequeue();
	});

};

})(jQuery);
