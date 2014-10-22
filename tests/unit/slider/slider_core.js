(function( $ ) {
//
// Slider Test Helper Functions
//

var element, options;

function handle() {
	return element.find( ".ui-slider-handle" );
}

// Slider Tests
module( "slider: core" );

test( "markup structure", function() {
	expect( 9 );
	var element = $( "<div></div>" ).slider({ range: true }),
		handle = element.find( "span" ),
		range = element.find( "div" );

	ok( element.hasClass( "ui-slider" ), "main element is .ui-slider" );
	ok( element.hasClass( "ui-widget" ), "main element is .ui-widget" );
	ok( element.hasClass( "ui-widget-content" ), "main element is .ui-widget-content" );
	ok( element.hasClass( "ui-corner-all" ), "main element is .ui-corner-all" );

	ok( handle.hasClass( "ui-slider-handle" ), "handle is .ui-slider-handle" );
	ok( handle.hasClass( "ui-corner-all" ), "handle is .ui-corner-all" );

	ok( range.hasClass( "ui-slider-range" ), "range is .ui-slider-range" );
	ok( range.hasClass( "ui-widget-header" ), "range is .ui-widget-header" );
	ok( range.hasClass( "ui-corner-all" ), "range is .ui-corner-all" );
});

test( "keydown HOME on handle sets value to min", function() {
	expect( 2 );
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
	equal(element.slider( "value" ), options.min );

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
	equal(element.slider( "value" ), options.min) ;

	element.slider( "destroy" );
});

test( "keydown END on handle sets value to max", function() {
	expect( 2 );
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
	equal(element.slider( "value" ), options.max) ;

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
	equal(element.slider( "value" ), options.max );

	element.slider( "destroy" );
});

test( "keydown PAGE_UP on handle increases value by 1/5 range, not greater than max", function() {
	expect( 4 );
	$.each( [ "horizontal", "vertical" ], function( i, orientation ) {
		element = $( "<div></div>" );
		options = {
			max: 100,
			min: 0,
			orientation: orientation,
			step: 1
		};
		element.slider( options );

		element.slider( "value", 70);

		handle().simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal(element.slider( "value" ), 90);

		handle().simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_UP } );
		equal(element.slider( "value" ), 100);

		element.slider( "destroy" );
	});
});

test( "keydown PAGE_DOWN on handle decreases value by 1/5 range, not less than min", function() {
	expect( 4 );
	$.each( [ "horizontal", "vertical" ], function( i, orientation ) {
		element = $( "<div></div>" );
		options = {
			max: 100,
			min: 0,
			orientation: orientation,
			step: 1
		};
		element.slider( options );

		element.slider( "value", 30);

		handle().simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		equal(element.slider( "value" ), 10);

		handle().simulate( "keydown", { keyCode: $.ui.keyCode.PAGE_DOWN } );
		equal(element.slider( "value" ), 0 );

		element.slider( "destroy" );
	});
});

test( "keydown UP on handle increases value by step, not greater than max", function() {
	expect( 4 );
	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "horizontal",
		step: 1
	};
	element.slider(options);

	element.slider( "value", options.max - options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equal(element.slider( "value" ), options.max );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equal(element.slider( "value" ), options.max );

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
	equal(element.slider( "value" ), options.max );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.UP } );
	equal(element.slider( "value" ), options.max );

	element.slider( "destroy" );
});

test( "keydown RIGHT on handle increases value by step, not greater than max", function() {
	expect( 4 );
	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "horizontal",
		step: 1
	};
	element.slider(options);

	element.slider( "value", options.max - options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equal(element.slider( "value" ), options.max);

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equal(element.slider( "value" ), options.max );

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
	equal(element.slider( "value" ), options.max );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.RIGHT } );
	equal(element.slider( "value" ), options.max );

	element.slider( "destroy" );
});

test( "keydown DOWN on handle decreases value by step, not less than min", function() {
	expect( 4 );
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
	equal(element.slider( "value" ), options.min);

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal(element.slider( "value" ), options.min );

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
	equal(element.slider( "value" ), options.min);

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.DOWN } );
	equal(element.slider( "value" ), options.min );

	element.slider( "destroy" );
});

test( "keydown LEFT on handle decreases value by step, not less than min", function() {
	expect( 4 );
	element = $( "<div></div>" );
	options = {
		max: 5,
		min: -5,
		orientation: "horizontal",
		step: 1
	};
	element.slider(options);

	element.slider( "value", options.min + options.step );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equal(element.slider( "value" ), options.min );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equal(element.slider( "value" ), options.min );

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
	equal(element.slider( "value" ), options.min );

	handle().simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } );
	equal(element.slider( "value" ), options.min );

	element.slider( "destroy" );
});

})( jQuery );
