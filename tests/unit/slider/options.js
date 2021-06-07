define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/slider"
], function( QUnit, $, helper ) {
"use strict";

var element, options;

function handle() {
	return element.find( ".ui-slider-handle" );
}

QUnit.module( "slider: options", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "disabled", function( assert ) {
	assert.expect( 8 );
	var count = 0;

	element = $( "#slider1" ).slider();
	element.on( "slidestart", function() {
		count++;
	} );

	// Enabled
	assert.lacksClasses( element, "ui-slider-disabled" );
	assert.equal( element.slider( "option", "disabled" ), false, "is not disabled" );

	handle().simulate( "drag", { dx: 10 } );
	assert.equal( count, 1, "slider moved" );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	assert.equal( count, 2, "slider moved" );

	// Disabled
	element.slider( "option", "disabled", true );
	assert.hasClasses( element, "ui-slider-disabled" );
	assert.equal( element.slider( "option", "disabled" ), true, "is disabled" );

	handle().simulate( "drag", { dx: 10 } );
	assert.equal( count, 2, "slider did not move" );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	assert.equal( count, 2, "slider did not move" );
} );

QUnit.test( "max", function( assert ) {
	assert.expect( 7 );
	element = $( "<div></div>" );

	options = {
		max: 37,
		min: 6,
		orientation: "horizontal",
		step: 1,
		value: 50
	};

	element.slider( options );
	assert.ok( element.slider( "option", "value" ) === options.value, "value option is not contained by max" );
	assert.ok( element.slider( "value" ) === options.max, "value method is contained by max" );

	options = {
		max: 9,
		min: 1,
		orientation: "horizontal",
		step: 3,
		value: 8.75
	};

	element.slider( options );
	assert.ok( element.slider( "value" ) === 7, "value method is within max, edge Case" );

	options.step = 2;

	element.slider( options );
	assert.ok( element.slider( "value" ) === options.max, "value method will max, step is changed" );
	element.slider( "destroy" );

	options = {
		max: 60,
		min: 50,
		orientation: "horizontal",
		step: 0.1,
		value: 60
	};

	element.slider( options );
	assert.ok( element.slider( "value" ) === options.max, "value method will max, step is changed and step is float" );
	element.slider( "destroy" );

	options = {
		max: 10.75,
		min: 1.22,
		orientation: "horizontal",
		step: 0.01,
		value: 10.75
	};

	element.slider( options );
	assert.ok( element.slider( "value" ) === options.max, "value method will max, step is changed, step is float and max is float" );
	element.slider( "destroy" );

	options.max = 10.749999999;

	element.slider( options );
	assert.ok( element.slider( "value" ) === 10.74, "value method will max, step is changed, step is float, max is float and not divisible" );
	element.slider( "destroy" );
} );

QUnit.test( "min", function( assert ) {
	assert.expect( 2 );
	element = $( "<div></div>" );

	options = {
		max: 37,
		min: 6,
		orientation: "vertical",
		step: 1,
		value: 2
	};

	element.slider( options );
	assert.ok( element.slider( "option", "value" ) === options.value, "value option is not contained by min" );
	assert.ok( element.slider( "value" ) === options.min, "value method is contained by min" );
	element.slider( "destroy" );

} );

QUnit.test( "orientation", function( assert ) {
	assert.expect( 14 );
	element = $( "#slider1" );

	options = {
		max: 2,
		min: -2,
		orientation: "vertical",
		value: 1
	};

	var newValue, rangeSize,
		percentVal = ( options.value - options.min ) / ( options.max - options.min ) * 100;

	element.slider( options ).slider( "option", "orientation", "horizontal" );
	assert.hasClasses( element, "ui-slider-horizontal" );
	assert.lacksClasses( element, "ui-slider-vertical" );
	assert.equal( element.find( ".ui-slider-handle" )[ 0 ].style.bottom, "", "CSS bottom reset" );
	assert.equal( handle()[ 0 ].style.left, percentVal + "%", "horizontal slider handle is positioned with left: %" );

	element.slider( "destroy" );

	options = {
		max: 2,
		min: -2,
		orientation: "horizontal",
		value: -1
	};

	percentVal = ( options.value - options.min ) / ( options.max - options.min ) * 100;

	element.slider( options ).slider( "option", "orientation", "vertical" );
	assert.hasClasses( element, "ui-slider-vertical" );
	assert.lacksClasses( element, "ui-slider-horizontal" );
	assert.equal( element.find( ".ui-slider-handle" )[ 0 ].style.left, "", "CSS left reset" );
	assert.equal( handle()[ 0 ].style.bottom, percentVal + "%", "vertical slider handle is positioned with bottom: %" );

	element.slider( "destroy" );

	newValue = 7;
	rangeSize = 500 - ( 500 * newValue / 10 );
	element = $( "#slider2" ).slider( {
		range: "max",
		min: 0,
		max: 10
	} );

	element.slider( "option", "value", newValue );
	element.slider( "option", "orientation", "vertical" );
	assert.equal( element.find( ".ui-slider-range" ).width(), 12,
		"range should occupy all horizontal space after changing orientation to vertical" );
	assert.equal( element.find( ".ui-slider-range" ).height(), rangeSize,
		"range height of vertical slider should be proportional to the value" );

	element.slider( "option", "orientation", "horizontal" );
	assert.equal( element.find( ".ui-slider-range " ).height(), 12,
		"range should occupy all vertical space after changing orientation to horizontal" );
	assert.equal( element.find( ".ui-slider-range" ).width(), rangeSize,
		"range width of horizontal slider should be proportional to the value" );

	element.slider( "destroy" );

	element = $( "#slider2" ).slider( {
		range: true,
		min: 0,
		max: 100
	} );
	element.slider( "option", { values: [ 60, 70 ] } );
	assert.notEqual( element.find( ".ui-slider-range " ).position().left, 0,
		"range should not pull over to the track's border" );
	element.slider( "option", "orientation", "vertical" );
	assert.equal( element.find( ".ui-slider-range " ).position().left, 0,
		"range should pull over to the track's border" );

	element.slider( "destroy" );
} );

//spec: http://wiki.jqueryui.com/Slider#specs
// value option/method: the value option is not restricted by min/max/step.
// What is returned by the value method is restricted by min (>=), max (<=), and step (even multiple)
QUnit.test( "step", function( assert ) {
	assert.expect( 9 );
	element = $( "<div></div>" ).slider( {
		min: 0,
		value: 0,
		step: 10,
		max: 100
	} );
	assert.equal( element.slider( "value" ), 0 );

	element.slider( "value", 1 );
	assert.equal( element.slider( "value" ), 0 );

	element.slider( "value", 9 );
	assert.equal( element.slider( "value" ), 10 );

	element.slider( "value", 11 );
	assert.equal( element.slider( "value" ), 10 );

	element.slider( "value", 19 );
	assert.equal( element.slider( "value" ), 20 );

	element = $( "<div></div>" ).slider( {
		min: 0,
		value: 0,
		step: 20,
		max: 100
	} );
	element.slider( "value", 0 );

	element.slider( "option", "value", 1 );
	assert.equal( element.slider( "value" ), 0 );

	element.slider( "option", "value", 9 );
	assert.equal( element.slider( "value" ), 0 );

	element.slider( "option", "value", 11 );
	assert.equal( element.slider( "value" ), 20 );

	element.slider( "option", "value", 19 );
	assert.equal( element.slider( "value" ), 20 );

	element.slider( "destroy" );
} );

//Test( "value", function() {
//	ok(false, "missing test - untested code is broken code." );
//});

QUnit.test( "values", function( assert ) {
	assert.expect( 2 );

	// Testing multiple ranges on the same page, the object reference to the values
	// property is preserved via multiple range elements, so updating options.values
	// of 1 slider updates options.values of all the others
	var ranges = $( [
		document.createElement( "div" ),
		document.createElement( "div" )
	] ).slider( {
		range: true,
		values: [ 25, 75 ]
	} );

	assert.notStrictEqual(
		ranges.eq( 0 ).slider( "instance" ).options.values,
		ranges.eq( 1 ).slider( "instance" ).options.values,
		"multiple range sliders should not have a reference to the same options.values array"
	);

	ranges.eq( 0 ).slider( "values", 0, 10 );

	assert.notEqual(
		ranges.eq( 0 ).slider( "values", 0 ),
		ranges.eq( 1 ).slider( "values", 0 ),
		"the values for multiple sliders should be different"
	);
} );

QUnit.test( "range", function( assert ) {
	assert.expect( 32 );
	var range;

	// Min
	element = $( "<div></div>" ).slider( {
		range: "min",
		min: 1,
		max: 10,
		step: 1
	} );

	assert.equal( element.find( ".ui-slider-handle" ).length, 1, "range min, one handle" );
	assert.equal( element.find( ".ui-slider-range-min" ).length, 1, "range min" );
	element.slider( "destroy" );

	// Max
	element = $( "<div></div>" ).slider( {
		range: "max",
		min: 1,
		max: 10,
		step: 1
	} );

	assert.equal( element.find( ".ui-slider-handle" ).length, 1, "range max, one handle" );
	assert.equal( element.find( ".ui-slider-range-max" ).length, 1, "range max" );
	element.slider( "destroy" );

	// True
	element = $( "<div></div>" ).slider( {
		range: true,
		min: 1,
		max: 10,
		step: 1
	} );

	range = element.find( ".ui-slider-range" );
	assert.equal( element.find( ".ui-slider-handle" ).length, 2, "range true, two handles" );
	assert.lacksClasses( range, "ui-slider-range-max ui-slider-range-min" );
	element.slider( "destroy" );

	// Change range from min to max
	element = $( "<div></div>" ).slider( {
		range: "min",
		min: 1,
		max: 10,
		step: 1
	} ).slider( "option", "range", "max" );

	assert.equal( element.find( ".ui-slider-handle" ).length, 1, "range switch from min to max, one handle" );
	assert.equal( element.find( ".ui-slider-range-min" ).length, 0, "range switch from min to max" );
	assert.equal( element.find( ".ui-slider-range-max" ).length, 1, "range switch from min to max" );
	element.slider( "destroy" );

	// Change range from max to min
	element = $( "<div></div>" ).slider( {
		range: "max",
		min: 1,
		max: 10,
		step: 1
	} ).slider( "option", "range", "min" );

	assert.equal( element.find( ".ui-slider-handle" ).length, 1, "range switch from max to min, one handle" );
	assert.equal( element.find( ".ui-slider-range-max" ).length, 0, "range switch from max to min" );
	assert.equal( element.find( ".ui-slider-range-min" ).length, 1, "range switch from max to min" );
	element.slider( "destroy" );

	// Change range from max to true
	element = $( "<div></div>" ).slider( {
		range: "max",
		min: 1,
		max: 10,
		step: 1
	} ).slider( "option", "range", true );

	assert.equal( element.find( ".ui-slider-handle" ).length, 2, "range switch from max to true, two handles" );
	assert.equal( element.find( ".ui-slider-range-max" ).length, 0, "range switch from max to true" );
	assert.equal( element.find( ".ui-slider-range-min" ).length, 0, "range switch from max to true" );
	assert.equal( element.slider( "option", "value" ), 0, "option value" );
	assert.equal( element.slider( "value" ), 1, "value" );
	assert.deepEqual( element.slider( "option", "values" ), [ 1, 1 ], "option values" );
	assert.deepEqual( element.slider( "values" ), [ 1, 1 ], "values" );
	element.slider( "destroy" );

	// Change range from true to min
	element = $( "<div></div>" ).slider( {
		range: true,
		min: 1,
		max: 10,
		step: 1
	} ).slider( "option", "range", "min" );

	assert.equal( element.find( ".ui-slider-handle" ).length, 1, "range switch from true to min, one handle" );
	assert.equal( element.find( ".ui-slider-range-max" ).length, 0, "range switch from true to min" );
	assert.equal( element.find( ".ui-slider-range-min" ).length, 1, "range switch from true to min" );
	assert.equal( element.slider( "option", "value" ), 1, "value" );
	assert.equal( element.slider( "value" ), 1, "value" );
	assert.equal( element.slider( "option", "values" ), null, "values" );
	assert.deepEqual( element.slider( "values" ), [], "values" );
	element.slider( "destroy" );

	// Change range from true to false
	element = $( "<div></div>" ).slider( {
		range: true,
		min: 1,
		max: 10,
		step: 1
	} ).slider( "option", "range", false );
	assert.equal( element.find( ".ui-slider-handle" ).length, 2, "range switch from true to false, both handles remain" );
	assert.equal( element.find( ".ui-slider-range" ).length, 0, "range switch from true to false" );
	assert.equal( element.slider( "option", "value" ), 0, "option value" );
	assert.equal( element.slider( "value" ), 1, "value" );
	assert.deepEqual( element.slider( "option", "values" ), [ 1, 1 ], "option values" );
	assert.deepEqual( element.slider( "values" ), [ 1, 1 ], "values" );
	element.slider( "destroy" );
} );

} );
