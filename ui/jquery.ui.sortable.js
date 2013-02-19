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
	// 	.el: jQuery object
	// 	.originalCss: CSS position of element before being made absolute on start
	// helper: element being sorted (original or helper)
	// 	.el: jquery object
	// 	.position: final CSS position of helper
	// 	.offset: offset of helper
	// 	.originalPosition: CSS position before drag start
	// 	.originalOffset: offset before drag start
	// 	.proportions: width and height properties
	// 	.startPosition: CSS position at drag start (after beforeStart)
	// 	.startOffset: offset at drag start (after beforeStart)
	// 	.tempPosition: overridable CSS position of helper
	// originalPointer: pageX/Y at drag start (offset of pointer)
	// overflowOffset: offset of scroll parent
	// overflow: object containing width and height keys of scroll parent
	// sortablePositions: cache of positions of all sortable items
	// placeholder: reference to jquery object of cloned element that is being dragged

	options: {
		helper: false,
		items: "> *"
	},

	_create: function() {

		this._super();

		this.element.addClass( "ui-sortable" );

		this._setSortablePositions();

	},

	_setSortablePositions: function() {

		var sortablePositions = this.sortablePositions = [];

		this.element.find( this.options.items ).each( function() {

			var el = $(this);

			sortablePositions.push([{
				el: el,
				offset: el.offset()
			}]);
		});

	},

	/** interaction interface **/

	_getTarget: function( element ) {
		return element.closest( this.element.find( this.options.items ) );
	},

	_isValidTarget: function( element ) {
		// Assume this is only called once before _start()
		this.sorting = { el: this._getTarget( element ) };
		return this.sorting.el.length === 1;
	},

	_start: function( event, pointerPosition ) {

		// Save original css position if there are currently styles
		// Otherwise the original css will be set back by removing attribute
		this.sorting.originalCss = {
			position: this.sorting.el[0].style.position,
			bottom: this.sorting.el[0].style.bottom,
			left: this.sorting.el[0].style.left,
			right: this.sorting.el[0].style.right,
			top: this.sorting.el[0].style.top
		}

		// Create placeholder for while element is dragging
		// TODO: what do we do about IDs?
		// TODO: possibly use CSS for visibility portion
		this.placeholder = this.sorting.el.clone().removeAttr("id").css({
			visibility : "hidden",
			position : this.sorting.originalCss.position || ""
		});

		// Helper could be appended anywhere so insert the placeholder first
		this.sorting.el.after( this.placeholder );
		this.helper = this._createHelper( pointerPosition );

		// // _createHelper() ensures that helpers are in the correct position
		// // in the DOM, but we need to handle appendTo when there is no helper
		// if ( this.options.appendTo && this.helper === this.element ) {
			// this.domPosition = {
				// parent: this.element.parent(),
				// index: this.element.index()
			// };
			// offset = this.helper.offset();
			// this.helper
				// .appendTo( this.options.appendTo )
				// .offset( offset );
		// }

		this.helper.cssPosition = this.helper.el.css( "position" );
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

		var sort, sortItem, sortIndex,
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
				if ( sortItem.el[0] === this.helper.el[0] ) {
					continue;
				}

				if ( this._over( sortItem ) )  {

					// TODO: cache height of element
					if ( ( this.helper.offset.top + this.helper.proportions.height ) > ( sortItem.offset.top + sortItem.el.height()/2 ) ) {

						sortItem.el.after( this.placeholder );
						this._setSortablePositions();
					}
					else if ( this.helper.offset.top < ( sortItem.offset.top + sortItem.el.height()/2 ) ) {
						sortItem.el.before( this.placeholder );
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
			draggableRight: this.helper.offset.left + this.helper.proportions.width,
			draggableBottom: this.helper.offset.top + this.helper.proportions.height
		};

		return sortItem.offset.left < edges.draggableRight &&
				edges.droppableRight > this.helper.offset.left &&
				sortItem.offset.top < edges.draggableBottom &&
				edges.droppableBottom > sortItem.offset.top;

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
			this.helper.el.remove();
		} else {
			this.sorting.el.css( this.sortEl.originalCss );
		}

		this.placeholder.replaceWith( this.sorting.el ).remove();

		// Unset properties only needed during draggin/sorting
		this.sorting = null;
		this.helper = null;
		this.placeholder = null;

		this._unblockFrames();
	},

	// /** internal **/

	_createHelper: function( pointerPosition ) {
		var helper = {},
			offset = this.sorting.el.offset(),
			xPos = (pointerPosition.x - offset.left) / this.sorting.el.outerWidth(),
			yPos = (pointerPosition.y - offset.top) / this.sorting.el.outerHeight();

		// clone
		if ( this.options.helper === false ) {
			helper.el = this.sorting.el;
		}
		else {
			if ( this.options.helper === true ) {
				helper.el = this.sorting.el.clone()
					.removeAttr( "id" )
					.find( "[id]" )
						.removeAttr( "id" )
					.end();
			}
			else {
				// // TODO: figure out the signature for this; see #4957
				helper.el = $( this.options.helper() );
			}

			this.sorting.el.replaceWith( helper.el );
		}

		// Ensure the helper is in the DOM; obey the appendTo option if it exists
		if ( this.options.appendTo || !helper.el.closest( this.document.find( "body" ) ).length ) {
			helper.el.appendTo( this.options.appendTo || this.element );
		}

		helper.proportions = {
			width: helper.el.outerWidth(),
			height: helper.el.outerHeight()
		};

		helper.offset = {
			left: pointerPosition.x - helper.proportions.width * xPos,
			top: pointerPosition.y - helper.proportions.height * yPos
		}

		helper.el
			// Helper must be absolute to function properly
			.css( "position", "absolute" )
			.offset({
				left: helper.offset.left,
				top: helper.offset.top
			});

		return helper;
	},

	_getPosition: function() {
		var left, top, position,
			scrollTop = this.scrollParent.scrollTop(),
			scrollLeft = this.scrollParent.scrollLeft();

		// If fixed or absolute
		if ( this.helper.cssPosition !== "relative" ) {
			position = this.helper.el.position();

			// Take into account scrollbar
			position.top -= scrollTop;
			position.left -= scrollLeft;

			return position;
		}

		// When using relative, css values are checked
		// Otherwise the position wouldn't account for padding on ancestors
		left = this.helper.el.css( "left" );
		top = this.helper.el.css( "top" );

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
			newLeft = leftDiff + this.helper.startPosition.left,
			newTop = topDiff + this.helper.startPosition.top;

		// Save off new values for .css() in various callbacks using this function
		this.helper.position = {
			left: newLeft,
			top: newTop
		};

		// Save off values to compare user override against automatic coordinates
		this.tempPosition = {
			left: newLeft,
			top: newTop
		};

		// Refresh offset cache with new positions
		this.helper.offset.left = this.helper.startOffset.left + leftDiff;
		this.helper.offset.top = this.helper.startOffset.top + topDiff;
	},

	// Places draggable where event, or user via event/callback, indicates
	_setCss: function() {
		var newLeft = this.helper.position.left,
			newTop = this.helper.position.top;

		// User overriding left/top so shortcut math is no longer valid
		if ( this.tempPosition.left !== this.helper.position.left ||
				this.tempPosition.top !== this.helper.position.top ) {
			// Reset offset based on difference of expected and overridden values
			this.helper.offset.left += newLeft - this.tempPosition.left;
			this.helper.offset.top += newTop - this.tempPosition.top;
		}

		// TODO: does this work with nested scrollable parents?
		if ( this.helper.cssPosition !== "fixed" ) {
			newLeft += this.scrollParent.scrollLeft();
			newTop += this.scrollParent.scrollTop();
		}

		this.helper.offset = {
			left: newLeft,
			top: newTop
		};

		this.helper.el.css({
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
			ret.helper = this.helper.el;
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
				.appendTo( iframe.parent() )[0];
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
