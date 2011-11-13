/*
 * jQuery UI Droppable @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.draggable.js
 */
(function( $, undefined ) {

$.widget("ui.droppable", {
	version: "@VERSION",
	widgetEventPrefix: "drop",
	allowedTolerance: ["touch","intersect"],
	options: {
		// accept: '*',
		// activeClass: false,
		// addClasses: true,
		// greedy: false,
		// hoverClass: false,
		// scope: 'default',
		tolerance: 'intersect'
	},

	// draggableProportions: width and height of currently dragging draggable
	// over: whether or not a draggable is currently over droppable
	// proportions: width and height of droppable


	refreshPosition: function() {

		// Store current location
		this.offset = this.element.offset();

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

	},

	_create: function() {

		this.refreshPosition();

		// TODO: Use $.Callbacks or .on from 1.7
		$('*').live( "drag", $.proxy( this._drag, this ) );
		$('*').live( "dragstart", $.proxy( this._dragStart, this ) );

		this._bind( this.document, {
			mouseup: "_mouseUp"
		});

	},

	_drag: function( event, ui ) {

		var handleFunc, edges,
			tolerance = this.options.tolerance,
			over = false;

		switch ( tolerance ) {

			case "intersect":
			case "touch":
			
				edges = {
					right: ( this.offset.left + this.proportions.width ),
					bottom: ( this.offset.top + this.proportions.height ),
					draggableRight: ( ui.offset.left + this.draggableProportions.width ),
					draggableBottom: ( ui.offset.top + this.draggableProportions.height )
				};
			
			
				handleFunc = "_handle" + tolerance.substr(0, 1 ).toUpperCase() + tolerance.substr( 1 );
				over = this[ handleFunc ]( edges, ui );
				
				break;

		  default:
				throw( "Invalid tolerance passed: " + this.options.tolerance + ". Allowed: " + this.allowedTolerance.join( ", " ) );

	  }
		
		// If there is sufficient overlap as deemed by tolerance
		if ( over === true ) {

			this._trigger( "over", event, this._uiHash() );
			this.over = true;

		}
		
		// If there isn't enough overlap and droppable was previously flagged as over
		else if ( this.over === true ) {

			this.over = false;
			this._trigger( "out", event, this._uiHash() );

		}

	},

	_dragStart: function( event, ui ) {

		var draggable = $( event.target );

		// TODO: Possibly move into draggable hash, so if there are multiple droppables, it's not recalculating all the time
		this.draggableProportions = { width: draggable[0].offsetWidth, height: draggable[0].offsetHeight };



	},

	// Determines if draggable is over droppable based on intersect tolerance
	_handleIntersect: function( edges, ui ) {
	
		var xDiff = edges.draggableRight - this.offset.left,
			yDiff = edges.draggableBottom - this.offset.top,
		  xHalfway = Math.round( this.proportions.width / 2 ),
		  yHalfway = Math.round( this.proportions.height / 2 ),
			xHalfOverlap = false;
			yHalfOverlap = false;
			
		
			// If Coming from left or right
			xHalfOverlap = ( ui.offset.left < this.offset.left ) ?
				( xDiff >= xHalfway ) :
				( xDiff <= xHalfway + this.proportions.width );
				
			// If Coming from top or bottom
		  yHalfOverlap = ( ui.offset.top < this.offset.top ) ?
				( yDiff >= yHalfway ) :
				( yDiff <= yHalfway + this.proportions.height );
				
	  return ( xHalfOverlap && yHalfOverlap );
			
	
	},
	
	// Determines if draggable is over droppable based on touch tolerance
	_handleTouch: function( edges, ui ) {
	
		var xOverlap = ( edges.draggableRight >= this.offset.left && ui.offset.left <= edges.right ),
			yOverlap = ( edges.draggableBottom >= this.offset.top && ui.offset.top <= edges.bottom );
				
		return ( xOverlap && yOverlap );
		
	},
	
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

})(jQuery);


