function testWidgetDefaults(widget, defaults) {
	var pluginDefaults = $.extend({},
		$.ui[widget].prototype.options
	);
	
	// ensure that all defaults have the correct value
	test('defined defaults', function() {
		$.each(defaults, function(key, val) {
			if ($.isFunction(val)) {
				ok(val !== undefined, key);
				return;
			}
			same(pluginDefaults[key], val, key);
		});
	});
	
	// ensure that all defaults were tested
	test('tested defaults', function() {
		$.each(pluginDefaults, function(key, val) {
			ok(key in defaults, key);
		});
	});
}

function testWidgetOverrides(widget) {
	test('$.widget overrides', function() {
		$.each(['_widgetInit', 'option'], function(i, method) {
			ok($.Widget.prototype[method] == $.ui[widget].prototype[method],
				'should not override ' + method);
		});
	});
}

function commonWidgetTests(widget, settings) {
	module(widget + ": common widget");

	testWidgetDefaults(widget, settings.defaults);
	testWidgetOverrides(widget);
}
