/*
 * Experimental datepicker rewrite to evaluate jquery-tmpl.
 *
 * Based on Marc Grabanski's https://github.com/1Marc/jquery-ui-datepicker-lite
 */
(function( $, undefined ) {

var idIncrement = 0;
$.widget( "ui.datepicker", {
	options: {
		eachDay: $.noop,
		tmpl: "#ui-datepicker-tmpl",
		gridTmpl: "#ui-datepicker-grid-tmpl",
		position: {
			my: "left top",
			at: "left bottom"
		}
	},
	_create: function() {
		var that = this;
		this.date = $.date();
		this.date.eachDay = this.options.eachDay;
		this.id = "ui-datepicker-" + idIncrement;
		idIncrement++;
		if ( this.element.is( "input" ) ) {
			this.picker = $( "<div>" ).insertAfter( this.element ).popup({
				managed: true,
				expandOnFocus: true,
				open: function( event, ui ) {
					that.open( event );
				},
				focusPopup: function( event, ui ) {
					that.grid.focus( 1 );
				}
			});
		} else {
			this.inline = true;
			this.picker = this.element;
		}
		this.picker.delegate( ".ui-datepicker-prev", "click", function( event ) {
			event.preventDefault();
			that.date.adjust( "M", -1 );
			that.refresh();
		});
		this.picker.delegate( ".ui-datepicker-next", "click", function( event ) {
			event.preventDefault();
			that.date.adjust( "M", 1 );
			that.refresh();
		});
		this.picker.delegate( ".ui-datepicker-calendar a", "mousedown", function( event ) {
			event.preventDefault();
			// TODO exclude clicks on lead days or handle them correctly
			// TODO store/read more then just date, also required for multi month picker
			that.select( event, $( this ).data( "timestamp" ) );
			that.grid.focus( 1 );
		});

		this.picker.delegate( ".ui-datepicker-header a, .ui-datepicker-calendar a", "mouseenter.datepicker mouseleave.datepicker", function() {
			$( this ).toggleClass( "ui-state-hover" );
		});

		this.picker.delegate( ".ui-datepicker-calendar", "keydown.datepicker", function(event) {
			if (jQuery.inArray(event.keyCode, [ 13, 33, 34, 35, 36, 37, 38, 39, 40]) == -1) {
				//only interested navigation keys
				return;
			}
			event.stopPropagation();
			event.preventDefault();

			var activeCell = $( "#" + that.grid.attr( "aria-activedescendant" ) ),
				oldMonth = that.date.month(),
				oldYear = that.date.year();

			switch ( event.keyCode ) {
				case $.ui.keyCode.ENTER:
					activeCell.children( "a:first" ).mousedown();
					return;
					break;
				case $.ui.keyCode.PAGE_UP:
					that.date.adjust( event.altKey ? "Y" : "M", 1 );
					break;
				case $.ui.keyCode.PAGE_DOWN:
					that.date.adjust( event.altKey ? "Y" : "M", -1 );
					break;
				case $.ui.keyCode.END:
					that.date.setDay( that.date.daysInMonth() );
					break;
				case $.ui.keyCode.HOME:
					that.date.setDay( 1 );
					break;
				case $.ui.keyCode.LEFT:
					that.date.adjust( "D", -1 );
					break;
				case $.ui.keyCode.UP:
					that.date.adjust( "D", -7 );
					break;
				case $.ui.keyCode.RIGHT:
					that.date.adjust( "D", 1 );
					break;
				case $.ui.keyCode.DOWN:
					that.date.adjust( "D", 7 );
					break;
				default:
					return;
			}

			if ( that.date.month() != oldMonth || that.date.year() != oldYear ) {
				that.refresh();
				that.grid.focus( 1 );
			}
			else {
				var newId = that.id + "-" + that.date.day(),
					newCell = $("#" + newId);

				if ( !newCell.length ) {
					return;
				}
				that.grid.attr("aria-activedescendant", newId);

				activeCell.children("a").removeClass("ui-state-focus");
				newCell.children("a").addClass("ui-state-focus");
			}
		});

		this.createTmpl();
	},
	createTmpl: function() {
		this.date.refresh();

		$( this.options.tmpl ).tmpl( {
			date: this.date,
			labels: Globalize.localize( "datepicker" ),
			instance: {
				id: this.id,
				focusedDay: this.date.day()
			}
		}).appendTo( this.picker )
			.find( "button" ).button().end();

		if ( this.inline ) {
			this.picker.children().addClass( "ui-datepicker-inline" );
		}
		// against display:none in datepicker.css
		this.picker.find( ".ui-datepicker" ).css( "display", "block" );
		this.grid = this.picker.find( ".ui-datepicker-calendar" );
	},
	refresh: function() {
		//determine which day gridcell to focus after refresh
		//TODO: Prevent disabled cells from being focused
		this.date.refresh();
		$(".ui-datepicker-title", this.picker).html(
			$("#ui-datepicker-title-tmpl").tmpl( {
				date: this.date
		}));
		var newGrid = $( this.options.gridTmpl ).tmpl( {
			date: this.date,
			labels: Globalize.localize( "datepicker" ),
			instance: {
				id: this.id,
				focusedDay: this.date.day()
			}
		});
		this.grid = this.grid.replaceWith( newGrid );
		this.grid = newGrid;
	},
	open: function( event ) {
		if ( !this.inline ) {
			this.date = $.date( this.element.val() );
			this.date.eachDay = this.options.eachDay;
			this.date.select();
			this.refresh();
		}
	},
	close: function( event ) {
		this.picker.popup( "close" );
	},
	select: function( event, time ) {
		this.date.setTime( time ).select();
		this.refresh();
		if ( !this.inline ) {
			this.element.val( this.date.format() );
			this.picker.popup( "focusTrigger", event );
			this.close();
		}
		this._trigger( "select", event, {
			date: this.date.format()
		});
	},
	_destroy: function() {
		if ( !this.inline ) {
			this.picker.remove();
		}
	},
	widget: function() {
		return this.picker;
	}
});

}( jQuery ));
