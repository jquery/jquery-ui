/*!
 * jQuery UI Effects Pulsate @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Pulsate Effect
//>>group: Effects
//>>description: Pulsates an element n times by changing the opacity to zero and back.
//>>docs: http://api.jqueryui.com/pulsate-effect/
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

return $.effects.define( "pulsate", "show", function( o, done ) {
	var elem = $( this ),
		mode = o.mode,
		show = mode === "show",
		hide = mode === "hide",
		showhide = ( show || hide ),

		// showing or hiding leaves off the "last" animation
		anims = ( ( o.times || 5 ) * 2 ) + ( showhide ? 1 : 0 ),
		duration = o.duration / anims,
		animateTo = 0,
		i = 1,
		queuelen = elem.queue().length;

	if ( show || !elem.is( ":visible" ) ) {
		elem.css( "opacity", 0 ).show();
		animateTo = 1;
	}

	// anims - 1 opacity "toggles"
	for ( ; i < anims; i++ ) {
		elem.animate( { opacity: animateTo }, duration, o.easing );
		animateTo = 1 - animateTo;
	}

	elem.animate( { opacity: animateTo }, duration, o.easing);

	elem.queue( done );

	$.effects.unshift( elem, queuelen, anims + 1 );
});

}));
