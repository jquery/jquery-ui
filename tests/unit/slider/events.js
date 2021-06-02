define( [
	"qunit",
	"jquery",
	"lib/helper",
	"ui/widgets/slider"
], function( QUnit, $, helper ) {
"use strict";

QUnit.module( "slider: events", { afterEach: helper.moduleAfterEach }  );

//Specs from http://wiki.jqueryui.com/Slider#specs
//"change callback: triggers when the slider has stopped moving and has a new
// value (even if same as previous value), via mouse(mouseup) or keyboard(keyup)
// or value method/option"
QUnit.test( "mouse based interaction", function( assert ) {
	assert.expect( 4 );

	var element = $( "#slider1" )
		.slider( {
			start: function( event ) {
				assert.equal( event.originalEvent.type, "mousedown", "start triggered by mousedown" );
			},
			slide: function( event ) {
				assert.equal( event.originalEvent.type, "mousemove", "slider triggered by mousemove" );
			},
			stop: function( event ) {
				assert.equal( event.originalEvent.type, "mouseup", "stop triggered by mouseup" );
			},
			change: function( event ) {
				assert.equal( event.originalEvent.type, "mouseup", "change triggered by mouseup" );
			}
		} );

	element.find( ".ui-slider-handle" ).eq( 0 )
		.simulate( "drag", { dx: 10, dy: 10 } );

} );
QUnit.test( "keyboard based interaction", function( assert ) {
	assert.expect( 3 );

	// Test keyup at end of handle slide (keyboard)
	var element = $( "#slider1" )
		.slider( {
			start: function( event ) {
				assert.equal( event.originalEvent.type, "keydown", "start triggered by keydown" );
			},
			slide: function() {
				assert.ok( false, "Slider never triggered by keys" );
			},
			stop: function( event ) {
				assert.equal( event.originalEvent.type, "keyup", "stop triggered by keyup" );
			},
			change: function( event ) {
				assert.equal( event.originalEvent.type, "keyup", "change triggered by keyup" );
			}
		} );

	element.find( ".ui-slider-handle" ).eq( 0 )
		.simulate( "keydown", { keyCode: $.ui.keyCode.LEFT } )
		.simulate( "keypress", { keyCode: $.ui.keyCode.LEFT } )
		.simulate( "keyup", { keyCode: $.ui.keyCode.LEFT } );

} );
QUnit.test( "programmatic event triggers", function( assert ) {
	assert.expect( 6 );

	// Test value method
	var element = $( "<div></div>" )
		.slider( {
			change: function() {
				assert.ok( true, "change triggered by value method" );
			}
		} )
		.slider( "value", 0 );

	// Test values method
	element = $( "<div></div>" )
		.slider( {
			values: [ 10, 20 ],
			change: function() {
				assert.ok( true, "change triggered by values method" );
			}
		} )
		.slider( "values", [ 80, 90 ] );

	// Test value option
	element = $( "<div></div>" )
		.slider( {
			change: function() {
				assert.ok( true, "change triggered by value option" );
			}
		} )
		.slider( "option", "value", 0 );

	// Test values option
	element = $( "<div></div>" )
		.slider( {
			values: [ 10, 20 ],
			change: function() {
				assert.ok( true, "change triggered by values option" );
			}
		} )
		.slider( "option", "values", [ 80, 90 ] );

} );

QUnit.test( "mouse based interaction part two: when handles overlap", function( assert ) {
	assert.expect( 6 );

	var element = $( "#slider1" )
		.slider( {
			values: [ 0, 0, 0 ],
			start: function( event, ui ) {
				assert.equal( handles.index( ui.handle ), 2, "rightmost handle activated when overlapping at minimum (#3736)" );
			}
		} ),
		handles = element.find( ".ui-slider-handle" );
	handles.eq( 0 ).simulate( "drag", { dx: 10 } );
	element.slider( "destroy" );

	element = $( "#slider1" )
		.slider( {
			values: [ 10, 10, 10 ],
			max: 10,
			start: function( event, ui ) {
				assert.equal( handles.index( ui.handle ), 0, "leftmost handle activated when overlapping at maximum" );
			}
		} );
	handles = element.find( ".ui-slider-handle" );
	handles.eq( 0 ).simulate( "drag", { dx: -10 } );
	element.slider( "destroy" );

	element = $( "#slider1" )
		.slider( {
			values: [ 19, 20 ]
		} );
	handles = element.find( ".ui-slider-handle" );
	handles.eq( 0 ).simulate( "drag", { dx: 10 } );
	element.one( "slidestart", function( event, ui ) {
		assert.equal( handles.index( ui.handle ), 0, "left handle activated if left was moved last" );
	} );
	handles.eq( 0 ).simulate( "drag", { dx: 10 } );
	element.slider( "destroy" );

	element = $( "#slider1" )
		.slider( {
			values: [ 19, 20 ]
		} );
	handles = element.find( ".ui-slider-handle" );
	handles.eq( 1 ).simulate( "drag", { dx: -10 } );
	element.one( "slidestart", function( event, ui ) {
		assert.equal( handles.index( ui.handle ), 1, "right handle activated if right was moved last (#3467)" );
	} );
	handles.eq( 0 ).simulate( "drag", { dx: 10 } );

	element = $( "#slider1" )
		.slider( {
			range: true,
			min: 0,
			max: 100,
			values: [ 0, 50 ]
		} );
	handles = element.find( ".ui-slider-handle" );

	element.slider( "option", { values: [ 100, 100 ] } );
	handles.eq( 0 ).simulate( "drag", { dx: -10 } );
	assert.equal( element.slider( "values" )[ 0 ], 99, "setting both values of range slider to the maximum doesn't lock slider" );

	element.slider( "option", { values: [ 0, 0 ] } );
	handles.eq( 1 ).simulate( "drag", { dx: 10 } );
	assert.equal( element.slider( "values" )[ 1 ], 1, "setting both values of range slider to the minimum  doesn't lock slider" );
} );

QUnit.test( "event data", function( assert ) {
	assert.expect( 6 );

	var slideHandleIndex = 3,
		values = [ 8, 9, 7, 4 ],
		newValues = [ 8, 9, 7, 5 ],
		element = $( "#slider1" )
			.slider( {
				values: values,
				start: function( event, ui ) {
					assert.deepEqual( ui, expectedUiHash, "passing ui to start event" );
				},
				slide: function( event, ui ) {
					assert.deepEqual( ui, expectedChangedUiHash, "passing ui to slide event" );
				},
				stop: function( event, ui ) {
					assert.deepEqual( ui, expectedChangedUiHash, "passing ui to stop event" );
				},
				change: function( event, ui ) {
					assert.deepEqual( ui, expectedChangedUiHash, "passing ui to change event" );
				}
			} ),
		handles = element.find( ".ui-slider-handle" ),
		expectedUiHash = {
			handle: handles.eq( slideHandleIndex )[ 0 ],
			handleIndex: slideHandleIndex,
			values: values,
			value: values[ slideHandleIndex ]
		},
		expectedChangedUiHash = $.extend( {}, expectedUiHash, {
			values: newValues,
			value: newValues[ slideHandleIndex ]
		} );

	handles.eq( slideHandleIndex ).simulate( "drag", { dx: 10 } );

	element.slider( "destroy" );
	element = $( "#slider1" ).slider( {
		min: 0,
		max: 100,
		value: 1,
		slide: function( event, ui ) {
			assert.equal( ui.value, 0, "should pass 0 value if slider reaches it" );
		}
	} );
	handles = element.find( ".ui-slider-handle" );
	handles.eq( 0 ).simulate( "drag", { dx: -10 } );

	element.slider( "destroy" );
	element = $( "#slider1" ).slider( {
		min: 0,
		max: 100,
		values: [ 1, 2 ],
		slide: function( event, ui ) {
			assert.equal( ui.value, 0, "should pass 0 value if one of handles reaches it" );
		}
	} );
	handles = element.find( ".ui-slider-handle" );
	handles.eq( 0 ).simulate( "drag", { dx: -10 } );
} );

} );
