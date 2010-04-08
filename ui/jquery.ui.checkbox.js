/*
 * jQuery UI Checkbox @VERSION
 *
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * {{TODO replace with docs link once plugin is released}}
 * http://wiki.jqueryui.com/Checkbox
 * {{/TODO}}
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function( $ ) {

var checkboxId = 0;

$.widget( "ui.checkbox", {

	_create: function() {

		// look for label as container of checkbox
		this.labelElement = this.element.closest( "label" );
		if ( this.labelElement.length ) {
			// move the checkbox outside (before) the label
			this.element.insertBefore( this.labelElement );

			// the checkbox needs an id since it's no longer inside the label
			if ( !this.element.attr( "id" ) ) {
				this.element.attr( "id", "ui-checkbox-" + checkboxId );
				checkboxId += 1;
			}

			// associate label by for=id of checkbox
			this.labelElement.attr( "for", this.element.attr("id") );
		} else {
			// look for label by for=id of checkbox
			this.labelElement = $( this.element[0].ownerDocument ).find( "label[for=" + this.element.attr("id") + "]" );
		}

		// wrap the checkbox in a new div
		// move the checkbox's label inside the new div
		this.checkboxElement = this.element.wrap( "<div></div>" ).parent()
			.addClass("ui-checkbox")
			.append(this.labelElement);

	},

	widget: function() {
		return this.checkboxElement;
	},

	destroy: function() {
		this.checkboxElement
			.after( this.labelElement ).end()
			.unwrap( "<div></div>" );

		$.Widget.prototype.destroy.apply( this, arguments );
	},

	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this.element
				.attr( "disabled", value );
			this.checkboxElement
				[ value ? "addClass" : "removeClass" ]( "ui-checkbox-disabled" );
		}
		
		$.Widget.prototype._setOption.apply( this, arguments );
	},

});

$.extend( $.ui.checkbox, {
	version: "@VERSION"
});

}( jQuery ));
