define( [
	"jquery",
	"lib/common",
	"ui/effect",
	"ui/effect-blind",
	"ui/effect-bounce",
	"ui/effect-clip",
	"ui/effect-drop",
	"ui/effect-explode",
	"ui/effect-fade",
	"ui/effect-fold",
	"ui/effect-highlight",
	"ui/effect-puff",
	"ui/effect-pulsate",
	"ui/effect-scale",
	"ui/effect-shake",
	"ui/effect-size",
	"ui/effect-slide",
	"ui/effect-transfer"
], function( $, common ) {

function present( value, array, message ) {
	QUnit.push( jQuery.inArray( value, array ) !== -1, value, array, message );
}

function notPresent( value, array, message ) {
	QUnit.push( jQuery.inArray( value, array ) === -1, value, array, message );
}

// minDuration is used for "short" animate tests where we are only concerned about the final
var minDuration = 15,

	// duration is used for "long" animates where we plan on testing properties during animation
	duration = 200;

module( "effects.core" );

// TODO: test all signatures of .show(), .hide(), .toggle().
// Look at core's signatures and UI's signatures.
asyncTest( ".hide() with step", function() {
	expect( 1 );
	var element = $( "#elem" ),
		step = function() {
			ok( true, "step callback invoked" );
			step = $.noop;
		};

	element.hide({
		step: function() {
			step();
		},
		complete: start
	});
});

test( "Immediate Return Conditions", function() {
	var hidden = $( "div.hidden" ),
		count = 0;
	expect( 3 );
	hidden.hide( "blind", function() {
		equal( ++count, 1, "Hide on hidden returned immediately" );
	}).show().show( "blind", function() {
		equal( ++count, 2, "Show on shown returned immediately" );
	});
	equal( ++count, 3, "Both Functions worked properly" );
});

test( ".hide() with hidden parent", function() {
	expect( 1 );
	var element = $( "div.hidden" ).children();
	element.hide( "blind", function() {
		equal( element.css( "display" ), "none", "display: none" );
	});
});

asyncTest( "Parse of null for options", function() {
	var hidden = $( "div.hidden" ),
		count = 0;
	expect( 1 );
	hidden.show( "blind", null, 1, function() {
		equal( ++count, 1, "null for options still works" );
		start();
	});
});

test( "removeClass", function() {
	expect( 3 );

	var element = $( "<div>" );
	equal( "", element[ 0 ].className );
	element.addClass( "destroyed" );
	equal( "destroyed", element[ 0 ].className );
	element.removeClass();
	equal( "", element[ 0 ].className );
});

module( "effects.core: animateClass" );

asyncTest( "animateClass works with borderStyle", function() {
	var test = $("div.animateClass");
	expect(3);
	test.toggleClass("testAddBorder", minDuration, function() {
		test.toggleClass("testAddBorder", minDuration, function() {
			equal( test.css("borderLeftStyle"), "none", "None border set" );
			start();
		});
		equal( test.css("borderLeftStyle"), "solid", "None border not immedately set" );
	});
	equal( test.css("borderLeftStyle"), "solid", "Solid border immedately set" );
});

asyncTest( "animateClass works with colors", function() {
	var test = $("div.animateClass"),
		oldStep = jQuery.fx.step.backgroundColor;

	expect(2);

	// we want to catch the first frame of animation
	jQuery.fx.step.backgroundColor = function( fx ) {
		oldStep.apply( this, arguments );

		// make sure it has animated somewhere we can detect
		if ( fx.pos > 255 / 2000 ) {
			jQuery.fx.step.backgroundColor = oldStep;
			notPresent( test.css("backgroundColor"),
				[ "#000000", "#ffffff", "#000", "#fff", "rgb(0, 0, 0)", "rgb(255,255,255)" ],
				"Color is not endpoints in middle." );
			test.stop( true, true );
		}
	};

	test.toggleClass("testChangeBackground", {
		duration: 2000,
		complete: function() {
			present( test.css("backgroundColor"), [ "#ffffff", "#fff", "rgb(255, 255, 255)" ], "Color is final" );
			start();
		}
	});
});

asyncTest( "animateClass calls step option", 1, function() {
	var test = jQuery( "div.animateClass" ),
		step = function() {
			ok( true, "Step Function Called" );
			test.stop();
			start();
			step = $.noop;
		};
	test.toggleClass( "testChangeBackground", {
		step: function() {
			step();
		}
	});
});

asyncTest( "animateClass works with children", 3, function() {
	var animatedChild,
		test = $("div.animateClass"),
		h2 = test.find("h2");

	test.toggleClass("testChildren", {
		children: true,
		duration: duration,
		complete: function() {
			equal( h2.css("fontSize"), "20px", "Text size is final during complete");
			test.toggleClass("testChildren", {
				duration: duration,
				complete: function() {
					equal( h2.css("fontSize"), "10px", "Text size revertted after class removed");

					start();
				},
				step: function( val, fx ) {
					if ( fx.elem === h2[ 0 ] ) {
						ok( false, "Error - Animating property on h2" );
					}
				}
			});
		},
		step: function( val, fx ) {
			if ( fx.prop === "fontSize" && fx.elem === h2[ 0 ] && !animatedChild ) {
				equal( fx.end, 20, "animating font size on child" );
				animatedChild = true;
			}
		}
	});
});

asyncTest( "animateClass clears style properties when stopped", function() {
	var test = $("div.animateClass"),
		style = test[0].style,
		orig = style.cssText;

	expect( 2 );

	test.addClass( "testChangeBackground", duration );
	notEqual( orig, style.cssText, "cssText is not the same after starting animation" );

	test.stop( true, true );
	equal( orig, $.trim( style.cssText ), "cssText is the same after stopping animation midway" );
	start();
});

asyncTest( "animateClass: css and class changes during animation are not lost (#7106)",
function( assert ) {
	expect( 2 );
	var test = $( "div.ticket7106" );

	// ensure the class stays and that the css property stays
	function animationComplete() {
		assert.hasClasses( test, "testClass", "class change during animateClass was not lost" );
		equal( test.height(), 100, "css change during animateClass was not lost" );
		start();
	}

	// add a class and change a style property after starting an animated class
	test.addClass( "animate", minDuration, animationComplete )
		.addClass( "testClass" )
		.height( 100 );
});

test( "createPlaceholder: only created for static or relative elements", function() {
	expect( 4 );

	ok( $.effects.createPlaceholder( $( ".relative" ) ).length, "placeholder created for relative element" );
	ok( $.effects.createPlaceholder( $( ".static" ) ).length, "placeholder created for static element" );
	ok( !$.effects.createPlaceholder( $( ".absolute" ) ), "placeholder not created for absolute element" );
	ok( !$.effects.createPlaceholder( $( ".fixed" ) ), "placeholder not created for fixed element" );
});

test( "createPlaceholder: preserves layout affecting properties", function() {
	expect( 7 );

	var position = 5,
		element = $( ".relative" ).css({
			top: position,
			left: position
		}),
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
	deepEqual( before.offset.top - position, placeholder.offset().top, "offset top preserved" );
	deepEqual( before.offset.left - position, placeholder.offset().left, "offset left preserved" );
	deepEqual( before.position.top - position, placeholder.position().top, "position top preserved" );
	deepEqual( before.position.left - position, placeholder.position().left, "position left preserved" );

	deepEqual( before[ "float" ], placeholder.css( "float" ), "float preserved" );
	deepEqual( before.outerWidth, placeholder.outerWidth( true ), "width preserved" );
	deepEqual( before.outerHeight, placeholder.outerHeight( true ), "height preserved" );
});

module( "transfer" );

asyncTest( "transfer() without callback", function() {
	expect( 0 );

	// Verify that the effect works without a callback
	$( "#elem" ).transfer( {
		to: ".animateClass",
		duration: 1
	} );
	setTimeout( function() {
		start();
	}, 25 );
} );

asyncTest( "transfer() with callback", function() {
	expect( 1 );
	$( "#elem" ).transfer( {
		to: ".animateClass",
		duration: 1
	}, function() {
		ok( true, "callback invoked" );
		start();
	} );
} );

$.each( $.effects.effect, function( effect ) {
	module( "effects." + effect );

	common.testJshint( "effect-" + effect );

	if ( effect === "transfer" ) {
		return;
	}
	asyncTest( "show/hide", function() {
		expect( 12 );
		var hidden = $( "div.hidden" ),
			count = 0,
			test = 0;

		function queueTest( fn ) {
			count++;
			var point = count;
			return function( next ) {
				test++;
				equal( point, test, "Queue function fired in order" );
				if ( fn ) {
					fn();
				} else {
					setTimeout( next, minDuration );
				}
			};
		}

		function duringTest( fn ) {
			return function( next ) {
				setTimeout( fn );
				next();
			};
		}

		hidden
			.queue( queueTest() )
			.queue( duringTest(function() {
				ok( hidden.is( ":animated" ),
					"Hidden is seen as animated during .show(\"" + effect + "\", time)" );
			}) )
			.show( effect, minDuration, queueTest(function() {
				equal( hidden.css( "display" ), "block",
					"Hidden is shown after .show(\"" + effect + "\", time)" );
				ok( !$( ".ui-effects-placeholder" ).length,
					"No placeholder remains after .show(\"" + effect + "\", time)" );
			}) )
			.queue( queueTest() )
			.queue( duringTest(function() {
				ok( hidden.is( ":animated" ),
					"Hidden is seen as animated during .hide(\"" + effect + "\", time)" );
			}) )
			.hide( effect, minDuration, queueTest(function() {
				equal( hidden.css( "display" ), "none",
					"Back to hidden after .hide(\"" + effect + "\", time)" );
				ok( !$( ".ui-effects-placeholder" ).length,
					"No placeholder remains after .hide(\"" + effect + "\", time)" );
			}) )
			.queue( queueTest(function() {
				deepEqual( hidden.queue(), [ "inprogress" ], "Only the inprogress sentinel remains" );
				start();
			}) );
	});

	asyncTest( "relative width & height - properties are preserved", function() {
		var test = $("div.relWidth.relHeight"),
			width = test.width(), height = test.height(),
			cssWidth = test[0].style.width, cssHeight = test[0].style.height;

		expect( 4 );
		test.toggle( effect, minDuration, function() {
			equal( test[0].style.width, cssWidth, "Inline CSS Width has been reset after animation ended" );
			equal( test[0].style.height, cssHeight, "Inline CSS Height has been rest after animation ended" );
			start();
		});
		equal( test.width(), width, "Width is the same px after animation started" );
		equal( test.height(), height, "Height is the same px after animation started" );
	});
});

} );
