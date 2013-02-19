/*!
 * jQuery UI Droppable @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
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
		var method = "_draggable" + type.substr( 0, 1 ).toUpperCase() + type.substr( 1 ),
			allowed = orig.apply( this, arguments );

		if ( allowed && $.ui.droppable[ method ] ) {
			$.ui.droppable[ method ]( event, ui );
		}

		return allowed;
	};
})();

$.widget( "ui.droppable", {
	version: "@VERSION",
	widgetEventPrefix: "drop",

	options: {
		accept: null,
		greedy: false,
		tolerance: "intersect"
	},

	// over: whether or not a draggable is currently over droppable
	// proportions: width and height of droppable

	_create: function() {
		this.refresh();
		this.guid = guid++;
		droppables[ this.guid ] = this;
	},

	/** public **/

	refresh: function() {
		this.offset = this.element.offset();
		this.proportions = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
	},

	/** internal **/

	_start: function( event ) {
	
		// If draggable is acceptable to this droppable
		if ( !this._isAcceptable( event.target ) ) {
			return false;
		}

		this._trigger( "activate", event, this._uiHash() );
	},
	
	_isAcceptable: function( draggable ) {
		
		if ( $.isFunction( this.options.accept ) ) {
			if ( this.options.accept.call( this.element, draggable ) !== true ) {
				return false;
			}
		}
		else if ( this.options.accept && !$( draggable ).is( this.options.accept ) ) {
			return false;
		}
		
		return true;
	
	},

	_drag: function( event, ui ) {
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

	_stop: function( event ) {

		var greedy_child,
			self = this;

		if ( this.over ) {

			this.element.find(":data('" + this.widgetFullName + "')").each( function() {

				var drop = $(this).data( self.widgetFullName );

				if ( drop.options.greedy === true && drop.over === true ) {
					greedy_child = true;
					return false;
				}
			});

			if ( !greedy_child ) {
				this._trigger( "drop", event, this._uiHash() );
			}
		}

		this._trigger( "deactivate", event, this._uiHash() );

		this.over = false;
	},

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
	// active: array of active droppables

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
		},
		
		// Draggable should be entirely inside droppable
		fit: function( event, edges, ui ) {
			return edges.draggableRight <= edges.right &&
				ui.offset.left >= this.offset.left &&
				edges.draggableBottom <= edges.bottom &&
				ui.offset.top >= this.offset.top;
		}
	},

	_draggableStart: function( event, ui ) {
		var droppable,
			element = ui.helper || $( event.target );

		this.draggableProportions = {
			width: element.outerWidth(),
			height: element.outerHeight()
		};

		this.active = [];
		for ( droppable in droppables ) {
			if ( droppables[ droppable ]._start( event, ui ) !== false ) {
				this.active.push( droppables[ droppable ] );
			}
		}
	},

	_draggableDrag: function( event, ui ) {
		$.each( this.active, function() {
			this._drag( event, ui );
		});
	},

	_draggableStop: function( event, ui ) {
		$.each( this.active, function() {
			this._stop( event, ui );
		});
	}
});

})( jQuery );


// DEPRECATED
if ( $.uiBackCompat !== false ) {

	// activeClass option
	$.widget( "ui.droppable", $.ui.droppable, {

		options: {
			activeClass: false
		},
		
		_create: function() {

			var self = this,
					added = false;
			
			this._super();

			// On drag, see if a class should be added to droppable
			$(this.document[0].body).on( "drag", ".ui-draggable", function( event ) {
			
				if ( !added && self.options.activeClass && self._isAcceptable( event.target ) )  {
				
					self.element.addClass( self.options.activeClass );
					added = true;
				
				}

			});
			
			
			// On dragstop, remove class if one was added
			$(this.document[0].body).on( "dragstop", ".ui-draggable", function() {
			
				if ( added ) {
					self.element.removeClass( self.options.activeClass );
					added = false;
				}

			});

		}

	});
	
	// hoverClass option
	$.widget( "ui.droppable", $.ui.droppable, {

		options: {
			hoverClass: false
		},
		
		_create: function() {

			var self = this,
					added = false;
			
			this._super();

			// On over, add class if needed
			$(this.element).on( "dropover", function() {
			
				if ( !added && self.options.hoverClass )  {
				
					self.element.addClass( self.options.hoverClass );
					added = true;
				
				}

			});
			
			
			// On out, remove class if one was added
			$(this.element).on( "dropout", function() {
			
				if ( added ) {
					self.element.removeClass( self.options.hoverClass );
					added = false;
				}

			});

		}

	});
	
	// scope option
	$.widget( "ui.droppable", $.ui.droppable, {

		options: {
			scope: "default"
		},
		
		_isAcceptable: function( element ) {
		
			var draggable = $(element).data( "ui-draggable" );

			if ( this.options.scope !== "default" && draggable && draggable.options.scope === this.options.scope ) {
				return true;
			}
			
			return this._super( element );

		}

	});

}
