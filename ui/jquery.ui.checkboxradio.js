/*!
 * jQuery UI Checkboxradion @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/checkboxradio/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var baseClasses = "ui-button ui-widget ui-corner-all",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ":ui-checkboxradio" ).checkboxradio( "refresh" );
		}, 1 );
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
	defaultElement: "<input>",
	options: {
		disabled: null,
		label: null,
		icon: null
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

		return options;
	},

	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset" + "." + this.widgetName )
			.bind( "reset" + "."+ this.widgetName, formResetHandler );
		if ( typeof this.options.disabled === "boolean" ) {
			this.element.prop( "disabled", this.options.disabled );
		}

		this._getType();

		this._getLabel();

		this.element.addClass( "ui-helper-hidden-accessible ui-checkboxradio" );

		this.label.addClass( baseClasses + " ui-" + this.type + "-label" );

		if( this.options.icon ) {
			if( this.label.is( ":checked" ) && this.type === "checkbox" ){
				this.label.addClass( "ui-icon ui-icon-check" );
			} else {
				this.label.addClass( "ui-icon ui-icon-blank" );
			}
		}
		if( this.element.is( ":checked" ) ){
			this.label.addClass( "ui-" + this.type + "-checked" );
		}
		if( this.options.label ){
			this.label.html( this.options.label );
		}

		this._on({
			"change" : "_toggleClasses",
			"focus": "_handleFocus",
			"blur": "_handleBlur"
		});
	},

	widget: function() {
		return this.label;
	},

	_getType: function() {
		if ( this.element.is("[type=checkbox]") ) {
			this.type = "checkbox";
		} else if ( this.element.is("[type=radio]") ) {
			this.type = "radio";
		}
	},

	_getLabel: function() {
		if( this.element[0].labels ){
			this.label = $( this.element[0].labels[0] );
			return;
		}

		var label,
			id = this.element.attr( "id" );

		label = this.element.closest( "form" ).find( "label[for='" + id + "']" );

		if( label.length === 0 ){
			label = this.element.closest( "label" );
		}

		this.label = label;
	},

	_toggleClasses: function() {
		this.label.toggleClass( "ui-" + this.type + "-checked ui-state-active" );
		if( this.options.icon && this.type === "checkbox" ) {
			this.label.toggleClass( "ui-icon-check ui-icon-blank" );
		}
		if( this.type === "radio" ) {
			if ( this.options.disabled ) {
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

	_handleBlur: function() {
		this.label.removeClass( "ui-state-focus" );
	},

	_handleFocus: function() {
		this.label.addClass( "ui-state-focus" );
	},

	_destroy: function() {
		this.label.removeClass( "ui-button ui-corner-all ui-icon ui-state-focus ui-icon-check " +
			"ui-icon-blank ui-radio-label ui-checkboxlabel ui-radio-checked ui-checkbox-checked" );
		this.element.removeClass( "ui-helper-hidden-accessible" );
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "disabled" ) {

			this.label.toggleClass( " ui-state-disabled", !!value );
			this.element.prop( "disabled", !!value );
			return;
		}
		this.refresh();
	},

	_setClasses: function() {
		var checked = this.element.is( ":checked" );
		if( this.options.icon === true ){
			if( this.type === "checkbox" && checked ) {
				this.label.addClass( "ui-icon ui-icon-check" );
			} else {
				this.label.addClass( "ui-icon ui-icon-blank" );
			}
		} else {
			this.label.removeClass( "ui-icon ui-icon-blank ui-icon-check" );
		}
		if( checked ) {
			this.label.addClass( "ui-state-active ui-" + this.type + "-checked" );
		} else {
			this.label.removeClass( "ui-state-active ui-" + this.type + "-checked" );
		}
		if( this.options.label !== null ) {
			this.label.contents().not( this.label.children() )[0].nodeValue = this.options.label;
		}
	},

	refresh: function() {

		this._setClasses();
		//See #8237 & #8828
		var isDisabled = this.element.hasClass( "ui-checkboxradio-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions( { "disabled": isDisabled } );
		}
	}

});

}( jQuery ) );
