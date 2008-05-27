/* Copyright (c) 2007 Eduardo Lundgren (eduardolundgren@gmail.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 0.1a
 * Requires jQuery 1.2.x+
 * Docs: http://docs.jquery.com/Plugins/userAction
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
			opts.x = a1; options.y = a2;
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
	
	var self = this, o = this.options, c = o.center, xy = this.findCenter(
		c && c.length ? c : [0, 0]
	);
	// if x and y not set, get the center of the element
	o.x = o.x || xy.x; o.y = o.y || xy.y;

	var EVENT_DEFAULT = {
		view: window,
		detail: 0,
		isTrusted: false,
		bubbles: o.bubbles || true,
		cancelable: o.cancelable || false, 
		ctrlKey: o.ctrlKey || false, 
		altKey: o.altKey || false, 
		shiftKey: o.shiftKey || false, 
		metaKey: o.metaKey || false
	},
	
	isMouse = /^mouse(over|out|down|up|move)|(dbl)?click$/i.test(type),
	isKeyboard = /^textevent|key(up|down|press)$/i.test(type); 
	
	var EVT = isMouse ? 
		$.extend({}, EVENT_DEFAULT, {
			clientX: o.x, clientY: o.y, 
			screenX: o.screenX || 0, screenY: o.screenY || 0,
			relatedTarget: $(o.relatedTarget)[0] || null, 
			button: o.button || ($.browser.msie ? 1 : 0) 
		}) :
		$.extend({}, EVENT_DEFAULT, {
			keyCode: o.keyCode || 0, charCode: o.charCode || 0
		});
		
	if (o.before) o.before.apply(this.target, [
		// simulate correct target before the event fire
		// the browser just set the correct EVT.target after dispatchment
		$.event.fix(EVT).target = this.target, o.x, o.y, this]);

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
	
	if (o.after) o.after.apply(this.target, [EVT, o.x, o.y, this]);
};

$.extend($.userAction.prototype, {
	
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
		
		//Safari 2.x doesn't implement initMouseEvent()
		if ($.isFunction(document.createEvent)) {
    
	        try {
	            // try to create key event
	            evt = document.createEvent("KeyEvents");
	            
				evt.initKeyEvent(type, 
					EVT.bubbles, EVT.cancelable, EVT.view, EVT.ctrlKey, 
					EVT.altKey,	EVT.shiftKey, EVT.metaKey, EVT.keyCode, EVT.charCode);  
	            
	        } catch (err) {
				// we need another try-catch for Safari 2.x
	            try {
	                // generic event, will fail in Safari 2.x
	                evt = document.createEvent("Events");
	            } catch (uierror){
	                // create a UIEvent for Safari 2.x
	                evt = document.createEvent("UIEvents");
	            } finally {
					evt.initEvent(type, EVT.bubbles, EVT.cancelable);
					// initialize
	                $.extend(evt, EVT);
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
	        this.target.fireEvent("on" + type, evt);  
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
	MOUSE_EVENTS: "MouseEvents",
	UI_EVENTS: "UIEvents"
};

})(jQuery);