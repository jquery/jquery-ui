/*
 * jQuery UI Droppable @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Droppable
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.draggable.js
 */
(function( $, undefined ) {

var guid = 0,
	droppables = {};

(function() {
	var orig = $.ui.draggable.prototype._trigger;
	$.ui.draggable.prototype._trigger = function( type, event, ui ) {
		var droppable,
			method = "_draggable" + type.substr( 0, 1 ).toUpperCase() + type.substr( 1 ),
			allowed = orig.apply( this, arguments );

		if ( allowed ) {
			if ( $.ui.droppable[ method ] ) {
				$.ui.droppable[ method ]( event, ui );
			}
			if ( $.ui.droppable.prototype[ method ] ) {
				for ( droppable in droppables ) {
					droppables[ droppable ][ method ]( event, ui );
				}
			}
		}

		return allowed;
	};
})();

$.widget( "ui.droppable", {
	version: "@VERSION",
	widgetEventPrefix: "drop",

	options: {
		// accept: null,
		// greedy: false,
		tolerance: "intersect"
	},

	// over: whether or not a draggable is currently over droppable
	// proportions: width and height of droppable

	_create: function() {
		this.refreshPosition();
		this.guid = guid++;
		droppables[ this.guid ] = this;
	},

	/** public **/

	// TODO: rename to refresh()?
	refreshPosition: function() {
		this.offset = this.element.offset();
		this.proportions = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
	},

	/** draggable integration **/

	_draggableDrag: function( event, ui ) {
		var draggableProportions = $.ui.droppable.draggableProportions,
			edges = {
				right: this.offset.left + this.proportions.width,
				bottom: this.offset.top + this.proportions.height,
				draggableRight: ui.offset.left + draggableProportions.width,
				draggableBottom: ui.offset.top + draggableProportions.height
			},
			over = $.ui.droppable.tolerance[ this.options.tolerance ]
				.call( this, event, edges, ui );

		// If there is sufficient overlap as deemed by tolerance
		if ( over ) {
			this._trigger( "over", event, this._uiHash() );
			this.over = true;
		// If there isn't enough overlap and droppable was previously flagged as over
		} else if ( this.over ) {
			this.over = false;
			this._trigger( "out", event, this._uiHash() );
		}
	},

	_draggableStop: function( event, ui ) {
		if ( this.over ) {
			this._trigger( "drop", event, this._uiHash() );
		}

		this.over = false;
	},

	/** internal **/

	// TODO: fill me out
	_uiHash: function() {
		return {};
	},

	_destroy: function() {
		delete droppables[ this.guid ];
	}
});

$.extend( $.ui.droppable, {
	// draggableProportions: width and height of currently dragging draggable

	tolerance: {
		// Half of the draggable overlaps the droppable, horizontally and vertically
		intersect: function( event, edges, ui ) {
			var draggableProportions = $.ui.droppable.draggableProportions,
				xHalf = ui.offset.left + draggableProportions.width / 2,
				yHalf = ui.offset.top + draggableProportions.height / 2;
	
			return this.offset.left < xHalf && edges.right > xHalf &&
				this.offset.top < yHalf && edges.bottom > yHalf;
		},
	
		// Draggable overlaps droppable by at least one pixel
		touch: function( event, edges, ui ) {
			return this.offset.left < edges.draggableRight &&
				edges.right > ui.offset.left &&
				this.offset.top < edges.draggableBottom &&
				edges.bottom > ui.offset.top;
		},
	
		// Pointer overlaps droppable
		pointer: function( event, edges, ui ) {
			return ui.pointer.x >= this.offset.left && ui.pointer.x <= edges.right &&
				ui.pointer.y >= this.offset.top && ui.pointer.y <= edges.bottom;
		}
	},

	_draggableStart: function( event, ui ) {
		var element = ui.helper || $( event.target );

		this.draggableProportions = {
			width: element.outerWidth(),
			height: element.outerHeight()
		};
	}
});

})( jQuery );
