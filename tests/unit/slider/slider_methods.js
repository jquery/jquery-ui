(function( $ ) {

module( "slider: methods" );

test( "init", function() {
	expect(5);

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
});

test( "destroy", function() {
	expect( 1 );
	domEqual( "#slider1", function() {
		$( "#slider1" ).slider().slider( "destroy" );
	});
});

test( "enable", function() {
	expect( 5 );
	var element,
		expected = $( "<div></div>" ).slider(),
		actual = expected.slider( "enable" );
	equal(actual, expected, "enable is chainable" );

	element = $( "<div></div>" ).slider({ disabled: true });
	ok( element.hasClass( "ui-state-disabled" ), "slider has ui-state-disabled class before enable method call" );
	ok( element.hasClass( "ui-slider-disabled" ), "slider has ui-slider-disabled class before enable method call" );
	element.slider( "enable" );
	ok( !element.hasClass( "ui-state-disabled" ), "slider does not have ui-state-disabled class after enable method call" );
	ok( !element.hasClass( "ui-slider-disabled" ), "slider does not have ui-slider-disabled class after enable method call" );
});

test( "disable", function() {
	expect( 6 );
	var element,
		expected = $( "<div></div>" ).slider(),
		actual = expected.slider( "disable" );
	equal(actual, expected, "disable is chainable" );

	element = $( "<div></div>" ).slider({ disabled: false });
	ok( !element.hasClass( "ui-state-disabled" ), "slider does not have ui-state-disabled class before disabled method call" );
	ok( !element.hasClass( "ui-slider-disabled" ), "slider does not have ui-slider-disabled class before disable method call" );
	element.slider( "disable" );
	ok( element.hasClass( "ui-state-disabled" ), "slider has ui-state-disabled class after disable method call" );
	ok( element.hasClass( "ui-slider-disabled" ), "slider has ui-slider-disabled class after disable method call" );
	ok( !element.attr( "aria-disabled" ), "slider does not have aria-disabled attr after disable method call" );
});

test( "value", function() {
	expect( 19 );
	$( [ false, "min", "max" ] ).each(function() {
		var element = $( "<div></div>" ).slider({
			range: this,
			value: 5
		});
		equal( element.slider( "value" ), 5, "range: " + this + " slider method get" );
		equal( element.slider( "value", 10), element, "value method is chainable" );
		equal( element.slider( "value" ), 10, "range: " + this + " slider method set" );
		element.remove();
	});
	var element = $( "<div></div>" ).slider({
		min: -1, value: 0, max: 1
	});
	// min with value option vs value method
	element.slider( "option", "value", -2 );
	equal( element.slider( "option", "value" ), -2, "value option does not respect min" );
	equal( element.slider( "value" ), -1, "value method get respects min" );
	equal( element.slider( "value", -2 ), element, "value method is chainable" );
	equal( element.slider( "option", "value" ), -1, "value method set respects min" );
	// max with value option vs value method
	element.slider( "option", "value", 2);
	equal( element.slider( "option", "value" ), 2, "value option does not respect max" );
	equal( element.slider( "value" ), 1, "value method get respects max" );
	equal( element.slider( "value", 2 ), element, "value method is chainable" );
	equal( element.slider( "option", "value" ), 1, "value method set respects max" );

	// set max value with step 0.01
	element.slider( "option", {
		min: 2,
		value: 2,
		max: 2.4,
		step: 0.01
	});
	element.slider( "option", "value", 2.4 );
	equal( element.slider( "value" ), 2.4, "value is set to max with 0.01 step" );

	element = $( "<div></div>" ).slider({
		value: 100,
		min: 10,
		max: 500,
		step: 50
	});

	element.slider( "option", "value", 510 );
	equal( element.slider( "value" ), 460, "value is restricted to maximum valid step" );
});

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

})( jQuery );
