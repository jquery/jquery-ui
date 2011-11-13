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
	allowedTolerance: ['touch'],
	options: {
		// accept: '*',
		// activeClass: false,
		// addClasses: true,
		// greedy: false,
		// hoverClass: false,
		// scope: 'default',
		tolerance: 'touch' //'intersect'
	},
	
	// draggableProportions: width and height of currently dragging draggable
	// proportions: width and height of droppable
	
	_create: function() {

		// Store current location
		this.offset = this.element.offset();

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		// TODO: Use $.Callbacks or .on from 1.7
		$('*').live( "drag", $.proxy( this._drag, this ) );
		$('*').live( "dragstart", $.proxy( this._dragStart, this ) );

	},

	_drag: function( event, ui ) {
	
		var rightEdge, bottomEdge, draggableRightEdge, draggableBottomEdge, xOverlap, yOverlap;
	
		switch ( this.options.tolerance ) {
		
			case 'touch':
				rightEdge = ( this.offset.left + this.proportions.width ),
				bottomEdge = ( this.offset.top + this.proportions.height ),
				draggableRightEdge = ( ui.offset.left + this.draggableProportions.width ),
				draggableBottomEdge = ( ui.offset.top + this.draggableProportions.height ),
				xOverlap = ( draggableRightEdge >= this.offset.left && ui.offset.left <= rightEdge ),
				yOverlap = ( draggableBottomEdge >= this.offset.top && ui.offset.top <= bottomEdge );
				
				if ( xOverlap && yOverlap ) {
					// TODO: properly fill out uiHash
					this._trigger( "over", event, {} );
				}
				
				break;
				
		  default:
				throw( "Invalid tolerance passed: " + this.options.tolerance + ". Allowed: " + this.allowedTolerance.join( ', ' ) );
				break;
	  }
		

	},

	_dragStart: function( event, ui ) {
	
		var draggable = $( event.target );
				
		this.draggableProportions = { width: draggable[0].offsetWidth, height: draggable[0].offsetHeight };
		


	}



});

})(jQuery);


