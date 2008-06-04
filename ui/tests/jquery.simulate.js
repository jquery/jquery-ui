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
	simulate: function(type, options) {
		return this.each(function() {
			new $.simulate(this, type, options);
		});
	}
});

$.simulate = function(el, type, options) {
	var evt = this.createEvent(type, options);
	this.dispatchEvent(el, type, evt);
}

$.extend($.simulate.prototype, {
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
	}
});

})(jQuery);
