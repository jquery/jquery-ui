(function( $ ) {

function scrollTopSupport() {
	$( window ).scrollTop( 1 );
	return $( window ).scrollTop() === 1;
}

module( "position" );

test( "my, at, of", function() {
	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: "#parentx",
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 40, left: 40 }, "left top, left top" );

	$( "#elx" ).position({
		my: "left top",
		at: "left bottom",
		of: "#parentx",
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 60, left: 40 }, "left top, left bottom" );

	$( "#elx" ).position({
		my: "left",
		at: "bottom",
		of: "#parentx",
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 55, left: 50 }, "left, bottom" );

	$( "#elx" ).position({
		my: "left foo",
		at: "bar baz",
		of: "#parentx",
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 45, left: 50 }, "left foo, bar baz" );
});

test( "multiple elements", function() {
	var elements = $( "#el1, #el2" );
	var result = elements.position({
		my: "left top",
		at: "left bottom",
		of: "#parent",
		collision: "none"
	});

	same( result, elements );
	var expected = { top: 10, left: 4 };
	elements.each(function() {
		same( $( this ).offset(), expected );
	});
});

test( "positions", function() {
	var definitions = [];
	var offsets = {
		left: 0,
		center: 3,
		right: 6,
		top: 0,
		bottom: 6
	};
	var start = { left: 4, top: 4 };
	$.each( [ 0, 1 ], function( my ) {
		$.each( [ "top", "center", "bottom" ], function( vindex, vertical ) {
			$.each( [ "left", "center", "right" ], function( hindex, horizontal ) {
				definitions.push({
					my: my ? horizontal + " " + vertical : "left top",
					at: !my ? horizontal + " " + vertical : "left top",
					result: {
						top: my ? start.top - offsets[ vertical ] : start.top + offsets[ vertical ],
						left: my ? start.left - offsets[ horizontal ] : start.left + offsets[ horizontal ]
					}
				});
			});
		});
	});
	var el = $( "#el1" );
	$.each( definitions, function( index, definition ) {
		el.position({
			my: definition.my,
			at: definition.at,
			of: "#parent",
			collision: "none"
		});
		same( el.offset(), definition.result,
			"Position via " + QUnit.jsDump.parse({ my:definition.my, at:definition.at }) );
	});
});

test( "of", function() {
	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: "#parentx",
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 40, left: 40 }, "selector" );

	$( "#elx" ).position({
		my: "left top",
		at: "left bottom",
		of: $( "#parentx"),
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 60, left: 40 }, "jQuery object" );

	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: $( "#parentx" )[ 0 ],
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 40, left: 40 }, "DOM element" );

	$( "#elx" ).position({
		my: "right bottom",
		at: "right bottom",
		of: document,
		collision: "none"
	});
	same( $( "#elx" ).offset(), {
		top: $( document ).height() - 10,
		left: $( document ).width() - 10
	}, "document" );

	$( "#elx" ).position({
		my: "right bottom",
		at: "right bottom",
		of: $( document ),
		collision: "none"
	});
	same( $( "#elx" ).offset(), {
		top: $( document ).height() - 10,
		left: $( document ).width() - 10
	}, "document as jQuery object" );

	$( window ).scrollTop( 0 );

	$( "#elx" ).position({
		my: "right bottom",
		at: "right bottom",
		of: window,
		collision: "none"
	});
	same( $( "#elx" ).offset(), {
		top: $( window ).height() - 10,
		left: $( window ).width() - 10
	}, "window" );

	$( "#elx" ).position({
		my: "right bottom",
		at: "right bottom",
		of: $( window ),
		collision: "none"
	});
	same( $( "#elx" ).offset(), {
		top: $( window ).height() - 10,
		left: $( window ).width() - 10
	}, "window as jQuery object" );

	if ( scrollTopSupport() ) {
		$( window ).scrollTop( 500 ).scrollLeft( 200 );
		$( "#elx" ).position({
			my: "right bottom",
			at: "right bottom",
			of: window,
			collision: "none"
		});
		same( $( "#elx" ).offset(), {
			top: $( window ).height() + 500 - 10,
			left: $( window ).width() + 200 - 10
		}, "window, scrolled" );
		$( window ).scrollTop( 0 ).scrollLeft( 0 );
	}

	var event = $.extend( $.Event( "someEvent" ), { pageX: 200, pageY: 300 } );
	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: event,
		collision: "none"
	});
	same( $( "#elx" ).offset(), {
		top: 300,
		left: 200
	}, "event - left top, left top" );

	event = $.extend( $.Event( "someEvent" ), { pageX: 400, pageY: 600 } );
	$( "#elx" ).position({
		my: "left top",
		at: "right bottom",
		of: event,
		collision: "none"
	});
	same( $( "#elx" ).offset(), {
		top: 600,
		left: 400
	}, "event - left top, right bottom" );
});

