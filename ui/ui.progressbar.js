/*
 * jQuery UI Progressbar @VERSION
 *
 * Copyright (c) 2008 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   ui.core.js
 */
(function($) {

$.widget("ui.progressbar", {

	_init: function() {

		var self = this,
			options = this.options;

		this.element
			.addClass("ui-progressbar"
				+ " ui-progressbar-labelalign-" + this._labelAlign()
				+ " ui-widget-content"
				+ " ui-corner-all")
			.attr({
				role: "progressbar",
				"aria-valuemin": this._valueMin(),
				"aria-valuemax": this._valueMax(),
				"aria-valuenow": this._value()
			});

		this.element
			.append('<div class="ui-progressbar-label"></div>')
			.append('<div class="ui-progressbar-value ui-state-default ui-corner-left">'
				+ '<div class="ui-progressbar-label"></div>'
			+ '</div>'
			);

		this.valueDiv = this.element.find(".ui-progressbar-value");
		this.valueLabel = this.valueDiv.find(".ui-progressbar-label");
		this.labels = this.element.find(".ui-progressbar-label");

		this._refreshLabel();
		this._refreshValue();
		this._refreshWidth();
		this._refreshHeight();

	},

	destroy: function() {

		this.element
			.removeClass("ui-progressbar"
				+ " ui-progressbar-disabled"
				+ " ui-progressbar-labelalign-left"
				+ " ui-progressbar-labelalign-center"
				+ " ui-progressbar-labelalign-right"
				+ " ui-widget-content"
				+ " ui-corner-all")
			.removeAttr("role")
			.removeAttr("aria-valuemin")
			.removeAttr("aria-valuemax")
			.removeAttr("aria-valuenow")
			.removeData("progressbar")
			.unbind(".progressbar");

		this.labels.remove();
		this.valueDiv.remove();

	},

	disable: function() {
		this.element.attr("aria-disabled", true);
	},

	enable: function() {
		this.element.attr("aria-disabled", false);
	},

	value: function(newValue) {
		arguments.length && this._setData("value", newValue);
		return this._value();
	},

	_setData: function(key, value){
		switch (key) {
			case 'height':
				this.options.height = value;
				this._refreshHeight();
				break;
			case 'label':
				this.options.label = value;
				this._refreshLabel();
				break;
			case 'labelAlign':
				this.options.labelAlign = value;
				this._refreshLabelAlign();
				break;
			case 'value':
				this.options.value = value;
				this._refreshLabel();
				this._refreshValue();
				this._trigger('change', null, {});
				break;
			case 'width':
				this.options.width = value;
				break;
		}

		$.widget.prototype._setData.apply(this, arguments);
	},

	//Property Getters - these return valid property values without modifying options
	_labelText: function() {
		var labelText;

		if (this.options.label === true) {
			labelText = this.value() + '%';
		} else {
			labelText = this.options.label;
		}

		return labelText;
	},

	_labelAlign: function() {
		var labelAlign;

		switch (this.options.labelAlign.toLowerCase()) {
			case 'left':
			case 'center':
			case 'right':
				labelAlign = this.options.labelAlign;
				break;
			default:
				labelAlign = 'left';
		}

		return labelAlign.toLowerCase();
	},

	_value: function() {
		var val = this.options.value;
		if (val < this._valueMin()) val = this._valueMin();
		if (val > this._valueMax()) val = this._valueMax();

		return val;
	},

	_valueMin: function() {
		var valueMin = 0;

		return valueMin;
	},

	_valueMax: function() {
		var valueMax = 100;

		return valueMax;
	},

	//Refresh Methods - these refresh parts of the widget to match its current state
	_refreshHeight: function() {
		this.element.height(this.options.height);
	},

	_refreshLabel: function() {
		var labelText = this._labelText();

		// this extra wrapper div is required for padding to work with labelAlign: left and labelAlign: right
		this.labels.html("<div>" + labelText + "</div>");
	},

	_refreshLabelAlign: function() {
		var labelAlign = this._labelAlign();
		this.element
			.removeClass("ui-progressbar-labelalign-left"
				+ " ui-progressbar-labelalign-center"
				+ " ui-progressbar-labelalign-right")			
			.addClass("ui-progressbar-labelalign-" + labelAlign);
	},

	_refreshValue: function() {
		var value = this.value();
		this.valueDiv.width(value + '%');
		this.element.attr("aria-valuenow", value);
	},
	
	_refreshWidth: function() {
		this.element.add(this.valueLabel).width(this.options.width);
	}

});

$.extend($.ui.progressbar, {
	version: "@VERSION",
	defaults: {
		height: 20,
		label: true,
		labelAlign: 'left',
		value: 0,
		width: 300
	}
});

})(jQuery);
