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

$.effects.effect.explode = function( o ) {

	return this.queue( function( next ) {

		var rows = o.pieces ? Math.round(Math.sqrt(o.pieces)) : 3,
			cells = rows,
			el = $.effects.$( this )
				.show()
				.css( 'visibility', 'hidden' ),
			mode = el.setMode( o.mode || 'hide' ),
			offset = el.offset(),
			width = el.outerWidth( true ),
			height = el.outerHeight( true ),
			peices = [];

		//Substract the margins - not fixing the problem yet.
		offset.top -= parseInt( el.css( "marginTop" ), 10 ) || 0;
		offset.left -= parseInt( el.css( "marginLeft" ), 10 ) || 0;

		// clone the element for each row and cell.
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
					}, o.duration || 500, childComplete );
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
			el.css({ visibility: 'visible' });
			$( peices ).remove();
			if ( mode != 'show' ) {
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