test( "offsets", function() {
	$( "#elx" ).position({
		my: "left top",
		at: "left+10 bottom+10",
		of: "#parentx",
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 70, left: 50 }, "offsets in at" );

	$( "#elx" ).position({
		my: "left+10 top-10",
		at: "left bottom",
		of: "#parentx",
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 50, left: 50 }, "offsets in my" );

	$( "#elx" ).position({
		my: "left top",
		at: "left+50% bottom-10%",
		of: "#parentx",
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 58, left: 50 }, "percentage offsets in at" );

	$( "#elx" ).position({
		my: "left-30% top+50%",
		at: "left bottom",
		of: "#parentx",
		collision: "none"
	});
	same( $( "#elx" ).offset(), { top: 65, left: 37 }, "percentage offsets in my" );
});

test( "using", function() {
	expect( 6 );

	var count = 0,
		elems = $( "#el1, #el2" ),
		expectedPosition = { top: 40, left: 40 },
		originalPosition = elems.position({
			my: "right bottom",
			at: "rigt bottom",
			of: "#parentx",
			collision: "none"
		}).offset();

	elems.position({
		my: "left top",
		at: "left top",
		of: "#parentx",
		using: function( position ) {
			same( this, elems[ count ], "correct context for call #" + count );
			same( position, expectedPosition, "correct position for call #" + count );
			count++;
		}
	});

	elems.each(function() {
		same( $( this ).offset(), originalPosition, "elements not moved" );
	});
});

function collisionTest( config, result, msg ) {
	var elem = $( "#elx" ).position( $.extend({
		my: "left top",
		at: "right bottom",
		of: window
	}, config ) );
	same( elem.offset(), result, msg );
}

function collisionTest2( config, result, msg ) {
	collisionTest( $.extend({
		my: "right bottom",
		at: "left top"
	}, config ), result, msg );
}

test( "collision: fit, no offset", function() {
	collisionTest({
		collision: "fit"
	}, { top: $( window ).height() - 10, left: $( window ).width() - 10 }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: 0, left: 0 }, "left top" );
});

test( "collision: fit, with offset", function() {
	collisionTest({
		collision: "fit",
		at: "right+2 bottom+3"
	}, { top: $(window).height() - 10, left: $(window).width() - 10 }, "right bottom");

	collisionTest2({
		collision: "fit",
		at: "left+2 top+3"
	}, { top: 0, left: 0 }, "left top, positive offset" );

	collisionTest2({
		collision: "fit",
		at: "left-2 top-3"
	}, { top: 0, left: 0 }, "left top, negative offset" );
});

test( "collision: fit, window scrolled", function() {
	if ( scrollTopSupport() ) {
		var win = $( window );
		win.scrollTop( 300 ).scrollLeft( 200 );

		collisionTest({
			collision: "fit",
			at: "left-100 top-100"
		}, { top: 300, left: 200 }, "top left" );
		collisionTest2({
			collision: "fit",
			at: "right+100 bottom+100"
		}, { top: 300 + win.height() - 10, left: 200 + win.width() - 10 }, "right bottom" );

		win.scrollTop( 0 ).scrollLeft( 0 );
	}
});

test( "collision: flip, no offset", function() {
	collisionTest({
		collision: "flip"
	}, { top: $( window ).height(), left: $( window ).width() }, "left top" );

	collisionTest2({
		collision: "flip"
	}, { top: -10, left: -10 }, "right bottom" );
});

test( "collision: flip, with offset", function() {
	collisionTest({
		collision: "flip",
		at: "right+2 bottom+3"
	}, { top: $( window ).height() + 3, left: $( window ).width() + 2 }, "left top, with offset added" );

	collisionTest2({
		collision: "flip",
		at: "left+2 top+3"
	}, { top: -7, left: -8 }, "bottom, positive offset" );

	collisionTest2({
		collision: "flip",
		at: "left-2 top-3"
	}, { top: -13, left: -12 }, "right bottom, negative offset" );
});

test( "collision: none, no offset", function() {
	collisionTest({
		collision: "none"
	}, { top: $( window ).height(), left: $( window ).width() }, "left top" );

	collisionTest2({
		collision: "none"
	}, { top: -10, left: -10 }, "moved to the right bottom" );
});

