/*
 * jquery.simulate - simulate browser mouse and keyboard events
 *
 * Copyright (c) 2007 Eduardo Lundgren (eduardolundgren@gmail.com)
 * and Richard D. Worth (rdworth@gmail.com)
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 */

;(function($) {

$.fn.extend({
	simulate: function(type, options, complete) {
		return this.each(function() {
			var opt = $.extend({ complete: complete }, options);
			new $.simulate(this, type, opt);
		});
	}
});

$.simulate = function(el, type, options) {
	this.target = el;
	if (/^drag$/.test(type)) {
		this[type].apply(this, [this.target, options]);
	} else {
		this.simulateEvent(type, options);
	}
}

$.extend($.simulate.prototype, {
	simulateEvent: function(el, type, options) {
		var evt = this.createEvent(type, options);
		this.dispatchEvent(el, type, evt);
	},
	createEvent: function(type, options) {
		if (/^mouse(over|out|down|up|move)|(dbl)?click$/.test(type)) {
			return this.mouseEvent(type, options);
		} else if (/^key(up|down|press)$/.test(type)) {
			return this.keyboardEvent(type, options);
		}
	},
	mouseEvent: function(type, options) {
		var evt;
		var e = $.extend({
			bubbles: true, cancelable: (type != "mousemove"), view: window, detail: 0,
			screenX: 0, screenY: 0, clientX: 0, clientY: 0,
			ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
			button: 0, relatedTarget: null
		}, options);
		if ($.isFunction(document.createEvent)) {
			evt = document.createEvent("MouseEvents");
			evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
				e.screenX, e.screenY, e.clientX, e.clientY,
				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
				e.button, e.relatedTarget);
		} else if (document.createEventObject) {
			evt = document.createEventObject();
			$.extend(evt, e);
			evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
		}
		return evt;
	},
	keyboardEvent: function(type, options) {
		var evt;
		var e = $.extend({ bubbles: true, cancelable: true, view: window,
			ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
			keyCode: 0, charCode: 0
		}, options);
		if ($.isFunction(document.createEvent)) {
			try {
				evt = document.createEvent("KeyEvents");
				evt.initKeyEvent(type, e.bubbles, e.cancelable, e.view,
					e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
					e.keyCode, e.charCode);
			} catch(err) {
				evt = document.createEvent("Events");
				evt.initEvent(type, e.bubbles, e.cancelable);
				$.extend(evt, { view: e.view,
					ctrlKey: e.ctrlKey, altKey: e.altKey, shiftKey: e.shiftKey, metaKey: e.metaKey,
					keyCode: e.keyCode, charCode: e.charCode
				});
			}
		} else if (document.createEventObject) {
			evt = document.createEventObject();
			$.extend(evt, e);
		}
		if ($.browser.msie || $.browser.opera) {
			evt.keyCode = (e.charCode > 0) ? e.charCode : e.keyCode;
			evt.charCode = undefined;
		}
		return evt;
	},
	dispatchEvent: function(el, type, evt) {
		if (el.dispatchEvent) {
			el.dispatchEvent(evt);
		} else if (el.fireEvent) {
			el.fireEvent('on' + type, evt);
		}
	},
	
	findCenter: function(el) {
		var el = $(this.target), o = el.offset();
		return {
			x: o.left + el.outerWidth() / 2,
			y: o.top + el.outerHeight() / 2
		};
	},
	drag: function(el, options) {
		var center = this.findCenter(this.target),
			x = center.x, y = center.y,
			dx = options.dx || 0,
			dy = options.dy || 0;
		this.simulateEvent(this.target, "mouseover");
		this.simulateEvent(this.target, "mousedown", { clientX: x, clientY: y });
		this.simulateEvent(this.target, "mousemove", { clientX: x, clientY: y });
		this.simulateEvent(this.target, "mousemove", { clientX: x, clientY: y });
		this.simulateEvent(this.target, "mousemove", { clientX: x, clientY: y });
		this.simulateEvent(document, "mousemove", { clientX: x + dx, clientY: y + dy });
		this.simulateEvent(document, "mousemove", { clientX: x + dx, clientY: y + dy });
		this.simulateEvent(document, "mousemove", { clientX: x + dx, clientY: y + dy });
		this.simulateEvent(this.target, "mouseup", { clientX: x + dx, clientY: y + dy });
		this.simulateEvent(this.target, "click", { clientX: x + dx, clientY: y + dy });
		this.simulateEvent(this.target, "mouseout");
		(options.complete && options.complete());
	}

});

})(jQuery);
