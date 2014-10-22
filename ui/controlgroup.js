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
			"ui-controlgroup": "",
			"ui-controlgroup-horizontal": "",
			"ui-controlgroup-vertical": ""
		}
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
		this._callChildMethod( "destroy" );
		this.element.removeAttr( "role" );
		this.element.removeClass(
			this._classes( "ui-controlgroup ui-controlgroup-vertical ui-controlgroup-horizontal" )
		).children().removeClass( "ui-corner-all ui-corner-top" +
			" ui-corner-bottom ui-corner-left ui-corner-tl ui-corner-tr" );
	},

	_callChildMethod: function( method ) {
		var that = this;
		$.each( this.options.items, function( widget, selector ) {
			var options = {};
			if ( that[ "_" + widget + "_options" ] ) {
				options = that[ "_" + widget + "_options" ]();
			}
			if ( $.fn[ widget ] && selector ) {
				that.element.children( selector )[ widget ]( method ?
					method : options );
			}
		});
	},

	_button_options: function() {
		return {
					classes: {
						"ui-button": ""
					}
				};
	},

	_checkboxradio_options: function() {
		return {
					classes: {
						"ui-checkbox-label": "",
						"ui-radio-label": ""
					}
				};
	},

	_selectmenu_options: function() {
		return {
					classes: {
						"ui-selectmenu-button-open": "",
						"ui-selectmenu-button-closed": ""
					}
				};
	},

	_elementsFromClassKey: function( classKey ) {
		if ( this.options.direction !== classKey.split( "-" )[ 2 ] ) {
			return $();
		}
		return this._superApply( arguments );
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

	_refresh_selectmenu: function() {
		var firstClasses = {},
			lastClasses = {},
			vertical = ( this.options.direction === "vertical" );

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
	},

	refresh: function() {
		var that = this,
			vertical = ( this.options.direction === "vertical" );
		this.element.addClass( this._classes( "ui-controlgroup ui-controlgroup-" +
			this.options.direction ) );
		this._callChildMethod( undefined );
		this.visible = this.element.children( ".ui-button" ).removeClass( function(index, css) {
			return ( css.match( /ui-corner-[a-z]*/g ) || [] ).join( " " );
		}).filter( this.options.excludeInvisible ? ":visible" : "*" );

		this.first = this.visible.eq( 0 )
			.addClass( "ui-corner-" + ( vertical ? "top" : "left" ) );
		this.last =	this.visible.last()
			.addClass( "ui-corner-" + ( vertical ? "bottom" : "right" ) );

		$.each( this.options.items, function( widget ) {
			if ( that[ "_refresh_" + widget ] ) {
				that[ "_refresh_" + widget ]();
			}
		});
		this._callChildMethod( "refresh" );

	}

});

return $.ui.controlgroup;

}));
