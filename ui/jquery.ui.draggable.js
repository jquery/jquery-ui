/*!
 * jQuery UI Draggable @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/draggable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.interaction.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

// Create a shallow copy of an object
function copy( obj ) {
	var prop,
		ret = {};
	for ( prop in obj ) {
		ret[ prop ] = obj[ prop ];
	}
	return ret;
}

$.widget( "ui.draggable", $.ui.interaction, {
	version: "@VERSION",
	widgetEventPrefix: "drag",

	options: {
		appendTo: null,
		exclude: "input,textarea,button,select",
		handle: null,
		helper: false,

		// callbacks
		beforeStart: null,
		drag: null,
		start: null,
		stop: null
	},

	// dragEl: element being dragged (original or helper)
	// position: final CSS position of dragEl
	// offset: offset of dragEl
	// originalPosition: CSS position before drag start
	// originalOffset: offset before drag start
	// originalPointer: pageX/Y at drag start (offset of pointer)
	// startPosition: CSS position at drag start (after beforeStart)
	// startOffset: offset at drag start (after beforeStart)
	// tempPosition: overridable CSS position of dragEl
	// overflowOffset: offset of scroll parent
	// overflow: object containing width and height keys of scroll parent
	// domPosition: object containing original parent and index when using
	// appendTo option without a helper
	// dragDimensions: saved off width and height used for various options

	scrollSensitivity: 20,
	scrollSpeed: 5,

	_create: function() {
		this._super();

		// Static position elements can't be moved with top/left
		if ( this.element.css( "position" ) === "static" ) {
			this.element.css( "position", "relative" );
		}

		this.element.addClass( "ui-draggable" );
	},

	/** interaction interface **/

	_isValidTarget: function( element ) {
		var handle = this.options.handle ?
				element.is( this.element.find( this.options.handle ) ) :
				true,
			exclude = this.options.exclude ?
				element.is( this.element.find( this.options.exclude ) ) :
				false;

		return handle && !exclude;
	},

	_start: function( event, pointerPosition ) {
		var offset, startCssLeft, startCssTop, startPosition, startOffset;

		// Reset
		this.dragDimensions = null;

		// The actual dragging element, should always be a jQuery object
		this.dragEl = this.options.helper ?
			this._createHelper( pointerPosition ) :
			this.element;

		// _createHelper() ensures that helpers are in the correct position
		// in the DOM, but we need to handle appendTo when there is no helper
		if ( this.options.appendTo && this.dragEl === this.element ) {
			this.domPosition = {
				parent: this.element.parent(),
				index: this.element.index()
			};
			offset = this.dragEl.offset();
			this.dragEl
				.appendTo( this._appendTo() )
				.offset( offset );
		}

		this.cssPosition = this.dragEl.css( "position" );
		this.scrollParent = this.element.scrollParent();

		// Cache starting positions
		this.originalPosition = this.startPosition = this._getPosition();
		this.originalOffset = this.startOffset = this.dragEl.offset();
		this.originalPointer = pointerPosition;

		// If not already cached within _createHelper()
		if ( !this.dragDimensions ) {
			this._cacheDragDimensions( this.dragEl );
		}

		// Cache current position and offset
		this.position = copy( this.startPosition );
		this.offset = copy( this.startOffset );

		// Cache the offset of scrollParent, if required for _handleScrolling()
		if ( this.scrollParent[ 0 ] !== this.document[ 0 ] &&
				this.scrollParent[ 0 ].tagName.toUpperCase() !== "HTML" ) {
			this.overflowOffset = this.scrollParent.offset();
		}

		this.overflow = {
			height: this.scrollParent[ 0 ] === this.document[ 0 ] ?
				this.window.height() : this.scrollParent.height(),
			width: this.scrollParent[ 0 ] === this.document[ 0 ] ?
				this.window.width() : this.scrollParent.width()
		};

		this._preparePosition( pointerPosition );

		// If user cancels beforeStart, don't allow dragging
		if ( this._trigger( "beforeStart", event,
				this._originalHash( pointerPosition ) ) === false ) {

			// domPosition needs to be undone even if beforeStart is stopped,
			// otherwise this.dragEl will remain in the `appendTo` element
			this._resetDomPosition();
			return false;
		}

		// Save off the usual properties locally, so they can be reverted
		startCssLeft = this.dragEl.css( "left" );
		startCssTop = this.dragEl.css( "top" );
		startPosition = copy( this._getPosition() );
		startOffset = copy( this.offset );

		this._setCss();
		this.startPosition = this._getPosition();
		this.startOffset = this.dragEl.offset();

		// If user cancels on start, don't allow dragging
		if ( this._trigger( "start", event,
				this._fullHash( pointerPosition ) ) === false ) {

			// domPosition needs to be undone even if start is stopped,
			// otherwise this.dragEl will remain in the `appendTo` element
			this.startPosition = startPosition;
			this.startOffset = startOffset;
			this.dragEl.css({
				left: startCssLeft,
				top: startCssTop
			});

			this._resetDomPosition();
			return false;
		}

		this._blockFrames();
	},

	_move: function( event, pointerPosition ) {
		this._preparePosition( pointerPosition );

		// If user cancels drag, don't move the element
		if ( this._trigger( "drag", event,
				this._fullHash( pointerPosition ) ) === false ) {
			return false;
		}

		this._setCss();

		// Scroll the scrollParent, if needed
		this._handleScrolling( pointerPosition );
	},

	_stop: function( event, pointerPosition ) {
		this._preparePosition( pointerPosition );

		// If user cancels stop, leave helper there
		if ( this._trigger( "stop", event,
				this._fullHash( pointerPosition ) ) !== false ) {
			if ( this.options.helper ) {
				delete this.helper;
				this.dragEl.remove();
			}
			this._resetDomPosition();
		}

		this._unblockFrames();
	},

	/** internal **/

	_createHelper: function( pointerPosition ) {
		var offset = this.element.offset(),
			xPos = (pointerPosition.x - offset.left) / this.element.outerWidth(),
			yPos = (pointerPosition.y - offset.top) / this.element.outerHeight();

		// Clone
		if ( this.options.helper === true ) {
			this.helper = this.element.clone()
				.removeAttr( "id" )
				.find( "[id]" )
					.removeAttr( "id" )
				.end();
		} else {
			// TODO: figure out the signature for this; see #4957
			this.helper = $( this.options.helper() );
		}

		// Ensure the helper is in the DOM; obey the appendTo option if it exists
		if ( this.options.appendTo || !this.helper.closest( "body" ).length ) {
			this.helper.appendTo( this._appendTo() || this.document[ 0 ].body );
		}

		this._cacheDragDimensions( this.helper );

		return this.helper
			// Helper must be absolute to function properly
			.css( "position", "absolute" )
			.offset({
				left: pointerPosition.x - this.dragDimensions.width * xPos,
				top: pointerPosition.y - this.dragDimensions.height * yPos
			});
	},

	_cacheDragDimensions: function( element ) {
		this.dragDimensions = {
			width: element.outerWidth(),
			height: element.outerHeight()
		};
	},

	_resetDomPosition: function() {

		// Nothing to do in this case
		if ( !this.domPosition ) {
			return;
		}

		var parent = this.domPosition.parent,
			next = parent.children().eq( this.domPosition.index );
		if ( next.length ) {
			next.before( this.element );
		} else {
			parent.append( this.element );
		}
		this.element.offset( this.offset );
		this.domPosition = null;
	},

	// TODO: Remove after 2.0, only used for backCompat
	_appendTo: function() {
		return this.options.appendTo;
	},

	_getPosition: function() {
		var left, top, position,
			scrollTop = this.scrollParent.scrollTop(),
			scrollLeft = this.scrollParent.scrollLeft();

		// If fixed or absolute
		if ( this.cssPosition !== "relative" ) {
			position = this.dragEl.position();

			// Take into account scrollbar
			position.top -= scrollTop;
			position.left -= scrollLeft;

			return position;
		}

		// When using relative, css values are checked,
		// otherwise the position wouldn't account for padding on ancestors
		left = this.dragEl.css( "left" );
		top = this.dragEl.css( "top" );

		// TODO: add proper support comment
		// Webkit will give back auto if there is no explicit value
		left = ( left === "auto" ) ? 0: parseInt( left, 10 );
		top = ( top === "auto" ) ? 0: parseInt( top, 10 );

		return {
			left: left - scrollLeft,
			top: top - scrollTop
		};
	},

	_handleScrolling: function( pointerPosition ) {
		var newScrollTop, newScrollLeft, change,
			scrollTop = this.scrollParent.scrollTop(),
			scrollLeft = this.scrollParent.scrollLeft(),
			scrollSensitivity = this.scrollSensitivity,

			// overflowOffset is only set when scrollParent is not doc/html
			overflowLeft = this.overflowOffset ?
				this.overflowOffset.left :
				scrollLeft,
			overflowTop = this.overflowOffset ?
				this.overflowOffset.top :
				scrollTop,
			xRight = this.overflow.width + overflowLeft - pointerPosition.x,
			xLeft = pointerPosition.x- overflowLeft,
			yBottom = this.overflow.height + overflowTop - pointerPosition.y,
			yTop = pointerPosition.y - overflowTop;

		// Handle vertical scrolling
		if ( yBottom < scrollSensitivity ) {
			change = this._speed( scrollSensitivity - yBottom );
			this.scrollParent.scrollTop( scrollTop + change );
			this.originalPointer.y = this.originalPointer.y + change;
		} else if ( yTop < scrollSensitivity ) {
			change = this._speed( scrollSensitivity - yTop );
			newScrollTop = scrollTop - change;

			// Don't do anything unless new value is "real"
			if ( newScrollTop >= 0 ) {
				this.scrollParent.scrollTop( newScrollTop );
				this._speed( scrollSensitivity - yTop );
				this.originalPointer.y = this.originalPointer.y - change;
			}
		}

		// Handle horizontal scrolling
		if ( xRight < scrollSensitivity ) {
			change = this._speed( scrollSensitivity - xRight );
			this.scrollParent.scrollLeft( scrollLeft + change);
			this.originalPointer.x = this.originalPointer.x + change;
		} else if ( xLeft < scrollSensitivity ) {
			change = this._speed( scrollSensitivity - xLeft );
			newScrollLeft = scrollLeft - change;

			// Don't do anything unless new value is "real"
			if ( newScrollLeft >= 0 ) {
				this.scrollParent.scrollLeft( newScrollLeft );
				this.originalPointer.x = this.originalPointer.x - change;
			}
		}
	},

	_speed: function( distance ) {
		return this.scrollSpeed + Math.round( distance / 2 );
	},

	// Uses event to determine new position of draggable, before any override
	// from callbacks
	// TODO: handle absolute element inside relative parent like a relative element
	_preparePosition: function( pointerPosition ) {
		var leftDiff = pointerPosition.x - this.originalPointer.x,
			topDiff = pointerPosition.y - this.originalPointer.y,
			newLeft = leftDiff + this.startPosition.left,
			newTop = topDiff + this.startPosition.top;

		// Save off new values for .css() in various callbacks using this function
		this.position = {
			left: newLeft,
			top: newTop
		};

		// Save off values to compare user override against automatic coordinates
		this.tempPosition = {
			left: newLeft,
			top: newTop
		};

		// Refresh offset cache with new positions
		this.offset.left = this.startOffset.left + leftDiff;
		this.offset.top = this.startOffset.top + topDiff;
	},

	// Places draggable where event indicates
	_setCss: function() {
		var newLeft = this.position.left,
			newTop = this.position.top;

		// User overriding left/top so shortcut math is no longer valid
		if ( this.tempPosition.left !== this.position.left ||
				this.tempPosition.top !== this.position.top ) {

			// Reset offset based on difference of expected and overridden values
			this.offset.left += newLeft - this.tempPosition.left;
			this.offset.top += newTop - this.tempPosition.top;
		}

		// TODO: does this work with nested scrollable parents?
		if ( this.cssPosition !== "fixed" ) {
			newLeft += this.scrollParent.scrollLeft();
			newTop += this.scrollParent.scrollTop();
		}

		this.dragEl.css({
			left: newLeft,
			top: newTop
		});
	},

	_originalHash: function( pointerPosition ) {
		var ret = {
			position: this.position,
			offset: copy( this.offset ),
			pointer: copy( pointerPosition )
		};

		if ( this.options.helper ) {
			ret.helper = this.dragEl;
		}

		return ret;
	},

	_fullHash: function( pointerPosition ) {
		return $.extend( this._originalHash( pointerPosition ), {
			originalPosition: copy( this.originalPosition ),
			originalOffset: copy( this.originalOffset ),
			originalPointer: copy( this.originalPointer )
		});
	},

	_blockFrames: function() {
		this.iframeBlocks = this.document.find( "iframe" ).map(function() {
			var iframe = $( this );

			return $( "<div>" )
				.css( "position", "absolute" )
				.appendTo( iframe.parent() )
				.outerWidth( iframe.outerWidth() )
				.outerHeight( iframe.outerHeight() )
				.offset( iframe.offset() )[ 0 ];
		});
	},

	_unblockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_destroy: function() {
		this.element.removeClass( "ui-draggable" );
		this._super();
	}
});

