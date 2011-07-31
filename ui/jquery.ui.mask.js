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

var keyCode = $.ui.keyCode;

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
		this._parseValue();
		this._paint();
		this._keyBinding();
	},

	refresh: function() {
		this._parseValue();
		this._paint();
	},

	_setOption: function( key, value ) {
		this._super( "_setOption", key, value );
		if ( key === "mask" ) {
			this._parseMask();
			this._parseValue();
			this._paint();
		}
		if ( key === "placeholder" ) {
			this._paint();
		}
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
	},
	_keyBinding: function() {
		var cancelKeypress,
			lastUnsavedValue,
			that = this,
			elem = that.element;

		this._bind({
			focus: function( event ) {
				lastUnsavedValue = elem.val();
			},
			keydown: function( event ) {
				var key = event.keyCode,
					position = that._caret();

				if ( key === keyCode.ESCAPE ) {
					elem.val( lastUnsavedValue );
					that._caret( 0, that._parseValue() );
					event.preventDefault();
				}

				if ( key === keyCode.BACKSPACE || key === keyCode.DELETE ) {
					event.preventDefault();
					if ( position.begin == position.end ) {
						position.begin = position.end = ( key === keyCode.DELETE ?
							that._seekRight( position.begin - 1) :
							that._seekLeft( position.begin )
						);
						if ( position.begin < 0 ) {
							that._caret( that.seekLeft( -1 ) );
							return;
						}
					}
					that._removeValues( position.begin, position.end );
					that._paint();
					that._caret( position.begin );
				}
			},
			keypress: function( event ) {
				var key = event.which,
					position = that._caret(),
					bufferPosition = that._seekRight( position.begin - 1 ),
					bufferObject = that.buffer[ bufferPosition ];

				// ignore keypresses with special keys, or control characters
				if ( event.metaKey || event.altKey || event.ctrlKey || key < 32 ) {
					return;
				}
				if ( position.begin != position.end ) {
					that._removeValues( position.begin, position.end );
				}
				if ( bufferObject ) {
					key = String.fromCharCode( key );
					if ( this._validValue( bufferObject, key ) ) {
						that._shiftRight( position.begin );
						bufferObject.value = key;
						that._paint();
						that._caret( that._seekRight( bufferPosition ) );
					}
				}
				event.preventDefault();
			}
		});
	},

	// _seekLeft and _seekRight will tell the next non-literal position in the buffer
	_seekLeft: function( position ) {
		while ( --position >= 0 ) {
			if ( this.buffer[ position ] && !this.buffer[ position ].literal ) {
				return position;
			}
		}
		return -1;
	},
	_seekRight: function( position ) {
		var length = this.buffer.length;
		while ( ++position < length ) {
			if ( this.buffer[ position ] && !this.buffer[ position ].literal ) {
				return position;
			}
		}

		return length;
	},

	// _shiftLeft and _shiftRight will move values in the buffer over to the left/right
	_shiftLeft: function( begin, end ) {
		var bufferPosition,
			bufferObject,
			destPosition,
			destObject,
			caretPosition = this._seekLeft( begin + 1 ),
			bufferLength = this.buffer.length;

		for ( destPosition = begin, bufferPosition = this._seekRight( end - 1 );
			destPosition < bufferLength; 
			destPosition += destObject.length ) {
			destObject = this.buffer[ destPosition ];
			bufferObject = this.buffer[ bufferPosition ];
			if ( destObject.valid ) {
				if ( bufferPosition < bufferLength ) {
					if ( this._validValue( destObject, bufferObject.value ) ) {
						destObject.value = bufferObject.value;
						delete bufferObject.value;
						bufferPosition = this._seekRight( bufferPosition );
					} else {

						// once we find a value that doesn't fit anymore, we stop this shift
						break;
					}
				}
			}
		}
		this._caret( caretPosition < 0 ? this._seekRight( 0 ) : caretPosition );
	},
	_shiftRight: function ( bufferPosition ) {
		var bufferObject,
			destPosition = this._seekRight( bufferPosition ),
			destObject,
			bufferLength = this.buffer.length;

		for ( ; bufferPosition < bufferLength ; bufferPosition += bufferObject.length ) {
			bufferObject = this.buffer[ bufferPosition ];
			if ( bufferObject.valid ) {
				if ( destPosition < bufferLength ) {
					destObject = this.buffer[ destPosition ];
					if ( this._validValue( destObject, bufferObject.value ) ) {
						destObject.value = bufferObject.value;
						destPosition = this._seekRight( destPosition );
					}
					delete bufferObject.value;
				}
			}
		}
	},
	_removeValues: function( begin, end ) {
		var position,
			bufferObject;
		for ( position = begin; position <= end; position++ ) {
			bufferObject = this.buffer[ position ];
			if ( bufferObject && bufferObject.value ) {
				delete bufferObject.value;
			}
		}
		this._shiftLeft( begin, end + 1 );
		return this;
	},

	// parses the .val() and places it into the buffer
	// returns the total length of the displayed values in the buffer
	_parseValue: function() {
		var bufferPosition,
			bufferObject,
			character,
			valuePosition = 0,
			value = this.element.val(),
			bufferLength = this.buffer.length,
			valueLength = value.length;

		// remove all current values from the buffer
		this._removeValues( 0, bufferLength );

		// seek through the buffer pulling characters from the value
		for ( bufferPosition = 0; bufferPosition < bufferLength; bufferPosition += bufferObject.length ) {
			bufferObject = this.buffer[ bufferPosition ];

			while ( valuePosition < value.length ) {
				character = value.substr( valuePosition, bufferObject.length );
				if ( bufferObject.literal ) {
					if ( this._validValue( bufferObject, character ) ) {
						valuePosition++;
					}

					// when parsing a literal from a raw .val() if it doesn't match,
					// assume that the literal is missing from the val()
					break;
				} else {
					valuePosition++;
					character = this._validValue( bufferObject, character );
					if ( character ) {
						bufferObject.value = character;
						break;
					}
				}
			}
		}
		return bufferLength;
	},
	_paint: function() {
		var bufferPosition,
			bufferObject,
			bufferLength = this.buffer.length,
			value = "";

		for ( bufferPosition = 0; bufferPosition < bufferLength; bufferPosition += bufferObject.length ) {
			bufferObject = this.buffer[ bufferPosition ];
			if ( bufferObject.literal ) {
				value += bufferObject.literal;
			} else if ( bufferObject.value ) {
				value += bufferObject.value;
			} else {
				value += this.options.placeholder;
			}
		}
		this.element.val( value );
	},

	// returns the value if valid, otherwise returns false
	_validValue: function( bufferObject, value ) {
		if ( bufferObject.valid ) {
			if ( $.isFunction( bufferObject.valid ) ) {
				return bufferObject.valid( value ) || false;
			} else {
				return bufferObject.valid.test( value ) && value;
			}
		} else {
			return ( bufferObject.literal === value ) && value ;
		}
	}
});

}( jQuery ) );
