 /*!
 * jQuery UI Interaction @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

 //>>label: Interaction
 //>>group: UI Core
 //>>description: Abstracts pointer-based interactions to assist in creating certain widgets.
 //>>docs: http://api/jqueryui.com/interaction/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"./widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}( function( $ ) {

return $.widget( "ui.interaction", {
	version: "@VERSION",
	options: {
		cancel: "input,textarea,button,select,option"
	},
	_create: function() {
		// Force the context so we can pass these methods to the hooks
		this._interactionMove = $.proxy( this, "_interactionMove" );
		this._interactionStop = $.proxy( this, "_interactionStop" );

		// Initialize hook for this widget
		this.setup( this, this._startProxy( this ) );
	},

	/** abstract methods **/

	// _start: function( event, pointerPosition )
	// _move: function( event, pointerPosition )
	// _stop: function( event, pointerPosition )

	/** protected **/

	_isValidTarget: function() {
		return true;
	},

	/** internal **/

	// A pass through to _interactionStart() which tracks the hook that was used
	_startProxy: function( hook ) {
		var that = this;
		return function( event, target, pointerPosition ) {
			return that._interactionStart( event, target, pointerPosition, hook );
		};
	},

	_interactionStart: function( event, target, pointerPosition ) {
		var started,
		    elIsCancel;

		// Only one interaction can happen at a time
		if ( this.started ) {
			return false;
		}

		// Check if the event occurred on a valid target
		if ( false === this._isValidTarget( $( target ) ) ) {
			return false;
		}

		// Check that target is not in cancel.
		elIsCancel = ( typeof this.options.cancel === "string" && target.nodeName &&
				$( target ).closest( this.options.cancel ).length );
		if ( elIsCancel ) {
			return false;
		}

		// Check if the widget wants the event to start an interaction
		started = ( this._start( event, pointerPosition ) !== false );
		if ( started ) {
			this.started = true;
			this.pointerHandle( this, this._interactionMove, this._interactionStop );
		}

		// Let the hook know if the interaction was started
		return started;
	},

	_interactionMove: function( event, pointerPosition ) {
		this._move( event, pointerPosition );
	},

	_interactionStop: function( event, pointerPosition ) {
		this._stop( event, pointerPosition );
		this.started = false;
	},

	setup: function( widget, start ) {
		widget._on( widget.widget(), {
			"pointerdown": function( _event ) {
				var started,
				    event = _event.originalEvent;

				if ( this.id !== undefined ) {
					return;
				}

				if ( !event.isPrimary ) {
					return;
				}

				started = start( event, event.target, {
					x: event.pageX,
					y: event.pageY
				} );

				if ( started ) {
					// track which device is performing the interaction
					this.id = event.pointerId;

					event.preventDefault();
				}
			}
		} );
	},

	// Rename to pointerHandle to avoid naming collision with draggable.handle
	pointerHandle: function( widget, move, stop ) {
		function moveHandler( _event ) {
			var event = _event.originalEvent,
			    pageX = event.pageX,
			    pageY = event.pageY;

			// Only handle events from device that started interaction
			if ( event.pointerId !== this.id ) {
				return;
			}

			// MS streams events constantly, even if there is no movement
			// so we optimize by ignoring repeat events
			if ( this.x === pageX && this.y === pageY ) {
				return;
			}

			this.x = pageX;
			this.y = pageY;
			move( event, {
				x: pageX,
				y: pageY
			} );
		}

		function stopHandler( _event ) {
			var event = _event.originalEvent;

			// Only handle events from device that started interaction
			if ( event.pointerId !== this.id ) {
				return;
			}

			stop( event, {
				x: event.pageX,
				y: event.pageY
			} );

			this.id = this.x = this.y = undefined;

			widget.document
				.unbind( "pointermove", moveHandler )
				.unbind( "pointerup", stopHandler )
				.unbind( "pointercancel", stopHandler );
		}

		widget._on( widget.document, {
			"pointermove": moveHandler,
			"pointerup": stopHandler,
			"pointercancel": stopHandler
		} );
	}
} );
} ) );
