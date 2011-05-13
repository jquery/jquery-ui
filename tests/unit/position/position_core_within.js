(function( $ ) {

$("#within-container").show();

function scrollTopSupport() {
	$( window ).scrollTop( 1 );
	return $( window ).scrollTop() === 1;
}
var addTop = -20,
	addLeft = -20;
	
$.fn.addOffsets = function() {
	var elOffset = this.offset(),
		offset = $("#within-container").offset();

	elOffset.top -= offset.top;
	elOffset.left -= offset.left;
	
	return {top: elOffset.top - offset.top, left: elOffset.left - offset.left };
};

test( "within: my, at, of", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: "#parentx",
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 40, left: addLeft + 40 }, "left top, left top" );

	$( "#elx" ).position({
		my: "left top",
		at: "left bottom",
		of: "#parentx",
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 60, left: addLeft + 40 }, "left top, left bottom" );

	$( "#elx" ).position({
		my: "left",
		at: "bottom",
		of: "#parentx",
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 55, left: addLeft + 50 }, "left, bottom" );

	$( "#elx" ).position({
		my: "left foo",
		at: "bar baz",
		of: "#parentx",
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 45, left: addLeft +50 }, "left foo, bar baz" );
});

test( "within: multiple elements", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
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

test( "within: positions", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
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

test( "within: of", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
			
	
	
	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: "#parentx",
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 40, left: addLeft + 40 }, "selector" );

	$( "#elx" ).position({
		my: "left top",
		at: "left bottom",
		of: $( "#parentx"),
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 60, left: addLeft + 40 }, "jQuery object" );

	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: $( "#parentx" )[ 0 ],
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 40, left: addLeft + 40 }, "DOM element" );

	// these tests are not valid for "within" since of is not contained by within.
	/*
	$( "#elx" ).position({
		my: "right bottom",
		at: "right bottom",
		of: document,
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), {
		top: addTop + $( document ).height() - 10,
		left: addLeft + $( document ).width() - 10
	}, "document" );

	$( "#elx" ).position({
		my: "right bottom",
		at: "right bottom",
		of: $( document ),
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), {
		top: addTop + $( document ).height() - 10,
		left: addLeft + $( document ).width() - 10
	}, "document as jQuery object" );

	$( window ).scrollTop( 0 );

	$( "#elx" ).position({
		my: "right bottom",
		at: "right bottom",
		of: window,
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), {
		top: addTop + $( window ).height() - 10,
		left: addLeft + $( window ).width() - 10
	}, "window" );

	$( "#elx" ).position({
		my: "right bottom",
		at: "right bottom",
		of: $( window ),
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), {
		top: addTop + $( window ).height() - 10,
		left: addLeft + $( window ).width() - 10
	}, "window as jQuery object" );

	if ( scrollTopSupport() ) {
		$( window ).scrollTop( 500 ).scrollLeft( 200 );
		$( "#elx" ).position({
			my: "right bottom",
			at: "right bottom",
			of: window,
			collision: "none",
			within: $("#within-container")
		});
		same( $( "#elx" ).addOffsets(), {
			top: addTop + $( window ).height() + 500 - 10,
			left: addLeft + $( window ).width() + 200 - 10
		}, "window, scrolled" );
		$( window ).scrollTop( 0 ).scrollLeft( 0 );
	}*/

	var event = $.extend( $.Event( "someEvent" ), { pageX: 200, pageY: 300 } );
	$( "#elx" ).position({
		my: "left top",
		at: "left top",
		of: event,
		collision: "none",
		within: $("#within-container")
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
		within: $("#within-container")
	});
	same( $( "#elx" ).offset(), {
		top: 600,
		left: 400
	}, "event - left top, right bottom" );
});

test( "within:offsets", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	$( "#elx" ).position({
		my: "left top",
		at: "left+10 bottom+10",
		of: "#parentx",
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 70, left: addLeft + 50 }, "offsets in at" );

	$( "#elx" ).position({
		my: "left+10 top-10",
		at: "left bottom",
		of: "#parentx",
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 50, left: addLeft + 50 }, "offsets in my" );

	$( "#elx" ).position({
		my: "left top",
		at: "left+50% bottom-10%",
		of: "#parentx",
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 58, left: addLeft + 50 }, "percentage offsets in at" );

	$( "#elx" ).position({
		my: "left-30% top+50%",
		at: "left bottom",
		of: "#parentx",
		collision: "none",
		within: $("#within-container")
	});
	same( $( "#elx" ).addOffsets(), { top: addTop + 65, left: addLeft + 37 }, "percentage offsets in my" );
});

test( "within: using", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	expect( 6 );

	var count = 0,
		elems = $( "#el1, #el2" ),
		expectedPosition = { top: addTop + 40, left: addLeft + 40 },
		originalPosition = elems.position({
			my: "right bottom",
			at: "rigt bottom",
			of: "#parentx",
			collision: "none",
			within: $("#within-container")
		}).addOffsets();

	elems.position({
		my: "left top",
		at: "left top",
		of: "#parentx",
		using: function( position ) {
			position.top -= $("#within-container").offset().top;
			position.left -= $("#within-container").offset().left;
			same( this, elems[ count ], "correct context for call #" + count );
			same( position, expectedPosition, "correct position for call #" + count );
			count++;
		},
		within: $("#within-container")
	});

	elems.each(function() {
		same( $( this ).addOffsets(), originalPosition, "elements not moved" );
	});
});

function collisionTest( config, result, msg ) {
	var elem = $( "#elx" ).position( $.extend({
		my: "left top",
		at: "right bottom",
		of: $("#within-container")[0],
		within: $("#within-container")
	}, config ) );
	same( elem.addOffsets(), result, msg );
}

