/*!
 * jQuery UI Datepicker @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Datepicker
//>>group: Widgets
//>>description: Displays a calendar for input-based date selection.
//>>docs: http://api.jqueryui.com/datepicker/
//>>demos: http://jqueryui.com/datepicker/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/calendar.css
//>>css.structure: ../../themes/base/datepicker.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"globalize",
			"globalize/date",
			"./calendar",
			"../widget",
			"../position",
			"../version",
			"../keycode"
		], factory );
	} else {

		// Browser globals
		factory( jQuery, Globalize );
	}
}( function( $, Globalize ) {

var widget = $.widget( "ui.datepicker", {
	version: "@VERSION",
	defaultElement: "<input>",
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
		change: null,
		close: null,
		open: null,
		refresh: null,
		select: null
	},

	calendarOptions: [ "buttons", "classes", "disabled", "dateFormat", "eachDay",
		"icons", "labels", "locale", "max", "min", "numberOfMonths", "showWeek", "refresh" ],

	_create: function() {
		this._parse = new Globalize( this.options.locale ).dateParser( this.options.dateFormat );

		if ( $.type( this.options.max ) === "string" ) {
			this.options.max = this._parse( this.options.max );
		}
		if ( $.type( this.options.min ) === "string" ) {
			this.options.min = this._parse( this.options.min );
		}

		this._createCalendar();

		this._on( this._inputEvents );
		this._on( this.calendar, this._calendarEvents );
		this._on( this.document, this._documentEvents );
	},

	_getCreateOptions: function() {
		var max = this.element.attr( "max" ),
			min = this.element.attr( "min" ),
			parser = function( value ) {
				var exploded = value.split( "-" );

				return new Date( exploded[ 0 ], exploded[ 1 ] - 1, exploded[ 2 ] );
			},
			options = {};

		if ( max !== undefined ) {
			options.max = parser( max );
		}

		if ( min !== undefined ) {
			options.min = parser( min );
		}

		return options;
	},

	_createCalendar: function() {
		var that = this;

		this.calendar = $( "<div>" ).appendTo( this._appendTo() );
		this._addClass( this.calendar, "ui-datepicker", "ui-front" );

		// Initialize calendar widget
		this.calendarInstance = this.calendar
			.calendar( $.extend( {}, this.options, {
				value: this._parse( this.element.val() ),
				change: function( event ) {
					that._trigger( "change", event, {
						value: that.calendarInstance.valueAsDate()
					} );
				},
				select: function( event ) {
					that.element.val( that.calendarInstance.value() );
					that.close();
					event.preventDefault();
					that._focusTrigger();
					that._trigger( "select", event, {
						value: that.calendarInstance.valueAsDate()
					} );

					return false;
				}
			} ) )
			.calendar( "instance" );

		this.calendarInstance.buttonClickContext = that.element[ 0 ];

		this._setHiddenPicker();
		this.element.attr( {
			"aria-haspopup": true,
			"aria-owns": this.calendar.attr( "id" )
		} );
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
			case $.ui.keyCode.DOWN:
			case $.ui.keyCode.UP:
				this.open( event );
				break;
			}
		},
		keyup: function() {
			if ( this.isValid() ) {
				this.refresh();
			}
		},
		mousedown: function() {
			if ( this.isOpen ) {
				this.close();
				return;
			}
			clearTimeout( this.closeTimer );
		},
		change: function( event ) {
			this._trigger( "change", event, {
				value: this.calendarInstance.valueAsDate()
			} );
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

		keydown: function( event ) {
			if ( event.keyCode === $.ui.keyCode.ESCAPE && this.calendar.is( ":visible" ) ) {
				this.close( event );
				this._focusTrigger();
			}

			if ( event.keyCode === $.ui.keyCode.TAB && this.calendar.is( ":visible" ) ) {
				var element = $( event.target );

				// Reset focus when leaving widget
				if (
					( event.shiftKey && element.is( this.calendarInstance.prevButton ) ) ||
					( !event.shiftKey && element.is( this.calendarInstance.grid.last() ) )
				) {
					this.close( event );
					this._focusTrigger();
				}
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
			element = this.element.closest( ".ui-front, dialog" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_focusTrigger: function() {
		this.element.focus();
	},

	refresh: function() {
		this.calendarInstance.option( "value", this._getParsedValue() );
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
			.attr( {
				"aria-hidden": false,
				"aria-expanded": true
			} )
			.show()
			.position( this._buildPosition() )
			.hide();
		this._show( this.calendar, this.options.show );

		this.isOpen = true;
		this._trigger( "open", event );

		this._delay( function() {
			this.calendarInstance.grid.focus();
		} );
	},

	close: function( event ) {
		this._setHiddenPicker();
		this._hide( this.calendar, this.options.hide );

		this.isOpen = false;
		this._trigger( "close", event );
	},

	_setHiddenPicker: function() {
		this.calendar.attr( {
			"aria-hidden": true,
			"aria-expanded": false
		} );
	},

	_buildPosition: function() {
		return $.extend( { of: this.element }, this.options.position );
	},

	value: function( value ) {
		if ( arguments.length ) {
			this.valueAsDate( this._parse( value ) );
		} else {
			return this._getParsedValue() ? this.element.val() : null;
		}
	},

	valueAsDate: function( value ) {
		if ( arguments.length ) {
			if ( this.calendarInstance._isValid( value ) ) {
				this.calendarInstance.valueAsDate( value );
				this.element.val( this.calendarInstance._format( value ) );
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
		return this._parse( this.element.val() );
	},

	_setOption: function( key, value ) {
		if ( key === "max" || key === "min" ) {
			if ( typeof value === "string" ) {
				value = this._parse( value );
			}
		}

		this._super( key, value );

		if ( $.inArray( key, this.calendarOptions ) !== -1 ) {
			this.calendarInstance.option( key, value );
		}

		if ( key === "appendTo" ) {
			this.calendar.appendTo( this._appendTo() );
		}

		if ( key === "locale" || key === "dateFormat" ) {
			this.element.val( this.calendarInstance.value() );
		}

		if ( key === "disabled" ) {
			this.element
				.prop( "disabled", value )
				.toggleClass( "ui-state-disabled", value )
				.attr( "aria-disabled", value );

			if ( value ) {
				this.close();
			}
		}

		if ( key === "position" ) {
			this.calendar.position( this._buildPosition() );
		}
	}
} );

$.each( $.ui.datepicker.prototype.calendarOptions, function( index, option ) {
	$.ui.datepicker.prototype.options[ option ] = $.ui.calendar.prototype.options[ option ];
} );

return widget;

} ) );
