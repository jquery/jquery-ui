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

$.effects.prefilter.clip = function( o ) {
	var el = $( this ),
		mode = $.effects.effectsMode( el, o.mode || "hide" );

	if ( mode === "show" ) {
		el.show();
	}

	$.effects.saveStyle( el );
	$.effects.saveStyle( el.parent() );
};

$.effects.effect.clip = function( o, done ) {
	var start, placeholder,
		animate = {},
		el = $( this ),
		show = $.effects.effectsMode( el ) === "show",
		direction = o.direction || "vertical",
		both = direction === "both",
		horizontal = both || direction === "horizontal",
		vertical = both || direction === "vertical";

	start = el.cssClip();
	animate.clip = {
		top: vertical ? ( start.bottom - start.top ) / 2 : start.top,
		right: horizontal ? ( start.right - start.left ) / 2 : start.right,
		bottom: vertical ? ( start.bottom - start.top ) / 2 : start.bottom,
		left: horizontal ? ( start.right - start.left ) / 2 : start.left
	};

	placeholder = $.effects.createPlaceholder( el );

	if ( show ) {
		el.cssClip( animate.clip );
		animate.clip = start;
	}

	el.animate( animate, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: function() {

			$.effects.removePlaceholder( placeholder, el );

			if ( !show ) {
				el.hide();
			}

			done();
		}
	});

};

})(jQuery);
