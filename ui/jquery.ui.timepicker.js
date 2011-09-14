/*!
 * jQuery UI Time Picker @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mask
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
	value = parseInt( value, 10 );
	if ( value >= 0 || value <= 59 ) {
		return ( value < 10 ? "0" : "" ) + value;
	}
}


$.widget( "ui.timepicker", {
	version: "@VERSION",
	defaultElement: "<input>",
	options: {
		
	},
	_create: function() {
		this.element.spinner();
		this.spinner = this.element.data( "spinner" );
		$.extend( this.spinner, {
			_parse: $.proxy( this, "_spinnerParse" ),
			_value: $.proxy( this, "_spinnerValue" ),
			_trimValue: function( value ) {
				console.log( "trimming", value );
				if ( value < this.options.min ) {
					return this.options.max;
				}
				if ( value > this.options.max ) {
					return this.options.min;
				}
				return value;
			}
		});
		this.element.mask({
			mask: "hh:mm:ss pp",
			clearEmpty: false,
			definitions: {
				hh: function( value ) {
					value = parseInt( value, 10 );
					if ( value >= 1 || value <= 12 ) {
						return ( value < 10 ? "0" : "" ) + value;
					}
				},
				mm: sixty,
				ss: sixty,
				pp: function( value ) {
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
			}
		});
		this.mask = this.element.data( "mask" );
		this._setField( 0 );
		this._bind( this._events );
	},
	_events: {
		keydown: function( event ) {
			this._delay(function() {
				var position = this.mask._caret();
				this._setField( Math.floor( position.begin / 3 ) );
			}, 0);
		}
	},
	_setField: function( field ) {
		this.currentField = field;
		switch( field ) {
			case 0:
				this.spinner.options.min = 1;
				this.spinner.options.max = 12;
				break;
			case 1:
			case 2:
				this.spinner.options.min = 0;
				this.spinner.options.max = 59;
				break;
			case 3:
				this.spinner.options.min = 0;
				this.spinner.options.max = 1;
				break;
		}
	},
	_spinnerParse: function( val ) {
		val = this.mask.buffer[ this.currentField * 3 ].value;
		if ( this.currentField === 3 ) {
			return val === "am" ? 0 : 1;
		}
		return parseInt( val, 10 ) || 0;
	},
	_spinnerValue: function( val ) {
		var bufferObject = this.mask.buffer[ this.currentField * 3 ];
		if ( this.currentField === 3 ) {
			val = parseInt( val, 10 ) ? "pm" : "am";
		}
		bufferObject.value = bufferObject.valid( val );
		this.mask._paint();
		this.spinner._refresh();
		this.mask._caret( this.currentField * 3, this.currentField * 3 + 2 );
	},
	destroy: function() {
		this.element.mask( "destroy" );
		this.element.spinner( "destroy" );
		this._super.destroy();
	}
});

}( jQuery ));