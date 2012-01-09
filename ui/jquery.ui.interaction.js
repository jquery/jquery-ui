(function( $, undefined ) {

var interaction; // = $.ui.interaction

$.widget( "ui.interaction", {
	version: "@VERSION",
	_create: function() {
		for ( var hook in interaction.hooks ) {
			interaction.hooks[ hook ].setup( this, this._startProxy( hook ) );
		}
	},

	_startProxy: function( hook ) {
		var that = this;
		return function( event, position ) {
			that._interactionStart( event, position, hook );
		}
	},

	_interactionStart: function( event, position, hook ) {
		if ( false !== this._start( event, position ) ) {
			interaction.started = true;
			interaction.hooks[ hook ].handle( this );
		}
	},

	_interactionMove: function( event, position ) {
		this._move( event, position );
	},

	_interactionStop: function( event, position ) {
		this._stop( event, position );
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
		widget._bind({
			"mousedown": function( event ) {
				if ( event.which === 1 ) {
					event.preventDefault();
					start( event, {
						left: event.pageX,
						top: event.pageY
					});
				}
			}
		});
	},

	handle: function( widget ) {
		function mousemove( event ) {
			event.preventDefault();
			widget._interactionMove( event, {
				left: event.pageX,
				top: event.pageY
			});
		}

		function mouseup( event ) {
			widget._interactionStop( event, {
				left: event.pageX,
				top: event.pageY
			});
			widget.document
				.unbind( "mousemove", mousemove )
				.unbind( "mouseup", mouseup );
		}

		widget._bind( widget.document, {
			"mousemove": mousemove,
			"mouseup": mouseup
		});
	}
};

// WebKit doesn't support TouchList.identifiedTouch()
function getTouch( event ) {
	var touch,
		touches = event.originalEvent.changedTouches,
		i = 0, length = touches.length;
	
	for ( ; i < length; i++ ) {
		if ( touches[ i ].identifier === touchHook.id ) {
			return touches[ i ];
		}
	}
}

var touchHook = interaction.hooks.touch = {
	setup: function( widget, start ) {
		widget._bind({
			"touchstart": function( event ) {
				var touch;

				if ( touchHook.id ) {
					return;
				}

				touch = event.originalEvent.changedTouches.item( 0 );
				touchHook.id = touch.identifier;

				event.preventDefault();
				start( event, {
					left: touch.pageX,
					top: touch.pageY
				});
			}
		});
	},

	handle: function( widget ) {
		function touchmove( event ) {
			var touch = getTouch( event );
			if ( !touch ) {
				return;
			}

			event.preventDefault();
			widget._interactionMove( event, {
				left: touch.pageX,
				top: touch.pageY
			});
		}

		function touchend( event ) {
			var touch = getTouch( event );
			if ( !touch ) {
				return;
			}

			widget._interactionStop( event, {
				left: touch.pageX,
				top: touch.pageY
			});
			touchHook.id = null;
			widget.document
				.unbind( "touchmove", touchmove )
				.unbind( "touchend", touchend );
		}

		widget._bind( widget.document, {
			"touchmove": touchmove,
			"touchend": touchend
		});
	}
};

})( jQuery );
