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

	return this.queue( function() {

		var rows = o.pieces ? Math.round(Math.sqrt(o.pieces)) : 3,
			cells = rows,
			el = $( this ).show().css( 'visibility', 'hidden' ),
			mode = $.effects.setMode( el, o.mode || 'hide' ),
			offset = el.offset(),
			width = el.outerWidth( true ),
			height = el.outerHeight( true );

		//Substract the margins - not fixing the problem yet.
		offset.top -= parseInt( el.css( "marginTop" ), 10 ) || 0;
		offset.left -= parseInt( el.css( "marginLeft" ), 10 ) || 0;

		for( var i = 0; i < rows ; i++ ) { // =
			for( var j = 0; j < cells ; j++ ) { // ||
				el
					.clone()
					.appendTo('body')
					.wrap('<div></div>')
					.css({
						position: 'absolute',
						visibility: 'visible',
						left: -j*(width/cells),
						top: -i*(height/rows)
					})
					.parent()
					.addClass('ui-effects-explode')
					.css({
						position: 'absolute',
						overflow: 'hidden',
						width: width/cells,
						height: height/rows,
						left: offset.left + j*(width/cells) + (o.mode == 'show' ? (j-Math.floor(cells/2))*(width/cells) : 0),
						top: offset.top + i*(height/rows) + (o.mode == 'show' ? (i-Math.floor(rows/2))*(height/rows) : 0),
						opacity: mode == 'show' ? 0 : 1
					}).animate({
						left: offset.left + j*(width/cells) + (o.mode == 'show' ? 0 : (j-Math.floor(cells/2))*(width/cells)),
						top: offset.top + i*(height/rows) + (o.mode == 'show' ? 0 : (i-Math.floor(rows/2))*(height/rows)),
						opacity: mode == 'show' ? 1 : 0
					}, o.duration || 500);
			}
		}

		// Set a timeout, to call the callback approx. when the other animations have finished
		setTimeout(function() {

			el.css({ visibility: 'visible' });
			mode != 'show' && el.hide();
			$.isFunction( o.complete ) && o.complete.apply( el[ 0 ] );
			el.dequeue();

			// Note: This is removing all exploding peices from the dom, rather than the ones for this animation only... Ticket# 6022
			$('div.ui-effects-explode').remove();
		}, o.duration || 500);


	});

};

})(jQuery);
