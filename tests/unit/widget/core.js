define( [
	"qunit",
	"jquery",
	"lib/common",
	"ui/widget"
], function( QUnit, $, common ) {

QUnit.module( "widget factory", {
	afterEach: function() {
		if ( $.ui ) {
			delete $.ui.testWidget;
			delete $.fn.testWidget;
		}
	}
} );

common.testJshint( "widget" );

QUnit.test( "widget creation", function( assert ) {
	assert.expect( 5 );
	var method,
		myPrototype = {
			_create: function() {
				assert.equal( method, "_create", "create function is copied over" );
			},
			creationTest: function() {
				assert.equal( method, "creationTest", "random function is copied over" );
			}
		};

	$.widget( "ui.testWidget", myPrototype );
	assert.ok( $.isFunction( $.ui.testWidget ), "constructor was created" );
	assert.equal( typeof $.ui.testWidget.prototype, "object", "prototype was created" );
	method = "_create";
	$.ui.testWidget.prototype._create();
	method = "creationTest";
	$.ui.testWidget.prototype.creationTest();
	assert.equal( $.ui.testWidget.prototype.option, $.Widget.prototype.option,
		"option method copied over from base widget" );
} );

QUnit.test( "element normalization", function( assert ) {
	assert.expect( 11 );
	var elem;
	$.widget( "ui.testWidget", {} );

	$.ui.testWidget.prototype._create = function() {

		// Workaround for core ticket #8381
		this.element.appendTo( "#qunit-fixture" );
		assert.ok( this.element.is( "div" ), "generated div" );
		assert.deepEqual( this.element.testWidget( "instance" ), this, "instance stored in .data()" );
	};
	$.ui.testWidget();

	$.ui.testWidget.prototype.defaultElement = "<span data-test='pass'></span>";
	$.ui.testWidget.prototype._create = function() {
		assert.ok( this.element.is( "span[data-test=pass]" ), "generated span with properties" );
		assert.deepEqual( this.element.testWidget( "instance" ), this, "instance stored in .data()" );
	};
	$.ui.testWidget();

	elem = $( "<input>" );
	$.ui.testWidget.prototype._create = function() {
		assert.deepEqual( this.element[ 0 ], elem[ 0 ], "from element" );
		assert.deepEqual( elem.testWidget( "instance" ), this, "instance stored in .data()" );
	};
	$.ui.testWidget( {}, elem[ 0 ] );

	elem = $( "<div>" );
	$.ui.testWidget.prototype._create = function() {
		assert.deepEqual( this.element[ 0 ], elem[ 0 ], "from jQuery object" );
		assert.deepEqual( elem.testWidget( "instance" ), this, "instance stored in .data()" );
	};
	$.ui.testWidget( {}, elem );

	elem = $( "<div id='element-normalization-selector'></div>" )
		.appendTo( "#qunit-fixture" );
	$.ui.testWidget.prototype._create = function() {
		assert.deepEqual( this.element[ 0 ], elem[ 0 ], "from selector" );
		assert.deepEqual( elem.testWidget( "instance" ), this, "instance stored in .data()" );
	};
	$.ui.testWidget( {}, "#element-normalization-selector" );

	$.ui.testWidget.prototype.defaultElement = null;
	$.ui.testWidget.prototype._create = function() {

		// Using strictEqual throws an error (Maximum call stack size exceeded)
		assert.ok( this.element[ 0 ] === this, "instance as element" );
	};
	$.ui.testWidget();
} );

QUnit.test( "custom selector expression", function( assert ) {
	assert.expect( 1 );
	var elem = $( "<div>" ).appendTo( "#qunit-fixture" );
	$.widget( "ui.testWidget", {} );
	elem.testWidget();
	assert.deepEqual( $( ":ui-testwidget" )[ 0 ], elem[ 0 ] );
	elem.testWidget( "destroy" );
} );

QUnit.test( "jQuery usage", function( assert ) {
	assert.expect( 14 );

	var elem, instance, ret,
		shouldCreate = false;

	$.widget( "ui.testWidget", {
		getterSetterVal: 5,
		_create: function() {
			assert.ok( shouldCreate, "create called on instantiation" );
		},
		methodWithParams: function( param1, param2 ) {
			assert.ok( true, "method called via .pluginName(methodName)" );
			assert.equal( param1, "value1",
				"parameter passed via .pluginName(methodName, param)" );
			assert.equal( param2, "value2",
				"multiple parameters passed via .pluginName(methodName, param, param)" );

			return this;
		},
		getterSetterMethod: function( val ) {
			if ( val ) {
				this.getterSetterVal = val;
			} else {
				return this.getterSetterVal;
			}
		},
		jQueryObject: function() {
			return $( "body" );
		}
	} );

	shouldCreate = true;
	elem = $( "<div>" )
		.on( "testwidgetcreate", function() {
			assert.ok( shouldCreate, "create event triggered on instantiation" );
		} )
		.testWidget();
	shouldCreate = false;

	instance = elem.testWidget( "instance" );
	assert.equal( typeof instance, "object", "instance stored in .data(pluginName)" );
	assert.equal( instance.element[ 0 ], elem[ 0 ], "element stored on widget" );
	ret = elem.testWidget( "methodWithParams", "value1", "value2" );
	assert.equal( ret, elem, "jQuery object returned from method call" );

	ret = elem.testWidget( "getterSetterMethod" );
	assert.equal( ret, 5, "getter/setter can act as getter" );
	ret = elem.testWidget( "getterSetterMethod", 30 );
	assert.equal( ret, elem, "getter/setter method can be chainable" );
	assert.equal( instance.getterSetterVal, 30, "getter/setter can act as setter" );
	ret = elem.testWidget( "jQueryObject" );
	assert.equal( ret[ 0 ], document.body, "returned jQuery object" );
	assert.equal( ret.end(), elem, "stack preserved" );

	elem.testWidget( "destroy" );
	assert.equal( elem.testWidget( "instance" ), null );
} );

QUnit.test( "direct usage", function( assert ) {
	assert.expect( 9 );

	var elem, instance, ret,
		shouldCreate = false;

	$.widget( "ui.testWidget", {
		getterSetterVal: 5,
		_create: function() {
			assert.ok( shouldCreate, "create called on instantiation" );
		},
		methodWithParams: function( param1, param2 ) {
			assert.ok( true, "method called dirctly" );
			assert.equal( param1, "value1", "parameter passed via direct call" );
			assert.equal( param2, "value2", "multiple parameters passed via direct call" );

			return this;
		},
		getterSetterMethod: function( val ) {
			if ( val ) {
				this.getterSetterVal = val;
			} else {
				return this.getterSetterVal;
			}
		}
	} );

	elem = $( "<div>" )[ 0 ];

	shouldCreate = true;
	instance = new $.ui.testWidget( {}, elem );
	shouldCreate = false;

	assert.equal( $( elem ).testWidget( "instance" ), instance,
		"instance stored in .data(pluginName)" );
	assert.equal( instance.element[ 0 ], elem, "element stored on widget" );

	ret = instance.methodWithParams( "value1", "value2" );
	assert.equal( ret, instance, "plugin returned from method call" );

	ret = instance.getterSetterMethod();
	assert.equal( ret, 5, "getter/setter can act as getter" );
	instance.getterSetterMethod( 30 );
	assert.equal( instance.getterSetterVal, 30, "getter/setter can act as setter" );
} );

QUnit.test( "error handling", function( assert ) {
	assert.expect( 3 );
	var error = $.error;
	$.widget( "ui.testWidget", {
		_privateMethod: function() {}
	} );
	$.error = function( msg ) {
		assert.equal( msg, "cannot call methods on testWidget prior to initialization; " +
			"attempted to call method 'missing'", "method call before init" );
	};
	$( "<div>" ).testWidget( "missing" );
	$.error = function( msg ) {
		assert.equal( msg, "no such method 'missing' for testWidget widget instance",
			"invalid method call on widget instance" );
	};
	$( "<div>" ).testWidget().testWidget( "missing" );
	$.error = function( msg ) {
		assert.equal( msg, "no such method '_privateMethod' for testWidget widget instance",
			"invalid method call on widget instance" );
	};
	$( "<div>" ).testWidget().testWidget( "_privateMethod" );
	$.error = error;
} );

QUnit.test( "merge multiple option arguments", function( assert ) {
	assert.expect( 1 );
	$.widget( "ui.testWidget", {
		_create: function() {
			assert.deepEqual( this.options, {
				classes: {},
				create: null,
				disabled: false,
				option1: "value1",
				option2: "value2",
				option3: "value3",
				option4: {
					option4a: "valuea",
					option4b: "valueb"
				}
			} );
		}
	} );
	$( "<div>" ).testWidget( {
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
	} );
} );

QUnit.test( "._getCreateOptions()", function( assert ) {
	assert.expect( 4 );
	$.widget( "ui.testWidget", {
		options: {
			option1: "valuex",
			option2: "valuex",
			option3: "value3"
		},
		_getCreateOptions: function() {
			var superOptions = this._super();

			assert.deepEqual( superOptions, {}, "Base implementation returns empty object" );

			// Support: IE8
			// Strict equality fails when comparing this.window in ie8
			assert.equal( this.window[ 0 ], window, "this.window is properly defined" );
			assert.strictEqual( this.document[ 0 ], document, "this.document is properly defined" );

			return {
				option1: "override1",
				option2: "overideX"
			};
		},
		_create: function() {
			assert.deepEqual( this.options, {
				classes: {},
				create: null,
				disabled: false,
				option1: "override1",
				option2: "value2",
				option3: "value3"
			} );
		}
	} );
	$( "<div>" ).testWidget( { option2: "value2" } );
} );

QUnit.test( "._getCreateEventData()", function( assert ) {
	assert.expect( 1 );
	var data = { foo: "bar" };
	$.widget( "ui.testWidget", {
		_getCreateEventData: function() {
			return data;
		}
	} );
	$( "<div>" ).testWidget( {
		create: function( event, ui ) {
			assert.strictEqual( ui, data, "event data" );
		}
	} );
} );

QUnit.test( "re-init", function( assert ) {
	assert.expect( 3 );
	var div = $( "<div>" ),
		actions = [];

	$.widget( "ui.testWidget", {
		_create: function() {
			actions.push( "create" );
		},
		_init: function() {
			actions.push( "init" );
		},
		_setOption: function( key ) {
			actions.push( "option" + key );
		}
	} );

	actions = [];
	div.testWidget( { foo: "bar" } );
	assert.deepEqual( actions, [ "create", "init" ], "correct methods called on init" );

	actions = [];
	div.testWidget();
	assert.deepEqual( actions, [ "init" ], "correct methods call on re-init" );

	actions = [];
	div.testWidget( { foo: "bar" } );
	assert.deepEqual( actions, [ "optionfoo", "init" ], "correct methods called on re-init with options" );
} );

QUnit.test( "redeclare", function( assert ) {
	assert.expect( 2 );

	$.widget( "ui.testWidget", {} );
	assert.equal( $.ui.testWidget.prototype.widgetEventPrefix, "testWidget" );

	$.widget( "ui.testWidget", {} );
	assert.equal( $.ui.testWidget.prototype.widgetEventPrefix, "testWidget" );
} );

QUnit.test( "inheritance", function( assert ) {
	assert.expect( 6 );

	// #5830 - Widget: Using inheritance overwrites the base classes options
	$.widget( "ui.testWidgetBase", {
		options: {
			obj: {
				key1: "foo",
				key2: "bar"
			},
			arr: [ "testing" ]
		}
	} );

	$.widget( "ui.testWidgetExtension", $.ui.testWidgetBase, {
		options: {
			obj: {
				key1: "baz"
			},
			arr: [ "alpha", "beta" ]
		}
	} );

	assert.equal( $.ui.testWidgetBase.prototype.widgetEventPrefix, "testWidgetBase",
		"base class event prefix" );
	assert.deepEqual( $.ui.testWidgetBase.prototype.options.obj, {
		key1: "foo",
		key2: "bar"
	}, "base class option object not overridden" );
	assert.deepEqual( $.ui.testWidgetBase.prototype.options.arr, [ "testing" ],
		"base class option array not overridden" );

	assert.equal( $.ui.testWidgetExtension.prototype.widgetEventPrefix, "testWidgetExtension",
		"extension class event prefix" );
	assert.deepEqual( $.ui.testWidgetExtension.prototype.options.obj, {
		key1: "baz",
		key2: "bar"
	}, "extension class option object extends base" );
	assert.deepEqual( $.ui.testWidgetExtension.prototype.options.arr, [ "alpha", "beta" ],
		"extension class option array overwrites base" );

	delete $.ui.testWidgetBase;
	delete $.fn.testWidgetBase;
	delete $.ui.testWidgetExtension;
	delete $.fn.testWidgetExtension;
} );

QUnit.test( "._super()", function( assert ) {
	assert.expect( 9 );
	var instance;
	$.widget( "ui.testWidget", {
		method: function( a, b ) {
			assert.deepEqual( this, instance, "this is correct in testWidget" );
			assert.deepEqual( a, 5, "parameter passed to testWidget" );
			assert.deepEqual( b, 20, "second parameter passed to testWidget" );
			return a + b;
		}
	} );

	$.widget( "ui.testWidget2", $.ui.testWidget, {
		method: function( a, b ) {
			assert.deepEqual( this, instance, "this is correct in testWidget2" );
			assert.deepEqual( a, 5, "parameter passed to testWidget2" );
			assert.deepEqual( b, 10, "parameter passed to testWidget2" );
			return this._super( a, b * 2 );
		}
	} );

	$.widget( "ui.testWidget3", $.ui.testWidget2, {
		method: function( a ) {
			assert.deepEqual( this, instance, "this is correct in testWidget3" );
			assert.deepEqual( a, 5, "parameter passed to testWidget3" );
			var ret = this._super( a, a * 2 );
			assert.deepEqual( ret, 25, "super returned value" );
		}
	} );

	instance = $( "<div>" ).testWidget3().testWidget3( "instance" );
	instance.method( 5 );
	delete $.ui.testWidget3;
	delete $.fn.testWidget3;
	delete $.ui.testWidget2;
	delete $.fn.testWidget2;
} );

QUnit.test( "._superApply()", function( assert ) {
	assert.expect( 10 );
	var instance;
	$.widget( "ui.testWidget", {
		method: function( a, b ) {
			assert.deepEqual( this, instance, "this is correct in testWidget" );
			assert.deepEqual( a, 5, "parameter passed to testWidget" );
			assert.deepEqual( b, 10, "second parameter passed to testWidget" );
			return a + b;
		}
	} );

	$.widget( "ui.testWidget2", $.ui.testWidget, {
		method: function( a, b ) {
			assert.deepEqual( this, instance, "this is correct in testWidget2" );
			assert.deepEqual( a, 5, "parameter passed to testWidget2" );
			assert.deepEqual( b, 10, "second parameter passed to testWidget2" );
			return this._superApply( arguments );
		}
	} );

	$.widget( "ui.testWidget3", $.ui.testWidget2, {
		method: function( a, b ) {
			assert.deepEqual( this, instance, "this is correct in testWidget3" );
			assert.deepEqual( a, 5, "parameter passed to testWidget3" );
			assert.deepEqual( b, 10, "second parameter passed to testWidget3" );
			var ret = this._superApply( arguments );
			assert.deepEqual( ret, 15, "super returned value" );
		}
	} );

	instance = $( "<div>" ).testWidget3().testWidget3( "instance" );
	instance.method( 5, 10 );
	delete $.ui.testWidget3;
	delete $.fn.testWidget3;
	delete $.ui.testWidget2;
	delete $.fn.testWidget2;
} );

QUnit.test( "mixins", function( assert ) {
	assert.expect( 5 );

	var mixin1 = {
		foo: function() {
			assert.equal( method, "foo", "Methods from first mixin are copied over" );
		}
	};
	var mixin2 = {
		bar: function() {
			assert.equal( method, "bar", "Methods from second mixin are copied over" );
		}
	};
	var prototype = {
		baz: function() {
			assert.equal( method, "baz", "Methods from protoype are copied over" );
		}
	};
	var existingBar = mixin2.bar;
	var method;

	$.widget( "ui.testWidget", [ mixin1, mixin2, prototype ] );
	method = "foo";
	$.ui.testWidget.prototype.foo();
	method = "bar";
	$.ui.testWidget.prototype.bar();
	method = "baz";
	$.ui.testWidget.prototype.baz();

	mixin1.foo = function() {
		assert.ok( false, "Changes to a mixin don't change the prototype" );
	};
	method = "foo";
	$.ui.testWidget.prototype.foo();

	$.ui.testWidget.prototype.bar = function() {};
	assert.strictEqual( mixin2.bar, existingBar, "Changes to a prototype don't change the mixin" );
} );

QUnit.test( "mixins with inheritance", function( assert ) {
	assert.expect( 4 );

	var mixin1 = {
		foo: function() {
			assert.equal( method, "foo", "Methods from first mixin are copied over" );
		}
	};
	var mixin2 = {
		bar: function() {
			assert.equal( method, "bar", "Methods from second mixin are copied over" );
		}
	};
	var parentPrototype = {
		baz: function() {
			assert.equal( method, "baz", "Methods from parent protoype are copied over" );
		}
	};
	var childPrototype = {
		qux: function() {
			assert.equal( method, "qux", "Methods from child protoype are copied over" );
		}
	};
	var method;

	$.widget( "ui.testWidget", [ mixin1, parentPrototype ] );
	$.widget( "ui.testWidget2", $.ui.testWidget, [ mixin2, childPrototype ] );
	method = "foo";
	$.ui.testWidget2.prototype.foo();
	method = "bar";
	$.ui.testWidget2.prototype.bar();
	method = "baz";
	$.ui.testWidget2.prototype.baz();
	method = "qux";
	$.ui.testWidget2.prototype.qux();

	delete $.ui.testWidget2;
	delete $.fn.testWidget2;
} );

QUnit.test( ".option() - getter", function( assert ) {
	assert.expect( 6 );
	$.widget( "ui.testWidget", {
		_create: function() {}
	} );

	var options,
		div = $( "<div>" ).testWidget( {
			foo: "bar",
			baz: 5,
			qux: [ "quux", "quuux" ]
		} );

	assert.deepEqual( div.testWidget( "option", "x" ), null, "non-existent option" );
	assert.deepEqual( div.testWidget( "option", "foo" ), "bar", "single option - string" );
	assert.deepEqual( div.testWidget( "option", "baz" ), 5, "single option - number" );
	assert.deepEqual( div.testWidget( "option", "qux" ), [ "quux", "quuux" ],
		"single option - array" );

	options = div.testWidget( "option" );
	assert.deepEqual( options, {
		baz: 5,
		classes: {},
		create: null,
		disabled: false,
		foo: "bar",
		qux: [ "quux", "quuux" ]
	}, "full options hash returned" );
	options.foo = "notbar";
	assert.deepEqual( div.testWidget( "option", "foo" ), "bar",
		"modifying returned options hash does not modify plugin instance" );
} );

QUnit.test( ".option() - deep option getter", function( assert ) {
	assert.expect( 5 );
	$.widget( "ui.testWidget", {} );
	var div = $( "<div>" ).testWidget( {
		foo: {
			bar: "baz",
			qux: {
				quux: "xyzzy"
			}
		}
	} );
	assert.equal( div.testWidget( "option", "foo.bar" ), "baz", "one level deep - string" );
	assert.deepEqual( div.testWidget( "option", "foo.qux" ), { quux: "xyzzy" },
		"one level deep - object" );
	assert.equal( div.testWidget( "option", "foo.qux.quux" ), "xyzzy", "two levels deep - string" );
	assert.equal( div.testWidget( "option", "x.y" ), null, "top level non-existent" );
	assert.equal( div.testWidget( "option", "foo.x.y" ), null, "one level deep - non-existent" );
} );

QUnit.test( ".option() - delegate to ._setOptions()", function( assert ) {
	assert.expect( 2 );
	var div,
		calls = [];
	$.widget( "ui.testWidget", {
		_create: function() {},
		_setOptions: function( options ) {
			calls.push( options );
		}
	} );
	div = $( "<div>" ).testWidget();

	calls = [];
	div.testWidget( "option", "foo", "bar" );
	assert.deepEqual( calls, [ { foo: "bar" } ], "_setOptions called for single option" );

	calls = [];
	div.testWidget( "option", {
		bar: "qux",
		quux: "quuux"
	} );
	assert.deepEqual( calls, [ { bar: "qux", quux: "quuux" } ],
		"_setOptions called with multiple options" );
} );

QUnit.test( ".option() - delegate to ._setOption()", function( assert ) {
	assert.expect( 3 );
	var div,
		calls = [];
	$.widget( "ui.testWidget", {
		_create: function() {},
		_setOption: function( key, val ) {
			calls.push( {
				key: key,
				val: val
			} );
		}
	} );
	div = $( "<div>" ).testWidget();

	calls = [];
	div.testWidget( "option", "foo", "bar" );
	assert.deepEqual( calls, [ { key: "foo", val: "bar" } ],
		"_setOption called for single option" );

	calls = [];
	div.testWidget( "option", "foo", undefined );
	assert.deepEqual( calls, [ { key: "foo", val: undefined } ],
		"_setOption called for single option where value is undefined" );

	calls = [];
	div.testWidget( "option", {
		bar: "qux",
		quux: "quuux"
	} );
	assert.deepEqual( calls, [
		{ key: "bar", val: "qux" },
		{ key: "quux", val: "quuux" }
	], "_setOption called with multiple options" );
} );

QUnit.test( ".option() - deep option setter", function( assert ) {
	assert.expect( 9 );
	$.widget( "ui.testWidget", {} );
	var result, div = $( "<div>" ).testWidget();
	function deepOption( from, to, msg ) {
		div.testWidget( "instance" ).options.foo = from;
		$.ui.testWidget.prototype._setOption = function( key, value ) {
			assert.deepEqual( key, "foo", msg + ": key" );
			assert.deepEqual( value, to, msg + ": value" );
		};
	}

	deepOption( { bar: "baz" }, { bar: "qux" }, "one deep" );
	div.testWidget( "option", "foo.bar", "qux" );

	deepOption( { bar: "baz" }, { bar: undefined }, "one deep - value = undefined" );

	result = div.testWidget( "option", "foo.bar", undefined );

	assert.deepEqual( result, div, "option should return widget on successful set operation" );

	deepOption( null, { bar: "baz" }, "null" );
	div.testWidget( "option", "foo.bar", "baz" );

	deepOption(
		{ bar: "baz", qux: { quux: "quuux" } },
		{ bar: "baz", qux: { quux: "quuux", newOpt: "newVal" } },
		"add property" );
	div.testWidget( "option", "foo.qux.newOpt", "newVal" );
} );

QUnit.test( ".enable()", function( assert ) {
	assert.expect( 2 );
	$.widget( "ui.testWidget", {
		_create: function() {},
		_setOption: function( key, val ) {
			assert.deepEqual( key, "disabled", "_setOption called with disabled option" );
			assert.deepEqual( val, false, "disabled set to false" );
		}
	} );
	$( "<div>" ).testWidget().testWidget( "enable" );
} );

QUnit.test( ".disable()", function( assert ) {
	assert.expect( 2 );
	$.widget( "ui.testWidget", {
		_create: function() {},
		_setOption: function( key, val ) {
			assert.deepEqual( key, "disabled", "_setOption called with disabled option" );
			assert.deepEqual( val, true, "disabled set to true" );
		}
	} );
	$( "<div>" ).testWidget().testWidget( "disable" );
} );

QUnit.test( "._setOptionDisabled()", function( assert ) {
	assert.expect( 3 );

	var method;
	var widget;

	$.widget( "ui.testWidget", {
		_setOptionDisabled: function( value ) {
			method( value );
		}
	} );

	method = function() {
		assert.ok( false, "._setOptionDisabled() called on init when not disabled" );
	};
	$( "<div>" ).testWidget();

	method = function( value ) {
		assert.strictEqual( value, true, "._setOptionDisabled called on init when disabled" );
	};
	widget = $( "<div>" ).testWidget( { disabled: true } );

	method = function( value ) {
		assert.strictEqual( value, false, "._setOptionDisabled called when enabling" );
	};
	widget.testWidget( "enable" );

	method = function( value ) {
		assert.strictEqual( value, true, "._setOptionDisabled called when disabling" );
	};
	widget.testWidget( "option", "disabled", true );
} );

QUnit.test( ".widget() - base", function( assert ) {
	assert.expect( 2 );
	var constructor = $.widget( "ui.testWidget", {
			_create: function() {}
		} ),
		div = $( "<div>" ).testWidget();
	assert.deepEqual( div[ 0 ], div.testWidget( "widget" )[ 0 ] );
	assert.deepEqual( constructor, $.ui.testWidget, "$.widget returns the constructor" );
} );

QUnit.test( ".widget() - overriden", function( assert ) {
	assert.expect( 1 );
	var wrapper = $( "<div>" );
	$.widget( "ui.testWidget", {
		_create: function() {},
		widget: function() {
			return wrapper;
		}
	} );
	assert.deepEqual( wrapper[ 0 ], $( "<div>" ).testWidget().testWidget( "widget" )[ 0 ] );
} );

QUnit.test( ".instance()", function( assert ) {
	assert.expect( 3 );
	var div;

	$.widget( "ui.testWidget", {
		_create: function() {}
	} );

	div = $( "<div>" );
	assert.equal( div.testWidget( "instance" ), undefined, "uninitialized" );
	div.testWidget();
	assert.equal( div.testWidget( "instance" ), div.testWidget( "instance" ), "initialized" );

	assert.equal( $().testWidget( "instance" ), undefined, "empty set" );
} );

QUnit.test( "._on() to element (default)", function( assert ) {
	assert.expect( 12 );
	var that, widget;
	$.widget( "ui.testWidget", {
		_create: function() {
			that = this;
			this._on( {
				keyup: this.keyup,
				keydown: "keydown"
			} );
		},
		keyup: function( event ) {
			assert.equal( that, this );
			assert.equal( that.element[ 0 ], event.currentTarget );
			assert.equal( "keyup", event.type );
		},
		keydown: function( event ) {
			assert.equal( that, this );
			assert.equal( that.element[ 0 ], event.currentTarget );
			assert.equal( "keydown", event.type );
		}
	} );
	widget = $( "<div></div>" )
		.testWidget()
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "disable" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "enable" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "destroy" )
		.trigger( "keyup" )
		.trigger( "keydown" );
} );

QUnit.test( "._on() to element with suppressDisabledCheck", function( assert ) {
	assert.expect( 18 );
	var that, widget;
	$.widget( "ui.testWidget", {
		_create: function() {
			that = this;
			this._on( true, {
				keyup: this.keyup,
				keydown: "keydown"
			} );
		},
		keyup: function( event ) {
			assert.equal( that, this );
			assert.equal( that.element[ 0 ], event.currentTarget );
			assert.equal( "keyup", event.type );
		},
		keydown: function( event ) {
			assert.equal( that, this );
			assert.equal( that.element[ 0 ], event.currentTarget );
			assert.equal( "keydown", event.type );
		}
	} );
	widget = $( "<div></div>" )
		.testWidget()
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "disable" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "enable" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "destroy" )
		.trigger( "keyup" )
		.trigger( "keydown" );
} );

