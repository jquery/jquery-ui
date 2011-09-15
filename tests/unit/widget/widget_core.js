(function( $ ) {

module( "widget factory", {
	teardown: function() {
		delete $.ui.testWidget;
	}
});

test( "widget creation", function() {
	var myPrototype = {
		_create: function() {},
		creationTest: function() {}
	};

	$.widget( "ui.testWidget", myPrototype );
	ok( $.isFunction( $.ui.testWidget ), "constructor was created" );
	equals( "object", typeof $.ui.testWidget.prototype, "prototype was created" );
	equals( $.ui.testWidget.prototype._create, myPrototype._create,
		"create function is copied over" );
	equals( $.ui.testWidget.prototype.creationTest, myPrototype.creationTest,
		"random function is copied over" );
	equals( $.ui.testWidget.prototype.option, $.Widget.prototype.option,
		"option method copied over from base widget" );
});

test( "element normalization", function() {
	expect( 11 );
	var elem;
	$.widget( "ui.testWidget", {} );

	$.ui.testWidget.prototype._create = function() {
		// workaround for core ticket #8381
		this.element.appendTo( "#qunit-fixture" );
		ok( this.element.is( "div" ), "generated div" );
		same( this.element.data( "testWidget" ), this, "intance stored in .data()" );
	};
	$.ui.testWidget();

	$.ui.testWidget.prototype.defaultElement = "<span data-test='pass'></span>";
	$.ui.testWidget.prototype._create = function() {
		ok( this.element.is( "span[data-test=pass]" ), "generated span with properties" );
		same( this.element.data( "testWidget" ), this, "instace stored in .data()" );
	};
	$.ui.testWidget();

	elem = $( "<input>" );
	$.ui.testWidget.prototype._create = function() {
		same( this.element[ 0 ], elem[ 0 ], "from element" );
		same( elem.data( "testWidget" ), this, "instace stored in .data()" );
	};
	$.ui.testWidget( {}, elem[ 0 ] );

	elem = $( "<div>" );
	$.ui.testWidget.prototype._create = function() {
		same( this.element[ 0 ], elem[ 0 ], "from jQuery object" );
		same( elem.data( "testWidget" ), this, "instace stored in .data()" );
	};
	$.ui.testWidget( {}, elem );

	elem = $( "<div id='element-normalization-selector'></div>" )
		.appendTo( "#qunit-fixture" );
	$.ui.testWidget.prototype._create = function() {
		same( this.element[ 0 ], elem[ 0 ], "from selector" );
		same( elem.data( "testWidget" ), this, "instace stored in .data()" );
	};
	$.ui.testWidget( {}, "#element-normalization-selector" );

	$.ui.testWidget.prototype.defaultElement = null;
	$.ui.testWidget.prototype._create = function() {
		// using strictEqual throws an error (Maximum call stack size exceeded)
		ok( this.element[ 0 ] === this, "instance as element" );
	};
	$.ui.testWidget();
});

test( "jQuery usage", function() {
	expect( 13 );

	var shouldCreate = false;

	$.widget( "ui.testWidget", {
		getterSetterVal: 5,
		_create: function() {
			ok( shouldCreate, "create called on instantiation" );
		},
		methodWithParams: function( param1, param2 ) {
			ok( true, "method called via .pluginName(methodName)" );
			equals( param1, "value1",
				"parameter passed via .pluginName(methodName, param)" );
			equals( param2, "value2",
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
	});

	shouldCreate = true;
	var elem = $( "<div>" )
		.bind( "testwidgetcreate", function() {
			ok( shouldCreate, "create event triggered on instantiation" );
		})
		.testWidget();
	shouldCreate = false;

	var instance = elem.data( "testWidget" );
	equals( typeof instance, "object", "instance stored in .data(pluginName)" );
	equals( instance.element[0], elem[0], "element stored on widget" );
	var ret = elem.testWidget( "methodWithParams", "value1", "value2" );
	equals( ret, elem, "jQuery object returned from method call" );

	ret = elem.testWidget( "getterSetterMethod" );
	equals( ret, 5, "getter/setter can act as getter" );
	ret = elem.testWidget( "getterSetterMethod", 30 );
	equals( ret, elem, "getter/setter method can be chainable" );
	equals( instance.getterSetterVal, 30, "getter/setter can act as setter" );
	ret = elem.testWidget( "jQueryObject" );
	equal( ret[ 0 ], document.body, "returned jQuery object" );
	equal( ret.end(), elem, "stack preserved" );
});

test( "direct usage", function() {
	expect( 9 );

	var shouldCreate = false;

	$.widget( "ui.testWidget", {
		getterSetterVal: 5,
		_create: function() {
			ok( shouldCreate, "create called on instantiation" );
		},
		methodWithParams: function( param1, param2 ) {
			ok( true, "method called dirctly" );
			equals( param1, "value1", "parameter passed via direct call" );
			equals( param2, "value2", "multiple parameters passed via direct call" );

			return this;
		},
		getterSetterMethod: function( val ) {
			if ( val ) {
				this.getterSetterVal = val;
			} else {
				return this.getterSetterVal;
			}
		}
	});

	var elem = $( "<div>" )[ 0 ];

	shouldCreate = true;
	var instance = new $.ui.testWidget( {}, elem );
	shouldCreate = false;

	equals( $( elem ).data( "testWidget" ), instance,
		"instance stored in .data(pluginName)" );
	equals( instance.element[ 0 ], elem, "element stored on widget" );

	var ret = instance.methodWithParams( "value1", "value2" );
	equals( ret, instance, "plugin returned from method call" );

	ret = instance.getterSetterMethod();
	equals( ret, 5, "getter/setter can act as getter" );
	instance.getterSetterMethod( 30 );
	equals( instance.getterSetterVal, 30, "getter/setter can act as setter" );
});

test( "error handling", function() {
	expect( 3 );
	var error = $.error;
	$.widget( "ui.testWidget", {
		_privateMethod: function () {}
	});
	$.error = function( msg ) {
		equal( msg, "cannot call methods on testWidget prior to initialization; " +
			"attempted to call method 'missing'", "method call before init" );
	};
	$( "<div>" ).testWidget( "missing" );
	$.error = function( msg ) {
		equal( msg, "no such method 'missing' for testWidget widget instance",
			"invalid method call on widget instance" );
	};
	$( "<div>" ).testWidget().testWidget( "missing" );
	$.error = function ( msg ) {
		equal( msg, "no such method '_privateMethod' for testWidget widget instance",
			"invalid method call on widget instance" );
	};
	$( "<div>" ).testWidget().testWidget( "_privateMethod" );
	$.error = error;
});

test( "merge multiple option arguments", function() {
	expect( 1 );
	$.widget( "ui.testWidget", {
		_create: function() {
			same( this.options, {
				create: null,
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
	$( "<div>" ).testWidget({
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

test( "._getCreateOptions()", function() {
	expect( 1 );
	$.widget( "ui.testWidget", {
		options: {
			option1: "valuex",
			option2: "valuex",
			option3: "value3"
		},
		_getCreateOptions: function() {
			return {
				option1: "override1",
				option2: "overideX"
			};
		},
		_create: function() {
			same( this.options, {
				create: null,
				disabled: false,
				option1: "override1",
				option2: "value2",
				option3: "value3"
			});
		}
	});
	$( "<div>" ).testWidget({ option2: "value2" });
});

test( "re-init", function() {
	var div = $( "<div>" ),
		actions = [];

	$.widget( "ui.testWidget", {
		_create: function() {
			actions.push( "create" );
		},
		_init: function() {
			actions.push( "init" );
		},
		_setOption: function( key, value ) {
			actions.push( "option" + key );
		}
	});

	actions = [];
	div.testWidget({ foo: "bar" });
	same( actions, [ "create", "init" ], "correct methods called on init" );

	actions = [];
	div.testWidget();
	same( actions, [ "init" ], "correct methods call on re-init" );

	actions = [];
	div.testWidget({ foo: "bar" });
	same( actions, [ "optionfoo", "init" ], "correct methods called on re-init with options" );
});

test( "inheritance - options", function() {
	// #5830 - Widget: Using inheritance overwrites the base classes options
	$.widget( "ui.testWidgetBase", {
		options: {
			obj: {
				key1: "foo",
				key2: "bar"
			},
			arr: [ "testing" ]
		}
	});

	$.widget( "ui.testWidgetExtension", $.ui.testWidgetBase, {
		options: {
			obj: {
				key1: "baz"
			},
			arr: [ "alpha", "beta" ]
		}
	});

	same( $.ui.testWidgetBase.prototype.options.obj, {
		key1: "foo",
		key2: "bar"
	}, "base class option object not overridden");
	same( $.ui.testWidgetBase.prototype.options.arr, [ "testing" ],
		"base class option array not overridden");

	same( $.ui.testWidgetExtension.prototype.options.obj, {
		key1: "baz",
		key2: "bar"
	}, "extension class option object extends base");
	same( $.ui.testWidgetExtension.prototype.options.arr, [ "alpha", "beta" ],
		"extension class option array overwrites base");

	delete $.ui.testWidgetBase;
	delete $.ui.testWidgetExtension;
});

test( "._super()", function() {
	expect( 9 );
	var instance;
	$.widget( "ui.testWidget", {
		method: function( a, b ) {
			same( this, instance, "this is correct in testWidget" );
			same( a, 5, "parameter passed to testWidget" );
			same( b, 20, "second parameter passed to testWidget" );
			return a + b;
		}
	});

	$.widget( "ui.testWidget2", $.ui.testWidget, {
		method: function( a, b ) {
			same( this, instance, "this is correct in testWidget2" );
			same( a, 5, "parameter passed to testWidget2" );
			same( b, 10, "parameter passed to testWidget2" );
			return this._super( "method", a, b*2 );
		}
	});

	$.widget( "ui.testWidget3", $.ui.testWidget2, {
		method: function( a ) {
			same( this, instance, "this is correct in testWidget3" );
			same( a, 5, "parameter passed to testWidget3" );
			var ret = this._super( "method", a, a*2 );
			same( ret, 25, "super returned value" );
		}
	});

	instance = $( "<div>" ).testWidget3().data( "testWidget3" );
	instance.method( 5 );
	delete $.ui.testWidget3;
	delete $.ui.testWidget2;
});

test( "._superApply()", function() {
	expect( 10 );
	var instance;
	$.widget( "ui.testWidget", {
		method: function( a, b ) {
			same( this, instance, "this is correct in testWidget" );
			same( a, 5, "parameter passed to testWidget" );
			same( b, 10, "second parameter passed to testWidget" );
			return a + b;
		}
	});

	$.widget( "ui.testWidget2", $.ui.testWidget, {
		method: function( a, b ) {
			same( this, instance, "this is correct in testWidget2" );
			same( a, 5, "parameter passed to testWidget2" );
			same( b, 10, "second parameter passed to testWidget2" );
			return this._superApply( "method", arguments );
		}
	});

	$.widget( "ui.testWidget3", $.ui.testWidget2, {
		method: function( a, b ) {
			same( this, instance, "this is correct in testWidget3" );
			same( a, 5, "parameter passed to testWidget3" );
			same( b, 10, "second parameter passed to testWidget3" );
			var ret = this._superApply( "method", arguments );
			same( ret, 15, "super returned value" );
		}
	});

	instance = $( "<div>" ).testWidget3().data( "testWidget3" );
	instance.method( 5, 10 );
	delete $.ui.testWidget3;
	delete $.ui.testWidget2;
});

test( ".option() - getter", function() {
	$.widget( "ui.testWidget", {
		_create: function() {}
	});

	var div = $( "<div>" ).testWidget({
		foo: "bar",
		baz: 5,
		qux: [ "quux", "quuux" ]
	});

	same( div.testWidget( "option", "x" ), null, "non-existent option" );
	same( div.testWidget( "option", "foo"), "bar", "single option - string" );
	same( div.testWidget( "option", "baz"), 5, "single option - number" );
	same( div.testWidget( "option", "qux"), [ "quux", "quuux" ],
		"single option - array" );

	var options = div.testWidget( "option" );
	same( options, {
		create: null,
		disabled: false,
		foo: "bar",
		baz: 5,
		qux: [ "quux", "quuux" ]
	}, "full options hash returned" );
	options.foo = "notbar";
	same( div.testWidget( "option", "foo"), "bar",
		"modifying returned options hash does not modify plugin instance" );
});

test( ".option() - deep option getter", function() {
	$.widget( "ui.testWidget", {} );
	var div = $( "<div>" ).testWidget({
		foo: {
			bar: "baz",
			qux: {
				quux: "xyzzy"
			}
		}
	});
	equal( div.testWidget( "option", "foo.bar" ), "baz", "one level deep - string" );
	deepEqual( div.testWidget( "option", "foo.qux" ), { quux: "xyzzy" },
		"one level deep - object" );
	equal( div.testWidget( "option", "foo.qux.quux" ), "xyzzy", "two levels deep - string" );
	equal( div.testWidget( "option", "x.y" ), null, "top level non-existent" );
	equal( div.testWidget( "option", "foo.x.y" ), null, "one level deep - non-existent" );
});

test( ".option() - delegate to ._setOptions()", function() {
	var calls = [];
	$.widget( "ui.testWidget", {
		_create: function() {},
		_setOptions: function( options ) {
			calls.push( options );
		}
	});
	var div = $( "<div>" ).testWidget();

	calls = [];
	div.testWidget( "option", "foo", "bar" );
	same( calls, [{ foo: "bar" }], "_setOptions called for single option" );

	calls = [];
	div.testWidget( "option", {
		bar: "qux",
		quux: "quuux"
	});
	same( calls, [{ bar: "qux", quux: "quuux" }],
		"_setOptions called with multiple options" );
});

test( ".option() - delegate to ._setOption()", function() {
	var calls = [];
	$.widget( "ui.testWidget", {
		_create: function() {},
		_setOption: function( key, val ) {
			calls.push({
				key: key,
				val: val
			});
		}
	});
	var div = $( "<div>" ).testWidget();

	calls = [];
	div.testWidget( "option", "foo", "bar" );
	same( calls, [{ key: "foo", val: "bar" }],
		"_setOption called for single option" );

	calls = [];
	div.testWidget( "option", {
		bar: "qux",
		quux: "quuux"
	});
	same( calls, [
		{ key: "bar", val: "qux" },
		{ key: "quux", val: "quuux" }
	], "_setOption called with multiple options" );
});

test( ".option() - deep option setter", function() {
	$.widget( "ui.testWidget", {} );
	var div = $( "<div>" ).testWidget();
	function deepOption( from, to, msg ) {
		div.data( "testWidget" ).options.foo = from;
		$.ui.testWidget.prototype._setOption = function( key, value ) {
			same( key, "foo", msg + ": key" );
			same( value, to, msg + ": value" );
		};
	}

	deepOption( { bar: "baz" }, { bar: "qux" }, "one deep" );
	div.testWidget( "option", "foo.bar", "qux" );

	deepOption( null, { bar: "baz" }, "null" );
	div.testWidget( "option", "foo.bar", "baz" );

	deepOption(
		{ bar: "baz", qux: { quux: "quuux" } },
		{ bar: "baz", qux: { quux: "quuux", newOpt: "newVal" } },
		"add property" );
	div.testWidget( "option", "foo.qux.newOpt", "newVal" );
});

test( ".enable()", function() {
	expect( 2 );
	$.widget( "ui.testWidget", {
		_create: function() {},
		_setOption: function( key, val ) {
			same( key, "disabled", "_setOption called with disabled option" );
			same( val, false, "disabled set to false" );
		}
	});
	$( "<div>" ).testWidget().testWidget( "enable" );
});

test( ".disable()", function() {
	expect( 2 );
	$.widget( "ui.testWidget", {
		_create: function() {},
		_setOption: function( key, val ) {
			same( key, "disabled", "_setOption called with disabled option" );
			same( val, true, "disabled set to true" );
		}
	});
	$( "<div>" ).testWidget().testWidget( "disable" );
});

test( ".widget() - base", function() {
	$.widget( "ui.testWidget", {
		_create: function() {}
	});
	var div = $( "<div>" ).testWidget();
	same( div[0], div.testWidget( "widget" )[0]);
});

test( ".widget() - overriden", function() {
	var wrapper = $( "<div>" );
	$.widget( "ui.testWidget", {
		_create: function() {},
		widget: function() {
			return wrapper;
		}
	});
	same( wrapper[0], $( "<div>" ).testWidget().testWidget( "widget" )[0] );
});

test( "._bind() to element (default)", function() {
	expect( 12 );
	var that;
	$.widget( "ui.testWidget", {
		_create: function() {
			that = this;
			this._bind({
				keyup: this.keyup,
				keydown: "keydown"
			});
		},
		keyup: function( event ) {
			equals( that, this );
			equals( that.element[0], event.currentTarget );
			equals( "keyup", event.type );
		},
		keydown: function( event ) {
			equals( that, this );
			equals( that.element[0], event.currentTarget );
			equals( "keydown", event.type );
		}
	});
	var widget = $( "<div></div>" )
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
});

test( "._bind() to descendent", function() {
	expect( 12 );
	var that;
	$.widget( "ui.testWidget", {
		_create: function() {
			that = this;
			this._bind( this.element.find( "strong" ), {
				keyup: this.keyup,
				keydown: "keydown"
			});
		},
		keyup: function( event ) {
			equals( that, this );
			equals( that.element.find( "strong" )[0], event.currentTarget );
			equals( "keyup", event.type );
		},
		keydown: function(event) {
			equals( that, this );
			equals( that.element.find( "strong" )[0], event.currentTarget );
			equals( "keydown", event.type );
		}
	});
	// trigger events on both widget and descendent to ensure that only descendent receives them
	var widget = $( "<div><p><strong>hello</strong> world</p></div>" )
		.testWidget()
		.trigger( "keyup" )
		.trigger( "keydown" );
	var descendent = widget.find( "strong" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "disable" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	descendent
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "enable" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	descendent
		.trigger( "keyup" )
		.trigger( "keydown" );
	descendent
		.addClass( "ui-state-disabled" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	widget
		.testWidget( "destroy" )
		.trigger( "keyup" )
		.trigger( "keydown" );
	descendent
		.trigger( "keyup" )
		.trigger( "keydown" );
});

test( "_bind() with delegate", function() {
	expect( 8 );
	$.widget( "ui.testWidget", {
		_create: function() {
			this.element = {
				bind: function( event, handler ) {
					equal( event, "click.testWidget" );
					ok( $.isFunction(handler) );
				},
				trigger: $.noop
			};
			this.widget = function() {
				return {
					delegate: function( selector, event, handler ) {
						equal( selector, "a" );
						equal( event, "click.testWidget" );
						ok( $.isFunction(handler) );
					}
				};
			};
			this._bind({
				"click": "handler",
				"click a": "handler"
			});
			this.widget = function() {
				return {
					delegate: function( selector, event, handler ) {
						equal( selector, "form fieldset > input" );
						equal( event, "change.testWidget" );
						ok( $.isFunction(handler) );
					}
				};
			};
			this._bind({
				"change form fieldset > input": "handler"
			});
		}
	});
	$.ui.testWidget();
});

test( "._hoverable()", function() {
	$.widget( "ui.testWidget", {
		_create: function() {
			this._hoverable( this.element.children() );
		}
	});

	var div = $( "#widget" ).testWidget().children();
	ok( !div.hasClass( "ui-state-hover" ), "not hovered on init" );
	div.trigger( "mouseenter" );
	ok( div.hasClass( "ui-state-hover" ), "hovered after mouseenter" );
	div.trigger( "mouseleave" );
	ok( !div.hasClass( "ui-state-hover" ), "not hovered after mouseleave" );

	div.trigger( "mouseenter" );
	ok( div.hasClass( "ui-state-hover" ), "hovered after mouseenter" );
	$( "#widget" ).testWidget( "disable" );
	ok( !div.hasClass( "ui-state-hover" ), "not hovered while disabled" );
	div.trigger( "mouseenter" );
	ok( !div.hasClass( "ui-state-hover" ), "can't hover while disabled" );
	$( "#widget" ).testWidget( "enable" );
	ok( !div.hasClass( "ui-state-hover" ), "enabling doesn't reset hover" );

	div.trigger( "mouseenter" );
	ok( div.hasClass( "ui-state-hover" ), "hovered after mouseenter" );
	$( "#widget" ).testWidget( "destroy" );
	ok( !div.hasClass( "ui-state-hover" ), "not hovered after destroy" );
	div.trigger( "mouseenter" );
	ok( !div.hasClass( "ui-state-hover" ), "event handler removed on destroy" );
});

test( "._focusable()", function() {
	$.widget( "ui.testWidget", {
		_create: function() {
		this._focusable( this.element.children() );
	}
	});

	var div = $( "#widget" ).testWidget().children();
	ok( !div.hasClass( "ui-state-focus" ), "not focused on init" );
	div.trigger( "focusin" );
	ok( div.hasClass( "ui-state-focus" ), "focused after explicit focus" );
	div.trigger( "focusout" );
	ok( !div.hasClass( "ui-state-focus" ), "not focused after blur" );

	div.trigger( "focusin" );
	ok( div.hasClass( "ui-state-focus" ), "focused after explicit focus" );
	$( "#widget" ).testWidget( "disable" );
	ok( !div.hasClass( "ui-state-focus" ), "not focused while disabled" );
	div.trigger( "focusin" );
	ok( !div.hasClass( "ui-state-focus" ), "can't focus while disabled" );
	$( "#widget" ).testWidget( "enable" );
	ok( !div.hasClass( "ui-state-focus" ), "enabling doesn't reset focus" );

	div.trigger( "focusin" );
	ok( div.hasClass( "ui-state-focus" ), "focused after explicit focus" );
	$( "#widget" ).testWidget( "destroy" );
	ok( !div.hasClass( "ui-state-focus" ), "not focused after destroy" );
	div.trigger( "focusin" );
	ok( !div.hasClass( "ui-state-focus" ), "event handler removed on destroy" );
});

test( "._trigger() - no event, no ui", function() {
	expect( 7 );
	var handlers = [];

	$.widget( "ui.testWidget", {
		_create: function() {}
	});

	$( "#widget" ).testWidget({
		foo: function( event, ui ) {
			same( event.type, "testwidgetfoo", "correct event type in callback" );
			same( ui, {}, "empty ui hash passed" );
			handlers.push( "callback" );
		}
	});
	$( document ).add( "#widget-wrapper" ).add( "#widget" )
		.bind( "testwidgetfoo", function( event, ui ) {
			same( ui, {}, "empty ui hash passed" );
			handlers.push( this );
		});
	same( $( "#widget" ).data( "testWidget" )._trigger( "foo" ), true,
		"_trigger returns true when event is not cancelled" );
	same( handlers, [
		$( "#widget" )[ 0 ],
		$( "#widget-wrapper" )[ 0 ],
		document,
		"callback"
	], "event bubbles and then invokes callback" );

	$( document ).unbind( "testwidgetfoo" );
});

test( "._trigger() - cancelled event", function() {
	expect( 3 );

	$.widget( "ui.testWidget", {
		_create: function() {}
	});

	$( "#widget" ).testWidget({
		foo: function( event, ui ) {
			ok( true, "callback invoked even if event is cancelled" );
		}
	})
	.bind( "testwidgetfoo", function( event, ui ) {
		ok( true, "event was triggered" );
		return false;
	});
	same( $( "#widget" ).data( "testWidget" )._trigger( "foo" ), false,
		"_trigger returns false when event is cancelled" );
});

test( "._trigger() - cancelled callback", function() {
	$.widget( "ui.testWidget", {
		_create: function() {}
	});

	$( "#widget" ).testWidget({
		foo: function( event, ui ) {
			return false;
		}
	});
	same( $( "#widget" ).data( "testWidget" )._trigger( "foo" ), false,
		"_trigger returns false when callback returns false" );
});

test( "._trigger() - provide event and ui", function() {
	expect( 7 );

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
			same( ui, {
				foo: "notbar",
				baz: {
					qux: 10,
					quux: "jQuery"
				}
			}, "ui object modified" );
		}
	});
	$( "#widget" ).bind( "testwidgetfoo", function( event, ui ) {
		equal( event.originalEvent, originalEvent, "original event object passed" );
		same( ui, {
			foo: "bar",
			baz: {
				qux: 5,
				quux: 20
			}
		}, "ui hash passed" );
		ui.foo = "notbar";
	});
	$( "#widget-wrapper" ).bind( "testwidgetfoo", function( event, ui ) {
		equal( event.originalEvent, originalEvent, "original event object passed" );
		same( ui, {
			foo: "notbar",
			baz: {
				qux: 5,
				quux: 20
			}
		}, "modified ui hash passed" );
		ui.baz.qux = 10;
	});
	$( "#widget" ).testWidget({
		foo: function( event, ui ) {
			equal( event.originalEvent, originalEvent, "original event object passed" );
			same( ui, {
				foo: "notbar",
				baz: {
					qux: 10,
					quux: 20
				}
			}, "modified ui hash passed" );
			ui.baz.quux = "jQuery";
		}
	})
	.testWidget( "testEvent" );
});

test( "._trigger() - array as ui", function() {
	// #6795 - Widget: handle array arguments to _trigger consistently
	expect( 4 );

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
			var extra = {
				bar: 5
			};
			this._trigger( "foo", null, [ ui, extra ] );
		}
	});
	$( "#widget" ).bind( "testwidgetfoo", function( event, ui, extra ) {
		same( ui, {
			foo: "bar",
			baz: {
				qux: 5,
				quux: 20
			}
		}, "event: ui hash passed" );
		same( extra, {
			bar: 5
		}, "event: extra argument passed" );
	});
	$( "#widget" ).testWidget({
		foo: function( event, ui, extra ) {
			same( ui, {
				foo: "bar",
				baz: {
					qux: 5,
					quux: 20
				}
			}, "callback: ui hash passed" );
			same( extra, {
				bar: 5
			}, "callback: extra argument passed" );
		}
	})
	.testWidget( "testEvent" );
});

test( "._trigger() - instance as element", function() {
	expect( 4 );
	$.widget( "ui.testWidget", {
		defaultElement: null,
		testEvent: function() {
			var ui = { foo: "bar" };
			this._trigger( "foo", null, ui );
		}
	});
	var instance = $.ui.testWidget({
		foo: function( event, ui ) {
			equal( event.type, "testwidgetfoo", "event object passed to callback" );
			same( ui, { foo: "bar" }, "ui object passed to callback" );
		}
	});
	$( instance ).bind( "testwidgetfoo", function( event, ui ) {
		equal( event.type, "testwidgetfoo", "event object passed to event handler" );
		same( ui, { foo: "bar" }, "ui object passed to event handler" );
	});
	instance.testEvent();
});

(function() {
	function shouldDestroy( expected, callback ) {
		expect( 1 );
		var destroyed = false;
		$.widget( "ui.testWidget", {
			_create: function() {},
			destroy: function() {
				destroyed = true;
			}
		});
		callback();
		equal( destroyed, expected );
	}

	test( "auto-destroy - .remove()", function() {
		shouldDestroy( true, function() {
			$( "#widget" ).testWidget().remove();
		});
	});

	test( "auto-destroy - .remove() on parent", function() {
		shouldDestroy( true, function() {
			$( "#widget" ).testWidget().parent().remove();
		});
	});

	test( "auto-destroy - .remove() on child", function() {
		shouldDestroy( false, function() {
			$( "#widget" ).testWidget().children().remove();
		});
	});

	test( "auto-destroy - .empty()", function() {
		shouldDestroy( false, function() {
			$( "#widget" ).testWidget().empty();
		});
	});

	test( "auto-destroy - .empty() on parent", function() {
		shouldDestroy( true, function() {
			$( "#widget" ).testWidget().parent().empty();
		});
	});

	test( "auto-destroy - .detach()", function() {
		shouldDestroy( false, function() {
			$( "#widget" ).testWidget().detach();
		});
	});
}());

test( "redefine", function() {
	expect( 4 );
	$.widget( "ui.testWidget", {
		method: function( str ) {
			strictEqual( this, instance, "original invoked with correct this" );
			equal( str, "bar", "original invoked with correct parameter" );
		}
	});
	$.ui.testWidget.foo = "bar";
	$.widget( "ui.testWidget", $.ui.testWidget, {
		method: function( str ) {
			equal( str, "foo", "new invoked with correct parameter" );
			this._super( "method", "bar" );
		}
	});

	var instance = new $.ui.testWidget();
	instance.method( "foo" );
	equal( $.ui.testWidget.foo, "bar", "static properties remain" );
});

asyncTest( "_delay", function() {
	expect( 6 );
	var order = 0,
		that;
	$.widget( "ui.testWidget", {
		defaultElement: null,
		_create: function() {
			that = this;
			var timer = this._delay(function() {
				strictEqual( this, that );
				equal( order, 1 );
				start();
			}, 500);
			ok( timer !== undefined );
			timer = this._delay("callback");
			ok( timer !== undefined );
		},
		callback: function() {
			strictEqual( this, that );
			equal( order, 0 );
			order += 1;
		}
	});
	$( "#widget" ).testWidget();
});

}( jQuery ) );
