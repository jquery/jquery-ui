// FIXME remove this once updated to jQuery core 1.3.3
var hasDuplicate = false;

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
		$.each(['_widgetInit', 'option', '_trigger'], function(i, method) {
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

// load testswarm agent
(function() {
    var url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf("swarmURL=") + 9 ) );
	if ( !url || url.indexOf("http") !== 0 ) {
		return;
	}
    document.write("<scr" + "ipt src='http://testswarm.com/js/inject.js?" + (new Date).getTime() + "'></scr" + "ipt>");
})();
