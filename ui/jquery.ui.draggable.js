/*
 * jQuery UI Draggable @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggable
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.interaction.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget( "ui.draggable", $.ui.interaction, {
	version: "@VERSION",
	widgetEventPrefix: "drag",

	options: {
		handle: null,
		helper: null
	},

	// dragEl: element being dragged (original or helper)
	// position: final CSS position of dragEl
	// offset: offset of dragEl
	// startCoords: pageX/Y of the mousedown (offset of pointer)
	// startPosition: CSS position prior to drag start
	// startOffset: offset prior to drag start
	// tempPosition: overridable CSS position of dragEl
	// overflowOffset: offset of scroll parent
	// overflow: object containing width and height keys of scroll parent

	_create: function() {
		this._super();
		// Static position elements can't be moved with top/left
		if ( this.element.css( "position" ) === "static" ) {
			this.element.css( "position", "relative" );
		}
	},

	/** interaction interface **/

	_isValidTarget: function( element ) {
		return this.options.handle ? element.is( this.options.handle ) : true;
	},

	_start: function( event, pointerPosition ) {
		// The actual dragging element, should always be a jQuery object
		this.dragEl = this.options.helper ?
			this._createHelper( pointerPosition ) :
			this.element;

		this.cssPosition = this.dragEl.css( "position" );
		this.scrollParent = this.element.scrollParent();

		// Cache starting absolute and relative positions
		this.startPosition = this._getPosition();
		this.startOffset = this.dragEl.offset();

		// Cache current position and offset
		this.position = $.extend( {}, this.startPosition );
		this.offset = $.extend( {}, this.startOffset );

		this.startCoords = pointerPosition;

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

		// If user cancels start, don't allow dragging
		if ( this._trigger( "start", event, this._uiHash( pointerPosition ) ) === false ) {
			return false;
		}

		this._blockFrames();
		this._setCss();

		return true;
	},

	_move: function( event, pointerPosition ) {
		this._preparePosition( pointerPosition );

		// If user cancels drag, don't move the element
		if ( this._trigger( "drag", event, this._uiHash( pointerPosition ) ) === false ) {
			return;
		}

		this._setCss();

		// Scroll the scrollParent, if needed
		this._handleScrolling( pointerPosition );
	},

	_stop: function( event, pointerPosition ) {
		this._preparePosition( pointerPosition );

		// If user cancels stop, leave helper there, disallow any CSS changes
		if ( this._trigger( "stop", event, this._uiHash( pointerPosition ) ) !== false ) {
			this._setCss();
			if ( this.options.helper ) {
				this.dragEl.remove();
			}
		}

		this._unblockFrames();
	},

	/** internal **/

	_createHelper: function( pointerPosition ) {
		var helper,
			offset = this.element.offset(),
			xPos = (pointerPosition.x - offset.left) / this.element.outerWidth(),
			yPos = (pointerPosition.y - offset.top) / this.element.outerHeight();

		// clone
		if ( this.options.helper === true ) {
			helper = this.element.clone()
				.removeAttr( "id" )
				.find( "[id]" )
					.removeAttr( "id" )
				.end();
		} else {
			// TODO: figure out the signature for this; see #4957
			helper = $( this.options.helper() );
		}

		return helper
			// Helper must be absolute to function properly
			.css( "position", "absolute" )
			// TODO: add appendTo option
			.appendTo( this.document[0].body )
			.offset({
				left: pointerPosition.x - helper.outerWidth() * xPos,
				top: pointerPosition.y - helper.outerHeight() * yPos
			});
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
		var leftDiff = pointerPosition.x - this.startCoords.x,
			topDiff = pointerPosition.y - this.startCoords.y,
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

	_uiHash: function( pointerPosition ) {
		// TODO: add originalPosition
		var ret = {
			position: this.position,
			offset: this.offset,
			pointer: pointerPosition
		};

		if ( this.options.helper ) {
			ret.helper = this.dragEl;
		}

		return ret;
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
	}
});

})( jQuery );
