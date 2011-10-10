/*
 * jQuery UI Editable @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Editable (to be created)
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.button.js
 */
(function( $, undefined ) {

var editableClass = "ui-editable",
	formClass = "ui-editable-form",
	buttonClass = "ui-editable-button",
	cancelClass = "ui-editable-cancel",
	inputClass = "ui-editable-input",
	placeholderClass = "ui-editable-placeholder",
	saveClass = "ui-editable-save",
	hoverableClass = "ui-widget-content ui-state-default ui-corner-all",

	cancelIconClass = "ui-icon-cancel",
	saveIconClass = "ui-icon-disk",

	activeStateClass = "ui-state-active",
	highlightStateClass = "ui-state-highlight"

$.widget( "ui.editable", {
	version: "@VERSION",
	widgetEventPrefix: "edit",

	options: {
		value: null,
		editor: "text",
		buttons: "outside",
		save: {
			type: "button",
			text: "Save"
		},
		cancel: {
			type: "button",
			text: "Cancel"
		},
		placeholder: "Click to edit"
	},

	start: function() {
		if ( !this._editing ) {
			this._edit();
		}
	},

	submit: function() {
		$( "form", this.element ).submit();
	},

	cancel: function() {
		this._cancel();
	},

	_create: function() {
		if ( this.value( this.options.value ) || !this.value( $.trim( this.element.text() ) ) ) {
			this._show();
		}
		this._bind( this._events );
		this.element.addClass( editableClass );
	},

	_events: {
		click: function( event ) {
			var $this = $( event.target );
			
			if ( !this._editing ) {
				this.element.removeClass( highlightStateClass );
				this._edit();
				return;
			}

			else if ( $this.hasClass( saveClass ) || $this.parent().hasClass( saveClass ) ) {
				this.submit();
				return;
			}

			else if ( $this.hasClass( cancelClass ) || $this.parent().hasClass( cancelClass ) ) {
				this._cancel( event );
				return false;
			}
		},
		mouseenter: function( event ) {
			if ( !this._editing ) {
				this.element.addClass( highlightStateClass );
			}
		},
		mouseleave: function( event ) {
			this.element.removeClass( highlightStateClass );
		}
	},

	_show: function() {
		this._editing = undefined;
		this.element.html( this.value() || this._placeholder() );
	},

	_edit: function() {
		this._editing = true;
		this.element.html( this._form() );
		this._formEvents();
	},

	_placeholder: function() {
		return $( "<span></span>" )
			.addClass( placeholderClass )
			.html( this.options.placeholder );
	},

	_form: function() {
		var editor = $.ui.editable.editors[ this.options.editor ],
			form = $( "<form></form>" )
			.addClass( formClass )
			.append( $( "<span></span>" )
				.append( editor.element( this )));
		if ( this.options.buttons == "inside" ) {
			this.frame = form;
		}
		else {
			this.frame = $( "> span" , form );
		}
		this._hoverable( this.frame.addClass( hoverableClass ) );
		if( this.options.buttons && this.options.save ) {
			form.append( this._saveButton() );
		}
		if( this.options.buttons && this.options.cancel ) {
			form.append( this._cancelButton() );
		}
		return form;
	},

	_saveButton: function() {
		return $.ui.editable.saveButtons[ this.options.save.type ]( this ).addClass( saveClass );
	},

	_cancelButton: function() {
		return $.ui.editable.cancelButtons[ this.options.cancel.type ]( this ).addClass( cancelClass );
	},

	_formEvents: function() {
		var self = this,
			editor = $.ui.editable.editors[ self.options.editor ];
		$( "form", this.element )
			.submit( function( event ) {
				self._save.call( self, event, editor.value( self, this ) );
				return false;
			});
		editor.bind( this );
	},

	_save: function( event, newValue ) {
		var hash = {
			value: newValue
		};

		if ( this._trigger( "submit", event, hash ) !== false && this.value() !== newValue && this._trigger( "change", event, hash ) !== false ) {
			this.value( newValue );
			this._show();
		}
	},

	_cancel: function( event ) {
		this._show();
		this._trigger( "cancel", event );
	},

	value: function( newValue ) {
		if ( arguments.length ) {
			this._value = newValue;
		}
		return this._value;
	}
});

$.ui.editable.saveButtons = {
	button: function( editable ) {
		return $( "<button></button>" )
			.html( editable.options.save.text )
			.button({
				icons: {
					primary: saveIconClass
				},
				text: false
			});
	},
	submit: function( editable ) {
		return $( "<input/>" )
			.attr( "type", "submit" )
			.val( editable.options.save.text )
			.button();
	}
};

$.ui.editable.cancelButtons = {
	button: function( editable ) {
		return $( "<button></button>" )
			.html( editable.options.cancel.text )
			.button({
				icons: {
					primary: cancelIconClass
				},
				text: false
			});
	},
	link: function( editable ) {
		return $( "<a></a>" )
			.attr( "href", "#" )
			.attr( "title", editable.options.cancel.text )
			.append( $( "<span></span>" )
				.addClass( cancelIconClass )
				.html( editable.options.cancel.text ));
	}
};

$.ui.editable.editors = {
	text: {
		element:function( editable ) {
			return $( "<input/>" )
				.attr( "type", "text" )
				.val( editable.value() )
				.addClass( inputClass );
		},
		bind: function( editable ) {
			var self = editable;
			$( "input", editable.element )
				.focus( function() {
					self.frame.addClass( activeStateClass );
				})
				.blur( function() {
					self.frame.removeClass( activeStateClass );
				})
				.bind( "keydown", function( event ) {
					var keyCode = $.ui.keyCode;
					switch ( event.keyCode ) {
					case keyCode.ESCAPE:
						self._cancel.call( self );
						return true;
					}
				})
				.focus();
		},
		value: function( editable, form ) {
			return $( "input", form ).val();
		}
	},
	textarea: $.noop,
	select: $.noop,
	spinner: $.noop 
};

})( jQuery );
