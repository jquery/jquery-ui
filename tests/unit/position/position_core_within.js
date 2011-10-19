(function( $ ) {

function scrollTopSupport() {
	$( window ).scrollTop( 1 );
	return $( window ).scrollTop() === 1;
}

module( "position - within", {
	setup: function(){
		$("#within-container").css({"width": "70px", "height": "70px", "top": "20px", "left": "20px", "position": "relative"}).show();
	}
});

var addTop = -20,
	addLeft = -20;

$.fn.addOffsets = function() {
	var elOffset = this.offset(),
		offset = $("#within-container").offset();

	elOffset.top -= offset.top;
	elOffset.left -= offset.left;

	return {top: elOffset.top - offset.top, left: elOffset.left - offset.left };
};

test( "my, at, of", function() {
	var within = $("#within-container");

	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: "#parentx",
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 40, left: addLeft + 40 }, "left top, left top" );

	$( "#elx" ).position({
		my: "left top",
		at: "left bottom",
		of: "#parentx",
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 60, left: addLeft + 40 }, "left top, left bottom" );

	$( "#elx" ).position({
		my: "left",
		at: "bottom",
		of: "#parentx",
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 55, left: addLeft + 50 }, "left, bottom" );

	$( "#elx" ).position({
		my: "left foo",
		at: "bar baz",
		of: "#parentx",
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 45, left: addLeft +50 }, "left foo, bar baz" );
});

test( "multiple elements", function() {
	var elements = $( "#el1, #el2" );
	var result = elements.position({
		my: "left top",
		at: "left bottom",
		of: "#parent",
		collision: "none",
		within: $("#within-container")
	});

	same( result, elements );
	var expected = { top: addTop + 10, left: addLeft + 4 };
	elements.each(function() {
		same( $( this ).addOffsets(), expected );
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
						top: addTop + (my ? start.top - offsets[ vertical ] : start.top + offsets[ vertical ]),
						left: addLeft + (my ? start.left - offsets[ horizontal ] : start.left + offsets[ horizontal ])
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
			collision: "none",
			within: $("#within-container")
		});
		same( el.addOffsets(), definition.result,
			"Position via " + QUnit.jsDump.parse({ my:definition.my, at:definition.at }) );
	});
});

test( "of", function() {
	var within = $("#within-container");

	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: "#parentx",
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 40, left: addLeft + 40 }, "selector" );

	$( "#elx" ).position({
		my: "left top",
		at: "left bottom",
		of: $( "#parentx"),
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 60, left: addLeft + 40 }, "jQuery object" );

	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: $( "#parentx" )[ 0 ],
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 40, left: addLeft + 40 }, "DOM element" );

	var event = $.extend( $.Event( "someEvent" ), { pageX: 200, pageY: 300 } );
	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: event,
		collision: "none",
		within: within
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
		collision: "none",
		within: within
	});
	same( $( "#elx" ).offset(), {
		top: 600,
		left: 400
	}, "event - left top, right bottom" );
});

test( "within:offsets", function() {
	var within = $("#within-container");

	$( "#elx" ).position({
		my: "left top",
		at: "left+10 bottom+10",
		of: "#parentx",
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 70, left: addLeft + 50 }, "offsets in at" );

	$( "#elx" ).position({
		my: "left+10 top-10",
		at: "left bottom",
		of: "#parentx",
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 50, left: addLeft + 50 }, "offsets in my" );

	$( "#elx" ).position({
		my: "left top",
		at: "left+50% bottom-10%",
		of: "#parentx",
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 58, left: addLeft + 50 }, "percentage offsets in at" );

	$( "#elx" ).position({
		my: "left-30% top+50%",
		at: "left bottom",
		of: "#parentx",
		collision: "none",
		within: within
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 65, left: addLeft + 37 }, "percentage offsets in my" );
});

test( "using", function() {
	expect( 6 );

	var within = $("#within-container");

	var count = 0,
		elems = $( "#el1, #el2" ),
		expectedPosition = { top: addTop + 40, left: addLeft + 40 },
		originalPosition = elems.position({
			my: "right bottom",
			at: "right bottom",
			of: "#parentx",
			collision: "none",
			within: within
		}).addOffsets();

	elems.position({
		my: "left top",
		at: "left top",
		of: "#parentx",
		using: function( position ) {
			position.top -= within.offset().top;
			position.left -= within.offset().left;
			same( this, elems[ count ], "correct context for call #" + count );
			same( position, expectedPosition, "correct position for call #" + count );
			count++;
		},
		within: within
	});

	elems.each(function() {
		same( $( this ).addOffsets(), originalPosition, "elements not moved" );
	});
});