function collisionTest2( config, result, msg ) {
	collisionTest( $.extend({
		my: "right bottom",
		at: "left top"
	}, config ), result, msg );
}

test( "within: collision: fit, no offset", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	collisionTest({
		collision: "fit"
	}, { top: addTop + $("#within-container").height() - 10, left: addLeft + $("#within-container").width() - 10 }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: addTop + 0, left: addLeft + 0 }, "left top" );
});


test( "within: collision: fit, with offset", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	collisionTest({
		collision: "fit",
		at: "right+2 bottom+3"
	}, { top: addTop + $("#within-container").height() - 10, left: addLeft + $("#within-container").width() - 10 }, "right bottom");

	collisionTest2({
		collision: "fit",
		at: "left+2 top+3"
	}, { top: addTop + 0, left: addLeft + 0 }, "left top, positive offset" );

	collisionTest2({
		collision: "fit",
		at: "left-2 top-3"
	}, { top: addTop + 0, left: addLeft + 0 }, "left top, negative offset" );
});

test( "within: collision: fit, within scrolled", function() {
	if ( scrollTopSupport() ) {
		$("#within-container").css({"width": "1000px", "height": "800px", "top": "20px", "left": "20px", "position": "relative"});
		
			
		
		var win = $("#within-container").css("overflow", "auto");
		win.scrollTop( 300 ).scrollLeft( 150 );
		
		collisionTest({
			collision: "fit",
			at: "left-100 top-100"
		}, { top: addTop, left: addLeft }, "top left" );
		collisionTest2({
			collision: "fit",
			at: "right+100 bottom+100"
		}, { top: addTop + win.height() - 10, left: addLeft + win.width() - 10 }, "right bottom" );
		win.scrollTop( 0 ).scrollLeft( 0 );
	}
});
		
test( "within: collision: flip, no offset", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	collisionTest({
		collision: "flip"
	}, { top: addTop + -10, left: addLeft + -10 }, "left top" );

	collisionTest2({
		collision: "flip"
	}, { top: addTop + $("#within-container").height(), left: addLeft + $("#within-container").width() }, "right bottom" );
});

test( "within: collision: flip, with offset", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	collisionTest({
		collision: "flip",
		at: "right+2 bottom+3"
	}, { top: addTop + -13, left: addLeft + -12 }, "left top, with offset added" );

	collisionTest2({
		collision: "flip",
		at: "left+2 top+3"
	}, { top: addTop + $("#within-container").height() - 3, left: addLeft + $("#within-container").width() - 2 }, "bottom, positive offset" );

	collisionTest2({
		collision: "flip",
		at: "left-2 top-3"
	}, { top: addTop + $("#within-container").height() + 3, left: addLeft + $("#within-container").width() + 2 }, "right bottom, negative offset" );
});

test( "within: collision: none, no offset", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	collisionTest({
		collision: "none"
	}, { top: addTop + $("#within-container").height(), left: addLeft + $("#within-container").width() }, "left top" );

	collisionTest2({
		collision: "none"
	}, { top: addTop + -10, left: addLeft + -10 }, "moved to the right bottom" );
});

test( "within: collision: none, with offset", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	collisionTest({
		collision: "none",
		at: "right+2 bottom+3"
	}, { top: addTop + $("#within-container").height() + 3, left: addLeft + $("#within-container").width() + 2 }, "right bottom, with offset added" );

	collisionTest2({
		collision: "none",
		at: "left+2 top+3"
	}, { top: addTop + -7, left: addLeft + -8 }, "left top, positive offset" );

	collisionTest2({
		collision: "none",
		at: "left-2 top-3"
	}, { top: addTop + -13, left: addLeft + -12 }, "left top, negative offset" );
});

test( "within: collision: fit, with margin", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	$( "#elx" ).css( "margin", 10 );

	collisionTest({
		collision: "fit"
	}, { top: addTop + $("#within-container").height() - 20, left: addLeft + $("#within-container").width() - 20 }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: addTop + 10, left: addLeft + 10 }, "left top" );

	$( "#elx" ).css({
		"margin-left": 5,
		"margin-top": 5
	});

	collisionTest({
		collision: "fit"
	}, { top: addTop + $("#within-container").height() - 20, left: addLeft + $("#within-container").width() - 20 }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: addTop + 5, left: addLeft + 5 }, "left top" );

	$( "#elx" ).css({
		"margin-right": 15,
		"margin-bottom": 15
	});

	collisionTest({
		collision: "fit"
	}, { top: addTop + $("#within-container").height() - 25, left: addLeft + $("#within-container").width() - 25 }, "right bottom" );

	collisionTest2({
		collision: "fit"
	}, { top: addTop + 5, left: addLeft + 5 }, "left top" );
});

test( "within: collision: flip, with margin", function() {
	$("#within-container").css({"width": "500px", "height": "500px", "top": "20px", "left": "20px", "position": "relative"});
	
		
	
	$( "#elx" ).css( "margin", 10 );

	collisionTest({
		collision: "flip",
		at: "left top"
	}, { top: addTop + $("#within-container").height() - 10, left: addLeft + $("#within-container").width() - 10 }, "left top" );

	collisionTest2({
		collision: "flip",
		at: "right bottom"
	}, { top: addTop + 0, left: addLeft + 0 }, "right bottom" );
});

//test( "bug #5280: consistent results (avoid fractional values)", function() {
//	var wrapper = $( "#bug-5280" ),
//		elem = wrapper.children(),
//		offset1 = elem.position({
//			my: "center",
//			at: "center",
//			of: wrapper,
//			collision: "none"
//		}).offset(),
//		offset2 = elem.position({
//			my: "center",
//			at: "center",
//			of: wrapper,
//			collision: "none"
//		}).offset();
//	same( offset1, offset2 );
//});

}( jQuery ) );
