
$(function() {

$('body').prepend(
	'<h1 id="header">' + document.title + '</h1>' +
	'<h2 id="banner"></h2>' +
	'<h2 id="userAgent"></h2>' +
	'<ol id="tests"></ol>'
);

});

function testWidgetDefaults(widget, defaults) {
	var pluginDefaults = $.extend({},
		$.widget.defaults,
		$.ui[widget].defaults
	);
	
	// ensure that all defualts have the correct value
	test('defined defaults', function() {
		$.each(defaults, function(key, val) {
			same(pluginDefaults[key], val, key);
		});
	});
	
	// ensure that all defaults were tested
	test('tested defaults', function() {
		$.each(pluginDefaults, function(key) {
			ok(key in defaults, key);
		});
	});
	
	// defaults after init
	test('defaults on init', function() {
		var el = $('<div/>')[widget](),
			instance = el.data(widget);
		
		$.each(defaults, function(key, val) {
			same(instance.options[key], val, key);
		});
		el.remove();
	});
}

function testSettingOptions(widget, options) {
	test('option values', function() {
		var el = $('<div/>')[widget](),
			instance = el.data(widget);
		
		$.each(options, function(i, option) {
			$.each({
				'null': null,
				'false': false,
				'true': true,
				zero: 0,
				number: 1,
				'empty string': '',
				string: 'string',
				'empty array': [],
				array: ['array'],
				'empty object': {},
				object: {obj: 'ect'},
				date: new Date(),
				regexp: /regexp/,
				'function': function() {}
			}, function(type, val) {
				el[widget]('option', option, val);
				same(instance.options[option], val, option + ': ' + type);
			});
		});
	});
}

function testWidgetOverrides(widget) {
	test('$.widget overrides', function() {
		$.each(['option', '_getData', '_trigger'], function(i, method) {
			ok($.widget.prototype[method] == $.ui[widget].prototype[method],
				'should not override ' + method);
		});
	});
}
function commonWidgetTests(widget, settings) {
	var options = [];
	$.each(settings.defaults, function(option) {
		options.push(option);
	});
	
	module(widget + ": common widget");

	testWidgetDefaults(widget, settings.defaults);
	testSettingOptions(widget, options);
	testWidgetOverrides(widget);
}