function collisionTest( config, result, msg ) {
	var within = $("#within-container");

	var elem = $( "#elx" ).position( $.extend({
		my: "left top",
		at: "right bottom",
		of: "#parentx",
		within: within
	}, config ) );

	same( elem.addOffsets(), result, msg );
}

function collisionTest2( config, result, msg ) {
	collisionTest( $.extend({
		my: "right bottom",
		at: "left top"
	}, config ), result, msg );
}

test( "collision: fit, no offset", function() {
	var within = $("#within-container"),
		of = $("#parentx");

	collisionTest({
		collision: "fit"
	}, { top: addTop + of.position().top + of.height() - $.position.getScrollInfo( within ).height, left: addLeft + of.position().left + of.width() - $.position.getScrollInfo( within ).width }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: addTop + of.position().top - 10, left: addLeft + of.position().left - 10 }, "left top" );
});


test( "collision: fit, with offset", function() {
	var within = $("#within-container"),
		of = $("#parentx");

	collisionTest({
		collision: "fit",
		at: "right+2 bottom+3"
	}, { top: addTop + of.position().top + of.height() - $.position.getScrollInfo( within ).height, left: addLeft + of.position().left + of.width() - $.position.getScrollInfo( within ).width }, "right bottom");

	collisionTest2({
		collision: "fit",
		at: "left+2 top+3"
	}, { top: addTop + of.position().top - 7, left: addLeft + of.position().left - 8 }, "left top, positive offset" );

	collisionTest2({
		collision: "fit",
		at: "left-2 top-3"
	}, { top: addTop + of.position().top - 13, left: addLeft + of.position().left - 12 }, "left top, negative offset" );
});

test( "collision: none, within scrolled", function() {
	if ( scrollTopSupport() ) {
		var within = $("#within-container").css({"width": "1000px", "height": "800px", "overflow": "auto"}),
			of = $("#parentx");
		within.scrollTop( 300 ).scrollLeft( 150 );

		collisionTest({
			collision: "none",
			at: "left-100 top-100"
		}, { top: of.offset().top + addTop - 100 - of.height(), left: of.offset().left + addLeft - 100 - of.width() }, "top left" );
		collisionTest2({
			collision: "none",
			at: "right+100 bottom+100"
		}, { top: of.offset().top + addTop + 100 - 10, left: of.offset().left + addLeft + 100 - 10 }, "right bottom" );
		within.scrollTop( 0 ).scrollLeft( 0 );
	}
});

test( "collision: flip, no offset", function() {
	var within = $("#within-container"),
		of = $("#parentx");

	collisionTest({
		collision: "flip"
	}, { top: addTop + of.position().top + of.height(), left: addLeft + of.position().left + of.width() }, "left top" );

	collisionTest2({
		collision: "flip"
	}, { top: addTop + of.position().top - 10, left: addTop + of.position().top - 10 }, "right bottom" );
});

test( "collision: flip, with offset", function() {
	var within = $("#within-container"),
		of = $("#parentx");

	collisionTest({
		collision: "flip",
		at: "right+2 bottom+3"
	}, { top: addTop + of.position().top - 13, left: addLeft + of.position().left - 12 }, "left top, with offset added" );

	collisionTest2({
		collision: "flip",
		at: "left+2 top+3"
	}, { top: addTop + of.position().top - 10 + 3, left: addLeft + of.position().left - 10 + 2 }, "right bottom, positive offset" );

	collisionTest2({
		collision: "flip",
		at: "left-2 top-3"
	}, { top: addTop + of.position().top - 13, left: addLeft + of.position().left - 12 }, "right bottom, negative offset" );
});

test( "collision: none, no offset", function() {
	var within = $("#within-container"),
		of = $("#parentx");

	collisionTest({
		collision: "none"
	}, { top: addTop + of.position().top + of.height(), left: addLeft + of.position().left + of.width() }, "left top" );

	collisionTest2({
		collision: "none"
	}, { top: addTop + of.position().top - 10, left: addLeft + of.position().left - 10 }, "right bottom" );
});

