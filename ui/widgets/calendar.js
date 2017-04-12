/*!
 * jQuery UI Calendar @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Calendar
//>>group: Widgets
//>>description: Displays a calendar for inline date selection.
//>>docs: http://api.jqueryui.com/calendar/
//>>demos: http://jqueryui.com/calendar/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/calendar.css
//>>css.theme: ../../themes/base/theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"globalize",
			"globalize/date",
			"globalize-locales",
			"../date",
			"./button",
			"../widget",
			"../version",
			"../keycode",
			"../unique-id",
			"../tabbable",
			"../escape-selector"
		], factory );
	} else {

		// Browser globals
		factory( jQuery, Globalize );
	}
}( function( $, Globalize ) {

return $.widget( "ui.calendar", {
	version: "@VERSION",
	options: {
		buttons: [],
		classes: {
			"ui-calendar": "ui-corner-all",
			"ui-calendar-header-first": "ui-corner-left",
			"ui-calendar-header-last": "ui-corner-right",
			"ui-calendar-prev": "ui-corner-all",
			"ui-calendar-next": "ui-corner-all"
		},
		dateFormat: { date: "short" },
		eachDay: $.noop,
		icons: {
			prevButton: "ui-icon-circle-triangle-w",
			nextButton: "ui-icon-circle-triangle-e"
		},
		labels: {
			"datePickerRole": "date picker",
			"nextText": "Next",
			"prevText": "Prev",
			"weekHeader": "Wk"
		},
		locale: "en",
		max: null,
		min: null,
		numberOfMonths: 1,
		showWeek: false,
		value: null,

		// callbacks
		change: null,
		refresh: null,
		select: null
	},

	refreshRelatedOptions: {
		dateFormat: true,
		eachDay: true,
		locale: true,
		max: true,
		min: true,
		showWeek: true,
		value: true
	},

	_create: function() {
		this.id = this.element.uniqueId().attr( "id" );
		this.gridId = this.id;
		this.labels = this.options.labels;
		this.buttonClickContext = this.element[ 0 ];

		this._setLocale( this.options.locale, this.options.dateFormat );

		this.date = new $.ui.date( this.options.value, this._calendarDateOptions );
		this.viewDate = this.date.clone();
		this.viewDate.eachDay = this.options.eachDay;

		this._on( this.element, {
			"click .ui-calendar-prev": function( event ) {
				event.preventDefault();
				this.date.adjust( "M", -this.options.numberOfMonths );
				this._updateView();
			},
			"click .ui-calendar-next": function( event ) {
				event.preventDefault();
				this.date.adjust( "M", this.options.numberOfMonths );
				this._updateView();
			},
			"mousedown .ui-calendar-calendar button": "_select",
			"mouseenter .ui-calendar-header-buttons button": "_hover",
			"mouseleave .ui-calendar-header-buttons button": "_hover",
			"mouseenter .ui-calendar-calendar button": "_hover",
			"mouseleave .ui-calendar-calendar button": "_hover",
			"keydown .ui-calendar-calendar": "_handleKeydown"
		} );

		this._createCalendar();
		this._setActiveDescendant();
	},

	_hover: function( event ) {
		this._addClass( $( event.currentTarget ), null, "ui-state-hover" );
	},

	_select: function( event ) {
		var oldValue = this.options.value ? this.options.value.getTime() : "";

		this._setOption(
			"value", new Date( $( event.currentTarget ).data( "ui-calendar-timestamp" ) )
		);
		this._updateDayElement( "ui-state-active" );

		// Allow datepicker to handle focus
		if ( this._trigger( "select", event, { value: this.options.value }  ) !== false ) {
			this.activeDescendant.closest( this.grid ).focus();
			event.preventDefault();
		}

		if ( oldValue !== this.options.value.getTime() ) {
			this._trigger( "change", event, { value: this.options.value }  );
		}
	},

	_handleKeydown: function( event ) {
		var pageAltKey = ( event.altKey || event.ctrlKey && event.shiftKey );

		switch ( event.keyCode ) {
		case $.ui.keyCode.ENTER:
			this._select(
				$.Event( event, { currentTarget:  this.activeDescendant[ 0 ] } )
			);
			return;
		case $.ui.keyCode.PAGE_UP:
			this.date.adjust( pageAltKey ? "Y" : "M", -1 );
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.date.adjust( pageAltKey ? "Y" : "M", 1 );
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

		if ( this._needsRefresh() ) {
			this._updateView();
			this.activeDescendant.closest( this.grid ).focus();
		} else {
			this._setActiveDescendant();
		}
	},

	_updateView: function() {
		if ( this.options.numberOfMonths > 1 && this.date.year() === this.viewDate.year() ) {
			this.viewDate.adjust( "M", this.options.numberOfMonths *
				( this.date.month() > this.viewDate.month() ? 1 : -1 )
			);
		} else {
			this.viewDate.setTimestamp( this.date.timestamp() );
		}

		this.refresh();
	},

	_needsRefresh: function() {
		if ( this.date.month() !== this.viewDate.month() ||
			this.date.year() !== this.viewDate.year()
		) {

			// Check if the needed day is already present in our grid due
			// to eachDay option changes (eg. other-months demo)
			return !this._getDateElement( this._getDayId( this.date ) ).length;
		}

		return false;
	},

	_setActiveDescendant: function() {
		this.activeDescendant = this._updateDayElement( "ui-state-focus" );
	},

	_updateDayElement: function( state ) {
		var id = this._getDayId( this.date ),
			button = this._getDateElement( id ).children( "button" );

		this.grid.attr( "aria-activedescendant", id );

		this._removeClass( this.grid.find( "button." + state ), null, state );
		this._addClass( button, null, state );

		return button;
	},

	_getDateElement: function( id ) {
		return this.grid.find( "#" + $.ui.escapeSelector( id ) );
	},

	_setLocale: function( locale, dateFormat ) {
		var globalize = new Globalize( locale ),
			weekdayShortFormatter = globalize.dateFormatter( { raw: "EEEEEE" } ),
			weekdayNarrowFormatter = globalize.dateFormatter( { raw: "EEEEE" } ),
			firstDayRaw = globalize.dateFormatter( { raw: "c" } )( new Date( 1970, 0, 3 ) );

		this._format = globalize.dateFormatter( dateFormat );
		this._parse = globalize.dateParser( dateFormat );
		this._calendarDateOptions = {
			firstDay: ( 7 - globalize.parseNumber( firstDayRaw ) ),
			formatWeekdayShort: function( date ) {

				// Return the short weekday if its length is < 3. Otherwise, its narrow form.
				var shortWeekday = weekdayShortFormatter( date );

				return shortWeekday.length > 3 ? weekdayNarrowFormatter( date ) : shortWeekday;
			},
			formatWeekdayFull: globalize.dateFormatter( { raw: "EEEE" } ),
			formatMonth: globalize.dateFormatter( { raw: "MMMM" } ),
			formatWeekOfYear: globalize.dateFormatter( { raw: "w" } ),
			parse: this._parse
		};
	},

	_createCalendar: function() {
		this.element
			.attr( "role", "region" )
			.append( this._buildHeaderButtons() );

		if ( this.options.numberOfMonths === 1 ) {
			this._buildSinglePicker();
		} else {
			this._buildMultiplePicker();
		}

		this._addClass(
			this.element, "ui-calendar", "ui-widget ui-widget-content ui-helper-clearfix"
		);

		this._refreshHeaderButtons();
		this._createButtonPane();

		this.grid = this.element.find( ".ui-calendar-calendar" );
	},

	_buildSinglePicker: function() {
		var header = this._buildHeader();

		this._addClass( header, "ui-calendar-header-first ui-calendar-header-last" );
		this.element
			.attr( "aria-labelledby", this.gridId + "-title" )
			.append( header )
			.append( this._buildGrid() );
	},

	_buildMultiplePicker: function() {
		var element, header,
			rowBreak = $( "<div>" ),
			currentDate = this.viewDate,
			months = this.viewDate.months( this.options.numberOfMonths - 1 ),
			labelledBy = [],
			i = 0;

		for ( ; i < months.length; i++ ) {

			// TODO: Shouldn't we pass date as a parameter to build* fns
			// instead of setting this.date?
			this.viewDate = months[ i ];
			this.gridId = this.id + "-" + i;
			labelledBy.push( this.gridId + "-title" );

			element = $( "<div>" );
			this._addClass( element, "ui-calendar-group" );

			header = this._buildHeader();
			this._addClass( header, "ui-calendar-header-" +
				( ( months[ i ].first ) ? "first" : ( months[ i ].last ) ? "last" : "middle" )
			);

			element.appendTo( this.element )
				.append( header )
				.append( this._buildGrid() );
		}

		this._addClass( this.element, "ui-calendar-multi" )
			._addClass( rowBreak, "ui-calendar-row-break" );

		this.element
			.attr( "aria-labelledby", labelledBy.join( " " ) )
			.append( rowBreak );

		this.viewDate = currentDate;
	},

	_buildHeaderButtons: function() {
		var buttons = $( "<div>" );

		this._addClass( buttons, "ui-calendar-header-buttons" );

		return buttons
			.append( this.prevButton = this._buildIconButton( "prev" ) )
			.append( this.nextButton = this._buildIconButton( "next" ) );
	},

	_buildIconButton: function( key ) {
		var button = $( "<button>" ),
			icon = $( "<span>" );

		this._addClass( button, "ui-calendar-" + key )
			._addClass( icon, null, "ui-icon " + this.options.icons[ key + "Button" ] );

		return button.append( icon );
	},

	_buildHeader: function() {
		var header = $( "<div>" ),
			title = $( "<div>", { role: "header", id: this.gridId + "-title" } ),
			notice = $( "<span>" ).text( ", " + this._getTranslation( "datePickerRole" ) );

		this._addClass( header, "ui-calendar-header", "ui-widget-header ui-helper-clearfix" )
			._addClass( notice, null, "ui-helper-hidden-accessible" );

		return header.append(
			title
				.append( this._buildTitle() )
				.append( notice )
		);
	},

	_buildTitle: function() {
		var title = $( "<div>", { role: "alert", id: this.gridId + "-month-label" } ),
			month = this._buildTitleMonth(),
			year = this._buildTitleYear();

		this._addClass( title, "ui-calendar-title" )
			._addClass( month, "ui-calendar-month" )
			._addClass( year, "ui-calendar-year" );

		return title
			.append( month )
			.append( " " )
			.append( year );
	},

	_buildTitleMonth: function() {
		return $( "<span>" ).text( this.viewDate.monthName() );
	},

	_buildTitleYear: function() {
		return $( "<span>" ).text( this.viewDate.year() );
	},

	_buildGrid: function() {
		var table = $( "<table>", {
			role: "grid",
			tabindex: 0,
			"aria-readonly": true,
			"aria-labelledby": this.gridId + "-month-label",
			"aria-activedescendant": this._getDayId( this.date )
		} );

		this._addClass( table, "ui-calendar-calendar" );

		return table
			.append( this._buildGridHeading() )
			.append( this._buildGridBody() );
	},

	_buildGridHeading: function() {
		var head = $( "<thead role='presentation'>" ),
			week = $( "<th>" ),
			row = $( "<tr role='row'>" ),
			i = 0,
			weekDayLength = this.viewDate.weekdays().length,
			weekdays = this.viewDate.weekdays();

		if ( this.options.showWeek ) {
			this._addClass( week, "ui-calendar-week-col" );
			row.append( week.text( this._getTranslation( "weekHeader" ) ) );
		}

		for ( ; i < weekDayLength; i++ ) {
			row.append( this._buildGridHeaderCell( weekdays[ i ] ) );
		}

		return head.append( row );
	},

	_buildGridHeaderCell: function( day ) {
		return $( "<th role='columnheader' abbr='" + day.fullname +
				"' aria-label='" + day.fullname + "'>" +
			"<span title='" + day.fullname + "'>" + day.shortname + "</span>" +
		"</th>" );
	},

	_buildGridBody: function() {
		var days = this.viewDate.days(),
			i = 0,
			rows = "";

		for ( ; i < days.length; i++ ) {
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
		for ( ; i < week.days.length; i++ ) {
			cells += this._buildDayCell( week.days[ i ] );
		}

		return "<tr role='row'>" + cells + "</tr>";
	},

	_buildDayCell: function( day ) {
		var content = "",
			dateObject = new Date( day.timestamp ),
			dayName = this._calendarDateOptions.formatWeekdayFull( dateObject ),
			attributes = [
				"role='gridcell'",
				"aria-selected='" + ( this._isCurrent( day ) ? true : false ) + "'",
				"aria-label='" + dayName + ", " + this._format( dateObject ) + "'",
				"aria-describedby='" + this.gridId + "-month-label'"
			],
			selectable = ( day.selectable && this._isValid( dateObject ) );

		if ( day.render ) {
			attributes.push(
				"id='" + this.id + "-" + day.year + "-" + day.month + "-" + day.date + "'"
			);

			if ( !selectable ) {
				attributes.push( "aria-disabled='true'" );
				attributes.push( "class='ui-state-disabled'" );
			}

			content = this._buildDayElement( day, selectable );
		}

		return "<td " + attributes.join( " " ) + ">" + content + "</td>";
	},

	_getDayId: function( date ) {
		return this.id + "-" + date.year() + "-" + date.month() + "-" + date.day();
	},

	_buildDayElement: function( day, selectable ) {
		var attributes, content,
			classes = [ "ui-state-default" ];

		if ( day === this.date && selectable ) {
			classes.push( "ui-state-focus" );
		}
		if ( this._isCurrent( day ) ) {
			classes.push( "ui-state-active" );
		}
		if ( day.today ) {
			classes.push( "ui-state-highlight" );
		}
		if ( day.extraClasses ) {
			classes.push( day.extraClasses.split( " " ) );
		}

		attributes = " class='" + classes.join( " " ) + "'";
		if ( selectable ) {
			attributes += " tabindex='-1' data-ui-calendar-timestamp='" + day.timestamp + "'";
		} else {
			attributes += " disabled='disabled'";
		}
		content = "<button" + attributes + ">" + day.date + "</button>";

		if ( day.today ) {
			content += "<span class='ui-helper-hidden-accessible'>, " +
				this._getTranslation( "currentText" ) + "</span>";
		}

		return content;
	},

	_isCurrent: function( day ) {
		return this.options.value && day.timestamp === this.options.value.getTime();
	},

	_createButtonPane: function() {
		this.buttonPane = $( "<div>" );
		this.buttonSet = $( "<div>" ).appendTo( this.buttonPane );

		this._addClass(
				this.buttonPane, "ui-calendar-buttonpane", "ui-widget-content ui-helper-clearfix"
			)
			._addClass( this.buttonSet, "ui-calendar-buttonset" );

		this._createButtons();
	},

	_createButtons: function() {
		var that = this,
			buttons = this.options.buttons;

		this.buttonPane.remove();
		this.buttonSet.empty();

		if ( $.isEmptyObject( buttons ) || ( $.isArray( buttons ) && !buttons.length ) ) {
			this._removeClass( this.element, "ui-calendar-buttons" );
			return;
		}

		$.each( buttons, function( name, props ) {
			var click, buttonOptions;
			props = $.isFunction( props ) ?
				{ click: props, text: name } :
				props;

			// Default to a non-submitting button
			props = $.extend( { type: "button" }, props );

			// Change the context for the click callback to be the main element
			click = props.click;
			buttonOptions = {
				icon: props.icon,
				iconPosition: props.iconPosition,
				showLabel: props.showLabel
			};

			delete props.click;
			delete props.icon;
			delete props.iconPosition;
			delete props.showLabel;

			$( "<button></button>", props )
				.button( buttonOptions )
				.appendTo( that.buttonSet )
				.on( "click", function() {
					click.apply( that.buttonClickContext, arguments );
				} );
		} );

		this._addClass( this.element, "ui-calendar-buttons" );
		this.buttonPane.appendTo( this.element );
	},

	// Refreshing the entire calendar during interaction confuses screen readers, specifically
	// because the grid heading is marked up as a live region and will often not update if it's
	// destroyed and recreated instead of just having its text change.
	refresh: function() {
		this.labels = this.options.labels;

		// Determine which day grid cell to focus after refresh
		if ( this.options.numberOfMonths === 1 ) {
			this.element.find( ".ui-calendar-title" ).replaceWith( this._buildTitle() );
			this.element.find( ".ui-calendar-calendar" ).replaceWith( this._buildGrid() );
		} else {
			this._refreshMultiplePicker();
		}

		this.grid = this.element.find( ".ui-calendar-calendar" );

		this._setActiveDescendant();
		this._refreshHeaderButtons();
		this._createButtons();

		this._trigger( "refresh" );
	},

	_refreshHeaderButtons: function() {
		var prevText = this._getTranslation( "prevText" ),
			nextText = this._getTranslation( "nextText" );

		this.prevButton.attr( "title", prevText ).children().html( prevText );
		this.nextButton.attr( "title", nextText ).children().html( nextText );
		this._headerButtonsState();
	},

	_headerButtonsState: function() {
		var months = this.viewDate.months( this.options.numberOfMonths - 1 ),
			i = 0;

		for ( ; i < months.length; i++ ) {
			if ( this.options.min !== null && months[ i ].first ) {
				this._disableElement( this.prevButton,
					( this.options.min.getMonth() >= months[ i ].month() &&
					this.options.min.getFullYear() === months[ i ].year() ) ||
					this.options.min.getFullYear() > months[ i ].year()
				);
			}
			if ( this.options.max !== null && months[ i ].last ) {
				this._disableElement( this.nextButton,
					( this.options.max.getMonth() <= months[ i ].month() &&
					this.options.max.getFullYear() === months[ i ].year() ) ||
					this.options.max.getFullYear() < months[ i ].year()
				);
			}
		}
	},

	_disableElement: function( element, state ) {
		element.attr( "aria-disabled", state );
		this._toggleClass( element, null, "ui-state-disabled", state );
	},

	_refreshMultiplePicker: function() {
		var i = 0;

		for ( ; i < this.options.numberOfMonths; i++ ) {
			this.element.find( ".ui-calendar-title" ).eq( i ).replaceWith( this._buildTitle() );
			this.element.find( ".ui-calendar-calendar" ).eq( i ).replaceWith( this._buildGrid() );
			this.viewDate.adjust( "M", 1 );
		}
		this.viewDate.adjust( "M", -this.options.numberOfMonths );
	},

	_getTranslation: function( key ) {
		return $( "<a>" ).text( this.labels[ key ] ).html();
	},

	_setHiddenPicker: function() {
		this.element.attr( {
			"aria-hidden": "true",
			"aria-expanded": "false"
		} );
	},

	value: function( value ) {
		if ( arguments.length ) {
			this.valueAsDate( this._parse( value ) );
		} else {
			return this.option( "value" ) ===  null ?
				null :  this._format( this.option( "value" ) );
		}
	},

	valueAsDate: function( value ) {
		if ( arguments.length ) {
			this.option( "value", value );
		} else {
			return this.options.value;
		}
	},

	_isValid: function( value ) {
		if ( $.type( value ) !== "date" ) {
			return false;
		}

		if ( $.type( this.options.max ) === "date" ) {
			if ( value > this.options.max ) {
				return false;
			}
		}

		if ( $.type( this.options.min ) === "date" ) {
			if ( value < this.options.min ) {
				return false;
			}
		}

		return true;
	},

	_destroy: function() {
		this.element
			.removeAttr( "role aria-labelledby" )
			.removeUniqueId()
			.empty();
	},

	_setOptions: function( options ) {
		var that = this,
			create = false,
			refresh = false,
			dateAttributes = false;

		$.each( options, function( key, value ) {
			that._setOption( key, value );

			if ( key === "numberOfMonths" ) {
				create = true;
			}
			if ( key in that.refreshRelatedOptions ) {
				refresh = true;
			}
			if ( key === "dateFormat" || key === "locale" ) {
				dateAttributes = true;
			}
		} );

		if ( dateAttributes ) {
			this._setLocale( this.options.locale, this.options.dateFormat );
			this.date.setAttributes( this._calendarDateOptions );
			this.viewDate.setAttributes( this._calendarDateOptions );
		}
		if ( create || refresh ) {
			this.viewDate.setTimestamp( this.date.timestamp() );
		}
		if ( create ) {
			this.element.empty();
			this._removeClass( this.element, "ui-calendar-multi" );
			this._createCalendar();
			refresh = false;
		}
		if ( refresh ) {
			this.refresh();
		}
	},

	_setOption: function( key, value ) {
		if ( key === "value" ) {
			if ( this._isValid( value ) ) {
				this.date.setTimestamp( value.getTime() );
			} else {
				value = null;
			}
		}

		if ( key === "max" || key === "min" ) {
			if ( $.type( value ) !== "date" || value === null ) {
				this._super( key, null );
			} else {
				this._super( key, value );
			}
			return;
		}

		this._super( key, value );

		if ( key === "buttons" ) {
			this._createButtons();
		}

		if ( key === "disabled" ) {
			this.element
				.toggleClass( "ui-state-disabled", value )
				.attr( "aria-disabled", value );
		}

		if ( key === "eachDay" ) {
			this.viewDate.eachDay = value;
		}
	}
} );

} ) );
