/*!
 * jQuery UI Time Picker @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Timepicker
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.button.js
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
		tt: function( value ) {
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
			_trimValue: function( value ) {
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
	_generateMask: function() {
		var mask = "";

		if ( window.Globalize ) {
			mask = Globalize.culture().calendars.standard.patterns[ this.options.seconds ? "T" : "t" ];
			mask = mask.replace( rsingleh, "_$1" );

			// if the culture doesn't understand AM/PM - don't let timepickers understand it either.
			if ( mask.indexOf( "tt" ) == -1 ) {
				this.options.ampm = false;
			} else if ( !this.options.ampm ) {
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
	_events: {
		keydown: "_checkPosition",
		focus: "_checkPosition",
		click: "_checkPosition"
	},
	_checkPosition: function( event ) {

		function check() {
			var position = this.mask._caret();
			this._setField( Math.floor( position.begin / 3 ) );
		}

		if ( event.type == "keydown" ) {
			check.call( this );
		} else {
			this._delay( check, 0 );
		}
	},
	_setField: function( field ) {
		this.currentField = field;
		switch( field ) {
			case 0:
				this.spinner.options.min = this.options.ampm ? 1 : 0;
				this.spinner.options.max = this.options.ampm ? 12 : 23;
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
		var was = this.options[ key ];
		this._super( "_setOption", key, value );

		if ( was === value ) {
			return;
		}

		if ( key === "ampm" ) {
			var i, currentHour, currentTT,
				ampm = getAmPmArrays(),
				buffer = this.mask.buffer,
				newMask = this._generateMask();

			// in the event that ampm was forced off due to locale, we need to check this again
			if ( this.options.ampm === was ) {
				return;
			}

			currentHour = parseInt( buffer[ 0 ].value, 10 );
			for ( i = 0; i < buffer.length; i += 3 ) {
				if ( buffer[ i ].valid === maskDefinitions.tt ) {
					currentHour %= 12;
					if ( jQuery.inArray( buffer[ i ].value, ampm.pm ) > -1 ) {
						currentHour += 12;
					}
				}
			}
			if ( this.options.ampm ) {
				currentTT = currentHour > 11 ? ampm.pm[0] : ampm.am[0];
				currentHour = ( currentHour % 12 ) || 12;
				buffer[ 0 ].value = ( currentHour < 10 ? "0" : "" ) + currentHour;
				this.mask._paint();
				this.element.val( this.element.val() + " " + currentTT );
			} else {
				currentHour = currentHour % 24;
				buffer[ 0 ].value = ( currentHour < 10 ? "0" : "" ) + currentHour;
				this.mask._paint();
			}
			this.element.mask( "option", "mask", this._generateMask() );
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
		bufferObject.value = bufferObject.valid( val );
		this.mask._paint();
		this.spinner._refresh();
		this.mask._caretSelect( this.currentField * 3 );
	},
	destroy: function() {
		this.element.mask( "destroy" );
		this.element.spinner( "destroy" );
		this._super( "destroy" );
	}
});

}( jQuery ));