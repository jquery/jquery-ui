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
	
var rvertical = /up|down|vertical/;
var rpositivemotion = /up|left|vertical|horizontal/;

$.effects.effect.blind = function( o ) {

	return this.queue( function() {

		// Create element
		var el = $( this ),
			props = [ "position", "top", "bottom", "left", "right" ],
			mode = $.effects.setMode( el, o.mode || "hide" ),
			direction = o.direction || "up",
			vertical = rvertical.test( direction ),
			ref = vertical ? "height" : "width",
			ref2 = vertical ? "top" : "left",
			motion = rpositivemotion.test( direction ),
			animation = {},
			wrapper, distance;

		// if already wrapped, the wrapper's properties are my property. #6245
		if ( el.parent().is( ".ui-effects-wrapper" ) ) {
			$.effects.save( el.parent(), props );
		} else {
			$.effects.save( el, props );
		}
		el.show(); 
		wrapper = $.effects.createWrapper( el ).css({ 
			overflow: "hidden"
		});

		distance = wrapper[ ref ]();

		animation[ ref ] = ( mode === "show" ? distance : 0 );
		if ( !motion ) {
			el
				.css( vertical ? "bottom" : "right", 0 )
				.css( vertical ? "top" : "left", "" )
				.css({ position: "absolute" });
			animation[ ref2 ] = ( mode === "show" ) ? 0 : distance;
		}

		// start at 0 if we are showing
		if ( mode == "show" ) {
			wrapper.css( ref, 0 );
			if ( ! motion ) {
				wrapper.css( ref2, distance );
			}
		}

		// Animate
		wrapper.animate( animation, {
			duration: o.duration,
			easing: o.easing,
			queue: false,
			complete: function() {
				if ( mode == "hide" ) {
					el.hide();
				}
				$.effects.restore( el, props ); 
				$.effects.removeWrapper( el );
				if ( $.isFunction( o.complete ) ) {
					o.complete.apply( el[ 0 ], arguments );
				}
				el.dequeue();
			}
		});

	});

};

})(jQuery);
