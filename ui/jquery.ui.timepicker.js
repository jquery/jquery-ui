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

function sixty( value ) {
	if ( !value ) {
		return "00";
	}
	value = parseInt( value, 10 );
	if ( value >= 0 && value <= 59 ) {
		return ( value < 10 ? "0" : "" ) + value;
	}
}

var maskDefinitions = {
	hh: function( value ) {
		if ( value === "" ) {
			return "12";
		}
		value = parseInt( value, 10 );
		if ( value >= 1 && value <= 12 ) {
			return ( value < 10 ? "0" : "" ) + value;
		}
	},
	HH: function( value ) {
		if ( value === "" ) {
			return "12";
		}
		value = parseInt( value, 10 );
		if ( value >= 0 && value <= 23 ) {
			return ( value < 10 ? "0" : "" ) + value;
		}
	},
	mm: sixty,
	ss: sixty,
	tt: function( value ) {
		if ( value === "" ) {
			return "pm";
		}
		var lower = value.toLowerCase(),
			character = lower.charAt( 0 );
		if ( lower.length > 1 && lower.charAt( 1 ) !== "m" ) {
			return false;
		}
		switch ( character ) {
		case "a":
			return "am";
		case "p":
			return "pm";
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
			var i, buffer, currentHour, currentTT;
			buffer = this.mask.buffer;
			currentHour = parseInt( buffer[ 0 ].value, 10 );
			for ( i = 0; i < buffer.length; i += 3 ) {
				if ( buffer[ i ].valid === maskDefinitions.tt ) {
					currentHour %= 12;
					if ( buffer[ i ].value === "pm" ) {
						currentHour += 12;
					}
				}
			}
			if ( value ) {
				currentTT = currentHour > 11 ? "pm" : "am";
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
			return val === "am" ? 0 : 1;
		}
		return parseInt( val, 10 ) || 0;
	},
	_spinnerValue: function( val ) {
		var bufferObject = this.mask.buffer[ this.currentField * 3 ];
		if ( this.currentField === ( this.options.seconds ? 3 : 2 ) ) {
			val = parseInt( val, 10 ) ? "pm" : "am";
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