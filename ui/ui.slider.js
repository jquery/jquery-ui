/*
 * jQuery UI Slider @VERSION
 *
 * Copyright (c) 2008 AUTHORS.txt (http://ui.jquery.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	ui.core.js
 */

(function($) {

$.widget("ui.slider", $.extend({}, $.ui.mouse, {

	_init: function() {

		var self = this;

		this._keySliding = false;

		this._mouseInit();

		this.element
			.addClass("ui-slider"
				+ " ui-slider-" + this._orientation()
				+ " ui-widget"
				+ " ui-widget-content"
				+ " ui-corner-all");

		this.range = $([]);

		if (this.options.range) {
			if (this.options.range === true) {
				//this.range = $('<a href="#"></a>');
				this.range = $('<div></div>');
				if (!this.options.values) this.options.values = [this._valueMin(), this._valueMin()];
				if (this.options.values.length && this.options.values.length != 2) {
					this.options.values = [this.options.values[0], this.options.values[0]];
				}
			} else {
				this.range = $('<div></div>');
			}
			this.range
				.appendTo(this.element)
				.addClass("ui-slider-range"
					+ " ui-widget-header");

			var oRange = this.options.range, oOrientation = this._orientation();
			(oRange == "min") && (oOrientation == "horizontal") && this.range.css({ left : 0 });
			(oRange == "max") && (oOrientation == "horizontal") && this.range.css({ right : 0 });
			(oRange == "min") && (oOrientation == "vertical") && this.range.css({ bottom : 0 });
			(oRange == "max") && (oOrientation == "vertical") && this.range.css({ top : 0 });
		}

		if ($(".ui-slider-handle", this.element).length == 0)
			$('<a href="#"></a>')
				.appendTo(this.element)
				.addClass("ui-slider-handle");

		if (this.options.values && this.options.values.length) {
			while ($(".ui-slider-handle", this.element).length < this.options.values.length)
				$('<a href="#"></a>')
					.appendTo(this.element)
					.addClass("ui-slider-handle");
		}

		this.handles = $(".ui-slider-handle", this.element)
			.addClass("ui-state-default"
				+ " ui-corner-all");

		this.handle = this.handles.eq(0);

		this.handles.add(this.range).filter("a")
			.click(function(event) { event.preventDefault(); })
			.hover(function() { $(this).addClass('ui-state-hover'); }, function() { $(this).removeClass('ui-state-hover'); })
			.focus(function() { self.handles.removeClass('ui-state-focus'); $(this).addClass('ui-state-focus'); })
			.blur(function() { $(this).removeClass('ui-state-focus'); });

		this.handles.each(function(i) {
			$(this).data("index.ui-slider-handle", i);
		})

		this.handles.keydown(function(event) {
			var index = $(this).data("index.ui-slider-handle");

			if (self.options.disabled)
				return;

			switch (event.keyCode) {
				case $.ui.keyCode.HOME:
				case $.ui.keyCode.END:
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					if (!self._keySliding) {
						self._keySliding = true;
						$(this).addClass("ui-state-active");
						self._start(event);
					}
					break;
			}

			var curVal, newVal, step = self._step();
			if (self.options.values && self.options.values.length) {
				curVal = newVal = self.values(index);
			} else {
				curVal = newVal = self.value();
			}

			switch (event.keyCode) {
				case $.ui.keyCode.HOME:
					newVal = self._valueMin();
					break;
				case $.ui.keyCode.END:
					newVal = self._valueMax();
					break;
				case $.ui.keyCode.UP:
				case $.ui.keyCode.RIGHT:
					newVal = curVal + step;
					break;
				case $.ui.keyCode.DOWN:
				case $.ui.keyCode.LEFT:
					newVal = curVal - step;
					break;
			}

			self._slide(event, newVal);
		}).keyup(function(event) {
			if (self._keySliding) {
				self._stop(event);
				self._change(event);
				self._keySliding = false;
				$(this).removeClass("ui-state-active");
			}
		});

		this._refreshValue();

	},

	destroy: function() {

		this.handles.remove();

		this.element
			.removeClass("ui-slider"
				+ " ui-slider-horizontal"
				+ " ui-slider-vertical"
				+ " ui-slider-disabled"
				+ " ui-widget"
				+ " ui-widget-content"
				+ " ui-corner-all")
			.removeData("slider")
			.unbind(".slider");

		this._mouseDestroy();

	},

	_mouseCapture: function(event) {

		var o = this.options;

		if (o.disabled)
			return false;

		this._start(event);

		this.elementSize = {
			width: this.element.outerWidth(),
			height: this.element.outerHeight()
		};
		this.elementOffset = this.element.offset();

		var position = { x: event.pageX, y: event.pageY };
		var normValue = this._normValueFromMouse(position);

		var distance = this._valueMax(), closestHandle;
		var self = this;
		this.handles.each(function(i) {
			var thisDistance = Math.abs(normValue - self.values(i));
			if (distance > thisDistance) {
				distance = thisDistance;
				closestHandle = $(this);
			}
		});

		closestHandle
			.addClass("ui-state-active")
			.focus();

		this._slide(event, normValue);

		return true;

	},

	_mouseStart: function(event) {
		return true;
	},

	_mouseDrag: function(event) {
		var position = { x: event.pageX, y: event.pageY };
		var normValue = this._normValueFromMouse(position);

		this._slide(event, normValue);

		return false;
	},

	_mouseStop: function(event) {
		this.handles.removeClass("ui-state-active");
		this._stop(event);
		this._change(event);

		return false;
	},

	_normValueFromMouse: function(position) {

		var pixelTotal, pixelMouse;
		if ('horizontal' == this._orientation()) {
			pixelTotal = this.elementSize.width;
			pixelMouse = position.x - this.elementOffset.left;
		} else {
			pixelTotal = this.elementSize.height;
			pixelMouse = position.y - this.elementOffset.top;
		}

		var percentMouse = (pixelMouse / pixelTotal);
		if (percentMouse > 1) percentMouse = 1;
		if (percentMouse < 0) percentMouse = 0;
		if ('vertical' == this._orientation())
			percentMouse = 1 - percentMouse;

		var valueTotal = this._valueMax() - this._valueMin();

		var valueMouse = percentMouse * valueTotal;

		var valueMouseModStep = valueMouse % this.options.step;

		var normValue = this._valueMin() + valueMouse - valueMouseModStep;

		if (valueMouseModStep > (this.options.step / 2))
			normValue += this.options.step;

		return normValue;
	},

	_start: function(event) {
		this._trigger("start", event, {
			value: this.value()
		});
	},

	_slide: function(event, newVal) {
		if (this.options.values && this.options.values.length) {
			var handle = this.handles.filter(".ui-state-active");
			var index = handle.data("index.ui-slider-handle");
			if (newVal != this.values(index)) {
				var newValues = this.values();
				newValues[index] = newVal;
				// A slide can be canceled by returning false from the slide callback
				var allowed = this._trigger("slide", event, {
					handle: handle,
					value: newVal,
					values: newValues
				});
				if (allowed !== false)
					this.values(index, newVal);
			}
		} else {
			if (newVal != this.value()) {
				// A slide can be canceled by returning false from the slide callback
				var allowed = this._trigger("slide", event, {
					value: newVal
				});
				if (allowed !== false)
					this._setData('value', newVal);
			}
		}
	},

	_stop: function(event) {
		this._trigger("stop", event, {
			value: this.value()
		});
	},

	_change: function(event) {
		this._trigger("change", event, {
			value: this.value()
		});
	},

	value: function(newValue) {
		if (arguments.length) {
			this._setData("value", newValue);
			this._change();
		}

		return this._value();
	},

	values: function(index, newValue) {
		if (arguments.length > 1) {
			this.options.values[index] = newValue;
			this._refreshValue();
			this._change();
		}

		if (arguments.length) {
			if (this.options.values && this.options.values.length) {
				return this._values(index);
			} else {
				return this.value();
			}
		} else {
			return this._values();
		}
	},

	_setData: function(key, value) {
		$.widget.prototype._setData.apply(this, arguments);

		switch (key) {
			case 'orientation':
				this.element
					.removeClass("ui-slider-horizontal ui-slider-vertical")
					.addClass("ui-slider-" + this._orientation());
				this._refreshValue();
				break;
			case 'value':
				this._refreshValue();
				break;
		}
	},

	_orientation: function() {
		var orientation = this.options.orientation;
		if (orientation != 'horizontal' && orientation != 'vertical')
			orientation = 'horizontal';

		return orientation;
	},

	_step: function() {
		var step = this.options.step;

		return step;
	},

	_value: function() {
		var val = this.options.value;
		if (val < this._valueMin()) val = this._valueMin();
		if (val > this._valueMax()) val = this._valueMax();

		return val;
	},

	_values: function(index) {
		if (arguments.length) {
			var val = this.options.values[index];
			if (val < this._valueMin()) val = this._valueMin();
			if (val > this._valueMax()) val = this._valueMax();

			return val;
		} else {
			return this.options.values;
		}
	},

	_valueMin: function() {
		var valueMin = this.options.min;

		return valueMin;
	},

	_valueMax: function() {
		var valueMax = this.options.max;

		return valueMax;
	},

	_refreshValue: function() {
		var oRange = this.options.range, oOrientation = this._orientation();

		if (this.options.values && this.options.values.length) {
			var self = this, vp0, vp1;
			this.handles.each(function(i, j) {
				var valPercent = (self.values(i) - self._valueMin()) / (self._valueMax() - self._valueMin()) * 100;
				$(this).css(oOrientation == 'horizontal' ? 'left' : 'bottom', valPercent + '%');
				if (self.options.range === true) {
					if (oOrientation == 'horizontal') {
						(i == 0) && self.range.css('left', valPercent + '%');
						(i == 1) && self.range.css('width', (valPercent - lastValPercent) + '%');
					} else {
						(i == 0) && self.range.css('bottom', (valPercent) + '%');
						(i == 1) && self.range.css('height', (valPercent - lastValPercent) + '%');
					}
				}
				lastValPercent = valPercent;
			});
		} else {
			var valPercent = (this.value() - this._valueMin()) / (this._valueMax() - this._valueMin()) * 100;
			this.handle.css(oOrientation == 'horizontal' ? 'left' : 'bottom', valPercent + '%');

			(oRange == "min") && (oOrientation == "horizontal") && this.range.css({ left: 0, width: valPercent + '%' });
			(oRange == "max") && (oOrientation == "horizontal") && this.range.css({ left: valPercent + '%', width: (100 - valPercent) + '%' });
			(oRange == "min") && (oOrientation == "vertical") && this.range.css({ top: (100 - valPercent) + '%', height: valPercent + '%' });
			(oRange == "max") && (oOrientation == "vertical") && this.range.css({ bottom: valPercent + '%', height: (100 - valPercent) + '%' });
		}
	}

}));

$.extend($.ui.slider, {
	getter: "value values",
	version: "@VERSION",
	defaults: {
		delay: 0,
		distance: 0,
		max: 100,
		min: 0,
		orientation: 'horizontal',
		range: false,
		step: 1,
		value: 0,
		values: null
	}
});

})(jQuery);
