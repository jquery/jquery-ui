/*
 * Experimental datepicker rewrite to evaluate jquery-tmpl.
 *
 * Based on Marc Grabanski's https://github.com/1Marc/jquery-ui-datepicker-lite
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
		// TODO replace with builder methods
		tmpl: "#ui-datepicker-tmpl",
		gridTmpl: "#ui-datepicker-grid-tmpl",
		position: {
			my: "left top",
			at: "left bottom"
		},
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
				this.date.adjust( "M", -1 );
				this.refresh();
			},
			"click .ui-datepicker-next": function( event ) {
				event.preventDefault();
				this.date.adjust( "M", 1 );
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
	// TODO replace with builder methods
	_createTmpl: function() {
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
	_focusTrigger: function( event ) {
		suppressExpandOnFocus = true;
		this.element.focus();
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
		// TODO fix me
		this.grid = this.grid.replaceWith( newGrid );
		this.grid = newGrid;
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
