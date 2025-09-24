/*!
 * jQuery UI Pointer @VERSION
 * https://jqueryui.com
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license.
 * https://jquery.org/license
 */

//>>label: Pointer
//>>group: Widgets
//>>description: Abstracts pointer-based interactions to assist in creating certain widgets.
//>>docs: https://api.jqueryui.com/pointer/

( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../version",
			"../widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {
"use strict";

var pointerHandled = false;
$( document ).on( "pointerup", function() {
	pointerHandled = false;
} );

return $.widget( "ui.mouse", {
	version: "@VERSION",
	options: {
		cancel: "input, textarea, button, select, option",
		distance: 1,
		delay: 0
	},
	_pointerInit: function() {
		var that = this;

		this.element
			.on( "pointerdown." + this.widgetName, function( event ) {
				return that._pointerDown( event );
			} )
			.on( "click." + this.widgetName, function( event ) {
				if ( true === $.data( event.target, that.widgetName + ".preventClickEvent" ) ) {
					$.removeData( event.target, that.widgetName + ".preventClickEvent" );
					event.stopImmediatePropagation();
					return false;
				}
			} );

		this.started = false;
	},

	_pointerDestroy: function() {
		this.element.off( "." + this.widgetName );
		if ( this._pointerMoveDelegate ) {
			this.document
				.off( "pointermove." + this.widgetName, this._pointerMoveDelegate )
				.off( "pointerup." + this.widgetName, this._pointerUpDelegate );
		}
	},

	_pointerDown: function( event ) {
		if ( pointerHandled ) {
			return;
		}

		this._pointerMoved = false;

		if ( this._pointerStarted ) {
			this._pointerUp( event );
		}

		this._pointerDownEvent = event;

		var that = this,
			btnIsLeft = event.button === 0,
			elIsCancel = typeof this.options.cancel === "string" ?
				$( event.target ).closest( this.options.cancel ).length :
				false;
		if ( !btnIsLeft || elIsCancel || !this._pointerCapture( event ) ) {
			return true;
		}

		this.pointerDelayMet = !this.options.delay;
		if ( !this.pointerDelayMet ) {
			this._pointerDelayTimer = setTimeout( function() {
				that.pointerDelayMet = true;
			}, this.options.delay );
		}

		if ( this._pointerDistanceMet( event ) && this._pointerDelayMet( event ) ) {
			this._pointerStarted = ( this._pointerStart( event ) !== false );
			if ( !this._pointerStarted ) {
				event.preventDefault();
				return true;
			}
		}

		if ( true === $.data( event.target, this.widgetName + ".preventClickEvent" ) ) {
			$.removeData( event.target, this.widgetName + ".preventClickEvent" );
		}

		this._pointerMoveDelegate = function( event ) {
			return that._pointerMove( event );
		};
		this._pointerUpDelegate = function( event ) {
			return that._pointerUp( event );
		};

		this.document
			.on( "pointermove." + this.widgetName, this._pointerMoveDelegate )
			.on( "pointerup." + this.widgetName, this._pointerUpDelegate );

		event.preventDefault();

		pointerHandled = true;
		return true;
	},

	_pointerMove: function( event ) {
		if ( this._pointerMoved && event.buttons === 0 ) {
			if ( event.altKey || event.ctrlKey ||
					event.metaKey || event.shiftKey ) {
				this.ignoreMissingButtons = true;
			} else if ( !this.ignoreMissingButtons ) {
				return this._pointerUp( event );
			}
		}

		if ( event.buttons || event.button ) {
			this._pointerMoved = true;
		}

		if ( this._pointerStarted ) {
			this._pointerDrag( event );
			return event.preventDefault();
		}

		if ( this._pointerDistanceMet( event ) && this._pointerDelayMet( event ) ) {
			this._pointerStarted =
				( this._pointerStart( this._pointerDownEvent, event ) !== false );
			if ( this._pointerStarted ) {
				this._pointerDrag( event );
			} else {
				this._pointerUp( event );
			}
		}

		return !this._pointerStarted;
	},

	_pointerUp: function( event ) {
		this.document
			.off( "pointermove." + this.widgetName, this._pointerMoveDelegate )
			.off( "pointerup." + this.widgetName, this._pointerUpDelegate );

		if ( this._pointerStarted ) {
			this._pointerStarted = false;

			if ( event.target === this._pointerDownEvent.target ) {
				$.data( event.target, this.widgetName + ".preventClickEvent", true );
			}

			this._pointerStop( event );
		}

		if ( this._pointerDelayTimer ) {
			clearTimeout( this._pointerDelayTimer );
			delete this._pointerDelayTimer;
		}

		this.ignoreMissingButtons = false;
		pointerHandled = false;
		event.preventDefault();
	},

	_pointerDistanceMet: function( event ) {
		return ( Math.max(
				Math.abs( this._pointerDownEvent.pageX - event.pageX ),
				Math.abs( this._pointerDownEvent.pageY - event.pageY )
			) >= this.options.distance
		);
	},

	_pointerDelayMet: function( /* event */ ) {
		return this.pointerDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_pointerStart: function( /* event */ ) {},
	_pointerDrag: function( /* event */ ) {},
	_pointerStop: function( /* event */ ) {},
	_pointerCapture: function( /* event */ ) {
		return true;
	}
} );

} );
