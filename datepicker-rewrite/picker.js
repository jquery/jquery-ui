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
		self.element
			.bind( "mousedown.datepicker", function( event ) {
				self.open();
			})
			.bind( "keydown.datepicker", function( event ) {

			});
		this.date = $.date();
		if (this.element.is("input")) {
			this.picker = $("<div/>").insertAfter(this.element).hide();
		} else {
			this.inline = true;
			this.picker = this.element;
		}
		this.refresh();
	},
	refresh: function() {
		this.picker.empty();
		// TODO wrapper div get losts when appending to new element, works for inline
		$("#ui-datepicker-div").tmpl({
			date: this.date
		}).appendTo(this.picker)
		.find("button").button().end()
		// looks uglyyy
		//.find(".ui-datepicker-header a").button();
		if (this.inline) {
			// against display:none in datepicker.css
			this.picker.find(".ui-datepicker").css("display", "block");
		}
	},
	_setOption: function( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
		if ( key === "" ) {
		}
	},
	open: function( event ) {
		this.picker.show();
		/*
		if (this.picker != this.element) {
			this.picker.position({
				of: this.element
			});
		}
		*/
	},
	close: function( event ) {
		this.picker.hide();
	},
	destroy: function() {
	},
	widget: function() {
		return this.element;
	}
});

}( jQuery ));