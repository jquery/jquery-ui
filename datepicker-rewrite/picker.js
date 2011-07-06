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
		position: {
			my: "left top",
			at: "left bottom"
		}
	},
	_create: function() {
		var self = this;
		this.date = $.date();
		this.date.eachDay = this.options.eachDay;
		this.id = "ui-datepicker-" + idIncrement;
		idIncrement++;
		if ( this.element.is( "input" ) ) {
			self._bind( {
				click: "open",
				// TODO click on picker should not close
				blur: "close"
			});
			this.picker = $( "<div/>" ).insertAfter( this.element ).hide();
			this.picker.css( {
				position: "absolute"
			});
		} else {
			this.inline = true;
			this.picker = this.element;
		}
		this.picker.delegate( ".ui-datepicker-prev", "click", function( event ) {
			event.preventDefault();
			self.date.adjust( "M", -1 );
			self.refresh();
		});
		this.picker.delegate( ".ui-datepicker-next", "click", function( event ) {
			event.preventDefault();
			self.date.adjust( "M", 1 );
			self.refresh();
		});
		this.picker.delegate( ".ui-datepicker-calendar a", "click", function( event ) {
			event.preventDefault();
			// TODO exclude clicks on lead days or handle them correctly
			// TODO store/read more then just date, also required for multi month picker
			self.date.setDay( +$( this ).data( "day" ) ).select();
			if ( !self.inline ) {
				self.element.val( self.date.format() );
				self.close();
			} else {
				self.refresh();
			}
			self._trigger( "select", event, {
				date: self.date.format()
			});
		});

		this.picker.delegate( ".ui-datepicker-header a, .ui-datepicker-calendar a", "mouseenter.datepicker mouseleave.datepicker", function() {
			$( this ).toggleClass( "ui-state-hover" );
		});


		this.picker.delegate( ".ui-datepicker-calendar", "keydown", function(event) {
			if (jQuery.inArray(event.keyCode, [ 13, 33, 34, 35, 36, 37, 38, 39, 40]) == -1) {
				//only interested navigation keys
				return;
			}
			event.stopPropagation();
			event.preventDefault();

			var noDateChange = false,
				activeCell = $( "#" + self.grid.attr( "aria-activedescendant" ) )
				oldMonth = self.date.month();
				oldYear = self.date.year();

			switch ( event.keyCode ) {
				case $.ui.keyCode.ENTER:
					activeCell.children( "a" ).first().click();
					self.grid.focus( 1 );
					return;
					break;
				case $.ui.keyCode.PAGE_UP:
					self.date.adjust( event.ctrlKey || event.metaKey ? "Y" : "M", 1 );
					break;
				case $.ui.keyCode.PAGE_DOWN:
					self.date.adjust( event.ctrlKey || event.metaKey ? "Y" : "M", -1 );
					break;
				case $.ui.keyCode.END:
					self.date.setDay( self.date.daysInMonth() );
					break;
				case $.ui.keyCode.HOME:
					self.date.setDay( 1 );
					break;
				case $.ui.keyCode.LEFT:
					self.date.adjust( "D", -1 );
					break;
				case $.ui.keyCode.UP:
					self.date.adjust( "D", -7 );
					break;
				case $.ui.keyCode.RIGHT:
					self.date.adjust( "D", 1 );
					break;
				case $.ui.keyCode.DOWN:
					self.date.adjust( "D", 7 );
					break;
				default:
					return;
			}

			if ( self.date.month() != oldMonth || self.date.year() != oldYear ) {
				self.refresh();
				self.grid.focus(1);
			}
			else {
				var newId = self.id + "-" + self.date.day(),
					newCell = $("#" + newId);

				if ( !newCell.length ) {
					return;
				}
				self.grid.attr("aria-activedescendant", newId);

				activeCell.children("a").removeClass("ui-state-focus");
				newCell.children("a").addClass("ui-state-focus");
			}
		});

		this.refresh();
	},
	refresh: function() {
		this.date.refresh();
		this.picker.empty();

		//determine which day gridcell to focus after refresh
		//TODO: Prevent disabled cells from being focused
		var focusedDay = this.date.day();

		$( this.options.tmpl ).tmpl( {
			date: this.date,
			labels: $.global.localize( "datepicker" ),
			instance : {id : this.id, focusedDay : focusedDay}
		}).appendTo( this.picker )
			.find( "button" ).button().end()

		if ( this.inline ) {
			this.picker.children().addClass( "ui-datepicker-inline" );
		}
		// against display:none in datepicker.css
		this.picker.find( ".ui-datepicker" ).css( "display", "block" );
		this.grid = this.picker.find( ".ui-datepicker-calendar" );
	},
	open: function( event ) {
		this.picker.fadeIn( "fast" );

		this.picker.position( $.extend( {
			of: this.element
		}, this.options.position ));
	},
	close: function( event ) {
		this.picker.fadeOut();
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