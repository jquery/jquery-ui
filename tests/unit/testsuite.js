(function() {

function testWidgetDefaults( widget, defaults ) {
	var pluginDefaults = $.ui[ widget ].prototype.options;

	// ensure that all defaults have the correct value
	test( "defined defaults", function() {
		$.each( defaults, function( key, val ) {
			if ( $.isFunction( val ) ) {
				ok( $.isFunction( pluginDefaults[ key ] ), key );
				return;
			}
			same( pluginDefaults[ key ], val, key );
		});
	});

	// ensure that all defaults were tested
	test( "tested defaults", function() {
		$.each( pluginDefaults, function( key, val ) {
			ok( key in defaults, key );
		});
	});
}

var privateMethods = [
	"_createWidget",
	"destroy",
	"option",
	"_trigger"
];

function testWidgetOverrides( widget ) {
	if ( $.uiBackCompat === false ) {
		test( "$.widget overrides", function() {
			$.each( privateMethods, function( i, method ) {
				strictEqual( $.ui[ widget ].prototype[ method ],
					$.Widget.prototype[ method ], "should not override " + method );
			});
		});
	}
}

function testBasicUsage( widget ) {
	test( "basic usage", function() {
		var defaultElement = $.ui[ widget ].prototype.defaultElement;
		$( defaultElement ).appendTo( "body" )[ widget ]().remove();
		ok( true, "initialized on element" );

		$( defaultElement )[ widget ]().remove();
		ok( true, "initialized on disconnected DOMElement - never connected" );

		$( defaultElement ).appendTo( "body" ).remove()[ widget ]().remove();
		ok( true, "initialized on disconnected DOMElement - removed" );
	});
}

window.commonWidgetTests = function( widget, settings ) {
	module( widget + ": common widget" );

	testWidgetDefaults( widget, settings.defaults );
	testWidgetOverrides( widget );
	testBasicUsage( widget );
	test( "version", function() {
		ok( "version" in $.ui[ widget ].prototype, "version property exists" );
	});
}

/*
 * Experimental assertion for comparing DOM objects.
 * 
 * Serializes an element and some attributes and it's children if any, otherwise the text.
 * Then compares the result using deepEqual.
 */
window.domEqual = function( selector, modifier, message ) {
	var attributes = ["class", "role", "id", "tabIndex", "aria-activedescendant"];
	
	function extract(value) {
		if (!value || !value.length) {
			QUnit.push( false, actual, expected, "domEqual failed, can't extract " + selector + ", message was: " + message );
			return;
		}
		var result = {};
		result.nodeName = value[0].nodeName;
		$.each(attributes, function(index, attr) {
			result[attr] = value.prop(attr);
		});
		result.children = [];
		var children = value.children();
		if (children.length) {
			children.each(function() {
				result.children.push(extract($(this)));
			});
		} else {
			result.text = value.text();
		}
		return result;
	}
	var expected = extract($(selector));
	modifier($(selector));
	
	var actual = extract($(selector));
	QUnit.push( QUnit.equiv(actual, expected), actual, expected, message );
}

}());
