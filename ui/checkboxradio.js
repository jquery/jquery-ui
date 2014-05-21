/*!
 * jQuery UI Checkboxradio @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/checkboxradio/
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
	typeClasses = " ui-icon ui-icon-background ui-state-focus ui-icon-check ui-icon-blank" +
		"ui-radio-label ui-checkbox-label ui-radio-checked ui-checkbox-checked",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ".ui-checkboxradio" ).checkboxradio( "refresh" );
		});
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			name = name.replace( /'/g, "\\'" );
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "']" );
			} else {
				radios = $( "[name='" + name + "']", radio.ownerDocument )
				.filter(function() {
					return !this.form;
				});
			}
		}
		return radios;
	};

$.widget( "ui.checkboxradio", {
	version: "@VERSION",
	defaultElement: "<input type='checkbox'>",
	options: {
		disabled: null,
		label: null,
		icon: false
	},

	_getCreateOptions: function() {
		var options = {};

		this.originalLabel = this.isInput ? this.element.val() : this.element.html();

		this._isDisabled( options );

		if ( this.originalLabel ) {
			options.label = this.originalLabel;
		}

		return options;
	},

	_isDisabled: function( options ) {
		var isDisabled = this.element.prop( "disabled" );

		if ( isDisabled !== undefined ) {
			options.disabled = isDisabled;
		} else {
			options.disabled = false;
		}
	},

	_create: function() {
		var formElement = $( this.element[ 0 ].form );

		// We don't use _on and _off here because we want all the checkboxes in the same form to use
		// single handler which handles all the checkboxradio widgets in the form
		formElement.off( "reset" + this.eventNamespace, formResetHandler );
		formElement.on( "reset" + this.eventNamespace, formResetHandler );

		// If the option is a boolean its been set by either user or by
		// _getCreateOptions so we need to make sure the prop matches
		// If it is not a boolean the user set it explicitly to null so we need to check the dom
		if ( typeof this.options.disabled === "boolean" ) {
			this.element.prop( "disabled", this.options.disabled );
		} else {
			this._isDisabled( this.options );
		}

		// If the option is true we call set options to add the disabled
		// classes and ensure the element is not focused
		if ( this.options.disabled === true ){
			this._setOption( "disabled", true );
		}

		this._readType();

		this._readLabel();

		this._enhance();

		this._on({
			"change": "_toggleClasses",
			"focus": function() {
				this.label.addClass( "ui-state-focus" );
			},
			"blur": function() {
				this.label.removeClass( "ui-state-focus" );
			}
		});
	},

	_readType: function() {
		this.type = this.element[ 0 ].type;
		if ( !/radio|checkbox/.test( this.type ) ) {
			throw new Error( "Can't create checkboxradio widget for type " + this.type );
		}
	},

	_readLabel: function() {
		var ancestor, labelSelector;

		// Check control.labels first
		if ( this.element[ 0 ].labels !== undefined && this.element[ 0 ].labels.length > 0 ){
			this.label = $( this.element[ 0 ].labels[ 0 ] );
		} else {

			// We don't search against the document in case the element
			// is disconnected from the DOM
			ancestor = this.element.parents().last();

			// Look for the label based on the id
			labelSelector = "label[for='" + this.element.attr("id") + "']";
			this.label = ancestor.find( labelSelector );
			if ( !this.label.length ) {

				// The label was not found make sure ancestors exist if they do check their siblings
				// if they dont check the elements siblings
				ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();

				// Check if any of the new set of ancestors is the label
				this.label = ancestor.filter( labelSelector );
				if ( !this.label.length ) {

					// Still not found look inside the ancestors for the label
					this.label = ancestor.find( labelSelector );
				}
			}
		}
	},

	_enhance: function() {
		this.element.addClass( "ui-helper-hidden-accessible ui-checkboxradio" );

		this.label.addClass( baseClasses + " ui-" + this.type + "-label" );

		if ( this.options.icon ) {
			var toAdd = "ui-icon ui-icon-background ui-corner-all ";

			this.label.addClass( "ui-icon-beginning" );
			this.icon = $( "<span>" );

			if ( this.element.is( ":checked" ) && this.type === "checkbox" ) {
				toAdd += "ui-icon-check";
			} else {
				toAdd += "ui-icon-blank";
			}
			this.icon.addClass( toAdd );
			this.label.prepend( this.icon );
		}
		if ( this.element.is( ":checked" ) ){
			this.label.addClass( "ui-" + this.type + "-checked ui-state-active" );
		}
		if ( this.options.label ){
			this.label.html( this.icon ).append( this.options.label );
		}
	},

	widget: function() {
		return this.label;
	},

	_toggleClasses: function() {
		var checked = this.element.is( ":checked" );
		this.label.toggleClass( "ui-" + this.type + "-checked ui-state-active", checked );
		if ( this.options.icon && this.type === "checkbox" ) {
			this.icon.toggleClass( "ui-icon-check ui-icon-blank", checked );
		}
		if ( this.type === "radio" ) {
			if ( this.options.disabled ) {

				// Make sure we don't update the rest of the radio group if disabled
				return false;
			}
			radioGroup( this.element[0] )
				.not( this.element )
				.map(function() {
						return $( this ).checkboxradio( "widget" )[ 0 ];
				})
				.removeClass( "ui-state-active ui-radio-checked" );
		}
	},

	_destroy: function() {
		this.label.removeClass( baseClasses + " " + typeClasses );
		if ( this.icon !== undefined ) {
			this.icon.remove();
		}
		this.element.removeClass( "ui-checkboxradio ui-helper-hidden-accessible" );
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "disabled" ) {
			this.label.toggleClass( "ui-state-disabled", !!value );
			this.element.prop( "disabled", !!value );
			return;
		}
		this.refresh();
	},

	_setClasses: function() {
		var checked = this.element.is( ":checked" );
		if ( this.options.icon ){
			this.label.addClass( "ui-icon-beginning" );
			if ( this.icon === undefined ) {
				this.icon = $( "<span>" );
				this.label.prepend( this.icon );
			}
			this.icon.addClass( "ui-icon ui-icon-background ui-corner-all" +
				 ( this.type === "checkbox" && checked ) ? " ui-icon-blank" : " ui-icon-check" );

		} else if ( this.icon !== undefined ) {
			this.label.removeClass( "ui-icon-beginning" );
			this.icon.remove();
			delete this.icon;
		}
		this.label.toggleClass( "ui-state-active ui-" + this.type + "-checked", checked );
		if ( this.options.label !== null ) {
			this.label.html( !!this.icon ? "" : this.icon ).append( this.options.label );
		}
	},

	refresh: function() {
		this._setClasses();

		// Make sure to only check disabled if its an element that supports this otherwise
		// check for the disabled class to determine state
		var isDisabled = this.element.is( ":disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions({ "disabled": isDisabled });
		}
	}

});

return $.ui.checkboxradio;

}));
