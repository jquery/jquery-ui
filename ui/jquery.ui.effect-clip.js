/*!
 * jQuery UI Effects Clip @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/clip-effect/
 *
 * Depends:
 *	jquery.ui.effect.js
 */
(function( $, undefined ) {

var clipRegex = /^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s+(-?\d*\.?\d*px|-?\d+%|auto),?\s+(-?\d*\.?\d*px|-?\d+%|auto),?\s+(-?\d*\.?\d*px|-?\d+%|auto)\)$/,
	parseClip = function( el ) {
		var str = el.css("clip"),
			outerWidth = el.outerWidth(),
			outerHeight = el.outerHeight(),
			values = clipRegex.exec( str ) || [ "", 0, outerWidth, outerHeight, 0 ];

		return {
			top: parseFloat( values[ 1 ] ) || 0 ,
			right: parseFloat( values[ 2 ] ) || outerWidth,
			bottom: parseFloat( values[ 3 ] ) || outerHeight,
			left: parseFloat( values[ 4 ] ) || 0
		};
	};

$.effects.effect.clip = function( o, done ) {
	var start, end, placeholder, temp, position,
		el = $( this ),
		props = [ "display", "position", "left", "right", "width", "height", "clip" ],
		mode = $.effects.setMode( el, o.mode || "hide" ),
		show = mode === "show",
		direction = o.direction || "vertical",
		both = direction === "both",
		horizontal = both || direction === "horizontal",
		vertical = both || direction === "vertical";

	if ( show ) {
		el.show();
	}

	position = el.position();
	start = parseClip( el );
	end = {
		top: vertical ? ( start.bottom - start.top ) / 2 : start.top,
		right: horizontal ? ( start.right - start.left ) / 2 : start.right,
		bottom: vertical ? ( start.bottom - start.top ) / 2 : start.bottom,
		left: horizontal ? ( start.right - start.left ) / 2 : start.left
	};

	$.effects.save( el, props );

	placeholder = $.effects.createPlaceholder( el );

	el.css({
		position: placeholder ? "absolute" : el.css("position"),
		left: position.left,
		top: position.top
	})
	.outerWidth( el.outerWidth(true), true )
	.outerHeight( el.outerHeight(true), true );

	if ( show ) {
		temp = start;
		start = end;
		end = temp;
	}

	$( start ).animate( end, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		step: function() {
			el.css( "clip", "rect(" + this.top + "px " + this.right + "px " + this.bottom + "px " + this.left + "px)" );
		},
		complete: function() {
			$.effects.restore( el, props );

			if ( placeholder ) {
				placeholder.remove();
			}
			if ( !show ) {
				el.hide();
			}

			done();
		}
	});

};

})(jQuery);
