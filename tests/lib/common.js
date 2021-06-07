define( [
	"qunit",
	"jquery",
	"lib/helper"
], function( QUnit, $, helper ) {
"use strict";

var exports = {};

function testWidgetDefaults( widget, defaults ) {
	var pluginDefaults = $.ui[ widget ].prototype.options;

	// Ensure that all defaults have the correct value
	QUnit.test( "defined defaults", function( assert ) {
		var count = 0;
		$.each( defaults, function( key, val ) {
			assert.expect( ++count );
			if ( typeof val === "function" ) {
				assert.ok( typeof pluginDefaults[ key ] === "function", key );
				return;
			}
			assert.deepEqual( pluginDefaults[ key ], val, key );
		} );
	} );

	// Ensure that all defaults were tested
	QUnit.test( "tested defaults", function( assert ) {
		var count = 0;
		$.each( pluginDefaults, function( key ) {
			assert.expect( ++count );
			assert.ok( key in defaults, key );
		} );
	} );
}

function testWidgetOverrides( widget ) {
	if ( $.uiBackCompat === false ) {
		QUnit.test( "$.widget overrides", function( assert ) {
			assert.expect( 4 );
			$.each( [
				"_createWidget",
				"destroy",
				"option",
				"_trigger"
			], function( i, method ) {
				assert.strictEqual( $.ui[ widget ].prototype[ method ],
					$.Widget.prototype[ method ], "should not override " + method );
			} );
		} );
	}
}

function testBasicUsage( widget ) {
	QUnit.test( "basic usage", function( assert ) {
		assert.expect( 3 );

		var defaultElement = $.ui[ widget ].prototype.defaultElement;
		$( defaultElement ).appendTo( "body" )[ widget ]().remove();
		assert.ok( true, "initialized on element" );

		$( defaultElement )[ widget ]().remove();
		assert.ok( true, "initialized on disconnected DOMElement - never connected" );

		// Ensure manipulating removed elements works (#3664)
		$( defaultElement ).appendTo( "body" ).remove()[ widget ]().remove();
		assert.ok( true, "initialized on disconnected DOMElement - removed" );
	} );
}

exports.testWidget = function( widget, settings ) {
	QUnit.module( widget + ": common widget", { afterEach: helper.moduleAfterEach } );

	testWidgetDefaults( widget, settings.defaults );
	testWidgetOverrides( widget );
	if ( !settings.noDefaultElement ) {
		testBasicUsage( widget );
	}
	QUnit.test( "version", function( assert ) {
		assert.expect( 1 );
		assert.ok( "version" in $.ui[ widget ].prototype, "version property exists" );
	} );
};

return exports;

} );
