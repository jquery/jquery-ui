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

$.effects.define( "size", function( o, done ) {

	// Create element
	var baseline, factor, temp,
		el = $( this ),

		// Copy for children
		cProps = [ "fontSize" ],
		vProps = [ "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom" ],
		hProps = [ "borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight" ],

		// Set options
		mode = o.mode,
		restore = o.restore || mode !== "effect",
		scale = o.scale || "both",
		origin = o.origin || [ "top", "left" ],
		position = el.css( "position" ),
		pos = el.position(),
		zero = {
			height: 0,
			width: 0,
			outerHeight: 0,
			outerWidth: 0
		},

		placeholder = $.effects.createPlaceholder( el ),

		original = {
			height: el.height(),
			width: el.width(),
			outerHeight: el.outerHeight(),
			outerWidth: el.outerWidth()
		},
		from = o.from || original,
		to = o.to || zero;

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

			if ( restore ) {
				$.effects.removePlaceholder( placeholder, el );
			}

			if ( to.opacity === 0 ) {
				el.css( "opacity", from.opacity );
			}
			if ( mode === "hide" ) {
				el.hide();
			}

			if ( !restore ) {

				// we need to calculate our new positioning based on the scaling
				if ( position === "static" ) {
					el.css({
						position: "relative",
						top: to.top,
						left: to.left
					});
				} else {
					$.each([ "top", "left" ], function( idx, pos ) {
						el.css( pos, function( _, str ) {
							var val = parseInt( str, 10 ),
								toRef = idx ? to.left : to.top;

							// if original was "auto", recalculate the new value from placeholder
							if ( str === "auto" ) {
								return toRef + "px";
							}

							return val + toRef + "px";
						});
					});
				}

				// the placeholder needs to be removed only after the new position is set
				// as it's relied upon for correcting "auto" above
				$.effects.removePlaceholder( placeholder, el );
			}

			done();
		}
	});

});

}));
