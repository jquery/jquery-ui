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
			var opt = $.extend({}, $.simulate.defaults, options || {});
			new $.simulate(this, type, opt);
		});
	}
});

$.simulate = function(el, type, options) {
	this.target = el;
	this.options = options;
	
	if (/^drag$/.test(type)) {
		this[type].apply(this, [this.target, options]);
	} else {
		this.simulateEvent(el, type, options);
	}
}

$.extend($.simulate.prototype, {
	simulateEvent: function(el, type, options) {
		// creates a individual option for each simulation inside this instance
		options = $.extend({}, this.options, options);
		var evt = this.createEvent(type, options);
		return this.dispatchEvent(el, type, evt, options);
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
			screenX: 0, screenY: 0, clientX: options.x || 0, clientY: options.y || 0,
			ctrlKey: false, altKey: false, shiftKey: false, metaKey: false,
			button: 0, relatedTarget: null
		}, options);
		
		var relatedTarget = $(e.relatedTarget)[0];
		
		if ($.isFunction(document.createEvent)) {
			evt = document.createEvent("MouseEvents");
			evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail,
				e.screenX, e.screenY, e.clientX, e.clientY,
				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
				e.button, relatedTarget);
		} else if (document.createEventObject) {
			evt = document.createEventObject();
			$.extend(evt, e);
			
			// IE won't allow assignment to toElement or fromElement
			evt.relatedTarget = relatedTarget;
			
			// fix for 2 pixels bug from mousecords 
			evt.pageX = options.x; evt.pageY = options.y;
			
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
	
	dispatchEvent: function(el, type, evt, options) {
		if (el.dispatchEvent) {
			el.dispatchEvent(evt);
		} else if (el.fireEvent) {
			el.fireEvent('on' + type, evt);
		}
		// trigget complete for all events - not drag.
		this.triggerComplete(evt, options);
		return evt;
	},
	
	drag: function(el) {
		var self = this, center = this.findCenter(this.target), 
			options = this.options,	x = center.x, y = center.y, 
			dx = options.dx || 0, dy = options.dy || 0, target = this.target;

		var coord = { x: x, y: y, complete: null }, evt;
		this.simulateEvent(target, "mouseover", coord);
		this.simulateEvent(target, "mousedown", coord);
		
		var drag = function(x, y) {
			evt = self.simulateEvent(target, "mousemove", $.extend(coord, { x: x, y: y }));
			// triggering drag callback
			(self.options.drag && self.options.drag($.event.fix(evt)));
		};
		
		if (/^sync$/.test(options.speed)) {
			// trigger synchronous simulation
			this.triggerSync(center, dx, dy, drag);
		}
		else {
			// trigger asynchronous simulation - animated
			this.triggerAsync(center, dx, dy, drag);
		}
		
		this.simulateEvent(target, "mouseup", coord);
		this.simulateEvent(target, "mouseout", coord);
		this.triggerComplete(evt, options);
	},
	
	triggerComplete: function(evt, options) {
		evt = $.event.fix(evt);
		(options.complete && options.complete(evt)); return evt;
	},
	
	triggerSync: function(center, dx, dy, fn) {
		var x = center.x, y = center.y, mdx = Math.abs(dx) || 0, mdy = Math.abs(dy) || 0;
		var range = Math.max(mdx, mdy), sigx = dx/mdx || 1, sigy = dy/mdy || 1;
		
		for (var dt = 1; dt <= range; dt++) {
			if (dt <= mdx) x = center.x + sigx*dt;
			if (dt <= mdy) y = center.y + sigy*dt;
			(fn && fn(x, y));
		}
	},
	
	triggerAsync: function(center, dx, dy, fn) {
		/*TODO*/
		// this method just have to call: (fn && fn(x, y));
		// return the x, y of the mousemove.
		// idea: $.animate({ step: function() { var x,y; (fn && fn(x, y)); } });
	},
	
	findCenter: function(el) {
		var el = $(this.target), o = el.offset();
		return {
			x: o.left + el.outerWidth() / 2,
			y: o.top + el.outerHeight() / 2
		};
	}
});

$.extend($.simulate, {
	defaults: {
		speed: 'sync'
	}
});

})(jQuery);
