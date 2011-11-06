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

$.widget( "ui.draggable", {
	version: "@VERSION",
	widgetEventPrefix: "drag",

	options: {
		helper: false,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		iframeFix: false
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

	_blockFrames: function() {

		var iframes = $('iframe'),
			widget = this;

		this.iframeBlocks = $('');

		iframes.each( function() {

			var iframe = $(this),
				width = iframe.outerWidth(),
				height = iframe.outerHeight(),
				iframeOffset = iframe.offset(),
				block = $('<div />');

		  block.css({
				position: 'absolute',
				width: width+'px',
				height: height+'px',
				top: iframeOffset.top+'px',
				left: iframeOffset.left+'px'
			})
			.appendTo( widget.document[0].body );

			widget.iframeBlocks = widget.iframeBlocks.add( block );
			
		});
		
	},

	_create: function() {
		this.scrollParent = this.element.scrollParent();

		// Static position elements can't be moved with top/left
		if ( this.element.css( "position" ) === "static" ) {
			this.element.css( "position", "relative" );
		}

		this._bind({ mousedown: "_mouseDown" });
	},

	// TODO: why is relative handled differently than fixed/absolute?
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
		left = this.dragEl.css( "left" );
		top = this.dragEl.css( "top" );

		// Webkit will give back auto if there is nothing inline yet
		left = ( left === "auto" ) ? 0: parseInt( left, 10 );
		top = ( top === "auto" ) ? 0: parseInt( top, 10 );

		return {
			left: left - scrollLeft,
			top: top - scrollTop
		};
	},

	_handleScrolling: function( event ) {
		var scrollTop = this.scrollParent.scrollTop(),
			scrollLeft = this.scrollParent.scrollLeft();

		// overflowOffset is only set when scrollParent is not doc/html
		if ( !this.overflowOffset ) {

			// Handle vertical scrolling
			if ( ( ( this.overflow.height + scrollTop ) - event.pageY ) < this.options.scrollSensitivity ) {
				this.scrollParent.scrollTop( scrollTop + this.options.scrollSpeed );
			}
			else if ( event.pageY < ( scrollTop + this.options.scrollSensitivity ) ) {
				this.scrollParent.scrollTop( scrollTop - this.options.scrollSpeed );
			}

			// Handle horizontal scrolling
			if ( ( ( this.overflow.width + scrollLeft ) - event.pageX ) < this.options.scrollSensitivity ) {
				this.scrollParent.scrollLeft( scrollLeft + this.options.scrollSpeed );
			}
			else if ( event.pageX < ( scrollLeft + this.options.scrollSensitivity ) ) {
				this.scrollParent.scrollLeft( scrollLeft - this.options.scrollSpeed );
			}

		} else {


			// Handle vertical scrolling
			if ( ( event.pageY + this.options.scrollSensitivity ) > ( this.overflow.height + this.overflowOffset.top ) ) {
				this.scrollParent.scrollTop( scrollTop + this.options.scrollSpeed );
			}
			else if ( ( event.pageY - this.options.scrollSensitivity ) < this.overflowOffset.top ) {
				this.scrollParent.scrollTop( scrollTop - this.options.scrollSpeed );
			}

			// Handle horizontal scrolling
			if ( ( event.pageX + this.options.scrollSensitivity ) > ( this.overflow.width + this.overflowOffset.left ) ) {
				this.scrollParent.scrollLeft( scrollLeft + this.options.scrollSpeed );
			}
			else if ( ( event.pageX - this.options.scrollSensitivity ) < this.overflowOffset.left ) {
				this.scrollParent.scrollLeft( scrollLeft - this.options.scrollSpeed );
			}


		}

	},

	_mouseDown: function( event ) {
		var newLeft, newTop, allowed;

		// Prevent text selection, among other things
		event.preventDefault();

		// The actual dragging element, should always be a jQuery object
		this.dragEl = this.element;

		if ( this.options.iframeFix === true ) {
			this._blockFrames();
		}

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
				// TODO: should we move this to the stylesheet and use a class?
				.css( "position", "absolute" )
				.appendTo( this.document[0].body )
				.offset( this.element.offset() );
		}

		this.cssPosition = this.dragEl.css( "position" );

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

		allowed = this._trigger( "start", event, this._uiHash() );

		// If user stops propagation, leave helper there ( if there's one ), disallow any CSS changes
		if ( allowed !== true ) {
			this.document.unbind( "." + this.widgetName );
			return;
		}

		this._setCss( event );

		this._bind( this.document, {
			mousemove: "_mouseMove",
			mouseup: "_mouseUp"
		});
	},

	_mouseMove: function( event ) {
		var newLeft, newTop, allowed;

		this._preparePosition( event );

		allowed = this._trigger( "drag", event, this._uiHash() );


		// If user stops propagation, leave helper there ( if there's one ), disallow any CSS changes
		if ( allowed !== true ) {
			this.document.unbind( "." + this.widgetName );
			return;
		}

		this._setCss( event );

		// Scroll the scrollParent, if needed
		this._handleScrolling( event );
	},

	_mouseUp: function( event ) {

		var allowed;

		this._preparePosition( event );

		allowed = this._trigger( "stop", event, this._uiHash() );

		// If user stops propagation, leave helper there, disallow any CSS changes
		if ( allowed === true ) {

			this._setCss( event );

			if ( this.options.helper ) {
				this.dragEl.remove();
			}

		}

		this.document.unbind( "." + this.widgetName );

		if ( this.options.iframeFix === true ) {
			this._unblockFrames();
		}

	},

	// Uses event to determine new position of draggable, before any override from callbacks
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
		this.offset.left = this.startOffset.left + newLeft;
		this.offset.top = this.startOffset.top + newTop;
	},

	// Places draggable where mouse or user from callback indicates
	_setCss: function( event ) {
		var newLeft, newTop;

		// User overriding left/top so shortcut math is no longer valid
		if ( this.tempPosition.left !== this.position.left || this.tempPosition.top !== this.position.top ) {
			// TODO: can we just store the previous offset values
			// and not go through .offset()?
			// refresh offset using slower functions
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
			left: newLeft + "px",
			top: newTop + "px"
		});
	},

	_uiHash: function( event ) {
		var ret = {
			position: this.position
			// offset: this.offset
		};

		if ( this.options.helper ) {
			ret.helper = this.dragEl;
		}

		return ret;

	},

	_unblockFrames: function() {
	
		if ( !this.iframeBlocks || !this.iframeBlocks.length ) {
			return;
		}
		
		this.iframeBlocks.each( function() {

			$(this).remove();

		});

	}
});

})( jQuery );
