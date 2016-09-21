define( [
	"qunit",
	"jquery",
	"ui/widgets/slider"
], function( QUnit, $ ) {

var element, options;

function handle() {
	return element.find( ".ui-slider-handle" );
}

// Slider Tests
QUnit.module( "slider: core" );

QUnit.test( "markup structure", function( assert ) {
	assert.expect( 4 );
	var element = $( "<div>" ).slider( { range: true } ),
		handle = element.find( "span" ),
		range = element.find( "div" );

	assert.hasClasses( element, "ui-slider ui-slider-horizontal ui-widget ui-widget-content" );
	assert.hasClasses( range, "ui-slider-range ui-widget-header" );
	assert.hasClasses( handle[ 0 ], "ui-slider-handle" );
	assert.hasClasses( handle[ 1 ], "ui-slider-handle" );
} );

QUnit.test( "custom handle", function( assert ) {
	assert.expect( 3 );

	var element = $( "#slider-custom-handle" ).slider();
	var customHandle = $( ".custom-handle" );
	var sliderHandles = element.find( ".ui-slider-handle" );

	assert.equal( sliderHandles.length, 1, "Only one handle" );
	assert.strictEqual( sliderHandles[ 0 ], customHandle[ 0 ], "Correct handle" );
	assert.equal( customHandle.attr( "tabIndex" ), 0, "tabIndex" );
} );

QUnit.test( "keydown HOME on handle sets value to min", function( assert ) {
	assert.expect( 2 );
	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "horizontal",
		step: 1
	};
	element.slider( options );

	element.slider( "value", 0 );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
	assert.equal( element.slider( "value" ), options.min );

	element.slider( "destroy" );

	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "vertical",
		step: 1
	};
	element.slider( options );

	element.slider( "value", 0 );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.HOME } );
	assert.equal( element.slider( "value" ), options.min ) ;

	element.slider( "destroy" );
} );

QUnit.test( "keydown END on handle sets value to max", function( assert ) {
	assert.expect( 2 );
	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "horizontal",
		step: 1
	};
	element.slider( options );

	element.slider( "value", 0 );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.END } );
	assert.equal( element.slider( "value" ), options.max ) ;

	element.slider( "destroy" );

	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "vertical",
		step: 1
	};
	element.slider( options );

	element.slider( "value", 0 );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.END } );
	assert.equal( element.slider( "value" ), options.max );

	element.slider( "destroy" );
} );

QUnit.test( "keydown PAGE_UP on handle increases value by 1/5 range, not greater than max", function( assert ) {
	assert.expect( 4 );
	$.each( [ "horizontal", "vertical" ], function( i, orientation ) {
		element = $( "<div></div>" );
		options = {
			max: 100,
			min: 0,
			orientation: orientation,
			step: 1
		};
		element.slider( options );

		element.slider( "value", 70 );

		handle().simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( element.slider( "value" ), 90 );

		handle().simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		assert.equal( element.slider( "value" ), 100 );

		element.slider( "destroy" );
	} );
} );

QUnit.test( "keydown PAGE_DOWN on handle decreases value by 1/5 range, not less than min", function( assert ) {
	assert.expect( 4 );
	$.each( [ "horizontal", "vertical" ], function( i, orientation ) {
		element = $( "<div></div>" );
		options = {
			max: 100,
			min: 0,
			orientation: orientation,
			step: 1
		};
		element.slider( options );

		element.slider( "value", 30 );

		handle().simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( element.slider( "value" ), 10 );

		handle().simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		assert.equal( element.slider( "value" ), 0 );

		element.slider( "destroy" );
	} );
} );

QUnit.test( "keydown UP on handle increases value by step, not greater than max", function( assert ) {
	assert.expect( 4 );
	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "horizontal",
		step: 1
	};
	element.slider( options );

	element.slider( "value", options.max - options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	assert.equal( element.slider( "value" ), options.max );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	assert.equal( element.slider( "value" ), options.max );

	element.slider( "destroy" );

	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "vertical",
		step: 1
	};
	element.slider( options );

	element.slider( "value", options.max - options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	assert.equal( element.slider( "value" ), options.max );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	assert.equal( element.slider( "value" ), options.max );

	element.slider( "destroy" );
} );

QUnit.test( "keydown RIGHT on handle increases value by step, not greater than max", function( assert ) {
	assert.expect( 4 );
	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "horizontal",
		step: 1
	};
	element.slider( options );

	element.slider( "value", options.max - options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	assert.equal( element.slider( "value" ), options.max );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	assert.equal( element.slider( "value" ), options.max );

	element.slider( "destroy" );

	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "vertical",
		step: 1
	};
	element.slider( options );

	element.slider( "value", options.max - options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	assert.equal( element.slider( "value" ), options.max );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	assert.equal( element.slider( "value" ), options.max );

	element.slider( "destroy" );
} );

QUnit.test( "keydown DOWN on handle decreases value by step, not less than min", function( assert ) {
	assert.expect( 4 );
	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "horizontal",
		step: 1
	};
	element.slider( options );

	element.slider( "value", options.min + options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	assert.equal( element.slider( "value" ), options.min );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	assert.equal( element.slider( "value" ), options.min );

	element.slider( "destroy" );

	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "vertical",
		step: 1
	};
	element.slider( options );

	element.slider( "value", options.min + options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	assert.equal( element.slider( "value" ), options.min );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	assert.equal( element.slider( "value" ), options.min );

	element.slider( "destroy" );
} );

QUnit.test( "keydown LEFT on handle decreases value by step, not less than min", function( assert ) {
	assert.expect( 4 );
	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "horizontal",
		step: 1
	};
	element.slider( options );

	element.slider( "value", options.min + options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	assert.equal( element.slider( "value" ), options.min );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	assert.equal( element.slider( "value" ), options.min );

	element.slider( "destroy" );

	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "vertical",
		step: 1
	};
	element.slider( options );

	element.slider( "value", options.min + options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	assert.equal( element.slider( "value" ), options.min );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	assert.equal( element.slider( "value" ), options.min );

	element.slider( "destroy" );
} );

} );
