/*!
 * jQuery UI Progressbar @VERSION
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/progressbar/
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget( "ui.progressbar", {
	version: "@VERSION",
	options: {
		value: 0,
		max: 100
	},

	min: 0,

	_create: function() {
		// Constrain initial value
		this.options.value = this._constrainedValue();

		this.element
			.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.attr({
				role: "progressbar",
				"aria-valuemin": this.min,
				"aria-valuemax": this.options.max,
				"aria-valuenow": this.options.value
			});

		this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
			.appendTo( this.element );

		this.oldValue = this.options.value;
		this._refreshValue();
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );

		this.valueDiv.remove();
	},

	value: function( newValue ) {
		if ( newValue === undefined ) {
			return this.options.value;
		}

		this._setOption( "value", this._constrainedValue( newValue ) );
		return this;
	},

	_constrainedValue: function( newValue ) {
		var val;
		if ( newValue === undefined ) {
			val = this.options.value;
		} else {
			val = newValue;
		}

		this.indeterminate = val === false;

		// sanitize value
		if ( typeof val !== "number" ) {
			val = 0;
		}
		return this.indeterminate ? false : Math.min( this.options.max, Math.max( this.min, val ) );
	},

	_setOptions: function( options ) {
		var val = options.value;

		// Ensure "value" option is set after other values (like max)
		delete options.value;
		this._super( options );

		if ( val !== undefined ) {
			this._setOption( "value", val );
		}
	},

	_setOption: function( key, value ) {
		if ( key === "max" ) {
			// Don't allow a max less than min
			this.options.max = Math.max( this.min, value );
			this.options.value = this._constrainedValue();
		}
		if ( key === "value" ) {
			this.options.value = this._constrainedValue( value );
		}
		else {
			this._super( key, value );
		}

		this._refreshValue();
	},

	_percentage: function() {
		return this.indeterminate ? 100 : 100 * this.options.value / this.options.max;
	},

	_refreshValue: function() {
		var value = this.options.value,
			percentage = this._percentage();

		this.valueDiv
			.toggle( this.indeterminate || value > this.min )
			.toggleClass( "ui-corner-right", value === this.options.max )
			.toggleClass( "ui-progressbar-indeterminate", this.indeterminate )
			.width( percentage.toFixed(0) + "%" );

		if ( this.indeterminate ) {
			this.element.removeAttr( "aria-valuemax" ).removeAttr( "aria-valuenow" );
			if ( !this.overlayDiv ) {
				this.overlayDiv = $( "<div class='ui-progressbar-overlay'></div>" ).appendTo( this.valueDiv );
			}
		} else {
			this.element.attr({
				"aria-valuemax": this.options.max,
				"aria-valuenow": value
			});
			if ( this.overlayDiv ) {
				this.overlayDiv.remove();
				this.overlayDiv = null;
			}
		}

		if ( this.oldValue !== value ) {
			this.oldValue = value;
			this._trigger( "change" );
		}
		if ( value === this.options.max ) {
			this._trigger( "complete" );
		}
	}
});

})( jQuery );
