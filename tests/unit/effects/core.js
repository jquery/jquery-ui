define( [
	"qunit",
	"jquery",
	"lib/common",
	"lib/helper",
	"ui/effect",
	"ui/effects/effect-blind",
	"ui/effects/effect-bounce",
	"ui/effects/effect-clip",
	"ui/effects/effect-drop",
	"ui/effects/effect-explode",
	"ui/effects/effect-fade",
	"ui/effects/effect-fold",
	"ui/effects/effect-highlight",
	"ui/effects/effect-puff",
	"ui/effects/effect-pulsate",
	"ui/effects/effect-scale",
	"ui/effects/effect-shake",
	"ui/effects/effect-size",
	"ui/effects/effect-slide",
	"ui/effects/effect-transfer"
], function( QUnit, $, common, helper ) {
"use strict";

QUnit.assert.present = function( value, array, message ) {
	this.push( jQuery.inArray( value, array ) !== -1, value, array, message );
};

QUnit.assert.notPresent = function( value, array, message ) {
	this.push( jQuery.inArray( value, array ) === -1, value, array, message );
};

// MinDuration is used for "short" animate tests where we are only concerned about the final
var minDuration = 60,

	// Duration is used for "long" animates where we plan on testing properties during animation
	duration = 200;

QUnit.module( "effects.core", { afterEach: helper.moduleAfterEach }  );

// TODO: test all signatures of .show(), .hide(), .toggle().
// Look at core's signatures and UI's signatures.
QUnit.test( ".hide() with step", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	var element = $( "#elem" ),
		step = function() {
			assert.ok( true, "step callback invoked" );
			step = $.noop;
		};

	element.hide( {
		step: function() {
			step();
		},
		complete: ready
	} );
} );

QUnit.test( "Immediate Return Conditions", function( assert ) {
	var hidden = $( "div.hidden" ),
		count = 0;
	assert.expect( 3 );
	hidden.hide( "blind", function() {
		assert.equal( ++count, 1, "Hide on hidden returned immediately" );
	} ).show().show( "blind", function() {
		assert.equal( ++count, 2, "Show on shown returned immediately" );
	} );
	assert.equal( ++count, 3, "Both Functions worked properly" );
} );

QUnit.test( ".hide() with hidden parent", function( assert ) {
	assert.expect( 1 );
	var element = $( "div.hidden" ).children();
	element.hide( "blind", function() {
		assert.equal( element.css( "display" ), "none", "display: none" );
	} );
} );

QUnit.test( "Parse of null for options", function( assert ) {
	var ready = assert.async();
	var hidden = $( "div.hidden" ),
		count = 0;
	assert.expect( 1 );
	hidden.show( "blind", null, 1, function() {
		assert.equal( ++count, 1, "null for options still works" );
		ready();
	} );
} );

QUnit.test( "removeClass", function( assert ) {
	assert.expect( 3 );

	var element = $( "<div>" );
	assert.equal( "", element[ 0 ].className );
	element.addClass( "destroyed" );
	assert.equal( "destroyed", element[ 0 ].className );
	element.removeClass();
	assert.equal( "", element[ 0 ].className );
} );

QUnit.module( "effects.core: animateClass", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "animateClass works with borderStyle", function( assert ) {
	var ready = assert.async();
	var test = $( "div.animateClass" );
	assert.expect( 3 );
	test.toggleClass( "testAddBorder", minDuration, function() {
		test.toggleClass( "testAddBorder", minDuration, function() {
			assert.equal( test.css( "borderLeftStyle" ), "none", "None border set" );
			ready();
		} );
		assert.equal( test.css( "borderLeftStyle" ), "solid", "None border not immedately set" );
	} );
	assert.equal( test.css( "borderLeftStyle" ), "solid", "Solid border immedately set" );
} );

QUnit.test( "animateClass works with colors", function( assert ) {
	var ready = assert.async();
	var test = $( "div.animateClass" ),
		oldStep = jQuery.fx.step.backgroundColor;

	assert.expect( 2 );

	// We want to catch the first frame of animation
	jQuery.fx.step.backgroundColor = function( fx ) {
		oldStep.apply( this, arguments );

		// Make sure it has animated somewhere we can detect
		if ( fx.pos > 255 / 2000 ) {
			jQuery.fx.step.backgroundColor = oldStep;
			assert.notPresent( test.css( "backgroundColor" ),
				[ "#000000", "#ffffff", "#000", "#fff", "rgb(0, 0, 0)", "rgb(255,255,255)" ],
				"Color is not endpoints in middle." );
			test.stop( true, true );
		}
	};

	test.toggleClass( "testChangeBackground", {
		duration: 2000,
		complete: function() {
			assert.present( test.css( "backgroundColor" ), [ "#ffffff", "#fff", "rgb(255, 255, 255)" ], "Color is final" );
			ready();
		}
	} );
} );

QUnit.test( "animateClass calls step option", function( assert ) {
	assert.expect( 1 );
	var test = jQuery( "div.animateClass" ),
		step = function() {
			assert.ok( true, "Step Function Called" );
			step = $.noop;
		};
	test.toggleClass( "testChangeBackground", {
		step: function() {
			step();
		}
	} );

	test.stop( true, true );
} );

QUnit.test( "animateClass works with children", function( assert ) {
	assert.expect( 3 );
	var ready = assert.async();
	var animatedChild,
		test = $( "div.animateClass" ),
		h2 = test.find( "h2" );

	test.toggleClass( "testChildren", {
		children: true,
		duration: duration,
		complete: function() {
			assert.equal( h2.css( "fontSize" ), "20px", "Text size is final during complete" );
			test.toggleClass( "testChildren", {
				duration: duration,
				complete: function() {
					assert.equal( h2.css( "fontSize" ), "10px", "Text size revertted after class removed" );

					ready();
				},
				step: function( val, fx ) {
					if ( fx.elem === h2[ 0 ] ) {
						assert.ok( false, "Error - Animating property on h2" );
					}
				}
			} );
		},
		step: function( val, fx ) {
			if ( fx.prop === "fontSize" && fx.elem === h2[ 0 ] && !animatedChild ) {
				assert.equal( fx.end, 20, "animating font size on child" );
				animatedChild = true;
			}
		}
	} );
} );

QUnit.test( "animateClass clears style properties when stopped", function( assert ) {
	var ready = assert.async();
	var test = $( "div.animateClass" ),
		style = test[ 0 ].style,
		orig = style.cssText;

	assert.expect( 2 );

	test.addClass( "testChangeBackground", duration );
	assert.notEqual( orig, style.cssText, "cssText is not the same after starting animation" );

	test
		.stop( true, true )
		.promise()
		.then( function() {
			assert.equal( orig, String.prototype.trim.call( style.cssText ), "cssText is the same after stopping animation midway" );
			ready();
		} );
} );

QUnit.test( "animateClass: css and class changes during animation are not lost (#7106)",
function( assert ) {
	var ready = assert.async();
	assert.expect( 2 );
	var test = $( "div.ticket7106" );

	// Ensure the class stays and that the css property stays
	function animationComplete() {
		assert.hasClasses( test, "testClass", "class change during animateClass was not lost" );
		assert.equal( test.height(), 100, "css change during animateClass was not lost" );
		ready();
	}

	// Add a class and change a style property after starting an animated class
	test.addClass( "animate", minDuration, animationComplete )
		.addClass( "testClass" )
		.height( 100 );
} );

QUnit.test( "createPlaceholder: only created for static or relative elements", function( assert ) {
	assert.expect( 4 );

	assert.ok( $.effects.createPlaceholder( $( ".relative" ) ).length, "placeholder created for relative element" );
	assert.ok( $.effects.createPlaceholder( $( ".static" ) ).length, "placeholder created for static element" );
	assert.ok( !$.effects.createPlaceholder( $( ".absolute" ) ), "placeholder not created for absolute element" );
	assert.ok( !$.effects.createPlaceholder( $( ".fixed" ) ), "placeholder not created for fixed element" );
} );

QUnit.test( "createPlaceholder: preserves layout affecting properties", function( assert ) {
	assert.expect( 7 );

	var position = 5,
		element = $( ".relative" ).css( {
			top: position,
			left: position
		} ),
		before = {
			offset: element.offset(),
			outerWidth: element.outerWidth( true ),
			outerHeight: element.outerHeight( true ),
			"float": element.css( "float" ),
			position: element.position()
		},
		placeholder = $.effects.createPlaceholder( element );

	// Placeholders are only placed to preserve the effect on layout. Considering
	// top and left do not change layout, they are not preserved, which makes some
	// of the math simpler in the implementation.
	assert.deepEqual( before.offset.top - position, placeholder.offset().top, "offset top preserved" );
	assert.deepEqual( before.offset.left - position, placeholder.offset().left, "offset left preserved" );
	assert.deepEqual( before.position.top - position, placeholder.position().top, "position top preserved" );
	assert.deepEqual( before.position.left - position, placeholder.position().left, "position left preserved" );

	assert.deepEqual( before.float, placeholder.css( "float" ), "float preserved" );
	assert.deepEqual( before.outerWidth, placeholder.outerWidth( true ), "width preserved" );
	assert.deepEqual( before.outerHeight, placeholder.outerHeight( true ), "height preserved" );
} );

QUnit.module( "transfer", { afterEach: helper.moduleAfterEach }  );

QUnit.test( "transfer() without callback", function( assert ) {
	var ready = assert.async();
	assert.expect( 0 );

	// Verify that the effect works without a callback
	$( "#elem" ).transfer( {
		to: ".animateClass",
		duration: 1
	} );
	setTimeout( function() {
		ready();
	}, 25 );
} );

QUnit.test( "transfer() with callback", function( assert ) {
	var ready = assert.async();
	assert.expect( 1 );
	$( "#elem" ).transfer( {
		to: ".animateClass",
		duration: 1
	}, function() {
		assert.ok( true, "callback invoked" );
		ready();
	} );
} );

$.each( $.effects.effect, function( effect ) {
	QUnit.module( "effects." + effect );

	if ( effect === "transfer" ) {
		return;
	}
	QUnit.test( "show/hide", function( assert ) {
		var ready = assert.async();
		assert.expect( 12 );
		var hidden = $( "div.hidden" ),
			count = 0,
			test = 0;

		function queueTest( fn ) {
			count++;
			var point = count;
			return function( next ) {
				test++;
				assert.equal( point, test, "Queue function fired in order" );
				if ( fn ) {
					fn();
				} else {
					setTimeout( next, minDuration );
				}
			};
		}

		function duringTest( fn ) {
			return function( next ) {
				setTimeout( fn, minDuration / 2 );
				next();
			};
		}

		hidden
			.queue( queueTest() )
			.queue( duringTest( function() {
				assert.ok( hidden.is( ":animated" ),
					"Hidden is seen as animated during .show(\"" + effect + "\", time)" );
			} ) )
			.show( effect, minDuration, queueTest( function() {
				assert.equal( hidden.css( "display" ), "block",
					"Hidden is shown after .show(\"" + effect + "\", time)" );
				assert.ok( !$( ".ui-effects-placeholder" ).length,
					"No placeholder remains after .show(\"" + effect + "\", time)" );
			} ) )
			.queue( queueTest() )
			.queue( duringTest( function() {
				assert.ok( hidden.is( ":animated" ),
					"Hidden is seen as animated during .hide(\"" + effect + "\", time)" );
			} ) )
			.hide( effect, minDuration, queueTest( function() {
				assert.equal( hidden.css( "display" ), "none",
					"Back to hidden after .hide(\"" + effect + "\", time)" );
				assert.ok( !$( ".ui-effects-placeholder" ).length,
					"No placeholder remains after .hide(\"" + effect + "\", time)" );
			} ) )
			.queue( queueTest( function() {
				assert.deepEqual( hidden.queue(), [ "inprogress" ], "Only the inprogress sentinel remains" );
				ready();
			} ) );
	} );

	QUnit.test( "relative width & height - properties are preserved", function( assert ) {
		var ready = assert.async();
		var test = $( "div.relWidth.relHeight" ),
			width = test.width(), height = test.height(),
			cssWidth = test[ 0 ].style.width, cssHeight = test[ 0 ].style.height;

		assert.expect( 4 );
		test.toggle( effect, minDuration, function() {
			assert.equal( test[ 0 ].style.width, cssWidth, "Inline CSS Width has been reset after animation ended" );
			assert.equal( test[ 0 ].style.height, cssHeight, "Inline CSS Height has been rest after animation ended" );
			ready();
		} );
		assert.ok( Math.abs( test.width() - width ) / width < 0.05,
			"Width is close to the value when animation started" );
		assert.ok( Math.abs( test.height() - height ) / height < 0.05,
			"Height is close to the value when animation started" );
	} );
} );

} );
