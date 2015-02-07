/*!
 * jQuery UI Controlgroup @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/controlgroup/
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./core",
			"./widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

return $.widget( "ui.controlgroup", {
	version: "@VERSION",
	defaultElement: "<div>",
	options: {
		disabled: null,
		items: {
			"button": "input[type=button], input[type=submit], input[type=reset], button, a",
			"checkboxradio": "input[type='checkbox'], input[type='radio']",
			"selectmenu": "select"
		},
		direction: "horizontal",
		excludeInvisible: true,
		classes: {}
	},

	_create: function() {
		this._enhance();
	},

	// To support enhanced option in jQuery mobile we isolate dom manipulation here
	_enhance: function() {
		this.element.attr( "role", "toolbar" );
		this.refresh();
	},

	_destroy: function() {
		var that = this;
		$.each( this.options.items, function( widget, selector ) {
			that.element.children( selector ).map( function() {
				return $( this )[ widget ]( "widget" ).removeData( "ui-controlgroup-data" )[ 0 ];
			}).removeData( "ui-controlgroup-data" );
		});
		this._callChildMethod( "destroy" );
		this.element.removeAttr( "role" );
	},

	_callChildMethod: function( method ) {
		var that = this;

		this.buttons = $();
		$.each( this.options.items, function( widget, selector ) {
			var options = {};
			if ( that[ "_" + widget + "_options" ] ) {
				options = that[ "_" + widget + "_options" ]( "middle" );
			}
			if ( $.fn[ widget ] && selector ) {
				that.element
					.find( selector )[ widget ]( method ? method : options )
						.each( function() {
							if ( method !== "destroy" ) {
								var button =
									$( this )[ widget ]( "widget" ).data( "ui-controlgroup-data", {
										"widgetType": widget,
										"element": $( this )
									});
								that.buttons = that.buttons.add( button );
							}
						});
			}
		});
	},

	_button_options: function( position ) {
		var cornerClasses = {
			"middle": null,
			"first": "ui-corner-" + ( this.options.direction === "vertical" ? "top" : "left" ),
			"last": "ui-corner-" + ( this.options.direction === "vertical" ? "bottom" : "right" )
		};

		return {
			classes: {
				"ui-button": cornerClasses[ position ]
			}
		};
	},

	_checkboxradio_options: function( position ) {
		var cornerClasses = {
			"middle": null,
			"first": "ui-corner-" + ( this.options.direction === "vertical" ? "top" : "left" ),
			"last": "ui-corner-" + ( this.options.direction === "vertical" ? "bottom" : "right" )
		};

		return {
			classes: {
				"ui-checkboxradio-label": cornerClasses[ position ]
			}
		};
	},

	_selectmenu_options: function( position ) {
		var classes = {
			middle: {
				"ui-selectmenu-button-open": null,
				"ui-selectmenu-button-closed": null
			},
			first: {
				"ui-selectmenu-button-open":
					"ui-corner-" + ( this.options.direction === "vertical" ? "top" : "tl" ),
				"ui-selectmenu-button-closed":
					"ui-corner-" + ( this.options.direction === "vertical" ? "top" : "left" )
			},
			last: {
				"ui-selectmenu-button-open":
					( this.options.direction === "vertical" )? null : "ui-corner-tr",
				"ui-selectmenu-button-closed":
					"ui-corner-" + ( ( this.options.direction === "vertical" )? "bottom" : "right" )
			}

		};
		return {
			width: "auto",
			classes: classes[ position ]
		};
	},

	_setOption: function( key, value ) {
		var original = this.options[ key ];

		this._super( key, value );
		if ( key === "direction" ) {
			this.element.removeClass( "ui-controlgroup-" + original );
		}
		if ( key === "disabled" ) {
			this._callChildMethod( value ? "disable" : "enable" );
		} else {
			this.refresh();
		}

	},

	refresh: function() {
		var children,
			that = this;

		this._addClass( "ui-controlgroup ui-controlgroup-" + this.options.direction );
		this._callChildMethod();

		children = this.buttons;

		if ( this.options.excludeInvisible ) {
			children = children.filter( ":visible" );
		}
		if ( children.length ) {
			[ "first", "last" ].forEach( function( value ) {
				var data = children[ value ]().data( "ui-controlgroup-data" );
				if ( that[ "_" + data.widgetType + "_options" ] ) {
					data.element[ data.widgetType ]( that[ "_" + data.widgetType + "_options" ]( value ) );
				}
			});
			this._callChildMethod( "refresh" );
		}
	}

});

}));
