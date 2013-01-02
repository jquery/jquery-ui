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

var clipRegex = /^rect\((-?\d*.?\d*px|-?\d+%|auto),?\s+(-?\d*.?\d*px|-?\d+%|auto),?\s+(-?\d*.?\d*px|-?\d+%|auto),?\s+(-?\d*.?\d*px|-?\d+%|auto)\)$/,
	parseClip = function( str, outerWidth, outerHeight ) {
		var clip,
			values = clipRegex.exec( str );
		
		if ( values ) {
			// Webkit getComputedStyle incorrectly returns "0px" for specified "auto" values, so we have to guess
			// https://bugs.webkit.org/show_bug.cgi?id=20454
			// Support: Chrome, Safari
			// @todo mpetrovich Determine support version numbers
			if ( values[ 2 ] === "0px" && values[ 2 ] <= values[ 4 ] ) {
				// right <= left
				values[ 2 ] = "auto";
			}
			if ( values[ 3 ] === "0px" && values[ 3 ] <= values[ 1 ] ) {
				// bottom <= top
				values[ 3 ] = "auto";
			}

			clip = {
				top: values[ 1 ] === "auto" ? 0 : parseInt( values[ 1 ], 10 ),
				right: values[ 2 ] === "auto" ? outerWidth : parseInt( values[ 2 ], 10 ),
				bottom: values[ 3 ] === "auto" ? outerHeight : parseInt( values[ 3 ], 10 ),
				left: values[ 4 ] === "auto" ? 0 : parseInt( values[ 4 ], 10 )
			};
		} else {
			// Default to no clip
			clip = {
				top: 0,
				right: outerWidth,
				bottom: outerHeight,
				left: 0
			};
		}

		return clip;
	};

$.effects.effect.clip = function( o, done ) {
	var width, height, outerWidth, outerHeight, offset, start, end, shadow, temp, display,
		el = $( this ),
		props = [ "display", "position", "left", "right", "width", "height", "clip" ],
		mode = $.effects.setMode( el, o.mode || "hide" ),
		show = mode === "show",
		direction = o.direction || "vertical",
		both = direction === "both",
		horizontal = both || direction === "horizontal",
		vertical = both || direction === "vertical",
		position = el.css("position");

	if ( show ) {
		el.show();
	}

	display = el.css("display");
	width = el.width();
	height = el.height();
	outerWidth = el.outerWidth();
	outerHeight = el.outerHeight();
	offset = el.position();
	start = parseClip( el.css("clip"), outerWidth, outerHeight );
	end = {
		top: vertical ? ( start.bottom - start.top ) / 2 : start.top,
		right: horizontal ? ( start.right - start.left ) / 2 : start.right,
		bottom: vertical ? ( start.bottom - start.top ) / 2 : start.bottom,
		left: horizontal ? ( start.right - start.left ) / 2 : start.left
	};

	if ( display === "inline" || display === "inline-block" || display === "inline-table" || display === "ruby" ) {
		display = "inline-block";
	} else {
		display = "block";
	}

	if ( position === "static" || position === "relative" ) {
		position = "absolute";

		// Since clip can only be applied to elements with position:absolute,
		// we need to create a stand-in for the non-absolutely positioned element being clipped
		shadow = $("<div>").css({
			display: display,
			visibility: "hidden",
			width: outerWidth,
			height: outerHeight
		}).insertAfter( el );
	}

	$.effects.save( el, props );

	el.css({
		position: position,
		left: offset.left,
		top: offset.top,
		width: width,
		height: height
	});

	if ( show ) {
		temp = start;
		start = end;
		end = temp;
		el.show();
	}

	$( start ).animate( end, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		step: function( now ) {
			el.css( "clip", "rect(" + this.top + "px " + this.right + "px " + this.bottom + "px " + this.left + "px)" );
		},
		complete: function() {
			$.effects.restore( el, props );

			if ( shadow ) {
				shadow.remove();
			}
			if ( !show ) {
				el.hide();
			}

			done();
		}
	});

};

})(jQuery);
