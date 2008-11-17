/*
 * jQuery UI Progressbar @VERSION
 *
 * Copyright (c) 2008 Eduardo Lundgren
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
		
		this._interval = this.options.interval;
		
		var self = this,
			options = this.options,
			identifier = 'progressbar' + (++$.ui.progressbar.uuid),
			text = options.text || '0%';
		
		this.element
			.addClass("ui-progressbar")
			.width(options.width)
			.attr({
				role: "progressbar",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": 0
			});
		
		$.extend(this, {
			active: false,
			pixelState: 0,
			percentState: 0,
			identifier: identifier
		});
		
		this.wrapper = $('<div class="ui-progressbar-wrap"></div>')
			.appendTo(this.element);
		
		this.bar = $('<div class="ui-progressbar-bar ui-hidden"></div>')
			.css({
				width: 0,
				overflow: 'hidden',
				zIndex: 100
			})
			.appendTo(this.wrapper);
		
		this.textElement = $('<div class="ui-progressbar-text"></div>')
			.html(text)
			.css({
				width: 0,
				overflow: 'hidden'
			})
			.appendTo(this.bar);
		
		this.textBg = $('<div class="ui-progressbar-text ui-progressbar-text-back"></div>')
			.html(text)
			.css({
				width: this.element.width()
			})
			.appendTo(this.bar);
	},

	_animate: function() {
		var self = this,
			options = this.options,
			interval = options.interval;
		
		this.bar.animate(
			{
				width: options.width
			},
			{
				duration: interval,
				easing: options.equation || this.identifier,
				step: function(step, b) {
					var timestamp = new Date().getTime(), elapsedTime  = (timestamp - b.startTime);
					self.progress( (step/options.width) * 100 );
					options.interval = interval - elapsedTime;
				},
				complete: function() {
					if (self.active) {
						options.interval = self._interval;
						self.bar.width(0);
						self.textElement.width(0);
						self._animate();
					}
					else {
						delete $.easing[self.identifier];
					}
				}
			}
		);
	},
	
	destroy: function() {
		this.stop();
		
		this.element
			.removeClass("ui-progressbar ui-progressbar-disabled")
			.removeData("progressbar").unbind(".progressbar")
			.find('.ui-progressbar-wrap').remove();
		
		delete $.easing[this.identifier];
	},

	disable: function() {
		this.element.addClass("ui-progressbar-disabled");
		this.disabled = true;
		this.element.attr("aria-disabled", true);
	},
	
	enable: function() {
		this.element.removeClass("ui-progressbar-disabled");
		this.disabled = false;
		this.element.attr("aria-disabled", false);
	},
	
	pause: function() {
		if (this.disabled) return;
		this.bar.stop();
		this._trigger('pause', null, this.ui());
	},
	
	progress: function(percentState) {
		this.bar.removeClass('ui-hidden');
		
		this.percentState = percentState > 100 ? 100 : percentState;
		this.pixelState = (this.percentState/100) * this.options.width;
		this.bar.width(this.pixelState);
		this.textElement.width(this.pixelState);
		
		var percent = Math.round(this.percentState);
		if (this.options.range && !this.options.text) {
			this.text(percent + '%');
		}
		this.element.attr("aria-valuenow", percent);
		this._trigger('progress', null, this.ui());
	},
	
	start: function() {
		var self = this, options = this.options;
		
		if (this.disabled) {
			return;
		}
		
		$.easing[this.identifier] = function (x, t, b, c, d) {
			var inc = options.increment,
				width = options.width,
				step = ((inc > width ? width : inc)/width),
				state = Math.round(x/step)*step;
			return state > 1 ? 1 : state;
		};
		
		self.active = true;
		
		if (options.duration < options.interval) {
			options.duration = options.interval;
		}
		
		setTimeout(
			function() {
				self.active = false;
			},
			options.duration
		);
		
		this._animate();
		
		this._trigger('start', null, this.ui());
		return false;
	},
	
	stop: function() {
		this.bar.stop();
		this.bar.width(0);
		this.textElement.width(0);
		this.bar.addClass('ui-hidden');
		this.options.interval = this._interval;
		this._trigger('stop', null, this.ui());
	},
	
	text: function(text){
		this.textElement.add(this.textBg).html(text);
	},
	
	ui: function() {
		return {
			identifier: this.identifier,
			options: this.options,
			element: this.bar,
			textElement: this.textElement,
			pixelState: this.pixelState,
			percentState: this.percentState
		};
	}
});

$.extend($.ui.progressbar, {
	version: "@VERSION",
	defaults: {
		width: 300,
		duration: 1000,
		interval: 1000,
		increment: 1,
		range: true,
		text: '',
	},
	
	uuid: 0
});

})(jQuery);
