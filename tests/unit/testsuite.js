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
	"enable",
	"disable",
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
		ok( "version" in $.ui[ widget ], "version property exists" );
	});
};

}());
