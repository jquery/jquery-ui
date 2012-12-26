/*!
 * jQuery UI Effects Fade @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Fade Effect
//>>group: Effects
//>>description: Fades the element.
//>>docs: http://api.jqueryui.com/fade-effect/
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

$.effects.define( "fade", "toggle", function( o, done ) {
	$( this ).animate({
		opacity: o.mode
	}, {
		queue: false,
		duration: o.duration,
		easing: o.easing,
		complete: done
	});
});

}));
