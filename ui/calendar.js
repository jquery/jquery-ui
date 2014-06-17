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

return $.widget( "ui.calendar", {
	version: "@VERSION",
	options: {
		dateFormat: { date: "short" },
		// TODO review
		eachDay: $.noop,
		max: null,
		min: null,
		numberOfMonths: 1,
		showWeek: false,
		value: null,

		// callbacks
		select: null
	},

	_create: function() {
		this.id = this.element.uniqueId().attr( "id" );

		this.date = $.date( this.options.value, this.options.dateFormat ).select();
		this.date.eachDay = this.options.eachDay;

		this._on( this.element, {
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
			"mousedown .ui-calendar-calendar a": function( event ) {
				event.preventDefault();
				// TODO exclude clicks on lead days or handle them correctly
				// TODO store/read more then just date, also required for multi month picker
				this._select( event, $( event.currentTarget ).data( "timestamp" ) );
				this.grid.focus( 1 );
			},
			"keydown .ui-calendar-calendar": "_handleKeydown"
		});

		// TODO use hoverable (no delegation support)? convert to _on?
		this.element.delegate( ".ui-calendar-header a, .ui-calendar-calendar a", "mouseenter.calendar mouseleave.calendar", function() {
			$( this ).toggleClass( "ui-state-hover" );
		});

		this._createCalendar();
	},

	_handleKeydown: function( event ) {
		if ( jQuery.inArray( event.keyCode, [ 13, 33, 34, 35, 36, 37, 38, 39, 40 ] ) === -1 ) {
			// only interested navigation keys
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

		this._setActiveDescendant();
	},

	_setActiveDescendant: function() {
		var newId = this.id + "-" + this.date.day(),
			newCell = $( "#" + newId );

		this.grid.attr( "aria-activedescendant", newId );
		this.grid.find( ".ui-state-focus" ).removeClass( "ui-state-focus" );
		newCell.children( "a" ).addClass( "ui-state-focus" );
	},

	_createCalendar: function() {
		var classes = "ui-calendar ui-widget ui-widget-content ui-helper-clearfix ui-corner-all",
			pickerHtml = "";

		if ( this.options.numberOfMonths === 1 ) {
			pickerHtml = this._buildHeader() + this._buildGrid() + this._buildButtons();
		} else {
			pickerHtml = this._buildMultiplePicker();
			classes += " ui-calendar-multi";
		}

		this.element
			.addClass( classes )
			.attr({
				role: "region",
				"aria-labelledby": this.id + "-title"
			})
			.html( pickerHtml );

		this.element.find( "button" ).button();

		this.grid = this.element.find( ".ui-calendar-calendar" );
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
		var labels = Globalize.translate( "datepicker" );

		return "<button class='ui-calendar-prev ui-corner-all' title='" + labels.prevText + "'>" +
				"<span class='ui-icon ui-icon-circle-triangle-w'>" +
					labels.prevText +
				"</span>" +
			"</button>";
	},

	_buildNextLink: function() {
		var labels = Globalize.translate( "datepicker" );

		return "<button class='ui-calendar-next ui-corner-all' title='" + labels.nextText + "'>" +
				"<span class='ui-icon ui-icon-circle-triangle-e'>" +
					labels.nextText +
				"</span>" +
			"</button>";
	},

	_buildTitlebar: function() {
		var labels = Globalize.translate( "datepicker" );

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
			labels = Globalize.translate( "datepicker" );

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
		var content = "",
			attributes = [
				"role='gridcell'",
				"aria-selected='" + day.current ? true : false + "'"
			],
			selectable = ( day.selectable && this._isValid( new Date( day.timestamp ) ) );

		if ( day.render ) {
			attributes.push( "id='" + this.id + "-" + day.date + "'" );

			if ( !selectable ) {
				attributes.push( "aria-disabled='true'" );
				attributes.push( "class='ui-state-disabled'" );
			}

			content = this._buildDayElement( day, selectable );
		}

		return "<td " + attributes.join( " " ) + ">" + content + "</td>";
	},

	_buildDayElement: function( day, selectable ) {
		var classes = [ "ui-state-default" ],
			labels = Globalize.translate( "datepicker" ),
			content = "";

		if ( day === this.date && selectable ) {
			classes.push( "ui-state-focus" );
		}
		if ( day.current ) {
			classes.push( "ui-state-active" );
		}
		if ( day.today ) {
			classes.push( "ui-state-highlight" );
		}
		// ToDo Explain and document this
		if ( day.extraClasses ) {
			classes.push( day.extraClasses.split( " " ) );
		}

		classes = " class='" + classes.join( " " ) + "'";
		if ( selectable ) {
			content = "<a href='#' tabindex='-1' data-timestamp='" + day.timestamp + "'" + classes + ">" + day.date + "</a>";
		} else {
			content = "<span" + classes + ">" + day.date + "</span>";
		}

		if ( day.today ) {
			content += "<span class='ui-helper-hidden-accessible'>, " + labels.currentText + "</span>";
		}

		return content;
	},

	_buildButtons: function() {
		var labels = Globalize.translate( "datepicker" );

		return "<div class='ui-calendar-buttonpane ui-widget-content'>" +
			"<button class='ui-calendar-current'>" + labels.currentText + "</button>" +
		"</div>";
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
			$( ".ui-calendar-title", this.element ).html( this._buildTitle() );
			$( ".ui-calendar-calendar", this.element ).replaceWith( this.grid );
		} else {
			this._refreshMultiplePicker();
		}
	},

	_refreshMultiplePicker: function() {
		var i = 0;

		for ( ; i < this.options.numberOfMonths; i++ ) {
			$( ".ui-calendar-title", this.element ).eq( i ).html( this._buildTitle() );
			$( ".ui-calendar-calendar", this.element ).eq( i ).html( this._buildGrid() );
			this.date.adjust( "M", 1 );
		}
		this.date.adjust( "M", -this.options.numberOfMonths );

		// TODO: This assumes focus is on the first grid. For multi pickers, the widget needs
		// to maintain the currently focused grid and base queries like this off of it.
		$( this.element ).find( ".ui-state-focus" ).not( ":first" ).removeClass( "ui-state-focus" );
	},

	_setHiddenPicker: function() {
		this.element
			.attr( "aria-hidden", "true" )
			.attr( "aria-expanded", "false" );
	},

	_select: function( event, time ) {
		this._setOption( "value", new Date( time ) );
		this._trigger( "select", event );
	},

	value: function( value ) {
		if ( arguments.length ) {
			this._setOption( "value", Globalize.parseDate( value, this.options.dateFormat ) );
		} else {
			return Globalize.format( this.option( "value" ), this.options.dateFormat );
		}
	},

	valueAsDate: function( value ) {
		if ( arguments.length ) {
			this._setOption( "value", value );
		} else {
			return this.option( "value" );
		}
	},

	_isValid: function( value ) {
		if ( !( value instanceof Date ) ) {
			return false;
		}

		if ( this.options.max instanceof Date ) {
			if ( value > this.options.max ) {
				return false;
			}
		}

		if ( this.options.min instanceof Date ) {
			if ( value < this.options.min ) {
				return false;
			}
		}

		return true;
	},

	_destroy: function() {
		this.element
			.removeClass( "ui-calendar ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-calendar-multi" )
			.removeAttr( "role aria-labelledby" )
			.removeUniqueId()
			.empty();
	},

	option: function( key ) {
		if ( arguments.length === 0 || ( arguments.length === 1 && key === "value" ) ) {
			this.options.value = this.date.selectedDate();
		}
		return this._superApply( arguments );
	},

	_setOption: function( key, value ) {
		if ( key === "value" ) {
			if ( this._isValid( value ) ) {
				this.date.setTime( value.getTime() ).select();
				this.refresh();
			}
		}

		if ( key === "max" || key === "min" ) {
			if ( value instanceof Date || value === null ) {
				this._super( key, value );
				this.refresh();
			}
			return;
		}

		this._super( key, value );

		if ( key === "eachDay" ) {
			this.date.eachDay = value;
			this.refresh();
		}

		if ( key === "dateFormat" ) {
			this.date.setFormat( value );
		}

		if ( key === "showWeek" ) {
			this.refresh();
		}
	}
});

}));
