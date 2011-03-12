/*
 * jQuery UI Effects Explode @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Effects/Explode
 *
 * Depends:
 *	jquery.effects.core.js
 */
(function( $, undefined ) {

$.effects.explode = function( o ) {

	return this.queue( function( next ) {

		var rows = o.pieces ? Math.round(Math.sqrt(o.pieces)) : 3,
			cells = rows,
			el = $( this ),
			mode = $.effects.setMode( el, o.mode || 'hide' ),
			show = ( mode == 'show' ),

			// show and then visibility:hidden the element before calculating offset
			offset = el.show().css( 'visibility', 'hidden' ).offset(),

			// width and height of a piece
			width = Math.ceil( el.outerWidth() / cells ),
			height = Math.ceil( el.outerHeight() / rows ),
			peices = [],
			i, j, pos;

		// clone the element for each row and cell.
		for( i = 0; i < rows ; i++ ) { // ===>
			for( j = 0; j < cells ; j++ ) { // |||
				pos = {
					// wrapper base position in body
					left: offset.left + j * width,
					top: offset.top + i * height,

					// x position in matrix with 0,0 at the center
					rx: j - cells / 2,
					ry: i - rows / 2
				};

				// Create a clone of the now hidden main element that will be absolute positioned
				// within a wrapper div off the -left and -top equal to size of our pieces
				el
					.clone()
					.appendTo( 'body' )
					.wrap( '<div></div>' )
					.css({
						position: 'absolute',
						visibility: 'visible',
						left: -j * width,
						top: -i * height
					})

				// select the wrapper - make it overflow: hidden and absolute positioned based on
				// where the original was located +left and +top equal to the size of pieces
					.parent()
					.addClass( 'ui-effects-explode' )
					.css({
						position: 'absolute',
						overflow: 'hidden',
						width: width,
						height: height,
						left: pos.left + ( show ? pos.rx * width : 0 ),
						top: pos.top + ( show ? pos.ry * height : 0 ),
						opacity: show ? 0 : 1
					}).animate({
						left: pos.left + ( show ? 0 : pos.rx * width ),
						top: pos.top + ( show ? 0 : pos.ry * height ),
						opacity: show ? 1 : 0
					}, o.duration || 500, o.easing, childComplete );
			}
		}

		// children animate complete:
		function childComplete() {
			peices.push( this );
			if ( peices.length == rows * cells ) {
				animComplete();
			}
		}

		function animComplete() {
			el.css({
				visibility: 'visible'
			});
			$( peices ).remove();
			if ( !show ) {
				el.hide();
			}
			if ( $.isFunction( o.complete ) ) {
				o.complete.apply( el[ 0 ] );
			}
			next();
		}
	});

};

})(jQuery);
