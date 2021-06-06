define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/spinner",
	"globalize",
	"globalize/ja-JP"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "spinner: options", { afterEach: helper.moduleAfterEach }  );

// Culture is tested after numberFormat, since it depends on numberFormat

QUnit.test( "icons: default ", function( assert ) {
	assert.expect( 4 );
	var element = $( "#spin" ).val( 0 ).spinner();
	assert.hasClasses( element.spinner( "widget" ).find( ".ui-icon" ).first(),
		"ui-icon ui-icon-triangle-1-n" );
	assert.hasClasses( element.spinner( "widget" ).find( ".ui-icon" ).last(),
		"ui-icon ui-icon-triangle-1-s" );

	element.spinner( "option", "icons", {
		up: "ui-icon-caret-1-n",
		down: "ui-icon-caret-1-s"
	} );
	assert.hasClasses( element.spinner( "widget" ).find( ".ui-icon" ).first(),
		"ui-icon ui-icon-caret-1-n" );
	assert.hasClasses( element.spinner( "widget" ).find( ".ui-icon" ).last(),
		"ui-icon ui-icon-caret-1-s" );
} );

QUnit.test( "icons: custom ", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).val( 0 ).spinner( {
		icons: {
			down: "custom-down",
			up: "custom-up"
		}
	} ).spinner( "widget" );
	assert.hasClasses( element.find( ".ui-icon" ).first(), "ui-icon custom-up" );
	assert.hasClasses( element.find( ".ui-icon" ).last(), "ui-icon custom-down" );
} );

QUnit.test( "incremental, false", function( assert ) {
	assert.expect( 100 );

	var i,
		prev = 0,
		element = $( "#spin" ).val( prev ).spinner( {
			incremental: false,
			spin: function( event, ui ) {
				assert.equal( ui.value - prev, 1 );
				prev = ui.value;
			}
		} );

	for ( i = 0; i < 100; i++ ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	}
	element.simulate( "keyup", { keyCode: $.ui.keyCode.UP } );
} );

QUnit.test( "incremental, true", function( assert ) {
	assert.expect( 100 );

	function fill( num, val ) {
		return $.map( new Array( num ), function() {
			return val;
		} );
	}

	var i,
		prev = 0,
		expected = [].concat( fill( 18, 1 ), fill( 37, 2 ), fill( 14, 3 ),
			fill( 9, 4 ), fill( 6, 5 ), fill( 5, 6 ), fill( 5, 7 ),
			fill( 4, 8 ), fill( 2, 9 ) ),
		element = $( "#spin" ).val( prev ).spinner( {
			incremental: true,
			spin: function( event, ui ) {
				assert.equal( ui.value - prev, expected[ i ] );
				prev = ui.value;
			}
		} );

	for ( i = 0; i < 100; i++ ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	}
	element.simulate( "keyup", { keyCode: $.ui.keyCode.UP } );
} );

QUnit.test( "incremental, function", function( assert ) {
	assert.expect( 100 );

	var i,
		prev = 0,
		element = $( "#spin" ).val( prev ).spinner( {
			incremental: function( i ) {
				return i;
			},
			spin: function( event, ui ) {
				assert.equal( ui.value - prev, i + 1 );
				prev = ui.value;
			}
		} );

	for ( i = 0; i < 100; i++ ) {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	}
	element.simulate( "keyup", { keyCode: $.ui.keyCode.UP } );
} );

QUnit.test( "numberFormat, number", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).val( 0 ).spinner( { numberFormat: "n" } );
	assert.equal( element.val(), "0.00", "formatted on init" );
	element.spinner( "stepUp" );
	assert.equal( element.val(), "1.00", "formatted after step" );
} );

QUnit.test( "numberFormat, number, simple", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).val( 0 ).spinner( { numberFormat: "n0" } );
	assert.equal( element.val(), "0", "formatted on init" );
	element.spinner( "stepUp" );
	assert.equal( element.val(), "1", "formatted after step" );
} );

QUnit.test( "numberFormat, currency", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).val( 0 ).spinner( { numberFormat: "C" } );
	assert.equal( element.val(), "$0.00", "formatted on init" );
	element.spinner( "stepUp" );
	assert.equal( element.val(), "$1.00", "formatted after step" );
} );

QUnit.test( "numberFormat, change", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).val( 5 ).spinner( { numberFormat: "n1" } );
	assert.equal( element.val(), "5.0", "formatted on init" );
	element.spinner( "option", "numberFormat", "c" );
	assert.equal( element.val(), "$5.00", "formatted after change" );
} );

