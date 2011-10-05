/*
 * jQuery UI Progressbar @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
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
	version: "@VERSION",
	options: {
		value: 0,
		max: 100,
		indeterminateSpeed : 6000
	},

	min: 0,

	_create: function() {
		this.element
			.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.attr({
				role: "progressbar",
				"aria-valuemin": this.min,
				"aria-valuemax": this.options.max,
				"aria-valuenow": this._value()
			});

		this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
			.appendTo( this.element );

		this.oldValue = this._value();
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
			return this._value();
		}

		this._setOption( "value", newValue );
		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "value" ) {
			this.options.value = value;
			this._refreshValue();
			if ( this._value() === this.options.max ) {
				this._trigger( "complete" );
			}
		}

		this._super( "_setOption", key, value );
	},

	_value: function() {
		var val = this.options.value;
		
		// false for indeterminate progress bar
		if (val === false) {
			return false;
		// normalize invalid value
		} else if( typeof val !== "number" ) {
			val = 0;
		}
		
		return Math.min( this.options.max, Math.max( this.min, val ) );
	},

	_percentage: function() {
		return 100 * this._value() / this.options.max;
	},

	_refreshValue: function() {
		var value = this.value();
		if (value !== false ) {
			var percentage = this._percentage();

			if ( this.oldValue !== value ) {
				this.oldValue = value;
				this._trigger( "change" );
			}

			this.valueDiv
				.toggle( value > this.min )
				.toggleClass( "ui-corner-right", value === this.options.max )
				.width( percentage.toFixed(0) + "%" )
			    .stop()
				.css('left', '0px');
			this.element.attr( "aria-valuenow", value );
		} else {
			this.valueDiv
				.width('15%')
				.addClass("ui-corner-right")
			this._startIndeterminateAnimation();
		}
	},
	
	_startIndeterminateAnimation: function(reverse){
		var self = this;
		var end = ( reverse ) ? 0 : ( this.element.width() - this.valueDiv.width() );
		
		this.valueDiv.animate({
			left: end +'px'
		}, {
			duration: self.options.indeterminateSpeed,
			complete: function() {
				// self.valueDiv.css('left', '0px');
				self._startIndeterminateAnimation(!reverse);
			}
		});
	}
});

})( jQuery );
