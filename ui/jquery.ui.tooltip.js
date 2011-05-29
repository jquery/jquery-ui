/*
 * jQuery UI Tooltip @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Tooltip
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
		items: "[title]",
		position: {
			my: "left+15 center",
			at: "right center"
		},
		tooltipClass: null
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
		// only set option, disable element style changes
		if ( key === "disabled" ) {
			this.options[ key ] = value;
			return;
		}
		this._super( "_setOption", key, value );
	},

	open: function( event ) {
		var content,
			that = this,
			target = $( event ? event.target : this.element )
				.closest( this.options.items );

		if ( !target.length ) {
			return;
		}

		if ( !target.data( "tooltip-title" ) ) {
			target.data( "tooltip-title", target.attr( "title" ) );
		}

		content = this.options.content.call( target[0], function( response ) {
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

		target.attr( "title", "" );

		// TODO: why is this check after we clear the title?
		if ( this.options.disabled ) {
			return;
		}

		// ajaxy tooltip can update an existing one
		var tooltip = this._find( target );
		if ( !tooltip.length ) {
			tooltip = this._tooltip();
			target.attr( "aria-describedby", tooltip.attr( "id" ) );
		}
		tooltip.find( ".ui-tooltip-content" ).html( content );
		tooltip
			.stop( true )
			.position( $.extend({
				of: target,
				using: function( pos ) {
					// we only want to hide if there's no custom using defined
					$( this ).css( pos ).hide();
				}
			}, this.options.position ) );

		this._show( tooltip, this.options.show );

		this._trigger( "open", event );

		this._bind( target, {
			mouseleave: "close",
			blur: "close"
		});
	},

	close: function( event ) {
		var that = this,
			target = $( event ? event.currentTarget : this.element ),
			tooltip = this._find( target );

		target.attr( "title", target.data( "tooltip-title" ) );

		if ( this.options.disabled ) {
			return;
		}

		target.removeAttr( "aria-describedby" );

		tooltip.stop( true );
		this._hide( tooltip, this.options.hide, function() {
			$( this ).remove();
			delete that.tooltips[ this.id ];
		});

		target.unbind( "mouseleave.tooltip blur.tooltip" );

		this._trigger( "close", event );
	},

	_tooltip: function() {
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
		tooltip.appendTo( document.body );
		this.tooltips[ id ] = true;
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
