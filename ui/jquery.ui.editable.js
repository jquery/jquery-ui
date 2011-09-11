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
 */
(function( $, undefined ) {

var uiEditableClasses = 'ui-editable-content ui-widget ui-widget-content ui-corner-all',
    buttonClass = 'ui-editable-button',
    cancelClass = 'ui-editable-cancel',
    inputClass = 'ui-editable-input',
	placeholderClass = 'ui-editable-placeholder',
	saveClass = 'ui-editable-save',
    cancelIconClass = 'ui-icon ui-icon-cancel',
    saveIconClass = 'ui-icon ui-icon-disk',
    defaultStateClass = 'ui-state-default',
	highlightStateClass = 'ui-state-highlight',
    hoverStateClass = 'ui-state-hover';

$.widget( "ui.editable", {
    version: "@VERSION",
	widgetEventPrefix: "edit",

	options: {
	    value: '',
	    saveButton: 'Save',
		cancelButton: 'Cancel',
		placeholder: 'Click to edit'
	},

	_init: function() {
        if (!this.value($.trim(this.element.text()) || this.options.value)) {
            this._show();
		}
		this._delegate();
	},

	_delegate: function() {
        var self = this;

		this.element
			.bind('click', function(event) {
				var $this = $(event.target);
	            
				if ($this.hasClass(saveClass) || $this.parent().hasClass(saveClass)) {
					self._save(event, self.element.find('.' + inputClass).val());
					return;
	            }

				if ($this.hasClass(cancelClass) || $this.parent().hasClass(cancelClass)) {
					self._cancel(event);
					return;
	            }
								
				if ($this.hasClass('ui-editable') || $this.hasClass(placeholderClass)) {
					self._edit();
					return;
	            }
	        })
			.bind('mouseover', function(event) {
				var $this = $(event.target);
				
				self.element.removeClass(highlightStateClass);
				self.element.find('.' + buttonClass).removeClass(hoverStateClass);
				
				if ($this.hasClass(saveClass) || $this.parent().hasClass(saveClass)) {
					self.element.find('.' + saveClass).addClass(hoverStateClass);
					return;
	            }
				
				if ($this.hasClass('ui-editable') || $this.hasClass(placeholderClass)) {
					self.element.addClass(highlightStateClass);
					return;
	            }
			})
			.bind('mouseout', function(event) {
				var $this = $(event.target);
				
				if ($this.hasClass(saveClass) || $this.parent().hasClass(saveClass)) {
					self.element.find('.' + saveClass).removeClass(hoverStateClass);
					return;
	            }
				
				if ($this.hasClass('ui-editable') || $this.hasClass(placeholderClass)) {
					self.element.removeClass(highlightStateClass);
					return;
	            }
			})
			.addClass( 'ui-editable' );
	},

    _show: function() {
        this.element.html( this.value() || this._placeholder() );
    },

	_edit: function() {
        this.element
			.html( this._form() );
		this._formDelegate();
	},

	_placeholder: function() {
        return $( "<span></span>" )
            .addClass( placeholderClass )
            .html(this.options.placeholder);
    },

	_form: function() {
		return $( "<form></form>" )
            .addClass( uiEditableClasses )
            .append( $( "<input/>" )
                .attr( "type", "text" )
                .attr( "value", this.value() )
                .addClass( inputClass ))
            .append( this._saveButton() )
            .append( this._cancelButton() );
	},

    _saveButton: function() {
        return $( "<a></a>" )
            .attr( "href", "#" )
            .attr( "title", this.options.saveButton )
            .addClass( saveClass + " " + buttonClass + " " + defaultStateClass )
            .append( $("<span></span>")
                .addClass( saveIconClass )
                .html( this.options.saveButton ));
    },

    _cancelButton: function() {
        return $( "<a></a>" )
            .attr( "href", "#" )
            .attr( "title", this.options.cancelButton )
            .addClass( cancelClass + " " + buttonClass + " " + defaultStateClass )
            .append( $("<span></span>")
                .addClass( cancelIconClass )
                .html( this.options.cancelButton ));
    },

    _formDelegate: function() {
		var self = this;
		this.element.find('form')
			.submit(function(event) {
				self._save(event, $('input', this).val());
				$('input', this).blur();
				return false;
			});
        this.element.find('input')
            .bind('blur', function() {
                if (self.timer) {
                    window.clearTimeout(self.timer);
                }
                self.timer = window.setTimeout(function() {
                    self._show.call(self);
                    self.element.removeClass(highlightStateClass);
                }, 200);
            })
            .focus();
	},

	_save: function(event, newValue) {
        var hash = {
            value: newValue
        };
        
        if (this._trigger('save', event, hash) !== false) {
            this.value(newValue);
        }
	},

	_cancel: function(event) {
		this._trigger('cancel', event);
	},
	
	value: function(newValue) {
		if (arguments.length) {
			this.options.value = $(newValue).hasClass(placeholderClass) ? '' : newValue;
		}
		return this.options.value;
	}
});

})(jQuery);