QUnit.test( "._on() to descendent", function( assert ) {
	assert.expect( 12 );
	var that, widget, descendant;
	$.widget( "ui.testWidget", {
		_create: function() {
			that = this;
			this._on( this.element.find( "strong" ), {
				keyup: this.keyup,
				keydown: "keydown"
			} );
		},
		keyup: function( event ) {
			assert.equal( that, this );
			assert.equal( that.element.find( "strong" )[ 0 ], event.currentTarget );
			assert.equal( "keyup", event.type );
		},
		keydown: function( event ) {
			assert.equal( that, this );
			assert.equal( that.element.find( "strong" )[ 0 ], event.currentTarget );
			assert.equal( "keydown", event.type );
		}
	} );

	// Trigger events on both widget and descendent to ensure that only descendent receives them
	widget = $( "<div><p><strong>hello</strong> world</p></div>" )
		.testWidget()
		.trigger( "keyup" )
		.trigger( "keydown" );
	descendant = widget.find( "strong" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "disable" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	descendant
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "enable" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	descendant
		.trigger( "keyup" )
		.trigger( "keydown" );
	descendant
		.addClass( "ui-state-disabled" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "destroy" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	descendant
		.trigger( "keyup" )
		.trigger( "keydown" );
} );

QUnit.test( "_on() with delegate", function( assert ) {
	assert.expect( 8 );
	$.widget( "ui.testWidget", {
		_create: function() {
			var uuid = this.uuid;
			this.element = {
				on: function( event, handler ) {
					assert.equal( event, "click.testWidget" + uuid );
					assert.ok( $.isFunction( handler ) );
				},
				trigger: $.noop
			};
			this.widget = function() {
				return {
					on: function( event, selector, handler ) {
						assert.equal( selector, "a" );
						assert.equal( event, "click.testWidget" + uuid );
						assert.ok( $.isFunction( handler ) );
					}
				};
			};
			this._on( {
				"click": "handler",
				"click a": "handler"
			} );
			this.widget = function() {
				return {
					on: function( event, selector, handler ) {
						assert.equal( selector, "form fieldset > input" );
						assert.equal( event, "change.testWidget" + uuid );
						assert.ok( $.isFunction( handler ) );
					}
				};
			};
			this._on( {
				"change form fieldset > input": "handler"
			} );
		}
	} );
	$.ui.testWidget();
} );

QUnit.test( "_on() with delegate to descendent", function( assert ) {
	assert.expect( 4 );
	$.widget( "ui.testWidget", {
		_create: function() {
			this.target = $( "<p><strong>hello</strong> world</p>" );
			this.child = this.target.children();
			this._on( this.target, {
				"keyup": "handlerDirect",
				"keyup strong": "handlerDelegated"
			} );
			this.child.trigger( "keyup" );
		},
		handlerDirect: function( event ) {
			assert.deepEqual( event.currentTarget, this.target[ 0 ] );
			assert.deepEqual( event.target, this.child[ 0 ] );
		},
		handlerDelegated: function( event ) {
			assert.deepEqual( event.currentTarget, this.child[ 0 ] );
			assert.deepEqual( event.target, this.child[ 0 ] );
		}
	} );
	$.ui.testWidget();
} );

QUnit.test( "_on() to common element", function( assert ) {
	assert.expect( 4 );
	$.widget( "ui.testWidget", {
		_create: function() {
			this._on( this.document, {
				"customevent": "_handler",
				"with:colons": "_colonHandler",
				"with-dashes": "_dashHandler",
				"with-dashes:and-colons": "_commbinedHandler"
			} );
		},
		_handler: function() {
			assert.ok( true, "handler triggered" );
		},
		_colonHandler: function() {
			assert.ok( true, "colon handler triggered" );
		},
		_dashHandler: function() {
			assert.ok( true, "dash handler triggered" );
		},
		_commbinedHandler: function() {
			assert.ok( true, "combined handler triggered" );
		}
	} );
	var widget = $( "#widget" ).testWidget().testWidget( "instance" );
	$( "#widget-wrapper" ).testWidget();
	widget.destroy();
	$( document ).trigger( "customevent" );
	$( document ).trigger( "with:colons" );
	$( document ).trigger( "with-dashes" );
	$( document ).trigger( "with-dashes:and-colons" );
} );

QUnit.test( "_off() - single event", function( assert ) {
	assert.expect( 3 );

	$.widget( "ui.testWidget", {} );
	var shouldTriggerWidget, shouldTriggerOther,
		element = $( "#widget" ),
		widget = element.testWidget().testWidget( "instance" );
	widget._on( element, { foo: function() {
		assert.ok( shouldTriggerWidget, "foo called from _on" );
	} } );
	element.on( "foo", function() {
		assert.ok( shouldTriggerOther, "foo called from bind" );
	} );
	shouldTriggerWidget = true;
	shouldTriggerOther = true;
	element.trigger( "foo" );
	shouldTriggerWidget = false;
	widget._off( element, "foo" );
	element.trigger( "foo" );
} );

QUnit.test( "_off() - multiple events", function( assert ) {
	assert.expect( 6 );

	$.widget( "ui.testWidget", {} );
	var shouldTriggerWidget, shouldTriggerOther,
		element = $( "#widget" ),
		widget = element.testWidget().testWidget( "instance" );
	widget._on( element, {
		foo: function() {
			assert.ok( shouldTriggerWidget, "foo called from _on" );
		},
		bar: function() {
			assert.ok( shouldTriggerWidget, "bar called from _on" );
		}
	} );
	element.on( "foo bar", function( event ) {
		assert.ok( shouldTriggerOther, event.type + " called from bind" );
	} );
	shouldTriggerWidget = true;
	shouldTriggerOther = true;
	element.trigger( "foo" );
	element.trigger( "bar" );
	shouldTriggerWidget = false;
	widget._off( element, "foo bar" );
	element.trigger( "foo" );
	element.trigger( "bar" );
} );

QUnit.test( "_off() - all events", function( assert ) {
	assert.expect( 6 );

	$.widget( "ui.testWidget", {} );
	var shouldTriggerWidget, shouldTriggerOther,
		element = $( "#widget" ),
		widget = element.testWidget().testWidget( "instance" );
	widget._on( element, {
		foo: function() {
			assert.ok( shouldTriggerWidget, "foo called from _on" );
		},
		bar: function() {
			assert.ok( shouldTriggerWidget, "bar called from _on" );
		}
	} );
	element.on( "foo bar", function( event ) {
		assert.ok( shouldTriggerOther, event.type + " called from bind" );
	} );
	shouldTriggerWidget = true;
	shouldTriggerOther = true;
	element.trigger( "foo" );
	element.trigger( "bar" );
	shouldTriggerWidget = false;
	widget._off( element );
	element.trigger( "foo" );
	element.trigger( "bar" );
} );

QUnit.test( "._hoverable()", function( assert ) {
	assert.expect( 10 );
	$.widget( "ui.testWidget", {
		_create: function() {
			this._hoverable( this.element.children() );
		}
	} );

	var div = $( "#widget" ).testWidget().children();
	assert.lacksClasses( div, "ui-state-hover", "not hovered on init" );
	div.trigger( "mouseenter" );
	assert.hasClasses( div, "ui-state-hover", "hovered after mouseenter" );
	div.trigger( "mouseleave" );
	assert.lacksClasses( div, "ui-state-hover", "not hovered after mouseleave" );

	div.trigger( "mouseenter" );
	assert.hasClasses( div, "ui-state-hover", "hovered after mouseenter" );
	$( "#widget" ).testWidget( "disable" );
	assert.lacksClasses( div, "ui-state-hover", "not hovered while disabled" );
	div.trigger( "mouseenter" );
	assert.lacksClasses( div, "ui-state-hover", "can't hover while disabled" );
	$( "#widget" ).testWidget( "enable" );
	assert.lacksClasses( div, "ui-state-hover", "enabling doesn't reset hover" );

	div.trigger( "mouseenter" );
	assert.hasClasses( div, "ui-state-hover", "hovered after mouseenter" );
	$( "#widget" ).testWidget( "destroy" );
	assert.lacksClasses( div, "ui-state-hover", "not hovered after destroy" );
	div.trigger( "mouseenter" );
	assert.lacksClasses( div, "ui-state-hover", "event handler removed on destroy" );
} );

QUnit.test( "._focusable()", function( assert ) {
	assert.expect( 10 );
	$.widget( "ui.testWidget", {
		_create: function() {
			this._focusable( this.element.children() );
		}
	} );

	var div = $( "#widget" ).testWidget().children();
	assert.lacksClasses( div, "ui-state-focus", "not focused on init" );
	div.trigger( "focusin" );
	assert.hasClasses( div, "ui-state-focus", "focused after explicit focus" );
	div.trigger( "focusout" );
	assert.lacksClasses( div, "ui-state-focus", "not focused after blur" );

	div.trigger( "focusin" );
	assert.hasClasses( div, "ui-state-focus", "focused after explicit focus" );
	$( "#widget" ).testWidget( "disable" );
	assert.lacksClasses( div, "ui-state-focus", "not focused while disabled" );
	div.trigger( "focusin" );
	assert.lacksClasses( div, "ui-state-focus", "can't focus while disabled" );
	$( "#widget" ).testWidget( "enable" );
	assert.lacksClasses( div, "ui-state-focus", "enabling doesn't reset focus" );

	div.trigger( "focusin" );
	assert.hasClasses( div, "ui-state-focus", "focused after explicit focus" );
	$( "#widget" ).testWidget( "destroy" );
	assert.lacksClasses( div, "ui-state-focus", "not focused after destroy" );
	div.trigger( "focusin" );
	assert.lacksClasses( div, "ui-state-focus", "event handler removed on destroy" );
} );

QUnit.test( "._trigger() - no event, no ui", function( assert ) {
	assert.expect( 7 );
	var handlers = [];

	$.widget( "ui.testWidget", {
		_create: function() {}
	} );

	$( "#widget" ).testWidget( {
		foo: function( event, ui ) {
			assert.deepEqual( event.type, "testwidgetfoo", "correct event type in callback" );
			assert.deepEqual( ui, {}, "empty ui hash passed" );
			handlers.push( "callback" );
		}
	} );
	$( document ).add( "#widget-wrapper" ).add( "#widget" )
		.on( "testwidgetfoo", function( event, ui ) {
			assert.deepEqual( ui, {}, "empty ui hash passed" );
			handlers.push( this );
		} );
	assert.deepEqual( $( "#widget" ).testWidget( "instance" )._trigger( "foo" ), true,
		"_trigger returns true when event is not cancelled" );
	assert.deepEqual( handlers, [
		$( "#widget" )[ 0 ],
		$( "#widget-wrapper" )[ 0 ],
		document,
		"callback"
	], "event bubbles and then invokes callback" );

	$( document ).off( "testwidgetfoo" );
} );

QUnit.test( "._trigger() - cancelled event", function( assert ) {
	assert.expect( 3 );

	$.widget( "ui.testWidget", {
		_create: function() {}
	} );

	$( "#widget" ).testWidget( {
		foo: function() {
			assert.ok( true, "callback invoked even if event is cancelled" );
		}
	} )
	.on( "testwidgetfoo", function() {
		assert.ok( true, "event was triggered" );
		return false;
	} );
	assert.deepEqual( $( "#widget" ).testWidget( "instance" )._trigger( "foo" ), false,
		"_trigger returns false when event is cancelled" );
} );

QUnit.test( "._trigger() - cancelled callback", function( assert ) {
	assert.expect( 1 );
	$.widget( "ui.testWidget", {
		_create: function() {}
	} );

	$( "#widget" ).testWidget( {
		foo: function() {
			return false;
		}
	} );
	assert.deepEqual( $( "#widget" ).testWidget( "instance" )._trigger( "foo" ), false,
		"_trigger returns false when callback returns false" );
} );

QUnit.test( "._trigger() - provide event and ui", function( assert ) {
	assert.expect( 7 );

	var originalEvent = $.Event( "originalTest" );
	$.widget( "ui.testWidget", {
		_create: function() {},
		testEvent: function() {
			var ui = {
					foo: "bar",
					baz: {
						qux: 5,
						quux: 20
					}
				};
			this._trigger( "foo", originalEvent, ui );
			assert.deepEqual( ui, {
				foo: "notbar",
				baz: {
					qux: 10,
					quux: "jQuery"
				}
			}, "ui object modified" );
		}
	} );
	$( "#widget" ).on( "testwidgetfoo", function( event, ui ) {
		assert.equal( event.originalEvent, originalEvent, "original event object passed" );
		assert.deepEqual( ui, {
			foo: "bar",
			baz: {
				qux: 5,
				quux: 20
			}
		}, "ui hash passed" );
		ui.foo = "notbar";
	} );
	$( "#widget-wrapper" ).on( "testwidgetfoo", function( event, ui ) {
		assert.equal( event.originalEvent, originalEvent, "original event object passed" );
		assert.deepEqual( ui, {
			foo: "notbar",
			baz: {
				qux: 5,
				quux: 20
			}
		}, "modified ui hash passed" );
		ui.baz.qux = 10;
	} );
	$( "#widget" ).testWidget( {
		foo: function( event, ui ) {
			assert.equal( event.originalEvent, originalEvent, "original event object passed" );
			assert.deepEqual( ui, {
				foo: "notbar",
				baz: {
					qux: 10,
					quux: 20
				}
			}, "modified ui hash passed" );
			ui.baz.quux = "jQuery";
		}
	} )
	.testWidget( "testEvent" );
} );

QUnit.test( "._trigger() - array as ui", function( assert ) {

	// #6795 - Widget: handle array arguments to _trigger consistently
	assert.expect( 4 );

	$.widget( "ui.testWidget", {
		_create: function() {},
		testEvent: function() {
			var ui = {
					foo: "bar",
					baz: {
						qux: 5,
						quux: 20
					}
				},
				extra = {
					bar: 5
				};
			this._trigger( "foo", null, [ ui, extra ] );
		}
	} );
	$( "#widget" ).on( "testwidgetfoo", function( event, ui, extra ) {
		assert.deepEqual( ui, {
			foo: "bar",
			baz: {
				qux: 5,
				quux: 20
			}
		}, "event: ui hash passed" );
		assert.deepEqual( extra, {
			bar: 5
		}, "event: extra argument passed" );
	} );
	$( "#widget" ).testWidget( {
		foo: function( event, ui, extra ) {
			assert.deepEqual( ui, {
				foo: "bar",
				baz: {
					qux: 5,
					quux: 20
				}
			}, "callback: ui hash passed" );
			assert.deepEqual( extra, {
				bar: 5
			}, "callback: extra argument passed" );
		}
	} )
	.testWidget( "testEvent" );
} );

QUnit.test( "._trigger() - instance as element", function( assert ) {
	assert.expect( 4 );
	$.widget( "ui.testWidget", {
		defaultElement: null,
		testEvent: function() {
			this._trigger( "foo", null, { foo: "bar" } );
		}
	} );
	var instance = $.ui.testWidget( {
		foo: function( event, ui ) {
			assert.equal( event.type, "testwidgetfoo", "event object passed to callback" );
			assert.deepEqual( ui, { foo: "bar" }, "ui object passed to callback" );
		}
	} );
	$( instance ).on( "testwidgetfoo", function( event, ui ) {
		assert.equal( event.type, "testwidgetfoo", "event object passed to event handler" );
		assert.deepEqual( ui, { foo: "bar" }, "ui object passed to event handler" );
	} );
	instance.testEvent();
} );

( function() {
	function shouldDestroy( assert, expected, callback ) {
		assert.expect( 1 );
		var destroyed = false;
		$.widget( "ui.testWidget", {
			_create: function() {},
			destroy: function() {
				destroyed = true;
			}
		} );
		callback();
		assert.equal( destroyed, expected );
	}

	QUnit.test( "auto-destroy - .remove()", function( assert ) {
		shouldDestroy( assert, true, function() {
			$( "#widget" ).testWidget().remove();
		} );
	} );

	QUnit.test( "auto-destroy - .remove() when disabled", function( assert ) {
		shouldDestroy( assert, true, function() {
			$( "#widget" ).testWidget( { disabled: true } ).remove();
		} );
	} );

	QUnit.test( "auto-destroy - .remove() on parent", function( assert ) {
		shouldDestroy( assert, true, function() {
			$( "#widget" ).testWidget().parent().remove();
		} );
	} );

	QUnit.test( "auto-destroy - .remove() on child", function( assert ) {
		shouldDestroy( assert, false, function() {
			$( "#widget" ).testWidget().children().remove();
		} );
	} );

	QUnit.test( "auto-destroy - .empty()", function( assert ) {
		shouldDestroy( assert, false, function() {
			$( "#widget" ).testWidget().empty();
		} );
	} );

	QUnit.test( "auto-destroy - .empty() on parent", function( assert ) {
		shouldDestroy( assert, true, function() {
			$( "#widget" ).testWidget().parent().empty();
		} );
	} );

	QUnit.test( "auto-destroy - .detach()", function( assert ) {
		shouldDestroy( assert, false, function() {
			$( "#widget" ).testWidget().detach();
		} );
	} );

	QUnit.test( "destroy - remove event bubbling", function( assert ) {
		shouldDestroy( assert, false, function() {
			$( "<div>child</div>" ).appendTo( $( "#widget" ).testWidget() )
				.trigger( "remove" );
		} );
	} );
}() );

QUnit.test( "redefine", function( assert ) {
	assert.expect( 4 );
	$.widget( "ui.testWidget", {
		method: function( str ) {
			assert.strictEqual( this, instance, "original invoked with correct this" );
			assert.equal( str, "bar", "original invoked with correct parameter" );
		}
	} );
	$.ui.testWidget.foo = "bar";
	$.widget( "ui.testWidget", $.ui.testWidget, {
		method: function( str ) {
			assert.equal( str, "foo", "new invoked with correct parameter" );
			this._super( "bar" );
		}
	} );

	var instance = new $.ui.testWidget( {} );
	instance.method( "foo" );
	assert.equal( $.ui.testWidget.foo, "bar", "static properties remain" );
} );

QUnit.test( "redefine deep prototype chain", function( assert ) {
	assert.expect( 8 );
	$.widget( "ui.testWidget", {
		method: function( str ) {
			assert.strictEqual( this, instance, "original invoked with correct this" );
			assert.equal( str, "level 4", "original invoked with correct parameter" );
		}
	} );
	$.widget( "ui.testWidget2", $.ui.testWidget, {
		method: function( str ) {
			assert.strictEqual( this, instance, "testWidget2 invoked with correct this" );
			assert.equal( str, "level 2", "testWidget2 invoked with correct parameter" );
			this._super( "level 3" );
		}
	} );
	$.widget( "ui.testWidget3", $.ui.testWidget2, {
		method: function( str ) {
			assert.strictEqual( this, instance, "testWidget3 invoked with correct this" );
			assert.equal( str, "level 1", "testWidget3 invoked with correct parameter" );
			this._super( "level 2" );
		}
	} );

	// Redefine testWidget after other widgets have inherited from it
	// this tests whether the inheriting widgets get updated prototype chains
	$.widget( "ui.testWidget", $.ui.testWidget, {
		method: function( str ) {
			assert.strictEqual( this, instance, "new invoked with correct this" );
			assert.equal( str, "level 3", "new invoked with correct parameter" );
			this._super( "level 4" );
		}
	} );

	// Redefine testWidget3 after it has been automatically redefined
	// this tests whether we properly handle _super() when the topmost prototype
	// doesn't have the method defined
	$.widget( "ui.testWidget3", $.ui.testWidget3, {} );

	var instance = new $.ui.testWidget3( {} );
	instance.method( "level 1" );

	delete $.ui.testWidget3;
	delete $.fn.testWidget3;
	delete $.ui.testWidget2;
	delete $.fn.testWidget2;
} );

QUnit.test( "redefine - widgetEventPrefix", function( assert ) {
	assert.expect( 2 );

	$.widget( "ui.testWidget", {
		widgetEventPrefix: "test"
	} );
	assert.equal( $.ui.testWidget.prototype.widgetEventPrefix, "test",
		"cusotm prefix in original" );

	$.widget( "ui.testWidget", $.ui.testWidget, {} );
	assert.equal( $.ui.testWidget.prototype.widgetEventPrefix, "test",
		"cusotm prefix in extension" );

} );

QUnit.test( "mixins", function( assert ) {
	assert.expect( 2 );

	var mixin = {
		method: function() {
			return "mixed " + this._super();
		}
	};

	$.widget( "ui.testWidget1", {
		method: function() {
			return "testWidget1";
		}
	} );
	$.widget( "ui.testWidget2", {
		method: function() {
			return "testWidget2";
		}
	} );
	$.widget( "ui.testWidget1", $.ui.testWidget1, mixin );
	$.widget( "ui.testWidget2", $.ui.testWidget2, mixin );

	assert.equal( $( "<div>" ).testWidget1().testWidget1( "method" ),
		"mixed testWidget1", "testWidget1 mixin successful" );
	assert.equal( $( "<div>" ).testWidget2().testWidget2( "method" ),
		"mixed testWidget2", "testWidget2 mixin successful" );
} );

QUnit.test( "_delay", function( assert ) {
	var ready = assert.async();
	assert.expect( 6 );
	var order = 0,
		that;
	$.widget( "ui.testWidget", {
		defaultElement: null,
		_create: function() {
			that = this;
			var timer = this._delay( function() {
				assert.strictEqual( this, that );
				assert.equal( order, 1 );
				ready();
			}, 500 );
			assert.ok( timer !== undefined );
			timer = this._delay( "callback" );
			assert.ok( timer !== undefined );
		},
		callback: function() {
			assert.strictEqual( this, that );
			assert.equal( order, 0 );
			order += 1;
		}
	} );
	$( "#widget" ).testWidget();
} );

QUnit.test( "$.widget.bridge()", function( assert ) {
	assert.expect( 14 );

	var instance, ret,
		elem = $( "<div>" );

	function TestWidget( options, element ) {
		assert.deepEqual( options, { foo: "bar" }, "options passed" );
		assert.strictEqual( element, elem[ 0 ], "element passed" );
	}

	$.extend( TestWidget.prototype, {
		method: function( param ) {
			assert.ok( true, "method called via .pluginName(methodName)" );
			assert.equal( param, "value1",
				"parameter passed via .pluginName(methodName, param)" );
		},
		getter: function() {
			return "qux";
		},
		option: function( options ) {
			assert.deepEqual( options, {} );
		}
	} );

	$.widget.bridge( "testWidget", TestWidget );

	assert.ok( $.isFunction( $.fn.testWidget ), "jQuery plugin was created" );

	assert.strictEqual( elem.testWidget( { foo: "bar" } ), elem, "plugin returns original jQuery object" );
	instance = elem.data( "testWidget" );
	assert.equal( typeof instance, "object", "instance stored in .data(pluginName)" );
	assert.equal( typeof elem.testWidget( "instance" ), "object", "also retrievable via instance method" );

	ret = elem.testWidget( "method", "value1" );
	assert.equal( ret, elem, "jQuery object returned from method call" );

	ret = elem.testWidget( "getter" );
	assert.equal( ret, "qux", "getter returns value" );

	elem.testWidget();
	assert.ok( true, "_init is optional" );

	TestWidget.prototype._init = function() {
		assert.ok( "_init", "_init now exists, so its called" );
	};
	elem.testWidget();
} );

QUnit.test( "$.widget.bridge() - widgetFullName", function( assert ) {
	assert.expect( 1 );

	var instance,
		elem = $( "<div>" );

	function TestWidget() {}
	TestWidget.prototype.widgetFullName = "custom-widget";
	$.widget.bridge( "testWidget", TestWidget );

	elem.testWidget();
	instance = elem.data( "custom-widget" );
	assert.equal( typeof instance, "object", "instance stored in .data(widgetFullName)" );
} );

} );
