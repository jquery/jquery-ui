/*
 * jQuery UI @VERSION
 *
 * Copyright (c) 2008 Paul Bakaus (ui.jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI
 */
;(function($) {

/** jQuery core modifications and additions **/
$.keyCode = {
	BACKSPACE: 8,
	CAPS_LOCK: 20,
	COMMA: 188,
	CONTROL: 17,
	DELETE: 46,
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	INSERT: 45,
	LEFT: 37,
	NUMPAD_ADD: 107,
	NUMPAD_DECIMAL: 110,
	NUMPAD_DIVIDE: 111,
	NUMPAD_ENTER: 108,
	NUMPAD_MULTIPLY: 106,
	NUMPAD_SUBTRACT: 109,
	PAGE_DOWN: 34,
	PAGE_UP: 33,
	PERIOD: 190,
	RIGHT: 39,
	SHIFT: 16,
	SPACE: 32,
	TAB: 9,
	UP: 38
};

//Temporary mappings
var _remove = $.fn.remove;
var isFF2 = $.browser.mozilla && (parseFloat($.browser.version) < 1.9);


//Helper functions and ui object
$.ui = {
	
	version: "@VERSION",
	
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function(module, option, set) {
			var proto = $.ui[module].prototype;
			for(var i in set) {
				proto.plugins[i] = proto.plugins[i] || [];
				proto.plugins[i].push([option, set[i]]);
			}
		},
		call: function(instance, name, args) {
			var set = instance.plugins[name];
			if(!set) { return; }
			
			for (var i = 0; i < set.length; i++) {
				if (instance.options[set[i][0]]) {
					set[i][1].apply(instance.element, args);
				}
			}
		}	
	},
	
	cssCache: {},
	css: function(name) {
		if ($.ui.cssCache[name]) { return $.ui.cssCache[name]; }
		var tmp = $('<div class="ui-gen">').addClass(name).css({position:'absolute', top:'-5000px', left:'-5000px', display:'block'}).appendTo('body');
		
		//if (!$.browser.safari)
			//tmp.appendTo('body');
		
		//Opera and Safari set width and height to 0px instead of auto
		//Safari returns rgba(0,0,0,0) when bgcolor is not set
		$.ui.cssCache[name] = !!(
			(!(/auto|default/).test(tmp.css('cursor')) || (/^[1-9]/).test(tmp.css('height')) || (/^[1-9]/).test(tmp.css('width')) || 
			!(/none/).test(tmp.css('backgroundImage')) || !(/transparent|rgba\(0, 0, 0, 0\)/).test(tmp.css('backgroundColor')))
		);
		try { $('body').get(0).removeChild(tmp.get(0));	} catch(e){}
		return $.ui.cssCache[name];
	},

	hasScroll: function(e, a) {
		
		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ($(e).css('overflow') == 'hidden') { return false; }
		
		var scroll = (a && a == 'left') ? 'scrollLeft' : 'scrollTop',
			has = false;
		
		if (e[scroll] > 0) { return true; }
		
		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		e[scroll] = 1;
		has = (e[scroll] > 0);
		e[scroll] = 0;
		return has;
	}
};


//jQuery plugins
$.fn.extend({
	
	remove: function() {
		// Safari has a native remove event which actually removes DOM elements,
		// so we have to use triggerHandler instead of trigger (#3037).
		$("*", this).add(this).each(function() {
			$(this).triggerHandler("remove");
		});
		return _remove.apply(this, arguments );
	},
	
	enableSelection: function() {
		return this
			.attr('unselectable', 'off')
			.css('MozUserSelect', '')
			.unbind('selectstart.ui');
	},
	
	disableSelection: function() {
		return this
			.attr('unselectable', 'on')
			.css('MozUserSelect', 'none')
			.bind('selectstart.ui', function() { return false; });
	},
	
	// WAI-ARIA Semantics
	ariaRole: function(role) {
		return (role !== undefined
			
			// setter
			? this.attr("role", isFF2 ? "wairole:" + role : role)
			
			// getter
			: (this.attr("role") || "").replace(/^wairole:/, ""));
	},
	
	ariaState: function(state, value) {
		return (value !== undefined
			
			// setter
			? this.each(function(i, el) {
				(isFF2
					? el.setAttributeNS("http://www.w3.org/2005/07/aaa",
						"aaa:" + state, value)
					: $(el).attr("aria-" + state, value));
			})
			
			// getter
			: this.attr(isFF2 ? "aaa:" + state : "aria-" + state));
	}
	
});


//Additional selectors
$.extend($.expr[':'], {
	
	data: function(a, i, m) {
		return $.data(a, m[3]);
	},
	
	// TODO: add support for object, area
	tabbable: function(a, i, m) {

		var nodeName = a.nodeName.toLowerCase();
		var isVisible = function(element) {
			function checkStyles(element) {
				var style = element.style;
				return (style.display != 'none' && style.visibility != 'hidden');
			}
			
			var visible = checkStyles(element);
			
			(visible && $.each($.dir(element, 'parentNode'), function() {
				return (visible = checkStyles(this));
			}));
			
			return visible;
		};
		
		return (
			// in tab order
			a.tabIndex >= 0 &&
			
			( // filter node types that participate in the tab order
				
				// anchor tag
				('a' == nodeName && a.href) ||
				
				// enabled form element
				(/input|select|textarea|button/.test(nodeName) &&
					'hidden' != a.type && !a.disabled)
			) &&
			
			// visible on page
			isVisible(a)
		);
		
	}
	
});


// $.widget is a factory to create jQuery plugins
// taking some boilerplate code out of the plugin code
// created by Scott González and Jörn Zaefferer
function getter(namespace, plugin, method, args) {
	function getMethods(type) {
		var methods = $[namespace][plugin][type] || [];
		return (typeof methods == 'string' ? methods.split(/,?\s+/) : methods);
	}
	
	var methods = getMethods('getter');
	if (args.length == 1 && typeof args[0] == 'string') {
		methods = methods.concat(getMethods('getterSetter'));
	}
	return ($.inArray(method, methods) != -1);
}

$.widget = function(name, prototype) {
	var namespace = name.split(".")[0];
	name = name.split(".")[1];
	
	// create plugin method
	$.fn[name] = function(options) {
		var isMethodCall = (typeof options == 'string'),
			args = Array.prototype.slice.call(arguments, 1);
		
		// prevent calls to internal methods
		if (isMethodCall && options.substring(0, 1) == '_') {
			return this;
		}
		
		// handle getter methods
		if (isMethodCall && getter(namespace, name, options, args)) {
			var instance = $.data(this[0], name);
			return (instance ? instance[options].apply(instance, args)
				: undefined);
		}
		
		// handle initialization and non-getter methods
		return this.each(function() {
			var instance = $.data(this, name);
			
			// constructor
			(!instance && !isMethodCall &&
				$.data(this, name, new $[namespace][name](this, options)));
			
			// method call
			(instance && isMethodCall && $.isFunction(instance[options]) &&
				instance[options].apply(instance, args));
		});
	};
	
	// create widget constructor
	$[namespace] = $[namespace] || {};
	$[namespace][name] = function(element, options) {
		var self = this;
		
		this.widgetName = name;
		this.widgetEventPrefix = $[namespace][name].eventPrefix || name;
		this.widgetBaseClass = namespace + '-' + name;
		
		this.options = $.extend({},
			$.widget.defaults,
			$[namespace][name].defaults,
			$.metadata && $.metadata.get(element)[name],
			options);
		
		this.element = $(element)
			.bind('setData.' + name, function(e, key, value) {
				return self._setData(key, value);
			})
			.bind('getData.' + name, function(e, key) {
				return self._getData(key);
			})
			.bind('remove', function() {
				return self.destroy();
			});
		
		this._init();
	};
	
	// add widget prototype
	$[namespace][name].prototype = $.extend({}, $.widget.prototype, prototype);
	
	// TODO: merge getter and getterSetter properties from widget prototype
	// and plugin prototype
	$[namespace][name].getterSetter = 'option';
};

$.widget.prototype = {
	_init: function() {},
	destroy: function() {
		this.element.removeData(this.widgetName);
	},
	
	option: function(key, value) {
		var options = key,
			self = this;
		
		if (typeof key == "string") {
			if (value === undefined) {
				return this._getData(key);
			}
			options = {};
			options[key] = value;
		}
		
		$.each(options, function(key, value) {
			self._setData(key, value);
		});
	},
	_getData: function(key) {
		return this.options[key];
	},
	_setData: function(key, value) {
		this.options[key] = value;
		
		if (key == 'disabled') {
			this.element[value ? 'addClass' : 'removeClass'](
				this.widgetBaseClass + '-disabled');
		}
	},
	
	enable: function() {
		this._setData('disabled', false);
	},
	disable: function() {
		this._setData('disabled', true);
	},
	
	_trigger: function(type, e, data) {
		var eventName = (type == this.widgetEventPrefix
			? type : this.widgetEventPrefix + type);
		e = e  || $.event.fix({ type: eventName, target: this.element[0] });
		return this.element.triggerHandler(eventName, [e, data], this.options[type]);
	}
};

$.widget.defaults = {
	disabled: false
};


/** Mouse Interaction Plugin **/

$.ui.mouse = {
	_mouseInit: function() {
		var self = this;
	
		this.element
			.bind('mousedown.'+this.widgetName, function(e) {
				return self._mouseDown(e);
			})
			.bind('click.'+this.widgetName, function(e) {
				if(self._preventClickEvent) {
					self._preventClickEvent = false;
					return false;
				}
			});
		
		// Prevent text selection in IE
		if ($.browser.msie) {
			this._mouseUnselectable = this.element.attr('unselectable');
			this.element.attr('unselectable', 'on');
		}
		
		this.started = false;
	},
	
	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
		
		// Restore text selection in IE
		($.browser.msie
			&& this.element.attr('unselectable', this._mouseUnselectable));
	},
	
	_mouseDown: function(e) {
		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(e));
		
		this._mouseDownEvent = e;
		
		var self = this,
			btnIsLeft = (e.which == 1),
			elIsCancel = (typeof this.options.cancel == "string" ? $(e.target).parents().add(e.target).filter(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(e)) {
			return true;
		}
		
		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}
		
		if (this._mouseDistanceMet(e) && this._mouseDelayMet(e)) {
			this._mouseStarted = (this._mouseStart(e) !== false);
			if (!this._mouseStarted) {
				e.preventDefault();
				return true;
			}
		}
		
		// these delegates are required to keep context
		this._mouseMoveDelegate = function(e) {
			return self._mouseMove(e);
		};
		this._mouseUpDelegate = function(e) {
			return self._mouseUp(e);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);
		
		return false;
	},
	
	_mouseMove: function(e) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !e.button) {
			return this._mouseUp(e);
		}
		
		if (this._mouseStarted) {
			this._mouseDrag(e);
			return false;
		}
		
		if (this._mouseDistanceMet(e) && this._mouseDelayMet(e)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, e) !== false);
			(this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e));
		}
		
		return !this._mouseStarted;
	},
	
	_mouseUp: function(e) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);
		
		if (this._mouseStarted) {
			this._mouseStarted = false;
			this._preventClickEvent = true;
			this._mouseStop(e);
		}
		
		return false;
	},
	
	_mouseDistanceMet: function(e) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - e.pageX),
				Math.abs(this._mouseDownEvent.pageY - e.pageY)
			) >= this.options.distance
		);
	},
	
	_mouseDelayMet: function(e) {
		return this.mouseDelayMet;
	},
	
	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(e) {},
	_mouseDrag: function(e) {},
	_mouseStop: function(e) {},
	_mouseCapture: function(e) { return true; }
};

$.ui.mouse.defaults = {
	cancel: null,
	distance: 1,
	delay: 0
};

})(jQuery);