test( "collision: none, with offset", function() {
	var within = $("#within-container"),
		of = $("#parentx");

	collisionTest({
		collision: "none",
		at: "right+2 bottom+3"
	}, { top: addTop + of.position().top + of.height() + 3, left: addLeft + of.position().left + of.width() + 2 }, "right bottom, with offset added" );

	collisionTest2({
		collision: "none",
		at: "left+2 top+3"
	}, { top: addTop + of.position().top - 7, left: addTop + of.position().top - 8 }, "left top, positive offset" );

	collisionTest2({
		collision: "none",
		at: "left-2 top-3"
	}, { top: addTop + of.position().top - 13, left: addTop + of.position().top - 12 }, "left top, negative offset" );
});

test( "collision: fit, with margin", function() {
	var within = $("#within-container"),
		of = $("#parentx");

	$( "#elx" ).css( "margin", 10 );

	collisionTest({
		collision: "fit"
	}, { top: addTop + of.position().top + of.height() - 10 - $.position.getScrollInfo( within ).height, left: addLeft + of.position().left + of.width() - 10 - $.position.getScrollInfo( within ).width }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: addTop + of.position().top - 10, left: addLeft + of.position().left - 10 }, "left top" );

	$( "#elx" ).css({
		"margin-left": 5,
		"margin-top": 5
	});

	collisionTest({
		collision: "fit"
	}, { top: addTop + of.position().top + of.height() - 10 - $.position.getScrollInfo( within ).height, left: addLeft + of.position().left + of.width() - 10 - $.position.getScrollInfo( within ).width }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: addTop + of.position().top - 10, left: addLeft + of.position().left - 10 }, "left top" );

	$( "#elx" ).css({
		"margin-right": 15,
		"margin-bottom": 15
	});

	collisionTest({
		collision: "fit"
	}, { top: addTop + of.position().top + of.height() - 15 - $.position.getScrollInfo( within ).height, left: addLeft + of.position().left + of.width() - 15 - $.position.getScrollInfo( within ).width }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: addTop + of.position().top - 10, left: addLeft + of.position().left - 10 }, "left top" );
});

test( "collision: flip, with margin", function() {
	var within = $("#within-container"),
		of = $("#parentx");

	$( "#elx" ).css( "margin", 10 );

	collisionTest({
		collision: "flip"
	}, { top: addTop + of.position().top - 10, left: addLeft + of.position().left - 10 }, "left top" );

	collisionTest2({
		collision: "flip"
	}, { top: addTop + of.position().top - 10, left: addLeft + of.position().left - 10 }, "right bottom" );

	$( "#elx" ).css( "margin", 0 );
});

test( "addClass: flipped left", function() {
	var within = $("#within-container");

	var elem = $( "#elx" ).position( {
		my: "left center",
		of: within[0],
		within: within,
		collision: "flip",
		at: "right center"
	});

	same( elem.hasClass( 'ui-flipped-left' ), false, 'Has ui-flipped-left class' );

	elem.position( {
		my: "right center",
		of: within[0],
		within: within,
		collision: "flip",
		at: "left center"
	})

	same( elem.hasClass( 'ui-flipped-left' ), false, 'Removed ui-flipped-left class' );
});

test( "addClass: flipped top", function() {
	var within = $("#within-container");

	var elem = $( "#elx" ).position( {
		my: "left top",
		of: within[0],
		within: within,
		collision: "flip",
		at: "right bottom"
	});

	same( elem.hasClass( 'ui-flipped-top' ), false, 'Has ui-flipped-top class' );

	elem.position( {
		my: "left bottom",
		of: within[0],
		within: within,
		collision: "flip",
		at: "right top"
	});

	same( elem.hasClass( 'ui-flipped-top' ), false, 'Removed ui-flipped-top class' );
});

test( "addClass: flipped right", function() {
	var within = $("#within-container");

	var elem = $( "#elx" ).position( {
		my: "right center",
		of: within[0],
		within: within,
		collision: "flip",
		at: "left center"
	});

	same( elem.hasClass( 'ui-flipped-right' ), false, 'Has ui-flipped-right class' );

	elem.position( {
		my: "left center",
		of: within[0],
		within: within,
		collision: "flip",
		at: "right center"
	});

	same( elem.hasClass( 'ui-flipped-right' ), false, 'Removed ui-flipped-right class' );

});

test( "addClass: flipped bottom", function() {
	var within = $("#within-container");

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

}( jQuery ) );
