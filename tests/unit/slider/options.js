define( [
	"jquery",
	"ui/slider"
], function( $ ) {

var element, options;

function handle() {
	return element.find( ".ui-slider-handle" );
}

module( "slider: options" );

test( "disabled", function( assert ){
	expect( 8 );
	var count = 0;

	element = $( "#slider1" ).slider();
	element.bind( "slidestart", function() {
		count++;
	});

	// enabled
	assert.lacksClasses( element, "ui-slider-disabled" );
	equal( element.slider( "option", "disabled" ), false , "is not disabled" );

	handle().simulate( "drag", { dx: 10 } );
	equal( count, 1, "slider moved" );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equal( count, 2, "slider moved" );

	// disabled
	element.slider( "option", "disabled", true );
	assert.hasClasses( element, "ui-slider-disabled" );
	equal( element.slider( "option", "disabled" ), true, "is disabled" );

	handle().simulate( "drag", { dx: 10 } );
	equal( count, 2, "slider did not move" );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equal( count, 2, "slider did not move" );
});

test( "max", function() {
	expect( 5 );
	element = $( "<div></div>" );

	options = {
		max: 37,
		min: 6,
		orientation: "horizontal",
		step: 1,
		value: 50
	};

	element.slider( options );
	ok( element.slider( "option", "value" ) === options.value, "value option is not contained by max" );
	ok( element.slider( "value" ) === options.max, "value method is contained by max" );

	options = {
		max: 9,
		min: 1,
		orientation: "horizontal",
		step: 3,
		value: 8.75
	};

	element.slider( options );
	ok( element.slider( "value" ) === 7, "value method is within max, edge Case" );

	options.step = 2;

	element.slider( options );
	ok( element.slider( "value" ) === options.max, "value method will max, step is changed" );
	element.slider( "destroy" );

	options = {
		max: 60,
		min: 50,
		orientation: "horizontal",
		step: 0.1,
		value: 60
	};

	element.slider( options );
	ok( element.slider( "value" ) === options.max, "value method will max, step is changed and step is float" );
	element.slider( "destroy" );

});

test( "min", function() {
	expect( 2 );
	element = $( "<div></div>" );

	options = {
		max: 37,
		min: 6,
		orientation: "vertical",
		step: 1,
		value: 2
	};

	element.slider( options );
	ok( element.slider( "option", "value" ) === options.value, "value option is not contained by min" );
	ok( element.slider( "value" ) === options.min, "value method is contained by min" );
	element.slider( "destroy" );

});

test( "orientation", function( assert ) {
	expect( 8 );
	element = $( "#slider1" );

	options = {
		max: 2,
		min: -2,
		orientation: "vertical",
		value: 1
	};

	var percentVal = ( options.value - options.min ) / ( options.max - options.min ) * 100;

	element.slider( options ).slider( "option", "orientation", "horizontal" );
	assert.hasClasses( element, "ui-slider-horizontal" );
	assert.lacksClasses( element, "ui-slider-vertical" );
	equal( element.find( ".ui-slider-handle" )[ 0 ].style.bottom, "", "CSS bottom reset" );
	equal( handle()[0].style.left, percentVal + "%", "horizontal slider handle is positioned with left: %" );

	element.slider( "destroy" ) ;

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
	equal( element.find( ".ui-slider-handle" )[ 0 ].style.left, "", "CSS left reset" );
	equal( handle()[0].style.bottom, percentVal + "%", "vertical slider handle is positioned with bottom: %" );

	element.slider( "destroy" );

});

//spec: http://wiki.jqueryui.com/Slider#specs
// value option/method: the value option is not restricted by min/max/step.
// What is returned by the value method is restricted by min (>=), max (<=), and step (even multiple)
test( "step", function() {
	expect( 9 );
	element = $( "<div></div>" ).slider({
		min: 0,
		value: 0,
		step: 10,
		max: 100
	});
	equal( element.slider( "value" ), 0 );

	element.slider( "value", 1 );
	equal( element.slider( "value" ), 0 );

	element.slider( "value", 9 );
	equal( element.slider( "value" ), 10 );

	element.slider( "value", 11 );
	equal( element.slider( "value" ), 10 );

	element.slider( "value", 19 );
	equal( element.slider( "value" ), 20 );

	element = $( "<div></div>" ).slider({
		min: 0,
		value: 0,
		step: 20,
		max: 100
	});
	element.slider( "value", 0 );

	element.slider( "option", "value", 1 );
	equal( element.slider( "value" ), 0 );

	element.slider( "option", "value", 9 );
	equal( element.slider( "value" ), 0 );

	element.slider( "option", "value", 11 );
	equal( element.slider( "value" ), 20 );

	element.slider( "option", "value", 19 );
	equal( element.slider( "value" ), 20 );

	element.slider( "destroy" );
});

//test( "value", function() {
//	ok(false, "missing test - untested code is broken code." );
//});

test( "values", function() {
	expect( 2 );

	// testing multiple ranges on the same page, the object reference to the values
	// property is preserved via multiple range elements, so updating options.values
	// of 1 slider updates options.values of all the others
	var ranges = $([
		document.createElement( "div" ),
		document.createElement( "div" )
	]).slider({
		range: true,
		values: [ 25, 75 ]
	});

	notStrictEqual(
		ranges.eq( 0 ).slider( "instance" ).options.values,
		ranges.eq( 1 ).slider( "instance" ).options.values,
		"multiple range sliders should not have a reference to the same options.values array"
	);

	ranges.eq( 0 ).slider( "values", 0, 10 );

	notEqual(
		ranges.eq( 0 ).slider( "values", 0 ),
		ranges.eq( 1 ).slider( "values", 0 ),
		"the values for multiple sliders should be different"
	);
});

test( "range", function( assert ) {
	expect( 32 );
	var range;

	// min
	element = $( "<div></div>" ).slider({
		range: "min",
		min: 1,
		max: 10,
		step: 1
	});

	equal( element.find( ".ui-slider-handle" ).length, 1, "range min, one handle" );
	equal( element.find( ".ui-slider-range-min" ).length, 1, "range min" );
	element.slider( "destroy" );

	// max
	element = $( "<div></div>" ).slider({
		range: "max",
		min: 1,
		max: 10,
		step: 1
	});

	equal( element.find( ".ui-slider-handle" ).length, 1, "range max, one handle" );
	equal( element.find( ".ui-slider-range-max" ).length, 1, "range max" );
	element.slider( "destroy" );

	// true
	element = $( "<div></div>" ).slider({
		range: true,
		min: 1,
		max: 10,
		step: 1
	});

	range = element.find( ".ui-slider-range" );
	equal( element.find( ".ui-slider-handle" ).length, 2, "range true, two handles" );
	assert.lacksClasses( range, "ui-slider-range-max ui-slider-range-min" );
	element.slider( "destroy" );

	// Change range from min to max
	element = $( "<div></div>" ).slider({
		range: "min",
		min: 1,
		max: 10,
		step: 1
	}).slider( "option", "range", "max" );

	equal( element.find( ".ui-slider-handle" ).length, 1, "range switch from min to max, one handle" );
	equal( element.find( ".ui-slider-range-min" ).length, 0, "range switch from min to max" );
	equal( element.find( ".ui-slider-range-max" ).length, 1, "range switch from min to max" );
	element.slider( "destroy" );

	// Change range from max to min
	element = $( "<div></div>" ).slider({
		range: "max",
		min: 1,
		max: 10,
		step: 1
	}).slider( "option", "range", "min" );

	equal( element.find( ".ui-slider-handle" ).length, 1, "range switch from max to min, one handle" );
	equal( element.find( ".ui-slider-range-max" ).length, 0, "range switch from max to min" );
	equal( element.find( ".ui-slider-range-min" ).length, 1, "range switch from max to min" );
	element.slider( "destroy" );

	// Change range from max to true
	element = $( "<div></div>" ).slider({
		range: "max",
		min: 1,
		max: 10,
		step: 1
	}).slider( "option", "range", true );

	equal( element.find( ".ui-slider-handle" ).length, 2, "range switch from max to true, two handles" );
	equal( element.find( ".ui-slider-range-max" ).length, 0, "range switch from max to true" );
	equal( element.find( ".ui-slider-range-min" ).length, 0, "range switch from max to true" );
	equal( element.slider( "option", "value" ), 0 , "option value" );
	equal( element.slider( "value" ), 1 , "value" );
	deepEqual( element.slider( "option", "values" ), [1, 1], "option values" );
	deepEqual( element.slider( "values" ), [1, 1], "values" );
	element.slider( "destroy" );

	// Change range from true to min
	element = $( "<div></div>" ).slider({
		range: true,
		min: 1,
		max: 10,
		step: 1
	}).slider( "option", "range", "min" );

	equal( element.find( ".ui-slider-handle" ).length, 1, "range switch from true to min, one handle" );
	equal( element.find( ".ui-slider-range-max" ).length, 0, "range switch from true to min" );
	equal( element.find( ".ui-slider-range-min" ).length, 1, "range switch from true to min" );
	equal( element.slider( "option", "value" ), 1, "value" );
	equal( element.slider( "value" ), 1 , "value" );
	equal( element.slider( "option", "values" ), null, "values" );
	deepEqual( element.slider( "values" ), [] , "values" );
	element.slider( "destroy" );

	// Change range from true to false
	element = $( "<div></div>" ).slider({
		range: true,
		min: 1,
		max: 10,
		step: 1
	}).slider( "option", "range", false );
	equal( element.find( ".ui-slider-handle" ).length, 2, "range switch from true to false, both handles remain" );
	equal( element.find( ".ui-slider-range" ).length, 0, "range switch from true to false" );
	equal( element.slider( "option", "value" ), 0 , "option value" );
	equal( element.slider( "value" ), 1 , "value" );
	deepEqual( element.slider( "option", "values" ), [1, 1], "option values" );
	deepEqual( element.slider( "values" ), [1, 1], "values" );
	element.slider( "destroy" );
});

} );
