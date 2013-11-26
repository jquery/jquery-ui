/*!
 * jQuery UI Button @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/button/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var baseClasses = "ui-button ui-widget ui-corner-all",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
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
		text: true,
		label: null,
		icon: null,
		iconPosition: null
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
		}

		this.element
			.addClass( baseClasses )
			.attr( "role", "button" );

		if( this.options.icon ) {
			this.element.addClass( " ui-icon " + this.options.icon );
			if( this.options.iconPosition ) {
				this.element.addClass(  "ui-icon-" + this.options.iconPosition );
			}
			if( !this.options.text ){
				this.element.addClass( " ui-icon-notext" );
			}
			this._setTitle();
		}
		if( this.options.label ){
			if( this.isInput ) {
				this.element.val( this.options.label );
			} else {
				this.element.html( this.options.label );
			}
		}

		if ( this.element.is("a") ) {
			this.element.keyup(function(event) {
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
			.removeClass( "ui-helper-hidden-accessible" + baseClasses + " ui-state-active " + typeClasses )
			.removeAttr( "role" )
			.removeAttr( "aria-pressed" )

		if ( !this.hasTitle ) {
			this.element.removeAttr( "title" );
		}
	},

	_setOption: function( key, value ) {
		if( key === "icon" ) {
			this.element.addClass( " ui-icon " + value )
				.removeClass( this.options.icon );
		}
		if( key === "text" ) {
			this.element.toggleClass( "ui-icon-notext", !( !!value ) )
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
			this.element.prop( "disabled", !!value );
			return;
		}
	},

	refresh: function() {
		//See #8237 & #8828
		var isDisabled = this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions( { "disabled": isDisabled } );
		}

		this._setTitle();
	}

});

}( jQuery ) );
