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

		// Static position elements can"t be moved with top/left
		if ( this.element.css( "position" ) === "static" ) {
			this.element.css( "position", "relative" );
		}

		// Prevent browser from hijacking drag
		this.element.disableSelection();

		// Using proxy to avoid anon functions using self to pass "this" along
		this.element.bind( "mousedown." + this.widgetName, $.proxy( this._mouseDown, this ) );

	},
	
	_usingHelper : function() {
		return ( this.options.helper === true || typeof this.options.helper === 'function' );
	},

	_setPosition: function() {

		var left, top, position, cssPosition;

		// Helper is appended to body so offset of element is all that's needed
		if ( this._usingHelper() ) {
			return this.element.offset();
		}

		cssPosition = this.dragEl.css( "position" );;

		// If fixed or absolute
		if ( cssPosition !== "relative" ) {

			position = this.dragEl.position();

			if ( cssPosition === "absolute" ) {
				return position;
			}

			// Take into account scrollbar for fixed position
			position.top = position.top - this.scrollParent.scrollTop();
			position.left = position.left - this.scrollParent.scrollLeft();

			return position;

		}

		/** When using relative, css values are checked **/

		left = this.dragEl.css( "left" );
		top = this.dragEl.css( "top" );

		// Webkit will give back auto if there is nothing inline yet
		left = ( left === "auto" ) ? 0: parseInt( left, 10 );
		top = ( top === "auto" ) ? 0: parseInt( top, 10 );

		return {

			left: left,
			top: top

		};

	},

	_mouseDown: function( event ) {

		// The actual dragging element, should always be a jQuery object
		this.dragEl = this.element;

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
					})
					.disableSelection();

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

		this._trigger( "start", event );

		$(document).bind( "mousemove." + this.widgetName, $.proxy( this._mouseMove, this ) );
		$(document).bind( "mouseup." + this.widgetName, $.proxy( this._mouseUp, this ) );


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

		this.dragEl.css({

			left: this.position.left + "px",
			top: this.position.top + "px"

		});

	},

	_mouseUp: function( event ) {

		this._trigger( "stop", event );

		this.startCoords = {};

		if ( this._usingHelper() ) {
			this.dragEl.remove();
		}

		$(document).unbind( "mousemove." + this.widgetName );
		$(document).unbind( "mouseup." + this.widgetName );

	},

	_trigger: function( type, event, ui ) {

		ui = ui || this._uiHash();

		return $.Widget.prototype._trigger.call( this, type, event, ui );

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
