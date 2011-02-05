/*
 * jQuery UI Datepicker Lite
 *
 * Copyright 2010 Marc Grabanski
 * Licensed under the MIT license
 *
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.position.js
 *	jquery.ui.button.js
 *	jquery.date.js
 *	jquery.tmpl.js
 *  jquery.ui.datepicker.html
 */
(function( $, undefined ) {

$.widget( "ui.datepicker", {
	options: {
	},
	_create: function() {
		var self = this;
		this.date = $.date();
		if (this.element.is("input")) {
			self._bind( {
				click: "open",
				// TODO click on picker should not close
				blur: "close"
			});
			this.picker = $("<div/>").insertAfter(this.element).hide();
			this.picker.css({
				position: "absolute"
			});
		} else {
			this.inline = true;
			this.picker = this.element;
		}
		this.picker.delegate(".ui-datepicker-prev", "click", function() {
			self.date.adjust("M", -1);
			self.refresh();
		});
		this.picker.delegate(".ui-datepicker-next", "click", function() {
			self.date.adjust("M", +1)
			self.refresh();
		});
		this.picker.delegate(".ui-datepicker-calendar a", "click", function( event ) {
			self.date.setDay( +$(this).text() );
			if (!self.inline) {
				self.element.val( self.date.format() );
				self.close();
			}
			self._trigger("select", event, {
				date: self.date.format(),
			});
		});
		
		this.refresh();
	},
	refresh: function() {
		this.date.refresh();
		this.picker.empty();

		$("#ui-datepicker-tmpl").tmpl({
			date: this.date
		}).appendTo(this.picker)
			.find("button").button().end()
		
		// against display:none in datepicker.css
		this.picker.find(".ui-datepicker").css("display", "block");
		this._hoverable( this.picker.find( ".ui-datepicker-header a" ) );
		this._hoverable( this.picker.find( ".ui-datepicker-header a, .ui-datepicker-calendar a" ) );
	},
	_setOption: function( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
		if ( key === "" ) {
		}
	},
	open: function( event ) {
		this.picker.fadeIn( "fast" );
		// would open ever get called for non-inline datepickers?
		if (!this.inline) {
			this.picker.position({
				my: "left top",
				at: "left bottom",
				of: this.element
			});
		}
	},
	close: function( event ) {
		this.picker.fadeOut();
	},
	destroy: function() {
		if (!this.inline) {
			this.picker.remove();
		}
	},
	widget: function() {
		return this.picker;
	}
});

}( jQuery ));