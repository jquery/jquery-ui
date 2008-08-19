/*
 * jQuery UI Spinner
 *
 * Copyright (c) 2008 jQuery
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Spinner
 *
 * Depends:
 *  ui.core.js
 */
(function($) {

$.widget('ui.spinner', {
	_init: function() {
		
		// check for decimals in steppinng and set _decimals as internal (needs cleaning up)
		var decimals = 0;
		if (this.options.stepping.toString().indexOf('.') != -1) {
			var s = this.options.stepping.toString();
			this._decimals = s.slice(s.indexOf('.')+1, s.length).length;
		}
		
		//Initialize needed constants
		var self = this;
		this.element
			.addClass('ui-spinner-box')
			.attr('autocomplete', 'off'); // switch off autocomplete in opera
		
		this._setValue( isNaN(this._getValue()) ? this.options.start : this._getValue() );
		
		this.element
		.wrap('<div>')
		.parent()
			.addClass('ui-spinner')
			.append('<button class="ui-spinner-up">&#9650;</button>')
			.find('.ui-spinner-up')
				.bind('mousedown', function(e) {
					$(this).addClass('ui-spinner-pressed');
					if(!self.counter) self.counter = 1;
					self._mousedown(100, '_up', e);
				})
				.bind('mouseup', function(e) {
					$(this).removeClass('ui-spinner-pressed');
					if(self.counter == 1) self._up(e);
					self._mouseup(e);
				})
				.bind('mouseout', function(e) {
					$(this).removeClass('ui-spinner-pressed');
					self._mouseup(e);
				})
				// mousedown/mouseup capture first click, now handle second click
				.bind('dblclick', function(e) {
					$(this).removeClass('ui-spinner-pressed');
					self._up(e);
				})
				.bind('keydown.spinner', function(e) {
					var KEYS = $.ui.spinner.keys;
					if (e.keyCode == KEYS.SPACE || e.keyCode == KEYS.RETURN) {
						$(this).addClass('ui-spinner-pressed');
						if(!self.counter) self.counter = 1;
						self._up.call(self, e);
					} else if (e.keyCode == KEYS.DOWN || e.keyCode == KEYS.RIGHT) {
						self.element.siblings('.ui-spinner-down').focus();
					} else if (e.keyCode == KEYS.LEFT) {
						self.element.focus();
					}
				})
				.bind('keyup.spinner', function(e) {
					$(this).removeClass('ui-spinner-pressed');
					self.counter = 0;
					self._propagate('change', e);
				})
			.end()
			.append('<button class="ui-spinner-down">&#9660;</button>')
			.find('.ui-spinner-down')
				.bind('mousedown', function(e) {
					$(this).addClass('ui-spinner-pressed');
					if(!self.counter) self.counter = 1;
					self._mousedown(100, '_down', e);
				})
				.bind('mouseup', function(e) {
					$(this).removeClass('ui-spinner-pressed');
					if(self.counter == 1) self._down();
					self._mouseup(e);
				})
				.bind('mouseout', function(e) {
					$(this).removeClass('ui-spinner-pressed');
					self._mouseup(e);
				})
				// mousedown/mouseup capture first click, now handle second click
				.bind('dblclick', function(e) {
					$(this).removeClass('ui-spinner-pressed');
					self._down(e);
				})
				.bind('keydown.spinner', function(e) {
					var KEYS = $.ui.spinner.keys;
					if (e.keyCode == KEYS.SPACE || e.keyCode == KEYS.RETURN) {
						$(this).addClass('ui-spinner-pressed');
						if(!self.counter) self.counter = 1;
						self._down.call(self, e);
					} else if (e.keyCode == KEYS.UP || e.keyCode == KEYS.LEFT) {
						self.element.siblings('.ui-spinner-up').focus();
					}
				})
				.bind('keyup.spinner', function(e) {
					$(this).removeClass('ui-spinner-pressed');
					self.counter = 0;
					self._propagate('change', e);
				})
			.end();
		
		this.element
		.bind('keydown.spinner', function(e) {
			if(!self.counter) self.counter = 1;
			return self._keydown.call(self, e);
		})
		.bind('keyup.spinner', function(e) {
			self.counter = 0;
			self._propagate('change', e);
		})
		.bind('blur.spinner', function(e) {
			self._cleanUp() 
		});
		
		if ($.fn.mousewheel) {
			this.element.mousewheel(function(e, delta) {
				self._mousewheel(e, delta);
			});
		}
	},

	_constrain: function() {
		if(this.options.min != undefined && this._getValue() < this.options.min) this._setValue(this.options.min);
		if(this.options.max != undefined && this._getValue() > this.options.max) this._setValue(this.options.max);
	},
	_cleanUp: function() {
		this._setValue(this._getValue());
		this._constrain();
	},
	_spin: function(d, e) {
		if (this.disabled) return;
		
		if(isNaN(this._getValue())) this._setValue(this.options.start);
		this._setValue(this._getValue() + (d == 'up' ? 1:-1) * (this.options.incremental && this.counter > 100 ? (this.counter > 200 ? 100 : 10) : 1) * this.options.stepping);
		this._constrain();
		if(this.counter) this.counter++;
		this._propagate('spin', e);

	},
	_down: function(e) {
		this._spin('down', e);
		this._propagate('down', e);
	},
	_up: function(e) {
		this._spin('up', e);
		this._propagate('up', e);
	},
	_mousedown: function(i, d, e) {
		var self = this;
		i = i || 100;
		if(this.timer) window.clearInterval(this.timer);
		this.timer = window.setInterval(function() {
			self[d](e);
			if(self.counter > 20) self._mousedown(20, d, e);
		}, i);
	},
	_mouseup: function(e) {
		this.counter = 0;
		if(this.timer) window.clearInterval(this.timer);
		this.element[0].focus();
		this._propagate('change', e);
	},
	_keydown: function(e) {
		var KEYS = $.ui.spinner.keys;
		
		if(e.keyCode == KEYS.UP) this._up(e);
		if(e.keyCode == KEYS.DOWN) this._down(e);
		if(e.keyCode == KEYS.HOME) this._setValue(this.options.min || this.options.start); //Home key goes to min, if defined, else to start
		if(e.keyCode == KEYS.END && this.options.max != undefined) this._setValue(this.options.max); //End key goes to maximum
		return (e.keyCode == KEYS.TAB || e.keyCode == KEYS.BACKSPACE ||
			e.keyCode == KEYS.LEFT || e.keyCode == KEYS.RIGHT || e.keyCode == KEYS.PERIOD || 
			(/[0-9\-\.]/).test(String.fromCharCode(e.keyCode))) ? true : false;
	},
	_mousewheel: function(e, delta) {
		delta = ($.browser.opera ? -delta / Math.abs(delta) : delta);
		delta > 0 ? this._up(e) : this._down(e);
		e.preventDefault();
	},
	_getValue: function() {
		return parseFloat(this.element[0].value.replace(/[^0-9\-\.]/g, ''));
	},
	_setValue: function(newVal) {
		if(isNaN(newVal)) newVal = this.options.start;
		this.element[0].value = (
			this.options.currency ? 
				$.ui.spinner.format.currency(newVal, this.options.currency) : 
				$.ui.spinner.format.number(newVal, this._decimals)
		);
	},
	
	
	plugins: {},
	ui: function(e) {
		return {
			options: this.options,
			element: this.element,
			value: this._getValue()
		};
	},
	_propagate: function(n,e) {
		$.ui.plugin.call(this, n, [e, this.ui()]);
		return this.element.triggerHandler(n == 'spin' ? n : 'spin'+n, [e, this.ui()], this.options[n]);
	},
	destroy: function() {
		if(!$.data(this.element[0], 'spinner')) return;
		if ($.fn.mousewheel) {
			this.element.unmousewheel();
		}
		this.element
			.removeClass('ui-spinner-box')
			.removeAttr('disabled')
			.removeData('spinner')
			.unbind('.spinner')
			.siblings()
				.remove()
			.end()
			.parent()
				.removeClass('ui-spinner ui-spinner-disabled')
				.before(this.element.clone())
				.remove()
			.end();
	},
	enable: function() {
		this.element
			.removeAttr('disabled')
			.siblings()
				.removeAttr('disabled')
			.parent()
				.removeClass('ui-spinner-disabled');
		this.disabled = false;
	},
	disable: function() {
		this.element
			.attr('disabled', true)
			.siblings()
				.attr('disabled', true)
			.parent()
				.addClass('ui-spinner-disabled');
		this.disabled = true;
	}
});

$.extend($.ui.spinner, {
	defaults: {
		stepping: 1,
		start: 0,
		incremental: true,
		currency: false
	},
	format: {
		number: function(num, dec) {
			return this.round(num, dec);
		},
		currency: function(num, sym) {
			return (num !== Math.abs(num) ? '-' : '') + sym + this.round(Math.abs(num), 2);
		},
		round: function(num, dec) {
			if (dec > 0) {
				var s = num + ((num.toString().indexOf('.') == -1) ? '.' : '') + '0000000001';
				s = s.substr(0, s.indexOf('.')+1+dec);
			} else {
				var s = Math.round(num);
			}
			return s;
		}
	},
	keys: {
		BACKSPACE: 8,
		TAB: 9,
		RETURN: 13,
		ESC: 27,
		SPACE: 32,
		PAGEUP: 33,
		PAGEDOWN: 34,
		END: 35,
		HOME: 36,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		DEL: 46,
		COMMA: 188,
		PERIOD: 190
	}
});

})(jQuery);
