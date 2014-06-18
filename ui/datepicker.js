/*!
 * jQuery UI Datepicker @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./core",
			"./widget",
			"./calendar",
			"./position"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

var widget,
	calendarOptions = [ "dateFormat", "eachDay", "max", "min", "numberOfMonths", "showWeek" ];

widget = $.widget( "ui.datepicker", {
	version: "@VERSION",
	options: {
		appendTo: null,
		position: {
			my: "left top",
			at: "left bottom"
		},
		show: true,
		hide: true,

		// callbacks
		beforeOpen: null,
		close: null,
		open: null,
		select: null
	},

	_create: function() {
		this.suppressExpandOnFocus = false;

		if ( typeof this.options.max === "string" ) {
			this.options.max = Globalize.parseDate( this.options.max , { pattern: "yyyy-MM-dd" } );
		}
		if ( typeof this.options.min === "string" ) {
			this.options.min = Globalize.parseDate( this.options.min , { pattern: "yyyy-MM-dd" } );
		}

		this._createCalendar();

		this._on( this._inputEvents );
		this._on( this.calendar, this._calendarEvents );
		this._on( this.document, this._documentEvents );
	},

	_getCreateOptions: function() {
		return {
			max: this.element.attr( "max" ),
			min: this.element.attr( "min" )
		};
	},

	_createCalendar: function() {
		var that = this;

		this.calendar = $( "<div>" )
			.addClass( "ui-front ui-datepicker" )
			.appendTo( this._appendTo() );

		// Initialize calendar widget
		this.calendarInstance = this.calendar
			.calendar( $.extend( {}, this.options, {
				value: this._getParsedValue(),
				select: function( event ) {
					that.element.val( that.calendarInstance.value() );
					that.close();
					that._focusTrigger();
					that._trigger( "select", event );
				}
			}) )
			.calendar( "instance" );

		this._setHiddenPicker();

		this.element.attr({
			"aria-haspopup": true,
			"aria-owns": this.calendar.attr( "id" )
		});
	},

	_inputEvents: {
		keydown: function( event ) {
			switch ( event.keyCode ) {
				case $.ui.keyCode.TAB:
					// Waiting for close() will make popup hide too late, which breaks tab key behavior
					this.calendar.hide();
					this.close( event );
					break;
				case $.ui.keyCode.ESCAPE:
					if ( this.isOpen ) {
						this.close( event );
					}
					break;
				case $.ui.keyCode.ENTER:
					this.calendarInstance._handleKeydown( event );
					break;
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.UP:
					clearTimeout( this.closeTimer );
					this._delay( function() {
						this.open( event );
						this.calendarInstance.grid.focus( 1 );
					}, 1 );
					break;
				case $.ui.keyCode.HOME:
					if ( event.ctrlKey ) {
						this.valueAsDate( new Date() );
						event.preventDefault();
						if ( this.isOpen ) {
							this.calendarInstance.refresh();
						} else {
							this.open( event );
						}
					}
					break;
			}
		},
		keyup: function() {
			if ( this.isValid() ) {
				this.valueAsDate( this._getParsedValue() );
			}
		},
		mousedown: function( event ) {
			if ( this.isOpen ) {
				this.suppressExpandOnFocus = true;
				this.close();
				return;
			}
			this.open( event );
			clearTimeout( this.closeTimer );
		},
		focus: function( event ) {
			if ( !this.suppressExpandOnFocus && !this.isOpen ) {
				this._delay( function() {
					this.open( event );
				}, 1);
			}
			this._delay( function() {
				this.suppressExpandOnFocus = false;
			}, 100 );
		},
		blur: function() {
			this.suppressExpandOnFocus = false;
		}
	},

	_calendarEvents: {
		focusout: function( event ) {
			// use a timer to allow click to clear it and letting that
			// handle the closing instead of opening again
			// also allows tabbing inside the calendar without it closing
			this.closeTimer = this._delay( function() {
				this.close( event );
			}, 150 );
		},
		focusin: function() {
			clearTimeout( this.closeTimer );
		},
		mouseup: function() {
			clearTimeout( this.closeTimer );
		},
		// TODO on TAB (or shift TAB), make sure it ends up on something useful in DOM order
		keyup: function( event ) {
			if ( event.keyCode === $.ui.keyCode.ESCAPE && this.calendar.is( ":visible" ) ) {
				this.close( event );
				this._focusTrigger();
			}
		}
	},

	_documentEvents: {
		mousedown: function( event ) {
			if ( !this.isOpen ) {
				return;
			}

			if ( !$( event.target ).closest( this.element.add( this.calendar ) ).length ) {
				this.close( event );
			}
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element || !element[ 0 ] ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_focusTrigger: function() {
		this.suppressExpandOnFocus = true;
		this.element.focus();
	},

	refresh: function() {
		this.calendarInstance.valueAsDate( this._getParsedValue() );
		this.calendarInstance.refresh();
	},

	open: function( event ) {
		if ( this.isOpen ) {
			return;
		}
		if ( this._trigger( "beforeOpen", event ) === false ) {
			return;
		}

		this.calendarInstance.refresh();
		this.calendar
			.attr({
				"aria-hidden": false,
				"aria-expanded": true
			})
			.show()
			.position( this._buildPosition() )
			.hide();
		this._show( this.calendar, this.options.show );

		// take trigger out of tab order to allow shift-tab to skip trigger
		// TODO does this really make sense? related bug: tab-shift moves focus to last element on page
		this.element.attr( "tabindex", -1 );
		this.isOpen = true;

		this._trigger( "open", event );
	},

	close: function( event ) {
		this._setHiddenPicker();
		this._hide( this.calendar, this.options.hide );

		this.element.attr( "tabindex" , 0 );

		this.isOpen = false;
		this._trigger( "close", event );
	},

	_setHiddenPicker: function() {
		this.calendar.attr({
			"aria-hidden": true,
			"aria-expanded": false
		});
	},

	_buildPosition: function() {
		return $.extend( {}, { of: this.element }, this.options.position );
	},

	value: function( value ) {
		if ( arguments.length ) {
			this.valueAsDate( Globalize.parseDate( value , this.options.dateFormat ) );
		} else {
			return ( this._getParsedValue() !== null ) ? this.element.val() : null;
		}
	},

	valueAsDate: function( value ) {
		if ( arguments.length ) {
			if ( this.calendarInstance._isValid( value ) ) {
				this.calendarInstance.valueAsDate( value );
				this.element.val( Globalize.format( value, this.options.dateFormat ) );
			}
		} else {
			return this._getParsedValue();
		}
	},

	isValid: function() {
		return this.calendarInstance._isValid( this._getParsedValue() );
	},

	_destroy: function() {
		this.calendarInstance.destroy();
		this.calendar.remove();
		this.element.removeAttr( "aria-haspopup aria-owns" );
	},

	widget: function() {
		return this.calendar;
	},

	_getParsedValue: function() {
		return Globalize.parseDate( this.element.val() , this.options.dateFormat );
	},

	_setOption: function( key, value ) {
		this._super( key, value );

		if ( $.inArray( key, calendarOptions ) !== -1 ) {
			this.calendarInstance._setOption( key, value );
		}

		if ( key === "appendTo" ) {
			this.calendar.appendTo( this._appendTo() );
		}

		if ( key === "dateFormat" ) {
			this.element.val( this.calendarInstance.value() );
		}

		if ( key === "max" || key === "min" ) {
			this.element.attr( key, Globalize.format( value, { pattern: "yyyy-MM-dd" } ) );
		}

		if ( key === "position" ) {
			this.calendar.position( this._buildPosition() );
		}
	}
});

$.each( calendarOptions, function( index, option ) {
	$.ui.datepicker.prototype.options[ option ] = $.ui.calendar.prototype.options[ option ];
});

return widget;

}));
