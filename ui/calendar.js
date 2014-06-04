/*!
 * jQuery UI Calendar @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/calendar/
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		// ToDo Add globalize and $.date?
		define([
			"jquery",
			"./core",
			"./widget",
			"./button"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

// TODO use uniqueId, if possible
var idIncrement = 0,
	// TODO move this to the instance
	suppressExpandOnFocus = false;

return $.widget( "ui.calendar", {
	options: {
		appendTo: null,
		dateFormat: { date: "short" },
		// TODO review
		eachDay: $.noop,
		numberOfMonths: 1,
		position: {
			my: "left top",
			at: "left bottom"
		},
		showWeek: false,
		show: true,
		hide: true,
		value: null,

		// callbacks
		beforeOpen: null,
		close: null,
		open: null,
		select: null
	},

	_create: function() {
		this.id = "ui-calendar-" + idIncrement;
		idIncrement++;

		if ( this.element.is( "input" ) ) {
			if ( !this.options.value && this.isValid() ) {
				this.options.value = this._getParsedValue();
			}
			this._createPicker();
		} else {
			this.inline = true;
			this.picker = this.element;
		}

		this.date = $.date( this.options.value, this.options.dateFormat ).select();
		this.date.eachDay = this.options.eachDay;

		this._on( this.picker, {
			"click .ui-calendar-prev": function( event ) {
				event.preventDefault();
				this.date.adjust( "M", -this.options.numberOfMonths );
				this.refresh();
			},
			"click .ui-calendar-next": function( event ) {
				event.preventDefault();
				this.date.adjust( "M", this.options.numberOfMonths );
				this.refresh();
			},
			"click .ui-calendar-current": function( event ) {
				event.preventDefault();
				this._select( event, new Date().getTime() );
			},
			"click .ui-calendar-close": function( event ) {
				event.preventDefault();
				this.close( event );
			},
			"mousedown .ui-calendar-calendar a": function( event ) {
				event.preventDefault();
				// TODO exclude clicks on lead days or handle them correctly
				// TODO store/read more then just date, also required for multi month picker
				this._select( event, $( event.currentTarget ).data( "timestamp" ) );
				if ( this.inline ) {
					this.grid.focus( 1 );
				}
			},
			"keydown .ui-calendar-calendar": "_handleKeydown"
		});

		// TODO use hoverable (no delegation support)? convert to _on?
		this.picker.delegate( ".ui-calendar-header a, .ui-calendar-calendar a", "mouseenter.calendar mouseleave.calendar", function() {
			$( this ).toggleClass( "ui-state-hover" );
		});

		this._createTmpl();
	},

	_handleKeydown: function( event ) {
		if ( jQuery.inArray( event.keyCode, [ 13, 33, 34, 35, 36, 37, 38, 39, 40 ] ) === -1 ) {
			// only interested navigation keys
			return;
		}
		event.preventDefault();

		var newId, newCell,
			activeCell = $( "#" + this.grid.attr( "aria-activedescendant" ) ),
			oldMonth = this.date.month(),
			oldYear = this.date.year();

		// TODO: Handle for pickers with multiple months
		switch ( event.keyCode ) {
			case $.ui.keyCode.ENTER:
				activeCell.children( "a:first" ).mousedown();
				return;
			case $.ui.keyCode.PAGE_UP:
				this.date.adjust( event.altKey ? "Y" : "M", -1 );
				break;
			case $.ui.keyCode.PAGE_DOWN:
				this.date.adjust( event.altKey ? "Y" : "M", 1 );
				break;
			case $.ui.keyCode.END:
				this.date.setDay( this.date.daysInMonth() );
				break;
			case $.ui.keyCode.HOME:
				this.date.setDay( 1 );
				break;
			case $.ui.keyCode.LEFT:
				this.date.adjust( "D", -1 );
				break;
			case $.ui.keyCode.UP:
				this.date.adjust( "D", -7 );
				break;
			case $.ui.keyCode.RIGHT:
				this.date.adjust( "D", 1 );
				break;
			case $.ui.keyCode.DOWN:
				this.date.adjust( "D", 7 );
				break;
			default:
				return;
		}

		if ( this.date.month() !== oldMonth || this.date.year() !== oldYear ) {
			this.refresh();
			this.grid.focus( 1 );
		}
		else {
			newId = this.id + "-" + this.date.day();
			newCell = $( "#" + newId );

			// TODO unnecessary optimization? is it really needed?
			if ( !newCell.length ) {
				return;
			}
			this.grid.attr("aria-activedescendant", newId);

			this.grid.find( ".ui-state-focus" ).removeClass( "ui-state-focus" );
			newCell.children( "a" ).addClass( "ui-state-focus" );
		}
	},

	_createPicker: function() {
		this.picker = $( "<div>" )
			.addClass( "ui-front" )
			// TODO add a ui-calendar-popup class, move position:absolute to that
			.css( "position", "absolute" )
			.uniqueId()
			.hide();
		this._setHiddenPicker();
		this.picker.appendTo( this._appendTo() );

		this.element
			.attr( "aria-haspopup", "true" )
			.attr( "aria-owns", this.picker.attr( "id" ) );

		this._on({
			keydown: function( event ) {
				switch ( event.keyCode ) {
					case $.ui.keyCode.TAB:
						// Waiting for close() will make popup hide too late, which breaks tab key behavior
						this.picker.hide();
						this.close( event );
						break;
					case $.ui.keyCode.ESCAPE:
						if ( this.isOpen ) {
							this.close( event );
						}
						break;
					case $.ui.keyCode.ENTER:
						this._handleKeydown( event );
						break;
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.UP:
						clearTimeout( this.closeTimer );
						this._delay( function() {
							this.open( event );
							this.grid.focus( 1 );
						}, 1 );
						break;
					case $.ui.keyCode.HOME:
						if ( event.ctrlKey ) {
							this.date.setTime( new Date() );
							event.preventDefault();
							if ( this.isOpen ) {
								this.refresh();
							} else {
								this.open( event );
							}
						}
						break;
					// TODO this is not in specs, keep?
					case $.ui.keyCode.END:
						if ( event.ctrlKey ) {
							this.element.val( "" );
							event.preventDefault();
							if ( this.isOpen ) {
								this.close( event );
							}
						}
						break;
				}
			},
			keyup: function() {
				if ( this.isValid() && !this.inline ) {
					this.date.setTime( this._getParsedValue() ).select();
					this.refresh();
				}
			},
			mousedown: function( event ) {
				if ( this.isOpen ) {
					suppressExpandOnFocus = true;
					this.close();
					return;
				}
				this.open( event );
				clearTimeout( this.closeTimer );
			},
			focus: function( event ) {
				if ( !suppressExpandOnFocus ) {
					this._delay( function() {
						if ( !this.isOpen ) {
							this.open( event );
						}
					}, 1);
				}
				this._delay( function() {
					suppressExpandOnFocus = false;
				}, 100 );
			},
			blur: function() {
				suppressExpandOnFocus = false;
			}
		});

		this._on( this.picker, {
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
				if ( event.keyCode === $.ui.keyCode.ESCAPE && this.picker.is( ":visible" ) ) {
					this.close( event );
					this._focusTrigger();
				}
			}
		});

		this._on( this.document, {
			click: function( event ) {
				if ( this.isOpen && !$( event.target ).closest( this.element.add( this.picker ) ).length ) {
					this.close( event );
				}
			}
		});
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[ 0 ].body;
		}

		return element;
	},

	_createTmpl: function() {
		this._createDatepicker();
		this.picker.find( "button" ).button();

		if ( this.inline ) {
			this.picker.children().addClass( "ui-calendar-inline" );
		}
		// against display:none in calendar.css
		this.picker.find( ".ui-calendar" ).css( "display", "block" );
		this.grid = this.picker.find( ".ui-calendar-calendar" );
	},

	_createDatepicker: function() {
		var multiClasses = [],
			pickerHtml = "";

		if (this.options.numberOfMonths === 1 ) {
			pickerHtml = this._buildHeader() + this._buildGrid() + this._buildButtons();
		} else {
			pickerHtml = this._buildMultiplePicker();
			multiClasses.push( "ui-calendar-multi" );
			multiClasses.push( "ui-calendar-multi-" + this.options.numberOfMonths );
		}

		$( "<div>" )
			.addClass( "ui-calendar ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
			.addClass( multiClasses.join( " " ) )
			.attr({
				role: "region",
				"aria-labelledby": this.id + "-title"
			})
			.html( pickerHtml )
			.appendTo( this.picker );
	},

	_buildMultiplePicker: function() {
		var headerClass,
			html = "",
			currentDate = this.date,
			months = this.date.months( this.options.numberOfMonths - 1 ),
			i = 0;

		for ( i; i < months.length; i++ ) {
			// TODO Shouldn't we pass date as a parameter to build* fns instead of setting this.date?
			this.date = months[ i ];
			headerClass = months[ i ].first ? "ui-corner-left" :
				months[ i ].last ? "ui-corner-right" : "";

			html += "<div class='ui-calendar-group'>" +
				"<div class='ui-calendar-header ui-widget-header ui-helper-clearfix " + headerClass + "'>";
			if ( months[ i ].first ) {
				html += this._buildPreviousLink();
			}
			if ( months[ i ].last ) {
				html += this._buildNextLink();
			}

			html += this._buildTitlebar();
			html += "</div>";
			html += this._buildGrid();
			html += "</div>";
		}

		html += "<div class='ui-calendar-row-break'></div>";
		html += this._buildButtons();

		this.date = currentDate;

		return html;
	},

	_buildHeader: function() {
		return "<div class='ui-calendar-header ui-widget-header ui-helper-clearfix ui-corner-all'>" +
			this._buildPreviousLink() +
			this._buildNextLink() +
			this._buildTitlebar() +
		"</div>";
	},

	_buildPreviousLink: function() {
		var labels = Globalize.translate( "calendar" );

		return "<button class='ui-calendar-prev ui-corner-all' " +
			"title='" + labels.prevText + "'>" +
				"<span class='ui-icon ui-icon-circle-triangle-w'>" +
					labels.prevText +
				"</span>" +
			"</button>";
	},

	_buildNextLink: function() {
		var labels = Globalize.translate( "calendar" );

		return "<button class='ui-calendar-next ui-corner-all' " +
			"title='" + labels.nextText + "'>" +
				"<span class='ui-icon ui-icon-circle-triangle-e'>" +
					labels.nextText +
				"</span>" +
			"</button>";
	},

	_buildTitlebar: function() {
		var labels = Globalize.translate( "calendar" );

		return "<div role='header' id='" + this.id + "-title'>" +
			"<div id='" + this.id + "-month-lbl' class='ui-calendar-title'>" +
				this._buildTitle() +
			"</div>" +
			"<span class='ui-helper-hidden-accessible'>, " + labels.datePickerRole + "</span>" +
		"</div>";
	},

	_buildTitle: function() {
		return "<span class='ui-calendar-month'>" +
				this.date.monthName() +
			"</span> " +
			"<span class='ui-calendar-year'>" +
				this.date.year() +
			"</span>";
	},

	_buildGrid: function() {
		return "<table class='ui-calendar-calendar' role='grid' aria-readonly='true' " +
			"aria-labelledby='" + this.id + "-month-lbl' tabindex='0' aria-activedescendant='" + this.id + "-" + this.date.day() + "'>" +
			this._buildGridHeading() +
			this._buildGridBody() +
		"</table>";
	},

	_buildGridHeading: function() {
		var cells = "",
			i = 0,
			labels = Globalize.translate( "calendar" );

		if ( this.options.showWeek ) {
			cells += "<th class='ui-calendar-week-col'>" + labels.weekHeader + "</th>";
		}
		for ( i; i < this.date.weekdays().length; i++ ) {
			cells += this._buildGridHeaderCell( this.date.weekdays()[i] );
		}

		return "<thead role='presentation'>" +
			"<tr role='row'>" + cells + "</tr>" +
		"</thead>";
	},

	_buildGridHeaderCell: function( day ) {
		return "<th role='columnheader' abbr='" + day.fullname + "' aria-label='" + day.fullname + "'>" +
			"<span title='" + day.fullname + "'>" +
				day.shortname +
			"</span>" +
		"</th>";
	},

	_buildGridBody: function() {
		// this.date.days() is not cached, and it has O(n^2) complexity. It is run O(n) times. So, it equals O(n^3). Not good at all. Caching.
		var days = this.date.days(),
			i = 0,
			rows = "";

		for ( i; i < days.length; i++ ) {
			rows += this._buildWeekRow( days[ i ] );
		}

		return "<tbody role='presentation'>" + rows + "</tbody>";
	},

	_buildWeekRow: function( week ) {
		var cells = "",
			i = 0;

		if ( this.options.showWeek ) {
			cells += "<td class='ui-calendar-week-col'>" + week.number + "</td>";
		}
		for ( i; i < week.days.length; i++ ) {
			cells += this._buildDayCell( week.days[i] );
		}
		return "<tr role='row'>" + cells + "</tr>";
	},

	_buildDayCell: function( day ) {
		var contents = "",
			idAttribute = day.render ? ( "id=" + this.id + "-" + day.date ) : "",
			ariaSelectedAttribute = "aria-selected=" + ( day.current ? "true" : "false" ),
			ariaDisabledAttribute = day.selectable ? "" : "aria-disabled=true";

		if ( day.render ) {
			if ( day.selectable ) {
				contents = this._buildDayLink( day );
			} else {
				contents = this._buildDayDisplay( day );
			}
		}

		return "<td role='gridcell' " + idAttribute + " " + ariaSelectedAttribute + " " + ariaDisabledAttribute + ">" +
			contents +
		"</td>";
	},

	_buildDayLink: function( day ) {
		var link,
			classes = [ "ui-state-default" ],
			labels = Globalize.translate( "calendar" );

		if ( day.date === this.date.day() ) {
			classes.push( "ui-state-focus" );
		}
		if ( day.current ) {
			classes.push( "ui-state-active" );
		}
		if ( day.today ) {
			classes.push( "ui-state-highlight" );
		}
		if ( day.extraClasses ) {
			classes.push( day.extraClasses.split( " " ) );
		}

		link = "<a href='#' tabindex='-1' data-timestamp='" + day.timestamp + "' class='" + classes.join( " " ) + "'>" +
				day.date + "</a>";
		if ( day.today ) {
			link += "<span class='ui-helper-hidden-accessible'>, " + labels.currentText + "</span>";
		}

		return link;
	},

	_buildDayDisplay: function( day ) {
		var classes = [];

		if ( day.current ) {
			classes.push( "ui-state-active" );
		}
		if ( day.today ) {
			classes.push( "ui-state-highlight" );
		}
		if ( day.extraClasses ) {
			classes.push( day.extraClasses.split( " " ) );
		}

		return "<span class='" + classes.join( "" ) + "'>" + day.date + "</span>";
	},

	_buildButtons: function() {
		var labels = Globalize.translate( "calendar" );

		return "<div class='ui-calendar-buttonpane ui-widget-content'>" +
			"<button class='ui-calendar-current'>" + labels.currentText + "</button>" +
			"<button class='ui-calendar-close'>" + labels.closeText + "</button>" +
		"</div>";
	},

	_focusTrigger: function() {
		suppressExpandOnFocus = true;
		this.element.focus();
	},

	// Refreshing the entire calendar during interaction confuses screen readers, specifically
	// because the grid heading is marked up as a live region and will often not update if it's
	// destroyed and recreated instead of just having its text change. Additionally, interacting
	// with the prev and next links would cause loss of focus issues because the links being
	// interacted with will disappear while focused.
	refresh: function() {
		// determine which day gridcell to focus after refresh
		// TODO: Prevent disabled cells from being focused
		if ( this.options.numberOfMonths === 1 ) {
			this.grid = $( this._buildGrid() );
			$( ".ui-calendar-title", this.picker ).html( this._buildTitle() );
			$( ".ui-calendar-calendar", this.picker ).replaceWith( this.grid );
		} else {
			this._refreshMultiplePicker();
		}
	},

	_refreshMultiplePicker: function() {
		var i = 0;

		for ( ; i < this.options.numberOfMonths; i++ ) {
			$( ".ui-calendar-title", this.picker ).eq( i ).html( this._buildTitle() );
			$( ".ui-calendar-calendar", this.picker ).eq( i ).html( this._buildGrid() );
			this.date.adjust( "M", 1 );
		}
		this.date.adjust( "M", -this.options.numberOfMonths );

		// TODO: This assumes focus is on the first grid. For multi pickers, the widget needs
		// to maintain the currently focused grid and base queries like this off of it.
		$( this.picker ).find( ".ui-state-focus" ).not( ":first" ).removeClass( "ui-state-focus" );
	},

	open: function( event ) {
		if ( this.inline || this.isOpen ) {
			return;
		}
		if ( this._trigger( "beforeOpen", event ) === false ) {
			return;
		}

		this.refresh();

		this.picker
			.attr( "aria-hidden", "false" )
			.attr( "aria-expanded", "true" )
			.show()
			.position( this._buildPosition() )
			.hide();

		this._show( this.picker, this.options.show );

		// take trigger out of tab order to allow shift-tab to skip trigger
		// TODO does this really make sense? related bug: tab-shift moves focus to last element on page
		this.element.attr( "tabindex", -1 );
		this.isOpen = true;

		this._trigger( "open", event );
	},

	close: function( event ) {
		if ( this.inline ) {
			return;
		}

		this._setHiddenPicker();
		this._hide( this.picker, this.options.hide );

		this.element.attr( "tabindex" , 0 );

		this.isOpen = false;
		this._trigger( "close", event );
	},

	_setHiddenPicker: function() {
		this.picker
			.attr( "aria-hidden", "true" )
			.attr( "aria-expanded", "false" );
	},

	_buildPosition: function() {
		return $.extend( {}, { of: this.element }, this.options.position );
	},

	_select: function( event, time ) {
		this._setOption( "value", new Date( time ) );
		if ( !this.inline ) {
			this.close();
			this._focusTrigger();
		}
		this._trigger( "select", event, {
			// TODO replace with value option to initialise and read
			date: this.value()
		});
	},

	value: function( value ) {
		if ( arguments.length ) {
			this._setOption( "value", Globalize.parseDate( value, this.options.dateFormat ) );
		} else {
			if ( this.inline ) {
				return Globalize.format( this.date.selected(), this.options.dateFormat );
			} else {
				return this.element.val();
			}
		}
	},

	valueAsDate: function( value ) {
		if ( arguments.length ) {
			this._setOption( "value", value );
		} else {
			return this.option( "value" );
		}
	},

	isValid: function() {
		if ( this.inline ) {
			return true;
		}

		return this._getParsedValue() !== null;
	},

	_destroy: function() {
		if ( this.inline ) {
			this.picker.empty();
		} else {
			this.picker.remove();
			this.element
				.removeAttr( "aria-haspopup" )
				.removeAttr( "aria-owns" );
		}
	},

	widget: function() {
		return this.picker;
	},

	_getParsedValue: function() {
		return Globalize.parseDate( this.element.val(), this.options.dateFormat );
	},

	option: function( key ) {
		if ( arguments.length === 0 || ( arguments.length === 1 && key === "value" ) ) {
			this.options.value = this.inline ? this.date.selected() : this._getParsedValue();
		}
		return this._superApply( arguments );
	},

	_setOption: function( key, value ) {
		if ( key === "value" ) {
			if ( value instanceof Date ) {
				this.date.setTime( value.getTime() ).select();
				this.refresh();
				if ( !this.inline ) {
					this.element.val( this.date.format() );
				}
			}
		}

		this._super( key, value );

		if ( key === "appendTo" ) {
			this.picker.appendTo( this._appendTo() );
		}

		if ( key === "eachDay" ) {
			this.date.eachDay = this.options.eachDay;
			this.refresh();
		}

		if ( key === "dateFormat" ) {
			this.date.setFormat( this.options.dateFormat );
			if ( !this.inline ) {
				this.element.val( this.date.format() );
			}
		}

		if ( key === "showWeek" ) {
			this.refresh();
		}

		if ( key === "position" ) {
			this.picker.position( this._buildPosition() );
		}
	}
});

}));
