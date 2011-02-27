/*
 * jQuery UI Position @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function( $, undefined ) {

$.ui = $.ui || {};

var horizontalPositions = /left|center|right/,
	verticalPositions = /top|center|bottom/,
	offsetMatch = /([\+\-]\d+)([%]?)/,
	center = "center",
	_position = $.fn.position,
	_offset = $.fn.offset;

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var target = $( options.of ),
		targetElem = target[0],
		collision = ( options.collision || "flip" ).split( " " ),
		targetWidth,
		targetHeight,
		basePosition;

	if ( targetElem.nodeType === 9 ) {
		targetWidth = target.width();
		targetHeight = target.height();
		basePosition = { top: 0, left: 0 };
	} else if ( $.isWindow( targetElem ) ) {
		targetWidth = target.width();
		targetHeight = target.height();
		basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
	} else if ( targetElem.preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
		targetWidth = targetHeight = 0;
		basePosition = { top: options.of.pageY, left: options.of.pageX };
	} else {
		targetWidth = target.outerWidth();
		targetHeight = target.outerHeight();
		basePosition = target.offset();
	}

	normalizePositions( options );

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at.horizontal.value === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at.horizontal.value === center ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at.vertical.value === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at.vertical.value === center ) {
		basePosition.top += targetHeight / 2;
	}

	basePosition.left = options.at.horizontal.offset.calculate( basePosition.left );
	basePosition.top = options.at.vertical.offset.calculate( basePosition.top );

	return this.each(function() {
		var elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseInt( $.curCSS( this, "marginLeft", true ) ) || 0,
			marginTop = parseInt( $.curCSS( this, "marginTop", true ) ) || 0,
			collisionWidth = elemWidth + marginLeft +
				( parseInt( $.curCSS( this, "marginRight", true ) ) || 0 ),
			collisionHeight = elemHeight + marginTop +
				( parseInt( $.curCSS( this, "marginBottom", true ) ) || 0 ),
			position = $.extend( {}, basePosition ),
			collisionPosition;

		if ( options.my.horizontal.value === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my.horizontal.value === center ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my.vertical.value === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my.vertical.value === center ) {
			position.top -= elemHeight / 2;
		}

		// prevent fractions (see #5280)
		position.left = Math.round( ( position.left - ( options.my.horizontal.offset.calculate( position.left ) - position.left ) ) );
		position.top = Math.round( ( position.top - ( options.my.vertical.offset.calculate( position.top ) - position.top ) ) );

		collisionPosition = {
			left: position.left - marginLeft,
			top: position.top - marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[i] ] ) {
				$.ui.position[ collision[i] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: offset,
					my: options.my,
					at: options.at
				});
			}
		});

		if ( $.fn.bgiframe ) {
			elem.bgiframe();
		}
		elem.offset( $.extend( position, { using: options.using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var win = $( window ),
				over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft();
			position.left = over > 0 ? position.left - over : Math.max( position.left - data.collisionPosition.left, position.left );
		},
		top: function( position, data ) {
			var win = $( window ),
				over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop();
			position.top = over > 0 ? position.top - over : Math.max( position.top - data.collisionPosition.top, position.top );
		}
	},

	flip: {
		left: function( position, data ) {
			if ( data.at.horizontal.value === center ) {
				return;
			}
			var win = $( window ),
				over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft(),
				myOffset = data.my.horizontal.value === "left" ?
					-data.elemWidth :
					data.my.horizontal.value === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at.horizontal.value === "left" ?
					data.targetWidth :
					-data.targetWidth,
				offset = -2 * data.at.horizontal.offset.offset;
			position.left += data.collisionPosition.left < 0 ?
				myOffset + atOffset + offset :
				over > 0 ?
					myOffset + atOffset + offset :
					0;
		},
		top: function( position, data ) {
			if ( data.at.vertical.value === center ) {
				return;
			}
			var win = $( window ),
				over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop(),
				myOffset = data.my.vertical.value === "top" ?
					-data.elemHeight :
					data.my.vertical.value === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at.vertical.value === "top" ?
					data.targetHeight :
					-data.targetHeight,
				offset = -2 * data.at.vertical.offset.offset;
			position.top += data.collisionPosition.top < 0 ?
				myOffset + atOffset + offset :
				over > 0 ?
					myOffset + atOffset + offset :
					0;
		}
	}
};

$.extend ( $.ui.position, (

	normalizePositions = function( options ) {

		// force my and at to have valid horizontal and veritcal positions
		// if a value is missing or invalid, it will be converted to center 
		$.each( [ "my", "at" ], function() {		
			options[ this ] = positionData( options[ this ] );
		});
	},

	positionData = function( position ) { 

		var pos = ( ( position || "" ).split( " " ) );
		var positionData = {};
			
		if ( pos.length === 1 ) {
			pos = horizontalPositions.test( pos[ 0 ] ) ?
				pos.concat( [ center ] ) :
				verticalPositions.test( pos[ 0 ] ) ?
					[ center ].concat( pos ) :
					[ center, center ];
		}

		positionData.horizontal = {},
			positionData.vertical = {};

		pos[ 0 ] = horizontalPositions.test( pos[ 0 ] ) ? pos[ 0 ] : center;
		pos[ 1 ] = verticalPositions.test( pos[ 1 ] ) ? pos[ 1 ] : center;

		positionData.horizontal.offset = new offsetTranslator( pos[ 0 ] );
		positionData.vertical.offset = new offsetTranslator( pos[ 1 ] );

		positionData.horizontal.value = pos[ 0 ].match( horizontalPositions )[ 0 ];
		positionData.vertical.value = pos[ 1 ].match( verticalPositions )[ 0 ];

		return positionData;
	},

	offsetTranslator = function( option ) {
		
		if ( !option ) {
			return 0;
		}

		var matched = option.match(offsetMatch);
		this.offset = 0,
			this.percent = false;

		if ( matched && matched.length >= 2 ) {
			this.offset = matched[ 1 ] !== undefined 
				? parseInt( matched[ 1 ], 10 ) 
				: 0,
			this.percent = matched[ 2 ] !== "";
		}
		
		this.calculate = function( original ) {
			var result;

			if ( typeof original !== "number" ) {
				return original; 
			}

			if ( this.percent ) {
				result = original * ( 1 + ( this.offset / 100 ) ); 
			}
			else {
				result = original + this.offset;
			}

			return Math.floor( result );
		}
	}
)
);

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	//offset option
	(function( $, prototype ) {

		var _normalizePositions = normalizePositions;
		normalizePositions = function( options ) {
			_normalizePositions.call( this, options );	
			
			if ( options.offset ) {

				offset = options.offset ? options.offset.split( " " ) : [ 0, 0 ],

				// normalize offset option
				offset[ 0 ] = parseInt( offset[ 0 ], 10 ) || 0;
				if ( offset.length === 1 ) {
					offset[ 1 ] = offset[ 0 ];
				}
				offset[ 1 ] = parseInt( offset[ 1 ], 10 ) || 0;
				
				options.at.horizontal.offset.offset += offset[ 0 ];
				options.at.vertical.offset.offset += offset[ 1 ];
			}	
		}
	}( jQuery, jQuery.ui.position.prototype ) );
}

}( jQuery ));
