/*!
 * jQuery UI Datepicker @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.button.js
 *	jquery.ui.position.js
 */
(function( $, undefined ) {

// TODO use uniqueId, if possible
var idIncrement = 0,
	// TODO move this to the instance
	suppressExpandOnFocus = false;

$.widget( "ui.datepicker", {
	options: {
		appendTo: null,
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

		// callbacks
		close: null,
		open: null,
		select: null
	},
	_create: function() {
		var that = this;
		this.date = $.date();
		this.date.eachDay = this.options.eachDay;
		this.id = "ui-datepicker-" + idIncrement;
		idIncrement++;
		if ( this.element.is( "input" ) ) {
			this._createPicker();
		} else {
			this.inline = true;
			this.picker = this.element;
		}
		this._on( this.picker, {
			"click .ui-datepicker-prev": function( event ) {
				event.preventDefault();
				this.date.adjust( "M", -this.options.numberOfMonths );
				this.refresh();
			},
			"click .ui-datepicker-next": function( event ) {
				event.preventDefault();
				this.date.adjust( "M", this.options.numberOfMonths );
				this.refresh();
			},
			"click .ui-datepicker-current": function( event ) {
				event.preventDefault();
				this.select( event, new Date().getTime() );
			},
			"click .ui-datepicker-close": function( event ) {
				event.preventDefault();
				this.close( event );
			},
			"mousedown .ui-datepicker-calendar a": function( event ) {
				event.preventDefault();
				// TODO exclude clicks on lead days or handle them correctly
				// TODO store/read more then just date, also required for multi month picker
				this.select( event, $( event.currentTarget ).data( "timestamp" ) );
				if ( this.inline ) {
					this.grid.focus( 1 );
				}
			},
			"keydown .ui-datepicker-calendar": "_handleKeydown"
		});

		// TODO use hoverable (no delegation support)? convert to _on?
		this.picker.delegate( ".ui-datepicker-header a, .ui-datepicker-calendar a", "mouseenter.datepicker mouseleave.datepicker", function() {
			$( this ).toggleClass( "ui-state-hover" );
		});

		this._createTmpl();
	},
	_handleKeydown: function( event ) {
		if ( jQuery.inArray( event.keyCode, [ 13, 33, 34, 35, 36, 37, 38, 39, 40 ] ) === -1 ) {
			//only interested navigation keys
			return;
		}
		event.preventDefault();

		var activeCell = $( "#" + this.grid.attr( "aria-activedescendant" ) ),
			oldMonth = this.date.month(),
			oldYear = this.date.year();

		// TODO: Handle for pickers with multiple months
		switch ( event.keyCode ) {
			case $.ui.keyCode.ENTER:
				activeCell.children( "a:first" ).mousedown();
				return;
			case $.ui.keyCode.PAGE_UP:
				this.date.adjust( event.altKey ? "Y" : "M", 1 );
				break;
			case $.ui.keyCode.PAGE_DOWN:
				this.date.adjust( event.altKey ? "Y" : "M", -1 );
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

		if ( this.date.month() != oldMonth || this.date.year() != oldYear ) {
			this.refresh();
			this.grid.focus( 1 );
		}
		else {
			var newId = this.id + "-" + this.date.day(),
				newCell = $("#" + newId);

			// TODO unnecessary optimization? is it really needed?
			if ( !newCell.length ) {
				return;
			}
			this.grid.attr("aria-activedescendant", newId);

			activeCell.children("a").removeClass("ui-state-focus");
			newCell.children("a").addClass("ui-state-focus");
		}
	},
	_createPicker: function() {
		this.picker = $( "<div>" )
			.addClass( "ui-front" )
			// TODO add a ui-datepicker-popup class, move position:absolte to that
			.css( "position", "absolute" )
			.uniqueId()
			.hide();
		this._setHiddenPicker();
		this.picker.appendTo( this._appendTo() )

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
					case $.ui.keyCode.DOWN:
					case $.ui.keyCode.UP:
						clearTimeout( this.closeTimer );
						this._delay(function() {
							this.open( event );
							this.grid.focus( 1 );
						}, 1);
						break;
				}
			},
			mousedown: function( event ) {
				if (this.isOpen) {
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
				}, 100);
			},
			blur: function( event ) {
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
				}, 150);
			},
			focusin: function( event ) {
				clearTimeout( this.closeTimer );
			},
			mouseup: function( event ) {
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
			element = this.document[0].body;
		}

		return element;
	},
	_createTmpl: function() {
		this.date.refresh();

		this._createDatepicker();
		this.picker.find( "button" ).button();

		if ( this.inline ) {
			this.picker.children().addClass( "ui-datepicker-inline" );
		}
		// against display:none in datepicker.css
		this.picker.find( ".ui-datepicker" ).css( "display", "block" );
		this.grid = this.picker.find( ".ui-datepicker-calendar" );
	},
	_createDatepicker: function() {
		var multiClasses = [],
			pickerHtml = "";

		if (this.options.numberOfMonths === 1 ) {
			pickerHtml = this._buildHeader() + this._buildGrid() + this._buildButtons();
		} else {
			pickerHtml = this._buildMultiplePicker();
			multiClasses.push( "ui-datepicker-multi" );
			multiClasses.push( "ui-datepicker-multi-" + this.options.numberOfMonths );
		}

		$( "<div>" )
			.addClass( "ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
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
			this.date = months[ i ];
			headerClass = months[ i ].first ? "ui-corner-left" :
				months[ i ].last ? "ui-corner-right" : "";

			html += "<div class='ui-datepicker-group'>" +
				"<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix " + headerClass + "'>";
			if ( months[i].first ) {
				html += this._buildPreviousLink();
			}
			if ( months[i].last ) {
				html += this._buildNextLink();
			}

			html += this._buildTitlebar();
			html += "</div>";
			html += this._buildGrid();
			html += "</div>";
		}

		html += "<div class='ui-datepicker-row-break'></div>";
		html += this._buildButtons();

		this.date = currentDate;
		return html;
	},
	_buildHeader: function() {
		return "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all'>" +
			this._buildPreviousLink() +
			this._buildNextLink() +
			this._buildTitlebar() +
		"</div>";
	},
	_buildPreviousLink: function() {
		var labels = Globalize.localize( "datepicker" );
		return "<button class='ui-datepicker-prev ui-corner-all' " +
			"title='" + labels.prevText + "'>" +
				"<span class='ui-icon ui-icon-circle-triangle-w'>" +
					labels.prevText +
				"</span>" +
			"</button>";
	},
	_buildNextLink: function() {
		var labels = Globalize.localize( "datepicker" );
		return "<button class='ui-datepicker-next ui-corner-all' " +
			"title='" + labels.nextText + "'>" +
				"<span class='ui-icon ui-icon-circle-triangle-e'>" +
					labels.nextText +
				"</span>" +
			"</button>";
	},
	_buildTitlebar: function() {
		var labels = Globalize.localize( "datepicker" );
		return "<div role='header' id='" + this.id + "-title'>" +
			"<div id='" + this.id + "-month-lbl' class='ui-datepicker-title'>" +
				this._buildTitle() +
			"</div>" +
			"<span class='ui-helper-hidden-accessible'>, " + labels.datePickerRole + "</span>" +
		"</div>";
	},
	_buildTitle: function() {
		return "<span class='ui-datepicker-month'>" +
				this.date.monthName() +
			"</span> " +
			"<span class='ui-datepicker-year'>" +
				this.date.year() +
			"</span>";
	},
	_buildGrid: function() {
		return "<table class='ui-datepicker-calendar' role='grid' aria-readonly='true' " +
			"aria-labelledby='" + this.id + "-month-lbl' tabindex='0' aria-activedescendant='" + this.id + "-" + this.date.day() + "'>" +
			this._buildGridHeading() +
			this._buildGridBody() +
		"</table>";
	},
	_buildGridHeading: function() {
		var cells = "",
			i = 0,
			labels = Globalize.localize( "datepicker" );

		if ( this.options.showWeek ) {
			cells += "<th>" + labels.weekHeader + "</th>";
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
		var rows = "",
			i = 0;
		for ( i; i < this.date.days().length; i++ ) {
			rows += this._buildWeekRow( this.date.days()[i] );
		}
		return "<tbody role='presentation'>" + rows + "</tbody>";
	},
	_buildWeekRow: function( week ) {
		var cells = "",
			i = 0;

		if ( this.options.showWeek ) {
			cells += "<td>" + week.number + "</td>";
		}
		for ( i; i < week.days.length; i++ ) {
			cells += this._buildDayCell( week.days[i] );
		}
		return "<tr role='row'>" + cells + "</tr>";
	},
	_buildDayCell: function( day ) {
		var contents = "";
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
			labels = Globalize.localize( "datepicker" );

		if ( day.date == this.date.day() ) {
			classes.push( "ui-state-focus" )
		}
		if ( day.current ) {
			classes.push( "ui-state-active" );
		}
		if ( day.today ) {
			classes.push( "ui-state-highlight" );
		}
		if ( day.extraClasses ) {
			classes.push( day.extraClasses.split( "" ) );
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
			classes.push( day.extraClasses.split( "" ) );
		}

		return "<span class='" + classes.join( "" ) + "'>" +
					day.date + "</span>";
	},
	_buildButtons: function() {
		var labels = Globalize.localize( "datepicker" );
		return "<div class='ui-datepicker-buttonpane ui-widget-content'>" +
			"<button class='ui-datepicker-current'>" + labels.currentText + "</button>" +
			"<button class='ui-datepicker-close'>" + labels.closeText + "</button>" +
		"</div>";
	},
	_focusTrigger: function( event ) {
		suppressExpandOnFocus = true;
		this.element.focus();
	},
	// Refreshing the entire datepicker during interaction confuses screen readers, specifically
	// because the grid heading is marked up as a live region and will often not update if it's 
	// destroyed and recreated instead of just having its text change. Additionally, interacting 
	// with the prev and next links would cause loss of focus issues because the links being
	// interacted with will disappear while focused.
	refresh: function() {
		//determine which day gridcell to focus after refresh
		//TODO: Prevent disabled cells from being focused
		this.date.refresh();

		if ( this.options.numberOfMonths === 1 ) {
			this.grid = $( this._buildGrid() );
			$( ".ui-datepicker-title", this.picker ).html( this._buildTitle() );
			$( ".ui-datepicker-calendar", this.picker ).replaceWith( this.grid );
		} else {
			this._refreshMultiplePicker();
		}
	},
	_refreshMultiplePicker: function() {
		var currentDate = this.date,
			i = 0;

		for ( ; i < this.options.numberOfMonths; i++ ) {
			$( ".ui-datepicker-title", this.picker ).eq( i ).html( this._buildTitle() );
			$( ".ui-datepicker-calendar", this.picker ).eq( i ).html( this._buildGrid() );
			this.date.adjust( "M", 1 );
		}
		this.date.adjust( "M", -this.options.numberOfMonths );
	},
	open: function( event ) {
		if ( this.inline || this.isOpen ) {
			return;
		}

		// TODO explain this
		this.date = $.date( this.element.val() );
		this.date.eachDay = this.options.eachDay;
		this.date.select();
		this.refresh();

		var position = $.extend( {}, {
			of: this.element
		}, this.options.position );

		this.picker
			.attr( "aria-hidden", "false" )
			.attr( "aria-expanded", "true" )
			.show()
			.position( position )
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
	select: function( event, time ) {
		this.date.setTime( time ).select();
		this.refresh();
		if ( !this.inline ) {
			this.element.val( this.date.format() );
			this.close();
			this._focusTrigger();
		}
		this._trigger( "select", event, {
			// TODO replace with value option to initialise and read
			date: this.date.format()
		});
	},
	_destroy: function() {
		if ( !this.inline ) {
			this.picker.remove();
			this.element
				.removeAttr( "aria-haspopup" )
				.removeAttr( "aria-owns" );
		}
	},
	widget: function() {
		return this.picker;
	}
});

}( jQuery ));
