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

$.widget( "ui.controlgroup", {
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
		classes: {
			"ui-controlgroup": null,
			"ui-controlgroup-horizontal": null,
			"ui-controlgroup-vertical": null
		}
	},

	_create: function() {
		this._enhance();
	},

	_enhance: function() {
		this.element.attr( "role", "toolbar" );
		this.refresh();
	},

	_destroy: function() {
		this._callChildMethod( "destroy" );
		this.element.removeAttr( "role" );
		this.element.removeClass(
			this._classes( "ui-controlgroup ui-controlgroup-vertical ui-controlgroup-horizontal" )
		).children().removeClass( "ui-corner-all ui-corner-top" +
			" ui-corner-bottom ui-corner-left ui-corner-tl ui-corner-tr" );
	},

	_callChildMethod: function( method, filter ) {
		var that = this;
		$.each( this.options.items, function( widget, selector ) {
			var options = {};
			switch ( widget ) {
				case "button":
					options.classes = {
						"ui-button": null
					};
				break;
				case "checkboxradio":
					options.classes = {
						"ui-checkbox-label": null,
						"ui-radio-label": null
					};
				break;
				case "selectmenu":
					options.classes = {
						"ui-selectmenu-button-open": null,
						"ui-selectmenu-button-closed": null
					};
				break;
			}
			if ( $.fn[ widget ] && selector ) {
				that.element.children( selector ).not( filter )[ widget ]( method ?
					method : options );
			}
		});
	},

	_setOption: function( key, value ) {
		var original = this.options[ key ];

		this._super( key, value );
		if ( key === "direction" ) {
			this.element.removeClass( "ui-controlgroup-" + original )
				.addClass( "ui-controlgroup-" + value );
		}
		if ( key === "disabled" ) {
			this._callChildMethod( value ? "disable" : "enable" );
		} else {
			this.refresh();
		}

	},

	refresh: function() {
		var firstClasses = {},
			lastClasses = {},
			vertical = ( this.options.direction === "vertical" );
		this.element.addClass( this._classes( "ui-controlgroup ui-controlgroup-" +
			this.options.direction ) );
		this._callChildMethod( undefined );
		this.visible = this.element.children( ".ui-button" ).removeClass( function(index, css) {
			return ( css.match( /ui-corner-[a-z]*/g ) || [] ).join( " " );
		}).filter( this.options.excludeInvisible ? ":visible" : "*" );

		this.first = this.visible.filter( ":first" )
			.addClass( "ui-corner-" + ( vertical ? "top" : "left" ) );
		this.last =	this.visible.filter( ":last" )
			.addClass( "ui-corner-" + ( vertical ? "bottom" : "right" ) );
		if ( $.ui.selectmenu ) {
			if ( this.first.is( ".ui-selectmenu-button" ) && !vertical ) {
				firstClasses[ "ui-selectmenu-button-open" ] = "ui-corner-tl";
				firstClasses[ "ui-selectmenu-button-closed" ] = "ui-corner-left";
				$( "#" + this.first.attr( "id" ).replace( /-button/, "" ) )
					.selectmenu( "option", "classes", firstClasses );
			}
			if ( this.last.is( ".ui-selectmenu-button" ) ) {
				if ( vertical ) {
					lastClasses[ "ui-selectmenu-button-open" ] = null;
					lastClasses[ "ui-selectmenu-button-closed" ] = "ui-corner-bottom";
				} else {
					lastClasses[ "ui-selectmenu-button-open" ] = "ui-corner-tr";
					lastClasses[ "ui-selectmenu-button-closed" ] = "ui-corner-right";
				}
				$( "#" + this.last.attr( "id" ).replace( /-button/, "" ) )
					.selectmenu( "option", "classes", lastClasses );
			}
			this.element.find( this.options.items.selectmenu ).selectmenu( "refresh" );
		}
		this._callChildMethod( "refresh" );

	}

});

return $.ui.controlgroup;

}));