QUnit.test( "culture, null", function( assert ) {
	assert.expect( 2 );
	Globalize.culture( "ja-JP" );
	var element = $( "#spin" ).val( 0 ).spinner( { numberFormat: "C" } );
	assert.equal( element.val(), "¥0", "formatted on init" );
	element.spinner( "stepUp" );
	assert.equal( element.val(), "¥1", "formatted after step" );

	// Reset culture
	Globalize.culture( "default" );
} );

QUnit.test( "currency, ja-JP", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).val( 0 ).spinner( {
		numberFormat: "C",
		culture: "ja-JP"
	} );
	assert.equal( element.val(), "¥0", "formatted on init" );
	element.spinner( "stepUp" );
	assert.equal( element.val(), "¥1", "formatted after step" );
} );

QUnit.test( "currency, change", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).val( 5 ).spinner( {
		numberFormat: "C",
		culture: "ja-JP"
	} );
	assert.equal( element.val(), "¥5", "formatted on init" );
	element.spinner( "option", "culture", "en" );
	assert.equal( element.val(), "$5.00", "formatted after change" );
} );

QUnit.test( "max", function( assert ) {
	assert.expect( 3 );
	var element = $( "#spin" ).val( 1000 ).spinner( { max: 100 } );
	assert.equal( element.val(), 1000, "value not constrained on init" );

	element.spinner( "value", 1000 );
	assert.equal( element.val(), 100, "max constrained in value method" );

	element.val( 1000 ).trigger( "blur" );
	assert.equal( element.val(), 1000, "max not constrained if manual entry" );
} );

QUnit.test( "max, string", function( assert ) {
	assert.expect( 3 );
	var element = $( "#spin" )
		.val( 1000 )
		.spinner( {
			max: "$100.00",
			numberFormat: "C",
			culture: "en"
		} );
	assert.equal( element.val(), "$1,000.00", "value not constrained on init" );
	assert.equal( element.spinner( "option", "max" ), 100, "option converted to number" );

	element.spinner( "value", 1000 );
	assert.equal( element.val(), "$100.00", "max constrained in value method" );
} );

QUnit.test( "min", function( assert ) {
	assert.expect( 3 );
	var element = $( "#spin" ).val( -1000 ).spinner( { min: -100 } );
	assert.equal( element.val(), -1000, "value not constrained on init" );

	element.spinner( "value", -1000 );
	assert.equal( element.val(), -100, "min constrained in value method" );

	element.val( -1000 ).trigger( "blur" );
	assert.equal( element.val(), -1000, "min not constrained if manual entry" );
} );

QUnit.test( "min, string", function( assert ) {
	assert.expect( 3 );
	var element = $( "#spin" )
		.val( -1000 )
		.spinner( {
			min: "-$100.00",
			numberFormat: "C",
			culture: "en"
		} );
	assert.equal( element.val(), "($1,000.00)", "value not constrained on init" );
	assert.equal( element.spinner( "option", "min" ), -100, "option converted to number" );

	element.spinner( "value", -1000 );
	assert.equal( element.val(), "($100.00)", "min constrained in value method" );
} );

QUnit.test( "step, 2", function( assert ) {
	assert.expect( 3 );
	var element = $( "#spin" ).val( 0 ).spinner( { step: 2 } );

	element.spinner( "stepUp" );
	assert.equal( element.val(), "2", "stepUp" );

	element.spinner( "value", "10.5" );
	assert.equal( element.val(), "10", "value reset to 10" );

	element.val( "4.5" );
	element.spinner( "stepUp" );
	assert.equal( element.val(), "6", "stepUp" );
} );

QUnit.test( "step, 0.7", function( assert ) {
	assert.expect( 1 );
	var element = $( "#spin" ).val( 0 ).spinner( {
		step: 0.7
	} );

	element.spinner( "stepUp" );
	assert.equal( element.val(), "0.7", "stepUp" );
} );

QUnit.test( "step, string", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).val( 0 ).spinner( {
		step: "$0.70",
		numberFormat: "C",
		culture: "en"
	} );

	assert.equal( element.spinner( "option", "step" ), 0.7, "option converted to number" );

	element.spinner( "stepUp" );
	assert.equal( element.val(), "$0.70", "stepUp" );
} );

} );
