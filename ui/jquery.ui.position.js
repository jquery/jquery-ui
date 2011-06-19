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

var rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[+-]\d+%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	center = "center",
	_position = $.fn.position;

$.position = {
	scrollbarWidth: function() {
		var w1, w2,
			div = $( "<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return w1 - w2; 
	},
	getScrollInfo: function( within ) {
		var that = within[0],
			scrollHeight = within.height() < that.scrollHeight,
			scrollWidth = within.width() < that.scrollWidth,
			scrollbarWidth = $.position.scrollbarWidth();

		return {
			height: scrollHeight ? scrollbarWidth : 0,
			width : scrollWidth ? scrollbarWidth : 0
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var target = $( options.of ),
		within  = $( options.within || window ),
		targetElem = target[0],
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {},
		atOffset,
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

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ center ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ center ].concat( pos ) :
					[ center, center ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : center;
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : center;

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === center ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === center ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = [
		parseInt( offsets.at[ 0 ], 10 ) *
			( rpercent.test( offsets.at[ 0 ] ) ? targetWidth / 100 : 1 ),
		parseInt( offsets.at[ 1 ], 10 ) *
			( rpercent.test( offsets.at[ 1 ] ) ? targetHeight / 100 : 1 )
	];
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseInt( $.curCSS( this, "marginLeft", true ) ) || 0,
			marginTop = parseInt( $.curCSS( this, "marginTop", true ) ) || 0,
			scrollInfo = $.position.getScrollInfo( within ),
			collisionWidth = elemWidth + marginLeft +
				( parseInt( $.curCSS( this, "marginRight", true ) ) || 0 ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop +
				( parseInt( $.curCSS( this, "marginBottom", true ) ) || 0 ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = [
				parseInt( offsets.my[ 0 ], 10 ) *
					( rpercent.test( offsets.my[ 0 ] ) ? elem.outerWidth() / 100 : 1 ),
				parseInt( offsets.my[ 1 ], 10 ) *
					( rpercent.test( offsets.my[ 1 ] ) ? elem.outerHeight() / 100 : 1 )
			],
			collisionPosition;

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === center ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === center ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// prevent fractions (see #5280)
		position.left = Math.round( position.left );
		position.top = Math.round( position.top );

		collisionPosition = {
			left: position.left - marginLeft,
			top: position.top - marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within
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
			var within = data.within,
				win = $( window ),
				isWindow = $.isWindow( data.within[0] ),
				withinOffset = isWindow ? win.scrollLeft() : within.offset().left,
				outerWidth = isWindow ? win.width() : within.outerWidth(),
				overLeft = withinOffset - data.collisionPosition.left,
				overRight = data.collisionPosition.left + data.collisionWidth - outerWidth - withinOffset;

			// element is wider than window or too far left -> align with left edge
			if ( data.collisionWidth > outerWidth || overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = Math.max( position.left - data.collisionPosition.left, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				win = $( window ),
				isWindow = $.isWindow( data.within[0] ),
				withinOffset = isWindow ? win.scrollTop() : within.offset().top,
				outerHeight = isWindow ? win.height() : within.outerHeight(),
				overTop = withinOffset - data.collisionPosition.top,
				overBottom = data.collisionPosition.top + data.collisionHeight - outerHeight - withinOffset;

			// element is taller than window or too far up -> align with top edge
			if ( data.collisionHeight > outerHeight || overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = Math.max( position.top - data.collisionPosition.top, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			if ( data.at[ 0 ] === center ) {
				return;
			}

			var within = data.within,
				win = $( window ),
				isWindow = $.isWindow( data.within[0] ),
				withinOffset = isWindow ? 0 : within.offset().left,
				outerWidth = isWindow ? within.width() : within.outerWidth(),
				overLeft = data.collisionPosition.left - withinOffset,
				overRight = data.collisionPosition.left + data.collisionWidth - outerWidth - withinOffset,
				left = data.my[ 0 ] === "left",
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					-data.targetWidth,
				offset = -2 * data.offset[ 0 ];
			if ( overLeft < 0 || overRight > 0 ) {
				position.left += myOffset + atOffset + offset;
			}
		},
		top: function( position, data ) {
			if ( data.at[ 1 ] === center ) {
				return;
			}
			var within = data.within,
				win = $( window ),
				isWindow = $.isWindow( data.within[0] ),
				withinOffset = isWindow ? 0 : within.offset().top,
				outerHeight = isWindow ? within.height() : within.outerHeight(),
				overTop = data.collisionPosition.top - withinOffset,
				overBottom = data.collisionPosition.top + data.collisionHeight - outerHeight - withinOffset,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					-data.targetHeight,
				offset = -2 * data.offset[ 1 ];
			if ( overTop < 0 || overBottom > 0 ) {
				position.top += myOffset + atOffset + offset;
			}
		}
	}
};

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	// offset option
	(function( $ ) {
		var _position = $.fn.position;
		$.fn.position = function( options ) {
			if ( !options || !options.offset ) {
				return _position.call( this, options );
			}
			var offset = options.offset.split( " " ),
				at = options.at.split( " " );
			if ( offset.length === 1 ) {
				offset[ 1 ] = offset[ 0 ];
			}
			if ( /^\d/.test( offset[ 0 ] ) ) {
				offset[ 0 ] = "+" + offset[ 0 ];
			}
			if ( /^\d/.test( offset[ 1 ] ) ) {
				offset[ 1 ] = "+" + offset[ 1 ];
			}
			if ( at.length === 1 ) {
				if ( /left|center|right/.test( at[ 0 ] ) ) {
					at[ 1 ] = "center";
				} else {
					at[ 1 ] = at[ 0 ];
					at[ 0 ] = "center";
				}
			}
			return _position.call( this, $.extend( options, {
				at: at[ 0 ] + offset[ 0 ] + " " + at[ 1 ] + offset[ 1 ],
				offset: undefined
			} ) );
		}
	}( jQuery ) );
}

}( jQuery ) );
