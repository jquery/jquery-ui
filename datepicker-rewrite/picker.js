/*
 * Experimental datepicker rewrite to evaluate jquery-tmpl.
 * 
 * Based on Marc Grabanski's https://github.com/1Marc/jquery-ui-datepicker-lite
 */
(function( $, undefined ) {

$.widget( "ui.datepicker", {
	options: {
		eachDay: $.noop,
		tmpl: "#ui-datepicker-tmpl"
	},
	_create: function() {
		var self = this;
		this.date = $.date();
		this.date.eachDay = this.options.eachDay;
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
			self.date.adjust( "M", +1 )
			self.refresh();
		});
		this.picker.delegate( ".ui-datepicker-calendar a", "click", function( event ) {
			event.preventDefault();
			// TODO exclude clicks on lead days or handle them correctly
			// TODO store/read more then just date, also required for multi month picker
			self.date.setDay( +$( this ).text() ).select();
			if ( !self.inline ) {
				self.element.val( self.date.format() );
				self.close();
			} else {
				self.refresh();
			}
			self._trigger( "select", event, {
				date: self.date.format(),
			});
		});
		
		this.picker.delegate( ".ui-datepicker-header a, .ui-datepicker-calendar a", "mouseenter.datepicker mouseleave.datepicker", function() {
			$( this ).toggleClass( "ui-state-hover" );
		});
		
		this.refresh();
	},
	refresh: function() {
		this.date.refresh();
		this.picker.empty();

		$( this.options.tmpl ).tmpl( {
			date: this.date,
			labels: $.global.localize( "datepicker" )
		}).appendTo( this.picker )
			.find( "button" ).button().end()

		if ( this.inline ) {
			this.picker.children().addClass( "ui-datepicker-inline" );
		}		
		// against display:none in datepicker.css
		this.picker.find( ".ui-datepicker" ).css( "display", "block" );
	},
	open: function( event ) {
		this.picker.fadeIn( "fast" );
		this.picker.position({
			my: "left top",
			at: "left bottom",
			of: this.element
		});
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