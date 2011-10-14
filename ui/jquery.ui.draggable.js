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
		scrollSpeed: 20
	},

	// dragEl: element being dragged (original or helper)
	// position: CSS position of dragEl
	// offset: offset of dragEl
	// startCoords: clientX/Y of the mousedown (offset of pointer)
	// startPosition: CSS position prior to drag start
	// startOffset: offset prior to drag start
	// overflowOffset: offset of scroll parent
	// overflowHeight: height of scroll parent
	// overflowWidth: width of scroll parent

	_create: function() {
		// TODO: add these to the base widget
		this.doc = $( this.element[0].ownerDocument );
		this.win = $( this.doc[0].defaultView );

		this.scrollParent = this.element.scrollParent();

		// Static position elements can't be moved with top/left
		if ( this.element.css( "position" ) === "static" ) {
			this.element.css( "position", "relative" );
		}

		// TODO: use _bind()
		this.element.bind( "mousedown." + this.widgetName, $.proxy( this, "_mouseDown" ) );
	},

	// TODO: why is relative handled differently than fixed/absolute?
	_getPosition: function() {
		var left, top, position,
			scrollTop = this.scrollParent.scrollTop(),
			scrollLeft = this.scrollParent.scrollLeft();

		// If fixed or absolute
		if ( this.cssPosition !== "relative" ) {
			position = this.dragEl.position();

			// Take into account scrollbar
			position.top -= scrollTop;
			position.left -= scrollLeft

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

	_mouseDown: function( event ) {
		// Prevent text selection, among other things
		event.preventDefault();

		// The actual dragging element, should always be a jQuery object
		this.dragEl = this.element;
		this.cssPosition = this.dragEl.css( "position" );

		// Helper required
		if ( this.options.helper ) {
			// clone
			if ( this.options.helper === true ) {
				// If source element has an ID, change ID of helper to avoid overlap
				this.dragEl = this.element.clone();
				if ( this.element.attr( "id" ) ) {
					this.dragEl.attr( "id", this.element.attr( "id" ) + "-" + this.widgetName );
				}
			} else {
				// TODO: figure out the signature for this; see #4957
				this.dragEl = $( this.options.helper() );
			}

			this.dragEl
				// TODO: should we move this to the stylesheet and use a class?
				.css( "position", "absolute" )
				.appendTo( this.doc[0].body )
				.offset( this.element.offset() );
		}

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

		// Cache the offset of scrollParent
		// TODO: store overflow height/width in a hash instead of separate properties
		this.overflowOffset = this.scrollParent.offset();
		this.overflowHeight = ( this.scrollParent[0] === this.doc[0] ) ?
			this.win.height() : this.scrollParent.height();
		this.overflowWidth = ( this.scrollParent[0] === this.doc[0] ) ?
			this.win.width() : this.scrollParent.width();

		// TODO: allow modifying position, just like during drag
		this._trigger( "start", event, this._uiHash() );

		// TODO: use ._bind()
		// TODO: rename _bind() to _on(); add _off()
		this.doc
			.bind( "mousemove." + this.widgetName, $.proxy( this, "_mouseMove" ) )
			.bind( "mouseup." + this.widgetName, $.proxy( this, "_mouseUp" ) );
	},

	_mouseMove: function( event ) {
		var leftDiff = event.clientX - this.startCoords.left,
			topDiff = event.clientY - this.startCoords.top,
			newLeft = leftDiff + this.startPosition.left,
			newTop = topDiff + this.startPosition.top;

		this.position = {
			left: newLeft,
			top: newTop
		};

		// Refresh offset cache with new positions
		this.offset.left = this.startOffset.left + newLeft;
		this.offset.top = this.startOffset.top + newTop;

		this._trigger( "drag", event, this._uiHash() );

		// User overriding left/top so shortcut math is no longer valid
		if ( newLeft !== this.position.left || newTop !== this.position.top ) {
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

		// Scroll the scrollParent, if needed
		this._handleScrolling( event );
	},

	_handleScrolling: function( event ) {
		var scrollTop = this.doc.scrollTop(),
			scrollLeft = this.doc.scrollLeft();

		// Handle vertical scrolling
		if ( ( ( this.overflowHeight + scrollTop ) - event.pageY ) < this.options.scrollSensitivity ) {
			this.doc.scrollTop( scrollTop + this.options.scrollSpeed );
		}

		// Handle horizontal scrolling
		if ( ( ( this.overflowWidth + scrollLeft ) - event.pageX ) < this.options.scrollSensitivity ) {
			this.doc.scrollLeft( scrollLeft + this.options.scrollSpeed );
		}
	},

	_mouseUp: function( event ) {
		this._trigger( "stop", event, this._uiHash() );

		if ( this.options.helper ) {
			this.dragEl.remove();
		}

		this.doc
			.unbind( "mousemove." + this.widgetName )
			.unbind( "mouseup." + this.widgetName );
	},

	_uiHash: function( event ) {
		return {
			position: this.position,
			offset: this.offset
		};
	}
});

})( jQuery );
