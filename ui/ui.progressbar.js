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
			.addClass("ui-progressbar")
			.addClass("ui-progressbar-labelalign-" + this._labelAlign())
			.addClass("ui-widget-content")
			.addClass("ui-corner-all")
			.width(options.width)
			.height(options.height)
			.attr({
				role: "progressbar",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": this.options.value
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

	},

	destroy: function() {

		this.element
			.removeClass("ui-progressbar")
			.removeClass("ui-progressbar-disabled")
			.removeClass("ui-progressbar-labelalign-left")
			.removeClass("ui-progressbar-labelalign-center")
			.removeClass("ui-progressbar-labelalign-right")
			.removeClass("ui-widget-content")
			.removeClass("ui-corner-all")
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
		if (arguments.length) {
			this.options.value = newValue;
			this._updateValue(newValue);
		}

		var val = this.options.value;
		if (val < 0) val = 0;
		if (val > 100) val = 100;

		return val;
	},

	_setData: function(key, value){
		switch (key) {
			case 'height':
				this.element.height(value);
				break;
			case 'label':
				this._updateLabel(value);
				break;
			case 'labelAlign':
				this._updateLabelAlign(value);
				break;
			case 'label':
				this._updateValue(value);
				break;
			case 'value':
				this.value(value);
				break;
			case 'width':
				this.element.add(this.valueLabel).width(this.options.width);
				break;
		}

		$.widget.prototype._setData.apply(this, arguments);
	},

	//Setters
	_updateLabel: function(newLabel) {
		this.options.label = newLabel;
		this._refreshLabel();
	},

	_updateLabelAlign: function(newLabelAlign) {
		this.options.labelAlign = newLabelAlign;
		this._refreshLabelAlign();
	},

	_updateValue: function(newValue) {
		this._refreshLabel();
		this._refreshValue();
		this._trigger('change', null, {});
	},

	//Getters
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

	//Methods
	_refreshLabel: function() {
		var labelText = this._labelText();

		// this extra wrapper div is required for padding to work with labelAlign: left and labelAlign: right
		this.labels.html("<div>" + labelText + "</div>");
	},

	_refreshLabelAlign: function() {
		var labelAlign = this._labelAlign();
		this.element
			.removeClass("ui-progressbar-labelalign-left")
			.removeClass("ui-progressbar-labelalign-center")
			.removeClass("ui-progressbar-labelalign-right")			
			.addClass("ui-progressbar-labelalign-" + labelAlign);
	},

	_refreshValue: function() {
		var val = this.value();
		this.valueDiv.width(val + '%');
		this.element.attr("aria-valuenow", val);
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
