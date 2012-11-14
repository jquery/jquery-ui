/*!
 * jQuery UI Sortable @VERSION
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Sortable
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.interaction.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

// create a shallow copy of an object
function copy( obj ) {
	var prop,
		ret = {};
	for ( prop in obj ) {
		ret[ prop ] = obj[ prop ];
	}
	return ret;
}

$.widget( "ui.sortable", $.ui.interaction, {
	version: "@VERSION",
	widgetEventPrefix: "sort",
	items: 'li', // TODO: move to options when API is ready
	
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
	// sortablePositions: cache of positions of all sortable items
	// originalCssPosition: CSS position of element before being made absolute on start
	// placeholder: reference to jquery object of cloned element that is being dragged

	options: {
	},

	_create: function() {
	
		this._super();

		this.element.addClass( "ui-sortable" );
		
		this._setSortablePositions();
		
	},
	
	_setSortablePositions: function() {
	
		var sortablePositions = this.sortablePositions = [];
		
		this.element.find( this.items ).each( function() {
		
			var el = $(this);
		
			sortablePositions.push([{
				el: el,
				offset: el.offset()
			}]);
		});
	
	}, 

	/** interaction interface **/
	
	_isValidTarget: function( element ) {
	
		// TODO: options for what is actually valid
		return element.is( this.items );
	},

	_start: function( event, pointerPosition ) {
	
		var offset;

		// The actual dragging element, should always be a jQuery object
		// this.dragEl = this.options.helper ?
			// this._createHelper( pointerPosition ) :
			// this.element;
			
		this.dragEl = $(event.target);
		
		// Save original css position if there are currently styles
		// Otherwise the original css will be set back by removing attribute
		if ( this.dragEl[0].style.position ) {
			this.originalCssPosition = this.dragEl[0].style.position;
		}
		
		// Create placeholder for while element is dragging
		// TODO: what do we do about IDs?
		// TODO: possibly use CSS for visibility portion
		this.placeholder = this.dragEl.clone().removeAttr('id').css({
			visibility : 'hidden',
			position : this.originalCssPosition || ''
		});

		this.dragEl.after( this.placeholder );
		
		this.dragEl.css( 'position', 'absolute' );

		// // _createHelper() ensures that helpers are in the correct position
		// // in the DOM, but we need to handle appendTo when there is no helper
		// if ( this.options.appendTo && this.dragEl === this.element ) {
			// this.domPosition = {
				// parent: this.element.parent(),
				// index: this.element.index()
			// };
			// offset = this.dragEl.offset();
			// this.dragEl
				// .appendTo( this.options.appendTo )
				// .offset( offset );
		// }

		this.cssPosition = this.dragEl.css( "position" );
		this.scrollParent = this.element.scrollParent();

		// Cache starting positions
		this.originalPosition = this.startPosition = this._getPosition();
		this.originalOffset = this.startOffset = this.dragEl.offset();
		this.originalPointer = pointerPosition;

		// Cache current position and offset
		this.position = copy( this.startPosition );
		this.offset = copy( this.startOffset );

		// Cache the offset of scrollParent, if required for _handleScrolling
		if ( this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== "HTML" ) {
			this.overflowOffset = this.scrollParent.offset();
		}

		this.overflow = {
			height: this.scrollParent[0] === this.document[0] ?
				this.window.height() : this.scrollParent.height(),
			width: this.scrollParent[0] === this.document[0] ?
				this.window.width() : this.scrollParent.width()
		};

		this._preparePosition( pointerPosition );

		// If user cancels beforeStart, don't allow dragging
		if ( this._trigger( "beforeStart", event,
				this._originalHash( pointerPosition ) ) === false ) {
			return false;
			
		}

		this._setCss();
		this.startPosition = this._getPosition();
		this.startOffset = this.dragEl.offset();

		this._trigger( "start", event, this._fullHash( pointerPosition ) );
		this._blockFrames();
	},
	
	_move: function( event, pointerPosition ) {
	
		var sort, sortItem, top, left, sortIndex, 
			len = this.sortablePositions.length;
			
			
		this._preparePosition( pointerPosition );

		// // If user cancels drag, don't move the element
		// if ( this._trigger( "drag", event, this._fullHash( pointerPosition ) ) === false ) {
			// return;
		// }

		this._setCss();

		// Scroll the scrollParent, if needed
		this._handleScrolling( pointerPosition );
		
		for ( sortIndex=0; sortIndex<len; ++sortIndex ) {
		
			for ( sort in this.sortablePositions[sortIndex] ) {
			
				sortItem = this.sortablePositions[sortIndex][sort];
				
				// Don't bother checking against self
				if ( sortItem.el[0] === this.dragEl[0] ) {
					continue;
				}
				
				if ( this._over( sortItem ) )  {
				
					// TODO: cache height of element
					if ( ( this.offset.top + this.dragEl.height() )	> ( sortItem.offset.top + sortItem.el.height()/2 ) ) {
					
						sortItem.el.after( this.dragEl );
						this.dragEl.after( this.placeholder );
						this._setSortablePositions();
					}
					else if ( this.offset.top	< ( sortItem.offset.top + sortItem.el.height()/2 ) ) {
						sortItem.el.before( this.dragEl );
						this.dragEl.before( this.placeholder );
						this._setSortablePositions();
					}
				
				}
				
				
			}
		}
		
	},
	
	// TODO: swap out for real tolerance options
	_over: function( sortItem ) {
	
		// TODO: use same cache from _move for height and width of element
		var edges = {
			droppableRight: sortItem.offset.left + sortItem.el.width(),
			droppableBottom: sortItem.offset.top + sortItem.el.height(),
			draggableRight: this.offset.left + this.dragEl.width(),
			draggableBottom: this.offset.top + this.dragEl.height()
		};
		
		return sortItem.offset.left < edges.draggableRight &&
				edges.droppableRight > this.offset.left &&
				sortItem.offset.top < edges.draggableBottom &&
				edges.droppableBottom > sortItem.offset.top;
	
	},

	_stop: function( event, pointerPosition ) {
		
		var parent, next;

		this._preparePosition( pointerPosition );

		// // If user cancels stop, leave helper there
		// if ( this._trigger( "stop", event, this._fullHash( pointerPosition ) ) !== false ) {
			// if ( this.options.helper ) {
				// this.dragEl.remove();
			// }
			// this._resetDomPosition();
		// }

		// If there were inline styles before drag, set them back
		if ( this.originalCssPosition ) {
			this.dragEl.css( 'position', this.originalCssPosition );
		}
		// If there were no inline styles, let CSS take over again by removing inline absolute
		else {
			this.dragEl.css( 'position', '' );
		}
		
		// TODO: should same thing be done here as is done for position or is there better way altogether
		this.dragEl.css( 'left', '' );
		this.dragEl.css( 'top', '' );
		
		this.placeholder.remove();

		// Unset properties only needed during draggin/sorting
		this.dragEl = null;
		this.originalCssPosition = null;
		this.placeholder = null;

		this._unblockFrames();
	},

	// /** internal **/

	// _createHelper: function( pointerPosition ) {
		// var helper,
			// offset = this.element.offset(),
			// xPos = (pointerPosition.x - offset.left) / this.element.outerWidth(),
			// yPos = (pointerPosition.y - offset.top) / this.element.outerHeight();

		// // clone
		// if ( this.options.helper === true ) {
			// helper = this.element.clone()
				// .removeAttr( "id" )
				// .find( "[id]" )
					// .removeAttr( "id" )
				// .end();
		// } else {
			// // TODO: figure out the signature for this; see #4957
			// helper = $( this.options.helper() );
		// }

		// // Ensure the helper is in the DOM; obey the appendTo option if it exists
		// if ( this.options.appendTo || !helper.closest( "body" ).length ) {
			// helper.appendTo( this.options.appendTo || this.document[0].body );
		// }

		// return helper
			// // Helper must be absolute to function properly
			// .css( "position", "absolute" )
			// .offset({
				// left: pointerPosition.x - helper.outerWidth() * xPos,
				// top: pointerPosition.y - helper.outerHeight() * yPos
			// });
	// },

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

		// When using relative, css values are checked
		// Otherwise the position wouldn't account for padding on ancestors
		left = this.dragEl.css( "left" );
		top = this.dragEl.css( "top" );

		// Webkit will give back auto if there is no explicit value
		left = ( left === "auto" ) ? 0: parseInt( left, 10 );
		top = ( top === "auto" ) ? 0: parseInt( top, 10 );

		return {
			left: left - scrollLeft,
			top: top - scrollTop
		};
	},

	_handleScrolling: function( pointerPosition ) {
		var scrollTop = this.scrollParent.scrollTop(),
			scrollLeft = this.scrollParent.scrollLeft(),
			scrollSensitivity = 20,
			baseSpeed = 5,
			speed = function( distance ) {
				return baseSpeed + Math.round( distance / 2 );
			},
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
			this.scrollParent.scrollTop( scrollTop +
				speed( scrollSensitivity - yBottom ) );
		} else if ( yTop < scrollSensitivity ) {
			this.scrollParent.scrollTop( scrollTop -
				speed( scrollSensitivity - yTop ) );
		}

		// Handle horizontal scrolling
		if ( xRight < scrollSensitivity ) {
			this.scrollParent.scrollLeft( scrollLeft +
				speed( scrollSensitivity - xRight ) );
		} else if ( xLeft < scrollSensitivity ) {
			this.scrollParent.scrollLeft( scrollLeft -
				speed( scrollSensitivity - xLeft ) );
		}
	},

	// Uses event to determine new position of draggable, before any override from callbacks
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

	// Places draggable where event, or user via event/callback, indicates
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
		var body = this.document[0].body;

		this.iframeBlocks = this.document.find( "iframe" ).map(function() {
			var iframe = $( this ),
				iframeOffset = iframe.offset();

			return $( "<div>" )
				.css({
					position: "absolute",
					width: iframe.outerWidth(),
					height: iframe.outerHeight(),
					top: iframeOffset.top,
					left: iframeOffset.left
				})
				.appendTo( body )[0];
		});
	},

	_unblockFrames: function() {
		if ( this.iframeBlocks ) {
			this.iframeBlocks.remove();
			delete this.iframeBlocks;
		}
	},

	_destroy: function() {
		this.element.removeClass( "ui-sortable" );
		this._super();
	}
});
})( jQuery );