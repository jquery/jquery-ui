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

// a wrapper function for Globalize integration
function getAmPmArrays() {
	if ( window.Globalize ) {
		var calendar = Globalize.culture().calendars.standard;

		return {
			am: calendar.AM,
			pm: calendar.PM
		};
	} else {
		return {
			am: [ "AM", "am" ],
			pm: [ "PM", "pm" ]
		};
	}
}

function validAmPm( value ) {
	var i, j, l,
		valid = getAmPmArrays();

	if ( value === "" ) {
		return valid.pm && valid.pm[0];
	}

	for ( i in valid ) {
		for ( j = 0, l = valid[ i ].length; j < l; j++ ) {
			if ( valid[ i ][ j ].substr( 0, value.length ) === value ) {
				return valid[ i ][ 0 ];
			}
		}
	}
}

var rsingleh = /\b(h)(?=:)/i,
	rlowerhg = /h/g,
	maskDefinitions = {
		_h: makeBetweenMaskFunction( 1, 12, "12", " " ),
		hh: makeBetweenMaskFunction( 1, 12, "12", "0" ),
		_H: makeBetweenMaskFunction( 0, 23, "12", " " ),
		HH: makeBetweenMaskFunction( 0, 23, "12", "0" ),
		mm: makeBetweenMaskFunction( 0, 59, "00", "0" ),
		ss: makeBetweenMaskFunction( 0, 59, "00", "0" ),
		tt: validAmPm
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
			definitions: maskDefinitions
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
		this._bind( this._events );
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
			ampm = getAmPmArrays();

		if ( value == null ) {

			// storing the hours as a number until the very end
			value = [ 0, "00", "00" ];
			for ( bufferIndex = 0; bufferIndex < bufferLength; bufferIndex += 3 ) {
				bufferObject = buffer[ bufferIndex ];
				if (
					bufferObject.valid == maskDefinitions._h || bufferObject.valid == maskDefinitions.hh ||
					bufferObject.valid == maskDefinitions._H || bufferObject.valid == maskDefinitions.HH
				) {
					value[ 0 ] = parseInt( bufferObject.value, 10 );
				} else if ( bufferObject.valid == maskDefinitions.mm ) {
					value[ 1 ] = bufferObject.value;
				} else if ( bufferObject.valid == maskDefinitions.ss ) {
					value[ 2 ] = bufferObject.value;
				} else if ( bufferObject.valid == maskDefinitions.tt ) {
					value[ 0 ] %= 12;
					if ( jQuery.inArray( bufferObject.value, ampm.pm ) > -1 ) {
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
				if ( bufferObject.valid == maskDefinitions._h || bufferObject.valid == maskDefinitions.hh ) {

					// 12 hr mode
					bufferObject.value = bufferObject.valid( parseInt( value[0], 10 ) % 12 || 12 );
				} else if ( bufferObject.valid == maskDefinitions.tt ) {

					// am/pm
					bufferObject.value = ampm[ parseInt( value[0], 10 ) < 12 ? "am" : "pm" ][ 0 ];
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
	_generateMask: function() {
		var mask = "";

		if ( window.Globalize ) {
			mask = Globalize.culture().calendars.standard.patterns[ this.options.seconds ? "T" : "t" ];
			mask = mask.replace( rsingleh, "_$1" );

			if ( !this.options.ampm ) {
				mask = mask.replace( rlowerhg, "H" ).replace( " tt", "" );
			}

			return mask;
		}

		mask += this.options.ampm ? "hh" : "HH";
		mask += ":mm";
		if ( this.options.seconds ) {
			mask += ":ss";
		}
		if ( this.options.ampm ) {
			mask += " tt";
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
	_setOption: function( key, value ) {
		this._super( "_setOption", key, value );

		if ( key === "ampm" ) {
			var currentValue = this.value(),
				newMask = this._generateMask();

			this.element.mask( "option", "mask", this._generateMask() );
			this.value( currentValue );
		}
		if ( key === "seconds" ) {
			if ( value ) {
				this.element.val( function( index, value ) {
					return value.substr( 0, 6 ) + ":00" + value.substr( 6 );
				});
			} else {
				this.element.val( function( index, value ) {
					return value.substr( 0, 6 ) + value.substr( 9 );
				});
			}
			this.element.mask( "option", "mask", this._generateMask() );
		}
	},
	_spinnerParse: function( val ) {
		val = this.mask.buffer[ this.currentField * 3 ].value;
		if ( this.currentField === ( this.options.seconds ? 3 : 2 ) ) {
			return jQuery.inArray( val, getAmPmArrays().am ) > -1 ? 0 : 1;
		}
		return parseInt( val, 10 ) || 0;
	},
	_spinnerValue: function( val ) {
		var bufferObject = this.mask.buffer[ this.currentField * 3 ];
		if ( this.currentField === ( this.options.seconds ? 3 : 2 ) ) {
			val = getAmPmArrays()[ parseInt( val, 10 ) ? "pm" : "am" ][ 0 ];
		}
		bufferObject.value = bufferObject.valid( val + "" );
		this.mask._paint();
		this.spinner._refresh();
		this.mask._caretSelect( this.currentField * 3 );
	}
});

}( jQuery ));