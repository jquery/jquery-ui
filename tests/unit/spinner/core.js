define( [
	"qunit",
	"jquery",
	"lib/helper",
	"./helper",
	"ui/widgets/spinner"
], function( QUnit, $, helper, testHelper ) {
"use strict";

var simulateKeyDownUp = testHelper.simulateKeyDownUp;

QUnit.module( "spinner: core", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "markup structure", function( assert ) {
	assert.expect( 6 );
	var element = $( "#spin" ).spinner(),
		spinner = element.spinner( "widget" ),
		up = spinner.find( ".ui-spinner-up" ),
		down = spinner.find( ".ui-spinner-down" );

	assert.hasClasses( element, "ui-spinner-input" );
	assert.hasClasses( spinner, "ui-spinner ui-widget ui-widget-content" );
	assert.hasClasses( up, "ui-spinner-button ui-spinner-up ui-widget" );
	assert.equal( up.length, 1, "Spinner contains exactly one up button" );
	assert.hasClasses( down, "ui-spinner-button ui-spinner-down ui-widget" );
	assert.equal( down.length, 1, "Spinner contains exactly one down button" );
} );

QUnit.test( "keydown UP on input, increases value not greater than max", function( assert ) {
	assert.expect( 5 );
	var element = $( "#spin" ).val( 70 ).spinner( {
		max: 100,
		step: 10
	} );

	simulateKeyDownUp( element, $.ui.keyCode.UP );
	assert.equal( element.val(), 80 );
	simulateKeyDownUp( element, $.ui.keyCode.UP );
	assert.equal( element.val(), 90 );
	simulateKeyDownUp( element, $.ui.keyCode.UP );
	assert.equal( element.val(), 100 );
	simulateKeyDownUp( element, $.ui.keyCode.UP );
	assert.equal( element.val(), 100 );
	simulateKeyDownUp( element, $.ui.keyCode.UP );
	assert.equal( element.val(), 100 );
} );

QUnit.test( "keydown DOWN on input, decreases value not less than min", function( assert ) {
	assert.expect( 5 );
	var element = $( "#spin" ).val( 50 ).spinner( {
		min: 20,
		step: 10
	} );

	simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	assert.equal( element.val(), 40 );
	simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	assert.equal( element.val(), 30 );
	simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	assert.equal( element.val(), 20 );
	simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	assert.equal( element.val(), 20 );
	simulateKeyDownUp( element, $.ui.keyCode.DOWN );
	assert.equal( element.val(), 20 );
} );

QUnit.test( "keydown PAGE_UP on input, increases value not greater than max", function( assert ) {
	assert.expect( 5 );
	var element = $( "#spin" ).val( 70 ).spinner( {
		max: 100,
		page: 10
	} );

	simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	assert.equal( element.val(), 80 );
	simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	assert.equal( element.val(), 90 );
	simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	assert.equal( element.val(), 100 );
	simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	assert.equal( element.val(), 100 );
	simulateKeyDownUp( element, $.ui.keyCode.PAGE_UP );
	assert.equal( element.val(), 100 );
} );

QUnit.test( "keydown PAGE_DOWN on input, decreases value not less than min", function( assert ) {
	assert.expect( 5 );
	var element = $( "#spin" ).val( 50 ).spinner( {
		min: 20,
		page: 10
	} );

	simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	assert.equal( element.val(), 40 );
	simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	assert.equal( element.val(), 30 );
	simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	assert.equal( element.val(), 20 );
	simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	assert.equal( element.val(), 20 );
	simulateKeyDownUp( element, $.ui.keyCode.PAGE_DOWN );
	assert.equal( element.val(), 20 );
} );

QUnit.test( "blur input while spinning with UP", function( assert ) {
	var ready = assert.async();
	assert.expect( 3 );
	var value,
		element = $( "#spin" ).val( 10 ).spinner();

	function step1() {
		element.simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
		assert.equal( element.val(), 11 );
		setTimeout( step2, 750 );
	}

	function step2() {
		value = element.val();
		assert.ok( value > 11, "repeating while key is down" );

		element.on( "blur", function() {
			value = element.val();
			setTimeout( step3, 750 );
		} )[ 0 ].blur();
	}

	function step3() {
		assert.equal( element.val(), value, "stopped repeating on blur" );
		ready();
	}

	element[ 0 ].focus();
	setTimeout( step1 );
} );

QUnit.test( "mouse click on up button, increases value not greater than max", function( assert ) {
	assert.expect( 3 );
	var element = $( "#spin" ).val( 18 ).spinner( {
			max: 20
		} ),
		button = element.spinner( "widget" ).find( ".ui-spinner-up" );

	button.trigger( "mousedown" ).trigger( "mouseup" );
	assert.equal( element.val(), 19 );
	button.trigger( "mousedown" ).trigger( "mouseup" );
	assert.equal( element.val(), 20 );
	button.trigger( "mousedown" ).trigger( "mouseup" );
	assert.equal( element.val(), 20 );
} );

QUnit.test( "mouse click on up button, increases value not greater than max", function( assert ) {
	assert.expect( 3 );
	var element = $( "#spin" ).val( 2 ).spinner( {
		min: 0
	} ),
	button = element.spinner( "widget" ).find( ".ui-spinner-down" );

	button.trigger( "mousedown" ).trigger( "mouseup" );
	assert.equal( element.val(), 1 );
	button.trigger( "mousedown" ).trigger( "mouseup" );
	assert.equal( element.val(), 0 );
	button.trigger( "mousedown" ).trigger( "mouseup" );
	assert.equal( element.val(), 0 );
} );

QUnit.test( "wheel on input", function( assert ) {
	var ready = assert.async();
	assert.expect( 5 );

	var element = $( "#spin" ).val( 0 ).spinner( {
		step: 2
	} );

	element.simulate( "focus" );
	setTimeout( step1 );

	function getWheelEvent( deltaY ) {
		return jQuery.Event( new WheelEvent( "wheel", { deltaY: deltaY } ) );
	}

	function step1() {
		element.trigger( getWheelEvent() );
		assert.equal( element.val(), 0, "wheel event without delta does not change value" );

		element.trigger( getWheelEvent( -1 ) );
		assert.equal( element.val(), 2, "delta -1" );

		element.trigger( getWheelEvent( 0.2 ) );
		assert.equal( element.val(), 0, "delta 0.2" );

		element.trigger( getWheelEvent( 15 ) );
		assert.equal( element.val(), -2, "delta 15" );

		element.simulate( "blur" );
		setTimeout( step2 );
	}

	function step2() {
		element.trigger( "wheel", -1 );
		assert.equal( element.val(), -2, "wheel when not focused" );

		ready();
	}
} );

QUnit.test( "mousewheel on input (DEPRECATED)", function( assert ) {
	var ready = assert.async();
	assert.expect( 5 );

	var element = $( "#spin" ).val( 0 ).spinner( {
		step: 2
	} );

	element.simulate( "focus" );
	setTimeout( step1 );

	function step1() {
		element.trigger( "mousewheel" );
		assert.equal( element.val(), 0, "mousewheel event without delta does not change value" );

		element.trigger( "mousewheel", 1 );
		assert.equal( element.val(), 2, "delta 1" );

		element.trigger( "mousewheel", -0.2 );
		assert.equal( element.val(), 0, "delta -0.2" );

		element.trigger( "mousewheel", -15 );
		assert.equal( element.val(), -2, "delta -15" );

		element.simulate( "blur" );
		setTimeout( step2 );
	}

	function step2() {
		element.trigger( "mousewheel", 1 );
		assert.equal( element.val(), -2, "mousewheel when not focused" );

		ready();
	}
} );

QUnit.test( "wheel & mousewheel conflicts", function( assert ) {
	var ready = assert.async();
	assert.expect( 5 );

	var iframe = $( "<iframe />" ).appendTo( "#qunit-fixture" ),
		iframeDoc = ( iframe[ 0 ].contentWindow || iframe[ 0 ].contentDocument ).document;

	window.iframeCallback = function( values ) {
		window.iframeCallback = undefined;

		assert.equal( values[ 0 ], 0, "wheel event without delta does not change value" );
		assert.equal( values[ 1 ], 2, "delta -1" );
		assert.equal( values[ 2 ], 0, "delta 0.2" );
		assert.equal( values[ 3 ], -2, "delta 15" );
		assert.equal( values[ 4 ], -2, "wheel when not focused" );

		ready();
	};

	function runTest() {
		var values = [],
			element = $( "#spin" ).val( 0 ).spinner( {
				step: 2
			} );

		element.focus();
		setTimeout( step1 );

		function dispatchWheelEvent( elem, deltaY ) {
			elem[ 0 ].dispatchEvent( new WheelEvent( "wheel", {
				deltaY: deltaY
			} ) );
		}

		function step1() {
			dispatchWheelEvent( element );
			values.push( element.val() );

			dispatchWheelEvent( element, -1 );
			values.push( element.val() );

			dispatchWheelEvent( element, 0.2 );
			values.push( element.val() );

			dispatchWheelEvent( element, 15 );
			values.push( element.val() );

			element.blur();
			setTimeout( step2 );
		}

		function step2() {
			dispatchWheelEvent( element, -1 );
			values.push( element.val() );

			window.parent.iframeCallback( values );
		}
	}

	iframeDoc.write( "" +
		"<!doctype html>\n" +
		"<html lang='en'>\n" +
		"<head>\n" +
		"	<meta charset='utf-8'>\n" +
		"	<title>jQuery UI Spinner Test Suite</title>\n" +
		"\n" +
		"	<script src='../../../external/requirejs/require.js'></script>\n" +
		"	<script src='../../../external/jquery/jquery.js'></script>\n" +
		"	<script src='../../lib/css.js' data-modules='core button spinner'></script>\n" +
		"</head>\n" +
		"<body>\n" +
		"\n" +
		"<div id='qunit'></div>\n" +
		"<div id='qunit-fixture'>\n" +
		"\n" +
		"<input id='spin' class='foo'>\n" +
		"<input id='spin2' value='2'>\n" +
		"\n" +
		"</div>\n" +
		"<script>\n" +
		"	" + runTest + "\n" +
		"	requirejs.config( {\n" +
		"	paths: {\n" +
		"		'jquery-mousewheel': '../../../external/jquery-mousewheel/jquery.mousewheel',\n" +
		"		'ui': '../../../ui'\n" +
		"	},\n" +
		"} );\n" +
		"	require( [\n" +
		"		'jquery-mousewheel',\n" +
		"		'ui/widgets/spinner'\n" +
		"	], function() {\n" +
		"		runTest();\n" +
		"	} );\n" +
		"</script>\n" +
		"</body>\n" +
		"</html>\n" +
		"" );
	iframeDoc.close();
} );

QUnit.test( "reading HTML5 attributes", function( assert ) {
	assert.expect( 6 );
	var markup = "<input type='number' min='-100' max='100' value='5' step='2'>",
		element = $( markup ).spinner();
	assert.equal( element.spinner( "option", "min" ), -100, "min from markup" );
	assert.equal( element.spinner( "option", "max" ), 100, "max from markup" );
	assert.equal( element.spinner( "option", "step" ), 2, "step from markup" );

	element = $( markup ).spinner( {
		min: -200,
		max: 200,
		step: 5
	} );
	assert.equal( element.spinner( "option", "min" ), -200, "min from options" );
	assert.equal( element.spinner( "option", "max" ), 200, "max from options" );
	assert.equal( element.spinner( "option", "step" ), 5, "stop from options" );
} );

QUnit.test( "ARIA attributes", function( assert ) {
	assert.expect( 9 );
	var element = $( "#spin" ).val( 2 ).spinner( { min: -5, max: 5 } );

	assert.equal( element.attr( "role" ), "spinbutton", "role" );
	assert.equal( element.attr( "aria-valuemin" ), "-5", "aria-valuemin" );
	assert.equal( element.attr( "aria-valuemax" ), "5", "aria-valuemax" );
	assert.equal( element.attr( "aria-valuenow" ), "2", "aria-valuenow" );

	element.spinner( "stepUp" );

	assert.equal( element.attr( "aria-valuenow" ), "3", "stepUp 1 step changes aria-valuenow" );

	element.spinner( "option", { min: -10, max: 10 } );

	assert.equal( element.attr( "aria-valuemin" ), "-10", "min option changed aria-valuemin changes" );
	assert.equal( element.attr( "aria-valuemax" ), "10", "max option changed aria-valuemax changes" );

	element.spinner( "option", "min", null );
	assert.equal( element.attr( "aria-valuemin" ), undefined, "aria-valuemin not set when no min" );

	element.spinner( "option", "max", null );
	assert.equal( element.attr( "aria-valuemax" ), undefined, "aria-valuemax not set when no max" );
} );

QUnit.test( "focus text field when pressing button", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).spinner();
	$( "body" ).trigger( "focus" );
	assert.ok( element[ 0 ] !== document.activeElement, "not focused before" );
	element.spinner( "widget" ).find( ".ui-spinner-up" ).trigger( "mousedown" );
	assert.ok( element[ 0 ] === document.activeElement, "focused after" );
} );

QUnit.test( "don't clear invalid value on blur", function( assert ) {
	assert.expect( 1 );
	var element = $( "#spin" ).spinner();
	element.trigger( "focus" ).val( "a" ).trigger( "blur" );
	assert.equal( element.val(), "a" );
} );

QUnit.test( "precision", function( assert ) {
	assert.expect( 2 );
	var element = $( "#spin" ).val( 0.05 ).spinner( {
		step: 0.0001
	} );
	element.spinner( "stepUp" );
	assert.equal( element.val(), "0.0501", "precision from step" );

	element.val( 1.05 ).spinner( "option", {
		step: 1,
		min: -9.95
	} );
	element.spinner( "stepDown" );
	assert.equal( element.val(), "0.05", "precision from min" );
} );

} );
