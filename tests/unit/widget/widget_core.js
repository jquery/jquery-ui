/*
 * widget unit tests
 */
(function($) {

module('widget factory', {
	teardown: function() {
		delete $.ui.testWidget;
	}
});

test('widget creation', function() {
	var myPrototype = {
		_create: function() {},
		creationTest: function() {}
	};
	
	$.widget('ui.testWidget', myPrototype);
	ok($.isFunction($.ui.testWidget), 'constructor was created');
	equals('object', typeof $.ui.testWidget.prototype, 'prototype was created');
	equals($.ui.testWidget.prototype._create, myPrototype._create, 'create function is copied over');
	equals($.ui.testWidget.prototype.creationTest, myPrototype.creationTest, 'random function is copied over');
	equals($.ui.testWidget.prototype.option, $.Widget.prototype.option, 'option method copied over from base widget');
});

test('jQuery usage', function() {
	expect(10);
	
	var shouldInit = false;
	
	$.widget('ui.testWidget', {
		getterSetterVal: 5,
		_create: function() {
			ok(shouldInit, 'init called on instantiation');
		},
		methodWithParams: function(param1, param2) {
			ok(true, 'method called via .pluginName(methodName)');
			equals(param1, 'value1', 'parameter passed via .pluginName(methodName, param)');
			equals(param2, 'value2', 'multiple parameter passed via .pluginName(methodName, param, param)');
			
			return this;
		},
		getterSetterMethod: function(val) {
			if (val) {
				this.getterSetterVal = val;
			} else {
				return this.getterSetterVal;
			}
		}
	});
	
	shouldInit = true;
	var elem = $('<div></div>').testWidget();
	shouldInit = false;
	
	var instance = elem.data('testWidget');
	equals(typeof instance, 'object', 'instance stored in .data(pluginName)');
	equals(instance.element[0], elem[0], 'element stored on widget');
	var ret = elem.testWidget('methodWithParams', 'value1', 'value2');
	equals(ret, elem, 'jQuery object returned from method call');
	
	ret = elem.testWidget('getterSetterMethod');
	equals(ret, 5, 'getter/setter can act as getter');
	ret = elem.testWidget('getterSetterMethod', 30);
	equals(ret, elem, 'getter/setter method can be chainable');
	equals(instance.getterSetterVal, 30, 'getter/setter can act as setter');
});

test('direct usage', function() {
	expect(9);
	
	var shouldInit = false;
	
	$.widget('ui.testWidget', {
		getterSetterVal: 5,
		_create: function() {
			ok(shouldInit, 'init called on instantiation');
		},
		methodWithParams: function(param1, param2) {
			ok(true, 'method called via .pluginName(methodName)');
			equals(param1, 'value1', 'parameter passed via .pluginName(methodName, param)');
			equals(param2, 'value2', 'multiple parameter passed via .pluginName(methodName, param, param)');
			
			return this;
		},
		getterSetterMethod: function(val) {
			if (val) {
				this.getterSetterVal = val;
			} else {
				return this.getterSetterVal;
			}
		}
	});
	
	var elem = $('<div></div>')[0];
	
	shouldInit = true;
	var instance = new $.ui.testWidget({}, elem);
	shouldInit = false;
	
	equals($(elem).data('testWidget'), instance, 'instance stored in .data(pluginName)');
	equals(instance.element[0], elem, 'element stored on widget');
	
	var ret = instance.methodWithParams('value1', 'value2');
	equals(ret, instance, 'plugin returned from method call');
	
	ret = instance.getterSetterMethod();
	equals(ret, 5, 'getter/setter can act as getter');
	instance.getterSetterMethod(30);
	equals(instance.getterSetterVal, 30, 'getter/setter can act as setter');
});

test('merge multiple option arguments', function() {
	expect(1);
	$.widget("ui.testWidget", {
		_create: function() {
			same(this.options, {
				disabled: false,
				option1: "value1",
				option2: "value2",
				option3: "value3",
				option4: {
					option4a: "valuea",
					option4b: "valueb"
				}
			});
		}
	});
	$("<div></div>").testWidget({
		option1: "valuex",
		option2: "valuex",
		option3: "value3",
		option4: {
			option4a: "valuex"
		}
	}, {
		option1: "value1",
		option2: "value2",
		option4: {
			option4b: "valueb"
		}
	}, {
		option4: {
			option4a: "valuea"
		}
	});
});

test(".widget() - base", function() {
	$.widget("ui.testWidget", {
		_create: function() {}
	});
	var div = $("<div></div>").testWidget()
	same(div[0], div.testWidget("widget")[0]);
});

test(".widget() - overriden", function() {
	var wrapper = $("<div></div>");
	$.widget("ui.testWidget", {
		_create: function() {},
		widget: function() {
			return wrapper;
		}
	});
	same(wrapper[0], $("<div></div>").testWidget().testWidget("widget")[0]);
});

})(jQuery);
