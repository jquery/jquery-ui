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
		return function( event ) {
			that._interactionStart( event, hook );
		}
	},

	_interactionStart: function( event, hook ) {
		if ( false !== this._start( event ) ) {
			interaction.started = true;
			interaction.hooks[ hook ].handle( this );
		}
	},

	_interactionMove: function( event ) {
		this._move( event );
	},

	_interactionStop: function( event ) {
		this._stop( event );
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
					start( event );
				}
			}
		});
	},

	handle: function( widget ) {
		widget._bind( widget.document, {
			"mousemove": function( event ) {
				event.preventDefault();
				widget._interactionMove( event );
			},
			"mouseup": function( event ) {
				widget._interactionStop( event );
				widget.document.unbind( "mousemove mouseup" );
			}
		});
	}
};

})( jQuery );
