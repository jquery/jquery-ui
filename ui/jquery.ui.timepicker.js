/*!
 * jQuery UI Time Picker @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.spinner.js
 *	jquery.ui.mask.js
 *
 */
(function( $, undefined ) {

function makeBetweenMaskFunction( min, max, def, pad ) {
	return function( value ) {
		if ( !value ) {
			return def;
		}
		value = parseInt( value, 10 );
		if ( value >= min && value <= max ) {
			return ( value < 10 ? pad : "" ) + value;
		}
	};
}

var formatNonPaddedHours = /\b(h)(?=:)/i,
	format12Hour = /h/g,
	maskDefinitions = {
		_h: makeBetweenMaskFunction( 1, 12, "12", " " ),
		hh: makeBetweenMaskFunction( 1, 12, "12", "0" ),
		_H: makeBetweenMaskFunction( 0, 23, "12", " " ),
		HH: makeBetweenMaskFunction( 0, 23, "12", "0" ),
		mm: makeBetweenMaskFunction( 0, 59, "00", "0" ),
		ss: makeBetweenMaskFunction( 0, 59, "00", "0" )
	};

$.widget( "ui.timepicker", {
	version: "@VERSION",
	defaultElement: "<input>",
	options: {
		ampm: true,
		seconds: true
	},
	_create: function() {

		// handles globalization options
		this.element.mask({
			mask: this._generateMask(),
			clearEmpty: false,
			definitions: $.extend({
				tt: $.proxy( this, "_validAmPm" )
			}, maskDefinitions )
		});
		this.mask = this.element.data( "mask" );
		this.element.spinner();
		this.spinner = this.element.data( "spinner" );
		$.extend( this.spinner, {
			_parse: $.proxy( this, "_spinnerParse" ),
			_value: $.proxy( this, "_spinnerValue" ),
			_adjustValue: function( value ) {

				// if under min, return max - if over max, return min
				if ( value < this.options.min ) {
					return this.options.max;
				}
				if ( value > this.options.max ) {
					return this.options.min;
				}
				return value;
			}
		});
		this._setField( 0 );
		this._on( this._events );
	},
	_destroy: function() {
		this.element.mask( "destroy" );
		this.element.spinner( "destroy" );
	},

	refresh: function() {
		this.mask.refresh();
	},

	// getter/setter for the current state of the input as a "valid time string"
	// http://dev.w3.org/html5/spec/common-microsyntaxes.html#times
	value: function( value ) {
		var bufferIndex, bufferObject,
			buffer = this.mask.buffer,
			bufferLength = buffer.length,
			maskDefinitions = this.mask.options.definitions,
			ampm = this._getCulture();

		if ( value == null ) {

			// storing the hours as a number until the very end
			value = [ 0, "00", "00" ];
			for ( bufferIndex = 0; bufferIndex < bufferLength; bufferIndex += 3 ) {
				bufferObject = buffer[ bufferIndex ];
				if (
					bufferObject.valid === maskDefinitions._h || bufferObject.valid === maskDefinitions.hh ||
					bufferObject.valid === maskDefinitions._H || bufferObject.valid === maskDefinitions.HH
				) {
					value[ 0 ] = parseInt( bufferObject.value, 10 );
				} else if ( bufferObject.valid === maskDefinitions.mm ) {
					value[ 1 ] = bufferObject.value;
				} else if ( bufferObject.valid === maskDefinitions.ss ) {
					value[ 2 ] = bufferObject.value;
				} else if ( bufferObject.valid === maskDefinitions.tt ) {
					value[ 0 ] %= 12;
					if ( jQuery.inArray( bufferObject.value, ampm.PM ) > -1 ) {
						value[ 0 ] += 12;
					}
				}
			}

			// pads with zeros
			value[ 0 ] = maskDefinitions.HH( "" + value[ 0 ] );
			return value.join( ":" );
		} else {

			// setter for values
			value = value.split( ":" );
			for ( bufferIndex = 0; bufferIndex < bufferLength; bufferIndex += 3 ) {
				bufferObject = buffer[ bufferIndex ];
				if ( bufferObject.valid === maskDefinitions._h || bufferObject.valid === maskDefinitions.hh ) {

					// 12 hr mode
					bufferObject.value = bufferObject.valid( parseInt( value[0], 10 ) % 12 || 12 );
				} else if ( bufferObject.valid === maskDefinitions.tt ) {

					// am/pm
					bufferObject.value = ampm[ parseInt( value[0], 10 ) < 12 ? "AM" : "PM" ][ 0 ];
				} else {

					// minutes/seconds
					bufferObject.value = bufferObject.valid( value[ bufferIndex / 3 ] );
				}
			}

			// repaint the values
			this.mask._paint();
		}
	},

	_events: {
		click: "_checkPosition",
		keydown: "_checkPosition"
	},
	_checkPosition: function( event ) {
		var position = this.mask._caret(),
			field = Math.floor( position.begin / 3 );

		this._setField( field );

		// if the cursor is left of the first field, ensure that the selection
		// covers the first field to make overtyping make more sense
		if ( position.begin === position.end && position.begin === 0 ) {
			this.mask._caret( 0, 2 );
		}

		// after detecting the new position on a click, we should highlight the new field
		if ( event.type === "click" ) {
			this._highlightField();
		}
	},
	_getCulture: function() {
		if ( window.Globalize ) {
			return Globalize.culture( this.options.culture ).calendars.standard;
		} else {

			// minimal calendar object for timepicker
			return {
				patterns: {
					t: "h:mm tt",
					T: "h:mm:ss tt"
				},
				AM: [ "AM", "am" ],
				PM: [ "PM", "pm" ]
			};
		}
	},
	_generateMask: function() {
		var mask = this._getCulture().patterns[ this.options.seconds ? "T" : "t" ];

		mask = mask.replace( formatNonPaddedHours, "_$1" );

		if ( !this.options.ampm ) {
			mask = mask.replace( format12Hour, "H" ).replace( " tt", "" );
		}

		return mask;
	},
	_highlightField: function( field ) {
		this.mask._caretSelect( this.currentField * 3 );
	},
	_setField: function( field ) {
		this.currentField = field;
		switch( field ) {
			case 0:
				if ( this.options.ampm && this.mask.options.mask.indexOf( "h" ) ) {
					this.spinner.options.min = 1;
					this.spinner.options.max = 12;
				} else {
					this.spinner.options.min = 0;
					this.spinner.options.max = 23;
				}
				break;
			case 1:
			case this.options.seconds ? 2 : -1 :
				this.spinner.options.min = 0;
				this.spinner.options.max = 59;
				break;
			case this.options.seconds ? 3 : 2 :
				this.spinner.options.min = 0;
				this.spinner.options.max = 1;
				break;
		}
	},
	_setOptions: function( options ) {

		var currentValue = this.value();

		// change the option
		this._super( options );

		// update the mask, all of the option changes have a chance of changing it
		this.element.mask( "option", "mask", this._generateMask() );

		// restore the value from before the option changed
		this.value( currentValue );
	},
	_spinnerParse: function( val ) {
		val = this.mask.buffer[ this.currentField * 3 ].value;
		if ( this.currentField === ( this.options.seconds ? 3 : 2 ) ) {
			return jQuery.inArray( val, this._getCulture().AM ) > -1 ? 0 : 1;
		}
		return parseInt( val, 10 ) || 0;
	},
	_spinnerValue: function( val ) {
		var bufferObject = this.mask.buffer[ this.currentField * 3 ];
		if ( this.currentField === ( this.options.seconds ? 3 : 2 ) ) {
			val = this._getCulture()[ parseInt( val, 10 ) ? "PM" : "AM" ][ 0 ];
		}
		bufferObject.value = bufferObject.valid( val + "" );
		this.mask._paint();
		this.spinner._refresh();
		this.mask._caretSelect( this.currentField * 3 );
	},
	_validAmPm: function( val ) {
		var ampm, j, l,
			valid = this._getCulture();

		if ( val === "" ) {
			return valid.PM && valid.PM[0];
		}

		for ( ampm in { AM: 1, PM: 1 } ) {
			for ( j = 0, l = valid[ ampm ].length; j < l; j++ ) {
				if ( valid[ ampm ][ j ].substr( 0, val.length ) === val ) {
					return valid[ ampm ][ 0 ];
				}
			}
		}
	}
});

}( jQuery ));