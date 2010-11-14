/*
 * widget unit tests
 */
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

test( "jQuery usage", function() {
	expect( 11 );

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
		}
	});

	shouldCreate = true;
	var elem = $( "<div></div>" )
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
	
	var elem = $( "<div></div>" )[ 0 ];
	
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

test("merge multiple option arguments", function() {
	expect( 1 );
	$.widget( "ui.testWidget", {
		_create: function() {
			same( this.options, {
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
	$( "<div></div>" ).testWidget({
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

test( "_getCreateOptions()", function() {
	expect( 1 );
	$.widget( "ui.testWidget", {
		options: {
			option1: "valuex",
			option2: "valuex",
			option3: "value3",
		},
		_getCreateOptions: function() {
			return {
				option1: "override1",
				option2: "overideX",
			};
		},
		_create: function() {
			same( this.options, {
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
	var div = $( "<div></div>" ),
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

test( ".option() - getter", function() {
	$.widget( "ui.testWidget", {
		_create: function() {}
	});

	var div = $( "<div></div>" ).testWidget({
		foo: "bar",
		baz: 5,
		qux: [ "quux", "quuux" ]
	});

	same( div.testWidget( "option", "foo"), "bar", "single option - string" );
	same( div.testWidget( "option", "baz"), 5, "single option - number" );
	same( div.testWidget( "option", "qux"), [ "quux", "quuux" ],
		"single option - array" );

	var options = div.testWidget( "option" );
	same( options, {
		disabled: false,
		foo: "bar",
		baz: 5,
		qux: [ "quux", "quuux" ]
	}, "full options hash returned" );
	options.foo = "notbar";
	same( div.testWidget( "option", "foo"), "bar",
		"modifying returned options hash does not modify plugin instance" );
});

test( ".option() - delegate to ._setOptions()", function() {
	var calls = [];
	$.widget( "ui.testWidget", {
		_create: function() {},
		_setOptions: function( options ) {
			calls.push( options );
		}
	});
	var div = $( "<div></div>" ).testWidget();

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
	var div = $( "<div></div>" ).testWidget();

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

test( ".enable()", function() {
	expect( 2 );
	$.widget( "ui.testWidget", {
		_create: function() {},
		_setOption: function( key, val ) {
			same( key, "disabled", "_setOption called with disabled option" );
			same( val, false, "disabled set to false" );
		}
	});
	$( "<div></div>" ).testWidget().testWidget( "enable" );
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
	$( "<div></div>" ).testWidget().testWidget( "disable" );
});

test( ".widget() - base", function() {
	$.widget( "ui.testWidget", {
		_create: function() {}
	});
	var div = $( "<div></div>" ).testWidget();
	same( div[0], div.testWidget( "widget" )[0]);
});

test( ".widget() - overriden", function() {
	var wrapper = $( "<div></div>" );
	$.widget( "ui.testWidget", {
		_create: function() {},
		widget: function() {
			return wrapper;
		}
	});
	same( wrapper[0], $( "<div></div>" ).testWidget().testWidget( "widget" )[0] );
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

test( "auto-destroy - .remove()", function() {
	expect( 1 );
	$.widget( "ui.testWidget", {
		_create: function() {},
		destroy: function() {
			ok( true, "destroyed from .remove()" );
		}
	});
	$( "#widget" ).testWidget().remove();
});

test( "auto-destroy - .remove() on parent", function() {
	expect( 1 );
	$.widget( "ui.testWidget", {
		_create: function() {},
		destroy: function() {
			ok( true, "destroyed from .remove() on parent" );
		}
	});
	$( "#widget" ).testWidget().parent().remove();
});

test( "auto-destroy - .remove() on child", function() {
	$.widget( "ui.testWidget", {
		_create: function() {},
		destroy: function() {
			ok( false, "destroyed from .remove() on child" );
		}
	});
	$( "#widget" ).testWidget().children().remove();
	// http://github.com/jquery/qunit/pull/34
	$.ui.testWidget.prototype.destroy = $.noop;
});

test( "auto-destroy - .empty()", function() {
	$.widget( "ui.testWidget", {
		_create: function() {},
		destroy: function() {
			ok( false, "destroyed from .empty()" );
		}
	});
	$( "#widget" ).testWidget().empty();
	// http://github.com/jquery/qunit/pull/34
	$.ui.testWidget.prototype.destroy = $.noop;
});

test( "auto-destroy - .empty() on parent", function() {
	expect( 1 );
	$.widget( "ui.testWidget", {
		_create: function() {},
		destroy: function() {
			ok( true, "destroyed from .empty() on parent" );
		}
	});
	$( "#widget" ).testWidget().parent().empty();
});

test( "auto-destroy - .detach()", function() {
	$.widget( "ui.testWidget", {
		_create: function() {},
		destroy: function() {
			ok( false, "destroyed from .detach()" );
		}
	});
	$( "#widget" ).testWidget().detach();
});

})( jQuery );
