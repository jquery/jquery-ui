/*
 * jQuery UI Progressbar @VERSION
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget( "ui.progressbar", {
	options: {
		value: 0,
		min: 0,
		max: 100,
		display: 'all'	// value, values, percentage, all
	},

	_create: function() {
		this.element
			.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.attr({
				role: "progressbar",
				"aria-valuemin": this.options.min,
				"aria-valuemax": this.options.max,
				"aria-valuenow": this._value()
			});

		this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
			.appendTo( this.element );

		this._refreshValue();
	},

	destroy: function() {
		this.element
			.removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );

		this.valueDiv.remove();

		$.Widget.prototype.destroy.apply( this, arguments );
	},

	value: function( newValue ) {
		if ( newValue === undefined ) {
			return this._value();
		}

		this._setOption( "value", newValue );
		return this;
	},

	percentage: function( newPercentage ) {
		if ( newPercentage === undefined ) {
			return this._percentage();
		}

		newValue = ((this.options.max/100)*newPercentage);
		this._setOption( "value", newValue.toFixed(0) );
		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "value" ) {
			this.options.value = value;
			this._refreshValue();
			this._trigger( "change" );
			if ( this._value() === this.max ) {
				this._trigger( "complete" );
			}
		}

		$.Widget.prototype._setOption.apply( this, arguments );
	},

	_value: function() {
		var val = this.options.value;
		// normalize invalid value
		if ( typeof val !== "number" ) {
			val = 0;
		}
		return Math.min( this.options.max, Math.max( this.options.min, val ) );
	},

	_percentage: function() {
		return ((this._value()/this.options.max)*100);
	},

	_refreshValue: function() {
		var value = this.value();
		var percentage = this.percentage();
		var display = '';

		switch(this.options.display.toLowerCase()) {
			case 'all':
				display = "<span class='ui-progressbar-content'>" + value + '/' + this.options.max + ' (' + percentage.toFixed(0) + '%)</span>'
		}

		this.valueDiv
			.toggleClass( "ui-corner-right", value === this.max )
			.width( percentage.toFixed(0) + "%" )
			.html( display );
		this.element.attr( "aria-valuenow", value );
	}
});

$.extend( $.ui.progressbar, {
	version: "@VERSION"
});

})( jQuery );
