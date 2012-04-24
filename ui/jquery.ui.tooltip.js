/*!
 * jQuery UI Tooltip @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 */
(function( $ ) {

var increments = 0;

$.widget( "ui.tooltip", {
	version: "@VERSION",
	options: {
		content: function() {
			return $( this ).attr( "title" );
		},
		hide: true,
		items: "[title]",
		position: {
			my: "left+15 center",
			at: "right center",
			collision: "flipfit flipfit"
		},
		show: true,
		tooltipClass: null,

		// callbacks
		close: null,
		open: null
	},

	_create: function() {
		this._bind({
			mouseover: "open",
			focusin: "open"
		});

		// IDs of generated tooltips, needed for destroy
		this.tooltips = {};
	},

	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this[ value ? "_disable" : "_enable" ]();
			this.options[ key ] = value;
			// disable element style changes
			return;
		}
		this._super( key, value );
	},

	_disable: function() {
		var that = this;

		// close open tooltips
		$.each( this.tooltips, function( id, element ) {
			var event = $.Event( "blur" );
			event.target = event.currentTarget = element[0];
			that.close( event, true );
		});

		// remove title attributes to prevent native tooltips
		this.element.find( this.options.items ).andSelf().each(function() {
			var element = $( this );
			if ( element.is( "[title]" ) ) {
				element
					.data( "ui-tooltip-title", element.attr( "title" ) )
					.attr( "title", "" );
			}
		});
	},

	_enable: function() {
		// restore title attributes
		this.element.find( this.options.items ).andSelf().each(function() {
			var element = $( this );
			if ( element.data( "ui-tooltip-title" ) ) {
				element.attr( "title", element.data( "ui-tooltip-title" ) );
			}
		});
	},

	open: function( event ) {
		var content,
			that = this,
			target = $( event ? event.target : this.element )
				.closest( this.options.items );

		// if aria-describedby exists, then the tooltip is already open
		if ( !target.length || target.attr( "aria-describedby" ) ) {
			return;
		}

		if ( target.attr( "title" ) ) {
			target.data( "ui-tooltip-title", target.attr( "title" ) );
		}

		target.data( "tooltip-open", true );

		content = this.options.content.call( target[0], function( response ) {
			// ignore async response if tooltip was closed already
			if ( !target.data( "tooltip-open" ) ) {
				return;
			}
			// IE may instantly serve a cached response for ajax requests
			// delay this call to _open so the other call to _open runs first
			setTimeout(function() {
				that._open( event, target, response );
			}, 1 );
		});
		if ( content ) {
			that._open( event, target, content );
		}
	},

	_open: function( event, target, content ) {
		if ( !content ) {
			return;
		}

		// if we have a title, clear it to prevent the native tooltip
		// we have to check first to avoid defining a title if none exists
		// (we don't want to cause an element to start matching [title])

		// We don't use removeAttr as that causes the native tooltip to show
		// up in IE (9 and below, didn't yet test 10). Happens only when removing
		// inside the mouseover handler.
		if ( target.is( "[title]" ) ) {
			target.attr( "title", "" );
		}

		// ajaxy tooltip can update an existing one
		var tooltip = this._find( target );
		if ( !tooltip.length ) {
			tooltip = this._tooltip( target );
			target.attr( "aria-describedby", tooltip.attr( "id" ) );
		}
		tooltip.find( ".ui-tooltip-content" ).html( content );
		tooltip
			.stop( true )
			.position( $.extend({
				of: target
			}, this.options.position ) )
			.hide();

		this._show( tooltip, this.options.show );

		this._trigger( "open", event, { tooltip: tooltip } );

		this._bind( target, {
			mouseleave: "close",
			focusout: "close",
			keyup: function( event ) {
				if ( event.keyCode === $.ui.keyCode.ESCAPE ) {
					var fakeEvent = $.Event(event);
					fakeEvent.currentTarget = target[0];
					this.close( fakeEvent, true );
				}
			}
		});
	},

	close: function( event, force ) {
		var that = this,
			target = $( event ? event.currentTarget : this.element ),
			tooltip = this._find( target );

		// disabling closes the tooltip, so we need to track when we're closing
		// to avoid an infinite loop in case the tooltip becomes disabled on close
		if ( this.closing ) {
			return;
		}

		// don't close if the element has focus
		// this prevents the tooltip from closing if you hover while focused
		if ( !force && this.document[0].activeElement === target[0] ) {
			return;
		}

		// only set title if we had one before (see comment in _open())
		if ( target.data( "ui-tooltip-title" ) ) {
			target.attr( "title", target.data( "ui-tooltip-title" ) );
		}

		target.removeAttr( "aria-describedby" );

		tooltip.stop( true );
		this._hide( tooltip, this.options.hide, function() {
			$( this ).remove();
			delete that.tooltips[ this.id ];
		});

		target.removeData( "tooltip-open" );
		target.unbind( "mouseleave.tooltip focusout.tooltip keyup.tooltip" );

		this.closing = true;
		this._trigger( "close", event, { tooltip: tooltip } );
		this.closing = false;
	},

	_tooltip: function( element ) {
		var id = "ui-tooltip-" + increments++,
			tooltip = $( "<div>" )
				.attr({
					id: id,
					role: "tooltip"
				})
				.addClass( "ui-tooltip ui-widget ui-corner-all ui-widget-content " +
					( this.options.tooltipClass || "" ) );
		$( "<div>" )
			.addClass( "ui-tooltip-content" )
			.appendTo( tooltip );
		tooltip.appendTo( this.document[0].body );
		if ( $.fn.bgiframe ) {
			tooltip.bgiframe();
		}
		this.tooltips[ id ] = element;
		return tooltip;
	},

	_find: function( target ) {
		var id = target.attr( "aria-describedby" );
		return id ? $( "#" + id ) : $();
	},

	_destroy: function() {
		$.each( this.tooltips, function( id ) {
			$( "#" + id ).remove();
		});
	}
});

}( jQuery ) );
