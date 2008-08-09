/*
 * jQuery UI ProgressBar
 *
 * Copyright (c) 2008 Eduardo Lundgren
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/ProgressBar
 *
 * Depends:
 *   ui.core.js
 */
(function($) {

$.widget("ui.progressbar", {
	init: function() {

		$.extend(this.options, {
			_interval: this.options.interval
		});

		var self = this,
			options = this.options,
			id = (new Date()).getTime()+Math.random(),
			text = options.text || '0%';

		this.element.addClass("ui-progressbar").width(options.width);

		$.extend(this, {
			active: false,
			pixelState: 0,
			percentState: 0,
			identifier: id,
			bar: $('<div class="ui-progressbar-bar ui-hidden"></div>').css({
				width: '0px', overflow: 'hidden', zIndex: 100
			}),
			textElement: $('<div class="ui-progressbar-text"></div>').html(text).css({
				width: '0px', overflow: 'hidden'
			}),
			textBg: $('<div class="ui-progressbar-text ui-progressbar-text-back"></div>').html(text).css({
					width: this.element.width()
			}),
			wrapper: $('<div class="ui-progressbar-wrap"></div>')
		});

		this.wrapper
			.append(this.bar.append(this.textElement.addClass(options.textClass)), this.textBg)
			.appendTo(this.element);

	},

	plugins: {},
	ui: function(e) {
		return {
			instance: this,
			identifier: this.identifier,
			options: this.options,
			element: this.bar,
			textElement: this.textElement,
			pixelState: this.pixelState,
			percentState: this.percentState
		};
	},
	propagate: function(n,e) {
		$.ui.plugin.call(this, n, [e, this.ui()]);
		this.element.triggerHandler(n == "progressbar" ? n : ["progressbar", n].join(""), [e, this.ui()], this.options[n]);
	},
	destroy: function() {
		this.reset();

		this.element
			.removeClass("ui-progressbar ui-progressbar-disabled")
			.removeData("progressbar").unbind(".progressbar")
			.find('.ui-progressbar-wrap').remove();

		delete jQuery.easing[this.identifier];
	},
	enable: function() {
		this.element.removeClass("ui-progressbar-disabled");
		this.disabled = false;
	},
	disable: function() {
		this.element.addClass("ui-progressbar-disabled");
		this.disabled = true;
	},
	start: function() {
		if (this.disabled) return;

		var self = this, options = this.options;

		jQuery.easing[this.identifier] = function (x, t, b, c, d) {
			var inc = options.increment,
				width = options.width,
				step = ((inc > width ? width : inc)/width),
				state = Math.round(x/step)*step;
			return state > 1 ? 1 : state;
		};

		this.bar.animate(
			{
				width: options.width
			},
			{
				duration: options.interval,
				easing: this.identifier,
				step: function(step, b) {
					var elapsedTime = ((new Date().getTime()) - b.startTime);
					options.interval = options._interval - elapsedTime;
					self.progress((step/options.width)*100);
				},
				complete: function() {
					delete jQuery.easing[self.identifier];
					self.stop();
				}
			}
		);

		this.propagate('start', this.ui());
		return false;
	},
	stop: function() {
		if (this.disabled) return;
		this.bar.stop();
		this.propagate('stop', this.ui());
		return false;

	},
	reset: function() {
		this.bar.stop();
		this.bar.width(0);
		this.textElement.width(0);
		this.bar.addClass('ui-hidden');
		this.options.interval = this.options._interval;
		return false;
	},
	progress: function(percentState) {
		if (this.bar.is('.ui-hidden')) {
			this.bar.removeClass('ui-hidden');
		}

		this.percentState = percentState > 100 ? 100 : percentState;
		this.pixelState = (this.percentState/100)*this.options.width;
		this.bar.width(this.pixelState);
		this.textElement.width(this.pixelState);

		if (this.options.range && !this.options.text) {
			this.textElement.html(Math.round(this.percentState) + '%');
		}
		this.propagate('progress', this.ui());
	}
});

$.ui.progressbar.defaults = {
	width: 300,
	duration: 3000,
	interval: 200,
	increment: 1,
	range: true,
	text: '',
	addClass: '',
	textClass: ''
};

})(jQuery);