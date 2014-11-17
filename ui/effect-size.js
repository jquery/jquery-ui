/*!
 * jQuery UI Effects Size @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Size Effect
//>>group: Effects
//>>description: Resize an element to a specified width and height.
//>>docs: http://api.jqueryui.com/size-effect/
//>>demos: http://jqueryui.com/effect/

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./effect"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

return $.effects.define( "size", function( o, done ) {

	// Create element
	var baseline, factor, temp, original, from,
		el = $( this ),

		// Copy for children
		cProps = [ "fontSize" ],
		vProps = [ "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom" ],
		hProps = [ "borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight" ],

		// Set options
		mode = o.mode,
		restore = o.restore || mode !== "effect",
		scale = o.scale || "both",
		origin = o.origin || [ "middle", "center" ],
		position = el.css( "position" ),
		pos = el.position(),
		zero = {
			height: 0,
			width: 0,
			outerHeight: 0,
			outerWidth: 0
		},
		to = o.to || zero;

	$.effects.createPlaceholder( el );

	original = {
		height: el.height(),
		width: el.width(),
		outerHeight: el.outerHeight(),
		outerWidth: el.outerWidth()
	};
	from = o.from || original;

	if ( mode === "show" ) {
		temp = from;
		from = to;
		to = temp;
	}

	// Set scaling factor
	factor = {
		from: {
			y: from.height / original.height,
			x: from.width / original.width
		},
		to: {
			y: to.height / original.height,
			x: to.width / original.width
		}
	};

	// Scale the css box
	if ( scale === "box" || scale === "both" ) {

		// Vertical props scaling
		if ( factor.from.y !== factor.to.y ) {
			from = $.effects.setTransition( el, vProps, factor.from.y, from );
			to = $.effects.setTransition( el, vProps, factor.to.y, to );
		}

		// Horizontal props scaling
		if ( factor.from.x !== factor.to.x ) {
			from = $.effects.setTransition( el, hProps, factor.from.x, from );
			to = $.effects.setTransition( el, hProps, factor.to.x, to );
		}
	}

	// Scale the content
	if ( scale === "content" || scale === "both" ) {

		// Vertical props scaling
		if ( factor.from.y !== factor.to.y ) {
			from = $.effects.setTransition( el, cProps, factor.from.y, from );
			to = $.effects.setTransition( el, cProps, factor.to.y, to );
		}
	}

	// Adjust the position properties based on the provided origin points
	if ( origin ) {
		baseline = $.effects.getBaseline( origin, original );
		from.top = ( original.outerHeight - from.outerHeight ) * baseline.y + pos.top;
		from.left = ( original.outerWidth - from.outerWidth ) * baseline.x + pos.left;
		to.top = ( original.outerHeight - to.outerHeight ) * baseline.y + pos.top;
		to.left = ( original.outerWidth - to.outerWidth ) * baseline.x + pos.left;
	}
	el.css( from );

	// Animate the children if desired
	if ( scale === "content" || scale === "both" ) {

		vProps = vProps.concat([ "marginTop", "marginBottom" ]).concat( cProps );
		hProps = hProps.concat([ "marginLeft", "marginRight" ]);

		// only animate children with width attributes specified
		// TODO: is this right? should we include anything with css width specified as well
		el.find( "*[width]" ).each( function() {
			var child = $( this ),
				c_original = {
					height: child.height(),
					width: child.width(),
					outerHeight: child.outerHeight(),
					outerWidth: child.outerWidth()
				};

			if (restore) {
				$.effects.saveStyle( child );
			}

			child.from = {
				height: c_original.height * factor.from.y,
				width: c_original.width * factor.from.x,
				outerHeight: c_original.outerHeight * factor.from.y,
				outerWidth: c_original.outerWidth * factor.from.x
			};
			child.to = {
				height: c_original.height * factor.to.y,
				width: c_original.width * factor.to.x,
				outerHeight: c_original.height * factor.to.y,
				outerWidth: c_original.width * factor.to.x
			};

			// Vertical props scaling
			if ( factor.from.y !== factor.to.y ) {
				child.from = $.effects.setTransition( child, vProps, factor.from.y, child.from );
				child.to = $.effects.setTransition( child, vProps, factor.to.y, child.to );
			}

			// Horizontal props scaling
			if ( factor.from.x !== factor.to.x ) {
				child.from = $.effects.setTransition( child, hProps, factor.from.x, child.from );
				child.to = $.effects.setTransition( child, hProps, factor.to.x, child.to );
			}

			// Animate children
			child.css( child.from );
			child.animate( child.to, o.duration, o.easing, function() {

				// Restore children
				if ( restore ) {
					$.effects.restoreStyle( child );
				}
			});
		});
	}

	// Animate
	el.animate( to, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: function() {

			var offset = el.offset();

			if ( to.opacity === 0 ) {
				el.css( "opacity", from.opacity );
			}

			if ( !restore ) {
				el.css( "position", position === "static" ? "relative" : position );

				el.offset( offset );

				// Need to save style here so that automatic style restoration
				// doesn't restore to the original styles from before the animation.
				$.effects.saveStyle( el );
			}

			done();
		}
	});

});

}));
