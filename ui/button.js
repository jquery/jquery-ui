/*!
 * jQuery UI Button @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/button/
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

var baseClasses = "ui-button ui-widget ui-corner-all",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons" +
		" ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only" +
		" ui-icon-begining ui-icon-end ui-icon-top ui-icon-bottom",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ":ui-button" ).button( "refresh" );
		}, 1 );
	};

$.widget( "ui.button", {
	version: "@VERSION",
	defaultElement: "<button>",
	options: {
		disabled: null,
		showLabel: true,
		label: null,
		icon: null,
		iconPosition: "begining"
	},

	_getCreateOptions: function () {
		var label,
			isDisabled = this.element.prop( "disabled" ),
			options = {};

		this.isInput = this.element.is( "input" );
		label = ( this.isInput ? this.element.val() : this.element.html() );

		if( typeof isDisabled !== "undefined" ) {
			options.disabled = isDisabled;
		}

		if( typeof label !== "undefined" && label !== "" ) {
			options.label = label;
		}

		return options;
	},

	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset" + this.eventNamespace )
			.bind( "reset" + this.eventNamespace, formResetHandler );

		if ( typeof this.options.disabled === "boolean" ) {
			this.element.prop( "disabled", this.options.disabled );
		} else {
			this.options.disabled = !!this.element.prop( "disabled" );
		}
		if( this.options.disabled === true ){
			this._setOption( "disabled", true );
		}

		this.element
			.addClass( baseClasses )
			.attr( "role", "button" );

		if( this.options.icon ) {
			this.icon = $( "<span>" );
			this.icon.addClass( " ui-icon " + this.options.icon );
			if( this.options.iconPosition ) {
				this.element.addClass(  "ui-icon-" + this.options.iconPosition );
			}
			if( !this.options.text ){
				this.element.addClass( " ui-button-icon-only" );
			}
			this.element.append( this.icon );
			this._setTitle();
		}
		if( this.options.label ){
			if( this.isInput ) {
				this.element.val( this.options.label );
			} else {
				var textNode = this.element.contents().filter( function() {
				    return this.nodeType === 3;
				 })[ 0 ];
				if( textNode !== undefined ) {
					textNode.nodeValue = this.options.label;
				} else {
					this.element.html( this.options.label + this.element.html() );
				}
			}
		}

		if ( this.element.is("a") ) {
			this.element.keyup( function( event ) {
				if ( event.keyCode === $.ui.keyCode.SPACE ) {

					// TODO pass through original event correctly (just as 2nd argument doesn't work)
					$( this ).click();
				}
			});
		}
	},

	_setTitle: function() {
		this.title = this.element.attr( "title" );
		this.hasTitle = !!this.title;

		if( !this.options.text ){
			if ( !this.hasTitle ) {
				this.element.attr( "title", this.title );
			}
		}
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-helper-hidden-accessible " + baseClasses +
				" ui-state-active " + typeClasses )
			.removeAttr( "role" )
			.removeAttr( "aria-pressed" );

		if ( !this.hasTitle ) {
			this.element.removeAttr( "title" );
		}
	},

	_setOption: function( key, value ) {
		if( key === "icon" ) {
			this.icon.addClass( " ui-icon " + value )
				.removeClass( this.options.icon );
		}
		if( key === "text" ) {
			this.element.toggleClass( ".ui-button-icon-only", !( !!value ) )
				.toggleClass( this.options.iconPosition, !!value );
			this._setTitle();
		}
		if( key === "iconPosition" && this.options.text ) {
			this.element.addClass( value )
				.removeClass( this.options.iconPosition );
		}
		if( key === "label" ) {
			if( this.element.is( "input" ) ) {
				this.element.val( value );
			} else {
				this.element.html( value );
			}
		}
		this._super( key, value );
		if ( key === "disabled" ) {
			this.element.toggleClass( " ui-state-disabled", !!value );
			this.element.prop( "disabled", !!value ).blur();
			return;
		}
	},

	refresh: function() {

		//See #8237 & #8828
		var isDisabled = this.element.is( "input, button" ) ? this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions( { "disabled": isDisabled } );
		}

		this._setTitle();
	}

});

return $.ui.button;

}));
