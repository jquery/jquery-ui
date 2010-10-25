/*
 * jQuery UI Spinner @VERSION
 *
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Spinner
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function($) {

// shortcut constants
var hover = 'ui-state-hover',
	active = 'ui-state-active',
	namespace = '.spinner',
	pageModifier = 10;

$.widget('ui.spinner', {
	options: {
		incremental: true,
		max: Number.MAX_VALUE,
		min: -Number.MAX_VALUE,
		numberformat: "n",
		step: 1,
		value: null
	},
	
	_create: function() {		
		this.value(this.options.value !== null ? this.options.value : this.element.val());
		this._draw();
		this._mousewheel();
		this._aria();
	},
	_draw: function() {
		var self = this,
			options = self.options;

		var uiSpinner = self.element
			.addClass('ui-spinner-input')
			.attr('autocomplete', 'off')
			.wrap(self._uiSpinnerHtml())
			.parent()
				// add buttons
				.append(self._buttonHtml())
				// add behaviours
				.hover(function() {
					if (!options.disabled) {
						$(this).addClass(hover);
					}
					self.hovered = true;
				}, function() {
					$(this).removeClass(hover);
					self.hovered = false;
				});

		// TODO: need a better way to exclude IE8 without resorting to $.browser.version
		// fix inline-block issues for IE. Since IE8 supports inline-block we need to exclude it.
		if (!$.support.opacity && uiSpinner.css('display') == 'inline-block' && $.browser.version < 8) {
			uiSpinner.css('display', 'inline');
		}

		this.element
			.bind('keydown'+namespace, function(event) {
				if (self._start(event)) {
					return self._keydown(event);
				}
				return true;
			})
			.bind('keyup'+namespace, function(event) {
				if (self.spinning) {
					self._stop(event);
					self._change(event);					
				}
			})
			.bind('focus'+namespace, function() {
				uiSpinner.addClass(active);
				self.focused = true;
			})
			.bind('blur'+namespace, function(event) {
				self.value(self.element.val());
				if (!self.hovered) {
					uiSpinner.removeClass(active);
				}		
				self.focused = false;
			});

		// disable spinner if element was already disabled
		if (options.disabled) {
			this.disable();
		}
		
		// button bindings
		this.buttons = uiSpinner.find('.ui-spinner-button')
			.attr("tabIndex", -1)
			.button()
			.first()
				.removeClass("ui-corner-all")
			.end()
			.last()
				.removeClass("ui-corner-all")
			.end()
			.bind('mousedown', function(event) {				
				if (self._start(event) === false) {
					return false;
				}
				self._repeat(null, $(this).hasClass('ui-spinner-up') ? 1 : -1, event);
			})
			.bind('mouseup', function(event) {
				if (self.counter == 1) {
					self._spin(($(this).hasClass('ui-spinner-up') ? 1 : -1) * self.options.step, event);
				}
				if (self.spinning) {
					self._stop(event);
					self._change(event);					
				}
			})
			.bind("mouseenter", function() {
				// button will add ui-state-active if mouse was down while mouseleave and kept down
				if ($(this).hasClass("ui-state-active")) {
					if (self._start(event) === false) {
						return false;
					}
					self._repeat(null, $(this).hasClass('ui-spinner-up') ? 1 : -1, event);
				}
			})
			.bind("mouseleave", function() {
				if (self.timer && self.spinning) {
					self._stop(event);
					self._change(event);
				}
			})
					
		self.uiSpinner = uiSpinner;
	},
	_uiSpinnerHtml: function() {
		return '<div role="spinbutton" class="ui-spinner ui-state-default ui-widget ui-widget-content ui-corner-all"></div>';
	},
	_buttonHtml: function() {
		return '<a class="ui-spinner-button ui-spinner-up ui-corner-tr"><span class="ui-icon ui-icon-triangle-1-n">&#9650;</span></a>' +
				'<a class="ui-spinner-button ui-spinner-down ui-corner-br"><span class="ui-icon ui-icon-triangle-1-s">&#9660;</span></a>';
	},
	_start: function(event) {
		if (!this.spinning && this._trigger('start', event, { value: this.value()}) !== false) {
			if (!this.counter) {
				this.counter = 1;
			}
			this.spinning = true;
			return true;
		}
		return false;
	},
	_spin: function(step, event) {
		if (this.options.disabled) {
			return;
		}
		if (!this.counter) {
			this.counter = 1;
		}
		
		var newVal = this.value() + step * (this.options.incremental && this.counter > 100
			? this.counter > 200
				? 100 
				: 10
			: 1);
		
		// cancelable
		if (this._trigger('spin', event, { value: newVal }) !== false) {
			this.value(newVal);
			this.counter++;			
		}
	},
	_stop: function(event) {
		this.counter = 0;
		if (this.timer) {
			window.clearInterval(this.timer);
		}
		this.element[0].focus();
		this.spinning = false;
		this._trigger('stop', event);
	},
	_change: function(event) {
		this._trigger('change', event);
	},
	_repeat: function(i, steps, event) {
		var self = this;
		i = i || 100;

		if (this.timer) {
			window.clearTimeout(this.timer);
		}
		
		this.timer = window.setTimeout(function() {
			self._repeat(self.options.incremental && self.counter > 20 ? 20 : i, steps, event);
		}, i);
		
		self._spin(steps*self.options.step, event);
	},
	_keydown: function(event) {
		var o = this.options,
			KEYS = $.ui.keyCode;

		switch (event.keyCode) {
		case KEYS.UP:
			this._repeat(null, 1, event);
			return false;
		case KEYS.DOWN:
			this._repeat(null, -1, event);
			return false;
		case KEYS.PAGE_UP:
			this._repeat(null, pageModifier, event);
			return false;
		case KEYS.PAGE_DOWN:
			this._repeat(null, -pageModifier, event);
			return false;
			
		case KEYS.ENTER:
			this.value(this.element.val());
		}
		
		return true;
	},
	_mousewheel: function() {
		if (!$.fn.mousewheel)
			return;
		var self = this;
		this.element.mousewheel(function(event, delta) {
			delta = ($.browser.opera ? -delta / Math.abs(delta) : delta);
			if (!self._start(event)) {
				return false;
			}
			self._spin((delta > 0 ? 1 : -1) * self.options.step, event);
			if (self.timeout) {
				window.clearTimeout(self.timeout);
			}
			self.timeout = window.setTimeout(function() {
				if (self.spinning) {
					self._stop(event);
					self._change(event);
				}
			}, 400);
			event.preventDefault();
		});
	},
	value: function(newVal) {
		if (!arguments.length) {
			return this._parse(this.element.val());
		}
		this._setOption('value', newVal);
	},
	_getData: function(key) {
		switch (key) {
			case 'min':
			case 'max':
			case 'step':
				return this['_'+key]();
				break;
		}
		return this.options[key];
	},
	_setOption: function(key, value) {
		if (key == 'value') {
			value = this._parse(value);
			if (value < this.options.min) {
				value = this.options.min;
			}
			if (value > this.options.max) {
				value = this.options.max;
			}
		}		
		$.Widget.prototype._setOption.call( this, key, value );
		this._afterSetData(key, value);
	},
	_afterSetData: function(key, value) {
		switch(key) {
			case 'max':
			case 'min':
			case 'step':
				if (value != null) {
					// write attributes back to element if original exist
					if (this.element.attr(key)) {
						this.element.attr(key, value);
					}
				}
				this._aria();
				break;
			case 'value':
				this._format(this._parse(this.options.value));
				break;
		}
	},
	_aria: function() {
		this.uiSpinner
				.attr('aria-valuemin', this.options.min)
				.attr('aria-valuemax', this.options.max)
				.attr('aria-valuenow', this.value());
	},
	
	_parse: function(val) {
		var input = val;
		if (typeof val == 'string') {
			// special case for currency formatting until Globalization handles currencies
			if (this.options.numberformat == "C" && window.Globalization) {
				// parseFloat should accept number format, including currency
				var culture = Globalization.culture || Globalization.cultures['default'];
				val = val.replace(culture.numberFormat.currency.symbol, "");
			}
			val = window.Globalization ? Globalization.parseFloat(val) : +val;
		}
		console.log("input", input, "parsed", val)
		return isNaN(val) ? null : val;
	},
	_format: function(num) {
		this.element.val( window.Globalization ? Globalization.format(num, this.options.numberformat) : num );
	},
		
	destroy: function() {
		if ($.fn.mousewheel) {
			this.element.unmousewheel();
		}
		
		this.element
			.removeClass('ui-spinner-input')
			.removeAttr('disabled')
			.removeAttr('autocomplete')
			.removeData('spinner')
			.unbind(namespace);
		
		this.uiSpinner.replaceWith(this.element);	
	},
	enable: function() {
		this.element
			.removeAttr('disabled')
			.siblings()
				.removeAttr('disabled')
			.parent()
				.removeClass('ui-spinner-disabled ui-state-disabled');
		this.options.disabled = false;
	},
	disable: function() {
		this.element
			.attr('disabled', true)
			.siblings()
				.attr('disabled', true)
			.parent()
				.addClass('ui-spinner-disabled ui-state-disabled');
		this.options.disabled = true;
	},
	stepUp: function(steps) {
		this._spin((steps || 1) * this.options.step, null);
		return this;
	},
	stepDown: function(steps) {
		this._spin((steps || 1) * -this.options.step, null);	
		return this;
	},
	pageUp: function(pages) {
		return this.stepUp((pages || 1) * this.options.page);		
	},
	pageDown: function(pages) {
		return this.stepDown((pages || 1) * this.options.page);		
	},
	
	widget: function() {
		return this.uiSpinner;
	}
});

})(jQuery);
