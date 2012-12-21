/*
 * jQuery UI Interaction @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Interaction
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var interaction, touchHook, pointerHook;

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

interaction.hooks.mouse = {
	setup: function( widget, start ) {
		widget._on( widget.widget(), {
			"mousedown": function( event ) {
				// only react to the primary button
				if ( event.which === 1 ) {
					var started = start( event, event.target, {
						x: event.pageX,
						y: event.pageY
					});

					if ( started ) {
						// prevent selection
						event.preventDefault();
					}
				}
			}
		});
	},

	handle: function( widget, move, stop ) {
		function mousemove( event ) {
			event.preventDefault();
			move( event, {
				x: event.pageX,
				y: event.pageY
			});
		}

		function mouseup( event ) {
			stop( event, {
				x: event.pageX,
				y: event.pageY
			});
			widget.document
				.unbind( "mousemove", mousemove )
				.unbind( "mouseup", mouseup );
		}

		widget._on( widget.document, {
			"mousemove": mousemove,
			"mouseup": mouseup
		});
	}
};

// WebKit doesn't support TouchList.identifiedTouch()
function getTouch( event ) {
	var touches = event.originalEvent.changedTouches,
		i = 0, length = touches.length;

	for ( ; i < length; i++ ) {
		if ( touches[ i ].identifier === touchHook.id ) {
			return touches[ i ];
		}
	}
}

touchHook = interaction.hooks.touch = {
	setup: function( widget, start ) {
		widget._on( widget.widget(), {
			"touchstart": function( event ) {
				var touch, started;

				if ( touchHook.id ) {
					return;
				}

				touch = event.originalEvent.changedTouches.item( 0 );
				started = start( event, touch.target, {
					x: touch.pageX,
					y: touch.pageY
				});

				if ( started ) {
					// track which finger is performing the interaction
					touchHook.id = touch.identifier;
					// prevent panning/zooming
					event.preventDefault();
				}
			}
		});
	},

	handle: function( widget, move, stop ) {
		function moveHandler( event ) {
			// TODO: test non-Apple WebKits to see if they allow
			// zooming/scrolling if we don't preventDefault()
			var touch = getTouch( event );
			if ( !touch ) {
				return;
			}

			event.preventDefault();
			move( event, {
				x: touch.pageX,
				y: touch.pageY
			});
		}

		function stopHandler( event ) {
			var touch = getTouch( event );
			if ( !touch ) {
				return;
			}

			stop( event, {
				x: touch.pageX,
				y: touch.pageY
			});
			touchHook.id = null;
			widget.document
				.unbind( "touchmove", moveHandler )
				.unbind( "touchend", stopHandler );
		}

		widget._on( widget.document, {
			"touchmove": moveHandler,
			"touchend": stopHandler
		});
	}
};

pointerHook = interaction.hooks.msPointer = {
	setup: function( widget, start ) {
		widget._on( widget.widget(), {
			"MSPointerDown": function( _event ) {
				var started,
					event = _event.originalEvent;

				if ( pointerHook.id ) {
					return;
				}

				// TODO: how can we detect a "right click" with a pen?
				// TODO: get full details about which and button from MS
				// touch and pen = 1
				// primary mouse button = 2
				if ( event.which > 2 ) {
					return;
				}

				started = start( event, event.target, {
					x: event.pageX,
					y: event.pageY
				});

				if ( started ) {
					// track which pointer is performing the interaction
					pointerHook.id = event.pointerId;
					// prevent panning/zooming
					event.preventManipulation();
					// prevent promoting pointer events to mouse events
					event.preventMouseEvent();
				}
			}
		});
	},

	handle: function( widget, move, stop ) {
		function moveHandler( _event ) {
			var event = _event.originalEvent,
				pageX = event.pageX,
				pageY = event.pageY;

			// always prevent manipulation to avoid panning/zooming
			event.preventManipulation();

			if ( event.pointerId !== pointerHook.id ) {
				return;
			}

			// MS streams events constantly, even if there is no movement
			// so we optimize by ignoring repeat events
			if ( pointerHook.x === pageX && pointerHook.y === pageY ) {
				return;
			}

			pointerHook.x = pageX;
			pointerHook.y = pageY;
			move( event, {
				x: pageX,
				y: pageY
			});
		}

		function stopHandler( _event ) {
			var event = _event.originalEvent;

			if ( event.pointerId !== pointerHook.id ) {
				return;
			}

			stop( event, {
				x: event.pageX,
				y: event.pageY
			});
			pointerHook.id = pointerHook.x = pointerHook.y = undefined;
			widget.document
				.unbind( "MSPointerMove", moveHandler )
				.unbind( "MSPointerUp", stopHandler )
				.unbind( "MSPointerCancel", stopHandler );
		}

		widget._on( widget.document, {
			"MSPointerMove": moveHandler,
			"MSPointerUp": stopHandler,
			"MSPointerCancel": stopHandler
		});
	}
};

})( jQuery );
