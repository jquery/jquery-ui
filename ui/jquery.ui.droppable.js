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
	// TODO: we need to react after the event, in case an event handler changes the position
	// TODO: don't react if the event is canceled
	// TODO: we need access to pointerPosition
	var orig = $.ui.draggable.prototype._trigger;
	$.ui.draggable.prototype._trigger = function( type, event, ui ) {
		var droppable,
			method = "_draggable" + type.substr( 0, 1 ).toUpperCase() + type.substr( 1 );
		for ( droppable in droppables ) {
			droppables[ droppable ][ method ].call( droppables[ droppable ], event, ui );
		}
		orig.apply( this, arguments );
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

	// draggableProportions: width and height of currently dragging draggable
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
		// Store current location
		this.offset = this.element.offset();

		// Store the droppable's proportions
		// TODO: should this delegate to core?
		this.proportions = {
			width: this.element[0].offsetWidth,
			height: this.element[0].offsetHeight
		};
	},

	/** draggable integration **/

	_draggableStart: function( event, ui ) {
		var draggable = $( event.target );

		// TODO: Possibly move into draggable hash
		// so if there are multiple droppables, it's not recalculating all the time
		// TODO: Should this use the helper if it exists?
		this.draggableProportions = {
			width: draggable[0].offsetWidth,
			height: draggable[0].offsetHeight
		};
	},

	_draggableDrag: function( event, ui ) {
		var edges = {
				right: this.offset.left + this.proportions.width,
				bottom: this.offset.top + this.proportions.height,
				draggableRight: ui.offset.left + this.draggableProportions.width,
				draggableBottom: ui.offset.top + this.draggableProportions.height
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

$.ui.droppable.tolerance = {
	// Half of the draggable overlaps the droppable, horizontally and vertically
	intersect: function( event, edges, ui ) {
		var xHalf = ui.offset.left + this.draggableProportions.width / 2,
			yHalf = ui.offset.top + this.draggableProportions.height / 2;

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
	// TODO: this has to use pointerPosition, not event
	pointer: function( event, edges, ui ) {
		var xOverlap = event.pageX >= this.offset.left &&
				event.pageX <= edges.right,
			yOverlap = event.pageY >= this.offset.top &&
				event.pageY <= edges.bottom;

		return xOverlap && yOverlap;
	}
};

})( jQuery );
