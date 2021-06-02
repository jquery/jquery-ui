define( [
	"qunit",
	"jquery",
	"lib/common",
	"lib/helper",
	"ui/position"
], function( QUnit, $, common, helper ) {
"use strict";

var win = $( window ),
	scrollTopSupport = function() {
		var support = win.scrollTop( 1 ).scrollTop() === 1;
		win.scrollTop( 0 );
		scrollTopSupport = function() {
			return support;
		};
		return support;
	};

QUnit.module( "position", {
	beforeEach: function() {
		win.scrollTop( 0 ).scrollLeft( 0 );
	},
	afterEach: helper.moduleAfterEach
} );

QUnit.test( "my, at, of", function( assert ) {
	assert.expect( 4 );

	$( "#elx" ).position( {
		my: "left top",
		at: "left top",
		of: "#parentx",
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 40, left: 40 }, "left top, left top" );

	$( "#elx" ).position( {
		my: "left top",
		at: "left bottom",
		of: "#parentx",
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 60, left: 40 }, "left top, left bottom" );

	$( "#elx" ).position( {
		my: "left",
		at: "bottom",
		of: "#parentx",
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 55, left: 50 }, "left, bottom" );

	$( "#elx" ).position( {
		my: "left foo",
		at: "bar baz",
		of: "#parentx",
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 45, left: 50 }, "left foo, bar baz" );
} );

QUnit.test( "multiple elements", function( assert ) {
	assert.expect( 3 );

	var elements = $( "#el1, #el2" ),
		result = elements.position( {
			my: "left top",
			at: "left bottom",
			of: "#parent",
			collision: "none"
		} ),
		expected = { top: 10, left: 4 };

	assert.deepEqual( result, elements );
	elements.each( function() {
		assert.deepEqual( $( this ).offset(), expected );
	} );
} );

QUnit.test( "positions", function( assert ) {
	assert.expect( 18 );

	var offsets = {
			left: 0,
			center: 3,
			right: 6,
			top: 0,
			bottom: 6
		},
		start = { left: 4, top: 4 },
		el = $( "#el1" );

	$.each( [ 0, 1 ], function( my ) {
		$.each( [ "top", "center", "bottom" ], function( vindex, vertical ) {
			$.each( [ "left", "center", "right" ], function( hindex, horizontal ) {
				var _my = my ? horizontal + " " + vertical : "left top",
					_at = !my ? horizontal + " " + vertical : "left top";
				el.position( {
					my: _my,
					at: _at,
					of: "#parent",
					collision: "none"
				} );
				assert.deepEqual( el.offset(), {
					top: start.top + offsets[ vertical ] * ( my ? -1 : 1 ),
					left: start.left + offsets[ horizontal ] * ( my ? -1 : 1 )
				}, "Position via " + QUnit.jsDump.parse( { my: _my, at: _at } ) );
			} );
		} );
	} );
} );

QUnit.test( "of", function( assert ) {
	assert.expect( 10 + ( scrollTopSupport() ? 1 : 0 ) );

	var done = assert.async();

	var event;

	$( "#elx" ).position( {
		my: "left top",
		at: "left top",
		of: "#parentx",
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 40, left: 40 }, "selector" );

	$( "#elx" ).position( {
		my: "left top",
		at: "left bottom",
		of: $( "#parentx" ),
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 60, left: 40 }, "jQuery object" );

	$( "#elx" ).position( {
		my: "left top",
		at: "left top",
		of: $( "#parentx" )[ 0 ],
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 40, left: 40 }, "DOM element" );

	$( "#elx" ).position( {
		my: "right bottom",
		at: "right bottom",
		of: document,
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), {
		top: $( document ).height() - 10,
		left: $( document ).width() - 10
	}, "document" );

	$( "#elx" ).position( {
		my: "right bottom",
		at: "right bottom",
		of: $( document ),
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), {
		top: $( document ).height() - 10,
		left: $( document ).width() - 10
	}, "document as jQuery object" );

	win.scrollTop( 0 );

	$( "#elx" ).position( {
		my: "right bottom",
		at: "right bottom",
		of: window,
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), {
		top: win.height() - 10,
		left: win.width() - 10
	}, "window" );

	$( "#elx" ).position( {
		my: "right bottom",
		at: "right bottom",
		of: win,
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), {
		top: win.height() - 10,
		left: win.width() - 10
	}, "window as jQuery object" );

	if ( scrollTopSupport() ) {
		win.scrollTop( 500 ).scrollLeft( 200 );
		$( "#elx" ).position( {
			my: "right bottom",
			at: "right bottom",
			of: window,
			collision: "none"
		} );
		assert.deepEqual( $( "#elx" ).offset(), {
			top: win.height() + 500 - 10,
			left: win.width() + 200 - 10
		}, "window, scrolled" );
		win.scrollTop( 0 ).scrollLeft( 0 );
	}

	event = $.extend( $.Event( "someEvent" ), { pageX: 200, pageY: 300 } );
	$( "#elx" ).position( {
		my: "left top",
		at: "left top",
		of: event,
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), {
		top: 300,
		left: 200
	}, "event - left top, left top" );

	event = $.extend( $.Event( "someEvent" ), { pageX: 400, pageY: 600 } );
	$( "#elx" ).position( {
		my: "left top",
		at: "right bottom",
		of: event,
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), {
		top: 600,
		left: 400
	}, "event - left top, right bottom" );

	try {
		$( "#elx" ).position( {
			my: "left top",
			at: "right bottom",
			of: "<img onerror='window.globalOf=true' src='/404' />",
			collision: "none"
		} );
	} catch ( e ) {}

	setTimeout( function() {
		assert.equal( window.globalOf, undefined, "of treated as a selector" );
		delete window.globalOf;
		done();
	}, 500 );
} );

QUnit.test( "offsets", function( assert ) {
	assert.expect( 9 );

	var offset;

	$( "#elx" ).position( {
		my: "left top",
		at: "left+10 bottom+10",
		of: "#parentx",
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 70, left: 50 }, "offsets in at" );

	$( "#elx" ).position( {
		my: "left+10 top-10",
		at: "left bottom",
		of: "#parentx",
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 50, left: 50 }, "offsets in my" );

	$( "#elx" ).position( {
		my: "left top",
		at: "left+50% bottom-10%",
		of: "#parentx",
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 58, left: 50 }, "percentage offsets in at" );

	$( "#elx" ).position( {
		my: "left-30% top+50%",
		at: "left bottom",
		of: "#parentx",
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 65, left: 37 }, "percentage offsets in my" );

	$( "#elx" ).position( {
		my: "left-30.001% top+50.0%",
		at: "left bottom",
		of: "#parentx",
		collision: "none"
	} );
	offset = $( "#elx" ).offset();
	assert.equal( Math.round( offset.top ), 65, "decimal percentage offsets in my" );
	assert.equal( Math.round( offset.left ), 37, "decimal percentage offsets in my" );

	$( "#elx" ).position( {
		my: "left+10.4 top-10.6",
		at: "left bottom",
		of: "#parentx",
		collision: "none"
	} );
	offset = $( "#elx" ).offset();
	assert.equal( Math.round( offset.top ), 49, "decimal offsets in my" );
	assert.equal( Math.round( offset.left ), 50, "decimal offsets in my" );

	$( "#elx" ).position( {
		my: "left+right top-left",
		at: "left-top bottom-bottom",
		of: "#parentx",
		collision: "none"
	} );
	assert.deepEqual( $( "#elx" ).offset(), { top: 60, left: 40 }, "invalid offsets" );
} );

QUnit.test( "using", function( assert ) {
	assert.expect( 10 );

	var count = 0,
		elems = $( "#el1, #el2" ),
		of = $( "#parentx" ),
		expectedPosition = { top: 60, left: 60 },
		expectedFeedback = {
			target: {
				element: of,
				width: 20,
				height: 20,
				left: 40,
				top: 40
			},
			element: {
				width: 6,
				height: 6,
				left: 60,
				top: 60
			},
			horizontal: "left",
			vertical: "top",
			important: "vertical"
		},
		originalPosition = elems.position( {
			my: "right bottom",
			at: "rigt bottom",
			of: "#parentx",
			collision: "none"
		} ).offset();

	elems.position( {
		my: "left top",
		at: "center+10 bottom",
		of: "#parentx",
		using: function( position, feedback ) {
			assert.deepEqual( this, elems[ count ], "correct context for call #" + count );
			assert.deepEqual( position, expectedPosition, "correct position for call #" + count );
			assert.deepEqual( feedback.element.element[ 0 ], elems[ count ] );
			delete feedback.element.element;
			delete feedback.target.element.prevObject;
			assert.deepEqual( feedback, expectedFeedback );
			count++;
		}
	} );

	elems.each( function() {
		assert.deepEqual( $( this ).offset(), originalPosition, "elements not moved" );
	} );
} );

function collisionTest( assert, config, result, msg ) {
	var elem = $( "#elx" ).position( $.extend( {
		my: "left top",
		at: "right bottom",
		of: "#parent"
	}, config ) );
	assert.deepEqual( elem.offset(), result, msg );
}

function collisionTest2( assert, config, result, msg ) {
	collisionTest( assert, $.extend( {
		my: "right bottom",
		at: "left top"
	}, config ), result, msg );
}

QUnit.test( "collision: fit, no collision", function( assert ) {
	assert.expect( 2 );

	collisionTest( assert, {
		collision: "fit"
	}, {
		top: 10,
		left: 10
	}, "no offset" );

	collisionTest( assert, {
		collision: "fit",
		at: "right+2 bottom+3"
	}, {
		top: 13,
		left: 12
	}, "with offset" );
} );

// Currently failing in IE8 due to the iframe used by TestSwarm
if ( !/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() ) ) {
QUnit.test( "collision: fit, collision", function( assert ) {
	assert.expect( 2 + ( scrollTopSupport() ? 1 : 0 ) );

	collisionTest2( assert, {
		collision: "fit"
	}, {
		top: 0,
		left: 0
	}, "no offset" );

	collisionTest2( assert, {
		collision: "fit",
		at: "left+2 top+3"
	}, {
		top: 0,
		left: 0
	}, "with offset" );

	if ( scrollTopSupport() ) {
		win.scrollTop( 300 ).scrollLeft( 200 );
		collisionTest( assert, {
			collision: "fit"
		}, {
			top: 300,
			left: 200
		}, "window scrolled" );

		win.scrollTop( 0 ).scrollLeft( 0 );
	}
} );
}

QUnit.test( "collision: flip, no collision", function( assert ) {
	assert.expect( 2 );

	collisionTest( assert, {
		collision: "flip"
	}, {
		top: 10,
		left: 10
	}, "no offset" );

	collisionTest( assert, {
		collision: "flip",
		at: "right+2 bottom+3"
	}, {
		top: 13,
		left: 12
	}, "with offset" );
} );

QUnit.test( "collision: flip, collision", function( assert ) {
	assert.expect( 2 );

	collisionTest2( assert, {
		collision: "flip"
	}, {
		top: 10,
		left: 10
	}, "no offset" );

	collisionTest2( assert, {
		collision: "flip",
		at: "left+2 top+3"
	}, {
		top: 7,
		left: 8
	}, "with offset" );
} );

QUnit.test( "collision: flipfit, no collision", function( assert ) {
	assert.expect( 2 );

	collisionTest( assert, {
		collision: "flipfit"
	}, {
		top: 10,
		left: 10
	}, "no offset" );

	collisionTest( assert, {
		collision: "flipfit",
		at: "right+2 bottom+3"
	}, {
		top: 13,
		left: 12
	}, "with offset" );
} );

QUnit.test( "collision: flipfit, collision", function( assert ) {
	assert.expect( 2 );

	collisionTest2( assert, {
		collision: "flipfit"
	}, {
		top: 10,
		left: 10
	}, "no offset" );

	collisionTest2( assert, {
		collision: "flipfit",
		at: "left+2 top+3"
	}, {
		top: 7,
		left: 8
	}, "with offset" );
} );

QUnit.test( "collision: none, no collision", function( assert ) {
	assert.expect( 2 );

	collisionTest( assert, {
		collision: "none"
	}, {
		top: 10,
		left: 10
	}, "no offset" );

	collisionTest( assert, {
		collision: "none",
		at: "right+2 bottom+3"
	}, {
		top: 13,
		left: 12
	}, "with offset" );
} );

QUnit.test( "collision: none, collision", function( assert ) {
	assert.expect( 2 );

	collisionTest2( assert, {
		collision: "none"
	}, {
		top: -6,
		left: -6
	}, "no offset" );

	collisionTest2( assert, {
		collision: "none",
		at: "left+2 top+3"
	}, {
		top: -3,
		left: -4
	}, "with offset" );
} );

QUnit.test( "collision: fit, with margin", function( assert ) {
	assert.expect( 2 );

	$( "#elx" ).css( {
		marginTop: 6,
		marginLeft: 4
	} );

	collisionTest( assert, {
		collision: "fit"
	}, {
		top: 10,
		left: 10
	}, "right bottom" );

	collisionTest2( assert, {
		collision: "fit"
	}, {
		top: 6,
		left: 4
	}, "left top" );
} );

QUnit.test( "collision: flip, with margin", function( assert ) {
	assert.expect( 3 );

	$( "#elx" ).css( {
		marginTop: 6,
		marginLeft: 4
	} );

	collisionTest( assert, {
		collision: "flip"
	}, {
		top: 10,
		left: 10
	}, "left top" );

	collisionTest2( assert, {
		collision: "flip"
	}, {
		top: 10,
		left: 10
	}, "right bottom" );

	collisionTest2( assert, {
		collision: "flip",
		my: "left top"
	}, {
		top: 0,
		left: 4
	}, "right bottom" );
} );

QUnit.test( "within", function( assert ) {
	assert.expect( 7 );

	collisionTest( assert, {
		within: document
	}, {
		top: 10,
		left: 10
	}, "within document" );

	collisionTest( assert, {
		within: "#within",
		collision: "fit"
	}, {
		top: 4,
		left: 2
	}, "fit - right bottom" );

	collisionTest2( assert, {
		within: "#within",
		collision: "fit"
	}, {
		top: 2,
		left: 0
	}, "fit - left top" );

	collisionTest( assert, {
		within: "#within",
		collision: "flip"
	}, {
		top: 10,
		left: -6
	}, "flip - right bottom" );

	collisionTest2( assert, {
		within: "#within",
		collision: "flip"
	}, {
		top: 10,
		left: -6
	}, "flip - left top" );

	collisionTest( assert, {
		within: "#within",
		collision: "flipfit"
	}, {
		top: 4,
		left: 0
	}, "flipfit - right bottom" );

	collisionTest2( assert, {
		within: "#within",
		collision: "flipfit"
	}, {
		top: 4,
		left: 0
	}, "flipfit - left top" );
} );

// jQuery 3.2 incorrectly handle scrollbars in WebKit/Blink-based browsers.
// This is fixed in version 3.3, see https://github.com/jquery/jquery/issues/3589.
// As the data here comes from jQuery directly and the changes to fix it
// are non-trivial: https://github.com/jquery/jquery/pull/3656, just accept
// that scrollbar data in this jQuery version is inaccurate.
QUnit[ jQuery.fn.jquery.substring( 0, 4 ) === "3.2." ? "skip" : "test" ](
	"with scrollbars", function( assert ) {
	assert.expect( 4 );

	$( "#scrollx" ).css( {
		width: 100,
		height: 100,
		left: 0,
		top: 0
	} );

	collisionTest( assert, {
		of: "#scrollx",
		collision: "fit",
		within: "#scrollx"
	}, {
		top: 90,
		left: 90
	}, "visible" );

	$( "#scrollx" ).css( {
		overflow: "scroll"
	} );

	var scrollbarInfo = $.position.getScrollInfo( $.position.getWithinInfo( $( "#scrollx" ) ) );

	collisionTest( assert, {
		of: "#scrollx",
		collision: "fit",
		within: "#scrollx"
	}, {
		top: 90 - scrollbarInfo.height,
		left: 90 - scrollbarInfo.width
	}, "scroll" );

	$( "#scrollx" ).css( {
		overflow: "auto"
	} );

	collisionTest( assert, {
		of: "#scrollx",
		collision: "fit",
		within: "#scrollx"
	}, {
		top: 90,
		left: 90
	}, "auto, no scroll" );

	$( "#scrollx" ).css( {
		overflow: "auto"
	} ).append( $( "<div>" ).height( 300 ).width( 300 ) );

	collisionTest( assert, {
		of: "#scrollx",
		collision: "fit",
		within: "#scrollx"
	}, {
		top: 90 - scrollbarInfo.height,
		left: 90 - scrollbarInfo.width
	}, "auto, with scroll" );
} );

QUnit.test( "fractions", function( assert ) {
	assert.expect( 1 );

	$( "#fractions-element" ).position( {
		my: "left top",
		at: "left top",
		of: "#fractions-parent",
		collision: "none"
	} );
	assert.deepEqual( $( "#fractions-element" ).offset(), $( "#fractions-parent" ).offset(), "left top, left top" );
} );

QUnit.test( "bug #5280: consistent results (avoid fractional values)", function( assert ) {
	assert.expect( 1 );

	var wrapper = $( "#bug-5280" ),
		elem = wrapper.children(),
		offset1 = elem.position( {
			my: "center",
			at: "center",
			of: wrapper,
			collision: "none"
		} ).offset(),
		offset2 = elem.position( {
			my: "center",
			at: "center",
			of: wrapper,
			collision: "none"
		} ).offset();
	assert.deepEqual( offset1, offset2 );
} );

QUnit.test( "bug #8710: flip if flipped position fits more", function( assert ) {
	assert.expect( 3 );

	// Positions a 10px tall element within 99px height at top 90px.
	collisionTest( assert, {
		within: "#bug-8710-within-smaller",
		of: "#parentx",
		collision: "flip",
		at: "right bottom+30"
	}, {
		top: 0,
		left: 60
	}, "flip - top fits all" );

	// Positions a 10px tall element within 99px height at top 92px.
	collisionTest( assert, {
		within: "#bug-8710-within-smaller",
		of: "#parentx",
		collision: "flip",
		at: "right bottom+32"
	}, {
		top: -2,
		left: 60
	}, "flip - top fits more" );

	// Positions a 10px tall element within 101px height at top 92px.
	collisionTest( assert, {
		within: "#bug-8710-within-bigger",
		of: "#parentx",
		collision: "flip",
		at: "right bottom+32"
	}, {
		top: 92,
		left: 60
	}, "no flip - top fits less" );
} );

} );
