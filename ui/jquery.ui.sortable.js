/*!
 * jQuery UI Sortable @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
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

	// sorting: element being sorted
	// 	.element: jQuery object
	// 	.originalCss: CSS position of element before being made absolute on start
	// helper: element being sorted (original or helper)
	// 	.element: jquery object
	// 	.position: final CSS position of helper
	// 	.offset: offset of helper
	// 	.originalPosition: CSS position before drag start
	// 	.originalOffset: offset before drag start
	// 	.proportions: width and height properties
	// 	.startPosition: CSS position at drag start (after beforeStart)
	// 	.startOffset: offset at drag start (after beforeStart)
	// 	.tempPosition: overridable CSS position of helper
	// horizontallyAlignedItems
	// items: cache of positions of all sortable items
	// originalPointer: pageX/Y at drag start (offset of pointer)
	// overflowOffset: offset of scroll parent
	// overflow: object containing width and height keys of scroll parent
	// placeholder: reference to jquery object of cloned element that is being dragged

	options: {
		appendTo: null,
		exclude: "input,textarea,button,select",
		handle: null,
		helper: false,
		items: "> *",
		placeholder: null,
		tolerance: "intersect"
	},

	_create: function() {

		var float, inline;

		this._super();

		this.element.addClass( "ui-sortable" );

		this._refreshItems();

		// TODO: What if there are no items yet, and they'll happen to be horizontally aligned?
		if ( this.items.length ) {
			float = ( /left|right/ ).test( this.items[0].element.css( "float" ) );
			inline = ( /inline|table-cell/ ).test( this.items[0].element.css("display") );
		}

		this.horizontallyAlignedItems = float || inline;
	},

	_refreshItems: function() {

		var items = this.items = [];

		this.element.find( this.options.items ).each( function() {

			var item,
				element = $(this),
				offset = element.offset(),
				width = element.outerWidth(),
				height = element.outerHeight();

			item = {
				edges: {
					right: width + offset.left,
					bottom: height + offset.top
				},
				element: element,
				offset: offset,
				proportions: {
					width: width,
					height: height
				}
			}

			items.push( item );
		});
	},

	/** interaction interface **/

	_isValidTarget: function( element ) {
		return !!( element.closest( this.element.find( this.options.items ) ).length &&
			( !this.options.handle || element.closest( this.element.find( this.options.handle ) ).length ) &&
			!element.closest( this.element.find( this.options.exclude ) ).length );
	},

	_start: function( event, pointerPosition ) {

		this.sorting = {
			element: $( event.target ).closest( this.element.find( this.options.items ) )
		};

		// Save original css position if there are currently styles
		// Otherwise the original css will be set back by removing attribute
		this.sorting.originalCss = {
			position: this.sorting.element[0].style.position,
			bottom: this.sorting.element[0].style.bottom,
			left: this.sorting.element[0].style.left,
			right: this.sorting.element[0].style.right,
			top: this.sorting.element[0].style.top
		}

		this.placeholder = this._createPlaceholder();

		// Helper could be appended anywhere so insert the placeholder first
		this.sorting.element.after( this.placeholder );
		this.helper = this._createHelper( pointerPosition );

		if ( this.options.helper !== false ) {
			this._refreshItems();
		}

		this.helper.cssPosition = this.helper.element.css( "position" );
		this.scrollParent = this.element.scrollParent();

		// Cache current position (offset was cached at creation)
		this.helper.position = this._getPosition();

		// Cache starting positions
		this.helper.originalPosition = this.helper.startPosition = copy( this.helper.position );
		this.helper.originalOffset = this.helper.startOffset = copy( this.helper.offset );
		this.originalPointer = pointerPosition;

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
		this.helper.startPosition = this._getPosition();
		this.helper.startOffset = this.helper.offset;

		this._trigger( "start", event, this._fullHash( pointerPosition ) );
		this._blockFrames();
	},

	_move: function( event, pointerPosition ) {

		var helperMiddleY, itemMiddleY, sort, sortItem, sortIndex,
			beforePlaceholder = true,
			dragDirection = this.horizontallyAlignedItems ?
				this.helper.horizontalDragDirection : this.helper.verticalDragDirection;
			len = this.items.length;


		this._preparePosition( pointerPosition );

		// // If user cancels drag, don't move the element
		// if ( this._trigger( "drag", event, this._fullHash( pointerPosition ) ) === false ) {
			// return;
		// }

		this._setCss();

		// Scroll the scrollParent, if needed
		this._handleScrolling( pointerPosition );

		for ( sortIndex=0; sortIndex<len; ++sortIndex ) {

			sortItem = this.items[sortIndex];

			// Don't bother checking against self
			if ( sortItem.element[0] === this.helper.element[0] ) {
				continue;
			}

			if ( sortItem.element[0] === this.placeholder[0] ) {
				beforePlaceholder = false;
				continue;
			}

			// If we're still over the same item from last sort and the drag direction hasn't changed, don't resort
			if ( this._over( sortItem, pointerPosition ) ) {
				if ( !this.lastSortDragDirection || dragDirection === -this.lastSortDragDirection ) {

					beforePlaceholder ?
						sortItem.element.before( this.placeholder ) :
						sortItem.element.after( this.placeholder );

					this.lastSortDragDirection = dragDirection;

					this._refreshItems();
				}

				return;
			}
		}

		// This reset also serves to indicate we're not over the same element anymore
		this.lastSortDragDirection = null;
	},

	_over: function( sortItem, pointerPosition ) {
		return $.ui.sortable.tolerance[ this.options.tolerance ]
			.call( this, this.helper, sortItem, pointerPosition );
	},

	_stop: function( event, pointerPosition ) {

		this._preparePosition( pointerPosition );

		// // If user cancels stop, leave helper there
		// if ( this._trigger( "stop", event, this._fullHash( pointerPosition ) ) !== false ) {
			// if ( this.options.helper ) {
				// this.helper.remove();
			// }
			// this._resetDomPosition();
		// }

		// If helper is a clone or user generated, remove
		if ( this.options.helper !== false ) {
			this.helper.element.remove();
		} else {
			this.sorting.element.css( this.sorting.originalCss );
		}

		this.placeholder.replaceWith( this.sorting.element ).remove();

		// Unset properties only needed during draggin/sorting
		this.sorting = null;
		this.helper = null;
		this.placeholder = null;

		this._unblockFrames();
	},

	// /** internal **/

	_createHelper: function( pointerPosition ) {
		var helper = {},
			offset = this.sorting.element.offset(),
			xPos = (pointerPosition.x - offset.left) / this.sorting.element.outerWidth(),
			yPos = (pointerPosition.y - offset.top) / this.sorting.element.outerHeight();

		// clone
		if ( this.options.helper === false ) {
			helper.element = this.sorting.element;
		}
		else {
			if ( this.options.helper === true ) {
				helper.element = this.sorting.element.clone()
					.removeAttr( "id" )
					.find( "[id]" )
						.removeAttr( "id" )
					.end();
			}
			else {
				// // TODO: figure out the signature for this; see #4957
				helper.element = $( this.options.helper() );
			}

			this.sorting.element.replaceWith( helper.element );
		}

		// Ensure the helper is in the DOM; obey the appendTo option if it exists
		if ( this.options.appendTo || !helper.element.closest( this.document.find( "body" ) ).length ) {
			helper.element.appendTo( this.options.appendTo || this.element );
		}

		helper.proportions = {
			width: helper.element.outerWidth(),
			height: helper.element.outerHeight()
		};

		helper.offset = {
			left: pointerPosition.x - helper.proportions.width * xPos,
			top: pointerPosition.y - helper.proportions.height * yPos
		};

		// Used to determine drag direction
		helper.lastOffset = helper.offset;

		helper.element
			// Helper must be absolute to function properly
			.css( "position", "absolute" )
			.offset({
				left: helper.offset.left,
				top: helper.offset.top
			});

		return helper;
	},

	_createPlaceholder: function() {
		return $.isFunction( this.options.placeholder ) ?
			$( this.options.placeholder( this.sorting ) ) :
			this.sorting.element.clone().removeAttr("id").css({
				visibility : "hidden",
				position : this.sorting.originalCss.position || ""
			});
	},

	_getPosition: function() {
		var left, top, position,
			scrollTop = this.scrollParent.scrollTop(),
			scrollLeft = this.scrollParent.scrollLeft();

		// If fixed or absolute
		if ( this.helper.cssPosition !== "relative" ) {
			position = this.helper.element.position();

			// Take into account scrollbar
			position.top -= scrollTop;
			position.left -= scrollLeft;

			return position;
		}

		// When using relative, css values are checked
		// Otherwise the position wouldn't account for padding on ancestors
		left = this.helper.element.css( "left" );
		top = this.helper.element.css( "top" );

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
			topDiff = pointerPosition.y - this.originalPointer.y;

		// Save off new values for .css() in various callbacks using this function
		this.helper.position = {
			left: leftDiff + this.helper.startPosition.left,
			top: topDiff + this.helper.startPosition.top
		};

		// Save off values to compare user override against automatic coordinates
		this.helper.tempPosition = copy( this.helper.position );

		this.helper.lastOffset = this.helper.offset;

		this.helper.offset = {
			left: leftDiff + this.helper.startOffset.left,
			top: topDiff + this.helper.startOffset.top
		};
	},

	// Places draggable where event, or user via event/callback, indicates
	_setCss: function() {
		var horizontalDelta, verticalDelta, 
			newLeft = this.helper.position.left,
			newTop = this.helper.position.top;

		// User overriding left/top so shortcut math is no longer valid
		if ( this.helper.tempPosition.left !== this.helper.position.left ||
				this.helper.tempPosition.top !== this.helper.position.top ) {
			// Reset offset based on difference of expected and overridden values
			this.helper.offset.left += newLeft - this.helper.tempPosition.left;
			this.helper.offset.top += newTop - this.helper.tempPosition.top;
		}

		// TODO: does this work with nested scrollable parents?
		if ( this.helper.cssPosition !== "fixed" ) {
			newLeft += this.scrollParent.scrollLeft();
			newTop += this.scrollParent.scrollTop();
		}

		this.helper.edges = {
			right: this.helper.offset.left + this.helper.proportions.width,
			bottom: this.helper.offset.top + this.helper.proportions.height
		};

		// -1 is up, 1 is down
		horizontalDelta = this.helper.offset.left - this.helper.lastOffset.left;
		this.helper.horizontalDragDirection = horizontalDelta ? horizontalDelta / Math.abs( horizontalDelta ) : 0;

		verticalDelta = this.helper.offset.top - this.helper.lastOffset.top;
		this.helper.verticalDragDirection = verticalDelta ? verticalDelta / Math.abs( verticalDelta ) : 0;

		this.helper.element.css({
			left: newLeft,
			top: newTop
		});
	},

	_originalHash: function( pointerPosition ) {
		var ret = {
			position: this.helper.position,
			offset: copy( this.helper.offset ),
			pointer: copy( pointerPosition )
		};

		if ( this.options.helper ) {
			ret.helper = this.helper.element;
		}

		return ret;
	},

	_fullHash: function( pointerPosition ) {
		return $.extend( this._originalHash( pointerPosition ), {
			originalPosition: copy( this.helper.originalPosition ),
			originalOffset: copy( this.helper.originalOffset ),
			originalPointer: copy( this.originalPointer )
		});
	},

	_blockFrames: function() {

		this.iframeBlocks = this.document.find( "iframe" ).map(function() {
			var iframe = $( this );

			return $( "<div>" )
				.css({
					position: "absolute",
					width: iframe.outerWidth(),
					height: iframe.outerHeight()
				})
				.appendTo( iframe.parent() )
				.offset( iframe.offset() )[0];
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

$.extend( $.ui.sortable, {
	tolerance: {
		// Half of the helper overlaps the item, horizontally and vertically
		intersect: function( helper, item ) {
			var helperMiddleX = helper.offset.left + helper.proportions.width / 2,
				helperMiddleY = helper.offset.top + helper.proportions.height / 2;

			return item.offset.left < helperMiddleX && item.edges.right > helperMiddleX &&
				item.offset.top < helperMiddleY && item.edges.bottom > helperMiddleY;
		},

		// Pointer overlaps item
		pointer: function( helper, item, pointerPosition ) {
			return pointerPosition.x >= item.offset.left && pointerPosition.x <= item.edges.right &&
				pointerPosition.y >= item.offset.top && pointerPosition.y <= item.edges.bottom;
		},

		// Helper overlaps item by at least one pixel
		touch: function( helper, item, pointerPosition ) {
			return item.offset.left < helper.edges.right && item.edges.right > helper.offset.left &&
				item.offset.top < helper.edges.bottom && item.edges.bottom > helper.offset.top;
		}
	}
});

})( jQuery );
