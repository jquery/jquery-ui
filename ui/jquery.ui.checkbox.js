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
	version: "@VERSION",
	options: {
		disabled : null
	},
	_create: function() {

		var that = this;

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

		// wrap the checkbox in two new divs
		// move the checkbox's label inside the outer new div
		this.checkboxElement = this.element.wrap( "<div class='ui-checkbox-inputwrapper'></div>" ).parent().wrap( "<div></div>" ).parent()
			.addClass("ui-checkbox")
			.append(this.labelElement);

		this.boxElement = $("<div class='ui-checkbox-box ui-widget ui-state-active ui-corner-all'><span class='ui-checkbox-icon'></span></div>");
		this.iconElement = this.boxElement.children( ".ui-checkbox-icon" );
		this.checkboxElement.append(this.boxElement);

		this.element.bind("click.checkbox", function() {
			that._refresh();
		});

		this.element.bind("focus.checkbox", function() {
			if ( that.options.disabled ) {
				return;
			}
			that.boxElement
				.removeClass( "ui-state-active" )
				.addClass( "ui-state-focus" );
		});

		this.element.bind("blur.checkbox", function() {
			if ( that.options.disabled ) {
				return;
			}
			that.boxElement
				.removeClass( "ui-state-focus" )
				.not(".ui-state-hover")
				.addClass( "ui-state-active" );
		});

		this.checkboxElement.bind("mouseover.checkbox", function() {
			if ( that.options.disabled ) {
				return;
			}
			that.boxElement
				.removeClass( "ui-state-active" )
				.addClass( "ui-state-hover" );
		});

		this.checkboxElement.bind("mouseout.checkbox", function() {
			if ( that.options.disabled ) {
				return;
			}
			that.boxElement
				.removeClass( "ui-state-hover" )
				.not(".ui-state-focus")
				.addClass( "ui-state-active" );
		});

		if ( this.element.is(":disabled") ) {
			this._setOption( "disabled", true );
		}
		this._refresh();
	},

	_refresh: function() {
		var checked = this.element.is(":checked");
		this.iconElement.toggleClass( "ui-icon ui-icon-check", checked ).attr( "aria-checked", checked );
	},

	widget: function() {
		return this.checkboxElement;
	},

	destroy: function() {
		this.boxElement.remove();
		this.checkboxElement
			.after( this.labelElement ).end();
		this.element
			.unwrap( "<div></div>" )
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

}( jQuery ));
