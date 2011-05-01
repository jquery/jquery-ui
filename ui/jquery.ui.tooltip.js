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
(function($) {

var increments = 0;

$.widget("ui.tooltip", {
	options: {
		tooltipClass: null,
		items: "[title]",
		content: function() {
			return $( this ).attr( "title" );
		},
		position: {
			my: "left center",
			at: "right center",
			offset: "15 0"
		}
	},
	_create: function() {
		this._bind( {
			mouseover: "open",
			focusin: "open"
		});
	},
	
	enable: function() {
		this.options.disabled = false;
	},
	
	disable: function() {
		// only set option, disable element style changes
		this.options.disabled = true;
	},
	
	open: function(event) {
		var target = $(event && event.target || this.element).closest(this.options.items);
		if ( !target.length ) {
			return;
		}
		var self = this;
		if ( !target.data("tooltip-title") ) {
			target.data("tooltip-title", target.attr("title"));
		}
		var content = this.options.content.call(target[0], function(response) {
			// IE may instantly serve a cached response, need to give it a chance to finish with _open before that
			setTimeout(function() {
				// when undefined, it got removeAttr, then ignore (ajax response)
				// intially its an empty string, so not undefined
				// TODO is there a better approach to enable ajax tooltips to have two updates?
				if (target.attr( "aria-describedby" ) !== undefined) {
					self._open(event, target, response);
				}
			}, 13);
		});
		if (content) {
			self._open(event, target, content);
		}
	},
	
	_open: function( event, target, content ) {
		if ( !content )
			return;

		target.attr("title", "");

		if ( this.options.disabled )
			return;

		// ajaxy tooltip can update an existing one
		var tooltip = this._find( target );
		if (!tooltip.length) {
			tooltip = this._tooltip();
			target.attr( "aria-describedby", tooltip.attr( "id" ) );
		}
		tooltip.find(".ui-tooltip-content").html( content );
		tooltip.position( $.extend({
			of: target
		}, this.options.position ) ).hide();


		tooltip.fadeIn();

		this._trigger( "open", event );

		this._bind( target, {
			mouseleave: "close",
			blur: "close"
		});
	},
	
	close: function( event ) {
		var target = $( event && event.currentTarget || this.element );
		target.attr( "title", target.data( "tooltip-title" ) );
		
		if ( this.options.disabled )
			return;

		var tooltip = this._find( target );
		target.removeAttr( "aria-describedby" );
		
		tooltip.fadeOut( function() {
			$( this ).remove();
		});
		
		target.unbind( "mouseleave.tooltip blur.tooltip" );
		
		this._trigger( "close", event );
	},

	_tooltip: function() {
		var tooltip = $( "<div></div>" )
			.attr( "id", "ui-tooltip-" + increments++ )
			.attr( "role", "tooltip" )
			.addClass( "ui-tooltip ui-widget ui-corner-all ui-widget-content" );
		if (this.options.tooltipClass) {
			tooltip.addClass(this.options.tooltipClass);
		}
		$( "<div></div>" )
			.addClass( "ui-tooltip-content" )
			.appendTo( tooltip );
		tooltip.appendTo( document.body );
		return tooltip;
	},

	_find: function( target ) {
		var id = target.attr( "aria-describedby" );
		return id ? $( document.getElementById( id ) ) : $();
	}
});

$.ui.tooltip.version = "@VERSION";

})(jQuery);