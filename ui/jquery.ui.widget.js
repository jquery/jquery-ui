/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Widget
 */
(function($) {

var _remove = $.fn.remove;

$.fn.remove = function() {
	// Safari has a native remove event which actually removes DOM elements,
	// so we have to use triggerHandler instead of trigger (#3037).
	$("*", this).add(this).each(function() {
		$(this).triggerHandler("remove");
	});
	return _remove.apply(this, arguments);
};

// $.widget is a factory to create jQuery plugins
// taking some boilerplate code out of the plugin code
$.widget = function(name, prototype) {
	var namespace = name.split(".")[0],
		fullName;
	name = name.split(".")[1];
	fullName = namespace + '-' + name;

	// create selector for plugin
	$.expr[':'][fullName] = function(elem) {
		return !!$.data(elem, name);
	};
	
	// create plugin method
	$.fn[name] = function(options) {
		var isMethodCall = (typeof options == 'string'),
			args = Array.prototype.slice.call(arguments, 1),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length
			? $.extend.apply(null, [true, options].concat(args))
			: options;

		// prevent calls to internal methods
		if (isMethodCall && options.substring(0, 1) == '_') {
			return returnValue;
		}

		(isMethodCall
			? this.each(function() {
				var instance = $.data(this, name),
					methodValue = (instance && $.isFunction(instance[options])
						? instance[options].apply(instance, args)
						: instance);
				if (methodValue !== instance && methodValue !== undefined) {
					returnValue = methodValue;
					return false;
				}
			})
			: this.each(function() {
				($.data(this, name) ||
					$.data(this, name, new $[namespace][name](this, options))._init());
			}));

		return returnValue;
	};

	// create widget constructor
	$[namespace] = $[namespace] || {};
	$[namespace][name] = function(element, options) {
		var self = this;

		this.namespace = namespace;
		this.widgetName = name;
		this.widgetEventPrefix = $[namespace][name].eventPrefix || name;
		this.widgetBaseClass = fullName;

		this.options = $.extend(true, {},
			$.widget.defaults,
			$[namespace][name].defaults,
			$.metadata && $.metadata.get(element)[name],
			options);

		this.element = $(element)
			.bind('setData.' + name, function(event, key, value) {
				if (event.target == element) {
					return self._setData(key, value);
				}
			})
			.bind('getData.' + name, function(event, key) {
				if (event.target == element) {
					return self._getData(key);
				}
			})
			.bind('remove.' + name, function() {
				return self.destroy();
			});
	};

	// add widget prototype
	$[namespace][name].prototype = $.extend({}, $.widget.prototype, prototype);
};

$.widget.prototype = {
	_init: function() {},
	destroy: function() {
		this.element.removeData(this.widgetName)
			.removeClass(this.widgetBaseClass + '-disabled' + ' ' + this.namespace + '-state-disabled')
			.removeAttr('aria-disabled');

		return this;
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

		return self;
	},
	_getData: function(key) {
		return this.options[key];
	},
	_setData: function(key, value) {
		this.options[key] = value;

		if (key == 'disabled') {
			this.element
				[value ? 'addClass' : 'removeClass'](
					this.widgetBaseClass + '-disabled' + ' ' +
					this.namespace + '-state-disabled')
				.attr("aria-disabled", value);
		}
	},

	enable: function() {
		this._setData('disabled', false);
		return this;
	},
	disable: function() {
		this._setData('disabled', true);
		return this;
	},

	_trigger: function(type, event, data) {
		var callback = this.options[type];

		event = $.Event(event);
		event.type = (type == this.widgetEventPrefix
				? type : this.widgetEventPrefix + type).toLowerCase();
		data = data || {};

		// copy original event properties over to the new event
		// this would happen if we could call $.event.fix instead of $.Event
		// but we don't have a way to force an event to be fixed multiple times
		if (event.originalEvent) {
			for (var i = $.event.props.length, prop; i;) {
				prop = $.event.props[--i];
				event[prop] = event.originalEvent[prop];
			}
		}

		this.element.trigger(event, data);

		return !($.isFunction(callback) && callback.call(this.element[0], event, data) === false
			|| event.isDefaultPrevented());
	}
};

$.widget.defaults = {
	disabled: false
};

	
})(jQuery);