// Add containment option via extension
$.widget( "ui.draggable", $.ui.draggable, {
	options: {
		containment: null
	},

	_create: function() {
		this._super();
		this._on({
			dragstart: "_setContainment",
			drag: "_contain"
		});
	},

	_setContainment: function( event, ui ) {
		var offset, left, top, bottom, right,
			container = this._getContainer();

		if ( !container ) {
			this.containment = null;
			return;
		}

		if ( $.isArray( container ) ) {
			offset = container.offset();
			left = offset.left +
				(parseFloat( $.css( container[ 0 ], "borderLeftWidth", true ) ) || 0) +
				(parseFloat( $.css( container[ 0 ], "paddingLeft", true ) ) || 0);
			top = offset.top +
				(parseFloat( $.css( container[ 0 ], "borderTopWidth", true ) ) || 0) +
				(parseFloat( $.css( container[ 0 ], "paddingTop", true ) ) || 0);
			right = left + container.width();
			bottom = top + container.height();
		} else {
			left = container[ 0 ];
			top = container[ 1 ];
			right = container[ 2 ];
			bottom = container[ 3 ];
		}

		this.containment = {
			left: left,
			top: top,
			right: right,
			bottom: bottom,
			leftDiff: ui.originalOffset.left - ui.originalPosition.left,
			topDiff: ui.originalOffset.top - ui.originalPosition.top,
			width: this.dragDimensions.width,
			height: this.dragDimensions.height
		};
	},

	_contain: function( event, ui ) {
		var containment = this.containment;

		if ( !containment ) {
			return;
		}

		ui.position.left = Math.max( ui.position.left,
			containment.left - containment.leftDiff );
		ui.position.left = Math.min( ui.position.left,
			containment.right - containment.width - containment.leftDiff );

		ui.position.top = Math.max( ui.position.top,
			containment.top - containment.topDiff );
		ui.position.top = Math.min( ui.position.top,
			containment.bottom - containment.height - containment.topDiff );
	},

	_getContainer: function() {
		var container,
			containment = this.options.containment;

		if ( !containment ) {
			container = null;
		} else if ( containment === "parent" ) {
			container = this.element.parent();
		} else {
			container = $( containment );
			if ( !container.length ) {
				container = null;
			}
		}

		return container;
	}
});



