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

$.effects.effect.clip = function( o, done ) {
	// Create element
	var end, delta,
		el = $( this ),
		props = [ "display", "position", "clip" ],
		mode = $.effects.setMode( el, o.mode || "hide" ),
		show = mode === "show",
		direction = o.direction || "vertical",
		vert = direction === "vertical",
		size = vert ? "height" : "width",
		position = el.css("position"),
		display = el.css("display"),
		width = el.outerWidth(),
		height = el.outerHeight(),
		regex = /^rect\((\d+px|\d+%|auto),? (\d+px|\d+%|auto),? (\d+px|\d+%|auto),? (\d+px|\d+%|auto)\)$/,
		start = regex.exec( el.css("clip") ) || ["", 0, width, height, 0],
		shadow = null;

	// Save & Show
	$.effects.save( el, props );

	start = {
		top: start[ 1 ] === "auto" ? 0 : parseInt( start[ 1 ], 10 ),
		right: start[ 2 ] === "auto" ? width : parseInt( start[ 2 ], 10 ),
		bottom: start[ 3 ] === "auto" ? height : parseInt( start[ 3 ], 10 ),
		left: start[ 4 ] === "auto" ? 0 : parseInt( start[ 4 ], 10 ),
	};

	end = {
		top: (start.bottom - start.top) / 2,
		right: (start.right - start.left) / 2,
		bottom: (start.bottom - start.top) / 2,
		left: (start.right - start.left) / 2
	};

	delta = {
		top: end.top - start.top,
		right: end.right - start.right,
		bottom: end.bottom - start.bottom,
		left: end.left - start.left,
	};

	if (
		display === "inline" || display === "inline-block" || 
		display === "inline-table" || display === "ruby" || 
		display === "run-in" || display === "compact"
	) {
		display = "inline-block";
	} else {
		display = "block";
	}

	if (position === "static" || position === "relative") {
		shadow = $("<div>").css({
			display: display,
			visibility: "hidden",
			width: width,
			height: height
		}).insertAfter( el );
	}

	el.css({
		position: "absolute",
		left: el.offset().left,
		top: el.offset().top
	});

	// Animate
	$({ a : 0 }).animate( { a : 1 }, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		step: function( now ) {
			var top = start.top + (now * delta.top),
				right = start.right + (now * delta.right),
				bottom = start.bottom + (now * delta.bottom),
				left = start.left + (now * delta.left);
			
			el.css( "clip", "rect(" + top + "px " + right + "px " + bottom + "px " + left + "px)" );
		},
		complete: function() {
			if ( !show ) {
				el.hide();
			}
			if ( shadow ) {
				shadow.remove();
			}
			$.effects.restore( el, props );
			done();
		}
	});

};

})(jQuery);
