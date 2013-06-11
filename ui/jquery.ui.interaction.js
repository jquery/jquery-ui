/*
 * jQuery UI Interaction @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/interaction/
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var interaction, pointerHook;

$.widget( "ui.interaction", {
	version: "@VERSION",
	_create: function() {
		// force the context so we can pass these methods to the hooks
		this._interactionMove = $.proxy( this, "_interactionMove" );
		this._interactionStop = $.proxy( this, "_interactionStop" );

		// initialize all hooks for this widget
		for ( var hook in interaction.hooks ) {
			interaction.hooks[ hook ].setup( this, this._startProxy( hook ) );
		}
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

	// a pass through to _interactionStart() which tracks the hook that was used
	_startProxy: function( hook ) {
		var that = this;
		return function( event, target, pointerPosition ) {
			return that._interactionStart( event, target, pointerPosition, hook );
		};
	},

	_interactionStart: function( event, target, pointerPosition, hook ) {
		var started;

		// only one interaction can happen at a time
		if ( interaction.started ) {
			return false;
		}

		// check if the event occurred on a valid target
		if ( false === this._isValidTarget( $( target ) ) ) {
			return false;
		}

		// check if the widget wants the event to start an interaction
		started = ( this._start( event, pointerPosition ) !== false );
		if ( started ) {
			interaction.started = true;
			interaction.hooks[ hook ].handle( this,
				this._interactionMove, this._interactionStop );
		}

		// let the hook know if the interaction was started
		return started;
	},

	_interactionMove: function( event, pointerPosition ) {
		this._move( event, pointerPosition );
	},

	_interactionStop: function( event, pointerPosition ) {
		this._stop( event, pointerPosition );
		interaction.started = false;
	}
});

interaction = $.ui.interaction;
$.extend( interaction, {
	started: false,
	hooks: {}
});

pointerHook = interaction.hooks.pointer = {
	setup: function( widget, start ) {
		widget._on( widget.widget(), {
			"pointerdown": function( event ) {
				event = event.originalEvent;
				if ( pointerHook.id ) {
					return;
				}

				// only react to the primary button or touch
				if ( event.button === 0 ) {
					var started = start( event, event.target, {
						x: event.pageX,
						y: event.pageY
					});

					if ( started ) {
						// track pointer which is performing the interaction
						pointerHook.id = event.pointerId;

						// prevent selection
						event.preventDefault();
					}
				}
			}
		});
	},

	handle: function( widget, move, stop ) {
		function moveHandler( event ) {
			event = event.originalEvent;

			// Only move if original pointer moves
			if ( event.pointerId !== pointerHook.id ) {
				return;
			}

			move( event, {
				x: event.pageX,
				y: event.pageY
			});
		}

		function stopHandler( event ) {
			event = event.originalEvent;

			// Only stop if original pointer stops
			if ( event.pointerId !== pointerHook.id ) {
				return;
			}

			stop( event, {
				x: event.pageX,
				y: event.pageY
			});

			pointerHook.id = null;

			widget.document
				.unbind( "pointermove", moveHandler )
				.unbind( "pointerup", stopHandler )
				.unbind( "pointercancel", stopHandler );
		}

		widget._on( widget.document, {
			"pointermove": moveHandler,
			"pointerup": stopHandler,
			"pointercancel": stopHandler
		});
	}
};

})( jQuery );
