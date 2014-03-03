/*!
 * jQuery UI Effects Puff @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Puff Effect
//>>group: Effects
//>>description: Creates a puff effect by scaling the element up and hiding it at the same time.
//>>docs: http://api.jqueryui.com/puff-effect/
//>>demos: http://jqueryui.com/effect/

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./effect",
			"./effect-scale"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

$.effects.define( "puff", "hide", function( o, done ) {
	var options = $.extend( true, {}, o, {
		fade: true,
		percent: parseInt( o.percent, 10 ) || 150
	});

	$.effects.effect.scale.call( this, options, done );
});

}));
