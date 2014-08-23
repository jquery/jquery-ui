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
		excludeInvisible: true
	},

	_create: function() {
		this._enhance();
		this._on( this.element, {
			"selectmenuopen": "_handleSelectmenuOpen",
			"selectmenuclose": "_handleSelectmenuClose"
		});
	},

	_handleSelectmenuOpen: function( event ) {
		var target = $( event.target ),
			widget = target.selectmenu ( "widget" ),
			vertical = this.options.direction === "vertical";
		if ( widget[ 0 ] !== this.first[ 0 ] || !vertical ) {
			widget.removeClass( "ui-corner-top" );
		}
		if ( vertical && widget[ 0 ] === this.last[ 0 ] ) {
			widget.removeClass( "ui-corner-bottom" );
		}
		if ( widget[ 0 ] === this.first[ 0 ] ) {
			widget.removeClass( "ui-corner-left" )
				.addClass( "ui-corner-" + ( vertical ? "top" : "tl" ) );
		}
		if ( widget[ 0 ] === this.last[ 0 ] ) {
			widget.removeClass( "ui-corner-right" )
				.addClass( vertical ? "" : "ui-corner-tr" );
		}
	},

	_handleSelectmenuClose: function( event ) {
		var target = $( event.target ),
			widget = target.selectmenu ( "widget" ),
			vertical = this.options.direction === "vertical";
		widget.removeClass( "ui-corner-all" );
		if ( widget[ 0 ] === this.first[ 0 ] ) {
			widget.removeClass( "ui-corner-left" )
				.addClass( "ui-corner-" + ( vertical ? "top" : "left" ) );
		}
		if ( widget[ 0 ] === this.last[ 0 ] ) {
			widget.removeClass( "ui-corner-right" )
				.addClass( vertical ? "ui-corner-bottom" : "ui-corner-right" );
		}
	},

	_enhance: function() {
		this.element.attr( "role", "toolbar" );
		this.refresh();
	},

	_destroy: function() {
		this._callChildMethod( "destroy" );
		this.element.removeAttr( "role" );
		this.element.removeClass( "ui-controlgroup ui-selectmenu-vertical ui-controlgroup-horizontal" )
			.children().removeClass( "ui-corner-all ui-corner-top" +
			" ui-corner-bottom ui-corner-left ui-corner-tl ui-corner-tr" );
	},

	_callChildMethod: function( method, filter ) {
		var that = this;
		$.each( this.options.items, function( widget, selector ) {
			if ( $.fn[ widget ] && selector ) {
				that.element.children( selector ).not( filter )[ widget ]( method );
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
		var vertical = ( this.options.direction === "vertical" );
		this.element.addClass( "ui-controlgroup ui-controlgroup-" + this.options.direction );
		this._callChildMethod( undefined );
		this.visible = this.element.children( ".ui-button" ).removeClass( function(index, css) {
			return ( css.match( /ui-corner-[a-z]*/g ) || [] ).join( " " );
		}).filter( this.options.excludeInvisible ? ":visible" : "*" );

		this.first = this.visible.filter( ":first" )
			.addClass( "ui-corner-" + ( vertical ? "top" : "left" ) );
		this.last =	this.visible.filter( ":last" )
			.addClass( "ui-corner-" + ( vertical ? "bottom" : "right" ) );
		this.element.find( this.options.items.selectmenu ).selectmenu( "refresh" );
		this._callChildMethod( "refresh" );

	}

});

return $.ui.controlgroup;

}));
