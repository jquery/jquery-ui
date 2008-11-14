/*
 * jQuery UI Spinner @VERSION
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
		this._trigger('init', null, this.ui(null));
		
		// perform data bind on generic objects
		if (typeof this.options.items[0] == 'object' && !this.element.is('input')) {
			var data = this.options.items;
			for (var i=0; i<data.length; i++) {
				this._addItem(data[i]);
			}
		}
		
		// check for decimals in steppinng and set _decimals as internal
		this._decimals = parseInt(this.options.decimals, 10);
		if (this.options.stepping.toString().indexOf('.') != -1 && this._decimals == 0) {
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
			.append('<button class="ui-spinner-up" type="button">&#9650;</button>')
			.find('.ui-spinner-up')
				.bind('mousedown', function(event) {
					$(this).addClass('ui-spinner-pressed');
					if (!self.counter) {
						self.counter = 1;
					}
					self._mousedown(100, '_up', event);
				})
				.bind('mouseup', function(event) {
					$(this).removeClass('ui-spinner-pressed');
					if (self.counter == 1) {
						self._up(event);
					}
					self._mouseup(event);
				})
				.bind('mouseout', function(event) {
					$(this).removeClass('ui-spinner-pressed');
					if (self.timer) {
						self._mouseup(event);
					}
				})
				// mousedown/mouseup capture first click, now handle second click
				.bind('dblclick', function(event) {
					$(this).removeClass('ui-spinner-pressed');
					self._up(event);
					self._mouseup(event);
				})
				.bind('keydown.spinner', function(event) {
					var KEYS = $.keyCode;
					if (event.keyCode == KEYS.SPACE || event.keyCode == KEYS.ENTER) {
						$(this).addClass('ui-spinner-pressed');
						if (!self.counter) {
							self.counter = 1;
						}
						self._up.call(self, event);
					} else if (event.keyCode == KEYS.DOWN || event.keyCode == KEYS.RIGHT) {
						self.element.siblings('.ui-spinner-down').focus();
					} else if (event.keyCode == KEYS.LEFT) {
						self.element.focus();
					}
				})
				.bind('keyup.spinner', function(event) {
					$(this).removeClass('ui-spinner-pressed');
					self.counter = 0;
					self._propagate('change', event);
				})
			.end()
			.append('<button class="ui-spinner-down" type="button">&#9660;</button>')
			.find('.ui-spinner-down')
				.bind('mousedown', function(event) {
					$(this).addClass('ui-spinner-pressed');
					if (!self.counter) {
						self.counter = 1;
					}
					self._mousedown(100, '_down', event);
				})
				.bind('mouseup', function(event) {
					$(this).removeClass('ui-spinner-pressed');
					if (self.counter == 1) {
						self._down();
					}
					self._mouseup(event);
				})
				.bind('mouseout', function(event) {
					$(this).removeClass('ui-spinner-pressed');
					if (self.timer) {
						self._mouseup(event);
					}
				})
				// mousedown/mouseup capture first click, now handle second click
				.bind('dblclick', function(event) {
					$(this).removeClass('ui-spinner-pressed');
					self._down(event);
					self._mouseup(event);
				})
				.bind('keydown.spinner', function(event) {
					var KEYS = $.keyCode;
					if (event.keyCode == KEYS.SPACE || event.keyCode == KEYS.ENTER) {
						$(this).addClass('ui-spinner-pressed');
						if (!self.counter) {
							self.counter = 1;
						}
						self._down.call(self, event);
					} else if (event.keyCode == KEYS.UP || event.keyCode == KEYS.LEFT) {
						self.element.siblings('.ui-spinner-up').focus();
					}
				})
				.bind('keyup.spinner', function(event) {
					$(this).removeClass('ui-spinner-pressed');
					self.counter = 0;
					self._propagate('change', event);
				})
			.end();
		
		// Give the spinner casing a unique id only if one exists in original input 
		// - this should aid targetted customisations if a page contains multiple instances
		this.element.attr('id', function(){
			if (this.id) {
				$(this).parent().attr('id', this.id+'-ui-spinner');
			}
		});
		
		// DataList: Set contraints for object length and step size. 
		// Manipulate height of spinner.
		this._items = this.element.children().length;
		if (this._items > 1) {
			var height = this.element.outerHeight()/this._items;
			this.element
			.addClass('ui-spinner-list')
			.height(height)
			.children()
				.addClass('ui-spinner-listitem')
				.height(height)
				.css('overflow', 'hidden')
			.end()
			.parent()
				.height(height)
			.end();
			this.options.stepping = 1;
			this.options.min = 0;
			this.options.max = this._items-1;
		}
		
		this.element
		.bind('keydown.spinner', function(event) {
			if (!self.counter) {
				self.counter = 1;
			}
			return self._keydown.call(self, event);
		})
		.bind('keyup.spinner', function(event) {
			self.counter = 0;
			self._propagate('change', event);
		})
		.bind('blur.spinner', function(event) {
			self._cleanUp();
		});
		
		if ($.fn.mousewheel) {
			this.element.mousewheel(function(event, delta) {
				self._mousewheel(event, delta);
			});
		}
	},
	
	_constrain: function() {
		if (this.options.min != undefined && this._getValue() < this.options.min) {
			this._setValue(this.options.min);
		}
		if (this.options.max != undefined && this._getValue() > this.options.max) {
			this._setValue(this.options.max);
		}
	},
	_cleanUp: function() {
		this._setValue(this._getValue());
		this._constrain();
	},
	_spin: function(d, event) {
		if (this.disabled) {
			return;
		}
		
		if (isNaN(this._getValue())) {
			this._setValue(this.options.start);
		}
		this._setValue(this._getValue() + (d == 'up' ? 1:-1) *(this.options.incremental && this.counter > 100 ? (this.counter > 200 ? 100 : 10) : 1) * this.options.stepping);
		this._animate(d);
		this._constrain();
		if (this.counter) {
			this.counter++;
		}
		this._propagate('spin', event);
	},
	_down: function(event) {
		this._spin('down', event);
		this._propagate('down', event);
	},
	_up: function(event) {
		this._spin('up', event);
		this._propagate('up', event);
	},
	_mousedown: function(i, d, event) {
		var self = this;
		i = i || 100;
		if (this.timer) {
			window.clearInterval(this.timer);
			this.timer = 0;
		}
		this.timer = window.setInterval(function() {
			self[d](event);
			if (self.options.incremental && self.counter > 20) {
				self._mousedown(20, d, event);
			}
		}, i);
	},
	_mouseup: function(event) {
		this.counter = 0;
		if (this.timer) {
			window.clearInterval(this.timer);
			this.timer = 0;
		}
		this.element[0].focus();
		this._propagate('change', event);
	},
	_keydown: function(event) {
		var KEYS = $.keyCode;
		
		if (event.keyCode == KEYS.UP) {
			this._up(event);
		}
		if (event.keyCode == KEYS.DOWN) {
			this._down(event);
		}
		if (event.keyCode == KEYS.HOME) {
			//Home key goes to min, if defined, else to start
			this._setValue(this.options.min || this.options.start);
		}
		if (event.keyCode == KEYS.END && this.options.max != undefined) {
			//End key goes to maximum
			this._setValue(this.options.max);
		}
		return (event.keyCode == KEYS.TAB || event.keyCode == KEYS.BACKSPACE ||
			event.keyCode == KEYS.LEFT || event.keyCode == KEYS.RIGHT || event.keyCode == KEYS.PERIOD || 
			event.keyCode == KEYS.NUMPAD_DECIMAL || event.keyCode == KEYS.NUMPAD_SUBTRACT || 
			(event.keyCode >= 96 && event.keyCode <= 105) || // add support for numeric keypad 0-9
			(/[0-9\-\.]/).test(String.fromCharCode(event.keyCode))) ? true : false;
	},
	_mousewheel: function(event, delta) {
		var self = this;
		delta = ($.browser.opera ? -delta / Math.abs(delta) : delta);
		(delta > 0 ? self._up(event) : self._down(event));
		if (self.timeout) {
			window.clearTimeout(self.timeout);
			self.timeout = 0;
		}
		self.timeout = window.setTimeout(function(){self._propagate('change', event);}, 400);
		event.preventDefault();
	},
	_getValue: function() {
		var val = this.element.val().replace(this.options.point, '.');
		if (this.options.group === '.') {
			val = val.replace('.','');
		}
		return parseFloat(val.replace(/[^0-9\-\.]/g, ''));
	},
	_setValue: function(newVal) {
		if (isNaN(newVal)) {
			newVal = this.options.start;
		}
		this.element.val(
			this.options.currency ? 
				$.ui.spinner.format.currency(newVal, this.options.currency, this.options.group, this.options.point) : 
				$.ui.spinner.format.number(newVal, this._decimals, this.options.group, this.options.point)
		);
	},
	_animate: function(d) {
		if (this.element.hasClass('ui-spinner-list') && ((d == 'up' && this._getValue() <= this.options.max) || (d == 'down' && this._getValue() >= this.options.min)) ) {
			this.element.animate({marginTop: '-' + this._getValue() * this.element.parent().height() }, {
				duration: 'fast',
				queue: false
			});
		}
	},
	_addItem: function(obj, fmt) {
		if (!this.element.is('input')) {
			var wrapper = 'div';
			if (this.element.is('ol') || this.element.is('ul')) {
				wrapper = 'li';
			}
			var html = obj; // string or object set it to html first
			
			if (typeof obj == 'object') {
				var format = (fmt !== undefined ? fmt : this.options.format);
				
				html = format.replace(/%(\(([^)]+)\))?/g, 
					(function(data){
						return function(match, a, lbl) { 
							if (!lbl) {
								for (var itm in data) {
									return data[itm]; // return the first item only
								}
							} else {
								return data[lbl];
							}
						};
					})(obj)
				);
			}
			this.element.append('<'+ wrapper +' class="ui-spinner-dyn">'+ html + '</'+ wrapper +'>');
		}
	},
	
	plugins: {},
	ui: function(event) {
		return {
			options: this.options,
			element: this.element,
			value: this._getValue(),
			add: this._addItem
		};
	},
	_propagate: function(n,event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		return this.element.triggerHandler(n == 'spin' ? n : 'spin'+n, [event, this.ui()], this.options[n]);
	},
	destroy: function() {
		if (!$.data(this.element[0], 'spinner')) {
			return;
		}
		if ($.fn.mousewheel) {
			this.element.unmousewheel();
		}
		this.element
			.removeClass('ui-spinner-box ui-spinner-list')
			.removeAttr('disabled')
			.removeAttr('autocomplete')
			.removeData('spinner')
			.unbind('.spinner')
			.siblings()
				.remove()
			.end()
			.children()
				.removeClass('ui-spinner-listitem')
				.remove('.ui-spinner-dyn')
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
	version: "@VERSION",
	defaults: {
		decimals: 0,
		stepping: 1,
		start: 0,
		incremental: true,
		currency: false,
		format: '%',
		items: [],
		group: '',
		point: '.'
	},
	format: {
		currency: function(num, sym, group, pt) {
			num = isNaN(num) ? 0 : num;
			return (num !== Math.abs(num) ? '-' : '') + sym + this.number(Math.abs(num), 2, group || ',', pt);
		},
		number: function(num, dec, group, pt) {
			var regex = /(\d+)(\d{3})/;
			for (num = isNaN(num) ? 0 : parseFloat(num,10).toFixed(dec), num = num.replace('.', pt); regex.test(num) && group; num=num.replace(regex, '$1'+group+'$2'));
			return num;
		}
	}
});

})(jQuery);
