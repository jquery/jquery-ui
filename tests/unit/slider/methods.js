define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/slider"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "slider: methods", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "init", function( assert ) {
	assert.expect( 5 );

	$( "<div></div>" ).appendTo( "body" ).slider().remove();
	assert.ok( true, ".slider() called on element" );

	$( [] ).slider().remove();
	assert.ok( true, ".slider() called on empty collection" );

	$( "<div></div>" ).slider().remove();
	assert.ok( true, ".slider() called on disconnected DOMElement" );

	var element = $( "<div></div>" ).slider();
	element.slider( "option", "foo" );
	element.remove();
	assert.ok( true, "arbitrary option getter after init" );

	$( "<div></div>" ).slider().slider( "option", "foo", "bar" ).remove();
	assert.ok( true, "arbitrary option setter after init" );
} );

QUnit.test( "destroy", function( assert ) {
	assert.expect( 1 );
	assert.domEqual( "#slider1", function() {
		$( "#slider1" ).slider().slider( "destroy" );
	} );
} );

QUnit.test( "enable", function( assert ) {
	assert.expect( 3 );
	var element,
		expected = $( "<div></div>" ).slider(),
		actual = expected.slider( "enable" );
	assert.equal( actual, expected, "enable is chainable" );

	element = $( "<div></div>" ).slider( { disabled: true } );
	assert.hasClasses( element, "ui-state-disabled ui-slider-disabled" );
	element.slider( "enable" );
	assert.lacksClasses( element, "ui-state-disabled ui-slider-disabled" );
} );

QUnit.test( "disable", function( assert ) {
	assert.expect( 4 );
	var element,
		expected = $( "<div></div>" ).slider(),
		actual = expected.slider( "disable" );
	assert.equal( actual, expected, "disable is chainable" );

	element = $( "<div></div>" ).slider( { disabled: false } );
	assert.lacksClasses( element, "ui-state-disabled ui-slider-disabled" );
	element.slider( "disable" );
	assert.hasClasses( element, "ui-state-disabled ui-slider-disabled" );
	assert.ok( !element.attr( "aria-disabled" ), "slider does not have aria-disabled attr after disable method call" );
} );

QUnit.test( "value", function( assert ) {
	assert.expect( 19 );
	$( [ false, "min", "max" ] ).each( function() {
		var element = $( "<div></div>" ).slider( {
			range: this,
			value: 5
		} );
		assert.equal( element.slider( "value" ), 5, "range: " + this + " slider method get" );
		assert.equal( element.slider( "value", 10 ), element, "value method is chainable" );
		assert.equal( element.slider( "value" ), 10, "range: " + this + " slider method set" );
		element.remove();
	} );
	var element = $( "<div></div>" ).slider( {
		min: -1, value: 0, max: 1
	} );

	// Min with value option vs value method
	element.slider( "option", "value", -2 );
	assert.equal( element.slider( "option", "value" ), -2, "value option does not respect min" );
	assert.equal( element.slider( "value" ), -1, "value method get respects min" );
	assert.equal( element.slider( "value", -2 ), element, "value method is chainable" );
	assert.equal( element.slider( "option", "value" ), -1, "value method set respects min" );

	// Max with value option vs value method
	element.slider( "option", "value", 2 );
	assert.equal( element.slider( "option", "value" ), 2, "value option does not respect max" );
	assert.equal( element.slider( "value" ), 1, "value method get respects max" );
	assert.equal( element.slider( "value", 2 ), element, "value method is chainable" );
	assert.equal( element.slider( "option", "value" ), 1, "value method set respects max" );

	// Set max value with step 0.01
	element.slider( "option", {
		min: 2,
		value: 2,
		max: 2.4,
		step: 0.01
	} );
	element.slider( "option", "value", 2.4 );
	assert.equal( element.slider( "value" ), 2.4, "value is set to max with 0.01 step" );

	element = $( "<div></div>" ).slider( {
		value: 100,
		min: 10,
		max: 500,
		step: 50
	} );

	element.slider( "option", "value", 510 );
	assert.equal( element.slider( "value" ), 460, "value is restricted to maximum valid step" );
} );

QUnit.test( "values, single step", function( assert ) {
	assert.expect( 8 );

	var element = $( "<div></div>" ).slider( {
		range: false,
		min: 10,
		max: 100,
		step: 1,
		values: [ 20 ]
	} );

	assert.deepEqual( element.slider( "values" ), [ 20 ], "range: false, values - get value for handle" );
	assert.equal( element.slider( "values", 0 ), 20, "values (index) - get value of handle" );

	element.slider( "values", 0, 5 );
	assert.equal( element.slider( "values", 0 ), 10, "values (index) - restrict against min" );

	element.slider( "values", 0, 110 );
	assert.equal( element.slider( "values", 0 ), 100, "values (index) - restrict against max" );

	element.slider( "option", "range", true );
	element.slider( "values", [ 20, 90 ] );

	assert.deepEqual( element.slider( "values" ), [ 20, 90 ], "range: true, values - get value for all handles" );
	assert.equal( element.slider( "values", 0 ), 20, "values (index) - 1st handle" );
	assert.equal( element.slider( "values", 1 ), 90, "values (index) - 2nd handle" );

	element.slider( "values", [ 5, 110 ] );
	assert.deepEqual( element.slider( "values" ), [ 10, 100 ], "values - restricted against min and max" );
	element.slider( "destroy" );
} );

QUnit.test( "values, multi step", function( assert ) {
	assert.expect( 2 );

	var element = $( "<div></div>" ).slider( {
		range: false,
		min: 9,
		max: 20,
		step: 3,
		values: [ 9, 12 ]
	} );
	assert.deepEqual( element.slider( "values" ), [ 9, 12 ], "values - evenly divisible by step" );

	element.slider( "values", [ 10, 20 ] );
	assert.deepEqual( element.slider( "values" ), [ 9, 18 ], "values - not evenly divisible by step" );

	element.slider( "destroy" );
} );

} );
