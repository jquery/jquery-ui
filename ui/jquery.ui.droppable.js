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

	// TODO: move below _create()
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

	_create: function() {
		this.refreshPosition();

		// TODO: make this much more efficient
		// possibly just override draggable's methods
		$( "*" ).live( "drag", $.proxy( this._drag, this ) );
		$( "*" ).live( "dragstart", $.proxy( this._dragStart, this ) );

		this._bind( this.document, {
			mouseup: "_mouseUp"
		});
	},

	_drag: function( event, ui ) {
		var tolerance = this.options.tolerance,
			handleFunc = "_handle" + tolerance.substr( 0, 1 ).toUpperCase() + tolerance.substr( 1 ),
			edges = {
				right: this.offset.left + this.proportions.width,
				bottom: this.offset.top + this.proportions.height,
				draggableRight: ui.offset.left + this.draggableProportions.width,
				draggableBottom: ui.offset.top + this.draggableProportions.height
			},
			over = this[ handleFunc ]( event, edges, ui );

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

	_dragStart: function( event, ui ) {
		var draggable = $( event.target );

		// TODO: Possibly move into draggable hash, so if there are multiple droppables, it's not recalculating all the time
		this.draggableProportions = {
			width: draggable[0].offsetWidth,
			height: draggable[0].offsetHeight
		};
	},

	// Determines if draggable is over droppable based on intersect tolerance
	// TODO: move all tolerance methods into a hash
	// $.ui.droppable.tolerance.intersect
	_handleIntersect: function( event, edges, ui ) {
		var xDiff = edges.draggableRight - this.offset.left,
			yDiff = edges.draggableBottom - this.offset.top,
			xHalfway = this.proportions.width / 2,
			yHalfway = this.proportions.height / 2,
			xOverlap = false,
			yOverlap = false;

		// If Coming from left or right
		xOverlap = ui.offset.left < this.offset.left ?
			xDiff >= xHalfway :
			xDiff <= xHalfway + this.proportions.width;

		// If Coming from top or bottom
		yOverlap = ui.offset.top < this.offset.top ?
			yDiff >= yHalfway :
			yDiff <= yHalfway + this.proportions.height;

		return xOverlap && yOverlap;
	},

	// Determines if draggable is over droppable based on touch tolerance
	_handleTouch: function( event, edges, ui ) {
		var xOverlap = edges.draggableRight >= this.offset.left &&
				ui.offset.left <= edges.right,
			yOverlap = edges.draggableBottom >= this.offset.top &&
				ui.offset.top <= edges.bottom;

		return xOverlap && yOverlap;
	},

	// Determines if draggable is over droppable based on pointer tolerance
	_handlePointer: function( event, edges, ui ) {
		var xOverlap = event.pageX >= this.offset.left &&
				event.pageX <= edges.right,
			yOverlap = event.pageY >= this.offset.top &&
				event.pageY <= edges.bottom;

		return xOverlap && yOverlap;
	},

	// TODO: shouldn't this be dragStop?
	_mouseUp: function( event ) {
		if ( this.over ) {
			this._trigger( "drop", event, this._uiHash() );
		}

		this.over = false;
	},

	// TODO: fill me out
	_uiHash: function() {
		return {};
	}
});

})( jQuery );
