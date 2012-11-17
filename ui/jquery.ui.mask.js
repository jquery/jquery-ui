/*!
 * jQuery UI Mask @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *
 */
(function( $, undefined ) {

var keyCode = $.ui.keyCode;

$.widget( "ui.mask", {
	version: "@VERSION",
	defaultElement: "<input>",
	options: {
		clearEmpty: true,
		definitions: {
			"9": /[0-9]/,
			"a": /[A-Za-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]/,
			"*": /[A-Za-z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]/
		},
		mask: null,
		placeholder: "_"
	},

	_create: function() {
		this._parseMask();
		this.refresh();
		this.element.addClass( "ui-mask" );
		this._on( this._events );
	},

	_destroy: function() {
		this.element.removeClass( "ui-mask" );
	},

	refresh: function() {
		this._parseValue();
		this._paint();
	},

	valid: function() {
		return this.isValid;
	},

	// returns (or sets) the value without the mask
	value: function( value ) {
		if ( value !== undefined ) {
			this.element.val( value );
			this.refresh();
		} else {
			return this._getValue( true );
		}
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "mask" ) {
			this._parseMask();
			this._parseValue();
		}
	},
	_setOptions: function( options ) {
		this._super( options );
		this._paint();
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
	_caretSelect: function( bufferPosition ) {
		var bufferObject = this.buffer[ bufferPosition ];
		if ( bufferObject && bufferObject.length > 1 ) {
			this._caret( bufferObject.start, bufferObject.start + bufferObject.length );
		} else {
			this._caret( bufferPosition );
		}
	},
	_getValue: function( raw, focused ) {
		var bufferPosition, bufferObject, counter,
			bufferLength = this.buffer.length,
			value = "",
			lastValue = 0;

		this.isEmpty = this.isValid = true;
		for ( bufferPosition = 0; bufferPosition < bufferLength; bufferPosition += bufferObject.length ) {
			bufferObject = this.buffer[ bufferPosition ];
			if ( bufferObject.literal ) {
				if ( !raw && ( bufferPosition < this.optionalPosition || this.isValid ) ) {
					value += bufferObject.literal;
				}
			} else if ( bufferObject.value ) {
				lastValue = bufferObject.start + bufferObject.length;
				this.isEmpty = false;
				value += bufferObject.value;
				for ( counter = bufferObject.value.length; counter < bufferObject.length; counter++ ) {
					value += this.options.placeholder;
				}
			} else {
				if ( !raw ) {
					for ( counter = bufferObject.length ; counter; counter-- ) {
						value += this.options.placeholder;
					}
				}
				if ( bufferPosition < this.optionalPosition ) {
					this.isValid = false;
				}
			}
		}

		// don't display the "optional" portion until the input is "valid" or there are
		// values past the optional position
		if ( this.options.clearEmpty && this.isEmpty && focused === false ) {
			return "";
		}

		// strip the optional parts off if we haven't gotten there yet, or there are no values past it
		// and we aren't focused
		if ( lastValue <= this.optionalPosition && !( this.isValid && focused ) ) {
			value = value.substr( 0, this.optionalPosition );
		}
		return value;
	},
	_events: {
		focus: function() {
			this.lastUnsavedValue = this.element.val();
			this._paint( true );
			this._caretSelect( this._seekRight( this._parseValue() ) );

			this._justFocused = true;
			this._delay(function(){
				this._justFocused = false;
			}, 100);
		},
		click: function() {
			// Normally, the call to handle this in the focus event handler would be
			// sufficient, but Chrome fires the focus events before positioning the
			// cursor based on where the user clicked (and then fires the click event).

			// We only want to move the caret on clicks that resulted in focus
			if ( this._justFocused ) {
				this._caretSelect( this._seekRight( this._parseValue() ) );
				this._justFocused = false;
			}
		},
		blur: function() {
			this._justFocused = false;

			// because we are constantly setting the value of the input, the change event
			// never fires - we re-introduce the change event here
			this._parseValue();
			this._paint( false );
			if ( this.element.val() !== this.lastUnsavedValue ) {
				this.element.change();
			}
		},
		keydown: function( event ) {
			var bufferObject,
				key = event.keyCode,
				position = this._caret();

			if ( event.shiftKey || event.metaKey || event.altKey || event.ctrlKey ) {
				return;
			}


			switch ( key ) {
				case keyCode.ESCAPE:
					this.element.val( this.lastUnsavedValue );
					this._caretSelect( 0, this._parseValue() );
					event.preventDefault();
					return;

				case keyCode.BACKSPACE:
				case keyCode.DELETE:
					event.preventDefault();

					// if the caret is not "selecting" values, we need to find the proper
					// character in the buffer to delete/backspace over.
					if ( position.begin === position.end || this._isEmpty( position.begin, position.end ) ) {
						if ( key === keyCode.DELETE ) {
							position.begin = position.end = this._seekRight( position.begin - 1 );
						} else {
							position.begin = position.end = this._seekLeft( position.begin );
						}

						// nothing to backspace
						if ( position.begin < 0 ) {
							this._caret( this._seekRight( -1 ) );
							return;
						}
					}
					this._removeValues( position.begin, position.end );
					this._paint();
					this._caretSelect( position.begin );
					return;

				case keyCode.LEFT:
				case keyCode.RIGHT:
					bufferObject = this.buffer[ position.begin ];
					if ( bufferObject && bufferObject.length > 1 ) {
						bufferObject.value = this._validValue( bufferObject, bufferObject.value );
						this._paint();
						event.preventDefault();
					}
					if ( key === keyCode.LEFT ) {
						position = this._seekLeft( bufferObject ? bufferObject.start : position.begin );
					} else {
						position = this._seekRight( bufferObject ?
							bufferObject.start + bufferObject.length - 1 :
							position.end );
					}
					this._caretSelect( position );
					event.preventDefault();
					return;
			}
		},
		keypress: function( event ) {
			var tempValue, valid,
				key = event.which,
				position = this._caret(),
				bufferPosition = this._seekRight( position.begin - 1 ),
				bufferObject = this.buffer[ bufferPosition ];

			// ignore keypresses with special keys, or control characters
			if ( event.metaKey || event.altKey || event.ctrlKey || key < 32 ) {
				return;
			}
			if ( position.begin !== position.end ) {
				this._removeValues( position.begin, position.end );
			}
			if ( bufferObject ) {
				tempValue = String.fromCharCode( key );
				if ( bufferObject.length > 1 && bufferObject.value ) {
					tempValue = bufferObject.value.substr( 0, bufferPosition - bufferObject.start ) +
						tempValue +
						bufferObject.value.substr( bufferPosition - bufferObject.start + 1 );
					tempValue = tempValue.substr( 0, bufferObject.length );
				}
				valid = this._validValue( bufferObject, tempValue );
				if ( valid ) {
					this._shiftRight( position.begin );
					bufferObject.value = tempValue;
					position = this._seekRight( bufferPosition );
					if ( position <= bufferObject.start + bufferObject.length ) {
						this._paint();
						this._caret( position );
					} else {
						bufferObject.value = valid;
						this._paint();
						this._caretSelect( position );
					}
				}
			}
			event.preventDefault();
		},
		paste: "_paste",
		input: "_paste"
	},
	_isEmpty: function( begin, end ) {
		var index;
		if ( begin === undefined ) {
			begin = 0;
			end = this.buffer.length - 1;
		} else if ( end === undefined ) {
			end = begin;
		}
		for ( index = begin; index <= end; index++ ) {
			if ( this.buffer[ index ] && this.buffer[ index ].value ) {
				return false;
			}
		}
		return true;
	},
	_paste: function() {
		this._delay( function() {
			var position = this._parseValue();
			this._paint();
			this._caret( this._seekRight( position ) );
		}, 0 );
	},
	_paint: function( focused ) {
		if ( focused === undefined ) {
			focused = this.element[ 0 ] === document.activeElement;
		}
		this.element.val( this._getValue( false, focused ) );
	},
	_addBuffer: function( bufferObject ) {
		var x,
		begin = bufferObject.start,
		end = bufferObject.start + bufferObject.length;

		for ( x = begin; x < end; x++ ) {
			if ( this.buffer[ x ] !== undefined ) {
				return false;
			}
		}

		for ( x = begin; x < end; x++ ) {
			this.buffer[ x ] = bufferObject;
		}

		return true;
	},
	_removeCharacter: function( mask, index ) {
		var x, bufferObject;

		for ( x = index ; x < mask.length - 1 ; x++ ) {
			bufferObject = this.buffer[ x + 1 ];
			this.buffer[ x ] = bufferObject;
			if ( bufferObject !== undefined ) {
				bufferObject.start = bufferObject.start - 1;
				x += bufferObject.length - 1;
			}
		}
		this.buffer.splice( x, 1 );

		if ( this.optionalPosition > index ) {
			this.optionalPosition--;
		}

		return mask.substring( 0, index ) + mask.substring( index + 1 );
	},
	_parseMask: function() {
		var key, x, optionalPosition,
			index = -1,
			options = this.options,
			mask = options.mask,
			reservedChars = [ "a", "9", "*", "?", "<", ">", "\\" ];

		this.buffer = [];
		if ( !mask ) {
			return;
		}

		// search for escaped reserved characters
		for ( index = 0 ; index < mask.length - 1 ; index++ ) {
			if ( mask.charAt( index ) === "\\" &&
				$.inArray( mask.charAt( index + 1 ), reservedChars ) !== -1 ) {
				// remove escape character
				mask = mask.substring( 0, index ) + mask.substring( index + 1 );

				this._addBuffer({
					start: index,
					literal: mask.charAt( index ),
					length: 1
				});
			}
		}
		// locate unescaped optional markers ; use attention to the first, remove all others
		optionalPosition = -1;
		this.optionalPosition = undefined;
		while ( ( optionalPosition = mask.indexOf( "?", optionalPosition + 1 ) ) > -1 ) {
			if ( this.buffer[ optionalPosition ] === undefined ) {
				if ( this.optionalPosition === undefined ) {
					this.optionalPosition = optionalPosition;
				}

				// remove the ? from the mask
				mask = this._removeCharacter( mask, optionalPosition );
			}
		}
		if ( this.optionalPosition === undefined ) {
			this.optionalPosition = mask.length;
		}

		// search for strictly definied "masks"
		for ( x = 0 ; x < mask.length ; x++ ) {
			if ( mask.charAt(x) === "<" ) {
				index = x;
				for ( ; x < mask.length ; x++ ) {
					if ( mask.charAt(x) === ">" ) {
						key = mask.substring( index + 1 , x );
						if ( options.definitions[key] !== undefined ) {
							if (this._addBuffer({
								start: index + 1,
								length: key.length,
								valid: options.definitions[ key ]
							})) {
								mask = this._removeCharacter( mask, x );
								mask = this._removeCharacter( mask, index );
								for ( x = index ; x < index + key.length ; x++ ) {
									mask[x] = " ";
								}
							}
						}
						break;
					}
				}
			}
		}

		// search for definied "masks"
		index = -1;
		for ( key in options.definitions ) {
			while ( ( index = mask.indexOf( key, index + 1 ) ) > -1 ) {
				this._addBuffer({
					start: index,
					length: key.length,
					valid: options.definitions[ key ]
				});
			}
		}

		// anything we didn't find is a literal
		for ( index = 0 ; index < mask.length ; index++ ) {
			this._addBuffer({
				start: index,
				literal: mask.charAt( index ),
				length: 1
			});
		}
	},

	// parses the .val() and places it into the buffer
	// returns the last filled in value position
	_parseValue: function() {
		var bufferPosition, bufferObject, character,
			valuePosition = 0,
			lastFilledPosition = -1,
			value = this.element.val(),
			bufferLength = this.buffer.length;

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
				}
				valuePosition++;
				character = this._validValue( bufferObject, character );
				if ( character ) {
					bufferObject.value = character;
					lastFilledPosition = bufferPosition + bufferObject.length - 1;
					valuePosition += bufferObject.length - 1;
					break;
				}
			}

			// allow "default values" to be passed back from the buffer functions
			if ( !bufferObject.value && (character = this._validValue( bufferObject, "" )) ) {
				bufferObject.value = character;
			}
		}
		return lastFilledPosition;
	},
	_removeValues: function( begin, end ) {
		var position, bufferObject;
		for ( position = begin; position <= end; position++ ) {
			bufferObject = this.buffer[ position ];
			if ( bufferObject && bufferObject.value ) {
				delete bufferObject.value;
			}
		}
		this._shiftLeft( begin, end + 1 );
		return this;
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
			bufferLength = this.buffer.length;

		for ( destPosition = begin, bufferPosition = this._seekRight( end - 1 );
			destPosition < bufferLength;
			destPosition += destObject.length ) {
			destObject = this.buffer[ destPosition ];
			bufferObject = this.buffer[ bufferPosition ];

			// we don't want to shift values into multi character fields
			if ( destObject.valid && destObject.length === 1 ) {
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
	},
	_shiftRight: function ( bufferPosition ) {
		var bufferObject,
			temp,
			shiftingValue = false,
			bufferLength = this.buffer.length;

		bufferPosition--;
		while ( ( bufferPosition = this._seekRight( bufferPosition ) ) < bufferLength )
		{
			bufferObject = this.buffer[ bufferPosition ];
			if ( shiftingValue === false ) {
				shiftingValue = bufferObject.value;
			} else {

				// we don't want to shift values into multi character fields
				if ( bufferObject.length === 1 && this._validValue( bufferObject, shiftingValue ) ) {
					temp = bufferObject.value;
					bufferObject.value = shiftingValue;
					shiftingValue = temp;
				} else {
					return;
				}
			}
		}
	},

	// returns the value if valid, otherwise returns false
	_validValue: function( bufferObject, value ) {
		if ( bufferObject.valid ) {
			if ( $.isFunction( bufferObject.valid ) ) {
				return bufferObject.valid( value || "" ) || false;
			}
			return bufferObject.valid.test( value ) && value;
		}
		return ( bufferObject.literal === value ) && value;
	}
});

}( jQuery ) );
