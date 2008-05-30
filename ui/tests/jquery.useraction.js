/* Copyright (c) 2007 Eduardo Lundgren (eduardolundgren@gmail.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 0.1a
 * Date: May, 2008
 * Requires jQuery 1.2.x+
 * Docs: http://docs.jquery.com/Plugins/userAction
 * Greetings: Richard Worth
 */

;(function($) {
	
$.fn.extend({
	userAction: function(type) {
		var args = arguments, opts = {}, a1 = args[1], a2 = args[2];
		
		// transfer center offset 
		if (a1 && a1.length) {
			opts.center = [a1[0], a1[1]];
		}
		// set x and y
		else if (typeof a1 == StringPool.NUMBER) {
			opts.x = a1; opts.y = a2;
		}
		// extend options
		else {
			$.extend(opts, a1);
		}
		
		return this.each(function() {
			new $.userAction(this, type, opts);
		});
	}
});

$.userAction = function(el, type, options) {
	this.type = type;
	this.options = $.extend({}, $.userAction.defaults, options || {});
	this.target =  $(this.options.target || el)[0];
	
	var self = this, o = this.options, c = o.center, center = this.findCenter(
		c && c.length ? c : [0, 0]
	);
	// if x and y not set, get the center of the element
	o.x = o.x || center.x; o.y = o.y || center.y;
	
	var EVENT_DEFAULT = {
		target: this.target,
		view: window,
		bubbles: o.bubbles || true,
		cancelable: o.cancelable || false, 
		ctrlKey: o.ctrlKey || false, 
		altKey: o.altKey || false, 
		shiftKey: o.shiftKey || false, 
		metaKey: o.metaKey || false
	},
	
	isMouse = /^mouse(over|out|down|up|move)|(dbl)?click$/i.test(type),
	isKeyboard = /^textevent|key(up|down|press)$/i.test(type); 
	
	// Simulating drag and drop event
	if (/^drag$/i.test(type)) {
		var t = this.target, queue = $.data(t, StringPool.DATA_QUEUE),
			data = [options.dx || options.x, options.dy || options.y];
		
		if (!queue) {
			 $.data(t, StringPool.DATA_QUEUE, [data]);
			 this.drag(options.dx || options.x, options.dy || options.y);
			 return;
		}
		// queuing drags...
		if (queue && queue.length) {
			queue.push(data);
		}
		// if drag, stop here.
		return;
	}
	
	var EVT = isMouse ? 
		$.extend({}, EVENT_DEFAULT, {
			clientX: o.x, clientY: o.y, 
			screenX: o.screenX || 0, screenY: o.screenY || 0,
			relatedTarget: $(o.relatedTarget)[0] || null, detail: 0,
			button: o.button || ($.browser.msie ? 1 : 0), isTrusted: false
		}) :
		$.extend({}, EVENT_DEFAULT, {
			keyCode: o.keyCode || 0, charCode: o.charCode || 0
		});
	
	// avoid e.type == undefined before dispatchment
	EVT.type = type;
	
	if (o.before) o.before.apply(this.target, [$.event.fix(EVT), o.x, o.y, this]);

	// check event type for mouse events
	if (isMouse) {
		// simulating mouse event
		EVT = this.mouseEvent(EVT)
	} 
	
	// check event type for key events
	if (isKeyboard) {
		// simulating keuboard event
		EVT = this.keyboardEvent(EVT);
	}
	
	if (o.after) o.after.apply(this.target, [$.event.fix(EVT), o.x, o.y, this]);
};

$.extend($.userAction.prototype, {
	
	drag: function(dx, dy) {
		// drag helper function, thanks Richard Worth's testmouse api.
		var self = this, o = this.options, center = this.findCenter(), 
			target = $(this.target), lastx = center.x, lasty = center.y,
			fake = $(StringPool.FAKE_CURSOR_EXP);
		
		fake = fake.size() ? fake : 
			$(StringPool.FAKE_CURSOR_DIV)
				.css({ position: StringPool.ABSOLUTE }).appendTo(document.body);
		
		fake		
			.animate({ left: center.x, top: center.y }, "fast", function() {
				target
					.userAction(StringPool.MOUSEOVER)
					.userAction(StringPool.MOUSEDOWN)
					.userAction(StringPool.MOUSEMOVE);
			})
			.animate({ left: center.x + (dx||0), top: center.y + (dy||0) }, {
				speed: "fast",
				step: function(i, anim) {
					lastx = anim.prop == StringPool.LEFT ? i : lastx; 
					lasty = anim.prop == StringPool.TOP ? i : lasty;
					target.userAction(StringPool.MOUSEMOVE, { x: lastx, y: lasty, after: o.drag });
				},
				complete: function() {
					target.userAction(StringPool.MOUSEUP).userAction(StringPool.MOUSEOUT);
					
					// remove fake cursor
					//$(this).remove();
					
					// trigger drag queue
					var queue = $.data(self.target, StringPool.DATA_QUEUE); 
					
					if (queue) queue.shift();
					if (queue && queue[0]) self.drag(queue[0][0], queue[0][1]);
				}
			});
	},
	
	mouseEvent: function(EVT) {
		var evt, type = this.type, o = this.options;
		
		//check for DOM-compliant browsers
		if ($.isFunction(document.createEvent)) {
			evt = document.createEvent(StringPool.MOUSE_EVENTS);
			
			//Safari 2.x doesn't implement initMouseEvent()
			if ($.isFunction(evt.initMouseEvent)) {
				evt.initMouseEvent(type, 
					EVT.bubbles, EVT.cancelable, EVT.view, EVT.detail,	
					EVT.screenX, EVT.screenY, EVT.clientX, EVT.clientY,	
					EVT.ctrlKey, EVT.altKey, EVT.shiftKey, EVT.metaKey,	
					EVT.button, EVT.relatedTarget);
			} else {
				// Safari
				evt = document.createEvent(StringPool.UI_EVENTS);
				customEvent.initEvent(type, EVT.bubbles, EVT.cancelable);
				$.extend(evt, EVT);
			}
			
			// check to see if relatedTarget has been assigned
			if (EVT.relatedTarget && !evt.relatedTarget){
				if (type == StringPool.MOUSEOUT) {
				    evt.toElement = EVT.relatedTarget;
				} else if (type == StringPool.MOUSEOVER) {
				    evt.fromElement = EVT.relatedTarget;
				}
			}
			// fire the event
			this.target.dispatchEvent(evt);
			
		} else if (document.createEventObject) {
			evt = document.createEventObject();
			$.extend(evt, EVT)
			// IE won't allow assignment to toElement or fromElement
			evt.relatedTarget = EVT.relatedTarget;
            // fire the event
            this.target.fireEvent(StringPool.ON + type, evt);
		}

		return evt;
	},
	
	keyboardEvent: function(EVT) {
		var evt, type = this.type, o = this.options;
		
		// check for DOM-compliant browsers first
		if ($.isFunction(document.createEvent)) {
    
	        try {
	            // try to create key event
	            evt = document.createEvent(StringPool.KEY_EVENTS);
				
				evt.initKeyEvent(type, 
					EVT.bubbles, EVT.cancelable, EVT.view, EVT.ctrlKey, 
					EVT.altKey,	EVT.shiftKey, EVT.metaKey, EVT.keyCode, EVT.charCode);  
	            
	        } catch (err) {
				// we need another try-catch for Safari 2.x
	            try {
	                // generic event for opera and webkit nightlies, will fail in Safari 2.x
	                evt = document.createEvent(StringPool.EVENTS);
	            } catch (ierr){
	                // Safari 2.x - create a UIEvent 
	                evt = document.createEvent(StringPool.UI_EVENTS);
	            } finally {
					evt.initEvent(type, EVT.bubbles, EVT.cancelable);
					
					// initializing
					$.each(EVT, function(k, v) {
						// using try-catch for avoiding Opera NO_MODIFICATION_ALLOWED_ERR
						try { evt[k] = v; } catch(e) { }
					});
	            }          
	        }
	        
	        // fire the event
	        this.target.dispatchEvent(evt);
	
	    } else if (document.createEventObject) {
	        // create an IE event object
	        evt = document.createEventObject();
	        
	        // assign available properties
	        $.extend(evt, EVT);
	        
			// IE doesn't support charCode explicitly
	        evt.keyCode = (EVT.charCode > 0) ? EVT.charCode : EVT.keyCode;
	        
	        // fire the event
	        this.target.fireEvent(StringPool.ON + type, evt);  
	    }
		
		return evt;
	},
	
	findCenter: function(offset) {
		var el = $(this.target), o = el.offset();
		return {
			x: o.left + (((offset||[0, 0])[0]) || 0) + el.width() / 2,
			y: o.top + (((offset||[0, 0])[1]) || 0) + el.height() / 2
		};
	}
});

$.extend($.userAction, {
	defaults: {
		center: true
	}
});

var StringPool = {
	ON: 'on',
	NUMBER: 'number',
	MOUSEOVER: 'mouseover',
	MOUSEOUT: 'mouseout',
	MOUSEDOWN: 'mousedown',
	MOUSEUP: 'mouseup',
	MOUSEMOVE: 'mousemove',
	MOUSE_EVENTS: 'MouseEvents',
	UI_EVENTS: 'UIEvents',
	KEY_EVENTS: 'KeyEvents',
	EVENTS: 'Events',
	FAKE_CURSOR_EXP: 'div.ui-fake-cursor',
	FAKE_CURSOR_DIV: '<div class="ui-fake-cursor"/>',
	ABSOLUTE: 'absolute',
	DATA_QUEUE: 'ua-drag-queue',
	TOP: 'top',
	LEFT: 'left'
};

})(jQuery);