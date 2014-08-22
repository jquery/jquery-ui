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
		" ui-button-text-only ui-icon-beginning ui-icon-end ui-icon-top ui-icon-bottom",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ".ui-button" ).filter( ":ui-button" ).button( "refresh" );
		});
	};

$.widget( "ui.button", {
	version: "@VERSION",
	defaultElement: "<button>",
	options: {
		disabled: null,
		showLabel: true,
		label: null,
		icon: null,
		iconPosition: "beginning"
	},

	_getCreateOptions: function() {
		var disabled,
			options = {};

		this.isInput = this.element.is( "input" );
		this.originalLabel = this.isInput ? this.element.val() : this.element.html();

		disabled = this.element.prop( "disabled" );
		if ( disabled != null ) {
			options.disabled = disabled;
		}

		if ( this.originalLabel ) {
			options.label = this.originalLabel;
		}

		return options;
	},

	_create: function() {
		var formElement = $( this.element[ 0 ].form );

		// We don't use _on and _off here because we want all the checkboxes in the same form to use
		// single handler which handles all the checkboxradio widgets in the form
		formElement.off( "reset" + this.eventNamespace, formResetHandler );
		formElement.on( "reset" + this.eventNamespace, formResetHandler );

		if ( this.options.disabled == null ) {
			this.options.disabled = this.element.prop( "disabled" ) || false;
		}

		this._enhance();

		if ( this.element.is( "a" ) ) {
			this._on({
				"keyup": function( event ) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						this.element[0].click();
					}
				}
			});
		}
	},

	_enhance: function() {
		this._setOption( "disabled", this.options.disabled );

		this.element.addClass( baseClasses ).attr( "role", "button" );

		// Check to see if the label needs to be set or if its already correct
		if ( this.options.label && this.options.label !== this.originalLabel ) {
			if ( this.isInput ) {
				this.element.val( this.options.label );
			} else {
				this.element.html( this.options.label );
			}
		}
		if ( this.options.icon ) {
			this._updateIcon( this.options.icon )._updateTooltip();
		}
	},

	_updateTooltip: function() {
		this.title = this.element.attr( "title" );
		this.noTitle = !this.title;

		if ( !this.options.showLabel && !this.noTitle ){
			this.element.attr( "title", this.options.label );
		}
	},

	_updateIcon: function( icon ) {
		if ( !this.icon ) {
			this.icon = $( "<span>" ).addClass( "ui-icon" );
			this.element.addClass(  "ui-icon-" + this.options.iconPosition );

			if ( !this.options.showLabel ){
				this.element.addClass( "ui-button-icon-only" );
			}
		} else {
			this.icon.removeClass( this.options.icon );
		}

		this.icon.addClass( icon ).appendTo( this.element );
		return this;
	},

	_destroy: function() {
		this.element
			.removeClass( baseClasses + " ui-state-active " + typeClasses )
			.removeAttr( "role" );

		if ( this.icon ) {
			this.icon.remove();
		}
		if ( !this.hasTitle ) {
			this.element.removeAttr( "title" );
		}
	},

	_setOption: function( key, value ) {
		if ( key === "icon" ) {
			if ( value !== null ) {
				this._updateIcon( value );
			} else {
				this.icon.remove();
				this.element.removeClass( "ui-icon-" + this.options.iconPosition );
			}
		}

		// Make sure we cant end up with a button that has no text nor icon
		if ( key === "showLabel" ) {
			if ( ( !value && !this.options.icon ) || value ) {
				this.element.toggleClass( "ui-button-icon-only", !value )
					.toggleClass( this.options.iconPosition, !!value );
				this._updateTooltip();
			} else {
				value = true;
			}
		}
		if ( key === "iconPosition" && this.options.icon ) {
			this.element.addClass( value ).removeClass( this.options.iconPosition );
		}
		if ( key === "label" ) {
			if ( this.isInput ) {
				this.element.val( value );
			} else {
				// If there us an icon append it else nothing then append the value
				// this avoids removal of the icon when setting label text
				this.element.html( !!this.icon ? "" : this.icon ).append( value );
			}
		}
		this._super( key, value );
		if ( key === "disabled" ) {
			this.element.toggleClass( "ui-state-disabled", value ).prop( "disabled", value ).blur();
		}
	},

	refresh: function() {

		// Make sure to only check disabled if its an element that supports this otherwise
		// check for the disabled class to determine state
		var isDisabled = this.element.is( "input, button" ) ?
			this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions({ "disabled": isDisabled });
		}

		this._updateTooltip();
	}

});

return $.ui.button;

}));
