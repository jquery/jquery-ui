/*
 * slider_events.js
 */
(function($) {
	
var el;

module( "slider: events" );

test( "start", function() {
	ok( false, "missing test - untested code is broken code." );
});

test( "slide", function() {
	ok( false, "missing test - untested code is broken code." );
});

//Specs from http://wiki.jqueryui.com/Slider#specs
//"change callback: triggers when the slider has stopped moving and has a new
// value (even if same as previous value), via mouse(mouseup) or keyboard(keyup)
// or value method/option"
test( "change", function() {
	expect(8);
	
	var handle;
	// Test mouseup at end of handle slide (mouse)
	el = $( "<div></div>" )
		.appendTo( "body" )
		.slider({
			change: function(event, ui) {
				ok( true, "change triggered by mouseup at end of handle slide (mouse)" );
			}
		});

	el.find( ".ui-slider-handle" ).eq( 0 )
		.simulate( "drag", { dx: 10, dy: 10 } );

	reset();
	// Test keyup at end of handle slide (keyboard)
	el = $( "<div></div>" )
		.appendTo( "body" )
		.slider({
			change: function(event, ui) {
				ok( true, "change triggered by keyup at end of handle slide (keyboard)" );
			}
		});

	el.find( ".ui-slider-handle" ).eq( 0 )
		.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } )
		.simulate( "keypress", { keyCode: $.ui.keyCode.LEFT } )
		.simulate( "keyup", { keyCode: $.ui.keyCode.LEFT } );

	reset();
	// Test value method
	el = $( "<div></div>" )
		.slider({
			change: function(event, ui) {
				ok( true, "change triggered by value method" );
			}
		})
		.slider( "value", 0 );

	reset();
	// Test values method
	el = $( "<div></div>" )
		.slider({
			values: [ 10, 20 ],
			change: function(event, ui) {
				ok( true, "change triggered by values method" );
			}
		})
		.slider( "values", [80, 90] );

	reset();
	// Test value option
	el = $( "<div></div>" )
		.slider({
			change: function(event, ui) {
				ok( true, "change triggered by value option" );
			}
		})
		.slider( "option", "value", 0 );

	reset();
	// Test values option
	el = $( "<div></div>" )
		.slider({
			values: [ 10, 20 ],
			change: function(event, ui) {
				ok( true, "change triggered by values option" );
			}
		})
		.slider( "option", "values", [80, 90] );

});

test( "stop", function() {
	ok( false, "missing test - untested code is broken code." );
});

}( jQuery ) );
