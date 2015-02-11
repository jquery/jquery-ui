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

var formResetHandler = function() {
		var form = $( this );

		// Wait for the form reset to actually happen before refreshing
		setTimeout(function() {

			// We find .ui-button first then filter by :ui-button because doing a
			// widget pseudo selectors are very very slow but we need to filter out
			// css only buttons
			form.find( ".ui-button" ).filter( ":ui-button" ).button( "refresh" );
		});
	},
	buttonCount = 0;

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
			"ui-button": "ui-corner-all"
		}
	},

	_getCreateOptions: function() {
		var disabled,
			options =  this._super() || {};

		this.isInput = this.element.is( "input" );

		disabled = this.element[ 0 ].disabled;
		if ( disabled != null ) {
			options.disabled = disabled;
		}

		this.originalLabel = this.isInput ? this.element.val() : this.element.html();
		if ( this.originalLabel ) {
			options.label = this.originalLabel;
		}

		return options;
	},

	_create: function() {
		this.formElement = $( this.element[ 0 ].form );

		// We don't use _on and _off here because we want all the buttons in the same form to use
		// single handler which handles all the button widgets in the form
		this.formElement.off( "reset." + this.widgetFullName, formResetHandler );
		this.formElement.on( "reset." + this.widgetFullName, formResetHandler );
		buttonCount++;

		// We have to check the option again here even though we did in _getCreateOptions
		// because null may have been passed on init which would override what was set in
		// _getCreateOptions
		if ( this.options.disabled == null ) {
			this.options.disabled = this.element[ 0 ].disabled || false;
		}

		this.hasTitle = this.element.attr( "title" );
		this._enhance();

		if ( this.element.is( "a" ) ) {
			this._on({
				"keyup": function( event ) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						event.preventDefault();
						this.element[ 0 ].click();
					}
				}
			});
		}
	},

	_enhance: function() {
		this._setOption( "disabled", this.options.disabled );

		this._addClass( "ui-button", " ui-widget" );
		this.element.attr( "role", "button" );

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
		var prepend =
				( this.options.iconPosition === "top" || this.options.iconPosition === "beginning" ),
			displayBlock =
				( this.options.iconPosition === "top" ||
				this.options.iconPosition === "bottom" );
		if ( !this.icon ) {
			this.icon = $( "<span>" );
			this.iconSpace = $( "<span> </span>" );

			this._addClass( this.icon, "ui-button-icon", " ui-icon" );

			if ( !this.options.showLabel ) {
				this._addClass( "ui-button-icon-only" );
			} else if ( displayBlock ) {
				this._addClass( this.icon, null, "ui-icon-display-block" );
			}
		} else {
			this._removeClass( this.icon, null, this.options.icon );
		}
		this._addClass( this.icon, null, icon );
		this.icon[ prepend ? "prependTo" : "appendTo" ]( this.element );
		if ( !displayBlock ) {
			this.icon[ prepend ? "after" : "before" ]( this.iconSpace );
		}
		return this;
	},

	_destroy: function() {
		this.element.removeAttr( "role" );

		if ( this.icon ) {
			this.icon.remove();
			this.iconSpace.remove();
		}
		if ( !this.hasTitle ) {
			this.element.removeAttr( "title" );
		}
		buttonCount--;
		if ( buttonCount === 0 ) {
			this.formElement.off( "reset." + this.widgetFullName, formResetHandler );
		}
	},

	_setOption: function( key, value ) {
		var iconGroup,
			prepend = ( this.options.iconPosition === "top" || this.options.iconPosition === "beginning" );

		if ( key === "icon" ) {
			if ( value !== null ) {
				this._updateIcon( value );
			} else {
				this.icon.remove();
				this.iconSpace.remove();
				this._removeClass( "ui-button-icon", " ui-icon-" + this.options.iconPosition );
			}
		}

		// Make sure we can't end up with a button that has no text nor icon
		if ( key === "showLabel" ) {
			if ( ( !value && this.options.icon ) || value ) {
				this._toggleClass( this._classes( "ui-button-icon-only" ), null, !value );
				this._updateTooltip();
			} else {
				value = true;
			}
		}
		if ( key === "iconPosition" && this.options.icon ) {
			this._addClass( null, value );
		}
		if ( key === "label" ) {
			if ( this.isInput ) {
				this.element.val( value );
			} else {

				// If there is an icon, append it, else nothing then append the value
				// this avoids removal of the icon when setting label text
				this.element.html( value );
				if ( !!this.icon ) {
					iconGroup = this.icon.add( this.iconSpace );
					this.element[ prepend ? "prepend" : "append" ]( iconGroup );
				}
			}
		}
		this._super( key, value );
		if ( key === "disabled" ) {
			this._toggleClass( null, "ui-state-disabled", value );
			this.element.element[ 0 ].disabled = value;
			if ( value ) {
				this.element.blur();
			}
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
				this._super( "showLabel", value );
				return;
			}
			if ( key === "showLabel" ) {
				this.options.text = value;
			}
			if ( key === "icon" ) {
				this.options.icons.primary = value;
			}
			if ( key === "icons" ) {
				if ( value.primary ) {
					this._super( "icon", value.primary );
					this._super( "iconPosition", "beginning" );
				} else if ( value.secondary ) {
					this._super( "icon", value.secondary );
					this._super( "iconPosition", "end" );
				}
			}
			this._superApply( arguments );
		}
	});
	$.fn.button = (function( orig ) {
		return function() {
			if ( this.length && this[ 0 ].tagName === "INPUT" &&
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
