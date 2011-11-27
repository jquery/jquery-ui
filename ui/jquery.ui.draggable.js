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
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget( "ui.draggable", $.ui.interaction, {
	version: "@VERSION",
	widgetEventPrefix: "drag",

	options: {
		helper: null
	},

	// dragEl: element being dragged (original or helper)
	// position: final CSS position of dragEl
	// offset: offset of dragEl
	// startCoords: clientX/Y of the mousedown (offset of pointer)
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

	_getPosition: function() {
		var left, top, position, offset,
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

	_handleScrolling: function( event ) {
		var distances = {},
			scrollTop = this.scrollParent.scrollTop(),
			scrollLeft = this.scrollParent.scrollLeft(),
			scrollSensitivity = 20,
			xScrollSpeed = 20,
			yScrollSpeed = 20;

		// overflowOffset is only set when scrollParent is not doc/html
		if ( !this.overflowOffset ) {

			// Handle vertical scrolling
			if ( ( ( this.overflow.height + scrollTop ) - event.pageY ) < scrollSensitivity ) {
				this.scrollParent.scrollTop( scrollTop + yScrollSpeed );
			}
			else if ( event.pageY < ( scrollTop + scrollSensitivity ) ) {
				this.scrollParent.scrollTop( scrollTop - yScrollSpeed );
			}
			
			distances.xRight = ( this.overflow.width + scrollLeft ) - event.pageX;
			distances.xLeft  = event.pageX - scrollLeft;
			
			

			// Handle horizontal scrolling
			if ( distances.xRight < scrollSensitivity ) {
				this.scrollParent.scrollLeft( scrollLeft + xScrollSpeed );
			}
			else if ( distances.xLeft < scrollSensitivity  ) {
				this.scrollParent.scrollLeft( scrollLeft - xScrollSpeed );
			}
		} else {
			// Handle vertical scrolling
			if ( ( event.pageY + scrollSensitivity ) > ( this.overflow.height + this.overflowOffset.top ) ) {
				this.scrollParent.scrollTop( scrollTop + yScrollSpeed );
			}
			else if ( ( event.pageY - scrollSensitivity ) < this.overflowOffset.top ) {
				this.scrollParent.scrollTop( scrollTop - yScrollSpeed );
			}

			// Handle horizontal scrolling
			if ( ( event.pageX + scrollSensitivity ) > ( this.overflow.width + this.overflowOffset.left ) ) {
				this.scrollParent.scrollLeft( scrollLeft + xScrollSpeed );
			}
			else if ( ( event.pageX - scrollSensitivity ) < this.overflowOffset.left ) {
				this.scrollParent.scrollLeft( scrollLeft - xScrollSpeed );
			}
		}
	},

	_start: function( event ) {
		var newLeft, newTop;

		// The actual dragging element, should always be a jQuery object
		this.dragEl = this.element;

		// Helper required
		if ( this.options.helper ) {
			// clone
			if ( this.options.helper === true ) {
				this.dragEl = this.element.clone()
					.removeAttr( "id" )
					.find( "[id]" )
						.removeAttr( "id" )
					.end();
			} else {
				// TODO: figure out the signature for this; see #4957
				this.dragEl = $( this.options.helper() );
			}

			this.dragEl
				// Helper must be absolute to function properly
				.css( "position", "absolute" )
				.appendTo( this.document[0].body )
				.offset( this.element.offset() );
		}

		this.cssPosition = this.dragEl.css( "position" );
		this.scrollParent = this.element.scrollParent();

		// Cache starting absolute and relative positions
		this.startPosition = this._getPosition();
		this.startOffset = this.dragEl.offset();

		// Cache current position and offset
		this.position = $.extend( {}, this.startPosition );
		this.offset = $.extend( {}, this.startOffset );

		this.startCoords = {
			left: event.clientX,
			top: event.clientY
		};

		// Cache the offset of scrollParent, if required for _handleScrolling
		if ( this.scrollParent[0] !== this.document[0] && this.scrollParent[0].tagName !== 'HTML') {
			this.overflowOffset = this.scrollParent.offset();
		}

		this.overflow = {};

		this.overflow.height = ( this.scrollParent[0] === this.document[0] ) ?
			this.window.height() : this.scrollParent.height();

		this.overflow.width = ( this.scrollParent[0] === this.document[0] ) ?
			this.window.width() : this.scrollParent.width();

		this._preparePosition( event );

		// If user stops propagation, leave helper there ( if there's one ), disallow any CSS changes
		if ( this._trigger( "start", event, this._uiHash() ) === false ) {
			return false;
		}

		this._blockFrames();
		this._setCss( event );
	},

	_move: function( event ) {
		var newLeft, newTop;

		this._preparePosition( event );

		// If user stops propagation, leave helper there ( if there's one ), disallow any CSS changes
		if ( this._trigger( "drag", event, this._uiHash() ) === false ) {
			return;
		}

		this._setCss( event );

		// Scroll the scrollParent, if needed
		this._handleScrolling( event );
	},

	_stop: function( event ) {
		this._preparePosition( event );

		// If user stops propagation, leave helper there, disallow any CSS changes
		if ( this._trigger( "stop", event, this._uiHash() ) === false ) {
			this._setCss( event );
			if ( this.options.helper ) {
				this.dragEl.remove();
			}
		}

		this._unblockFrames();
	},

	// Uses event to determine new position of draggable, before any override from callbacks
	// TODO: handle absolute element inside relative parent like a relative element
	// possibly have user set flag to avoid DOM lookup
	_preparePosition: function( event ) {
		var leftDiff = event.clientX - this.startCoords.left,
			topDiff = event.clientY - this.startCoords.top,
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

	// Places draggable where mouse or user from callback indicates
	_setCss: function( event ) {
		var newLeft, newTop, oTop, oLeft;

		// User overriding left/top so shortcut math is no longer valid
		if ( this.tempPosition.left !== this.position.left || this.tempPosition.top !== this.position.top ) {

			// Get the difference of automatic coordinates vs what user overrode
			oTop = this.position.top - this.tempPosition.top;
			oLeft = this.position.left - this.tempPosition.left;
			
			// Reset offset based on math
			this.offset.top = this.offset.top + oTop;
			this.offset.left = this.offset.left + oLeft;
			
			this.offset = this.dragEl.offset();
			
		}

		newLeft = this.position.left;
		newTop = this.position.top;

		// TODO: does this work with nested scrollable parents?
		if ( this.cssPosition !== "fixed" ) {
			newLeft = newLeft + this.scrollParent.scrollLeft();
			newTop = newTop + this.scrollParent.scrollTop();
		}

		this.dragEl.css({
			left: newLeft,
			top: newTop
		});
	},

	_uiHash: function( event ) {
		var ret = {
			position: this.position,
			offset: this.offset
		};

		// TODO: should we always set the helper?
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