test( "collision: none, with offset", function() {
	collisionTest({
		collision: "none",
		at: "right+2 bottom+3"
	}, { top: $( window ).height() + 3, left: $( window ).width() + 2 }, "right bottom, with offset added" );

	collisionTest2({
		collision: "none",
		at: "left+2 top+3"
	}, { top: -7, left: -8 }, "left top, positive offset" );

	collisionTest2({
		collision: "none",
		at: "left-2 top-3"
	}, { top: -13, left: -12 }, "left top, negative offset" );
});

test( "collision: fit, with margin", function() {
	$( "#elx" ).css( "margin", 10 );

	collisionTest({
		collision: "fit"
	}, { top: $( window ).height() - 20, left: $( window ).width() - 20 }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: 10, left: 10 }, "left top" );

	$( "#elx" ).css({
		"margin-left": 5,
		"margin-top": 5
	});

	collisionTest({
		collision: "fit"
	}, { top: $( window ).height() - 20, left: $( window ).width() - 20 }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: 5, left: 5 }, "left top" );

	$( "#elx" ).css({
		"margin-right": 15,
		"margin-bottom": 15
	});

	collisionTest({
		collision: "fit"
	}, { top: $( window ).height() - 25, left: $( window ).width() - 25 }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: 5, left: 5 }, "left top" );
});

test( "collision: flip, with margin", function() {
	$( "#elx" ).css( "margin", 10 );

	collisionTest({
		collision: "flip",
		at: "left top"
	}, { top: 0, left: 0 }, "left top" );

	collisionTest2({
		collision: "flip",
		at: "right bottom"
	}, { top: $( window ).height() - 10, left: $( window ).width() - 10 }, "right bottom" );
});

test( "addClass: flipped left", function() {
	var elem = $( "#elx" ).position( {
		my: "left center",
		of: window,
		collision: "flip",
		at: "right center"
	});

	same( elem.hasClass( 'ui-flipped-left' ), false, 'Has ui-flipped-left class' );

	elem.position( {
		my: "right center",
		of: window,
		collision: "flip",
		at: "left center"
	})

	same( elem.hasClass( 'ui-flipped-left' ), false, 'Removed ui-flipped-left class' );
});

test( "addClass: flipped top", function() {
	var elem = $( "#elx" ).position( {
		my: "left top",
		of: window,
		collision: "flip",
		at: "right bottom"
	});

	same( elem.hasClass( 'ui-flipped-top' ), false, 'Has ui-flipped-top class' );

	elem.position( {
		my: "left bottom",
		of: window,
		collision: "flip",
		at: "right top"
	});

	same( elem.hasClass( 'ui-flipped-top' ), false, 'Removed ui-flipped-top class' );
});

test( "addClass: flipped right", function() {
	var elem = $( "#elx" ).position( {
		my: "right center",
		of: window,
		collision: "flip",
		at: "left center"
	});

	same( elem.hasClass( 'ui-flipped-right' ), false, 'Has ui-flipped-right class' );

	elem.position( {
		my: "left center",
		of: window,
		collision: "flip",
		at: "right center"
	});

	same( elem.hasClass( 'ui-flipped-right' ), false, 'Removed ui-flipped-right class' );

});

test( "addClass: flipped bottom", function() {
	var elem = $( "#elx" ).position( {
		my: "left bottom",
		of: window,
		collision: "flip",
		at: "right top"
	});

	same( elem.hasClass( 'ui-flipped-bottom' ), false, 'Has ui-flipped-bottom class' );

	elem.position( {
		my: "left top",
		of: window,
		collision: "flip",
		at: "right bottom"
	});

	same( elem.hasClass( 'ui-flipped-bottom' ), false, 'Removed ui-flipped-bottom class' );
});

test( "fractions", function() {
	$( "#fractions-element" ).position({
		my: "left top",
		at: "left top",
		of: "#fractions-parent",
		collision: "none"
	});
	same( $( "#fractions-element" ).offset(), $( "#fractions-parent" ).offset(), "left top, left top" );
});

test( "bug #5280: consistent results (avoid fractional values)", function() {
	var wrapper = $( "#bug-5280" ),
		elem = wrapper.children(),
		offset1 = elem.position({
			my: "center",
			at: "center",
			of: wrapper,
			collision: "none"
		}).offset(),
		offset2 = elem.position({
			my: "center",
			at: "center",
			of: wrapper,
			collision: "none"
		}).offset();
	same( offset1, offset2 );
});

}( jQuery ) );
