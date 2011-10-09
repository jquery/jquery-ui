/*
 * jQuery UI Draggable 2.0.0
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget( "ui.draggable", {

	widgetEventPrefix: "drag",

	options: {

		scrollSpeed: 20,
		scrollSensitivity:20,
		helper: false

	},

	// TODO: actually remove data
	destroy: function() {
		return this;
	},

	_create: function() {

		// Either initialized element or the helper
		this.dragEl = false,

		this.position = {},
		this.offset = {},

		// Start X/Y coords of mouse before drag
		this.startCoords = {},

		// Start position of element before drag
		this.startPosition = {},

		// Start offset of element before drag
		this.startOffset = {},

		this.scrollParent = this.element.scrollParent();

    // Offset of scrollParent, used for auto-scrolling
    this.overflowOffset = {};

		// Height of scrollParent, used for auto-scrolling
		this.overflowHeight = 0;

		// Width of scrollParent, used for auto-scrolling
		this.overflowWidth = 0;

		// Static position elements can"t be moved with top/left
		if ( this.element.css( "position" ) === "static" ) {
			this.element.css( "position", "relative" );
		}
		
		// Using proxy to avoid anon functions using self to pass "this" along
		this.element.bind( "mousedown." + this.widgetName, $.proxy( this._mouseDown, this ) );

	},

	_usingHelper : function() {
		return ( this.options.helper === true || typeof this.options.helper === 'function' );
	},

	_setPosition: function() {

		var left, top, position,
				scrollTop = this.scrollParent.scrollTop(),
				scrollLeft = this.scrollParent.scrollLeft();

		// Helper is appended to body so offset of element is all that's needed
		if ( this._usingHelper() ) {
			return this.element.offset();
		}

		// If fixed or absolute
		if ( this.cssPosition !== "relative" ) {

			position = this.dragEl.position();

			// Take into account scrollbar
			position.top = position.top - scrollTop;
			position.left = position.left - scrollLeft

			return position;

		}

		/** When using relative, css values are checked **/

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

    // Stop browser from highlighting, among other things
    event.preventDefault();

		// The actual dragging element, should always be a jQuery object
		this.dragEl = this.element;
		
		this.cssPosition = this.dragEl.css( "position" );

		// Helper required, so clone, hide, and set reference
		if ( this._usingHelper() ) {

			// If getting a cloned helper
			if ( this.options.helper === true ) {

				this.dragEl = this.element.clone();

				// If source element has an ID, change ID of helper to avoid overlap
				if ( this.element.attr( "id" ) ) {

					this.dragEl.attr( "id", this.element.attr( "id" ) + "-" + this.widgetName );

				}

			} else {

				this.dragEl = this.options.helper();

				// If function was passed, it should return a DOMElement
				if ( typeof this.dragEl.nodeType !== 'number' ) {
					throw "Helper function must return a DOMElement";
				}

				this.dragEl = $( this.dragEl );

			}

			// Automatically make helper absolute
			this.dragEl
					.css({
						position: "absolute"
					});

			$( "body" ).append( this.dragEl );

		}

		// Cache starting absolute and relative positions
		this.startPosition = this._setPosition();
		this.startOffset = this.dragEl.offset();

		// Cache current position and offset
		this.position = $.extend( {}, this.startPosition );
		this.offset = $.extend( {}, this.startOffset );

		this.startCoords = {
			left: event.clientX,
			top: event.clientY
		};

		// Cache the offset of scrollParent
		this.overflowOffset = this.scrollParent.offset();
		this.overflowHeight = ( this.scrollParent[0] === document ) ? $(window).height() : this.scrollParent.height();
		this.overflowWidth = ( this.scrollParent[0] === document ) ? $(window).width() : this.scrollParent.width();

		this._trigger( "start", event );

		$(document).bind( "mousemove." + this.widgetName, $.proxy( this._mouseMove, this ) )
			.bind( "mouseup." + this.widgetName, $.proxy( this._mouseUp, this ) );


		// Set the helper up by actual element
		if ( this._usingHelper() ) {

			// get the absolute position of element so that helper will know where to go
			elOffset = this.element.offset();

			this.dragEl.css({
				display: "block",
				top: elOffset.top + "px",
				left: elOffset.left + "px"
			});

		}

	},

	_mouseMove: function( event ) {
	
		var leftDiff = event.clientX - this.startCoords.left,
				topDiff = event.clientY - this.startCoords.top,
				newLeft = leftDiff	+ this.startPosition.left,
				newTop = topDiff + this.startPosition.top;

		this.position = {
			left: newLeft,
			top: newTop
		};

		// Refresh offset cache with new positions
		this.offset.left = this.startOffset.left + newLeft;
		this.offset.top = this.startOffset.top + newTop;

		this._trigger( "drag", event );

		// User overriding left/top so shortcut math is no longer valid
		if ( newLeft !== this.position.left || newTop !== this.position.top ) {

			// refresh offset using slower functions
			this.offset = this.dragEl.offset();

		}
		
		newLeft = this.position.left;
		newTop = this.position.top;
		
		if ( this.cssPosition !== 'fixed' ) {
		
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

		var doc = $(document),
				scrollTop = doc.scrollTop(),
				scrollLeft = doc.scrollLeft();

		// Handle vertical scrolling
		if ( ( ( this.overflowHeight + scrollTop ) - event.pageY ) < this.options.scrollSensitivity ) {
			doc.scrollTop( scrollTop + this.options.scrollSpeed );
		}
		
		// Handle horizontal scrolling
		if ( ( ( this.overflowWidth + scrollLeft ) - event.pageX ) < this.options.scrollSensitivity ) {
			doc.scrollLeft( scrollLeft + this.options.scrollSpeed );
		}

	},

	_mouseUp: function( event ) {

		var doc = $(document);

		this._trigger( "stop", event );

		this.startCoords = {};

		if ( this._usingHelper() ) {
			this.dragEl.remove();
		}

		doc.unbind( "mousemove." + this.widgetName );
		doc.unbind( "mouseup." + this.widgetName );

	},

	_uiHash: function(event) {

		return {
			position: this.position,
			offset: this.offset
		};

	}

});

$.extend($.ui.draggable, {
	version: "2.0.0"
});


})(jQuery);
