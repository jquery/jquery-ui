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
		" ui-radio-label ui-checkbox-label ui-state-active ui-icon-beginning ui-icon-end" +
		" ui-icon-top ui-icon-bottom ui-radio-checked ui-checkbox-checked",
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

		this._readLabel();

		this.originalLabel = this.label.html();

		this._readDisabled( options );

		if ( this.originalLabel ) {
			options.label = this.originalLabel;
		}

		return options;
	},

	_readDisabled: function( options ) {
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
			this._readDisabled( this.options );
		}

		// If the option is true we call set options to add the disabled
		// classes and ensure the element is not focused
		if ( this.options.disabled === true ){
			this._setOption( "disabled", true );
		}

		this._readType();

		this._enhance();

		this._on({
			"change": "_toggleClasses",
			"focus": function() {
				this.label.addClass( "ui-state-focus ui-visual-focus" );
			},
			"blur": function() {
				this.label.removeClass( "ui-state-focus ui-visual-focus" );
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
		var ancestor, labelSelector,
			labels = this.element[ 0 ].labels;

		// Check control.labels first
		if ( labels !== undefined && labels.length > 0 ) {
			this.label = $( labels[ 0 ] );
		} else {

			// We don't search against the document in case the element
			// is disconnected from the DOM
			ancestor = this.element.parents().last();

			// Look for the label based on the id
			labelSelector = "label[for='" + this.element.attr( "id" ) + "']";
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
		var checked = this.element.is( ":checked" );

		this._updateIcon( checked );
		this.element.addClass( "ui-helper-hidden-accessible ui-checkboxradio" );

		this.label.addClass( baseClasses + " ui-" + this.type + "-label" );

		if ( checked ) {
			this.label.addClass( "ui-" + this.type + "-checked ui-state-active" );
		}
		if ( this.options.label && this.options.label !== this.originalLabel ) {
			this.label.html( this.icon ? this.icon : "" ).append( this.options.label );
		} else if ( this.originalLabel ) {
			this.options.label = this.originalLabel;
		}
	},

	widget: function() {
		return this.label;
	},

	_toggleClasses: function() {
		var checked = this.element.is( ":checked" );
		this.label.toggleClass( "ui-" + this.type + "-checked ui-state-active", checked );
		if ( this.options.icon && this.type === "checkbox" ) {
			this.icon
				.toggleClass( "ui-icon-check", checked )
				.toggleClass( "ui-icon-blank", !checked );
		}
		if ( this.type === "radio" ) {
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
		if ( this.icon ) {
			this.icon.remove();
		}
		this.element.removeClass( "ui-checkboxradio ui-helper-hidden-accessible" );
	},

	_setOption: function( key, value ) {
		var original;
		if ( key === "label" && value === null ) {
			original = this.options[ key ];
		}
		this._super( key, value );
		if ( key === "disabled" ) {
			this.label.toggleClass( "ui-state-disabled", !!value );
			this.element.prop( "disabled", !!value );
			return;
		}
		if ( key === "label" && value === null ) {
			this.options[ key ] = original;
		}
		this.refresh();
	},

	_updateIcon: function( checked ) {
		var toAdd = "ui-icon ui-icon-background ui-corner-all ";

		if ( this.options.icon ) {
			this.label.addClass( "ui-icon-beginning" );
			if ( !this.icon ){
				this.icon = $( "<span>" );
			}

			if ( this.type === "checkbox" ) {
				toAdd += checked ? "ui-icon-check" : "ui-icon-blank";
			}
			this.icon.addClass( toAdd ).appendTo( this.label );
		} else if ( this.icon !== undefined ) {
			this.label.removeClass( "ui-icon-beginning" );
			this.icon.remove();
			delete this.icon;
		}
	},

	refresh: function() {
		var checked = this.element.is( ":checked" ),
			isDisabled = this.element.is( ":disabled" );
		this._updateIcon( checked );
		this.label.toggleClass( "ui-state-active ui-" + this.type + "-checked", checked );
		if ( this.options.label !== null ) {
			this.label.html( !!this.icon ? this.icon : "" ).append( this.options.label );
		}

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions({ "disabled": isDisabled });
		}
	}

});

return $.ui.checkboxradio;

}));
