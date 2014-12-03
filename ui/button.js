/*!
 * jQuery UI Button @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Button
//>>group: Widgets
//>>description: Enhances a form with themeable buttons.
//>>docs: http://api.jqueryui.com/button/
//>>demos: http://jqueryui.com/button/

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

var typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons" +
		" ui-button-text-only ui-icon-beginning ui-icon-end ui-icon-top ui-icon-bottom",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ".ui-button" ).filter( ":ui-button" ).button( "refresh" );
		});
	};

$.widget( "ui.button", {
	version: "@VERSION",
	classes: {},
	defaultElement: "<button>",
	options: {
		disabled: null,
		showLabel: true,
		label: null,
		icon: null,
		iconPosition: "beginning",
		classes: {
			"ui-button": "ui-corner-all",
			"ui-button-icon-only": "",
			"ui-button-icon": ""
		}
	},

	_getCreateOptions: function() {
		var disabled,
			options =  this._super() || {};

		this.isInput = this.element.is( "input" );
		this.originalLabel = this.isInput ? this.element.val() : this.element.html();

		disabled = this.element[ 0 ].disabled;
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
			this.options.disabled = this.element[ 0 ].disabled || false;
		}

		this.hasTitle = this.element.attr( "title" );
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

		this.element
			.addClass( this._classes( "ui-button" ) + " ui-widget" )
			.attr( "role", "button" );

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

		if ( !this.options.showLabel && !this.title ) {
			this.element.attr( "title", this.options.label );
		}
	},

	_updateIcon: function( icon ) {
		if ( !this.icon ) {
			this.icon = $( "<span>" ).addClass( this._classes( "ui-button-icon" ) + " ui-icon" );

			if ( !this.options.showLabel ) {
				this.element.addClass( this._classes( "ui-button-icon-only" ) );
			} else {
				this.element.addClass( "ui-icon-" + this.options.iconPosition );
			}
		} else {
			this.icon.removeClass( this.options.icon );
		}

		this.icon.addClass( icon ).appendTo( this.element );
		return this;
	},

	_destroy: function() {
		this.element
			.removeClass( this._classes( "ui-button ui-button-icon-only" ) + " ui-widget" +
				" ui-state-active " + typeClasses )
			.removeAttr( "role" );

		if ( this.icon ) {
			this.icon.remove();
		}
		if ( !this.hasTitle ) {
			this.element.removeAttr( "title" );
		}
	},

	_elementsFromClassKey: function( classKey ) {
		switch ( classKey ) {
			case "ui-button-icon-only":
				if ( this.options.showLabel ) {
					return $();
				}
				break;
			case "ui-button-icon":
				if ( this.icon ) {
					return this.icon;
				}
				return $();
			default:
				return this._superApply( arguments );
		}
	},

	_setOption: function( key, value ) {
		if ( key === "icon" ) {
			if ( value !== null ) {
				this._updateIcon( value );
			} else {
				this.icon.remove();
				this.element.removeClass( this._classes( "ui-button-icon" ) + " ui-icon-" +
					this.options.iconPosition );
			}
		}

		// Make sure we can't end up with a button that has no text nor icon
		if ( key === "showLabel" ) {
			if ( ( !value && this.options.icon ) || value ) {
				this.element.toggleClass( this._classes( "ui-button-icon-only" ), !value )
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
			this.element.toggleClass( "ui-state-disabled", value )[ 0 ].disabled = value;
			this.element.blur();
		}
	},

	refresh: function() {

		// Make sure to only check disabled if its an element that supports this otherwise
		// check for the disabled class to determine state
		var isDisabled = this.element.is( "input, button" ) ?
			this.element[ 0 ].disabled : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions({ "disabled": isDisabled });
		}

		this._updateTooltip();
	}
});

// DEPRECATED
if ( $.uiBackCompat !== false ) {

	// Text and Icons options
	$.widget( "ui.button", $.ui.button, {
		options: {
			text: true,
			icons: {
				primary: null,
				secondary: null
			}
		},

		_create: function() {
			if ( this.options.showLabel && !this.options.text ) {
				this.options.showLabel = this.options.text;
			}
			if ( !this.options.showLabel && this.options.text ) {
				this.options.text = this.options.showLabel;
			}
			if ( !this.options.icon && ( this.options.icons.primary ||
					this.options.icons.secondary ) ) {
				if ( this.options.icons.primary ) {
					this.options.icon = this.options.icons.primary;
				} else {
					this.options.icon = this.options.icons.secondary;
					this.options.iconPosition = "end";
				}
			}
			if ( this.options.icon ) {
				this.options.icons.primary = this.options.icon;
			}
			this._super();
		},

		_setOption: function( key, value ) {
			if ( key === "text" ) {
				this._setOption( "showLabel", value );
			}
			if ( key === "showLabel" ) {
				this.options.text = value;
			}
			if ( key === "icon" ) {
				this.options.icons.primary = value;
			}
			if ( key === "icons" ) {
				this._setOption( "icon", value );
				if ( value.primary ) {
					this._setOption( "icon", value.primary );
					this._setOption( "iconPosition", "beginning" );
				} else if ( value.secondary ) {
					this._setOption( "icon", value.secondary );
					this._setOption( "iconPosition", "end" );
				}
			}
			this._superApply( arguments );
		}
	});
	$.fn.button = (function( orig ) {
		return function() {
			if ( this.length > 0 && this[ 0 ].tagName === "INPUT" &&
					( this.attr( "type") === "checkbox" || this.attr( "type" ) === "radio" ) ) {
				if ( $.ui.checkboxradio ) {
					if ( arguments.length === 0 ) {
						return this.checkboxradio({
							"icon": false
						});
					} else {
						return this.checkboxradio.apply( this, arguments );
					}
				} else {
					$.error( "Checkboxradio widget missing" );
				}
			} else {
				return orig.apply( this, arguments );
			}
		};
	})( $.fn.button );
	$.fn.buttonset = function() {
		if ( $.ui.controlgroup ) {
			if ( arguments[ 0 ] === "option" && arguments[ 1 ] === "items" && arguments[ 2 ] ) {
				return this.controlgroup.apply( this,
					[ arguments[ 0 ], "items.button", arguments[ 2 ] ] );
			} else if ( typeof arguments[ 0 ] === "object" && arguments[ 0 ].items ) {
				arguments[ 0 ].items = {
					button: arguments[ 0 ].items
				};
			} else if ( arguments[ 0 ] === "option" && arguments[ 1 ] === "items" ) {
				return this.controlgroup.apply( this, [ arguments[ 0 ], "items.button" ] );
			}
			return this.controlgroup.apply( this, arguments );
		} else {
			$.error( "Controlgroup widget missing" );
		}
	};
}

return $.ui.button;

}));
