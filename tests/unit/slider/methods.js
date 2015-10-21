define( [
	"jquery",
	"ui/widgets/slider"
], function( $ ) {

module( "slider: methods" );

test( "init", function() {
	expect( 5 );

	$( "<div></div>" ).appendTo( "body" ).slider().remove();
	ok( true, ".slider() called on element" );

	$( [] ).slider().remove();
	ok( true, ".slider() called on empty collection" );

	$( "<div></div>" ).slider().remove();
	ok( true, ".slider() called on disconnected DOMElement" );

	var element = $( "<div></div>" ).slider();
	element.slider( "option", "foo" );
	element.remove();
	ok( true, "arbitrary option getter after init" );

	$( "<div></div>" ).slider().slider( "option", "foo", "bar" ).remove();
	ok( true, "arbitrary option setter after init" );
} );

test( "destroy", function( assert ) {
	expect( 1 );
	assert.domEqual( "#slider1", function() {
		$( "#slider1" ).slider().slider( "destroy" );
	} );
} );

test( "enable", function( assert ) {
	expect( 3 );
	var element,
		expected = $( "<div></div>" ).slider(),
		actual = expected.slider( "enable" );
	equal( actual, expected, "enable is chainable" );

	element = $( "<div></div>" ).slider( { disabled: true } );
	assert.hasClasses( element, "ui-state-disabled ui-slider-disabled" );
	element.slider( "enable" );
	assert.lacksClasses( element, "ui-state-disabled ui-slider-disabled" );
} );

test( "disable", function( assert ) {
	expect( 4 );
	var element,
		expected = $( "<div></div>" ).slider(),
		actual = expected.slider( "disable" );
	equal( actual, expected, "disable is chainable" );

	element = $( "<div></div>" ).slider( { disabled: false } );
	assert.lacksClasses( element, "ui-state-disabled ui-slider-disabled" );
	element.slider( "disable" );
	assert.hasClasses( element, "ui-state-disabled ui-slider-disabled" );
	ok( !element.attr( "aria-disabled" ), "slider does not have aria-disabled attr after disable method call" );
} );

test( "value", function() {
	expect( 19 );
	$( [ false, "min", "max" ] ).each( function() {
		var element = $( "<div></div>" ).slider( {
			range: this,
			value: 5
		} );
		equal( element.slider( "value" ), 5, "range: " + this + " slider method get" );
		equal( element.slider( "value", 10 ), element, "value method is chainable" );
		equal( element.slider( "value" ), 10, "range: " + this + " slider method set" );
		element.remove();
	} );
	var element = $( "<div></div>" ).slider( {
		min: -1, value: 0, max: 1
	} );

	// min with value option vs value method
	element.slider( "option", "value", -2 );
	equal( element.slider( "option", "value" ), -2, "value option does not respect min" );
	equal( element.slider( "value" ), -1, "value method get respects min" );
	equal( element.slider( "value", -2 ), element, "value method is chainable" );
	equal( element.slider( "option", "value" ), -1, "value method set respects min" );

	// max with value option vs value method
	element.slider( "option", "value", 2 );
	equal( element.slider( "option", "value" ), 2, "value option does not respect max" );
	equal( element.slider( "value" ), 1, "value method get respects max" );
	equal( element.slider( "value", 2 ), element, "value method is chainable" );
	equal( element.slider( "option", "value" ), 1, "value method set respects max" );

	// Set max value with step 0.01
	element.slider( "option", {
		min: 2,
		value: 2,
		max: 2.4,
		step: 0.01
	} );
	element.slider( "option", "value", 2.4 );
	equal( element.slider( "value" ), 2.4, "value is set to max with 0.01 step" );

	element = $( "<div></div>" ).slider( {
		value: 100,
		min: 10,
		max: 500,
		step: 50
	} );

	element.slider( "option", "value", 510 );
	equal( element.slider( "value" ), 460, "value is restricted to maximum valid step" );
} );

test( "values, single step", function() {
	expect( 8 );

	var element = $( "<div></div>" ).slider( {
		range: false,
		min: 10,
		max: 100,
		step: 1,
		values: [ 20 ]
	} );

	deepEqual( element.slider( "values" ), [ 20 ], "range: false, values - get value for handle" );
	equal( element.slider( "values", 0 ), 20, "values (index) - get value of handle" );

	element.slider( "values", 0, 5 );
	equal( element.slider( "values", 0 ), 10, "values (index) - restrict against min" );

	element.slider( "values", 0, 110 );
	equal( element.slider( "values", 0 ), 100, "values (index) - restrict against max" );

	element.slider( "option", "range", true );
	element.slider( "values", [ 20, 90 ] );

	deepEqual( element.slider( "values" ), [ 20, 90 ], "range: true, values - get value for all handles" );
	equal( element.slider( "values", 0 ), 20, "values (index) - 1st handle" );
	equal( element.slider( "values", 1 ), 90, "values (index) - 2nd handle" );

	element.slider( "values", [ 5, 110 ] );
	deepEqual( element.slider( "values" ), [ 10, 100 ], "values - restricted against min and max" );
	element.slider( "destroy" );
} );

test( "values, multi step", function() {
	expect( 2 );

	var element = $( "<div></div>" ).slider( {
		range: false,
		min: 9,
		max: 20,
		step: 3,
		values: [ 9, 12 ]
	} );
	deepEqual( element.slider( "values" ), [ 9, 12 ], "values - evenly divisible by step" );

	element.slider( "values", [ 10, 20 ] );
	deepEqual( element.slider( "values" ), [ 9, 18 ], "values - not evenly divisible by step" );

	element.slider( "destroy" );
} );

test( "values", function() {
	expect( 12 );

	var element = $( "<div></div>" ).slider( {
		range: true,
		min: 10,
		max: 100,
		step: 1
	} );

	element.slider( "values", [ 20, 90 ] );
	deepEqual( element.slider( "values" ), [ 20, 90 ], "Values (array) - get value for all handles" );

	element.slider( "values", [ 0, 200 ] );
	deepEqual( element.slider( "values" ), [ 10, 100 ], "Values (array) - restricted min and max" );

	element.slider( "values", 0, 50 );
	equal( element.slider( "values", 0 ), 50, "Values (index,value) - set first handle" );

	element.slider( "values", 1, 75 );
	equal( element.slider( "values", 1 ), 75, "Values (index,value) - set second handle" );

	element.slider( "values", 0, 5 );
	equal( element.slider( "values", 0 ), 10, "Values (index,value) - 1st handle restricted properly, against min" );

	element.slider( "values", 0, 90 );
	equal( element.slider( "values", 0 ), element.slider( "values", 1 ), "Values (index,value) - 1st handle restricted properly, against 2nd handle" );

	element.slider( "values", 1, 110 );
	equal( element.slider( "values", 1 ), 100, "Values (index,value) - 2nd handle restricted properly, against max" );

	element.slider( "values", 1, 40 );
	equal( element.slider( "values", 1 ), element.slider( "values", 0 ), "Values (index,value) - 2nd handle restricted properly, against 1st handle" );

	element.slider( "values", [ 50, 75 ] );

	element.slider( "values", [ 0, 75 ] );
	deepEqual( element.slider( "values" ), [ 10, 75 ], "Values (array) - Setting both handles - against  min" );

	element.slider( "values", [ 0, 90 ] );
	deepEqual( element.slider( "values" ), [ 10, 90 ], "Values (array) - 1st handle restricted properly, against 2nd handle" );

	element.slider( "values", 1, 110 );
	deepEqual( element.slider( "values" ), [ 10, 100 ], "Values (array) - 2nd handle restricted properly, against max" );

	element.slider( "values", [ 75, 50 ] );
	deepEqual( element.slider( "values" ), [ 75, 75 ], "Values (array) - Setting both handles - 2nd Handle resets to 1st" );
} );

} );
