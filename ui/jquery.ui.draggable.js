/*!
 * jQuery UI Draggable @VERSION
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
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

// create a shallow copy of an object
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
		handle: null,
		helper: null
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
	//   appendTo option without a helper

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
		return this.options.handle ? element.is( this.options.handle ) : true;
	},

	_start: function( event, pointerPosition ) {
		var offset;

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
				.appendTo( this.options.appendTo )
				.offset( offset );
		}

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
			
			// domPosition needs to be undone even if beforeStart is stopped
			// Otherwise this.dragEl will remain in the element appendTo is set to
			this._resetDomPosition();
			return false;
			
		}

		this._setCss();
		this.startPosition = this._getPosition();
		this.startOffset = this.dragEl.offset();

		this._trigger( "start", event, this._fullHash( pointerPosition ) );
		this._blockFrames();
	},
	
	_resetDomPosition : function() {
	
		// Nothing to do in this case
		if ( !this.domPosition ) {
			return;
		}
		
		parent = this.domPosition.parent;
		next = parent.children().eq( this.domPosition.index );
		if ( next.length ) {
			next.before( this.element );
		} else {
			parent.append( this.element );
		}
		this.element.offset( this.offset );
		this.domPosition = null;
	
	},

	_move: function( event, pointerPosition ) {
		this._preparePosition( pointerPosition );

		// If user cancels drag, don't move the element
		if ( this._trigger( "drag", event, this._fullHash( pointerPosition ) ) === false ) {
			return;
		}

		this._setCss();

		// Scroll the scrollParent, if needed
		this._handleScrolling( pointerPosition );
	},

	_stop: function( event, pointerPosition ) {
		var parent, next;

		this._preparePosition( pointerPosition );

		// If user cancels stop, leave helper there
		if ( this._trigger( "stop", event, this._fullHash( pointerPosition ) ) !== false ) {
			if ( this.options.helper ) {
				this.dragEl.remove();
			}
			this._resetDomPosition();
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

		// Ensure the helper is in the DOM; obey the appendTo option if it exists
		if ( this.options.appendTo || !helper.closest( "body" ).length ) {
			helper.appendTo( this.options.appendTo || this.document[0].body );
		}

		return helper
			// Helper must be absolute to function properly
			.css( "position", "absolute" )
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
		this.element.removeClass( "ui-draggable" );
		this._super();
	}
});

$.widget( "ui.draggable", $.ui.draggable, {
	// $.widget doesn't know how to handle redefinitions with a custom prefix
	// custom prefixes are going away anyway, so it's not worth fixing right now
	widgetEventPrefix: "drag",

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
		var offset, left, top,
			container = this._getContainer();

		if ( !container ) {
			this.containment = null;
			return;
		}

		offset = container.offset();
		left = offset.left +
			(parseFloat( $.css( container[0], "borderLeftWidth", true ) ) || 0) +
			(parseFloat( $.css( container[0], "paddingLeft", true ) ) || 0);
		top = offset.top +
			(parseFloat( $.css( container[0], "borderTopWidth", true ) ) || 0) +
			(parseFloat( $.css( container[0], "paddingTop", true ) ) || 0);

		this.containment = {
			left: left,
			top: top,
			right: left + container.width(),
			bottom: top + container.height(),
			leftDiff: ui.originalOffset.left - ui.originalPosition.left,
			topDiff: ui.originalOffset.top - ui.originalPosition.top,
			width: this.dragEl.outerWidth(),
			height: this.dragEl.outerHeight()
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

})( jQuery );