// DEPRECATED
if ( $.uiBackCompat !== false ) {

	// appendTo "parent" value
	$.widget( "ui.draggable", $.ui.draggable, {
		_appendTo: function() {
			var element = this.options.appendTo;

			// This should only happen via _createHelper()
			if ( element === null ) {
				return this.element.parent();
			}

			if ( element === "parent" ) {
				element = this.dragEl.parent();
			}

			return element;
		}
	});

	// helper "original" or "clone" value + helper return value
	$.widget( "ui.draggable", $.ui.draggable, {
		_create: function() {
			if ( this.options.helper === "original" ) {
				this.options.helper = false;
			}

			if ( this.options.helper === "clone" ) {
				this.options.helper = true;
			}

			this._super();
		},

		_originalHash: function() {
			var ret = this._superApply( arguments );

			if ( !ret.helper ) {
				ret.helper = this.element;
			}

			return ret;
		},

		_setOption: function( key, value ) {
			if ( key === "helper" && value === "clone" ) {
				value = true;
			} else if ( key === "helper" && value === "original" ) {
				value = false;
			}

			this._super( key, value );
		}
	});

	// axis option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			axis: false
		},

		_create: function() {
			this._super();

			this._on({
				drag: function( event, ui ) {
					if ( this.options.axis === "x" ) {
						ui.position.top = ui.originalPosition.top;
					}

					if ( this.options.axis === "y" ) {
						ui.position.left = ui.originalPosition.left;
					}
				}
			});
		}
	});

	// cancel option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			cancel: null
		},

		_create: function() {
			if ( this.options.cancel !== null ) {
				this.options.exclude = this.options.cancel;
			}

			this._super();
		},

		_setOption: function( key, value ) {
			if ( key === "cancel" ) {
				key = "exclude";
			}

			this._super( key, value );
			this.options.cancel = this.options.exclude;
		}
	});

	// cursor option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			cursor: "auto"
		},

		_create: function() {
			var startCursor, body;

			this._super();

			body = $( this.document[ 0 ].body );

			this._on({
				// Cache original cursor to set back
				dragbeforestart: function() {
					if ( this.options.cursor ) {
						startCursor = body[ 0 ].style.cursor;
						body.css( "cursor", this.options.cursor );
					}
				},

				// Set back cursor to whatever default was
				dragstop: function() {
					if ( this.options.cursor ) {
						body.css( "cursor", startCursor );
					}
				}
			});
		}
	});

	// cursorAt option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			cursorAt: false
		},

		_create: function() {
			this._super();

			this._on({
				dragbeforestart: function( event, ui ) {
					var cursorAt = this.options.cursorAt;

					if ( !cursorAt ) {
						return;
					}

					if ( typeof cursorAt === "string" ) {
						cursorAt = cursorAt.split(" ");
					}
					if ( $.isArray( cursorAt ) ) {
						cursorAt = {
							left: +cursorAt[ 0 ],
							top: +cursorAt[ 1 ] || 0
						};
					}

					if ( "top" in cursorAt ) {
						ui.position.top += ui.pointer.y -
							ui.offset.top - cursorAt.top;
					}
					if ( "left" in cursorAt ) {
						ui.position.left += ui.pointer.x -
							ui.offset.left - cursorAt.left;
					}
					if ( "bottom" in cursorAt ) {
						ui.position.top += ui.pointer.y -
							ui.offset.top - this.dragDimensions.height +
							cursorAt.bottom;
					}
					if ( "right" in cursorAt ) {
						ui.position.left += ui.pointer.x -
							ui.offset.left - this.dragDimensions.width +
							cursorAt.right;
					}
				}
			});
		}
	});

	// grid option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			grid: false
		},

		_create: function() {
			var currentX, currentY;

			this._super();

			this._on({
				dragbeforestart: function( event, ui ) {
					if ( !this.options.grid ) {
						return;
					}

					// Save off the start position,
					// which may be overwritten during drag
					currentX = ui.position.left;
					currentY = ui.position.top;
				},

				drag: function( event, ui ) {
					if ( !this.options.grid ) {
						return;
					}

					// Save off the intended intervals
					var x = this.options.grid[ 0 ],
						y = this.options.grid[ 1 ];

					// Check that user is at least half way to next point on x axis
					if ( x ) {
						if ( ui.position.left - currentX >= x / 2 ) {
							currentX = currentX + x;
						}	else if ( currentX - ui.position.left >= x / 2 ) {
							currentX = currentX - x;
						}
					}

					// Check that user is at least half way to next point on y axis
					if ( y ) {
						if ( ui.position.top - currentY >= y / 2 ) {
							currentY = currentY + y;
						} else if ( currentY - ui.position.top >= y / 2 ) {
							currentY = currentY - y;
						}
					}

					// Force the draggable to the appropriate spot on the grid
					ui.position.left = currentX;
					ui.position.top = currentY;
				}
			});
		}
	});

	// opacity option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			opacity: false
		},

		_create: function() {
			var originalOpacity;

			this._super();

			this._on({
				dragstart: function() {
					if ( !this.options.opacity ) {
						return;
					}

					// Cache the original opacity of draggable element to reset later
					originalOpacity = this.dragEl.css( "opacity" );

					// Set draggable element to new opacity
					this.dragEl.css( "opacity", this.options.opacity );
				},

				dragstop: function() {
					if ( !this.options.opacity ) {
						return;
					}

					// Reset opacity
					this.dragEl.css( "opacity", originalOpacity );
				}
			});
		}
	});

	// TODO: handle droppables
	// revert + revertDuration options
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			revert: false,
			revertDuration: 500
		},

		_create: function() {
			var originalLeft, originalTop, originalPosition;

			this._super();

			this._on({
				dragbeforestart: function() {
					if ( !this.options.revert ) {
						return;
					}

					// Cache the original css of draggable element to reset later
					originalLeft = this.dragEl.css( "left" );
					originalTop = this.dragEl.css( "top" );
					originalPosition = this.dragEl.css( "position" );
				},

				dragstop: function() {
					if ( !this.options.revert ) {
						return;
					}

					// Reset to before drag
					this.dragEl.animate({
						left: originalLeft,
						top: originalTop,
						position: originalPosition
					}, this.options.revertDuration );
				}
			});
		}
	});

	// zIndex option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			zIndex: false
		},

		_create: function() {
			var originalZindex;

			this._super();

			this._on({
				dragstart: function() {
					if ( !this.options.zIndex ) {
						return;
					}

					// Cache the original zIndex of draggable element to reset later
					originalZindex = this.dragEl.css( "z-index" );

					// Set draggable element to new zIndex
					this.dragEl.css( "z-index", this.options.zIndex );
				},

				dragstop: function() {
					if ( !this.options.zIndex ) {
						return;
					}

					// Reset zIndex
					this.dragEl.css( "z-index", originalZindex );
				}
			});
		}
	});

	// scope option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			scope: "default"
		}
	});

	// scroll + scrollSensitivity + scrollSpeedType option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			scroll: true,
			scrollSpeed: 20,
			scrollSensitivity: 20
		},

		_speed: function( distance ) {
			if ( this.options.scrollSpeed !== null ) {
				this.scrollSpeed = this.options.scrollSpeed;

				// Undo calculation that makes things go faster as distance increases
				distance = 0;
			}

			return this._super( distance );
		},

		_handleScrolling: function( pointerPosition ) {
			if ( !this.options.scroll ) {
				return;
			}

			if ( this.options.scrollSensitivity !== null ) {
				this.scrollSensitivity = this.options.scrollSensitivity;
			}

			this._super( pointerPosition );
		}
	});

	// stack option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			stack: false
		},

		_create: function() {
			this._super();

			this._on({
				dragbeforestart: function() {
					var group, min,
						stack = this.options.stack;

					if ( !stack ) {
						return;
					}

					group = $.makeArray( $( stack ) ).sort(function( a, b ) {
						var aZIndex = parseInt( $( a ).css( "zIndex" ), 10 ) || 0,
							bZIndex = parseInt( $( b ).css( "zIndex" ), 10 ) || 0;
						return aZIndex - bZIndex;
					});

					if ( !group.length ) {
						return;
					}

					min = parseInt( group[ 0 ].style.zIndex, 10 ) || 0;

					$( group ).each(function( i ) {
						this.style.zIndex = min + i;
					});

					this.element.css( "zIndex", min + group.length );
				}
			});
		}
	});

	// TODO: cleanup
	// snap, snapMode, and snapTolerance options
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			snap: false,
			snapMode: "both",
			snapTolerance: 20
		},

		_create: function() {
			var inst = this,
				snapElements;

			this._super();

			this.element.on( "dragstart", function() {

				// Nothing to do
				if ( !inst.options.snap ) {
					return;
				}

				// Reset snapElements on every start in case there have been changes
				snapElements = [];

				// Select either all draggable elements, or the selector that was passed in
				$( inst.options.snap === true ? ":data(ui-draggable)" : inst.options.snap ).each(function() {

					var el = $(this),
						offset = el.offset();

					// Don't add this draggable to list of elements for snapping
					if( this === inst.element[0] ) {
						return;
					}

					// Save off elements dimensions for later
					snapElements.push({
						item: this,
						width: el.outerWidth(),
						height: el.outerHeight(),
						top: offset.top,
						left: offset.left
					});

				});

				inst.margins = {
					left: (parseInt(inst.element.css("marginLeft"),10) || 0),
					top: (parseInt(inst.element.css("marginTop"),10) || 0),
					right: (parseInt(inst.element.css("marginRight"),10) || 0),
					bottom: (parseInt(inst.element.css("marginBottom"),10) || 0)
				};

			});

			this.element.on( "drag", function( event, ui ) {

				// Nothing to do
				if ( !inst.options.snap ) {
					return;
				}

				var ts, bs, ls, rs, l, r, t, b, i, first,
					o = inst.options,
					d = o.snapTolerance,
					x1 = ui.offset.left, x2 = x1 + inst.dragDimensions.width,
					y1 = ui.offset.top, y2 = y1 + inst.dragDimensions.height;

				for (i = snapElements.length - 1; i >= 0; i--){
					l = snapElements[i].left;
					r = l + snapElements[i].width;
					t = snapElements[i].top;
					b = t + snapElements[i].height;

					//Yes, I know, this is insane ;)
					if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
						if(snapElements[i].snapping) {
							(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: snapElements[i].item })));
						}
						snapElements[i].snapping = false;
						continue;
					}

					if(o.snapMode !== "inner") {
						ts = Math.abs(t - y2) <= d;
						bs = Math.abs(b - y1) <= d;
						ls = Math.abs(l - x2) <= d;
						rs = Math.abs(r - x1) <= d;
						if(ts) {
							ui.position.top = inst._convertPositionTo("relative", { top: t - inst.dragDimensions.height, left: 0 }).top - inst.margins.top;
						}
						if(bs) {
							ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
						}
						if(ls) {
							ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.dragDimensions.width }).left - inst.margins.left;
						}
						if(rs) {
							ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
						}
					}

					first = (ts || bs || ls || rs);

					if(o.snapMode !== "outer") {
						ts = Math.abs(t - y1) <= d;
						bs = Math.abs(b - y2) <= d;
						ls = Math.abs(l - x1) <= d;
						rs = Math.abs(r - x2) <= d;
						if(ts) {
							ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
						}
						if(bs) {
							ui.position.top = inst._convertPositionTo("relative", { top: b - inst.dragDimensions.height, left: 0 }).top - inst.margins.top;
						}
						if(ls) {
							ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
						}
						if(rs) {
							ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.dragDimensions.width }).left - inst.margins.left;
						}
					}

					if(!snapElements[i].snapping && (ts || bs || ls || rs || first)) {
						(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: snapElements[i].item })));
					}
					snapElements[i].snapping = (ts || bs || ls || rs || first);
				}
			});
		},

		_convertPositionTo: function(d, pos) {
			if(!pos) {
				pos = this.position;
			}

			var mod = d === "absolute" ? 1 : -1,
				offset = {},
				scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

			$.extend(offset, {
				parent: this._getParentOffset(),
				relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
			});

			return {
				top: (
					pos.top	+																// The absolute mouse position
					offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
					offset.parent.top * mod -										// The offsetParent's offset without borders (offset + border)
					( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
				),
				left: (
					pos.left +																// The absolute mouse position
					offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
					offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
					( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
				)
			};
		},

		_getParentOffset: function() {

			//Get the offsetParent and cache its position
			this.offsetParent = this.dragEl.offsetParent();
			var po = this.offsetParent.offset();

			// This is a special case where we need to modify a offset calculated on start, since the following happened:
			// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
			// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
			//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
			if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
				po.left += this.scrollParent.scrollLeft();
				po.top += this.scrollParent.scrollTop();
			}

			//This needs to be actually done for all browsers, since pageX/pageY includes this information
			//Ugly IE fix
			if((this.offsetParent[0] === document.body) ||
				(this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
				po = { top: 0, left: 0 };
			}

			return {
				top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
				left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
			};
		},

		_getRelativeOffset: function() {
			if(this.cssPosition === "relative") {
				var p = this.element.position();
				return {
					top: p.top - (parseInt(this.dragEl.css("top"),10) || 0) + this.scrollParent.scrollTop(),
					left: p.left - (parseInt(this.dragEl.css("left"),10) || 0) + this.scrollParent.scrollLeft()
				};
			}

			return { top: 0, left: 0 };
		}
	});

	// refreshPositions option
	$.widget( "ui.draggable", $.ui.draggable, {
		options: {
			refreshPositions: false
		},

		_create: function() {
			var drops;

			this._super();

			this._on({
				dragstart: function() {
					drops = $( ":data(ui-sortable)" );
				},

				drag: function() {
					if ( this.options.refreshPositions !== true ) {
						return;
					}

					drops.each(function() {
						$( this ).sortable( "refreshPositions" );
					});
				}
			});
		}
	});
}

})( jQuery );
