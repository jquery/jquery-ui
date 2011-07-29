/*!
 * jQuery UI Mask @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mask
 */
(function( $, undefined ) {

$.widget( "ui.mask", {
	version: "@VERSION",
	defaultElement: "<input>",
	options: {
		definitions: {
			'9': /[0-9]/,
			'a': /[A-Za-z]/,
			'*': /[A-Za-z0-9]/
		},
		mask: null,
		placeholder: "_"
	},
	_create: function() {
		this._parseMask();
	},

	// helper function to get or set position of text cursor (caret)
	_caret: function( begin, end ) {
		var range,
			elem = this.element,
			dom = elem[0];

		// if begin is defined, we are setting a range
		if ( begin !== undefined ) {
			end = ( end === undefined ) ? begin : end;
			if ( dom.setSelectionRange ) {
				dom.setSelectionRange( begin, end );
			} else if ( dom.createTextRange ) {
				range = dom.createTextRange();
				range.collapse( true );
				range.moveEnd( "character", end );
				range.moveStart( "character", begin );
				range.select();
			}
		} else {

			// begin is undefined, we are reading the range
			if ( dom.setSelectionRange ) {
				begin = dom.selectionStart;
				end = dom.selectionEnd;
			} else if ( document.selection && document.selection.createRange ) {
				range = document.selection.createRange();

				// the moveStart returns the number of characters it moved as a negative number
				begin = 0 - range.duplicate().moveStart( "character", -100000 );
				end = begin + range.text.length;
			}
			return {
				begin: begin,
				end: end
			};
		}
	},
	_parseMask: function() {
		var key, x, bufferObject,
			index = -1,
			options = this.options,
			mask = options.mask ;

		this.buffer = [];
		if ( !mask ) {
			return;
		}
		// search for definied "masks"
		for ( key in options.definitions ) {
			while ( ( index = mask.indexOf( key, index + 1 ) ) > -1 ) {
				bufferObject = {
					start: index,
					length: key.length,
					valid: options.definitions[ key ]
				};
				for ( x = index ; x < index + key.length ; x++ ) {
					this.buffer[ x ] = bufferObject;
				}
			}
		}

		// anything we didn't find is a literal
		for ( index = 0 ; index < mask.length ; index++ ) {
			if ( !this.buffer[ index ] ) {
				this.buffer[ index ] = {
					start: index,
					literal: mask.charAt( index ),
					length: 1
				};
			}
		}
	}
});

}( jQuery ) );
